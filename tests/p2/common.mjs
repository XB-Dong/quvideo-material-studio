import net from 'node:net';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium,request} from 'playwright';
export const base=process.env.BASE_URL||'http://localhost:3000',origin=process.env.APP_PUBLIC_ORIGIN||new URL(base).origin,output=process.env.OUTPUT_DIR||'/evidence',testedCommit=process.env.TESTED_COMMIT;
export async function start({browser=false}={}){
 assert(/^[a-f0-9]{40}$/.test(testedCommit||''),'Exact deployed TESTED_COMMIT required');await fs.mkdir(output,{recursive:true});
 let relay;if(process.env.RELAY_ENABLED!=='0'){
  const url=new URL(base);assert(['localhost','127.0.0.1'].includes(url.hostname),'Relay BASE_URL must use local hostname');
  relay=net.createServer(c=>{const u=net.connect(Number(process.env.RELAY_PORT||3000),process.env.RELAY_HOST||'host.docker.internal');c.pipe(u);u.pipe(c);c.on('error',()=>u.destroy());u.on('error',()=>c.destroy())});await new Promise((resolve,reject)=>{relay.once('error',reject);relay.listen(Number(url.port||(url.protocol==='https:'?443:80)),'127.0.0.1',resolve)});
 }
 const instance=browser?await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}):null;
 return {browser:instance,api:options=>request.newContext(options),close:async()=>{await instance?.close();await new Promise(r=>relay?relay.close(r):r())}};
}
export async function call(c,path,{method='GET',data,multipart,expected=200,code,requestOrigin=origin}={}){
 const response=await c.fetch(base+path,{method,headers:method==='GET'?{}:{Origin:requestOrigin},...(data!==undefined?{data}:{}),...(multipart?{multipart}:{})});
 assert.equal(response.status(),expected,method+' '+path+' unexpected HTTP');
 const type=response.headers()['content-type']||'',json=type.includes('json')?await response.json():null;
 if(code)assert.equal(json?.code,code);if(expected>=400){assert(typeof json?.code==='string'&&json.code);assert(typeof json?.message==='string'&&json.message)}
 if(json)assert(!/"(?:password|passwordHash|salt|token|hash)"\s*:/.test(JSON.stringify(json)),'Response exposed credential field');
 return {response,json};
}
export function cookieEvidence(response){return response.headersArray().filter(h=>h.name.toLowerCase()==='set-cookie').map(h=>{const parts=h.value.split(';').slice(1).map(x=>x.trim());return {present:true,httpOnly:parts.some(x=>/^httponly$/i.test(x)),sameSite:parts.find(x=>/^samesite=/i.test(x))||null,path:parts.find(x=>/^path=/i.test(x))||null,secure:parts.some(x=>/^secure$/i.test(x))}})}
export async function clone(c,api){return api({storageState:await c.storageState()})}
export async function fixture(c){const template=(await call(c,'/api/templates/demo-pet')).json;const image=await c.get(base+template.coverUrl);assert(image.ok());const asset=(await call(c,'/api/assets',{method:'POST',multipart:{templateId:template.id,file:{name:'synthetic-pet.jpg',mimeType:'image/jpeg',buffer:await image.body()}},expected:201})).json;return {template,asset}}
export async function task(c,asset,{failAt=null,delay=50}={}){return (await call(c,'/api/tasks',{method:'POST',expected:202,data:{templateId:'demo-pet',assetIds:[asset.id],simulation:{failAt,delayMs:{assetCheck:delay,generate:delay,finalize:delay}}}})).json}
export async function terminal(c,id){const end=Date.now()+35000,timeline=[];while(Date.now()<end){const t=(await call(c,'/api/tasks/'+id)).json;if(timeline.at(-1)?.version!==t.version)timeline.push({status:t.status,stage:t.stage,version:t.version});if(['SUCCEEDED','FAILED'].includes(t.status))return {task:t,timeline};await new Promise(r=>setTimeout(r,100))}throw Error('Task35s deadline exceeded '+JSON.stringify(timeline))}
