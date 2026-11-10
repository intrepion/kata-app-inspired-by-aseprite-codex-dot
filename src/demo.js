import {createProject,addLayer,addFrame,putPixel,line,rectangle} from './model.js';
export function demoProject(){
  const p=createProject(64,64,'Mosslight cottage');p.fps=6;p.layers[0].name='Floating garden';addLayer(p,'Cottage');addLayer(p,'Fireflies');
  const pixel=(l,x,y,c)=>putPixel(p,0,l,x,y,c);
  const rect=(l,x,y,w,h,c)=>rectangle(p,0,l,{x,y},{x:x+w-1,y:y+h-1},c,true);
  const ellipse=(l,cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++)if(x*x/(rx*rx)+y*y/(ry*ry)<=1)pixel(l,cx+x,cy+y,c);};
  const C={ink:'#182a32',deep:'#203b39',pine:'#2c5648',leaf:'#4c9670',mint:'#a5d39b',moss:'#76b886',gold:'#eed49b',cream:'#fff3cf',wood:'#a94c39',rust:'#d97b50',peach:'#edab73'};
  // Original geometric pixel illustration, authored for Pixel Loom.
  ellipse(0,32,49,23,5,'#132b30');ellipse(0,31,46,23,8,C.ink);ellipse(0,31,44,24,7,C.deep);ellipse(0,31,42,24,6,C.pine);
  for(let y=44;y<51;y++)for(let x=12;x<53;x++)if((x*17+y*13)%19<3&&p.frames[0].cels[0][y*64+x])pixel(0,x,y,'#3b4c45');
  ellipse(0,31,40,23,6,C.leaf);ellipse(0,31,39,21,5,C.moss);ellipse(0,31,39,18,3,C.leaf);
  for(const [x,y]of [[12,38],[17,34],[49,37],[53,41],[44,43],[14,43],[28,45],[40,35]]){line(p,0,0,x,y,x-2,y-5,C.pine);line(p,0,0,x,y,x+2,y-3,C.moss);pixel(0,x,y-4,C.mint);}
  rect(1,22,24,22,17,C.ink);rect(1,24,25,18,15,C.peach);rect(1,24,33,18,7,C.rust);rect(1,25,39,17,2,C.wood);
  rect(1,28,30,9,11,C.ink);rect(1,30,31,5,10,C.wood);pixel(1,33,36,C.gold);
  rect(1,39,29,2,6,C.ink);rect(1,39,30,2,4,C.gold);rect(1,24,29,2,5,C.gold);
  ellipse(1,32,24,20,5,C.ink);ellipse(1,32,21,19,6,C.wood);ellipse(1,32,18,17,7,C.rust);ellipse(1,32,16,13,6,C.peach);ellipse(1,32,13,8,4,C.gold);
  rect(1,17,21,29,2,C.rust);rect(1,19,23,26,2,C.peach);rect(1,23,25,19,2,C.gold);
  for(const [x,y,w]of [[23,14,3],[33,10,3],[39,16,4],[17,20,3],[30,19,4]]){rect(1,x,y,w,2,C.cream);}
  rect(1,29,41,7,2,'#dce8d5');rect(0,30,43,6,2,'#9eb7ae');rect(0,33,45,6,2,'#9eb7ae');
  // Small sapling and a lantern beside the front door.
  rect(1,11,28,2,10,C.wood);ellipse(1,12,25,6,6,C.deep);ellipse(1,11,23,5,5,C.leaf);ellipse(1,9,21,3,3,C.moss);pixel(1,9,20,C.mint);
  rect(1,47,32,1,9,C.ink);rect(1,46,30,3,4,C.ink);pixel(1,47,31,C.cream);pixel(1,47,32,C.gold);
  for(let f=1;f<4;f++)addFrame(p,f-1,true);
  for(let f=0;f<4;f++){
    for(const [x,y] of [[18+f%2,9],[49-f%2,20],[8+f%3,34],[54,31-f%2],[41+f%2,7]]){
      putPixel(p,f,2,x,y,C.gold);if(f%2===0){putPixel(p,f,2,x-1,y,'#92856a');putPixel(p,f,2,x+1,y,'#92856a');putPixel(p,f,2,x,y-1,'#92856a');putPixel(p,f,2,x,y+1,'#92856a');}
    }
  }return p;
}
