let cached;
export async function loadTransparentBrand(){
 if(cached)return cached;
 cached=(async()=>{
   const image=new Image();image.src=new URL('./logo.png',import.meta.url).href;
   await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('The site logo could not be loaded.'));});
   const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
   const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);let left=canvas.width,top=canvas.height,right=0,bottom=0;
   // The supplied logo has a black background. Make only near-black pixels transparent.
   // The original blue/green lettering and light outline are preserved.
   for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){const at=(y*canvas.width+x)*4,max=Math.max(pixels.data[at],pixels.data[at+1],pixels.data[at+2]);if(max<=28)pixels.data[at+3]=0;else{if(max<44)pixels.data[at+3]=Math.round((max-28)/16*255);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}
   ctx.putImageData(pixels,0,0);const crop=document.createElement('canvas');crop.width=right-left+1;crop.height=bottom-top+1;crop.getContext('2d').drawImage(canvas,left,top,crop.width,crop.height,0,0,crop.width,crop.height);
   return {art:crop.toDataURL('image/png'),artWidth:crop.width,artHeight:crop.height,artName:'3omar.hs logo (transparent)'};
 })();return cached;
}
