import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {start,base,output,testedCommit,call,fixture,task,terminal,clone} from './common.mjs';
const baseline=process.env.BASELINE_COMMIT;
assert(/^[a-f0-9]{40}$/.test(baseline||''),'Exact V3 baseline required');
const flag=output+'/backend-upgraded.flag',reportFile=output+'/upgrade.json',env=await start(),c=await env.api();
const sha=b=>createHash('sha256').update(b).digest('hex'),report={baselineCommit:baseline,newBackendCommit:testedCommit,base,scope:'Separate synthetic V3-to-V4 volume upgrade; old guest cookie stays only in the running API context RAM. Existing V3 frontend proxy stays, only backend upgraded after ready signal.',phases:[]};
const canonical=value=>JSON.stringify((function sort(v){return Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])])):v})(value));
async function save(){await fs.writeFile(reportFile,JSON.stringify({...report,capturedAt:new Date().toISOString()},null,2))}
try{
 try{await fs.access(flag);throw Error('Upgrade flag already exists: use new evidence directory')}catch(e){if(e.code!=='ENOENT')throw e}
 const initial=(await call(c,'/api/session',{method:'POST'})).json,f=await fixture(c),snapshots=[];
 for(const failAt of [null,null,'GENERATE']){const created=await task(c,f.asset,{failAt}),done=await terminal(c,created.id),result=done.task.resultUrl?await c.get(base+done.task.resultUrl):null;snapshots.push({task:done.task,taskSha256:sha(canonical(done.task)),resultSha256:result?sha(await result.body()):null})}
 const uploaded=await c.get(base+f.asset.url);assert(uploaded.ok());const uploadedSha=sha(await uploaded.body());
 report.phases.push({name:'V3 seeded',at:new Date().toISOString(),userId:initial.userId,taskIds:snapshots.map(s=>s.task.id),statuses:snapshots.map(s=>s.task.status),assetSha256:uploadedSha});await save();console.log('V3_SEEDED_READY_FOR_BACKEND_UPGRADE');
 const deadline=Date.now()+180000;while(true){try{await fs.access(flag);break}catch(e){if(e.code!=='ENOENT')throw e}assert(Date.now()<deadline,'Upgrade control deadline exceeded; no cookie persisted');await new Promise(r=>setTimeout(r,250))}
 const current=(await call(c,'/api/session')).json;assert.equal(current.userId,initial.userId);assert.equal(current.kind,'GUEST');assert.equal(sha(await(await c.get(base+f.asset.url)).body()),uploadedSha);
 for(const old of snapshots){const now=(await call(c,'/api/tasks/'+old.task.id)).json;assert.equal(sha(canonical(now)),old.taskSha256,'V3 task snapshot changed during V4 migration (object keys canonical, arrays preserved)');if(old.resultSha256)assert.equal(sha(await(await c.get(base+now.resultUrl)).body()),old.resultSha256)}
 report.phases.push({name:'V4 retains old guest, exact terminal task snapshots and uploaded/result bytes',at:new Date().toISOString(),pass:true});await save();
 const old=await clone(c,env.api);try{const registered=(await call(c,'/api/auth/register',{method:'POST',expected:201,data:{displayName:'旧访客升级账户',email:'p2-upgrade-'+Date.now()+'@example.test',password:'Synthetic-upgrade-only-2026!'}})).json;assert.equal(registered.userId,initial.userId);assert.equal(registered.kind,'ACCOUNT');await call(old,'/api/session',{expected:401});for(const s of snapshots)assert.equal((await call(c,'/api/tasks/'+s.task.id)).json.id,s.task.id)}finally{await old.dispose()}
 report.phases.push({name:'Old V3 guest upgrades to account without losing records, old token revoked',at:new Date().toISOString(),pass:true});report.pass=true;await save();console.log(JSON.stringify({pass:true,records:snapshots.length,bytesUnchanged:true,guestOwnerPreserved:true}));
}catch(e){report.pass=false;report.failure=e.message.split('\n')[0];await save();throw Error(report.failure)}finally{await c.dispose();await env.close()}
