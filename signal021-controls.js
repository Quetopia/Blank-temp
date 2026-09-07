(function(){
'use strict';
/* QUETOPIA SIGNAL 021 — QWER hold-to-cast controls */
const TAG='SIGNAL 021 · QWER HOLD CAST';
const held={q:false,w:false,e:false,r:false};
let last=performance.now();
function editable(t){let n=(t?.tagName||'').toLowerCase();return n==='input'||n==='textarea'||n==='select'||t?.isContentEditable}
function cast(k){
 if(typeof running!=='undefined'&&!running)return;
 try{
  if(k==='q'&&typeof signalShot==='function')signalShot();
  else if(k==='w'&&typeof prism==='function')prism();
  else if(k==='e'&&typeof nova==='function')nova();
  else if(k==='r'&&typeof fracture==='function')fracture();
 }catch(err){console.warn('[QUETOPIA] '+TAG+' cast',err)}
}
function down(e){
 if(editable(e.target))return;
 const k=(e.key||'').toLowerCase();
 if(k==='q'||k==='w'||k==='e'||k==='r'){
  held[k]=true;cast(k);e.preventDefault();e.stopImmediatePropagation();return;
 }
 if(k==='1'||k==='2'||k==='3'||k==='4'){
  e.preventDefault();e.stopImmediatePropagation();
 }
}
function up(e){const k=(e.key||'').toLowerCase();if(k in held){held[k]=false;e.preventDefault();e.stopImmediatePropagation()}}
function clear(){held.q=held.w=held.e=held.r=false}
addEventListener('keydown',down,true);addEventListener('keyup',up,true);addEventListener('blur',clear);

const statusHTML='<b>SIGNAL 021</b> · LMB MOVE · HOLD Q SIGNAL · HOLD W PRISM · HOLD E RESONANCE · HOLD R FRACTURE · SPACE PHASE';
const markHTML='<b>SIGNAL 021</b> · QWER HOLD-CAST · DRUID + PUNKIN';
function syncUI(){
 const ks=document.querySelectorAll('.hotbar .key');['Q','W','E','R','SPACE'].forEach((v,i)=>{if(ks[i]&&ks[i].textContent!==v)ks[i].textContent=v});
 let s=document.getElementById('q20Status');if(s)s.id='q21Status';
 s=document.getElementById('q21Status');if(s&&s.innerHTML!==statusHTML)s.innerHTML=statusHTML;
 const mark=document.getElementById('q20Mark');if(mark)mark.id='q21Mark';
 const mark21=document.getElementById('q21Mark');if(mark21&&mark21.innerHTML!==markHTML)mark21.innerHTML=markHTML;
 const zone=document.querySelector('.miniwrap .sub');if(zone&&zone.textContent!=='SIGNAL 021')zone.textContent='SIGNAL 021';
 const tip=document.querySelector('#intro .tip:last-child');const tipText='LMB move · HOLD Q Signal Shot · HOLD W Prism Lance · HOLD E Resonance Nova · HOLD R Fracture Field · SPACE Phase Step';if(tip&&tip.textContent!==tipText)tip.textContent=tipText;
 document.title='QUETOPIA — SIGNAL 021';
}
function fixStart(){
 const btn=document.getElementById('start');if(!btn||btn.dataset.q21Fixed)return;
 btn.dataset.q21Fixed='1';
 btn.addEventListener('click',()=>{
  try{
   const intro=document.getElementById('intro');if(intro)intro.style.display='none';
   if(typeof running!=='undefined')running=true;
   if(typeof clock!=='undefined'&&clock&&typeof clock.getDelta==='function')clock.getDelta();
   if(typeof say==='function')say('SIGNAL 021 ACQUIRED · ENTER THE FRACTURED GROVE');
  }catch(err){console.error('[QUETOPIA] '+TAG+' start',err)}
 },true);
}
const st=document.createElement('style');st.textContent=`
.hotbar:before{content:'LMB MOVE  ·  HOLD Q W E R TO CAST  ·  SPACE PHASE STEP'!important}
#q21Status{position:fixed;left:50%;bottom:122px;transform:translateX(-50%);z-index:14;pointer-events:none;padding:7px 13px;border:1px solid #aa8b50;background:linear-gradient(180deg,#120d16ed,#060508f5);box-shadow:0 10px 30px #000d,inset 0 1px 0 #ffe8b42c;color:#d8c69e;font:800 8px/1.2 system-ui;letter-spacing:.15em;white-space:nowrap;text-shadow:0 2px 4px #000;backdrop-filter:blur(9px)}#q21Status b{color:#71eaff}
#q21Mark{position:fixed;left:18px;bottom:18px;z-index:8;pointer-events:none;font:800 7px system-ui;letter-spacing:.19em;color:#8d8193;text-shadow:0 2px 5px #000}#q21Mark b{color:#dfc477}
`;document.head.appendChild(st);
// Do not observe the entire DOM: previous version caused a self-triggering MutationObserver loop and froze Chrome.
syncUI();fixStart();setTimeout(()=>{syncUI();fixStart()},350);setTimeout(()=>{syncUI();fixStart()},1200);
function loop(now){last=now;if(held.q)cast('q');if(held.w)cast('w');if(held.e)cast('e');if(held.r)cast('r');requestAnimationFrame(loop)}
requestAnimationFrame(loop);
console.log('[QUETOPIA] '+TAG+' active');
})();