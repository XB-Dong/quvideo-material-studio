import assert from 'node:assert/strict';
export async function seed(context,base,{count=3,delay=50}={}){
 const session=await context.request.post(base+'/api/session',{headers:{Origin:'http://localhost:3000'}});assert(session.ok());
 const template=await(await context.request.get(base+'/api/templates/demo-pet')).json(),photo=await context.request.get(base+template.coverUrl);
 const uploaded=await context.request.post(base+'/api/assets',{headers:{Origin:'http://localhost:3000'},multipart:{templateId:template.id,file:{name:'fixture.jpg',mimeType:'image/jpeg',buffer:await photo.body()}}});assert.equal(uploaded.status(),201);const asset=await uploaded.json(),tasks=[];
 for(let i=0;i<count;i++){const response=await context.request.post(base+'/api/tasks',{headers:{Origin:'http://localhost:3000'},data:{templateId:template.id,assetIds:[asset.id],simulation:{failAt:i===count-1?'GENERATE':null,delayMs:{assetCheck:delay,generate:delay,finalize:delay}}}});assert.equal(response.status(),202);tasks.push(await response.json())}
 const outcomes=[];for(const t of tasks){for(let i=0;i<100;i++){const result=await(await context.request.get(base+'/api/tasks/'+t.id)).json();if(['SUCCEEDED','FAILED'].includes(result.status)){outcomes.push(result);break;}await new Promise(r=>setTimeout(r,100))}}
 assert.equal(outcomes.length,count);return {template,asset,outcomes};
}
