import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for (const p of ['index.html','styles.css','favicon.svg','src']) await cp(p,`dist/${p}`,{recursive:true});
console.log('Built static app in dist/');
