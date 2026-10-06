import {loadTransparentBrand} from './brand.js';
loadTransparentBrand().then(brand=>document.querySelectorAll('.logo-crop img').forEach(img=>img.src=brand.art)).catch(()=>{});
const header=document.querySelector('.topbar');
if(header){
 const navigation=header.querySelector('nav'),panel=document.createElement('div');panel.id='site-menu';panel.className='header-panel';
 const actions=document.createElement('div');actions.className='header-actions';
 for(const child of [...header.children])if(child!==navigation&&!child.classList.contains('brand'))actions.append(child);
 panel.append(navigation,actions);header.append(panel);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='menu-toggle';toggle.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<span aria-hidden="true">☰</span><span>Menu</span>';header.insertBefore(toggle,panel);
 const narrow=matchMedia('(max-width: 1150px)');
 const backdrop=document.createElement('div');backdrop.className='menu-backdrop';backdrop.hidden=true;document.body.append(backdrop);
 const drawerHead=document.createElement('div');drawerHead.className='drawer-head';drawerHead.innerHTML='<strong>Explore 3omar.hs</strong><button type="button" aria-label="Close menu">✕</button>';panel.prepend(drawerHead);
 function close(){panel.hidden=narrow.matches;backdrop.hidden=true;document.body.classList.remove('drawer-open');toggle.setAttribute('aria-expanded','false');header.classList.remove('menu-open');panel.removeAttribute('role');panel.removeAttribute('aria-modal');if(narrow.matches)document.body.append(panel);else header.append(panel);}
 function dismiss(){close();toggle.focus();}
 toggle.addEventListener('click',()=>{if(toggle.getAttribute('aria-expanded')==='true'){dismiss();return;}panel.hidden=false;backdrop.hidden=false;document.body.classList.add('drawer-open');toggle.setAttribute('aria-expanded','true');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Site navigation');drawerHead.querySelector('button').focus();});
 drawerHead.querySelector('button').addEventListener('click',dismiss);backdrop.addEventListener('click',dismiss);
 document.addEventListener('keydown',e=>{if(!narrow.matches||panel.hidden)return;if(e.key==='Escape'){dismiss();return;}if(e.key==='Tab'){const focusable=[...panel.querySelectorAll('a[href],button,input:not([hidden])')].filter(el=>!el.disabled&&el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 narrow.addEventListener('change',close);close();
}
