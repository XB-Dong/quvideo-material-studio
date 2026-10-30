import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {start,base,output,testedCommit} from './common.mjs';
import {seed} from './fixtures.mjs';
const {browser,relay}=await start(),owner=await browser.newContext();await seed(owner,base);const state=await owner.storageState();await owner.close();
const results=[],fixtures=[['2026-12-31T23:59:00Z','2027-01-01T00:01:00Z','2024-02-29T23:59:00Z'],['2026-03-08T06:59:00Z','2026-03-08T07:01:00Z','2026-11-01T06:01:00Z']];
for(const timezoneId of ['UTC','Asia/Shanghai','America/New_York'])for(const createdAt of fixtures){
 const c=await browser.newContext({timezoneId,storageState:state,viewport:{width:1440,height:1000}}),p=await c.newPage();let intercepted=0;
 await p.route('**/api/tasks?*',async route=>{const response=await route.fetch(),data=await response.json();if(!new URL(route.request().url()).searchParams.has('activeOnly')){assert.equal(data.items.length,3);data.items.forEach((t,i)=>t.createdAt=createdAt[i]);intercepted++}await route.fulfill({response,json:data})});
 await p.goto(base+'/history',{waitUntil:'networkidle'});await p.locator('.task-card time').first().waitFor();
 const dates=await p.locator('.task-card time').evaluateAll(elements=>elements.map(e=>({iso:e.getAttribute('datetime'),actual:e.textContent,expected:new Date(e.getAttribute('datetime')).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})})));
 assert.equal(dates.length,3);assert.equal(intercepted,1);assert(dates.every(d=>d.actual===d.expected));results.push({timezoneId,createdAt,intercepted,dates});await c.close();
}
await fs.writeFile(output+'/date-review.json',JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),browser:await browser.version(),scope:'Post-performance independent displayed-date comparison. Only GET history JSON createdAt fields replaced with declared legal ISO fixtures; actual frontend renders, database untouched; session state memory-only. Intl comparison occurs after actual DOM and never in original performance browser. Includes local calendar/year/leap rollover and US spring-forward inputs.',results},null,2));
await browser.close();relay.close();console.log(JSON.stringify({pass:true,contexts:results.length,comparisons:results.reduce((n,r)=>n+r.dates.length,0)}));
