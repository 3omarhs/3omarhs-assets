import {svg,fmt,sheetFit,materials,artworkDef,panelArtwork,escapeXML} from './geometry.js';
import {foldedSceneSVG} from './folding.js';
export function download(data,name,mime){const blob=data instanceof Blob?data:new Blob([data],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
export async function rasterize(source,width,height){
 const blob=new Blob([source],{type:'image/svg+xml'}),url=URL.createObjectURL(blob);
 try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('Could not render the export image.'));image.src=url;});const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,width,height);return canvas;}finally{URL.revokeObjectURL(url);}
}
class Writer{
 constructor(){this.parts=[];this.size=0;}
 bytes(x){this.parts.push(x);this.size+=x.length;return this;}
 text(x){return this.bytes(new TextEncoder().encode(x));}
 u8(x){return this.bytes(new Uint8Array([x]));}
 u16(x){const b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,x);return this.bytes(b);}
 u32(x){const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,x);return this.bytes(b);}
 finish(){const out=new Uint8Array(this.size);let at=0;for(const p of this.parts){out.set(p,at);at+=p.length;}return out;}
}
// PSD v1, RGB, raw channels. Layers are intentionally raster layers, not vector smart objects.
export function encodePSD(width,height,layers,merged,dpi=150){
 const n=width*height;if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>30000||height>30000)throw Error('Invalid PSD canvas size.');
 for(const l of [...layers,{rgba:merged}])if(l.rgba.length!==n*4)throw Error('PSD pixel buffer size mismatch.');
 const records=new Writer(),channels=new Writer();
 for(const l of layers){
   records.u32(0).u32(0).u32(height).u32(width).u16(4);
   for(const c of [0,1,2,3]){records.u16(c===3?65535:c).u32(n+2);channels.u16(0);const bytes=new Uint8Array(n);for(let i=0;i<n;i++)bytes[i]=l.rgba[i*4+c];channels.bytes(bytes);}
   const extra=new Writer().u32(0).u32(0),name=new TextEncoder().encode(l.name).slice(0,255);extra.u8(name.length).bytes(name);while(extra.size%4)extra.u8(0);
   records.text('8BIMnorm').u8(255).u8(0).u8(0).u8(0).u32(extra.size).bytes(extra.finish());
 }
 const info=new Writer().u16(layers.length).bytes(records.finish()).bytes(channels.finish());if(info.size%2)info.u8(0);
 const layerSection=new Writer().u32(info.size).bytes(info.finish()).u32(0);
 const resources=new Writer().text('8BIM').u16(1005).u16(0).u32(16).u32(dpi*65536).u16(1).u16(2).u32(dpi*65536).u16(1).u16(2);
 const out=new Writer().text('8BPS').u16(1).bytes(new Uint8Array(6)).u16(3).u32(height).u32(width).u16(8).u16(3).u32(0).u32(resources.size).bytes(resources.finish()).u32(layerSection.size).bytes(layerSection.finish()).u16(0);
 for(let c=0;c<3;c++){const bytes=new Uint8Array(n);for(let i=0;i<n;i++){const a=merged[i*4+3]/255;bytes[i]=Math.round(merged[i*4+c]*a+255*(1-a));}out.bytes(bytes);}
 return out.finish();
}
export function encodePDF(jpeg,pixelW,pixelH,widthMM,heightMM){
 const w=widthMM*72/25.4,h=heightMM*72/25.4,out=new Writer().text('%PDF-1.4\n'),offsets=[0];
 const obj=(id,head,data)=>{offsets[id]=out.size;out.text(`${id} 0 obj\n${head}`);if(data)out.text('\nstream\n').bytes(data).text('\nendstream');out.text('\nendobj\n');};
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w.toFixed(5)} ${h.toFixed(5)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
 obj(4,`<< /Type /XObject /Subtype /Image /Width ${pixelW} /Height ${pixelH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`,jpeg);
 const content=new TextEncoder().encode(`q ${w.toFixed(5)} 0 0 ${h.toFixed(5)} 0 0 cm /Im0 Do Q`);obj(5,`<< /Length ${content.length} >>`,content);
 const xref=out.size;out.text('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)out.text(String(offsets[i]).padStart(10,'0')+' 00000 n \n');out.text(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);return out.finish();
}
export function dxf(geo){
 let out='0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n2\n';
 for(const [name,color] of [['CUT',6],['FOLD',4]])out+=`0\nLAYER\n2\n${name}\n70\n0\n62\n${color}\n6\nCONTINUOUS\n`;
 out+='0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n';
 for(const [name,lines] of [['CUT',geo.cuts],['FOLD',geo.folds]])for(const [a,b] of lines)out+=`0\nLINE\n8\n${name}\n10\n${fmt(a[0])}\n20\n${fmt(geo.height-a[1])}\n30\n0\n11\n${fmt(b[0])}\n21\n${fmt(geo.height-b[1])}\n31\n0\n`;
 return out+'0\nENDSEC\n0\nEOF\n';
}
export function eps(geo){
 const pt=72/25.4,w=geo.width*pt,h=geo.height*pt;
 let out=`%!PS-Adobe-3.0 EPSF-3.0\n%%Creator: 3omar.hs Box Studio\n%%Title: Editable cut and fold dieline\n%%BoundingBox: 0 0 ${Math.ceil(w)} ${Math.ceil(h)}\n%%HiResBoundingBox: 0 0 ${w.toFixed(6)} ${h.toFixed(6)}\n%%LanguageLevel: 2\n%%EndComments\ngsave\n${pt} ${pt} scale\n0 ${geo.height} translate\n1 -1 scale\n0.2 setlinewidth\n1 setlinejoin\n`;
 for(const [name,lines,rgb,dash] of [['Cut',geo.cuts,'0.88 0.16 0.53','[]'],['Fold',geo.folds,'0.21 0.64 0.74','[2 1.4]']]){out+=`% ${name} lines\n${rgb} setrgbcolor\n${dash} 0 setdash\n`;for(const [a,b] of lines)out+=`newpath ${a[0]} ${a[1]} moveto ${b[0]} ${b[1]} lineto stroke\n`;}
 return out+'grestore\nshowpage\n%%EOF\n';
}
export function measurementsCSV(s,geo){const row=values=>values.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',');return '\uFEFF'+[
 row(['Section','Width (mm)','Height (mm)','Purpose']),row(['Overall flat bounding box',geo.width,geo.height,'Includes tabs and all pieces']),
 ...geo.panels.map(p=>row([p.name,p.w,p.h,p.role])),...(s.sheetLimit?[row(['Maximum flat sheet',s.sheetW,s.sheetH,s.allowRotate?'90 degree rotation allowed':'Fixed orientation'])]:[])
 ].join('\r\n');}
