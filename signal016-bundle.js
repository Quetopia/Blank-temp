(async function(){
 const base='https://raw.githubusercontent.com/Quetopia/Blank-temp/main/';
 const modules=['signal016-pro.js','signal016-world.js'];
 for(const file of modules){
  const r=await fetch(base+file+'?ts='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw new Error(file+' '+r.status);
  const js=await r.text();
  eval(js);
 }
 console.log('[QUETOPIA] SIGNAL 016 bundle complete');
})().catch(e=>{console.error('[QUETOPIA] bundle failure',e);try{say('SIGNAL MODULE FAILURE · '+e.message)}catch(_){}});