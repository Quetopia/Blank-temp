import {Grove,W,H,SKILLS,BLESSINGS,distance} from './simulation.mjs';
const $=s=>document.querySelector(s),canvas=$('#game'),ctx=canvas.getContext('2d',{alpha:false});
import {dashGhosts,catStride} from './motion.mjs';
const saveKey='quetopia.grove.progress.v1';
let progress={wins:0,blessing:null},storageAvailable=true;
try{const saved=JSON.parse(localStorage.getItem(saveKey)||'null');if(saved&&Number.isSafeInteger(saved.wins)&&saved.wins>=0)progress={wins:saved.wins,blessing:Object.hasOwn(BLESSINGS,saved.blessing)?saved.blessing:null};}catch{storageAvailable=false;}
function saveProgress(){try{localStorage.setItem(saveKey,JSON.stringify(progress));}catch{storageAvailable=false;}}
const game=new Grove(),input={aim:{x:780,y:390},fire:false,move:null};
let ground,atlas,sprites=[],vw=innerWidth,vh=innerHeight,scale=1,ox=0,oy=0,paused=false,loaded=false,clock=0,acc=0,last=0,frames=0,fpsStart=0,noticeUntil=0,uiAt=0,shake=0,sound=false,audio,volume,fx=[],numbers=[],lastPos={x:760,y:635};
game.setBlessing(progress.blessing);
let quality=1,groundCache=null,winRecorded=false,ghosts=[],lastCat={x:game.cat.x,y:game.cat.y},catMoving=false;
const keys=new Set(),buttonMap=new Map([...document.querySelectorAll('[data-skill]')].map(b=>[b.dataset.skill,b]));
function resize(){vw=innerWidth;vh=innerHeight;const dpr=Math.min(devicePixelRatio||1,quality===1?1.5:1);canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);scale=Math.min(vw/W,vh/H);ox=(vw-W*scale)/2;oy=(vh-H*scale)/2;groundCache=null;}
addEventListener('resize',resize);resize();
const loadImage=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error(`Could not load ${src}`));i.src=src;});
function spriteCells(img){const cuts=[0,.278,.501,.716,1];for(let row=0;row<4;row++){sprites[row]=[];for(let col=0;col<4;col++){let x=Math.round(img.width*col/4),y=Math.round(img.height*cuts[row]),w=Math.floor(img.width/4),h=Math.floor(img.height*(cuts[row+1]-cuts[row]));sprites[row].push({x,y,w,h});}}}
function toWorld(e){return {x:(e.clientX-ox)/scale,y:(e.clientY-oy)/scale};}
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{if(game.mode!=='playing'||paused)return;canvas.focus();input.aim=toWorld(e);canvas.setPointerCapture(e.pointerId);if(e.button===2||e.shiftKey){input.fire=true;}else{input.move=toWorld(e);game.target={...input.move};burst('move',input.move,35,.6);}});
canvas.addEventListener('pointermove',e=>{input.aim=toWorld(e);if(e.buttons===1&&!e.shiftKey)input.move=toWorld(e);});
canvas.addEventListener('pointerup',()=>{input.fire=false;input.move=null;});
canvas.addEventListener('pointercancel',clearInput);
function clearInput(){input.fire=false;input.move=null;game.target=null;keys.clear();}
addEventListener('blur',()=>{clearInput();if(game.mode==='playing')setPause(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(game.mode==='playing')setPause(true);}last=performance.now();acc=0;});
addEventListener('keydown',e=>{if(e.code==='Space'||['KeyQ','KeyW','KeyE','KeyR','KeyF','Escape','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Escape'){if(game.mode==='playing')setPause(!paused);return;}if(paused||game.mode!=='playing')return;keys.add(e.code);const id={KeyQ:'bolt',KeyW:'nova',KeyE:'roots',KeyR:'heal',Space:'dash'}[e.code];if(id)game.cast(id,input.aim);if(e.code==='KeyF')game.attune();});
addEventListener('keyup',e=>keys.delete(e.code));
function setPause(value){paused=value;clearInput();$('#pause').textContent=paused?'Resume':'Pause';$('#pausePanel').hidden=!paused;$('#interact').textContent=paused?'PAUSED · Escape or Resume to continue':'';}
$('#pause').onclick=()=>{if(game.mode==='playing')setPause(!paused);};
$('#resume').onclick=()=>setPause(false);
$('#quality').onclick=()=>{quality=quality===1?.7:1;$('#quality').textContent=quality===1?'Detail: high':'Detail: light';resize();};
$('#attune').onclick=()=>{if(!paused)game.attune();};
for(const [id,b]of buttonMap)b.onclick=()=>{if(!paused)game.cast(id,input.aim);};
function start(){clearInput();game.setBlessing(progress.blessing);game.start();setPause(false);winRecorded=false;$('#menu').hidden=true;$('#end').hidden=true;$('#hud').style.opacity=1;canvas.focus();last=performance.now();acc=0;}
$('#start').onclick=start;
$('#restart').onclick=()=>{game.reset();fx=[];numbers=[];ghosts=[];lastCat={x:game.cat.x,y:game.cat.y};start();};
$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'Sound on':'Sound off';if(sound){audio??=new AudioContext();if(!volume){volume=audio.createGain();volume.gain.value=.08;volume.connect(audio.destination);}audio.resume();tone(180,.3,'sine');}};
function tone(freq,duration,type='sine'){if(!sound||!audio)return;const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(freq,audio.currentTime);oscillator.frequency.exponentialRampToValueAtTime(Math.max(35,freq*.4),audio.currentTime+duration);gain.gain.setValueAtTime(.4,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);oscillator.connect(gain);gain.connect(volume);oscillator.start();oscillator.stop(audio.currentTime+duration);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};}
function burst(kind,p,r=60,life=.55){if(fx.length<100)fx.push({kind,x:p.x,y:p.y,r,t:0,life});}
function events(){for(const e of game.events){if(e.type==='notice'){noticeUntil=clock+3.2;$('#notice').textContent=e.text;$('#notice').classList.add('visible');}else if(e.type==='hit'){if(numbers.length<40)numbers.push({x:e.x+(Math.random()-.5)*25,y:e.y-90,n:e.n,t:0});burst('hit',e,20,.24);tone(170,.055);}else if(e.type==='hurt'){shake=5;burst('hurt',e,80,.35);tone(60,.18,'triangle');}else if(e.type==='death'){burst('death',e,65,.7);tone(110,.18);}else{burst(e.type,e,e.r||65,e.life||.8);if(['nova','anchor','heal','cat','dash'].includes(e.type))tone(e.type==='anchor'?420:220,.24);}}
 game.events.length=0;}
