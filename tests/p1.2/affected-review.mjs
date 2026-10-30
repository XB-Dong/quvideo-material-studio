import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {start,base,output,testedCommit} from './common.mjs';
import {gestureAudit,fixture,loaded,ready} from './gestures.mjs';

// Deliberately separate from performance: screenshots and paused real WAAPI phases.
const {browser,relay}=await start();
const c=await browser.newContext({viewport:{width:1440,height:1000}}),p=await c.newPage(),errors=[];
p.on('pageerror',e=>errors.push(e.message));
let release;const gate=new Promise(r=>release=r);let held=0;
await p.route('**/api/templates/demo-pet',async route=>{held++;await gate;await route.continue()});
await p.goto(base+'/templates/demo-pet',{waitUntil:'domcontentloaded'});
await p.locator('.p12-boundary[aria-busy=true]').waitFor();
await p.waitForFunction(()=>getComputedStyle(document.body).margin==='0px');
await p.evaluate(()=>document.fonts.ready);
await p.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.animationName==='p12-page-in').map(a=>a.finished.catch(()=>{}))));
const pending=await p.locator('main').boundingBox();
await p.screenshot({path:output+'/studio-pending.png',fullPage:true});
release();
await p.locator('input[type=file]').waitFor({state:'attached'});await loaded(p.locator('img[data-public-cover=demo-pet]'));
await p.unroute('**/api/templates/demo-pet');
const readyBox=await p.locator('main').boundingBox();
await p.screenshot({path:output+'/studio-ready.png',fullPage:true});
assert.equal(held,1);assert.equal(pending.y,readyBox.y,'Loading boundary moved the main origin');

await p.goto(base,{waitUntil:'networkidle'});
await p.evaluate(()=>{const animate=Element.prototype.animate;Element.prototype.animate=function(...args){const a=animate.apply(this,args);if(this.matches('img.p12-cover-bridge')){window.__reviewBridge=a;window.__reviewFrames=a.effect.getKeyframes();a.pause()}return a}});
await p.locator('a.template-card[href="/templates/demo-pet"]').click();
await p.waitForFunction(()=>!!window.__reviewBridge);
const phases=[];
for(const time of [70,150,230]){
 await p.evaluate(t=>window.__reviewBridge.currentTime=t,time);
 await p.screenshot({path:output+`/bridge-${time}ms.png`});
 phases.push(await p.evaluate(()=>{const a=window.__reviewBridge,e=a.effect.target,r=e.getBoundingClientRect();return {currentTime:a.currentTime,timing:a.effect.getTiming(),src:e.getAttribute('src'),rect:{x:r.x,y:r.y,w:r.width,h:r.height},objectFit:getComputedStyle(e).objectFit}}));
}
assert(phases.every(v=>v.timing.duration===260&&v.objectFit==='cover'&&/\/media\/demo\//.test(v.src)));
await p.evaluate(async()=>{const a=window.__reviewBridge;a.play();await a.finished.catch(()=>{})});
await p.waitForFunction(()=>document.querySelectorAll('.p12-cover-bridge').length===0);
const frames=await p.evaluate(()=>window.__reviewFrames);
assert.deepEqual(errors,[]);
await c.close();

const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),m=await mobile.newPage();
await m.addInitScript(gestureAudit);await m.goto(base+'/templates/demo-pet',{waitUntil:'networkidle'});
const media=await m.evaluate(()=>({coarse:matchMedia('(pointer:coarse)').matches,fine:matchMedia('(pointer:fine)').matches,touch:navigator.maxTouchPoints}));
assert(media.coarse&&!media.fine&&media.touch>0);
const input=m.locator('input[type=file]');await input.scrollIntoViewIfNeeded();const rect=await input.boundingBox();assert(rect);
let chooserCount=0;const count=()=>chooserCount++;m.on('filechooser',count);const chosen=m.waitForEvent('filechooser');
await m.touchscreen.tap(rect.x+rect.width/2,rect.y+rect.height/2);const chooser=await chosen;
const activation=await m.evaluate(()=>window.__gestureAudit().events.filter(e=>e.kind==='file-input-click').at(-1));
assert.equal(chooserCount,1);assert(activation.active&&activation.trusted&&activation.turn>0);
await chooser.setFiles(await fixture(mobile,base));await ready(m);
const previous=await m.locator('.upload-label img').getAttribute('src'),cancelRect=await input.boundingBox(),cancelPromise=m.waitForEvent('filechooser');
assert(cancelRect);await m.touchscreen.tap(cancelRect.x+cancelRect.width/2,cancelRect.y+cancelRect.height/2);const cancel=await cancelPromise;await cancel.setFiles([]);
assert.equal(await m.locator('.upload-label img').getAttribute('src'),previous);assert.equal(chooserCount,2);
await m.screenshot({path:output+'/coarse-studio-ready.png',fullPage:true});
await fs.writeFile(output+'/affected-review.json',JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),browser:await browser.version(),scope:'Post-performance review only: genuine held template response; actual production WAAPI paused at explicit phases, no keyframe replacement; true coarse first chooser tap before any screenshot. Intercepted empty selection models cancel, not physical OS close.',pending,readyBox,phases,frames,bridgeCleaned:true,media,activation,chooserCount,cancelRetained:true,errors},null,2));
await mobile.close();await browser.close();relay.close();
console.log(JSON.stringify({pass:true,phases:phases.map(x=>x.currentTime),media,chooserCount,cancelRetained:true}));
