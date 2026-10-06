import {defaults,templates,build,escapeXML} from './geometry.js';
import {foldedSceneSVG} from './folding.js';
import {rasterize,download,encodePSD} from './exports.js';

const paint=(d,fill='url(#material)',extra='')=>`<path d="${d}" fill="${fill}" stroke="#263a4833" stroke-width="1.5" stroke-linejoin="round" ${extra}/>`;
const rect=(x,y,w,h,r=6,fill='url(#material)')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="#263a4833" stroke-width="1.5"/>`;
const ellipse=(x,y,rx,ry,fill='url(#rim)')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="#263a4833" stroke-width="1.5"/>`;
const line=(d,color='#ffffff66',width=2)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const label=(art,x,y,w,h)=>{if(!art?.art)return '';const k=Math.min(w/art.artWidth,h/art.artHeight);return `<use href="#brand-image" transform="translate(${x+w/2} ${y+h/2}) scale(${k}) translate(${-art.artWidth/2} ${-art.artHeight/2})"/>`;};

export function boxMockupState(variant,art,options={}){
 const t=templates.find(t=>t.id===variant.model.profile),size=variant.size;
 let w=t.w*size.factor*size.ratio,d=t.d*size.factor,h=t.h*size.factor/Math.sqrt(size.ratio);
 if(variant.model.id==='pizza-box')h=25*size.factor;
 if(variant.model.id==='cake-box')h=70*size.factor;
 return {...defaults,type:t.id,w,d,h,glue:Math.min(12,Math.min(w,d,h)/2),material:variant.style.material,objectColor:options.color||variant.style.color,
   ...(art||{}),target:'front',labels:false,lidOpening:options.opening??(['hinged','two-piece','drawer'].includes(t.id)?30:0)};
}
function drawObject(model,art){
 const p=model.profile;let out='';
 if(model.kind==='bottle'){
   const wide=['milk','square','sport'].includes(p),left=wide?110:135,right=wide?290:265,neckLeft=p==='wine'?176:p==='square'?166:165,neckRight=400-neckLeft,neckY=p==='wine'?38:70;
   out+=paint(`M${neckLeft} ${neckY}H${neckRight}V122 Q${right} 135 ${right} 170V337Q${right} 359 ${right-20} 359H${left+20}Q${left} 359 ${left} 337V170Q${left} 135 ${neckLeft} 122Z`,'url(#glass)');
   out+=rect(neckLeft-3,neckY-20,neckRight-neckLeft+6,30,4,'url(#rim)');
   if(p==='pump')out+=rect(190,22,20,35,3,'url(#rim)')+paint('M188 18H271V30H208V38H188Z','url(#rim)');
   if(p==='spray')out+=paint('M171 20H271L280 40H216V65H175Z','url(#rim)')+line('M253 43L234 69','#53616e',7);
   if(p==='dropper')out+=paint('M178 60V36Q178 8 200 8Q222 8 222 36V60Z','#465061');
   if(p==='sport')out+=line('M239 44Q302 27 295 74','#6b727c',7);
   out+=rect(left+4,193,right-left-8,98,2,'#ffffffe0')+label(art,left+15,216,right-left-30,57)+line(`M${left+14} 169V320`,'#ffffff55',5);
   if(p==='water')out+=['168','310','328'].map(y=>line(`M${left+4} ${y}H${right-4}`,'#ffffff50',3)).join('');
   if(p==='sauce')out+=line(`M${left+6} 305H${right-6}`,'#8b624366',3);
   if(p==='square')out+=line('M278 152V339','#23384833',6);
 }else if(model.kind==='can'){
   const width=p==='slim'?112:p==='candle'?230:p==='paint'?210:164,top=p==='candle'?192:p==='food'?120:82,bottom=350,left=200-width/2,right=200+width/2;
   out+=paint(`M${left} ${top}Q200 ${top+26} ${right} ${top}V${bottom}Q200 ${bottom+30} ${left} ${bottom}Z`)+ellipse(200,bottom,width/2,15)+rect(left,top,width,bottom-top,0,'url(#material)')+ellipse(200,top,width/2,16);
   out+=ellipse(200,top,width*.4,10,'#c7cbd0')+line(`M${left+8} ${bottom-6}Q200 ${bottom+18} ${right-8} ${bottom-6}`,'#c5c9cf',4);
   if(['soda','slim'].includes(p))out+=ellipse(210,top-2,13,5,'#5c6976')+rect(182,top-7,20,11,5,'#c7cbd0');
   if(p==='food')for(let i=0;i<4;i++)out+=line(`M${left} ${top+38+i*44}H${right}`,'#81909b55',2);
   if(p==='paint')out+=line(`M${left} ${top+70}Q200 ${top-170} ${right} ${top+70}`,'#64717c',6);
   out+=label(art,left+15,top+(bottom-top)*.42,width-30,55);
 }else if(model.kind==='jar'){
   const shallow=p==='cosmetic',left=shallow?86:p==='spice'?145:111,right=400-left,top=shallow?193:111,bottom=353;
   out+=rect(left,top,right-left,bottom-top,22,'url(#glass)')+ellipse(200,bottom,right-200,13,'#b9b8ad66');
   out+=rect(left-4,top-35,right-left+8,43,9,'url(#rim)')+ellipse(200,top-35,right-left>>1,12,'url(#rim)');
   for(let i=0;i<4;i++)out+=line(`M${left+5} ${top-25+i*7}H${right-5}`,'#00000012',1);
   out+=rect(left+7,top+35,right-left-14,shallow?85:125,4,'#ffffffbb')+label(art,left+17,top+56,right-left-34,58)+line(`M${left+13} ${top+16}V${bottom-25}`,'#ffffff66',4);
   if(p==='honey')out+=line('M120 297H280M125 310H275','#aa8b4b66',3);
   if(p==='candle')out+=ellipse(200,top+20,75,10,'#f5ede1')+line(`M200 ${top+15}V${top+27}`,'#6d5d4b',3);
 }else if(model.kind==='tube'){
   if(['balm','stick'].includes(p)){out+=rect(164,85,72,254,15)+rect(164,224,72,115,12,'url(#rim)')+ellipse(200,85,36,10)+label(art,170,134,60,55);}
   else if(p==='poster'){out+=paint('M71 164L300 115Q330 125 330 157L104 218Z')+ellipse(81,193,20,32,'url(#rim)')+ellipse(310,136,20,30,'url(#rim)')+label(art,140,150,124,48);}
   else{const left=p==='toothpaste'?135:125,right=400-left;out+=paint(`M${left} 62H${right}L${right-10} 311Q200 328 ${left+10} 311Z`)+rect(left,59,right-left,15,2,'url(#rim)')+rect(left+17,312,right-left-34,44,8,'url(#rim)')+label(art,left+13,150,right-left-26,78)+line(`M${left+11} 92L${left+18} 289`,'#ffffff77',4);}
 }else if(model.kind==='pouch'){
   const shopping=p==='shopping',sachet=p==='sachet',left=sachet?112:89,right=400-left,top=shopping?122:70,bottom=351;
   out+=paint(`M${left} ${top}H${right}L${right-6} ${bottom-14}Q200 ${bottom+9} ${left+6} ${bottom-14}Z`);
   if(shopping)out+=line('M145 130V91Q145 44 181 44H219Q255 44 255 91V130','#667365',9)+paint(`M${right-27} ${top}L${right} ${top}L${right-6} ${bottom-14}L${right-34} ${bottom-5}Z`,'#00000018');
   else{out+=line(`M${left+4} ${top+12}H${right-4}`,'#ffffff88',3)+line(`M${left+4} ${bottom-27}H${right-4}`,'#ffffff88',3);if(p==='zipper')out+=line(`M${left+7} ${top+27}H${right-7}`,'#47515d55',3);}
   if(p==='spout')out+=rect(right-37,top-31,26,40,4,'url(#rim)')+rect(right-42,top-40,36,17,3,'url(#rim)');
   if(p==='coffee')out+=line(`M${left+30} ${top+30}V${bottom-20}M${right-30} ${top+30}V${bottom-20}`,'#00000019',3)+ellipse(245,top+80,10,10,'#8e8a83');
   out+=label(art,left+26,top+(bottom-top)*.4,right-left-52,75)+line(`M${left+13} ${top+35}L${left+17} ${bottom-39}`,'#ffffff55',5);
 }else if(model.kind==='container'){
   if(['cup','yogurt'].includes(p)){const top=p==='yogurt'?150:92,bottom=350,width=p==='yogurt'?232:186;out+=paint(`M${200-width/2} ${top}H${200+width/2}L${200+width*.35} ${bottom}Q200 ${bottom+20} ${200-width*.35} ${bottom}Z`)+ellipse(200,top,width/2+9,15,'url(#rim)')+label(art,135,top+(bottom-top)*.4,130,62);if(p==='cup')out+=ellipse(200,top-8,width/2+2,11,'#dedbd1')+line('M169 88H231','#575e61',4);}
   else if(p==='lunch'){out+=paint('M65 188L287 155L338 203L126 245Z','#d9d6c9')+paint('M65 188L126 245V335L65 291Z','#00000014')+paint('M126 245L338 203V289L126 335Z')+label(art,172,252,118,54);}
   else{const top=p==='bowl'?211:142,bottom=347,width=p==='round'?228:270;out+=paint(`M${200-width/2} ${top}H${200+width/2}L${200+width*.38} ${bottom}Q200 373 ${200-width*.38} ${bottom}Z`)+ellipse(200,top,width/2,25,'url(#rim)')+ellipse(200,top,width*.44,18,'#6b685f44')+label(art,130,top+(bottom-top)*.45,140,56);}
 }else if(model.kind==='food'){
   if(p==='gable'){out+=paint('M107 145L157 72H239L291 145V351H107Z')+paint('M157 72L213 127L291 145L239 72Z','#ffffff44')+paint('M250 150L291 145V351H250Z','#00000012')+rect(157,57,82,19,1,'url(#rim)')+label(art,129,217,105,66);}
   else if(p==='popcorn'){out+=paint('M80 92H320L286 350H114Z');for(let i=0;i<5;i++)out+=paint(`M${84+i*44} 92H${106+i*44}L${135+i*28} 350H${117+i*28}Z`,'#ffffff33');out+=label(art,120,196,160,75)+line('M82 103H318','#ffffff88',3);}
   else if(p==='wedge'){out+=paint('M82 312L275 99L328 147V335Z')+paint('M82 312L275 99L275 312Z','#ffffff66')+label(art,156,232,105,51)+line('M100 300L266 118','#ffffff77',3);}
   else{out+=paint('M60 200L289 158L344 213L109 265Z','#dedacb')+paint('M60 200L109 265L119 327L78 280Z','#00000015')+paint('M109 265L344 213L322 297L119 327Z')+label(art,153,264,124,54);}
 }else if(model.kind==='apparel'){
   if(p==='cap'){out+=paint('M104 239Q104 93 200 93Q299 93 299 242Z')+paint('M108 238Q262 232 329 290Q200 335 81 287Z','url(#rim)')+line('M200 97V237','#ffffff55',2)+label(art,151,160,98,52);}
   else if(p==='tote'){out+=rect(95,133,210,221,12)+line('M137 139V90Q137 46 163 46H237Q265 46 265 90V139','#8b9487',10)+label(art,126,216,148,66)+line('M109 150V330M291 150V330','#ffffff66',2);}
   else{const hood=p==='hoodie',long=p!=='shirt';out+=paint(long?'M151 97L87 121L45 300L100 313L131 213V353H269V213L300 313L355 300L313 121L249 97Z':'M151 97L82 126L49 196L104 220L131 174V353H269V174L296 220L351 196L318 126L249 97Z');
     out+=paint(hood?'M151 99Q145 25 200 25Q255 25 249 99L226 136H174Z':'M153 96Q200 147 247 96L229 92Q200 112 171 92Z','url(#rim)');
     if(hood)out+=line('M176 126V196M224 126V196','#f4f0e6',3)+paint('M149 284H251L261 327H139Z','#0000000b');
     out+=label(art,140,185,120,65)+line('M135 339H265M145 108L92 133M255 108L308 133','#ffffff44',2);}
 }else if(model.kind==='device'){
   if(['phone','tablet'].includes(p)){const left=p==='phone'?128:81,right=400-left,top=p==='phone'?43:54,bottom=355;out+=rect(left,top,right-left,bottom-top,22,'#28323c')+rect(left+8,top+10,right-left-16,bottom-top-20,15,'url(#screen)')+label(art,left+21,top+125,right-left-42,60)+rect(176,top+13,48,10,5,'#141a22')+line(`M${left+40} ${bottom-12}H${right-40}`,'#ffffff88',3);}
   else{out+=rect(59,71,282,203,12,'#263039')+rect(70,82,260,177,3,'url(#screen)')+label(art,129,139,142,66);if(p==='laptop')out+=paint('M58 274H342L378 326Q200 352 22 326Z','#aeb6bd')+rect(165,303,70,20,3,'#d5dadd');else out+=paint('M181 274H219L224 327H176Z','#959fa9')+ellipse(200,334,88,13,'#adb5bd');}
 }else if(model.kind==='print'){
   if(p==='roll'){out+=paint('M107 132H298V284Q200 317 107 284Z')+ellipse(200,132,94,40,'url(#rim)')+ellipse(200,132,29,13,'#746c5e')+rect(151,234,178,120,3,'#fffffff0')+label(art,174,264,132,59);}
   else if(p==='card'){out+=rect(47,143,306,179,9)+label(art,106,195,188,76)+line('M66 309H333','#ffffff66',2);}
   else if(p==='brochure'){out+=paint('M51 95L151 76L251 95L349 75V342L249 363L150 343L51 363Z')+line('M151 77V343M251 95V361','#37475844',2)+label(art,162,176,75,59);}
   else{out+=rect(102,44,212,316,3)+label(art,132,149,152,73);if(p==='book')out+=paint('M85 58L102 44V360L85 373Z','#00000022')+paint('M85 373L102 360H314L296 373Z','#e1d8c6')+line('M92 70V356','#ffffff33',2);else out+=line('M110 52H306V352','#ffffff66',3);}
 }else{
   if(p==='mug'){out+=paint('M270 138Q356 127 350 227Q348 286 277 284V258Q320 254 321 221Q323 167 274 169Z','url(#rim)')+rect(97,127,189,220,26)+ellipse(192,126,96,22,'url(#rim)')+ellipse(192,126,83,14,'#736f6855')+label(art,121,201,141,64);}
   else if(p==='notebook'){out+=rect(95,44,224,317,9)+label(art,135,158,147,66);for(let i=0;i<13;i++)out+=line(`M85 ${62+i*22}Q111 ${48+i*22} 112 ${65+i*22}`,'#71808b',4);}
   else if(p==='envelope'){out+=rect(46,122,308,211,5)+paint('M46 122L200 236L354 122Z','#ffffff2b')+line('M46 333L161 207M354 333L239 207','#3c4b5722',2)+label(art,124,257,153,49);}
   else{out+=paint('M125 76L200 35L275 76V350H125Z')+ellipse(200,77,14,14,'#f5f5f5')+line('M198 63Q153 8 220 4','#8c8d83',3)+label(art,143,184,114,66);}
 }
 return out;
}

