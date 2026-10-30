import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=process.env.MEDIA_RAW_DIR||'/raw',gif=process.env.MEDIA_GIF||'/media/home-ink.gif',output=process.env.OUTPUT_DIR||'/evidence';await fs.mkdir(output,{recursive:true});
const recording=JSON.parse(await fs.readFile(path.join(root,'home-ink-recording.json'),'utf8')),source=path.join(root,'raw',recording.rawSource),size=58;
const probe=file=>JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration:stream=width,height','-of','json',file],{encoding:'utf8'}));
const trim=Number(process.env.MEDIA_TRIM_SECONDS||3);
function pixels(file,time,x,y){return execFileSync('ffmpeg',['-v','error','-i',file,'-ss',String(time),'-frames:v','1','-vf',`scale=1200:750:flags=lanczos,crop=${size}:${size}:${x}:${y}`,'-pix_fmt','rgb24','-f','rawvideo','pipe:1'])}
function energy(p){let total=0;const lum=i=>(p[i]+p[i+1]+p[i+2])/3;for(let y=1;y<size-1;y++)for(let x=1;x<size-1;x++){const i=(y*size+x)*3;total+=Math.abs(4*lum(i)-lum(i-3)-lum(i+3)-lum(i-size*3)-lum(i+size*3))}return total/((size-2)**2)}
const mae=(a,b)=>a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0)/a.length;
const results=[];
for(const [index,selected] of recording.inkCalibration.paths.entries()){
 const x=Math.round(selected.center.x*1200/1440-size/2),y=Math.round(selected.center.y*750/900-size/2),peak=index===0?5.5:11.5;
 for(const [kind,file] of [['webm',source],['gif',gif]]){
  const duration=Number(probe(file).format.duration),times=[kind==='webm'?trim:0,kind==='webm'?peak:peak-trim,...[3,2,1,.5,.3].map(offset=>Number((duration-offset).toFixed(3)))];
  const samples=times.map(time=>({time,pixels:pixels(file,time,x,y)}));const before=samples[0].pixels,clear=samples[1].pixels;
  for(const sample of samples){if(sample.pixels.length!==size*size*3)throw Error(`No complete ${kind} frame at ${sample.time}`);const name=`area${index+1}-${kind}-${sample.time}.png`;execFileSync('ffmpeg',['-y','-v','error','-i',file,'-ss',String(sample.time),'-frames:v','1','-vf',`scale=1200:750:flags=lanczos,crop=${size}:${size}:${x}:${y},scale=348:348:flags=neighbor`,path.join(output,name)],{stdio:['ignore','ignore','pipe']});}
  results.push({area:index+1,kind,sourceCenter:selected.center,crop:{x,y,width:size,height:size},samples:samples.map(s=>({time:s.time,edgeEnergy:energy(s.pixels),meanAbsoluteDiffFromInitialFog:mae(s.pixels,before),meanAbsoluteDiffFromSelectedClear:mae(s.pixels,clear)}))});
 }
}
await fs.writeFile(output+'/tail-diagnosis.json',JSON.stringify({capturedAt:new Date().toISOString(),sourceCommit:recording.testedCommit,scope:'Read-only same-coordinate decoded WebM/GIF patches; original files and application untouched, no new recording. Areas from actual calibration; encoder timing lead not assumed measured.',webm:probe(source),gif:probe(gif),originalActions:recording.actions,trimInSeconds:trim,results},null,2));console.log(JSON.stringify(results));
