import {extendedTemplates,buildExtended} from './extended-structures.js';
export const templates = [
 {id:'straight',name:'Straight tuck carton',category:'Cartons',tag:'The everyday essential',family:'carton',w:80,d:50,h:120},
 {id:'reverse',name:'Reverse tuck carton',category:'Cartons',tag:'Alternating tuck closures',family:'carton',w:70,d:40,h:110},
 {id:'window',name:'Window carton',category:'Cartons',tag:'Let your product shine',family:'carton',w:90,d:50,h:130},
 {id:'cube',name:'Cube gift box',category:'Cartons',tag:'Small box. Big impression.',family:'carton',w:80,d:80,h:80},
 {id:'slim',name:'Tall product carton',category:'Cartons',tag:'For bottles & beauty',family:'carton',w:45,d:35,h:160},
 {id:'sleeve',name:'Packaging sleeve',category:'Cartons',tag:'A wrap around your brand',family:'sleeve',w:100,d:40,h:140},
 {id:'tray',name:'Open presentation tray',category:'Trays',tag:'Put your product on show',family:'tray',w:160,d:110,h:35},
 {id:'shallow',name:'Shallow gift tray',category:'Trays',tag:'Made for little treasures',family:'tray',w:180,d:120,h:20},
 {id:'hinged',name:'Hinged lid box',category:'Trays',tag:'An opening to remember',family:'tray',w:150,d:100,h:40},
 {id:'display',name:'Counter display box',category:'Trays',tag:'A standout on every shelf',family:'tray',w:160,d:110,h:60},
 {id:'two-piece',name:'Lid & base box',category:'Trays',tag:'A classic two-piece reveal',family:'tray',w:140,d:100,h:40},
 {id:'shipping',name:'Regular slotted carton',category:'Shipping',tag:'Simple, sturdy shipping',family:'shipping',w:200,d:150,h:160},
 {id:'full-overlap',name:'Full overlap carton',category:'Shipping',tag:'Full-depth outer closures',family:'shipping',w:200,d:150,h:160},
 {id:'half-slotted',name:'Half slotted container',category:'Shipping',tag:'Open top · bottom flaps only',family:'shipping',w:200,d:150,h:160},
 {id:'overlap',name:'Overlap slotted carton',category:'Shipping',tag:'25.4 mm nominal overlap',family:'shipping',w:200,d:150,h:160},
 {id:'center-special',name:'Center special carton',category:'Shipping',tag:'Both flap pairs meet centrally',family:'shipping',w:200,d:150,h:160},
 {id:'special-full',name:'Center special full overlap',category:'Shipping',tag:'Meeting inner · overlap outer',family:'shipping',w:200,d:150,h:160},
 {id:'seal-end',name:'Seal end carton',category:'Cartons',tag:'Glued or taped end closures',family:'shipping',w:90,d:45,h:150},
 {id:'header-card',name:'Header card carton',category:'Cartons',tag:'Extended back with hanging slot',family:'carton',w:80,d:40,h:120},
 {id:'full-telescope',name:'Full telescope box',category:'Trays',tag:'Full-height removable cover',family:'tray',w:160,d:110,h:45},
 {id:'drawer',name:'Sleeve & tray box',category:'Trays',tag:'Sliding tray · two-piece design',family:'tray',w:130,d:90,h:30},
 {id:'double-cover',name:'Double cover container',category:'Shipping',tag:'Body tube with two separate caps',family:'sleeve',w:140,d:100,h:150},
 ...extendedTemplates
];
export const materials={white:'#f4f0e8',kraft:'#c8a678',sage:'#a9bca5',lavender:'#c4bce4'};
export const defaults={type:'straight',w:80,d:50,h:120,glue:12,safe:3,unit:'mm',material:'white',labels:true,guides:false,art:null,artName:'',artWidth:0,artHeight:0,target:'front',fit:'contain',scale:100,ax:0,ay:0,rotate:0,scene:'studio',sheetLimit:false,sheetW:420,sheetH:297,allowRotate:true,thickness:.4,sizeMode:'manufacture',stock:'custom',tuck:0,dust:0,chamfer:0,lidClearance:2,header:0,lidOpening:0,objectColor:null};
export const stocks=[{id:'custom',name:'Custom material',thickness:null},{id:'paperboard',name:'Paperboard · 0.4 mm preset',thickness:.4},{id:'heavy-board',name:'Heavy paperboard · 0.7 mm preset',thickness:.7},{id:'e-flute',name:'E-flute · 1.5 mm preset',thickness:1.5},{id:'b-flute',name:'B-flute · 3 mm preset',thickness:3},{id:'c-flute',name:'C-flute · 4 mm preset',thickness:4}];
export const units={mm:1,cm:10,in:25.4};
export const fmt=n=>Number(n.toFixed(2)).toString();
export function nominalDimensions(s){const adjustment=s.sizeMode==='inner'?s.thickness:s.sizeMode==='outer'?-s.thickness:0;return {w:s.w+adjustment,d:s.d+adjustment,h:s.h+adjustment};}
export function validate(s){
 if(!templates.some(t=>t.id===s.type))throw Error('Choose a supported box template.');
 for(const k of ['w','d','h'])if(!Number.isFinite(s[k])||s[k]<10||s[k]>600)throw Error('Width, depth and height must each be between 10 and 600 mm.');
 if(!Number.isFinite(s.glue)||s.glue<3||s.glue>40)throw Error('Glue tab must be between 3 and 40 mm.');
 if(!Number.isFinite(s.safe)||s.safe<0||s.safe>10)throw Error('Safe inset must be between 0 and 10 mm.');
 if(!Number.isFinite(s.thickness)||s.thickness<0||s.thickness>5||!['manufacture','inner','outer'].includes(s.sizeMode))throw Error('Choose a valid size mode and a material thickness between 0 and 5 mm.');
 const nominal=nominalDimensions(s);if(s.glue>=Math.min(nominal.w,nominal.d,nominal.h))throw Error('Glue tab must be smaller than every nominal box dimension after thickness adjustment.');
 for(const [key,max] of [['tuck',100],['dust',300],['chamfer',30],['lidClearance',20],['header',300],['lidOpening',100]])if(!Number.isFinite(s[key])||s[key]<0||s[key]>max)throw Error(`Invalid ${key} setting. Use a value from 0 to ${max}.`);
 if(!stocks.some(m=>m.id===s.stock))throw Error('Choose a valid material preset.');
 if(s.objectColor!==null&&!/^#[0-9a-f]{6}$/i.test(s.objectColor))throw Error('Choose a valid object color.');
 if(s.tuck>=nominal.h||s.dust>Math.min(nominal.w/2,nominal.d))throw Error('Custom tuck length must be smaller than box height; dust depth cannot exceed half the width or the depth. Use 0 for automatic values.');
 if(typeof s.sheetLimit!=='boolean'||typeof s.allowRotate!=='boolean'||!Number.isFinite(s.sheetW)||!Number.isFinite(s.sheetH)||s.sheetW<10||s.sheetH<10||s.sheetW>3000||s.sheetH>3000)throw Error('Sheet limits must be between 10 and 3,000 mm per side.');
 return true;
}
export function sheetFit(s,g=build(s)){
 const eps=1e-7,direct=g.width<=s.sheetW+eps&&g.height<=s.sheetH+eps,rotated=s.allowRotate&&g.height<=s.sheetW+eps&&g.width<=s.sheetH+eps;
 const orientation=direct?0:rotated?90:0;
 return {fits:!s.sheetLimit||direct||rotated,rotation:orientation,width:orientation?g.height:g.width,height:orientation?g.width:g.height};
}
export function autoFit(s){
 if(!s.sheetLimit||sheetFit(s).fits)return {...s};
 const candidate=k=>({...s,w:s.w*k,d:s.d*k,h:s.h*k,glue:Math.max(3,s.glue*k),safe:s.safe*k,tuck:s.tuck*k,dust:s.dust*k,chamfer:s.chamfer*k,header:s.header*k});
 let low=Math.max(10/s.w,10/s.d,10/s.h),high=1;
 if(!sheetFit(candidate(low)).fits)return null;
 for(let i=0;i<50;i++){const mid=(low+high)/2;if(sheetFit(candidate(mid)).fits)low=mid;else high=mid;}
 // Round down physical inputs, so the displayed dimensions also respect the bound.
 const result=candidate(low);for(const k of ['w','d','h','glue','safe'])result[k]=Math.floor((result[k]+1e-9)*1000)/1000;
 return sheetFit(result).fits?result:candidate(low*(1-1e-9));
}
export function build(s){
 validate(s);const t=templates.find(t=>t.id===s.type),{w,d,h}=nominalDimensions(s),g=s.glue;let panels=[],holes=[];
 function poly(id,name,points,role='body'){const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);panels.push({id,name,points,role,x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)});}
 const rect=(id,name,x,y,a,b,role='body')=>poly(id,name,[[x,y],[x+a,y],[x+a,y+b],[x,y+b]],role);
 const flap=(id,name,x,y,a,b,dir=1,role='flap')=>{const k=s.chamfer?Math.min(s.chamfer,a*.45,Math.abs(b)*.45):Math.min(a*.14,Math.abs(b)*.22,8);poly(id,name,[[x,y],[x+a,y],[x+a-k,y+dir*b],[x+k,y+dir*b]],role);};
 if(t.construction){buildExtended(s,t,{w,d,h,g,poly,rect,flap,holes});}
 else if(['carton','sleeve','shipping'].includes(t.family)){
   let x=g;const widths=[w,d,w,d],names=['Front','Right side','Back','Left side'];
   poly('glue','Side seam glue tab',[[0,Math.min(g/2,h/4)],[g,0],[g,h],[0,h-Math.min(g/2,h/4)]],'glue');
   widths.forEach((a,i)=>{rect(['front','right','back','left'][i],names[i],x,0,a,h);x+=a;});
   if(t.family==='shipping'){
     x=g;widths.forEach((a,i)=>{for(const [dir,suffix] of [[-1,'top'],[1,'bottom']]){
       if(s.type==='half-slotted'&&dir===-1)continue;
       let length=d/2;
       if(i%2===0&&['full-overlap','special-full'].includes(s.type))length=d;
       if(i%2===1&&['center-special','special-full'].includes(s.type))length=w/2;
       if(i%2===0&&s.type==='overlap')length=Math.min(d,(d+25.4)/2);
       flap(`${suffix}-${i}`,`${names[i]} ${suffix} flap`,x,dir<0?0:h,a,length,dir);
     }x+=a;});
   }else if(t.family==='carton'){
     const lip=s.tuck||Math.min(20,Math.max(5,d*.28)),dust=s.dust||Math.min(w*.46,d*.8);
     for(const [dir,suffix,main] of [[-1,'top',0],[1,'bottom',s.type==='reverse'?2:0]]){
       const base=dir<0?0:h;let px=g;
       widths.forEach((a,i)=>{if(i===main){rect(`${suffix}-lid`,`${suffix==='top'?'Top':'Bottom'} closure`,px,dir<0?-d:h,a,d,'lid');flap(`${suffix}-tuck`,`${suffix==='top'?'Top':'Bottom'} tuck tab`,px,base+dir*d,a,lip,dir,'tuck');}else if(i===1||i===3)flap(`${suffix}-dust-${i}`,`${names[i]} ${suffix} dust flap`,px,base,a,dust,dir);px+=a;});
     }
     if(s.type==='window'){const mx=w*.18,my=h*.18;holes.push([[g+mx,my],[g+w-mx,my],[g+w-mx,h-my],[g+mx,h-my]]);}
     if(s.type==='header-card'){const hh=s.header||Math.min(d,h*.4),hx=g+w+d,k=Math.min(8,w*.1,hh*.4),slotW=Math.min(25,w*.5),slotH=Math.min(6,hh*.2);poly('header','Hanging header',[[hx,0],[hx+w,0],[hx+w,-hh+k],[hx+w-k,-hh],[hx+k,-hh],[hx,-hh+k]],'header');holes.push([[hx+(w-slotW)/2,-hh*.65],[hx+(w+slotW)/2,-hh*.65],[hx+(w+slotW)/2,-hh*.65+slotH],[hx+(w-slotW)/2,-hh*.65+slotH]]);}
   }
 }else{
   function tray(prefix,bw,bd,bh,ox=0,oy=0){
     rect(prefix+'bottom',prefix?'Lid face':'Base',ox,oy,bw,bd,'body');rect(prefix+'front',prefix?'Lid front wall':'Front',ox,oy+bd,bw,bh);
     rect(prefix+'back',prefix?'Lid back wall':'Back',ox,oy-bh,bw,bh);rect(prefix+'left',prefix?'Lid left wall':'Left side',ox-bh,oy,bh,bd);rect(prefix+'right',prefix?'Lid right wall':'Right side',ox+bw,oy,bh,bd);
     const tab=Math.min(g,bd*.4),k=Math.min(5,tab*.3);
     for(const [xx,side] of [[ox-bh,'left'],[ox+bw,'right']]){
       poly(prefix+side+'-glue-top',`${prefix?'Lid ':''}${side} rear glue tab`,[[xx,oy],[xx+bh,oy],[xx+bh-k,oy-tab],[xx+k,oy-tab]],'glue');
       poly(prefix+side+'-glue-bottom',`${prefix?'Lid ':''}${side} front glue tab`,[[xx,oy+bd],[xx+bh,oy+bd],[xx+bh-k,oy+bd+tab],[xx+k,oy+bd+tab]],'glue');
     }
   }
   tray('',w,d,h);
   if(s.type==='hinged'){
     rect('lid','Hinged lid',0,-h-d,w,d,'lid');flap('lid-tuck','Lid closing tab',0,-h-d,w,s.tuck||Math.min(h*.7,25),-1,'tuck');
     const wing=Math.min(h*.7,25),k=Math.min(5,d*.1);poly('lid-left','Lid left dust flap',[[0,-h-d],[0,-h],[-wing,-h-k],[-wing,-h-d+k]],'flap');poly('lid-right','Lid right dust flap',[[w,-h-d],[w,-h],[w+wing,-h-k],[w+wing,-h-d+k]],'flap');
   }
   if(s.type==='display'){const hh=s.header||Math.min(h*1.2,d),k=Math.min(18,w*.12,hh*.4);poly('header','Display header',[[0,-h],[w,-h],[w,-h-hh+k],[w-k,-h-hh],[k,-h-hh],[0,-h-hh+k]],'header');}
   if(['two-piece','full-telescope'].includes(s.type)){const clearance=s.lidClearance,lh=s.type==='full-telescope'?h+1:Math.max(10,h*.55);tray('lid-',w+clearance,d+clearance,lh,w+h+18+lh,0);}
   if(s.type==='drawer'){let sx=w+h+18;const sw=w+s.lidClearance,sh=h+s.lidClearance,sd=d+s.lidClearance;poly('sleeve-glue','Sleeve glue tab',[[sx,Math.min(4,sd/4)],[sx+g,0],[sx+g,sd],[sx,sd-Math.min(4,sd/4)]],'glue');sx+=g;for(const [i,ww] of [sw,sh,sw,sh].entries()){rect(`sleeve-${i}`,['Sleeve top','Sleeve right','Sleeve bottom','Sleeve left'][i],sx,0,ww,sd);sx+=ww;}}
 }
 if(s.type==='double-cover'){
   const cw=w+s.lidClearance,cd=d+s.lidClearance,ch=Math.max(10,Math.min(h*.3,40));let ox=g+2*(w+d)+20+ch;
   for(const prefix of ['top-cap-','bottom-cap-']){
     rect(prefix+'face',prefix==='top-cap-'?'Top cap face':'Bottom cap face',ox,0,cw,cd,'lid');rect(prefix+'front','Cap front wall',ox,cd,cw,ch);rect(prefix+'back','Cap back wall',ox,-ch,cw,ch);rect(prefix+'left','Cap left wall',ox-ch,0,ch,cd);rect(prefix+'right','Cap right wall',ox+cw,0,ch,cd);
     const tg=Math.min(g,cd*.4);for(const [xx,side] of [[ox-ch,'left'],[ox+cw,'right']]){flap(prefix+side+'-rear','Cap rear glue tab',xx,0,ch,tg,-1,'glue');flap(prefix+side+'-front','Cap front glue tab',xx,cd,ch,tg,1,'glue');}ox+=cw+2*ch+20;
   }
 }
 const minX=Math.min(...panels.map(p=>p.x)),minY=Math.min(...panels.map(p=>p.y));
 for(const p of panels){p.points=p.points.map(([x,y])=>[x-minX,y-minY]);p.x-=minX;p.y-=minY;}
 holes=holes.map(ps=>ps.map(([x,y])=>[x-minX,y-minY]));
 const width=Math.max(...panels.map(p=>p.x+p.w)),height=Math.max(...panels.map(p=>p.y+p.h));
 const {cuts,folds}=edges(panels);for(const hole of holes)hole.forEach((p,i)=>cuts.push([p,hole[(i+1)%hole.length]]));
 return {panels,holes,cuts,folds,width,height,template:t,nominal:{w,d,h}};
}
// Split shared edges at every vertex; shared segments are folds, exterior segments are cuts.
export function edges(panels){
 const vertices=panels.flatMap(p=>p.points),segments=new Map(),eps=1e-7;
 for(const p of panels)for(let i=0;i<p.points.length;i++){
   const a=p.points[i],b=p.points[(i+1)%p.points.length],dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
   if(len<eps)continue;
   const ts=[0,1];for(const v of vertices){const cross=(v[0]-a[0])*dy-(v[1]-a[1])*dx,u=((v[0]-a[0])*dx+(v[1]-a[1])*dy)/len;if(Math.abs(cross)<eps&&u>eps&&u<1-eps)ts.push(u);}
   const sorted=[...new Set(ts.map(v=>Number(v.toFixed(9))))].sort((a,b)=>a-b);
   for(let j=0;j<sorted.length-1;j++){const ps=[sorted[j],sorted[j+1]].map(t=>[a[0]+dx*t,a[1]+dy*t]);const key=ps.map(v=>v.map(n=>n.toFixed(5)).join(',')).sort().join('|');const item=segments.get(key);if(item)item.count++;else segments.set(key,{points:ps,count:1});}
 }
 return {cuts:[...segments.values()].filter(s=>s.count===1).map(s=>s.points),folds:[...segments.values()].filter(s=>s.count===2).map(s=>s.points)};
}
export const escapeXML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export const artworkDef=s=>s.art?`<image id="art-source" href="${escapeXML(s.art)}" width="${s.artWidth}" height="${s.artHeight}"/>`:'';
const points=ps=>ps.map(p=>p.join(',')).join(' ');
const line=ps=>`M${ps[0].join(' ')}L${ps[1].join(' ')}`;
export function artwork(s,box){
 if(!s.art)return '';
 const cx=box.x+box.w/2+s.ax*box.w/100,cy=box.y+box.h/2+s.ay*box.h/100;
 const rotated=s.rotate%180!==0,iw=rotated?s.artHeight:s.artWidth,ih=rotated?s.artWidth:s.artHeight;
 const factor=(s.fit==='cover'?Math.max(box.w/iw,box.h/ih):Math.min(box.w/iw,box.h/ih))*s.scale/100;
 return `<use href="#art-source" transform="translate(${cx} ${cy}) rotate(${s.rotate}) scale(${factor}) translate(${-s.artWidth/2} ${-s.artHeight/2})"/>`;
}
export function panelArtwork(s,p,geo){
 if(!s.art||p.role==='glue')return '';
 if(s.target==='wrap')return artwork(s,{x:0,y:0,w:geo.width,h:geo.height});
 if(s.target===p.id||(s.target==='all'&&['body','lid','header'].includes(p.role)))return artwork(s,p);
 return '';
}
export function svg(s,geo,{preview=false,layer='all',labels=s.labels,selected=null}={}){
 const {width:W,height:H,panels,holes}=geo,margin=preview?22:0,unit=units[s.unit];
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="${W+margin*2}mm" height="${H+margin*2}mm" viewBox="${-margin} ${-margin} ${W+margin*2} ${H+margin*2}" role="img" aria-label="${escapeXML(geo.template.name)} dieline"><defs>`;
 out+=artworkDef(s);
 for(const p of panels)out+=`<clipPath id="clip-${p.id}"><polygon points="${points(p.points)}"/></clipPath>`;
 out+=`<mask id="window-mask"><rect width="${W}" height="${H}" fill="white"/>${holes.map(ps=>`<polygon points="${points(ps)}" fill="black"/>`).join('')}</mask></defs>`;
 if(layer==='all'||layer==='art'){
   out+='<g id="Artwork" mask="url(#window-mask)">';
   for(const p of panels)out+=`<g data-panel="${p.id}" ${preview?'tabindex="0" role="button" aria-label="'+escapeXML(p.name)+'"':''}><polygon points="${points(p.points)}" fill="${p.role==='glue'?'#e2ded5':s.objectColor||materials[s.material]}"/><g clip-path="url(#clip-${p.id})">${panelArtwork(s,p,geo)}</g>${selected===p.id&&preview?`<polygon points="${points(p.points)}" fill="#7560d6" fill-opacity=".12" stroke="#7560d6" stroke-width=".8"/>`:''}</g>`;
   out+='</g>';
 }
 if(layer==='all'||layer==='cuts')out+=`<g id="Cut-lines" fill="none" stroke="${preview?'#8d7da8':'#e02a86'}" stroke-width="${preview?.4:.2}" stroke-linejoin="round">${geo.cuts.map(ps=>`<path d="${line(ps)}"/>`).join('')}</g>`;
 if(layer==='all'||layer==='folds')out+=`<g id="Fold-lines" fill="none" stroke="${preview?'#c9a073':'#36a4bd'}" stroke-width="${preview?.35:.2}" stroke-dasharray="2 1.4">${geo.folds.map(ps=>`<path d="${line(ps)}"/>`).join('')}</g>`;
 if((layer==='all'||layer==='guides')&&s.guides){out+='<g id="Safe-guides" fill="none" stroke="#6ba78c" stroke-width=".2" stroke-dasharray="1 1">';for(const p of panels)if(p.role==='body'&&p.w>s.safe*2&&p.h>s.safe*2)out+=`<rect x="${p.x+s.safe}" y="${p.y+s.safe}" width="${p.w-2*s.safe}" height="${p.h-2*s.safe}"/>`;out+='</g>';}
 if(labels&&(layer==='all'||layer==='labels')){
   out+='<g id="Measurements" font-family="Arial,sans-serif" text-anchor="middle" fill="#8a7b9d" pointer-events="none">';
   for(const p of panels){const fs=Math.max(1.5,Math.min(p.w/12,p.h/5,4));out+=`<text x="${p.x+p.w/2}" y="${p.y+p.h/2-fs*.15}" font-size="${fs}" paint-order="stroke" stroke="#faf8f4" stroke-width=".7">${escapeXML(p.name)}<tspan x="${p.x+p.w/2}" dy="${fs*1.5}" font-size="${fs*.8}">${fmt(p.w/unit)} × ${fmt(p.h/unit)} ${s.unit}</tspan></text>`;}
   out+='</g>';
 }
 if(preview){out+=`<g stroke="#beb5ce" stroke-width=".3" fill="none"><path d="M0 -8V-15M${W} -8V-15M0 -12H${W}M-8 0H-15M-8 ${H}H-15M-12 0V${H}"/></g><g font-family="Arial,sans-serif" font-size="4" fill="#998aaa" text-anchor="middle"><text x="${W/2}" y="-15">${fmt(W/unit)} ${s.unit}</text><text transform="translate(-16 ${H/2}) rotate(-90)">${fmt(H/unit)} ${s.unit}</text></g>`;}
 if(preview&&selected){const p=panels.find(p=>p.id===selected);if(p){const pad=Math.min(5,p.w*.1,p.h*.1),fs=Math.min(3,p.w/12,p.h/7);out+=`<defs><marker id="measurement-arrow" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M6 0L0 3L6 6" fill="none" stroke="#3475bb" stroke-width="1"/></marker></defs><g fill="none" stroke="#3475bb" stroke-width=".35" pointer-events="none"><path d="M${p.x+pad} ${p.y+p.h-pad}H${p.x+p.w-pad}M${p.x+p.w-pad} ${p.y+pad}V${p.y+p.h-pad}" marker-start="url(#measurement-arrow)" marker-end="url(#measurement-arrow)"/></g><g fill="#3475bb" font-family="Arial,sans-serif" font-size="${fs}" text-anchor="middle" pointer-events="none"><text x="${p.x+p.w/2}" y="${p.y+p.h-pad-fs}">${fmt(p.w/unit)} ${s.unit}</text><text transform="translate(${p.x+p.w-pad-fs} ${p.y+p.h/2}) rotate(-90)">${fmt(p.h/unit)} ${s.unit}</text></g>`;}}
 return out+'</svg>';
}