export function productMockupSVG(variant,brand,options={}){
 const width=options.width||1600,height=options.height||1200,color=options.color||variant.style.color,accent=variant.style.accent;
 if(!/^#[0-9a-f]{6}$/i.test(color))throw Error('Choose a valid mockup color.');
 if(variant.model.kind==='box'){
   const state=boxMockupState(variant,brand,{...options,color});return foldedSceneSVG(state,build(state),{width,height,angle:options.angle??-22,compact:true,background:options.background||false,id:options.id});
 }
 const id=options.id||`product-${variant.id}`,art=brand?.art?`<image id="brand-image" href="${escapeXML(brand.art)}" width="${brand.artWidth}" height="${brand.artHeight}"/>`:'',shape=drawObject(variant.model,brand),size=variant.size;
 const k=Math.min(width,height)/450*size.factor*.71,x=width/2,y=height/2,angle=Math.max(-60,Math.min(60,options.angle||0));
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXML(variant.name)} mockup"><defs>${art}<linearGradient id="material"><stop stop-color="#ffffff" stop-opacity=".1"/><stop offset=".18" stop-color="${color}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${accent}"/></linearGradient><linearGradient id="glass"><stop stop-color="${accent}"/><stop offset=".16" stop-color="${color}"/><stop offset=".32" stop-color="#ffffff" stop-opacity=".68"/><stop offset=".56" stop-color="${color}"/><stop offset="1" stop-color="${accent}"/></linearGradient><linearGradient id="rim"><stop stop-color="#e7e6e0"/><stop offset=".5" stop-color="#a7adae"/><stop offset="1" stop-color="#dcdfdb"/></linearGradient><linearGradient id="screen" x2="1" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${color}"/></linearGradient></defs>`;
 if(options.background)out+=`<rect width="${width}" height="${height}" fill="${options.background===true?'#f2f3f5':escapeXML(options.background)}"/>`;
 out+=`<g transform="translate(${x} ${y}) rotate(${angle*.35}) scale(${k*size.ratio} ${k}) translate(-200 -200)">${shape}</g></svg>`;
 for(const resource of ['brand-image','material','glass','rim','screen'])out=out.replaceAll(`id="${resource}"`,`id="${id}-${resource}"`).replaceAll(`url(#${resource})`,`url(#${id}-${resource})`).replaceAll(`href="#${resource}"`,`href="#${id}-${resource}"`);
 return out;
}

export async function exportProductMockup(variant,brand,options,format){
 const name=`3omar-${variant.id}`,source=productMockupSVG(variant,brand,{...options,width:1600,height:1200,background:false});
 if(format==='svg'){download(source,name+'.svg','image/svg+xml');return;}
 const canvas=await rasterize(source,1600,1200);
 if(format==='psd'){const rgba=canvas.getContext('2d').getImageData(0,0,1600,1200).data;download(encodePSD(1600,1200,[{name:'Branded mockup (transparent)',rgba}],rgba,150),name+'.psd','image/vnd.adobe.photoshop');return;}
 if(format==='jpg'){const ctx=canvas.getContext('2d');ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,1600,1200);}
 const mime=format==='jpg'?'image/jpeg':'image/png',blob=await new Promise(resolve=>canvas.toBlob(resolve,mime,.96));if(!blob)throw Error('The mockup image could not be exported.');download(blob,name+'.'+format);
}
