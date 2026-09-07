(function(){
'use strict';
/* SIGNAL 021 stable control layer — deliberately no MutationObserver */
const held={q:false,w:false,e:false,r:false};
function editable(t){const n=(t&&t.tagName||'').toLowerCase();return n==='input'||n==='textarea'||n==='select'||(t&&t.isContentEditable)}
function cast(k){
  try{
    if(typeof running!=='undefined'&&!running)return;
    if(k==='q'&&typeof signalShot==='function')signalShot();
    else if(k==='w'&&typeof prism==='function')prism();
    else if(k==='e'&&typeof nova==='function')nova();
    else if(k==='r'&&typeof fracture==='function')fracture();
  }catch(err){console.warn('[QUETOPIA] SIGNAL 021 cast',err)}
}
function down(e){
  if(editable(e.target))return;
  const k=(e.key||'').toLowerCase();
  if(k==='q'||k==='w'||k==='e'||k==='r'){
    held[k]=true;cast(k);e.preventDefault();e.stopImmediatePropagation();
  }else if(k==='1'||k==='2'||k==='3'||k==='4'){
    e.preventDefault();e.stopImmediatePropagation();
  }
}
function up(e){const k=(e.key||'').toLowerCase();if(k in held){held[k]=false;e.preventDefault();e.stopImmediatePropagation()}}
function clear(){held.q=held.w=held.e=held.r=false}
window.addEventListener('keydown',down,true);
window.addEventListener('keyup',up,true);
window.addEventListener('blur',clear,true);

function enterGame(e){
  if(e){e.preventDefault();e.stopImmediatePropagation();}
  try{
    const intro=document.getElementById('intro');if(intro)intro.style.display='none';
    if(typeof running!=='undefined')running=true;
    if(typeof clock!=='undefined'&&clock&&clock.getDelta)clock.getDelta();
    if(typeof say==='function')say('SIGNAL 021 ACQUIRED · ENTER THE FRACTURED GROVE');
    document.body.dataset.q21started='1';
  }catch(err){console.error('[QUETOPIA] SIGNAL 021 enter',err)}
}
window.q21EnterGame=enterGame;
function wireStart(){
  const b=document.getElementById('start');
  if(!b)return false;
  if(!b.dataset.q21wired){b.dataset.q21wired='1';b.addEventListener('click',enterGame,true)}
  return true;
}
window.q21SyncUI=function(){
  const ks=document.querySelectorAll('.hotbar .key');['Q','W','E','R','SPACE'].forEach((v,i)=>{if(ks[i])ks[i].textContent=v});
  const tip=document.querySelector('#intro .tip:last-child');if(tip)tip.textContent='LMB move · HOLD Q Signal Shot · HOLD W Prism Lance · HOLD E Resonance Nova · HOLD R Fracture Field · SPACE Phase Step';
  const sub=document.querySelector('#intro .sub');if(sub)sub.textContent=(sub.textContent||'').replace(/SIGNAL\s+\d+/,'SIGNAL 021');
  const zone=document.querySelector('.miniwrap .sub');if(zone)zone.textContent='SIGNAL 021';
  const b=document.getElementById('start');if(b)b.textContent='ENTER THE FRACTURED GROVE';
  document.title='QUETOPIA — SIGNAL 021';
  wireStart();
};
window.q21SyncUI();
setTimeout(window.q21SyncUI,800);
setTimeout(window.q21SyncUI,2500);
function loop(){if(held.q)cast('q');if(held.w)cast('w');if(held.e)cast('e');if(held.r)cast('r');requestAnimationFrame(loop)}
requestAnimationFrame(loop);
console.log('[QUETOPIA] SIGNAL 021 stable controls active');
})();