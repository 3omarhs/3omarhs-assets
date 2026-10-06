// Original structural constructions. Names describe geometry, not certified FEFCO codes.
const definitions=[
 ['display-rounded','Rounded-header display','Rounded full-width backboard',{header:'rounded'}],
 ['display-arch','Arch-header display','Raised central arch backboard',{header:'arch'}],
 ['display-sloped','Sloping-side display','High back and low front walls',{header:'rounded',sloped:true,front:.45}],
 ['display-low-front','Low-front display','Easy-access product opening',{header:'square',front:.3}],
 ['display-notch','Thumb-notch display','Concave front access notch',{header:'square',notch:true}],
 ['display-window','Window-front display','Front display aperture',{header:'arch',window:'front'}],
 ['display-stepped','Stepped-header display','Raised rectangular center header',{header:'stepped'}],
 ['display-peaked','Peaked-header display','Angled promotional backboard',{header:'peaked'}],
 ['display-rollover','Rollover-wall display','Double-fold side walls and header',{header:'arch',returns:['left','right']}],
 ['tray-rollover','Four-wall rollover tray','Return panels on all four walls',{returns:['front','back','left','right']}],
 ['tray-notch','Thumb-notch tray','Open tray with front access notch',{notch:true}],
 ['tray-window','Window-front tray','Tray with a front cut-out',{window:'front'}],
 ['mailer-rollover','Rollover hinged mailer','Hinged lid with returning side walls',{lid:true,returns:['left','right']}],
 ['mailer-window','Window-lid mailer','Hinged lid with display aperture',{lid:true,window:'lid'}],
 ['book-wrap','Book-wrap presentation box','Full-depth front closing cover',{lid:true,cover:true}],
 ['book-window','Window book-wrap box','Book cover with viewing aperture',{lid:true,cover:true,window:'lid'}],
 ['triangular-tray','Triangular presentation tray','Three-sided open prism',{polygon:3}],
 ['hexagonal-tray','Hexagonal presentation tray','Six-sided open prism',{polygon:6}],
 ['octagonal-tray','Octagonal presentation tray','Eight-sided open prism',{polygon:8}],
 ['hexagonal-lid-base','Hexagonal lid & base','Two-piece hexagonal presentation',{polygon:6,coverPiece:true}]
];
export const extendedTemplates=definitions.map(([id,name,tag,construction])=>({id,name,tag,construction,category:'Trays',family:'tray',w:160,d:110,h:45}));
export function buildExtended(s,t,{w,d,h,g,poly,rect,flap,holes}){
 const c=t.construction;
 function arc(cx,cy,rx,ry,start,end,n=18){return Array.from({length:n+1},(_,i)=>{const a=start+(end-start)*i/n;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});}
 function polygonTray(prefix,bw,bd,bh,ox){
  let vertices=c.polygon===3?[[0,bd],[bw/2,0],[bw,bd]]:Array.from({length:c.polygon},(_,i)=>{const a=Math.PI/2+i*2*Math.PI/c.polygon;return [bw/2+bw/2*Math.cos(a),bd/2+bd/2*Math.sin(a)];});
  const xs=vertices.map(p=>p[0]),ys=vertices.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),pw=Math.max(...xs)-x0,ph=Math.max(...ys)-y0;vertices=vertices.map(([x,y])=>[(x-x0)*bw/pw,(y-y0)*bd/ph]);
  const points=vertices.map(([x,y])=>[x+ox,y]);poly(prefix+'bottom',prefix?'Lid face':'Base',points);
  points.forEach((a,i)=>{const b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),nx=dy/l,ny=-dx/l;
   poly(prefix+(i===0?'front':`side-${i}`),`${prefix?'Lid ':''}wall ${i+1}`,[a,b,[b[0]+nx*bh,b[1]+ny*bh],[a[0]+nx*bh,a[1]+ny*bh]]);
   // Separate corner glue tabs are applied during assembly; they are not guessed locks.
  });
 }
 if(c.polygon){polygonTray('',w,d,h,0);if(c.coverPiece){const clearance=s.lidClearance;polygonTray('lid-',w+clearance,d+clearance,Math.max(10,h*.55),w+2*h+30);}return;}
 const frontH=h*(c.front||1),backH=h;
 rect('bottom','Base',0,0,w,d);rect('back','Back wall',0,-backH,w,backH);
 if(c.notch){const r=Math.min(w*.16,frontH*.45);poly('front','Front with thumb notch',[[0,d],[w,d],[w,d+frontH],[w/2+r,d+frontH],...arc(w/2,d+frontH,r,r,0,-Math.PI),[0,d+frontH]]);}else rect('front','Front wall',0,d,w,frontH);
 if(c.sloped){poly('left','Sloping left wall',[[0,0],[0,d],[-frontH,d],[-h,0]]);poly('right','Sloping right wall',[[w,0],[w+h,0],[w+frontH,d],[w,d]]);}else{rect('left','Left wall',-h,0,h,d);rect('right','Right wall',w,0,h,d);}
 const glue=Math.min(g,d*.35,h*.5),ch=Math.min(4,glue*.25);
 for(const [x,id] of [[-h,'left'],[w,'right']]){
  flap(id+'-glue-top',`${id} rear glue tab`,x,0,h,glue,-1,'glue');
  const fw=c.sloped?frontH:h;flap(id+'-glue-bottom',`${id} front glue tab`,id==='left'?-fw:w,d,fw,glue,1,'glue');
 }
 for(const side of c.returns||[]){if(side==='left')rect('left-return','Left return wall',-2*h,glue,h,Math.max(1,d-2*glue),'return');if(side==='right')rect('right-return','Right return wall',w+h,glue,h,Math.max(1,d-2*glue),'return');if(side==='front')rect('front-return','Front return wall',glue,d+frontH,Math.max(1,w-2*glue),frontH,'return');if(side==='back')rect('back-return','Back return wall',glue,-2*h,Math.max(1,w-2*glue),h,'return');}
 if(c.header){const hh=s.header||Math.min(d,h*1.6),top=-h-hh,bottom=-h;let outline;
  if(c.header==='arch'){const shoulder=Math.min(hh*.45,w*.15),r=Math.min(w*.32,hh-shoulder);outline=[[0,bottom],[w,bottom],[w,top+r],[w/2+r,top+r],...arc(w/2,top+r,r,r,0,-Math.PI),[0,top+r]];}
  else if(c.header==='rounded'){const r=Math.min(w*.15,hh*.45);outline=[[0,bottom],[w,bottom],[w,top+r],...arc(w-r,top+r,r,r,0,-Math.PI/2),[r,top],...arc(r,top+r,r,r,-Math.PI/2,-Math.PI)];}
  else if(c.header==='stepped')outline=[[0,bottom],[w,bottom],[w,top+hh*.35],[w*.75,top+hh*.35],[w*.75,top],[w*.25,top],[w*.25,top+hh*.35],[0,top+hh*.35]];
  else if(c.header==='peaked')outline=[[0,bottom],[w,bottom],[w,top+hh*.4],[w/2,top],[0,top+hh*.4]];
  else outline=[[0,bottom],[w,bottom],[w,top],[0,top]];
  poly('header','Display backboard',outline,'header');
 }
 if(c.lid){rect('lid','Hinged cover',0,-h-d,w,d,'lid');flap('lid-tuck',c.cover?'Full front closing cover':'Lid tuck tab',0,-h-d,w,c.cover?h:s.tuck||Math.min(25,h*.7),-1,'tuck');if(!c.cover){const wing=Math.min(25,h*.65);poly('lid-left','Left lid wing',[[0,-h-d],[0,-h],[-wing,-h-ch],[-wing,-h-d+ch]],'flap');poly('lid-right','Right lid wing',[[w,-h-d],[w+wing,-h-d+ch],[w+wing,-h-ch],[w,-h]],'flap');}}
 if(c.window==='front')holes.push([[w*.2,d+frontH*.2],[w*.8,d+frontH*.2],[w*.8,d+frontH*.8],[w*.2,d+frontH*.8]]);
 if(c.window==='lid')holes.push([[w*.2,-h-d*.8],[w*.8,-h-d*.8],[w*.8,-h-d*.2],[w*.2,-h-d*.2]]);
}