const colors={nova:'#bf8bff',roots:'#9acb7b',heal:'#a5e2a0',anchor:'#e7d0ff',dash:'#8adcff',death:'#b187ce',cat:'#d4dba0',hit:'#d8baff',pickup:'#c6a8ef',move:'#dcd5b0',cast:'#c6a8ef',hurt:'#e35067',strike:'#f18a63',telegraph:'#f77d65'};
function ellipse(x,y,r,c,width=2,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=c;ctx.lineWidth=width;ctx.beginPath();ctx.ellipse(x,y,r,r*.8,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
function shadow(x,y,r,opacity=.45){ctx.fillStyle=`rgba(0,0,0,${opacity})`;ctx.beginPath();ctx.ellipse(x,y+3,r,r*.32,0,0,Math.PI*2);ctx.fill();}
function character(p,row,height,moving){const cell=sprites[row]?.[p.dir||0];if(!cell)return;const width=height*cell.w/cell.h,bob=moving?Math.sin(p.walk*2)*2:Math.sin(clock*2)*.5;shadow(p.x,p.y,height*.23);ctx.save();ctx.translate(p.x,p.y-bob);if(row===0&&(p.dir===0||p.dir===3))ctx.scale(-1,1);if(p.inv>0)ctx.globalAlpha=.68+Math.sin(clock*30)*.2;if(row===0&&game.dash){ctx.globalAlpha=.42;ctx.filter='brightness(1.8) saturate(.3)';ctx.shadowColor='#a7f8ee';ctx.shadowBlur=14;}if(row===1){drawWalkingCat(cell,width,height,p.walk,moving);}else ctx.drawImage(atlas,cell.x,cell.y,cell.w,cell.h,-width/2,-height+5,width,height);ctx.restore();if(p.flash>0)ellipse(p.x,p.y,27,'#ffe2ff',2,p.flash*5);if(p.root>0){ellipse(p.x,p.y,40,'#aec68b',2,.8);ctx.strokeStyle='#9caf71';ctx.lineWidth=2;for(let j=0;j<5;j++){let x=p.x-30+j*15;ctx.beginPath();ctx.moveTo(x,p.y);ctx.quadraticCurveTo(x+12,p.y-20,x+3,p.y-38);ctx.stroke();}}}

function drawWalkingCat(cell,width,height,walk,moving){
 // Deform the lower silhouette continuously; keep the face and torso intact.
 // Alternating diagonal footfalls come from distance travelled, not a timer.
 const stride=catStride(walk,moving),split=.65;
 ctx.drawImage(atlas,cell.x,cell.y,cell.w,cell.h*split,-width/2,-height+5,width,height*split);
 const bands=18;
 for(let i=0;i<bands;i++){
  const v=i/bands,v2=(i+1)/bands,weight=v*v;
  for(let side=0;side<2;side++){
   const swing=(side===0?stride.left:stride.right)*weight;
   const sy=cell.y+cell.h*(split+(1-split)*v);
   const sh=cell.h*(1-split)/bands;
   ctx.drawImage(atlas,cell.x+side*cell.w/2,sy,cell.w/2,sh,
    -width/2+side*width/2+swing,-height+5+height*(split+(1-split)*v)-Math.max(0,swing)*.4,
    width/2,height*(1-split)*(v2-v)+.6);
  }
 }
}
function drawGhosts(){
 for(const ghost of ghosts){
  const cell=sprites[0]?.[ghost.dir||0];if(!cell)continue;
  const height=165,width=height*cell.w/cell.h;
  ctx.save();ctx.translate(ghost.x,ghost.y);
  if(ghost.dir===0||ghost.dir===3)ctx.scale(-1,1);
  ctx.globalAlpha=.32*(1-ghost.age/ghost.life);
  ctx.globalCompositeOperation='screen';ctx.filter='brightness(1.8) saturate(.25)';
  ctx.drawImage(atlas,cell.x,cell.y,cell.w,cell.h,-width/2,-height+5,width,height);
  ctx.restore();
 }
}

function draw(){ctx.fillStyle='#080b11';ctx.fillRect(0,0,vw,vh);if(!ground)return;ctx.save();ctx.translate(ox+(shake?Math.sin(clock*75)*shake:0),oy);ctx.scale(scale,scale);if(!groundCache){groundCache=document.createElement('canvas');groundCache.width=Math.ceil(W*scale);groundCache.height=Math.ceil(H*scale);groundCache.getContext('2d').drawImage(ground,0,0,groundCache.width,groundCache.height);}ctx.drawImage(groundCache,0,0,W,H);
 // Ground-level rings are drawn before sprites; telegraphs remain readable.
 for(let i=0;i<game.anchors.length;i++){const a=game.anchors[i],near=distance(a,game.player)<105;ellipse(a.x,a.y,42,a.on?'#c5a7f0':'#bda673',a.on?3:1,a.on?.85:.45);if(a.on){ellipse(a.x,a.y,49,'#9875d0',1,.5+Math.sin(clock*2+i)*.2);ctx.fillStyle='#d4baff';for(let k=0;k<6;k++){let t=clock*.6+k*Math.PI/3;ctx.fillRect(a.x+Math.cos(t)*35,a.y+Math.sin(t)*20-15-Math.sin(clock+k)*10,2,3);}}else if(near){ctx.fillStyle='#eee1bb';ctx.font='12px Georgia';ctx.textAlign='center';ctx.fillText('F · ATTUNE',a.x,a.y-55);}}
 for(const f of fx){const p=f.t/f.life,c=colors[f.kind]||'#ba9ade';if(f.kind==='telegraph'){ctx.fillStyle=`rgba(184,44,40,${.1+p*.18})`;ctx.beginPath();ctx.ellipse(f.x,f.y,f.r,f.r*.8,0,0,Math.PI*2);ctx.fill();ellipse(f.x,f.y,f.r,c,2,.85);ellipse(f.x,f.y,f.r*p,c,2,.85);}else if(['nova','roots','heal','anchor','dash','move','strike'].includes(f.kind)){ellipse(f.x,f.y,f.r*(f.kind==='roots'?1:p),c,f.kind==='nova'?4:2,1-p);if(f.kind==='nova'||f.kind==='anchor')ellipse(f.x,f.y,f.r*p*.85,'#f9e6ff',1,1-p);}}
 for(const drop of game.loot){shadow(drop.x,drop.y,11,.25);ctx.save();ctx.translate(drop.x,drop.y-7+Math.sin(clock*3)*3);ctx.rotate(Math.PI/4);ctx.fillStyle='#b199e2';ctx.fillRect(-4,-4,8,8);ctx.strokeStyle='#e0caee';ctx.strokeRect(-4,-4,8,8);ctx.restore();}
 drawGhosts();
 let moving=Math.hypot(game.player.x-lastPos.x,game.player.y-lastPos.y)>.01;const actors=[{p:game.player,row:0,h:165,m:moving},{p:game.cat,row:1,h:80,m:catMoving},...game.enemies.map(e=>({p:e,row:e.boss?3:2,h:e.boss?215:117,m:!e.wind&&!e.root}))];actors.sort((a,b)=>a.p.y-b.p.y);for(const a of actors)character(a.p,a.row,a.h,a.m);lastPos={x:game.player.x,y:game.player.y};
 for(const e of game.enemies){if(e.hp<e.maxHp||distance(e,input.aim)<70){const w=e.boss?100:48;ctx.fillStyle='#100d14';ctx.fillRect(e.x-w/2,e.y-(e.boss?209:111),w,4);ctx.fillStyle=e.boss?'#cd7d8a':'#bca76f';ctx.fillRect(e.x-w/2,e.y-(e.boss?209:111),w*e.hp/e.maxHp,3);}}
 for(const s of game.shots){const d=Math.hypot(s.vx,s.vy);ctx.strokeStyle='#b392e4';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(s.x-s.vx/d*25,s.y-s.vy/d*25);ctx.lineTo(s.x,s.y);ctx.stroke();ctx.strokeStyle='#eee3ff';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#f6e8ff';ctx.beginPath();ctx.arc(s.x,s.y,4,0,7);ctx.fill();}
 for(const f of fx){if(['hit','death','cat','cast','pickup'].includes(f.kind)){const p=f.t/f.life;ctx.globalAlpha=1-p;ctx.strokeStyle=colors[f.kind];ctx.lineWidth=1.7;for(let k=0;k<7;k++){let a=k*6.283/7+f.x;ctx.beginPath();ctx.moveTo(f.x+Math.cos(a)*f.r*p*.5,f.y-30+Math.sin(a)*f.r*p*.5);ctx.lineTo(f.x+Math.cos(a)*f.r*p,f.y-30+Math.sin(a)*f.r*p);ctx.stroke();}ctx.globalAlpha=1;}}
 ctx.textAlign='center';ctx.font='bold 16px Georgia';for(const n of numbers){ctx.globalAlpha=1-n.t/.8;ctx.strokeStyle='#17121c';ctx.lineWidth=3;ctx.strokeText(n.n,n.x,n.y-n.t*45);ctx.fillStyle='#f3e3b6';ctx.fillText(n.n,n.x,n.y-n.t*45);}ctx.globalAlpha=1;
 // A small fixed number of ambient motes, independent of enemies and combat.
 ctx.fillStyle='#b9b5e1';for(let i=0;i<32;i++){let x=(i*313+Math.sin(clock*.16+i)*24)%W,y=(i*173-clock*(5+i%4))%H;if(y<0)y+=H;ctx.globalAlpha=.13+.18*(.5+.5*Math.sin(clock+i));ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
 ctx.restore();}
function hud(){const p=game.player;$('#health').textContent=Math.ceil(p.hp);$('#mana').textContent=Math.floor(p.mana);$('#healthFill').style.height=`${p.hp/p.maxHp*100}%`;$('#manaFill').style.height=`${p.mana}%`;$('#relics').textContent=`${game.relics} amethyst fragments`;$('#power').textContent=`+${Math.round((game.power-1)*100)}%`;[...$('#seals').children].forEach((e,i)=>e.classList.toggle('on',game.anchors[i].on));$('#objective').textContent=game.bossSpawned?'Defeat the Thorn Crown':`Awaken the root seals · ${game.encounter} / 3`;
 const boss=game.enemies.find(e=>e.boss);$('#boss').hidden=!boss;if(boss)$('#boss i').style.width=`${boss.hp/boss.maxHp*100}%`;for(const [id,b] of buttonMap){const remaining=game.cd[id]||0,cover=b.querySelector('em');cover.style.display=remaining>.05?'flex':'none';cover.textContent=remaining.toFixed(1);b.style.opacity=p.mana<SKILLS[id].cost?'.5':'1';}
 if(clock>noticeUntil)$('#notice').classList.remove('visible');if(!paused)$('#interact').textContent=game.anchors.some(a=>!a.on&&distance(a,p)<105)?'Press F or tap Attune to awaken this root seal':'';$('#attune').hidden=paused||game.mode!=='playing'||!game.anchors.some(a=>!a.on&&distance(a,p)<105);
 if((game.mode==='won'||game.mode==='lost')&&$('#end').hidden){$('#end').hidden=false;$('#endTitle').innerHTML=game.mode==='won'?'The veil<br><em>opens.</em>':'The roots<br><em>remember.</em>';$('#endLabel').textContent=game.mode==='won'?'THE GROVE IS YOURS':'PUNKIN WILL FIND YOU AGAIN';$('#endStats').textContent=`${game.kills} creatures defeated · ${game.encounter} seals awakened · ${game.relics} fragments found`;clearInput();if(game.mode==='won'&&!winRecorded){progress.wins++;winRecorded=true;saveProgress();}$('#rewards').hidden=game.mode!=='won';updateProgress();}
}
function frame(now){requestAnimationFrame(frame);if(document.hidden){last=now;return;}const dt=Math.min((now-last)/1000||0,.05);last=now;if(!paused){clock+=dt;acc+=dt;let steps=0;while(acc>=1/60&&steps++<4){const before={...game.player},wasDashing=!!game.dash;game.step(1/60,{...input,direction:{x:Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),y:Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp'))},fire:input.fire||keys.has('KeyQ')});ghosts=dashGhosts(ghosts,before,game.player,wasDashing,1/60);acc-=1/60;}events();for(const f of fx)f.t+=dt;fx=fx.filter(f=>f.t<f.life);for(const n of numbers)n.t+=dt;numbers=numbers.filter(n=>n.t<.8);shake=Math.max(0,shake-dt*25);}catMoving=Math.hypot(game.cat.x-lastCat.x,game.cat.y-lastCat.y)>.01;lastCat={x:game.cat.x,y:game.cat.y};draw();if(now-uiAt>100){hud();uiAt=now;}frames++;if(now-fpsStart>=1000){$('#performance').textContent=`${Math.round(frames*1000/(now-fpsStart))} FPS`;fpsStart=now;frames=0;}}
function updateProgress(){$('#journey').textContent=progress.wins?`${progress.wins} grove${progress.wins===1?'':'s'} restored · ${BLESSINGS[progress.blessing]?.name||'Choose a blessing after victory'}`:'Your first journey beyond the veil';$('#saveStatus').textContent=storageAvailable?'Your blessing is saved on this browser.':'Browser saving unavailable; your blessing lasts this session.';for(const b of document.querySelectorAll('[data-blessing]'))b.setAttribute('aria-pressed',String(b.dataset.blessing===progress.blessing));}
for(const b of document.querySelectorAll('[data-blessing]'))b.onclick=()=>{if(game.mode!=='won')return;progress.blessing=b.dataset.blessing;saveProgress();updateProgress();};
updateProgress();
try{[ground,atlas]=await Promise.all([loadImage('assets/grove.webp'),loadImage('assets/characters.webp')]);spriteCells(atlas);loaded=true;$('#start').disabled=false;$('#start').textContent='Enter the grove';$('#hud').style.opacity='.35';requestAnimationFrame(frame);}catch(e){$('#start').textContent='Artwork failed to load';$('.instructions').textContent='Reload this page to retry. '+e.message;console.error(e);}
