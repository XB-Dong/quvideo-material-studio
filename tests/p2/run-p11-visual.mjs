// Keep the inherited P1.1 module untouched while selecting an isolated public origin.
import net from 'node:net';
const port=Number(new URL(process.env.BASE_URL).port||80);
let relay;
if(port!==3000){
 relay=net.createServer(client=>{const upstream=net.connect(Number(process.env.RELAY_PORT||3000),process.env.RELAY_HOST||'frontend');client.pipe(upstream);upstream.pipe(client);client.on('error',()=>upstream.destroy());upstream.on('error',()=>client.destroy())});
 await new Promise((resolve,reject)=>{relay.once('error',reject);relay.listen(port,'127.0.0.1',resolve)});
}
try{await import('/checks/visual.mjs')}finally{await new Promise(resolve=>relay?relay.close(resolve):resolve())}
