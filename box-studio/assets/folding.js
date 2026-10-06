import {svg,materials,artworkDef,panelArtwork,escapeXML} from './geometry.js';

const cache=new WeakMap();let renderSequence=0;
const identity=()=>[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
function multiply(a,b){const c=Array(16).fill(0);for(let r=0;r<4;r++)for(let col=0;col<4;col++)for(let k=0;k<4;k++)c[r*4+col]+=a[r*4+k]*b[k*4+col];return c;}
function translate(x,y,z){const m=identity();m[3]=x;m[7]=y;m[11]=z;return m;}
function rotateAxis(x,y,z,angle){const l=Math.hypot(x,y,z);x/=l;y/=l;z/=l;const c=Math.cos(angle),s=Math.sin(angle),u=1-c;return [c+x*x*u,x*y*u-z*s,x*z*u+y*s,0, y*x*u+z*s,c+y*y*u,y*z*u-x*s,0, z*x*u-y*s,z*y*u+x*s,c+z*z*u,0, 0,0,0,1];}
export function transformPoint(m,[x,y,z=0]){return [m[0]*x+m[1]*y+m[2]*z+m[3],m[4]*x+m[5]*y+m[6]*z+m[7],m[8]*x+m[9]*y+m[10]*z+m[11]];}
function hinge(a,b,angle){return multiply(translate(a[0],a[1],0),multiply(rotateAxis(b[0]-a[0],b[1]-a[1],0,angle),translate(-a[0],-a[1],0)));}
const center=p=>[p.x+p.w/2,p.y+p.h/2];
function onSegment(v,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;if(!l)return false;const t=((v[0]-a[0])*dx+(v[1]-a[1])*dy)/l;return t>=-1e-6&&t<=1+1e-6&&Math.abs((v[0]-a[0])*dy-(v[1]-a[1])*dx)<1e-5;}
function panelHasEdge(p,a,b){return p.points.some((v,i)=>onSegment(a,v,p.points[(i+1)%p.points.length])&&onSegment(b,v,p.points[(i+1)%p.points.length]));}
export function foldingGraph(geo){
 if(cache.has(geo))return cache.get(geo);
 const adj=new Map(geo.panels.map(p=>[p.id,[]]));
 for(const edge of geo.folds){const owners=geo.panels.filter(p=>panelHasEdge(p,...edge));if(owners.length===2){adj.get(owners[0].id).push({id:owners[1].id,edge});adj.get(owners[1].id).push({id:owners[0].id,edge});}}
 const preferred=['bottom','front','lid-bottom','sleeve-0','top-cap-face','bottom-cap-face'];
 const order=[...geo.panels].sort((a,b)=>(preferred.includes(a.id)?preferred.indexOf(a.id):100)-(preferred.includes(b.id)?preferred.indexOf(b.id):100));
 const nodes=[],seen=new Set(),roots=[];
 for(const root of order){if(seen.has(root.id))continue;roots.push(root.id);const queue=[{id:root.id,parent:null,root:root.id,edge:null}];seen.add(root.id);
   while(queue.length){const node=queue.shift();nodes.push(node);for(const next of adj.get(node.id))if(!seen.has(next.id)){seen.add(next.id);queue.push({id:next.id,parent:node.id,root:root.id,edge:next.edge});}}
 }
 const graph={nodes,roots};cache.set(geo,graph);return graph;
}
const clamp=n=>Math.max(0,Math.min(1,n));
export function unfoldingPhase(value){const v=Math.max(0,Math.min(100,value));return {opening:clamp(v/40),unfold:clamp((v-40)/60),name:v===0?'Closed':v<40?'Opening':v===40?'Open':v<100?'Unfolding':'Flat dieline'};}
export function foldedPanels(state,geo){
 const phase=unfoldingPhase(state.lidOpening),graph=foldingGraph(geo),byId=new Map(geo.panels.map(p=>[p.id,p])),matrices=new Map(),first=byId.get(graph.roots[0]),fc=center(first);
 const result=[];
 for(const node of graph.nodes){const panel=byId.get(node.id);let matrix;
   if(!node.parent){
     matrix=identity();
     if(node.id!==first.id){
       const pc=center(panel),fold=1-phase.unfold;let target=[...fc,0],angle=0;
       if(node.id==='lid-bottom'){target=[fc[0]+phase.opening*geo.nominal.w*.65,fc[1],geo.nominal.h*(1+.7*phase.opening)];angle=Math.PI;}
       else if(node.id==='sleeve-0'){target=[fc[0]+phase.opening*geo.nominal.w*.65,fc[1],geo.nominal.h];}
       else if(node.id==='top-cap-face'){target=[fc[0],first.y-geo.nominal.h*.5*phase.opening,-geo.nominal.d/2];angle=-Math.PI/2;}
       else if(node.id==='bottom-cap-face'){target=[fc[0],first.y+first.h+geo.nominal.h*.5*phase.opening,-geo.nominal.d/2];angle=Math.PI/2;}
       matrix=multiply(translate((target[0]-pc[0])*fold,(target[1]-pc[1])*fold,target[2]*fold),multiply(translate(pc[0],pc[1],0),multiply(rotateAxis(1,0,0,angle*fold),translate(-pc[0],-pc[1],0))));
     }
   }else{
     const [a,b]=node.edge,cc=center(panel),cross=(b[0]-a[0])*(cc[1]-a[1])-(b[1]-a[1])*(cc[0]-a[0]);
     const sign=geo.template.family==='tray'&&!node.root.startsWith('sleeve')?1:node.root.includes('cap-face')?1:-1;
     let fraction=1-phase.unfold;
     if(panel.id==='header')fraction=0;
     const foldAngle=panel.role==='return'?Math.PI:Math.PI/2;
     if(panel.id==='lid'||panel.id==='top-lid'||panel.id.startsWith('top-dust')||panel.id.startsWith('top-tuck')||panel.id.startsWith('lid-tuck')||panel.id.startsWith('lid-left')||panel.id.startsWith('lid-right')||panel.id.startsWith('top-')&&geo.template.family==='shipping')fraction*=1-phase.opening;
     matrix=multiply(matrices.get(node.parent),hinge(a,b,Math.sign(cross)*sign*foldAngle*fraction));
   }
   matrices.set(node.id,matrix);result.push({panel,matrix,points:panel.points.map(p=>transformPoint(matrix,p)),parent:node.parent,edge:node.edge});
 }
 return {panels:result,phase};
}
export function foldedSceneSVG(state,geo,{width=800,height=520,angle=-22,compact=false,background=false,id}={}){
 const prefix=id||`fold-scene-${++renderSequence}`,model=foldedPanels(state,geo),fade=1-model.phase.unfold;
 const camera=multiply(rotateAxis(1,0,0,Math.PI*.31*fade),rotateAxis(0,0,1,angle*Math.PI/180*fade));
 const projected=model.panels.map(item=>{const matrix=multiply(camera,item.matrix),points=item.panel.points.map(p=>transformPoint(matrix,p));return {...item,matrix,points,depth:points.reduce((n,p)=>n+p[2],0)/points.length};}).sort((a,b)=>a.depth-b.depth);
 const vertices=projected.flatMap(p=>p.points),xs=vertices.map(p=>p[0]),ys=vertices.map(p=>p[1]);const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
 const padding=compact?8:35,k=Math.min((width-padding*2)/Math.max(w,1),(height-padding*2)/Math.max(h,1)),tx=(width-w*k)/2-x0*k,ty=(height-h*k)/2-y0*k;
 const art=content=>content.replaceAll('id="art-source"',`id="${prefix}-art"`).replaceAll('href="#art-source"',`href="#${prefix}-art"`);
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXML(geo.template.name)}: ${model.phase.name}"><defs>${art(artworkDef(state))}`;
 for(const {panel:p} of projected){out+=`<clipPath id="${prefix}-${p.id}"><polygon points="${p.points.map(v=>v.join(',')).join(' ')}"/></clipPath>`;}
 out+=`<mask id="${prefix}-windows" maskUnits="userSpaceOnUse" x="-10" y="-10" width="${geo.width+20}" height="${geo.height+20}"><rect x="-10" y="-10" width="${geo.width+20}" height="${geo.height+20}" fill="white"/>${geo.holes.map(ps=>`<polygon points="${ps.map(p=>p.join(',')).join(' ')}" fill="black"/>`).join('')}</mask></defs>`;
 if(background)out+=`<rect width="${width}" height="${height}" fill="${background===true?'#f3f4f6':escapeXML(background)}"/>`;
 out+=`<g transform="translate(${tx} ${ty}) scale(${k})">`;
 for(const {panel:p,matrix:m} of projected){const shade=Math.min(.18,Math.max(0,(1-Math.abs(m[10]))*.12+(m[2]<0?.04:0))),transform=`matrix(${m[0]} ${m[4]} ${m[1]} ${m[5]} ${m[3]} ${m[7]})`;
   // Display artwork on the visible side of a panel, including back-facing folds.
   // This preview convention does not alter the printable artwork coordinates.
   const visibleArt=m[0]*m[5]-m[1]*m[4]<0?`translate(0 ${2*p.y+p.h}) scale(1 -1)`:'';
   out+=`<g transform="${transform}" mask="url(#${prefix}-windows)"><polygon points="${p.points.map(v=>v.join(',')).join(' ')}" fill="${p.role==='glue'?'#d7c7ae':state.objectColor||materials[state.material]}"/><g clip-path="url(#${prefix}-${p.id})"><g transform="${visibleArt}">${art(panelArtwork(state,p,geo))}</g></g><polygon points="${p.points.map(v=>v.join(',')).join(' ')}" fill="#1c2532" fill-opacity="${shade}" stroke="#897b6766" stroke-width="${compact?.6:.35}" stroke-linejoin="round"/></g>`;
 }
 if(model.phase.unfold===1)out+=`<g fill="none" stroke="#bd824d" stroke-width=".35" stroke-dasharray="2 1.4">${geo.folds.map(([a,b])=>`<path d="M${a.join(' ')}L${b.join(' ')}"/>`).join('')}</g>`;
 return out+'</g></svg>';
}
