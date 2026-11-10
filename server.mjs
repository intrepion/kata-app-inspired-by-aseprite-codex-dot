import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root = resolve(process.cwd());
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.md':'text/plain'};
const server = http.createServer(async (req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let path = resolve(root,'.'+pathname);
    if (path!==root && !path.startsWith(root+sep)) {res.writeHead(403);return res.end('Forbidden');}
    if ((await stat(path)).isDirectory()) path=resolve(path,'index.html');
    const body=await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(body);
  } catch {res.writeHead(404);res.end('Not found');}
});
const args=process.argv.slice(2);const option=(key,fallback)=>{const i=args.indexOf(key);return i>=0?args[i+1]:fallback;};
const port=Number(option('--port',process.env.PORT||5173));const host=option('--host','127.0.0.1');server.listen(port,host,()=>console.log(`Pixel Loom: http://localhost:${port}`));
