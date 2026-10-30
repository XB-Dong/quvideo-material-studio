import assert from 'node:assert/strict';
export function gestureAudit(){
 const events=[],urls=new Set(),create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);let seq=0,turn=0;
 const begin=e=>{turn=++seq;events.push({kind:e.type,turn,at:performance.now(),trusted:e.isTrusted});const current=turn;setTimeout(()=>{if(turn===current)turn=0},0)};
 document.addEventListener('click',e=>{const t=e.target;if(t?.matches?.('input[type=file]')){if(e.isTrusted&&turn===0)begin(e);events.push({kind:'file-input-click',turn,active:navigator.userActivation.isActive,trusted:e.isTrusted,at:performance.now()})}else if(t?.closest?.('.upload-label'))begin(e)},true);
 document.addEventListener('keydown',e=>{if(e.target?.matches?.('input[type=file]')&&['Enter',' '].includes(e.key))begin(e)},true);
 URL.createObjectURL=function(blob){const value=create(blob);urls.add(value);events.push({kind:'create-url',url:value,bytes:blob.size,at:performance.now()});return value};URL.revokeObjectURL=function(url){urls.delete(url);events.push({kind:'revoke-url',url,at:performance.now()});revoke(url)};
 window.__gestureAudit=()=>({events:events.slice(),liveUrls:[...urls]});
}
export async function fileGesture(page,file,{cancel=false,keyboard=false,slot=0}={}){
 const events=[];const listener=chooser=>events.push(chooser);page.on('filechooser',listener);const promise=page.waitForEvent('filechooser');
 try{if(keyboard){await page.locator('input[type=file]').nth(slot).focus();await page.keyboard.press('Enter')}else await page.locator('.upload-label').nth(slot).click();const chooser=await promise;assert.equal(events.length,1,'One gesture opened multiple choosers');const audit=await page.evaluate(()=>window.__gestureAudit());const input=audit.events.filter(e=>e.kind==='file-input-click').at(-1);if(!keyboard)assert(input?.turn>0&&input.active,'File chooser left original gesture task');await chooser.setFiles(cancel?[]:file);return {eventCount:events.length,input,audit};}finally{page.off('filechooser',listener)}
}
export async function fixture(context,base,name='fixture.jpg'){const response=await context.request.get(base+'/media/demo/pet-p1-cover.jpg');assert(response.ok());return {name,mimeType:'image/jpeg',buffer:await response.body()}}
export async function ready(page,slot=0){await page.locator('.upload-slot.ready').nth(slot).waitFor()}
export async function loaded(image){await image.scrollIntoViewIfNeeded();await image.evaluate(el=>new Promise((resolve,reject)=>{let timer;const cleanup=()=>{clearTimeout(timer);el.removeEventListener('load',ok);el.removeEventListener('error',bad)};const ok=()=>{cleanup();el.complete&&el.naturalWidth?resolve():reject(Error('No image pixels'))};const bad=()=>{cleanup();reject(Error('Image error'))};if(el.complete){ok();return}el.addEventListener('load',ok,{once:true});el.addEventListener('error',bad,{once:true});timer=setTimeout(()=>{cleanup();reject(Error('Image timeout'))},5000)}))}
