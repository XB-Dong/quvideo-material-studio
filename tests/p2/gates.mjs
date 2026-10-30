// Real-response controls. The forwarder MUST be an independent APIRequestContext:
// page.route.fetch would share the browser cookie jar and could apply Set-Cookie early.
export function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}}
export async function bounded(promise,label,ms=10000){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>timer=setTimeout(()=>reject(Error(label+' deadline '+ms+'ms')),ms))])}finally{clearTimeout(timer)}}
export async function holdResponse(page,forwarder,pattern,{method='POST'}={}){
 const seen=deferred(),executed=deferred(),release=deferred(),finished=deferred(),events=[];let captured=false;
 const handler=async route=>{
  const request=route.request();if(captured||request.method()!==method)return route.continue();captured=true;
  events.push({kind:'request-held',method,at:Date.now()});seen.resolve();
  try{
   const response=await forwarder.fetch(request.url(),{method,headers:await request.allHeaders(),...(request.postDataBuffer()?{data:request.postDataBuffer()}:{}),failOnStatusCode:false});
   const metadata={status:response.status(),hasSetCookie:response.headersArray().some(h=>h.name.toLowerCase()==='set-cookie')};events.push({kind:'real-server-completed',at:Date.now(),...metadata});executed.resolve(metadata);
   const mode=await release.promise;if(mode==='abort')await route.abort('failed');else await route.fulfill({response});events.push({kind:mode==='abort'?'response-aborted':'real-response-released',at:Date.now()});
  }catch(error){events.push({kind:'route-error',at:Date.now(),message:error.message});executed.resolve({error:error.message})}finally{finished.resolve()}
 };
 await page.route(pattern,handler);
 return {events,seen:()=>bounded(seen.promise,'held request'),executed:()=>bounded(executed.promise,'real server response'),release:async(mode='fulfill')=>{release.resolve(mode);await bounded(finished.promise,'response release')},dispose:async()=>{release.resolve('abort');if(captured)await bounded(finished.promise,'held route cleanup');await page.unroute(pattern,handler)}};
}
export function networkAudit(page){const events=[];page.on('request',r=>{const path=new URL(r.url()).pathname;if(path.startsWith('/api/'))events.push({kind:'request',path,method:r.method(),at:Date.now()})});page.on('response',r=>{const path=new URL(r.url()).pathname;if(path.startsWith('/api/'))events.push({kind:'response',path,status:r.status(),at:Date.now()})});return events}
