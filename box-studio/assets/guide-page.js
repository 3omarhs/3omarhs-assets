import './page.js';
import {boxLibrary as suppliedLibrary} from './library.js';
import {extendedTemplates} from './extended-structures.js';
const boxLibrary=[{name:'Additional parametric constructions',items:extendedTemplates.map(t=>({name:t.name,description:t.tag,template:t.id}))},...suppliedLibrary];
import {escapeXML} from './geometry.js';
const search=document.getElementById('guide-search'),list=document.getElementById('guide-list');
function render(){const q=search.value.trim().toLowerCase();list.innerHTML=boxLibrary.map(group=>{const items=group.items.filter(item=>`${group.name} ${item.name} ${item.description}`.toLowerCase().includes(q));return items.length?`<h2>${escapeXML(group.name)}</h2><div class="guide-grid">${items.map(item=>`<article class="guide-item"><span class="library-status ${item.template?'ready':''}">${item.template?'Editable structure':'Reference entry'}</span><strong>${escapeXML(item.name)}</strong><p>${escapeXML(item.description)}</p>${item.template?`<a href="studio.html?type=${encodeURIComponent(item.template)}">Customize this structure ↗</a>`:''}</article>`).join('')}</div>`:'';}).join('')||'<p>No box types match this search.</p>';}
search.addEventListener('input',render);render();