export function mockupSVG(s,geo){return foldedSceneSVG(s,geo,{width:1600,height:1200,background:'#f5f5f7'});}
export async function exportFile(s,geo,format){
 if(!sheetFit(s,geo).fits)throw Error('The dieline exceeds your enabled flat-sheet size limit. Reduce it before exporting.');
 const name=`fold-${s.type}-${fmt(s.w)}x${fmt(s.d)}x${fmt(s.h)}mm`;
 if(format==='svg'){download(svg(s,geo),name+'.svg','image/svg+xml');return 'SVG downloaded. Geometry and artwork are separate editable groups.';}
 if(format==='dxf'){download(dxf(geo),name+'.dxf','application/dxf');return 'DXF downloaded. Units: millimeters. Separate CUT and FOLD layers.';}
 if(format==='eps'){download(eps(geo),name+'.eps','application/postscript');return 'EPS downloaded. Illustrator-compatible vector cut and fold paths; no artwork.';}
 if(format==='csv'){download(measurementsCSV(s,geo),name+'-measurements.csv','text/csv;charset=utf-8');return 'Panel measurements downloaded in millimeters.';}
 if(format==='jpg'){const canvas=await rasterize(mockupSVG(s,geo),1600,1200),blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.95));if(!blob)throw Error('JPG export failed.');download(blob,name+'-mockup.jpg');return 'Assembled concept downloaded as a 1600 × 1200 JPG.';}
 const dpi=150,W=Math.max(1,Math.floor(geo.width/25.4*dpi)),H=Math.max(1,Math.floor(geo.height/25.4*dpi)),limit=format==='psd'?12000000:24000000;
 if(W*H>limit||W>16000||H>16000)throw Error('This sheet is too large for a browser raster export at 150 dpi. Use SVG or DXF to preserve its full size.');
 const canvas=await rasterize(svg(s,geo),W,H);
 if(format==='png'){const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('PNG export failed.');download(blob,name+'-150dpi.png');return 'PNG downloaded at 150 dpi pixel dimensions. Set 150 dpi when importing into your design app.';}
 if(format==='pdf'){
   const ctx=canvas.getContext('2d');ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.98)),jpeg=new Uint8Array(await blob.arrayBuffer());download(encodePDF(jpeg,W,H,geo.width,geo.height),name+'.pdf','application/pdf');return 'Actual-size PDF downloaded (150 dpi). Print at 100%, with Fit to page disabled.';
 }
 if(format==='psd'){
   const layers=[];for(const [layer,label] of [['labels','Panel measurements'],['guides','Safe area guides'],['cuts','Cut lines'],['folds','Fold lines'],['art','Artwork & material']]){
     if(layer==='labels'&&!s.labels||layer==='guides'&&!s.guides)continue;
     const c=await rasterize(svg(s,geo,{layer}),W,H);layers.push({name:label,rgba:c.getContext('2d').getImageData(0,0,W,H).data});c.width=1;c.height=1;
   }
   download(encodePSD(W,H,layers,canvas.getContext('2d').getImageData(0,0,W,H).data,dpi),name+'.psd','image/vnd.adobe.photoshop');return 'Layered PSD downloaded at 150 dpi. Artwork and guides are separate raster layers.';
 }
 throw Error('Choose an export format.');
}

