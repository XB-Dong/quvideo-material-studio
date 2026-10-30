// Read-only media calibration, exclusively after performance. Never changes app paint.
export async function exposedInkPaths(page){return page.evaluate(async()=>{
 const canvas=document.querySelector('canvas.ink-backdrop'),fog=canvas?.getContext('2d'),intro=document.querySelector('.intro')?.getBoundingClientRect();
 if(!fog||!intro)throw Error('No actual ready ink backdrop/intro');
 const image=new Image();image.src=new URL('/ink/landscape.webp',location.href).href;await image.decode();
 if(new URL(image.src).origin!==location.origin)throw Error('Calibration source must be local same-origin landscape');
 const original=document.createElement('canvas');original.width=image.width;original.height=image.height;const context=original.getContext('2d');context.drawImage(image,0,0);
 const scale=Math.min(Math.max(innerWidth,680)/image.width,1),left=(innerWidth-image.width*scale)/2,top=96;
 const blocked='a,button,input,textarea,select,dialog,.intro-copy,.poster-stack,.orbit-slot,.section-top,.categories,.template-meta,header,footer';
 const exposed=(x,y)=>[-35,0,35].every(dx=>[-35,0,35].every(dy=>{const el=document.elementFromPoint(x+dx,y+dy);return el&&!el.closest(blocked)}));
 const energy=p=>{let total=0;for(let i=4;i<p.length;i+=4)total+=Math.abs(p[i]-p[i-4])+Math.abs(p[i+1]-p[i-3])+Math.abs(p[i+2]-p[i-2]);return total/(p.length/4)};
 const candidates=[];
 for(let y=Math.max(160,intro.y+40,top+45);y<Math.min(innerHeight-100,intro.bottom-40,top+image.height*scale-45);y+=30){
  for(let x=Math.max(intro.x+40,760);x<Math.min(innerWidth-100,intro.right-40);x+=30){
   if(!exposed(x,y))continue;
   const ox=Math.round((x-left)/scale),oy=Math.round((y-top)/scale);if(ox<35||oy<35||ox+35>=image.width||oy+35>=image.height)continue;
   const originalEnergy=energy(context.getImageData(ox-35,oy-35,70,70).data),visibleFogEnergy=energy(fog.getImageData(x-35,y-35,70,70).data);
   candidates.push({x,y,originalEnergy,visibleFogEnergy,score:originalEnergy*visibleFogEnergy});
  }
 }
 candidates.sort((a,b)=>b.score-a.score);const paths=[];
 for(const center of candidates){
  if(paths.some(p=>Math.hypot(p.center.x-center.x,p.center.y-center.y)<140))continue;
  for(const [dx,dy] of [[50,0],[0,50],[35,35]]){
   const from={x:center.x-dx,y:center.y-dy},to={x:center.x+dx,y:center.y+dy};
   if(!Array.from({length:21},(_,i)=>exposed(from.x+(to.x-from.x)*i/20,from.y+(to.y-from.y)*i/20)).every(Boolean))continue;
   paths.push({from,to,center});break;
  }
  if(paths.length===2)break;
 }
 if(paths.length!==2)throw Error('Could not find two separated real exposed ink paths; do not alter app to manufacture them');
 return {source:image.src,sourceDimensions:{width:image.width,height:image.height},mapping:{scale,left,top,reason:'Read-only exact production static image placement at81a; no paint/filter/alpha/mask mutation'},candidateCount:candidates.length,paths};
})}
