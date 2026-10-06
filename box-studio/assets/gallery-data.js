import {templates,defaults,build} from './geometry.js';
export const galleryCategories=[
 {id:'boxes',name:'Boxes',icon:'◇'}, {id:'bottles',name:'Bottles',icon:'♧'}, {id:'food',name:'Food packaging',icon:'▱'},
 {id:'pouches',name:'Pouches, sachets & bags',icon:'♧'}, {id:'cans',name:'Cans',icon:'▤'}, {id:'jars',name:'Jars',icon:'▣'},
 {id:'tubes',name:'Tubes',icon:'▽'}, {id:'containers',name:'Containers, cups & bowls',icon:'◡'},
 {id:'apparel',name:'Apparel',icon:'♜'}, {id:'devices',name:'Devices',icon:'▯'}, {id:'prints',name:'Prints',icon:'▧'}, {id:'others',name:'Others',icon:'✧'}
];
const groups=[
 ['boxes',[
   ['tuck-carton','Straight tuck carton','box','straight'],['reverse-carton','Reverse tuck carton','box','reverse'],['window-carton','Window product carton','box','window'],['cube-gift','Cube gift box','box','cube'],['tall-carton','Tall beauty carton','box','slim'],['sleeve-box','Packaging sleeve','box','sleeve'],['tray-box','Presentation tray','box','tray'],['shallow-tray','Shallow gift tray','box','shallow'],['hinged-box','Hinged gift box','box','hinged'],['display-box','Counter display box','box','display'],['lid-base','Lid & base presentation','box','two-piece'],['drawer-box','Sliding sleeve & tray','box','drawer']
 ]],
 ['bottles',[
   ['water-bottle','Water bottle','bottle','water'],['wine-bottle','Wine bottle','bottle','wine'],['cosmetic-bottle','Cosmetic pump bottle','bottle','pump'],['spray-bottle','Spray bottle','bottle','spray'],['dropper-bottle','Dropper bottle','bottle','dropper'],['milk-bottle','Milk bottle','bottle','milk'],['sauce-bottle','Sauce bottle','bottle','sauce'],['square-bottle','Square fragrance bottle','bottle','square'],['sport-bottle','Sports bottle','bottle','sport']
 ]],
 ['food',[
   ['milk-carton','Gable-top beverage carton','food','gable'],['pizza-box','Pizza presentation box','box','hinged'],['takeaway-tray','Takeaway food tray','food','tray'],['popcorn-carton','Popcorn carton','food','popcorn'],['cake-box','Cake gift box','box','window'],['sandwich-pack','Sandwich wedge','food','wedge']
 ]],
 ['pouches',[
   ['standup-pouch','Stand-up pouch','pouch','standup'],['zipper-pouch','Zipper pouch','pouch','zipper'],['flat-sachet','Flat sachet','pouch','sachet'],['spout-pouch','Spouted pouch','pouch','spout'],['coffee-bag','Coffee gusset bag','pouch','coffee'],['shopping-bag','Paper shopping bag','pouch','shopping']
 ]],
 ['cans',[
   ['soda-can','Standard beverage can','can','soda'],['slim-can','Slim beverage can','can','slim'],['food-tin','Food tin','can','food'],['paint-tin','Paint tin','can','paint'],['candle-tin','Candle tin','can','candle']
 ]],
 ['jars',[
   ['jam-jar','Jam jar','jar','jam'],['cosmetic-jar','Cosmetic cream jar','jar','cosmetic'],['spice-jar','Spice jar','jar','spice'],['candle-jar','Glass candle jar','jar','candle'],['honey-jar','Honey jar','jar','honey']
 ]],
 ['tubes',[
   ['cream-tube','Cream squeeze tube','tube','cream'],['toothpaste-tube','Toothpaste tube','tube','toothpaste'],['lip-balm','Lip balm tube','tube','balm'],['poster-tube','Poster shipping tube','tube','poster'],['cosmetic-stick','Cosmetic stick','tube','stick']
 ]],
 ['containers',[
   ['coffee-cup','Takeaway coffee cup','container','cup'],['paper-bowl','Paper food bowl','container','bowl'],['yogurt-cup','Yogurt cup','container','yogurt'],['icecream-tub','Ice-cream tub','container','tub'],['lunch-container','Lunch container','container','lunch'],['round-tin','Round presentation tin','container','round']
 ]],
 ['apparel',[
   ['tshirt','Crew-neck T-shirt','apparel','shirt'],['hoodie','Pullover hoodie','apparel','hoodie'],['sweatshirt','Sweatshirt','apparel','sweatshirt'],['tote','Canvas tote bag','apparel','tote'],['cap','Baseball cap','apparel','cap']
 ]],
 ['devices',[
   ['phone','Smartphone','device','phone'],['tablet','Tablet','device','tablet'],['laptop','Laptop','device','laptop'],['monitor','Desktop display','device','monitor']
 ]],
 ['prints',[
   ['business-card','Business card','print','card'],['poster','Poster print','print','poster'],['book','Book cover','print','book'],['brochure','Folded brochure','print','brochure'],['label-roll','Product label roll','print','roll']
 ]],
 ['others',[
   ['mug','Ceramic mug','other','mug'],['notebook','Spiral notebook','other','notebook'],['envelope','Stationery envelope','other','envelope'],['gift-tag','Gift tag','other','tag']
 ]]
];
export const mockupModels=[...groups.flatMap(([category,models])=>models.map(([id,name,kind,profile])=>({id,name,kind,profile,category}))),...templates.filter(t=>t.construction).map(t=>({id:t.id,name:t.name,kind:'box',profile:t.id,category:'boxes'}))];
export const mockupSizes=[{name:'Mini',factor:.72,ratio:.86},{name:'Small',factor:.82,ratio:.94},{name:'Compact',factor:.9,ratio:1.06},{name:'Classic',factor:1,ratio:1},{name:'Wide',factor:1.06,ratio:1.22},{name:'Tall',factor:1.1,ratio:.76},{name:'Large',factor:1.18,ratio:1.04},{name:'Extra wide',factor:1.2,ratio:1.38},{name:'Slim',factor:1.04,ratio:.68},{name:'Premium',factor:1.3,ratio:1.12}];
export const mockupStyles=[
 {id:'ivory',name:'Ivory',color:'#ede7db',accent:'#9b927f',material:'white'}, {id:'kraft',name:'Kraft',color:'#ba9868',accent:'#83623a',material:'kraft'},
 {id:'sage',name:'Sage',color:'#a4b69c',accent:'#50694c',material:'sage'}, {id:'lilac',name:'Lilac',color:'#bab0d8',accent:'#746c9b',material:'lavender'},
 {id:'coral',name:'Coral',color:'#efa780',accent:'#ad6348',material:'white'}, {id:'teal',name:'Teal',color:'#72baaf',accent:'#357a70',material:'sage'},
 {id:'navy',name:'Navy',color:'#41536d',accent:'#1c304c',material:'white'}, {id:'rose',name:'Rose',color:'#d79aa9',accent:'#945c6b',material:'lavender'},
 {id:'sand',name:'Sand',color:'#d2bf9a',accent:'#98805d',material:'kraft'}, {id:'mint',name:'Mint',color:'#b5d8c1',accent:'#68967a',material:'sage'},
 {id:'sky',name:'Sky',color:'#a6c9e2',accent:'#527c9e',material:'white'}, {id:'charcoal',name:'Charcoal',color:'#575b64',accent:'#282b33',material:'white'}
];
export const mockupVariants=mockupModels.flatMap(model=>mockupSizes.flatMap((size,sizeIndex)=>mockupStyles.map(style=>({id:`${model.id}-${sizeIndex}-${style.id}`,model,size,sizeIndex,style,category:model.category,name:`${model.name} · ${size.name} · ${style.name}`}))));
const widths=[35,50,75,100,140,200],depths=[25,40,60,85,115,155],heights=[30,80,150];
export const dielinePresets=templates.flatMap(template=>widths.flatMap(w=>depths.flatMap(d=>heights.map(h=>({id:`${template.id}-${w}-${d}-${h}`,template,w,d,h,category:template.category,name:`${template.name} · ${w} × ${d} × ${h} mm`})))));
export function presetState(preset){return {...defaults,type:preset.template.id,w:preset.w,d:preset.d,h:preset.h,glue:Math.min(12,Math.min(preset.w,preset.d,preset.h)/2)};}
export function validateGalleryCatalog(){for(const preset of dielinePresets)build(presetState(preset));return {models:mockupModels.length,mockups:mockupVariants.length,dielines:dielinePresets.length};}
