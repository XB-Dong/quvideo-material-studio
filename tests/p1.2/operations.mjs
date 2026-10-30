export function operationAudit(){
 const events=[];let count=0;const note=e=>{events.push({...e,at:performance.now()});if(events.length>2000)events.shift()};
 if(document.startViewTransition){const vt=document.startViewTransition.bind(document);document.startViewTransition=(...args)=>{note({kind:'native-vt'});return vt(...args)}}
 const fetcher=window.fetch.bind(window);window.fetch=(input,options)=>{const id=++count,url=String(input?.url||input),signal=options?.signal||input?.signal;note({kind:'fetch',id,url});signal?.addEventListener('abort',()=>note({kind:'abort',id,url}),{once:true});return fetcher(input,options)};
 const observer=new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)if(n instanceof Element){const bridge=n.matches('.p12-cover-bridge')?n:n.querySelector('.p12-cover-bridge');if(bridge)note({kind:'bridge',src:bridge.querySelector('img')?.getAttribute('src')||bridge.getAttribute('src')});}});observer.observe(document,{subtree:true,childList:true});
 window.__operations=()=>({events:events.slice(),bridges:[...document.querySelectorAll('.p12-cover-bridge img')].map(i=>i.getAttribute('src')),waapi:document.getAnimations().map(a=>({state:a.playState,name:a.animationName,target:String(a.effect?.target?.className)}))});
}
