const storageKey='3omar-box-studio-saved-designs-v1';
const indexCookie='3omar_box_studio_saved';
const maxDesigns=12;

function readCookie(name){const prefix=`${name}=`;return document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(prefix))?.slice(prefix.length)||'';}
function writeCookie(value){document.cookie=`${indexCookie}=${encodeURIComponent(value)}; Max-Age=31536000; Path=/; SameSite=Lax`;}
function readAll(){try{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(value)?value:[];}catch{return [];}}
function copy(value){return JSON.parse(JSON.stringify(value));}
function cookieIndex(records){return records.map(({id,name,savedAt,state})=>({id,name,savedAt,type:state?.type||'',w:state?.w||0,d:state?.d||0,h:state?.h||0,art:Boolean(state?.art)}));}
function writeAll(records){try{localStorage.setItem(storageKey,JSON.stringify(records));}catch{throw Error('This browser does not have enough private storage left for this design. Remove a saved design or use Save file instead.');}try{writeCookie(JSON.stringify(cookieIndex(records)));}catch{/* The full private copy remains in browser storage. */}}

export function listSavedDesigns(){return readAll().sort((a,b)=>Number(b.savedAt)-Number(a.savedAt));}
export function saveDesign(name,payload){const records=readAll(),now=Date.now();const record={id:`d${now.toString(36)}${Math.random().toString(36).slice(2,7)}`,name:String(name||'Untitled design').trim().slice(0,64)||'Untitled design',savedAt:now,payload:copy(payload),state:copy(payload.state)};records.unshift(record);if(records.length>maxDesigns)records.length=maxDesigns;writeAll(records);return record;}
export function findSavedDesign(id){return readAll().find(item=>item.id===id)||null;}
export function removeSavedDesign(id){const records=readAll().filter(item=>item.id!==id);writeAll(records);return records;}
