import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
const input=process.env.MEDIA_INPUT_DIR||'/media-input',output=process.env.OUTPUT_DIR||'/evidence',results=[];
for(const kind of ['home-ink','creation-history']){
 const folder=path.join(output,kind);await fs.mkdir(folder,{recursive:true});const file=path.join(input,kind+'.gif');
 execFileSync('ffmpeg',['-v','error','-ignore_loop','1','-i',file,'-f','null','-'],{stdio:['ignore','ignore','pipe']});
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-count_frames','-show_entries','stream=width,height,r_frame_rate,nb_read_frames:format=duration,size','-of','json',file],{encoding:'utf8'}));
 execFileSync('ffmpeg',['-y','-v','error','-ignore_loop','1','-i',file,'-vf','fps=1,scale=300:-2:flags=lanczos,tile=4x5','-frames:v','1',folder+'/storyboard.png'],{stdio:['ignore','ignore','pipe']});
 const seconds=kind==='home-ink'?[0,0.5,2.5,5.5,8.5,11.5,15.5]:[0.8,2,4,6,8,10,12,14.5];
 for(const second of seconds)execFileSync('ffmpeg',['-y','-v','error','-ignore_loop','1','-i',file,'-ss',String(second),'-frames:v','1',folder+'/frame-'+second+'.png'],{stdio:['ignore','ignore','pipe']});
 const bytes=await fs.readFile(file);results.push({kind,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),wholeCycleDecoded:true,decoderExitCode:0,probe,storyboard:'One frame per second in chronological row-major4x5; blank trailing slots are not video frames.',keyFrameSeconds:seconds});
}
await fs.writeFile(output+'/media-inspection.json',JSON.stringify({capturedAt:new Date().toISOString(),scope:'Actual delivered GIF full-cycle decode and whole-duration chronological storyboard; not a claim that a human watched playback or aesthetics signed.',results},null,2));console.log(JSON.stringify(results.map(r=>({kind:r.kind,wholeCycleDecoded:r.wholeCycleDecoded,bytes:r.bytes}))));
