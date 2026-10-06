import './page.js';
import {initGalleries} from './gallery.js';
import {presetState} from './gallery-data.js';
import {boxMockupState} from './mockups.js';
import {build,sheetFit} from './geometry.js';
import {exportFile} from './exports.js';
import {readImage} from './image-upload.js';
import {openInStudio,studioLimits} from './page-state.js';
const $=id=>document.getElementById(id);let timer;
function notice(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(timer);timer=setTimeout(()=>$('toast').hidden=true,6000);}
function dialog(title,html){$('dialog-title').textContent=title;$('dialog-content').innerHTML=html;$('info-dialog').showModal();}
$('dialog-close').addEventListener('click',()=>$('info-dialog').close());
initGalleries({mode:document.body.dataset.page,onNotice:notice,onDialog:dialog,readImage,
 onUseDieline:p=>{try{openInStudio(presetState(p));}catch(e){notice(e.message);}},
 onUseBoxMockup:(v,brand,options)=>{try{openInStudio(boxMockupState(v,brand,options));}catch(e){notice(e.message);}},
 onDownloadDieline:async p=>{try{const s={...presetState(p),...studioLimits()};notice(await exportFile(s,build(s),'svg'));}catch(e){notice(e.message);}},
 beforeMockupExport:(v,brand,options)=>{if(v.model.kind!=='box')return;const s={...boxMockupState(v,brand,options),...studioLimits()};if(!sheetFit(s,build(s)).fits)throw Error('This box exceeds your active flat-sheet limit. Open Box Studio and auto-fit before exporting.');}
}).catch(e=>notice(e.message));
