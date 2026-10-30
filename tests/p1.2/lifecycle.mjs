import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {start,base,output,testedCommit,audit} from './common.mjs';
import {seed} from './fixtures.mjs';
import {ioAudit,state} from './lifecycle-observer.mjs';

export async function lifecycle(browser,base,output,testedCommit){
 const c=await browser.newContext({viewport:{width:1440,height:700},deviceScaleFactor:1}),p=await c.newPage(),checks=[],snapshots=[];
 await p.addInitScript(audit,{traceRaf:true});await p.addInitScript(ioAudit);
 const sample=await seed(c,base,{count:6,delay:50});
 const foreground={before:await p.evaluate(()=>({hidden:document.hidden,hasFocus:document.hasFocus()}))};
 await p.bringToFront();foreground.after=await p.evaluate(()=>({hidden:document.hidden,hasFocus:document.hasFocus()}));
 const simulation={delayMs:{assetCheck:4000,generate:10000,finalize:2000}};
 async function save(){await fs.writeFile(output+'/lifecycle.json',JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),foreground,simulation,fixtureTimeline:sample.timeline,checks,snapshots,scope:'Pixel functionality only: each geometric transition gets exactly one ordinary viewport render. Actual product observer events required within500ms after render, then original zero-running-infinite-animation assertion. Timer polling does not request supplemental RAF frames. No performance sampling, visibility override, repeated screenshots, cancellation or terminal-state substitution.'},null,2))}
 async function check(name,fn){try{checks.push({name,status:'pass',details:await fn()})}catch(e){checks.push({name,status:'fail',message:e.message})}await save()}
 const infinity=s=>s.animations.filter(a=>a.iterations==='infinite');
 function unprotected(s,kind){assert(!s.hidden&&s.hasFocus&&!s.reduce&&s.dialogs===0,'Unexpected hidden/reduce/dialog/focus protection confounds offscreen check');if(kind==='slot')assert(s.focusWithin,'Upload lost focus');else assert.equal(s.emphasis,'true','Task is no longer the emphasized active task')}
 async function renderAndRequire(target,kind,id,start,intersecting,label,details){
  const renderBegin=await p.evaluate(()=>performance.now());
  await p.screenshot({path:output+'/'+label+'.png',fullPage:false,animations:'allow'});
  const renderEnd=await p.evaluate(()=>performance.now());
  let eventError=null;
  try{await p.waitForFunction(({kind,id,start,intersecting})=>window.__ioAudit().some(e=>e.sequence>start&&e.isIntersecting===intersecting&&(kind==='slot'?e.classes?.split(/\s+/).includes('p12-upload'):e.taskId===id)),{kind,id,start,intersecting},{timeout:500,polling:25})}catch{eventError='Trigger prerequisite failed: no new native product IntersectionObserver '+intersecting+' event within500ms after one viewport render'}
  const actual=await state(target);details[label]={renderBegin,renderEnd,renderDuration:renderEnd-renderBegin,eventError,actual};await save();
  assert(!eventError,eventError);unprotected(actual,kind);return actual;
 }
 async function exercise(kind,target,id){
  const details={kind,id};snapshots.push(details);
  details.before=await state(target);await save();unprotected(details.before,kind);
  assert(infinity(details.before).some(a=>a.state==='running'),'Target has no real continuous effect');
  const start=details.before.io.at(-1)?.sequence||0;
  await p.setViewportSize({width:1440,height:300});await p.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
  await p.waitForTimeout(kind==='slot'?200:250);details.originalCheckpoint=await state(target);await save();
  assert(details.originalCheckpoint.rect.bottom<=0,'Target did not actually leave viewport');
  const hidden=await renderAndRequire(target,kind,id,start,false,kind+'-offscreen',details);
  assert(hidden.rect.bottom<=0,'Viewport capture moved target back into view');assert(hidden.dataOffscreen,'Native false event did not set product offscreen attribute');
  assert(infinity(hidden).length>0,'Continuous effect disappeared instead of being paused');
  assert(!infinity(hidden).some(a=>a.state==='running'),'Offscreen target still animates after genuine IO delivery');
  assert(infinity(hidden).every(a=>a.cssPlayState==='paused'),'Offscreen CSS animation is not paused');
  if(kind==='task'){const server=await(await c.request.get(base+'/api/tasks/'+id)).json();details.server={status:server.status,stage:server.stage,version:server.version};await save();assert(['RUNNING','QUEUED'].includes(server.status),'Task naturally ended before pause assertion');}
  const restoreStart=hidden.io.at(-1)?.sequence||0;await target.scrollIntoViewIfNeeded();
  const restored=await renderAndRequire(target,kind,id,restoreStart,true,kind+'-restored',details);
  assert(restored.rect.bottom>0&&restored.rect.top<restored.viewport.h,'Restore did not return target to viewport');assert(!restored.dataOffscreen,'Restore kept stale offscreen state');
  assert(infinity(restored).some(a=>a.state==='running'),'Restored effect did not resume');return details;
 }
 await check('focused upload edge pauses offscreen and resumes without blur',async()=>{await p.goto(base+'/templates/demo-pet',{waitUntil:'networkidle'});await p.locator('input[type=file]').first().focus();await p.waitForTimeout(100);return exercise('slot',p.locator('.p12-upload').first(),null)});
 await check('active task pauses offscreen while backend continues, then restores',async()=>{
  const response=await c.request.post(base+'/api/tasks',{headers:{Origin:base},data:{templateId:sample.template.id,assetIds:[sample.asset.id],simulation}});assert.equal(response.status(),202);const active=await response.json();
  await p.setViewportSize({width:1440,height:600});await p.goto(base+'/history',{waitUntil:'networkidle'});const task=p.locator('.p12-task[data-task-id="'+active.id+'"]');await task.waitFor();await task.scrollIntoViewIfNeeded();const details=await exercise('task',task,active.id);assert(details.server.version>=active.version,'Backend task record regressed');return details;
 });
 await save();await c.close();return checks;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const {browser,relay}=await start();const checks=await lifecycle(browser,base,output,testedCommit);await browser.close();relay.close();console.log(JSON.stringify(checks.map(({name,status,message})=>({name,status,message}))));if(checks.some(c=>c.status==='fail'))process.exitCode=1;}
