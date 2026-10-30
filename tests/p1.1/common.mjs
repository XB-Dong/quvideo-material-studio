import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import net from 'node:net';
import assert from 'node:assert/strict';
export const base=process.env.BASE_URL||'http://localhost:3000',output=process.env.OUTPUT_DIR||'/evidence',testedCommit=process.env.TESTED_COMMIT;
export async function start(){
 assert(/^[a-f0-9]{40}$/.test(testedCommit||''),'Exact TESTED_COMMIT required');await fs.mkdir(output,{recursive:true});
 const relay=net.createServer(c=>{const u=net.connect(3000,process.env.RELAY_HOST||'host.docker.internal');c.pipe(u);u.pipe(c);c.on('error',()=>u.destroy());u.on('error',()=>c.destroy());});await new Promise(r=>relay.listen(3000,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});return {browser,relay};
}
export function audit(){
 const frames=new Set(),contexts=[];let executed=0;const raf=requestAnimationFrame.bind(window),cancel=cancelAnimationFrame.bind(window),gc=HTMLCanvasElement.prototype.getContext;
 window.requestAnimationFrame=cb=>{const id=raf(t=>{frames.delete(id);executed++;cb(t)});frames.add(id);return id};window.cancelAnimationFrame=id=>{frames.delete(id);cancel(id)};
 HTMLCanvasElement.prototype.getContext=function(kind,...args){const gl=gc.call(this,kind,...args);if(gl&&String(kind).startsWith('webgl')&&!contexts.includes(gl))contexts.push(gl);return gl};
 window.__audit=()=>({rafPending:frames.size,rafExecuted:executed,gpuAllocated:contexts.length,gpuLive:contexts.filter(g=>!g.isContextLost()).length,coarse:matchMedia('(pointer:coarse)').matches,fine:matchMedia('(pointer:fine)').matches,hover:matchMedia('(hover:hover)').matches,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,hidden:document.hidden,animations:document.getAnimations().map(a=>({name:a.animationName,state:a.playState,target:a.effect?.target?.className,iterations:a.effect?.getTiming().iterations}))});
}
export async function raster(page,clip,name){
 const png=await page.screenshot({clip,path:`${output}/${name}.png`});
 return page.evaluate(async data=>{const im=new Image();im.src='data:image/png;base64,'+data;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const p=x.getImageData(0,0,c.width,c.height).data;let edge=0,mean=0;const lum=i=>(p[i]+p[i+1]+p[i+2])/3;for(let y=1;y<c.height-1;y++)for(let x=1;x<c.width-1;x++){const i=(y*c.width+x)*4;mean+=lum(i);edge+=Math.abs(4*lum(i)-lum(i-4)-lum(i+4)-lum(i-c.width*4)-lum(i+c.width*4));}const n=(c.width-2)*(c.height-2);return {edgeEnergy:edge/n,mean:mean/n,width:c.width,height:c.height,pixels:Array.from(p)}},png.toString('base64'));
}
export function compare(a,b){let changed=0;for(let i=0;i<a.pixels.length;i+=4)if(Math.max(...[0,1,2].map(k=>Math.abs(a.pixels[i+k]-b.pixels[i+k])))>3)changed++;return {changedPixels:changed,edgeRatio:b.edgeEnergy/a.edgeEnergy};}
export function compact(r){const {pixels,...metrics}=r;return metrics}
