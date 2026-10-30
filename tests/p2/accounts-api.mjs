import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {start,base,origin,output,testedCommit,call,cookieEvidence,clone,fixture,task,terminal} from './common.mjs';
const env=await start(),contexts=[],checks=[];let activeCheck='setup',failed;
const api=async options=>{const c=await env.api(options);contexts.push(c);return c};
async function check(name,fn){activeCheck=name;const began=new Date().toISOString();const details=await fn();checks.push({name,status:'pass',began,completedAt:new Date().toISOString(),details})}
const nonce=Date.now().toString(36),password='P2-synthetic-fixture-2026!',newPassword='P2-synthetic-replacement-2026!',emailA='p2-a-'+nonce+'@example.test',emailB='p2-b-'+nonce+'@example.test';let a,b,guestA,guestB,assetA,recordA,ownerA,ownerB;
try{
 a=await api();b=await api();
 await check('Guest works; register upgrades owner, rotates token and preserves uploaded task',async()=>{
  const created=await call(a,'/api/session',{method:'POST'});assert.equal(created.json.kind,'GUEST');const cookie=cookieEvidence(created.response);assert(cookie.some(c=>c.httpOnly&&c.sameSite?.toLowerCase()==='samesite=lax'&&c.path==='Path=/'));guestA=await clone(a,api);const f=await fixture(a);assetA=f.asset;recordA=await task(a,assetA,{delay:250});
  const registered=await call(a,'/api/auth/register',{method:'POST',expected:201,data:{displayName:'合成创作者甲',email:' '+emailA.toUpperCase()+' ',password}});ownerA=registered.json.userId;assert.equal(ownerA,created.json.userId);assert.equal(registered.json.kind,'ACCOUNT');assert.equal(registered.json.email,emailA);assert.equal(registered.json.emailVerified,false);await call(guestA,'/api/session',{expected:401});assert.equal((await call(a,'/api/tasks/'+recordA.id)).json.id,recordA.id);return {ownerPreserved:true,oldGuestRevoked:true,taskId:recordA.id,cookie};
 });
 await check('Registration invalid fields, normalized duplicate and concurrent unique email rollback',async()=>{
  const invalid=await api();await call(invalid,'/api/session',{method:'POST'});
  await call(invalid,'/api/auth/register',{method:'POST',expected:400,data:{displayName:'',email:'invalid',password:'short'}});
  await call(invalid,'/api/auth/register',{method:'POST',expected:409,data:{displayName:'重复邮箱',email:emailA.toUpperCase(),password}});assert.equal((await call(invalid,'/api/session')).json.kind,'GUEST');
  await call(a,'/api/auth/register',{method:'POST',expected:409,data:{displayName:'不可重复升级',email:'other-'+emailA,password}});
  const left=await api(),right=await api();await call(left,'/api/session',{method:'POST'});await call(right,'/api/session',{method:'POST'});
  const email='p2-race-'+nonce+'@example.test',data={displayName:'并发唯一',email,password};
  const responses=await Promise.all([left.post(base+'/api/auth/register',{headers:{Origin:origin},data}),right.post(base+'/api/auth/register',{headers:{Origin:origin},data})]);assert.deepEqual(responses.map(r=>r.status()).sort(),[201,409]);
  const loser=responses[0].status()===409?left:right;assert.equal((await call(loser,'/api/session')).json.kind,'GUEST');return {concurrentStatuses:[201,409],duplicateDoesNotPartiallyUpgrade:true};
 });
 await check('Second account and guest media/task isolation; login never merges guest history',async()=>{
  const guest=(await call(b,'/api/session',{method:'POST'})).json;guestB=await clone(b,api);const f=await fixture(b),guestTask=await task(b,f.asset);
  const reg=(await call(b,'/api/auth/register',{method:'POST',expected:201,data:{displayName:'合成创作者乙',email:emailB,password}})).json;ownerB=reg.userId;assert.equal(ownerB,guest.userId);assert.notEqual(ownerA,ownerB);await call(guestB,'/api/session',{expected:401});await call(b,'/api/tasks/'+recordA.id,{expected:404});await call(b,'/media/assets/'+assetA.id,{expected:404});
  const stranger=await api();await call(stranger,'/api/session',{method:'POST'});const strangerAsset=(await fixture(stranger)).asset,strangerTask=await task(stranger,strangerAsset);const oldStranger=await clone(stranger,api);
  const login=(await call(stranger,'/api/auth/login',{method:'POST',data:{email:emailA,password}})).json;assert.equal(login.userId,ownerA);await call(oldStranger,'/api/session',{expected:401});await call(stranger,'/api/tasks/'+strangerTask.id,{expected:404});await call(a,'/api/tasks/'+guestTask.id,{expected:404});return {ownersDistinct:true,guestNotMerged:true,foreignTaskAndAsset404:true};
 });
 await check('Profile PATCH same-origin proxy200/400/401/403 and code/cookie continuity',async()=>{
  const changed=await call(a,'/api/account/profile',{method:'PATCH',data:{displayName:' 更新后的甲 '}});assert.equal(changed.json.userId,ownerA);assert.equal(changed.json.displayName,'更新后的甲');assert.equal((await call(a,'/api/session')).json.displayName,'更新后的甲');
  await call(a,'/api/account/profile',{method:'PATCH',expected:400,data:{displayName:''}});await call(a,'/api/account/profile',{method:'PATCH',expected:403,requestOrigin:'https://not-the-application.invalid',data:{displayName:'不应写入'}});
  const guest=await api();await call(guest,'/api/session',{method:'POST'});const denied=await call(guest,'/api/account/profile',{method:'PATCH',expected:403,code:'ACCOUNT_REQUIRED',data:{displayName:'访客'}});await call(guestA,'/api/account/profile',{method:'PATCH',expected:401,data:{displayName:'旧会话'}});assert.equal((await call(a,'/api/session')).json.displayName,'更新后的甲');return {profileCookie:cookieEvidence(changed.response),guestErrorCookie:cookieEvidence(denied.response),frontendOrigin:origin,statuses:[200,400,401,403],ownerUnchanged:true};
 });
 await check('AUTH_INVALID is a credential error; valid guest session remains valid',async()=>{
  const guest=await api();const before=(await call(guest,'/api/session',{method:'POST'})).json;await call(guest,'/api/auth/login',{method:'POST',expected:401,code:'AUTH_INVALID',data:{email:emailB,password:'not-the-correct-password'}});assert.equal((await call(guest,'/api/session')).json.userId,before.userId);return {guestPreserved:true};
 });
 await check('Running task survives logout/login; old token cannot read private result',async()=>{
  const active=await task(a,assetA,{delay:500}),old=await clone(a,api);const loggedOut=(await call(a,'/api/auth/logout',{method:'POST'})).json;assert.equal(loggedOut.kind,'GUEST');assert.notEqual(loggedOut.userId,ownerA);await call(old,'/api/session',{expected:401});await call(a,'/api/tasks/'+active.id,{expected:404});await call(a,'/api/auth/login',{method:'POST',data:{email:emailA,password}});const completed=await terminal(a,active.id);assert.equal(completed.task.status,'SUCCEEDED');const original=await a.get(base+completed.task.resultUrl);assert(original.ok());await call(b,completed.task.resultUrl,{expected:404});return {id:active.id,timeline:completed.timeline,originalMime:original.headers()['content-type'],oldTokenRevoked:true};
 });
 await check('Change password rejects wrong current, revokes all old sessions, signs fresh same owner',async()=>{
  const other=await api();await call(other,'/api/auth/login',{method:'POST',data:{email:emailA,password}});await call(a,'/api/account/password',{method:'POST',expected:400,data:{currentPassword:'wrong-current-password',newPassword}});const prior=await clone(a,api);const changed=(await call(a,'/api/account/password',{method:'POST',data:{currentPassword:password,newPassword}})).json;assert.equal(changed.userId,ownerA);await call(prior,'/api/session',{expected:401});await call(other,'/api/session',{expected:401});const fresh=await api();await call(fresh,'/api/auth/login',{method:'POST',expected:401,code:'AUTH_INVALID',data:{email:emailA,password}});await call(fresh,'/api/auth/login',{method:'POST',data:{email:emailA,password:newPassword}});assert.equal((await call(fresh,'/api/session')).json.userId,ownerA);return {sameOwner:true,allOldSessions401:true,oldPasswordRejected:true};
 });
 await check('Real multi-step order, specified failure stops later steps, terminal queries do not regress',async()=>{
  const first=await terminal(a,recordA.id);assert.equal(first.task.status,'SUCCEEDED');assert.deepEqual(first.task.steps.map(s=>s.stage),['ASSET_CHECK','GENERATE','FINALIZE']);assert(first.task.steps.every(s=>s.status==='SUCCEEDED'));
  const evidence=[];for(const stage of ['ASSET_CHECK','GENERATE','FINALIZE']){const created=await task(a,assetA,{failAt:stage}),done=await terminal(a,created.id);assert.equal(done.task.status,'FAILED');assert.equal(done.task.failedStage,stage);const index=done.task.steps.findIndex(s=>s.stage===stage);assert(done.task.steps.slice(index+1).every(s=>s.status==='NOT_STARTED'));const again=(await call(a,'/api/tasks/'+created.id)).json;assert.equal(again.status,'FAILED');assert.equal(again.version,done.task.version);evidence.push({stage,id:created.id,timeline:done.timeline,reason:done.task.failureReason})}return evidence;
 });
}catch(e){failed={name:activeCheck,status:'fail',message:e.message};checks.push(failed)}finally{
 await fs.writeFile(output+'/accounts-api.json',JSON.stringify({testedCommit,capturedAt:new Date().toISOString(),base,origin,checks,scope:'Independent frontend-origin account/core HTTP acceptance; synthetic credentials and cookies stay memory-only; current-source unexecuted until frozen candidate dispatch.'},null,2));for(const c of contexts)await c.dispose();await env.close();
}
console.log(JSON.stringify({passed:checks.filter(c=>c.status==='pass').length,failed}));if(failed)process.exitCode=1;
