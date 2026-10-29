import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import net from 'node:net';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
const output=process.env.OUTPUT_DIR||'/evidence';
const base=process.env.BASE_URL||'http://localhost:3000';
const testedCommit=process.env.TESTED_COMMIT;
assert(testedCommit && /^[a-f0-9]{40}$/.test(testedCommit),'TESTED_COMMIT must be an exact deployed source SHA');
await fs.mkdir(output,{recursive:true});
const relay=net.createServer(client=>{const upstream=net.connect(3000,process.env.RELAY_HOST||'host.docker.internal');client.pipe(upstream);upstream.pipe(client);client.on('error',()=>upstream.destroy());upstream.on('error',()=>client.destroy());});
await new Promise(resolve=>relay.listen(3000,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium-browser',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const checks=[];
async function check(name,operation){try{const details=await operation();checks.push({name,status:'pass',details});}catch(error){checks.push({name,status:'fail',message:error.message});}}
const forbidden=/Dither Veil|Glow Cursor|Ripple Distortion|Halftone Reveal|Orbit Images|Pixel Trail|Electric Border|移动鼠标体验|悬停查看效果|点击体验动画/i;
async function inspect(page){return page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyBackground:getComputedStyle(document.body).backgroundColor,bodyText:document.body.innerText}));}
for(const scenario of [{name:'desktop',width:1440,height:1000,motion:'no-preference',touch:false},{name:'reduce',width:1440,height:1000,motion:'reduce',touch:false},{name:'mobile',width:375,height:812,motion:'no-preference',touch:true}]){
 const context=await browser.newContext({viewport:{width:scenario.width,height:scenario.height},deviceScaleFactor:1,reducedMotion:scenario.motion,hasTouch:scenario.touch,isMobile:scenario.touch});
 await context.tracing.start({screenshots:true,snapshots:true,sources:false});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  const records=[]; const original=HTMLCanvasElement.prototype.getContext;
  window.__gpuAudit={events:[],peakAllocated:0,snapshot:()=>records.map((r,i)=>({id:i+1,live:!r.gl.isContextLost(),connected:r.canvas.isConnected,width:r.canvas.width,height:r.canvas.height}))};
  HTMLCanvasElement.prototype.getContext=function(kind,...args){const gl=Reflect.apply(original,this,[kind,...args]);if(gl&&String(kind).startsWith('webgl')&&!records.some(r=>r.gl===gl)){records.push({gl,canvas:this});const active=records.filter(r=>!r.gl.isContextLost()).length;window.__gpuAudit.peakAllocated=Math.max(window.__gpuAudit.peakAllocated,active);window.__gpuAudit.events.push({event:'allocated',at:performance.now(),active});this.addEventListener('webglcontextlost',()=>window.__gpuAudit.events.push({event:'lost',at:performance.now()}));}return gl;};
 });
 await page.goto(base,{waitUntil:'networkidle'});
 await check(`${scenario.name}: catalog content`,async()=>{await page.locator('.template-card').first().waitFor();const state=await inspect(page);assert(state.scrollWidth<=state.width,`overflow ${state.scrollWidth}>${state.width}`);assert(!forbidden.test(state.bodyText),'Visible technical effect annotations');const rgb=state.bodyBackground.match(/\d+/g).slice(0,3).map(Number);assert(rgb.every(c=>c>=230),'Background is not light neutral');return state;});
 await page.screenshot({path:`${output}/${scenario.name}-catalog.png`,fullPage:true});
 await check(`${scenario.name}: category interaction`,async()=>{await page.getByRole('button',{name:'宠物',exact:true}).click();await page.waitForTimeout(400);assert.equal(await page.locator('.template-card').count(),1);await page.getByRole('button',{name:/^全部(模板)?$/}).click();await page.waitForTimeout(400);assert.equal(await page.locator('.template-card').count(),4);});
 if(scenario.name==='desktop') {
  const observedScripts=new Map(); const initialScripts=new Set(await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>new URL(r.name).pathname.endsWith('.js')).map(r=>r.name)));
  page.on('response',response=>{if(response.request().resourceType()==='script'&&!initialScripts.has(response.url()))observedScripts.set(response.url(),response.body().then(b=>({path:new URL(response.url()).pathname,gzipBytes:gzipSync(b,{level:9}).length})).catch(e=>({error:e.message})));});
  await check('desktop: creative hero and CTA interaction',async()=>{const hero=page.getByRole('region',{name:'创作引导'});await hero.scrollIntoViewIfNeeded();const box=await hero.boundingBox();await page.mouse.move(box.x+box.width*.4,box.y+box.height*.5);await page.waitForTimeout(300);await page.mouse.move(box.x+box.width*.5,box.y+box.height*.6);await page.waitForTimeout(700);await page.getByRole('link',{name:'开始创作',exact:true}).hover();await page.waitForTimeout(700);await page.getByRole('button',{name:'暂停',exact:true}).click();await page.getByRole('button',{name:'继续',exact:true}).click();return page.evaluate(()=>({gpu:window.__gpuAudit.snapshot(),owners:[...document.querySelectorAll('[data-owner]')].map(e=>e.getAttribute('data-owner'))}));});
  await check('desktop: four creative gallery subjects and GPU ownership',async()=>{const tabs=page.getByRole('tablist',{name:'作品题材'});await tabs.scrollIntoViewIfNeeded();const snapshots=[];for(const name of ['创意','旅行','人像','宠物']){await tabs.getByRole('tab',{name,exact:true}).click();const panel=page.locator('#gallery-panel');const box=await panel.boundingBox();await page.mouse.move(box.x+box.width*.35,box.y+box.height*.35);await page.waitForTimeout(350);await page.mouse.move(box.x+box.width*.65,box.y+box.height*.55);await page.waitForTimeout(750);snapshots.push({name,audit:await page.evaluate(()=>({gpu:window.__gpuAudit.snapshot(),peak:window.__gpuAudit.peakAllocated,owners:[...document.querySelectorAll('[data-owner]')].map(e=>e.getAttribute('data-owner'))}))});await page.screenshot({path:`${output}/gallery-${name}.png`});}assert(snapshots.every(s=>s.audit.peak<=1),'More than one allocated live WebGL context observed');assert(snapshots.some(s=>s.audit.gpu.length>0),'No actual WebGL component mounted during interactions');await fs.writeFile(`${output}/creative-gpu.json`,JSON.stringify(snapshots,null,2));return snapshots;});
  await check('desktop: live static switch and refresh persistence',async()=>{await page.getByRole('button',{name:'动态效果',exact:true}).click();await page.getByRole('button',{name:'静态模式',exact:true}).waitFor();await page.waitForTimeout(250);const live=await page.evaluate(()=>window.__gpuAudit.snapshot().filter(g=>g.live));assert.equal(live.length,0,'Static mode left allocated live GPU');await page.reload({waitUntil:'networkidle'});await page.getByRole('button',{name:'静态模式',exact:true}).waitFor();await page.getByRole('button',{name:'静态模式',exact:true}).click();});
  const lazyScripts=await Promise.all([...observedScripts.values()]);await fs.writeFile(`${output}/lazy-scripts.json`,JSON.stringify({scope:'Scripts requested after first catalog load during all creative interactions, including route-independent shared lazy code; compare actual build inventory for complete budget',scripts:lazyScripts,totalGzipBytes:lazyScripts.reduce((n,r)=>n+(r.gzipBytes||0),0)},null,2));
 }
 await check(`${scenario.name}: identity dialog Escape and focus`,async()=>{const trigger=page.getByRole('button',{name:/创作者|当前身份|个人身份/}).first();await trigger.focus();await trigger.click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden',timeout:2000});assert(await trigger.evaluate(el=>el===document.activeElement),'Dialog did not return focus');});
 await check(`${scenario.name}: studio fields and overflow`,async()=>{await page.goto(`${base}/templates/demo-pet`,{waitUntil:'networkidle'});await page.locator('input[type=file]').first().waitFor({state:'attached'});const state=await inspect(page);assert(state.scrollWidth<=state.width,`studio overflow ${state.scrollWidth}>${state.width}`);assert(!forbidden.test(state.bodyText));await page.screenshot({path:`${output}/${scenario.name}-studio.png`,fullPage:true});});
 if(scenario.name==='desktop') await check('desktop: multiple tasks, request error recovery, true failure and refresh',async()=>{
  const templateResponse=await context.request.get(`${base}/api/templates/demo-pet`);assert(templateResponse.ok());const template=await templateResponse.json();
  const photo=await context.request.get(base+template.coverUrl);assert(photo.ok());const mime=photo.headers()['content-type'].split(';')[0];
  const uploaded=page.waitForResponse(r=>r.url().endsWith('/api/assets')&&r.request().method()==='POST');
  await page.locator('input[type=file]').first().setInputFiles({name:mime==='image/jpeg'?'fixture.jpg':'fixture.png',mimeType:mime,buffer:await photo.body()});const assetResponse=await uploaded;assert(assetResponse.ok());const asset=await assetResponse.json();
  const submit=page.getByRole('button',{name:/开始制作/});await submit.waitFor();await page.waitForFunction(()=>!document.querySelector('.maker-action button')?.disabled);
  const firstResponse=page.waitForResponse(r=>r.url().endsWith('/api/tasks')&&r.request().method()==='POST');await submit.click();const first=await (await firstResponse).json();assert(first.id);
  const pattern=`**/api/tasks/${first.id}`;let injected=0;await page.route(pattern,route=>{injected++;return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'temporary query outage fixture'})});});
  await page.waitForFunction(()=>!document.querySelector('.maker-action button')?.disabled);const secondResponse=page.waitForResponse(r=>r.url().endsWith('/api/tasks')&&r.request().method()==='POST');await submit.click();const second=await (await secondResponse).json();assert(second.id&&second.id!==first.id);
  const firstCard=page.locator('.task-card').filter({has:page.getByText(`任务 ${first.id.slice(0,8)}`,{exact:true})});await firstCard.getByText(/查询暂时异常/).waitFor({timeout:8000});assert(injected>0);assert.equal(await firstCard.getByText('失败',{exact:true}).count(),0,'Request outage changed task status to FAILED');
  await page.unroute(pattern);await firstCard.getByRole('button',{name:'恢复查询'}).click();
  const failedResponse=await context.request.post(`${base}/api/tasks`,{headers:{Origin:'http://localhost:3000'},data:{templateId:template.id,assetIds:[asset.id],simulation:{failAt:'GENERATE',delayMs:{assetCheck:50,generate:50,finalize:50}}}});assert.equal(failedResponse.status(),202);const failed=await failedResponse.json();
  await page.reload({waitUntil:'networkidle'});await page.locator('.task-card').filter({has:page.getByText(`任务 ${first.id.slice(0,8)}`,{exact:true})}).waitFor();
  const requests=[];page.on('request',r=>{if(/\/api\/tasks\/[^?]+$/.test(r.url()))requests.push(r.url());});
  const poll=async id=>{for(let i=0;i<120;i++){const r=await context.request.get(`${base}/api/tasks/${id}`);const t=await r.json();if(['SUCCEEDED','FAILED'].includes(t.status))return t;await new Promise(resolve=>setTimeout(resolve,300));}throw Error('Task did not finish');};
  const outcomes=await Promise.all([poll(first.id),poll(second.id),poll(failed.id)]);assert.deepEqual(outcomes.map(t=>t.status),['SUCCEEDED','SUCCEEDED','FAILED']);assert.equal(outcomes[2].failedStage,'GENERATE');
  const failedCard=page.locator('.task-card').filter({has:page.getByText(`任务 ${failed.id.slice(0,8)}`,{exact:true})});await failedCard.getByText('失败',{exact:true}).waitFor({timeout:6000});await failedCard.getByText(/失败阶段/).waitFor();
  await page.getByRole('button',{name:/预览/}).first().click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
  await page.waitForTimeout(2500);const before=requests.length;await page.waitForTimeout(2500);assert.equal(requests.length,before,'Completed tasks kept polling');
  await page.screenshot({path:`${output}/desktop-task-results.png`,fullPage:true});return {taskIds:[first.id,second.id,failed.id],outcomes:outcomes.map(t=>({id:t.id,status:t.status,stage:t.stage,failedStage:t.failedStage})),injectedQueryFailures:injected,stoppedTaskPollCount:before};
 });
 await check(`${scenario.name}: history and unknown template`,async()=>{await page.goto(`${base}/history`,{waitUntil:'networkidle'});assert((await inspect(page)).scrollWidth<=scenario.width);await page.goto(`${base}/templates/not-a-template`,{waitUntil:'networkidle'});await page.getByRole('heading',{name:'这个模板不存在'}).waitFor();});
 await check(`${scenario.name}: runtime errors`,async()=>assert.deepEqual(errors,[]));
 await context.tracing.stop({path:`${output}/${scenario.name}-trace.zip`});
 await context.close();
}
await fs.writeFile(`${output}/acceptance.json`,JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),browser:await browser.version(),checks,scope:'Initial independent light/layout/keyboard/content checks; not a complete comfort or creativity signoff',missing:['actual interaction performance/trace','background/offscreen/context-lost cleanup','upgrade/rollback evidence']},null,2));
await browser.close();relay.close();
console.log(JSON.stringify({pass:checks.filter(x=>x.status==='pass').length,fail:checks.filter(x=>x.status==='fail').length},null,2));
if(checks.some(x=>x.status==='fail'))process.exitCode=1;
