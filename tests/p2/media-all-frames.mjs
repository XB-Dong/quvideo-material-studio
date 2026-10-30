import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const input=process.env.MEDIA_INPUT_DIR||'/media-input',output=process.env.OUTPUT_DIR||'/evidence',index={capturedAt:new Date().toISOString(),scope:'Every actual delivered GIF frame in chronological6x6 boards; external audit only, no GIF modification. Full-frame sequence inspection is not native realtime playback or hardware smoothness validation.',framesPerBoard:36,thumbnail:{width:240,height:150},results:[]};
await fs.mkdir(output,{recursive:true});
for(const kind of ['home-ink','creation-history']){
 const file=path.join(input,kind+'.gif'),folder=path.join(output,kind);await fs.mkdir(folder,{recursive:true});
 execFileSync('ffmpeg',['-v','error','-ignore_loop','1','-i',file,'-f','null','-'],{stdio:['ignore','ignore','pipe']});
 const frames=JSON.parse(execFileSync('ffprobe',['-v','error','-ignore_loop','1','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time,pkt_duration_time','-of','json',file],{encoding:'utf8'})).frames;
 const filter="scale=240:150:flags=lanczos,drawtext=text='f%{n} t%{pts\\:hms}':x=3:y=3:fontsize=12:fontcolor=black:box=1:boxcolor=white@0.9,tile=6x6:nb_frames=36:padding=2:margin=2:color=white";
 execFileSync('ffmpeg',['-y','-v','error','-ignore_loop','1','-i',file,'-vf',filter,'-fps_mode','passthrough',folder+'/board-%02d.png'],{stdio:['ignore','ignore','pipe']});
 const files=(await fs.readdir(folder)).filter(n=>/^board-\d+\.png$/.test(n)).sort();
 if(files.length!==Math.ceil(frames.length/36))throw Error('Unexpected board count; full frame coverage cannot be claimed');
 const boards=files.map((name,i)=>{const first=i*36,last=Math.min(frames.length-1,first+35);return {path:kind+'/'+name,firstFrame:first,lastFrame:last,actualFrames:last-first+1,firstTimeSeconds:Number(frames[first].best_effort_timestamp_time),lastTimeSeconds:Number(frames[last].best_effort_timestamp_time),blankTrailingSlots:36-(last-first+1),layout:'Row major, left-to-right/top-to-bottom; fN label uses original sequential frame index; t is actual GIF presentation timestamp'}});
 const bytes=await fs.readFile(file);index.results.push({kind,gifSha256:createHash('sha256').update(bytes).digest('hex'),fullDecodeExitCode:0,totalFrames:frames.length,boardCount:boards.length,coveredFrames:boards.reduce((n,b)=>n+b.actualFrames,0),boards,frames:frames.map((f,i)=>({frame:i,timeSeconds:Number(f.best_effort_timestamp_time),durationSeconds:Number(f.pkt_duration_time)}))});
}
await fs.writeFile(output+'/all-frames-index.json',JSON.stringify(index,null,2));console.log(JSON.stringify(index.results.map(({kind,totalFrames,boardCount,coveredFrames})=>({kind,totalFrames,boardCount,coveredFrames}))));
