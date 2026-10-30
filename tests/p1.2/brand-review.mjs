import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {start,base,output,testedCommit} from './common.mjs';
import {seed} from './fixtures.mjs';

const {browser,relay}=await start(),results=[];
for(const scenario of [{name:'desktop',width:1440,height:1000,touch:false,header:92,left:32},{name:'mobile',width:375,height:812,touch:true,header:76,left:16}]){
 const c=await browser.newContext({viewport:{width:scenario.width,height:scenario.height},hasTouch:scenario.touch,isMobile:scenario.touch}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/templates/demo-pet',{waitUntil:'networkidle'});
 const link=p.getByRole('link',{name:'疏影',exact:true});assert.equal(await link.getAttribute('href'),'/');
 if(scenario.touch){const r=await link.boundingBox();assert(r);await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2)}else{await link.focus();await p.keyboard.press('Enter')}
 await p.waitForURL(base+'/');await p.locator('.template-card').first().waitFor();await p.evaluate(()=>document.fonts.ready);
 const actual=await p.evaluate(()=>{const h=document.querySelector('.site-header'),b=h.querySelector('.brand');return {header:h.getBoundingClientRect().toJSON(),brand:b.getBoundingClientRect().toJSON(),text:b.textContent,name:b.getAttribute('aria-label'),href:b.getAttribute('href'),oldMark:!!h.querySelector('.brand-mark'),oldCaption:!!h.querySelector('.brand-caption'),width:innerWidth,scrollWidth:document.documentElement.scrollWidth,coarse:matchMedia('(pointer:coarse)').matches,fine:matchMedia('(pointer:fine)').matches,touch:navigator.maxTouchPoints,headerText:h.textContent,templateLinks:[...document.querySelectorAll('a.template-card')].map(a=>a.getAttribute('href'))}});
 assert.equal(actual.header.height,scenario.header);assert.equal(actual.brand.x,scenario.left);assert.equal(actual.text,'疏影');assert.equal(actual.name,'疏影');assert(!actual.oldMark&&!actual.oldCaption&&!actual.headerText.includes('SHUYING'));assert(actual.scrollWidth<=scenario.width);assert.equal(actual.templateLinks.length,4);assert.deepEqual(errors,[]);
 if(scenario.touch)assert(actual.coarse&&!actual.fine&&actual.touch>0);
 await p.screenshot({path:output+'/'+scenario.name+'-home.png',fullPage:false});await p.screenshot({path:output+'/'+scenario.name+'-header.png',clip:{x:0,y:0,width:scenario.width,height:scenario.header}});
 results.push({scenario,actual,errors,activation:scenario.touch?'First native touchscreen brand link tap before screenshots':'Focused brand Link activated by Enter'});await c.close();
}
const c=await browser.newContext({viewport:{width:1440,height:1000}});await seed(c,base);const p=await c.newPage();await p.goto(base+'/history',{waitUntil:'networkidle'});await p.locator('.task-card time').first().waitFor();
const dates=await p.locator('.task-card time').evaluateAll(elements=>elements.map(e=>({iso:e.getAttribute('datetime'),actual:e.textContent,expected:new Date(e.getAttribute('datetime')).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})})));
assert.equal(dates.length,3);assert(dates.every(d=>d.actual===d.expected),'Task timestamp changed local calendar display');
await fs.writeFile(output+'/brand-review.json',JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),browser:await browser.version(),scope:'Post-deploy brand screenshots and native Link activation, followed by separate-context date display comparison. Entire browser exits before fresh original no-screenshot performance; no Intl warmup in performance browser.',results,dates},null,2));
await c.close();await browser.close();relay.close();console.log(JSON.stringify({pass:true,headers:results.map(r=>({width:r.scenario.width,height:r.actual.header.height,left:r.actual.brand.x,name:r.actual.name})),dateCount:dates.length}));
