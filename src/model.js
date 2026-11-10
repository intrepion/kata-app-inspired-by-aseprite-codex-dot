export const LIMITS = { size:128, frames:32, layers:12, cells:2000000 };
export const PALETTE = ['#182a32','#253e46','#3c5860','#607c80','#9eb7ae','#dce8d5','#fff3cf','#eed49b','#edab73','#d97b50','#a94c39','#673f3b','#203b39','#2c5648','#37745a','#4c9670','#76b886','#a5d39b','#193647','#28576b','#3c8391','#6dc4be','#9285aa','#c3a7c8'];
export function blankPixels(w,h){return Array(w*h).fill(null);}
export function createProject(width=32,height=32,name='Untitled sprite'){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>128||height>128)throw new Error('Canvas dimensions must be whole numbers from 1 to 128.');
  return {format:'pixel-loom',version:1,name:name.slice(0,60)||'Untitled sprite',width,height,fps:8,palette:[...PALETTE],layers:[{name:'Layer 1',visible:true,opacity:100}],frames:[{cels:[blankPixels(width,height)]}]};
}
export const clone = value=>structuredClone(value);
export function validateProject(raw){
  if(!raw||raw.format!=='pixel-loom'||raw.version!==1)throw new Error('This is not a Pixel Loom v1 project.');
  const p=createProject(raw.width,raw.height,typeof raw.name==='string'?raw.name:'Untitled sprite');
  if(!Array.isArray(raw.layers)||!raw.layers.length||raw.layers.length>LIMITS.layers)throw new Error('Projects need 1–12 layers.');
  if(!Array.isArray(raw.frames)||!raw.frames.length||raw.frames.length>LIMITS.frames)throw new Error('Projects need 1–32 frames.');
  if(raw.width*raw.height*raw.layers.length*raw.frames.length>LIMITS.cells)throw new Error('This project exceeds the two-million-pixel storage limit.');
  p.palette=Array.isArray(raw.palette)?raw.palette.filter(c=>typeof c==='string'&&/^#[0-9a-f]{6}$/i.test(c)).slice(0,48):[...PALETTE];
  if(!p.palette.length)p.palette=[...PALETTE];
  p.fps=Number.isInteger(raw.fps)&&raw.fps>=1&&raw.fps<=24?raw.fps:8;
  p.layers=raw.layers.map((l)=>({name:typeof l.name==='string'?l.name.slice(0,40):'Layer',visible:l.visible!==false,opacity:Number.isFinite(l.opacity)?Math.max(0,Math.min(100,l.opacity)):100}));
  p.frames=raw.frames.map(f=>{
    if(!Array.isArray(f.cels)||f.cels.length!==p.layers.length)throw new Error('Frame layers are incomplete.');
    return {cels:f.cels.map(c=>{
      if(!Array.isArray(c)||c.length!==p.width*p.height)throw new Error('Pixel dimensions do not match.');
      if(c.some(v=>v!==null&&(typeof v!=='string'||!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(v))))throw new Error('Project contains invalid pixel colors.');
      return c.map(v=>v?.toLowerCase()??null);
    })};
  });return p;
}
export function putPixel(p,frame,layer,x,y,color,size=1,mirror=false){
  const cel=p.frames[frame].cels[layer], offset=Math.floor((size-1)/2);
  for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++){
    const px=x+dx-offset,py=y+dy-offset;
    if(px>=0&&py>=0&&px<p.width&&py<p.height){cel[py*p.width+px]=color;if(mirror)cel[py*p.width+(p.width-1-px)]=color;}
  }
}
export function line(p,f,l,x0,y0,x1,y1,color,size=1,mirror=false){
  const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy;
  while(true){putPixel(p,f,l,x0,y0,color,size,mirror);if(x0===x1&&y0===y1)break;const e=2*err;if(e>=dy){err+=dy;x0+=sx;}if(e<=dx){err+=dx;y0+=sy;}}
}
export function rectangle(p,f,l,a,b,color,filled=false){
  const left=Math.min(a.x,b.x),right=Math.max(a.x,b.x),top=Math.min(a.y,b.y),bottom=Math.max(a.y,b.y);
  for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++)if(filled||x===left||x===right||y===top||y===bottom)putPixel(p,f,l,x,y,color);
}
export function floodFill(p,f,l,x,y,color){
  if(x<0||y<0||x>=p.width||y>=p.height)return;
  const cel=p.frames[f].cels[l],target=cel[y*p.width+x];if(target===color)return;
  const stack=[[x,y]];cel[y*p.width+x]=color;
  while(stack.length){const [a,b]=stack.pop();for(const [nx,ny] of [[a+1,b],[a-1,b],[a,b+1],[a,b-1]]){
    if(nx>=0&&ny>=0&&nx<p.width&&ny<p.height&&cel[ny*p.width+nx]===target){cel[ny*p.width+nx]=color;stack.push([nx,ny]);}
  }}
}
export function flipCel(p,f,l,horizontal=true){
  const src=p.frames[f].cels[l],dest=blankPixels(p.width,p.height);
  for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++)dest[y*p.width+x]=src[(horizontal?y:p.height-1-y)*p.width+(horizontal?p.width-1-x:x)];p.frames[f].cels[l]=dest;
}
export function canAdd(p,frames=p.frames.length,layers=p.layers.length){return frames<=LIMITS.frames&&layers<=LIMITS.layers&&p.width*p.height*frames*layers<=LIMITS.cells;}
export function addLayer(p,name='New layer'){
  if(!canAdd(p,p.frames.length,p.layers.length+1))throw new Error('Layer or project size limit reached.');
  p.layers.push({name,visible:true,opacity:100});p.frames.forEach(f=>f.cels.push(blankPixels(p.width,p.height)));return p.layers.length-1;
}
export function addFrame(p,index,duplicate=true){
  if(!canAdd(p,p.frames.length+1))throw new Error('Frame or project size limit reached.');
  p.frames.splice(index+1,0,{cels:duplicate?clone(p.frames[index].cels):p.layers.map(()=>blankPixels(p.width,p.height))});return index+1;
}
export function rgba(color){if(!color)return [0,0,0,0];return [parseInt(color.slice(1,3),16),parseInt(color.slice(3,5),16),parseInt(color.slice(5,7),16),color.length===9?parseInt(color.slice(7,9),16):255];}
export function composite(p,frame){
  const out=new Uint8ClampedArray(p.width*p.height*4);
  p.layers.forEach((layer,l)=>{
    if(!layer.visible||!layer.opacity)return;
    p.frames[frame].cels[l].forEach((color,i)=>{
      if(!color)return;const [r,g,b,a]=rgba(color),sa=a/255*layer.opacity/100,da=out[i*4+3]/255,oa=sa+da*(1-sa);
      if(!oa)return;
      for(const [n,v] of [r,g,b].entries())out[i*4+n]=(v*sa+out[i*4+n]*da*(1-sa))/oa;
      out[i*4+3]=oa*255;
    });
  });return out;
}
export class History{
  constructor(){this.undo=[];this.redo=[];this.bytes=0;}
  push(before){const s=JSON.stringify(before);this.undo.push(s);this.bytes+=s.length;this.redo=[];while(this.undo.length>30||(this.bytes>20000000&&this.undo.length>1))this.bytes-=this.undo.shift().length;}
  back(current){if(!this.undo.length)return null;this.redo.push(JSON.stringify(current));const s=this.undo.pop();this.bytes-=s.length;return JSON.parse(s);}
  forward(current){if(!this.redo.length)return null;const s=JSON.stringify(current);this.undo.push(s);this.bytes+=s.length;return JSON.parse(this.redo.pop());}
}
