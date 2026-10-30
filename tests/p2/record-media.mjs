import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {start,base,origin,output,testedCommit,call,task,terminal} from './common.mjs';
import {exposedInkPaths} from './media-ink-paths.mjs';

assert(process.env.PERFORMANCE_FINISHED==='1','Record only after Leader releases completed performance window');
const destination=process.env.MEDIA_DEST_DIR||'/media-output',kind=process.env.MEDIA_KIND;
assert(['home-ink','creation-history'].includes(kind),'Choose one actual media recording');
await fs.mkdir(destination,{recursive:true});await fs.mkdir(output+'/raw',{recursive:true});
const env=await start({browser:true}),context=await env.browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'no-preference',recordVideo:{dir:output+'/raw',size:{width:1440,height:900}}}),page=await context.newPage(),actions=[];
const errors=[];page.on('pageerror',e=>errors.push(e.message.split('\n')[0]));
await page.addInitScript(()=>{
 const mount=()=>{const cursor=document.createElement('div');cursor.setAttribute('aria-hidden','true');cursor.dataset.recordingPointer='tool-only';cursor.style.cssText='position:fixed;left:0;top:0;width:18px;height:24px;z-index:2147483647;pointer-events:none;transform:translate(-50px,-50px)';cursor.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 24"><path d="M2 1L2 20L7 15L11 23L14 21L10 14L17 13Z" fill="#232734" stroke="#fff" stroke-width="1.5"/></svg>';document.body.append(cursor);window.addEventListener('pointermove',e=>cursor.style.transform=`translate(${e.clientX}px,${e.clientY}px)`,{passive:true})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
});
const startAt=Date.now();async function action(name,fn){const begin=Date.now();await fn();actions.push({name,startMs:begin-startAt,endMs:Date.now()-startAt})}
let fixtureInfo=null,inkCalibration=null;
try{
 if(kind==='home-ink'){
  await action('Load genuine homepage',()=>page.goto(base,{waitUntil:'networkidle'}));await page.locator('canvas.ink-backdrop[data-ink-ready=true]').waitFor({state:'attached'});await page.locator('.template-card').first().waitFor();
  inkCalibration=await exposedInkPaths(page);await action('Establish paper and landscape',()=>page.waitForTimeout(1200));
  const stroke=async(x1,y1,x2,y2)=>{for(let i=0;i<=60;i++){await page.mouse.move(x1+(x2-x1)*i/60,y1+(y2-y1)*i/60);await page.waitForTimeout(45)}};
  const [first,second]=inkCalibration.paths;
  await action('Real pointer stroke across first exposed high-ink path',()=>stroke(first.from.x,first.from.y,first.to.x,first.to.y));await action('Hold and observe natural fog return',()=>page.waitForTimeout(1800));
  await action('Real pointer stroke across second exposed high-ink path',()=>stroke(second.from.x,second.from.y,second.to.x,second.to.y));await page.mouse.move(1410,860);await action('Natural trailing clarity fades back to original fog',()=>page.waitForTimeout(4200));
 }else{
  await action('Open real maker as synthetic guest',()=>page.goto(base+'/templates/demo-pet',{waitUntil:'networkidle'}));await page.waitForFunction(()=>!document.querySelector('.p2-auth-entry')?.disabled);
  const template=(await call(context.request,'/api/templates/demo-pet')).json,photo=await context.request.get(base+template.coverUrl);assert(photo.ok());let asset;
  await action('Real chooser and local example upload',async()=>{const uploaded=page.waitForResponse(r=>r.url().endsWith('/api/assets')&&r.request().method()==='POST'),chooser=page.waitForEvent('filechooser');await page.locator('.upload-label').first().click();await(await chooser).setFiles({name:'synthetic-pet.jpg',mimeType:'image/jpeg',buffer:await photo.body()});asset=await(await uploaded).json();await page.locator('.upload-slot.ready').waitFor()});
  let accepted;await action('Real submit accepted202, ordinary default simulation',async()=>{const response=page.waitForResponse(r=>r.url().endsWith('/api/tasks')&&r.request().method()==='POST');await page.getByRole('button',{name:/开始制作/}).click();accepted=await(await response).json()});
  const failed=await task(context.request,asset,{failAt:'GENERATE',delay:500});fixtureInfo={firstTask:accepted.id,secondTask:failed.id,secondSimulation:{failAt:'GENERATE',delayMs:{assetCheck:500,generate:500,finalize:500}},firstSimulation:'Application default, unmodified; actual server stages visible'};
  await action('Observe actual Java task stages without fabricated client text',async()=>{await page.locator('.p12-task[data-task-id="'+accepted.id+'"] .result-button').waitFor({timeout:35000});await terminal(context.request,failed.id);await page.getByRole('button',{name:'刷新制作记录',exact:true}).click();await page.locator('.p12-task[data-task-id="'+failed.id+'"]').getByText('失败',{exact:true}).waitFor()});
  await action('Preview genuine original result then Escape',async()=>{await page.locator('.p12-task[data-task-id="'+accepted.id+'"] .result-button').click();await page.locator('dialog .preview-image').waitFor();await page.waitForTimeout(1600);await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'})});
  await action('Independent personal history preserves both outcomes',async()=>{await page.getByRole('link',{name:'我的作品',exact:true}).click();await page.getByRole('heading',{name:'我的作品',exact:true}).waitFor();await page.waitForTimeout(2800)});
 }
 assert.deepEqual(errors,[]);
 const video=page.video();await context.close();const source=await video.path(),gif=path.join(destination,kind+'.gif');
 const args=['-y','-i',source,'-filter_complex','[0:v]fps=12,scale=1200:-2:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a','-loop','0',gif];execFileSync('ffmpeg',args,{stdio:['ignore','ignore','pipe'],maxBuffer:8*1024*1024});
 const bytes=await fs.readFile(gif);assert(bytes.length<100_000_000,'GIF exceeds attachment limit');const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-count_frames','-show_entries','stream=width,height,r_frame_rate,nb_read_frames:format=duration,size','-of','json',gif],{encoding:'utf8'}));
 const report={testedCommit,capturedAt:new Date().toISOString(),kind,base,origin,browser:await env.browser.version(),node:process.version,ffmpeg:execFileSync('ffmpeg',['-version'],{encoding:'utf8'}).split('\n')[0],viewport:{width:1440,height:900},media:'No-preference, genuine foreground pointer/chooser and server. Bundled media Chromium; not performance evidence.',pointer:'Tool-only SVG cursor follows actual pointermove; no change to product fog/clear/effect/stages; no text annotation.',actions,fixtureInfo,inkCalibration,rawSource:path.basename(source),output:kind+'.gif',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),target20MB:bytes.length<=20_000_000,probe,errors,command:['ffmpeg',...args.map(a=>a===source?'<actual raw webm>':a===gif?'<assigned gif>':a)]};
 await fs.writeFile(output+'/'+kind+'-recording.json',JSON.stringify(report,null,2));console.log(JSON.stringify({kind,bytes:report.bytes,sha256:report.sha256,probe}));
}finally{await context.close().catch(()=>{});await env.close()}
