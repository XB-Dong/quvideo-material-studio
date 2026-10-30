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
let fixtureInfo=null,inkCalibration=null,inkRecovery=null;
async function canvasSamples(){return page.evaluate(paths=>{const c=document.querySelector('canvas.ink-backdrop'),ctx=c.getContext('2d');return {at:performance.now(),hasFocus:document.hasFocus(),hidden:document.hidden,pointer:document.querySelector('[data-recording-pointer]')?.style.transform,areas:paths.map(p=>{const data=Array.from(ctx.getImageData(p.center.x-35,p.center.y-35,70,70).data);let e=0;for(let i=4;i<data.length;i+=4)e+=Math.abs(data[i]-data[i-4]);return {edgeEnergy:e/(data.length/4),pixels:data}})}},inkCalibration.paths)}
function compareSamples(before,after){return after.areas.map((a,i)=>{const old=before.areas[i],diff=a.pixels.map((v,j)=>Math.abs(v-old.pixels[j]));return {area:i+1,initialEdge:old.edgeEnergy,currentEdge:a.edgeEnergy,mae:diff.reduce((n,v)=>n+v,0)/diff.length,maxDiff:Math.max(...diff)}})}
function withoutPixels(s){return {...s,areas:s.areas.map(a=>({edgeEnergy:a.edgeEnergy,pixelSha256:createHash('sha256').update(Buffer.from(a.pixels)).digest('hex')}))}}
try{
 if(kind==='home-ink'){
  await action('Load genuine homepage',()=>page.goto(base,{waitUntil:'networkidle'}));await page.locator('canvas.ink-backdrop[data-ink-ready=true]').waitFor({state:'attached'});await page.locator('.template-card').first().waitFor();
  inkCalibration=await exposedInkPaths(page);const initial=await canvasSamples();await action('Establish paper and landscape',()=>page.waitForTimeout(1200));
  const stroke=async(x1,y1,x2,y2)=>{for(let i=0;i<=60;i++){await page.mouse.move(x1+(x2-x1)*i/60,y1+(y2-y1)*i/60);await page.waitForTimeout(45)}};
  const [first,second]=inkCalibration.paths;
  await action('Real pointer stroke across first exposed high-ink path',()=>stroke(first.from.x,first.from.y,first.to.x,first.to.y));await action('Hold and observe natural fog return',()=>page.waitForTimeout(1800));
  await action('Real pointer stroke across second exposed high-ink path',()=>stroke(second.from.x,second.from.y,second.to.x,second.to.y));const clear=await canvasSamples();await page.mouse.move(10,10);await action('Natural tail6000ms, cursor at excluded header10,10',()=>page.waitForTimeout(6000));
  const beforeRender=await canvasSamples();await action('One ordinary viewport render opportunity, animations allow',()=>page.screenshot({path:output+'/native-tail-render.png',fullPage:false,animations:'allow'}));await action('Actual video capture flush1500ms with no input',()=>page.waitForTimeout(1500));const after=await canvasSamples();
  inkRecovery={initial:withoutPixels(initial),clear:withoutPixels(clear),beforeRender:withoutPixels(beforeRender),after:withoutPixels(after),clearVsInitial:compareSamples(initial,clear),beforeRenderVsInitial:compareSamples(initial,beforeRender),afterVsInitial:compareSamples(initial,after),mediaHeaded:process.env.MEDIA_HEADED==='1',tailMs:6000,flushMs:1500,renderOpportunities:1};await fs.writeFile(output+'/ink-recovery.json',JSON.stringify(inkRecovery,null,2));assert(inkRecovery.afterVsInitial.every(a=>a.maxDiff===0),'Actual ink canvas did not return to exact original fog pixels');
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
 const report={testedCommit,capturedAt:new Date().toISOString(),kind,base,origin,browser:await env.browser.version(),node:process.version,ffmpeg:execFileSync('ffmpeg',['-version'],{encoding:'utf8'}).split('\n')[0],viewport:{width:1440,height:900},media:'No-preference, genuine foreground pointer/chooser and server. Bundled media Chromium; headed only when MEDIA_HEADED=1 under Xvfb; not performance evidence.',pointer:'Tool-only SVG cursor follows actual pointermove; no change to product fog/clear/effect/stages; no text annotation.',actions,fixtureInfo,inkCalibration,inkRecovery,rawSource:path.basename(source),output:kind+'.gif',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),target20MB:bytes.length<=20_000_000,probe,errors,command:['ffmpeg',...args.map(a=>a===source?'<actual raw webm>':a===gif?'<assigned gif>':a)]};
 report.toolImage=process.env.MEDIA_TOOL_IMAGE||null;report.recorderSha256=createHash('sha256').update(await fs.readFile(new URL(import.meta.url))).digest('hex');report.calibrationSha256=createHash('sha256').update(await fs.readFile(new URL('./media-ink-paths.mjs',import.meta.url))).digest('hex');
 await fs.writeFile(output+'/'+kind+'-recording.json',JSON.stringify(report,null,2));console.log(JSON.stringify({kind,bytes:report.bytes,sha256:report.sha256,probe}));
}catch(e){await fs.writeFile(output+'/'+kind+'-failure.json',JSON.stringify({testedCommit,kind,capturedAt:new Date().toISOString(),error:e.message.split('\n')[0],actions,inkCalibration,scope:'Actual failed media attempt preserved, no product correction or effect manipulation'},null,2));throw e}finally{await context.close().catch(()=>{});await env.close()}
