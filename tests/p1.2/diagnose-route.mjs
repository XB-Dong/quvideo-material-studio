import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {start as startHarness,base,output,testedCommit} from './common.mjs';
const {browser,relay}=await startHarness();
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),sources=new Map();
page.on('response',response=>{
 if(response.request().resourceType()==='script')sources.set(response.url(),response.body().then(body=>body.toString()).catch(()=>''));
});
await page.addInitScript(()=>{
 window.__tasks=[];
 new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__tasks.push({at:entry.startTime,duration:entry.duration})}).observe({type:'longtask',buffered:true});
});
await page.goto(base,{waitUntil:'networkidle'});
await page.waitForTimeout(1500);
const session=await context.newCDPSession(page);
await session.send('Tracing.start',{categories:'devtools.timeline,v8.execute,blink.user_timing,disabled-by-default-devtools.timeline.stack,disabled-by-default-v8.cpu_profiler',options:'sampling-frequency=1000',transferMode:'ReturnAsStream'});
const begin=await page.evaluate(()=>{performance.mark('P12_NAV_START');return performance.now()});
await page.locator('a.template-card[href="/templates/demo-pet"]').click();
await page.locator('input[type=file]').first().waitFor({state:'attached'});
const end=await page.evaluate(()=>{performance.mark('P12_NAV_END');return performance.now()});
await page.waitForTimeout(100);
const completion=new Promise(resolve=>session.once('Tracing.tracingComplete',resolve));
await session.send('Tracing.end');
const {stream}=await completion;
let raw='';
while(true){const part=await session.send('IO.read',{handle:stream});raw+=part.base64Encoded?Buffer.from(part.data,'base64').toString():part.data;if(part.eof)break}
await session.send('IO.close',{handle:stream});
await fs.writeFile(output+'/route-trace.json',raw);
const events=JSON.parse(raw).traceEvents,marker=events.find(event=>event.name==='P12_NAV_START');
assert(marker,'Trace lacks navigation timing mark');
const costly=events.filter(event=>event.dur>=5000&&event.pid===marker.pid&&event.tid===marker.tid&&event.ts>=marker.ts&&event.ts<=marker.ts+(end-begin+150)*1000).map(event=>({name:event.name,pid:event.pid,tid:event.tid,at:(event.ts-marker.ts)/1000+begin,duration:event.dur/1000,args:event.args})).sort((a,b)=>b.duration-a.duration);
const snippets=[];
for(const event of costly){
 const data=event.args?.data||{},frame=data.stackTrace?.[0]||data,url=data.url||data.scriptName||frame.url;
 if(!url||!sources.has(url))continue;
 const source=await sources.get(url),lines=source.split('\n'),lineNumber=data.lineNumber??frame.lineNumber??0,column=data.columnNumber??frame.columnNumber??0;
 snippets.push({url,functionName:data.functionName||frame.functionName,lineNumber,column,candidates:[lineNumber,Math.max(0,lineNumber-1)].map(index=>({index,around:(lines[index]||'').slice(Math.max(0,column-80),column+1200)}))});
}
const observed=await page.evaluate(()=>window.__tasks),longTasks=observed.filter(task=>task.at>=begin&&task.at<end);
await fs.writeFile(output+'/route-diagnosis.json',JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),scope:'Diagnostic tracing perturbs execution, not comfort acceptance',begin,end,longTasks,costly,snippets},null,2));
console.log(JSON.stringify({longTasks,costly:costly.slice(0,12),snippets},null,2));
await browser.close();relay.close();
