import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import net from 'node:net';
import assert from 'node:assert/strict';
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
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});
 await check(`${scenario.name}: catalog content`,async()=>{await page.locator('.template-card').first().waitFor();const state=await inspect(page);assert(state.scrollWidth<=state.width,`overflow ${state.scrollWidth}>${state.width}`);assert(!forbidden.test(state.bodyText),'Visible technical effect annotations');const rgb=state.bodyBackground.match(/\d+/g).slice(0,3).map(Number);assert(rgb.every(c=>c>=230),'Background is not light neutral');return state;});
 await page.screenshot({path:`${output}/${scenario.name}-catalog.png`,fullPage:true});
 await check(`${scenario.name}: category interaction`,async()=>{await page.getByRole('button',{name:'宠物',exact:true}).click();await page.waitForTimeout(400);assert.equal(await page.locator('.template-card').count(),1);await page.getByRole('button',{name:'全部模板',exact:true}).click();await page.waitForTimeout(400);assert.equal(await page.locator('.template-card').count(),4);});
 await check(`${scenario.name}: identity dialog Escape and focus`,async()=>{const trigger=page.getByRole('button',{name:/创作者|当前身份|个人身份/}).first();await trigger.focus();await trigger.click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden',timeout:2000});assert(await trigger.evaluate(el=>el===document.activeElement),'Dialog did not return focus');});
 await check(`${scenario.name}: studio fields and overflow`,async()=>{await page.goto(`${base}/templates/demo-pet`,{waitUntil:'networkidle'});await page.locator('input[type=file]').first().waitFor({state:'attached'});const state=await inspect(page);assert(state.scrollWidth<=state.width,`studio overflow ${state.scrollWidth}>${state.width}`);assert(!forbidden.test(state.bodyText));await page.screenshot({path:`${output}/${scenario.name}-studio.png`,fullPage:true});});
 await check(`${scenario.name}: history and unknown template`,async()=>{await page.goto(`${base}/history`,{waitUntil:'networkidle'});assert((await inspect(page)).scrollWidth<=scenario.width);await page.goto(`${base}/templates/not-a-template`,{waitUntil:'networkidle'});await page.getByRole('heading',{name:'这个模板不存在'}).waitFor();});
 await check(`${scenario.name}: runtime errors`,async()=>assert.deepEqual(errors,[]));
 await context.close();
}
await fs.writeFile(`${output}/acceptance.json`,JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),browser:await browser.version(),checks,scope:'Initial independent light/layout/keyboard/content checks; not a complete comfort or creativity signoff',missing:['seven-effect interaction/resource controls','static preference lifecycle','multi-task/query errors/true failure','actual interaction performance/trace','upgrade/rollback evidence']},null,2));
await browser.close();relay.close();
console.log(JSON.stringify({pass:checks.filter(x=>x.status==='pass').length,fail:checks.filter(x=>x.status==='fail').length},null,2));
if(checks.some(x=>x.status==='fail'))process.exitCode=1;
