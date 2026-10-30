import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {start,base,output,testedCommit} from './common.mjs';
import {seed} from './fixtures.mjs';

export function ioAudit(){
 const Native=window.IntersectionObserver;let observerId=0,sequence=0;const events=[];
 window.__ioAudit=()=>events.slice();
 window.IntersectionObserver=class extends Native{
  constructor(callback,options){const id=++observerId;super((entries,observer)=>{
   for(const e of entries){const t=e.target;events.push({sequence:++sequence,observerId:id,at:performance.now(),entryTime:e.time,isIntersecting:e.isIntersecting,ratio:e.intersectionRatio,tag:t.tagName,classes:t.getAttribute('class'),taskId:t.getAttribute('data-task-id'),offscreen:t.hasAttribute('data-p12-offscreen'),rect:e.boundingClientRect.toJSON(),intersection:e.intersectionRect.toJSON(),root:e.rootBounds?.toJSON()});}
   callback(entries,observer);
  },options)}
 };
}
export async function state(locator){return locator.evaluate(async el=>{const animations=el.getAnimations({subtree:true});window.__animationReadiness??=new WeakMap();for(const a of animations)if(!window.__animationReadiness.has(a)){const value={state:'pending'};window.__animationReadiness.set(a,value);a.ready.then(()=>value.state='resolved',()=>value.state='rejected')}await Promise.resolve();return {at:performance.now(),rect:el.getBoundingClientRect().toJSON(),classes:el.getAttribute('class'),dataOffscreen:el.hasAttribute('data-p12-offscreen'),hidden:document.hidden,hasFocus:document.hasFocus(),visibility:document.visibilityState,viewport:{w:innerWidth,h:innerHeight,scrollY},focus:{tag:document.activeElement?.tagName,classes:document.activeElement?.getAttribute('class')},animations:animations.map(a=>({name:a.animationName,state:a.playState,pending:a.pending,currentTime:a.currentTime,ready:window.__animationReadiness.get(a).state,iterations:a.effect?.getTiming().iterations===Infinity?'infinite':a.effect?.getTiming().iterations,target:a.effect?.target?.getAttribute?.('class'),cssPlayState:a.effect?.target?getComputedStyle(a.effect.target).animationPlayState:null})),io:window.__ioAudit()}})}
const {browser,relay}=await start(),context=await browser.newContext({viewport:{width:1440,height:700}}),page=await context.newPage();
await page.addInitScript(ioAudit);const sample=await seed(context,base,{count:6,delay:50}),results=[];
const foreground={before:await page.evaluate(()=>({hidden:document.hidden,hasFocus:document.hasFocus()}))};await page.bringToFront();foreground.after=await page.evaluate(()=>({hidden:document.hidden,hasFocus:document.hasFocus()}));
async function inspect(kind,path,selector){
 await page.setViewportSize({width:1440,height:kind==='slot'?700:600});await page.goto(base+path,{waitUntil:'networkidle'});
 const target=page.locator(selector).first();await target.waitFor();
 if(kind==='slot')await page.locator('input[type=file]').first().focus();else await target.scrollIntoViewIfNeeded();
 await page.waitForTimeout(100);const before=await state(target),start=before.io.at(-1)?.sequence||0;
 await page.setViewportSize({width:1440,height:300});await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
 await page.waitForTimeout(kind==='slot'?200:250);const originalCheckpoint=await state(target);
 assert(originalCheckpoint.rect.bottom<=0,'Target geometry is not offscreen');
 // Exactly one normal viewport render; no locator/full-page capture or animation overrides.
 await page.screenshot({path:output+'/'+kind+'-offscreen.png',fullPage:false});
 let eventDelivered=true;
 try{await page.waitForFunction(({kind,start,id})=>window.__ioAudit().some(e=>e.sequence>start&&!e.isIntersecting&&(kind==='slot'?e.classes?.includes('p12-upload'):e.taskId===id)),{kind,start,id:kind==='task'?selector.match(/data-task-id="([^"]+)"/)[1]:null},{timeout:500})}catch{eventDelivered=false}
 const afterOneViewport=await state(target),restoreStart=afterOneViewport.io.at(-1)?.sequence||0;
 await target.scrollIntoViewIfNeeded();await page.screenshot({path:output+'/'+kind+'-restored.png',fullPage:false});
 let restoredEvent=true;try{await page.waitForFunction(({kind,start,id})=>window.__ioAudit().some(e=>e.sequence>start&&e.isIntersecting&&(kind==='slot'?e.classes?.includes('p12-upload'):e.taskId===id)),{kind,start:restoreStart,id:kind==='task'?selector.match(/data-task-id="([^"]+)"/)[1]:null},{timeout:500})}catch{restoredEvent=false}
 const restored=await state(target),result={kind,before,originalCheckpoint,eventDelivered,afterOneViewport,restoredEvent,restored};results.push(result);
 await fs.writeFile(output+'/lifecycle-diagnosis.json',JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),foreground,scope:'Diagnostic only: read-only native IntersectionObserver callback audit; each transition permits exactly one ordinary viewport screenshot after geometric trigger, no visibility/value spoofing or repeated screenshots.',results},null,2));
 console.log(JSON.stringify({kind,eventDelivered,originalOffscreen:originalCheckpoint.dataOffscreen,originalRunning:originalCheckpoint.animations.filter(a=>a.iterations==='infinite'&&a.state==='running').map(a=>a.name),afterOffscreen:afterOneViewport.dataOffscreen,afterRunning:afterOneViewport.animations.filter(a=>a.iterations==='infinite'&&a.state==='running').map(a=>a.name),restoredEvent}));
}
try{
 await inspect('slot','/templates/demo-pet','.p12-upload');
 const response=await context.request.post(base+'/api/tasks',{headers:{Origin:base},data:{templateId:sample.template.id,assetIds:[sample.asset.id],simulation:{delayMs:{assetCheck:2000,generate:5000,finalize:1000}}}});assert.equal(response.status(),202);const active=await response.json();
 await inspect('task','/history','.p12-task[data-task-id="'+active.id+'"]');
}finally{await context.close();await browser.close();relay.close()}
