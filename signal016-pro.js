(function(){
'use strict';
const VERSION='SIGNAL 016';
let level=1,xp=0,xpNeed=140,credits=0,combo=0,comboT=0,damageMult=1,shrineBuff=0;
let proT=0,lastFrame=performance.now(),lastHP=160,lastShield=50,nextWave=24,portal=null,portalUsed=false,shake=0;
const proFx=[],trackedDrops=[],shrines=[];

/* ---------- cinematic HUD ---------- */
const style=document.createElement('style');
style.textContent=`
#prohud{position:absolute;left:28px;top:72px;width:250px;font-family:system-ui;filter:drop-shadow(0 8px 18px #000b)}
#prohud .row{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;color:#e8dcc1;font-size:10px;letter-spacing:.13em;text-transform:uppercase}
#prohud .lvl{font:800 12px Georgia,serif;color:#f2d493;letter-spacing:.15em}
#prohud .credits{color:#71eaff;font-weight:800}
#xprail{height:5px;background:#08070d;border:1px solid #6f5a39;margin-top:5px;box-shadow:inset 0 0 8px #000}
#xpfill{height:100%;width:0;background:linear-gradient(90deg,#6a3cff,#51e7ff,#e6c66e);box-shadow:0 0 12px #5ae9ff99;transition:width .18s}
#buffline{height:15px;margin-top:6px;color:#8ff8ff;font-size:9px;letter-spacing:.12em}
#comboPro{position:absolute;left:50%;top:145px;transform:translateX(-50%);font:900 17px Georgia,serif;letter-spacing:.16em;color:#f6d985;text-shadow:0 0 16px #a33cff,0 3px 4px #000;opacity:0;transition:opacity .15s}
#objectivePro{position:absolute;left:50%;top:105px;transform:translateX(-50%) translateY(-8px);min-width:320px;text-align:center;padding:8px 18px;border-top:1px solid #ab8950;border-bottom:1px solid #ab8950;background:linear-gradient(90deg,transparent,#090713e8 16%,#090713e8 84%,transparent);font:700 10px system-ui;letter-spacing:.22em;color:#edd6a1;opacity:0;transition:.35s;box-shadow:0 9px 30px #0008}
#objectivePro.on{opacity:1;transform:translateX(-50%) translateY(0)}
#lootPro{position:absolute;right:22px;bottom:176px;width:270px;display:grid;gap:4px;justify-items:end}
.lootToast{font:700 10px system-ui;letter-spacing:.09em;padding:5px 8px;background:#07070dcc;border-left:2px solid currentColor;box-shadow:0 6px 18px #0009;animation:lootIn .25s ease-out}
@keyframes lootIn{from{transform:translateX(12px);opacity:0}to{transform:none;opacity:1}}
.enemyPlate{position:fixed;z-index:6;pointer-events:none;transform:translate(-50%,-100%);width:82px;text-align:center;font:700 8px system-ui;letter-spacing:.08em;text-shadow:0 2px 3px #000}
.enemyPlate .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.enemyPlate .b{height:3px;margin-top:3px;background:#17070c;border:1px solid #4e3138}.enemyPlate .f{height:100%;background:linear-gradient(90deg,#b62445,#ff6276)}
.dropLabel{position:fixed;z-index:6;pointer-events:none;transform:translate(-50%,-100%);padding:3px 6px;background:#05050ad9;border:1px solid currentColor;font:800 8px system-ui;letter-spacing:.08em;box-shadow:0 4px 16px #000c;white-space:nowrap}
#hurtPro{position:fixed;inset:0;pointer-events:none;z-index:5;opacity:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(150,0,28,.48));mix-blend-mode:screen}
body:before{content:"";position:fixed;inset:0;z-index:3;pointer-events:none;opacity:.14;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.018) 3px 4px)}
@media(max-width:900px){#prohud{left:16px;top:58px;transform:scale(.82);transform-origin:top left}#lootPro{display:none}.enemyPlate{display:none}}
`;
document.head.appendChild(style);
const hud=document.querySelector('.hud')||document.body;
const proHud=document.createElement('div');proHud.id='prohud';proHud.innerHTML=`<div class="row"><span class="lvl">RECEIVER <b id="proLvl">01</b></span><span class="credits">✦ <b id="proCredits">0</b></span></div><div id="xprail"><div id="xpfill"></div></div><div id="buffline"></div>`;hud.appendChild(proHud);
const comboEl=document.createElement('div');comboEl.id='comboPro';hud.appendChild(comboEl);
const objectiveEl=document.createElement('div');objectiveEl.id='objectivePro';hud.appendChild(objectiveEl);
const lootEl=document.createElement('div');lootEl.id='lootPro';hud.appendChild(lootEl);
const hurtEl=document.createElement('div');hurtEl.id='hurtPro';document.body.appendChild(hurtEl);
const lvlEl=document.getElementById('proLvl'),creditEl=document.getElementById('proCredits'),xpFill=document.getElementById('xpfill'),buffEl=document.getElementById('buffline');

function banner(s){objectiveEl.textContent=s;objectiveEl.classList.add('on');clearTimeout(banner.t);banner.t=setTimeout(()=>objectiveEl.classList.remove('on'),2600)}
function toast(s,c='#72eaff'){let d=document.createElement('div');d.className='lootToast';d.style.color=c;d.textContent=s;lootEl.prepend(d);while(lootEl.children.length>5)lootEl.lastChild.remove();setTimeout(()=>{d.style.opacity='0';setTimeout(()=>d.remove(),250)},3600)}
function addXP(n){xp+=n;while(xp>=xpNeed){xp-=xpNeed;level++;xpNeed=Math.round(xpNeed*1.32+35);damageMult=1+(level-1)*.075;banner('SIGNAL LEVEL '+String(level).padStart(2,'0')+' · RESONANCE AMPLIFIED');flash(player.position,0x72eaff,30);pulseAt(player.position,0x72eaff,2.4)}lvlEl.textContent=String(level).padStart(2,'0');xpFill.style.width=(xp/xpNeed*100).toFixed(1)+'%'}

/* ---------- world polish ---------- */
function pulseAt(pos,color=0x72eaff,max=2){let ring=new THREE.Mesh(new THREE.RingGeometry(.32,.42,48),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.position.copy(pos);ring.position.y=.11;scene.add(ring);proFx.push({m:ring,t:0,life:.7,grow:max,kind:'ring'})}
function sparks(pos,color=0xff5edb,count=7){for(let i=0;i<count;i++){let m=new THREE.Mesh(new THREE.OctahedronGeometry(.035+Math.random()*.035),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.copy(pos).add(new THREE.Vector3((Math.random()-.5)*.35,.7+Math.random()*.8,(Math.random()-.5)*.35));scene.add(m);proFx.push({m,t:0,life:.42+Math.random()*.28,v:new THREE.Vector3((Math.random()-.5)*2.8,1.3+Math.random()*2.2,(Math.random()-.5)*2.8),kind:'spark'})}}
function buildMotes(){let count=220,p=new Float32Array(count*3);for(let i=0;i<count;i++){p[i*3]=(Math.random()-.5)*48;p[i*3+1]=.25+Math.random()*7;p[i*3+2]=(Math.random()-.5)*48}let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));let mat=new THREE.PointsMaterial({color:0x8edfff,size:.035,transparent:true,opacity:.34,depthWrite:false,blending:THREE.AdditiveBlending});let pts=new THREE.Points(g,mat);pts.userData.motes=true;scene.add(pts);return pts}
const motes=buildMotes();
for(let i=0;i<7;i++){let r=new THREE.Mesh(new THREE.RingGeometry(.55+Math.random()*.5,.59+Math.random()*.52,40),new THREE.MeshBasicMaterial({color:i%2?0x7ceaff:0x9b5cff,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));r.rotation.x=-Math.PI/2;r.position.set((Math.random()-.5)*24,.035,(Math.random()-.5)*24);r.userData.rune=true;r.userData.phase=Math.random()*6.28;scene.add(r)}

function makeShrine(x,z,i){let g=new THREE.Group();let base=new THREE.Mesh(new THREE.CylinderGeometry(.55,.72,.22,8),M(0x241c32,.12,.5,.42));base.position.y=.11;g.add(base);let core=new THREE.Mesh(new THREE.OctahedronGeometry(.25,1),M(i===1?0xff6bdd:0x62eaff,2.8,.22,.14));core.position.y=.78;g.add(core);for(let j=0;j<2;j++){let t=new THREE.Mesh(new THREE.TorusGeometry(.38+j*.13,.025,8,32),new THREE.MeshBasicMaterial({color:j?0xb868ff:0x63eaff,transparent:true,opacity:.62,blending:THREE.AdditiveBlending}));t.rotation.x=Math.PI/2;t.position.y=.78;g.add(t)}g.position.set(x,0,z);scene.add(g);let light=addLight(i===1?0xd45cff:0x55eaff,8,6,x,1.1,z);let s={g,used:false,light,phase:i*2.1};shrines.push(s);return s}
makeShrine(-7.5,7.5,0);makeShrine(8.5,5.5,1);makeShrine(-8.5,-6.5,2);

/* ---------- enemy ranks + plates ---------- */
function tintEnemy(e,color,em=1.1){e.g.traverse(o=>{if(o.material&&o.material.color){o.material=o.material.clone();o.material.color.lerp(new THREE.Color(color),.35);if('emissive' in o.material){o.material.emissive=new THREE.Color(color);o.material.emissiveIntensity=Math.max(o.material.emissiveIntensity||0,em*.18)}}})}
function enhanceEnemy(e,index=0){if(!e||e.proRank!=null)return;if(e.boss){e.proRank=3;e.proName='THE VOID CURATOR';return}let roll=(Math.sin((e.g.position.x*12.9898+e.g.position.z*78.233+index)*43758.5453)+1)%1;if(roll<0)roll=-roll;if(roll>.90){e.proRank=2;e.proName='PRISMATIC ELITE';e.hp*=2.2;e.max=e.hp;e.speed*=1.08;e.g.scale.multiplyScalar(1.18);tintEnemy(e,0xffc657,1.5)}else if(roll>.68){e.proRank=1;e.proName='PHASE-STALKER';e.hp*=1.45;e.max=e.hp;e.speed*=1.18;tintEnemy(e,0x65dfff,1.2)}else{e.proRank=0;e.proName='VEIL MANTIS'} }
enemies.forEach(enhanceEnemy);
const coreSpawn=spawnEnemy;spawnEnemy=function(isBoss=false){let n=enemies.length;coreSpawn(isBoss);let e=enemies[enemies.length-1];enhanceEnemy(e,n);if(!isBoss&&e&&e.proRank===2){banner('ELITE SIGNAL DETECTED · PRISMATIC MANTIS');pulseAt(e.g.position,0xffcb62,1.8)}return e};

function plateFor(e){if(e.boss||e.dead)return null;if(!e.proPlate){let d=document.createElement('div');d.className='enemyPlate';d.innerHTML='<div class="n"></div><div class="b"><div class="f"></div></div>';document.body.appendChild(d);e.proPlate=d}return e.proPlate}

/* ---------- combat feel ---------- */
const coreHit=hitEnemy;hitEnemy=function(e,d){if(!e||e.dead)return;let actual=d*damageMult*(shrineBuff>0?1.28:1);coreHit(e,actual);sparks(e.g.position,e.proRank===2?0xffc65c:0xff5edb,e.proRank===2?12:6);shake=Math.max(shake,.035);if(e.proPlate){e.proPlate.style.transform='translate(-50%,-100%) scale(1.06)';setTimeout(()=>{if(e.proPlate)e.proPlate.style.transform='translate(-50%,-100%)'},55)}};
const coreKill=killEnemy;killEnemy=function(e){if(!e||e.dead)return;let before=drops.length,rank=e.proRank||0,bossy=!!e.boss;coreKill(e);let gain=bossy?520:rank===2?110:rank===1?52:28;let creds=bossy?130:rank===2?24:rank===1?10:4;credits+=creds;creditEl.textContent=credits;addXP(gain);combo++;comboT=4.2;comboEl.textContent='CHAIN × '+combo+(combo>=5?'  ·  RESONANT':'');comboEl.style.opacity=1;pulseAt(e.g.position,bossy?0xff5a8a:rank===2?0xffc65c:0x8d5cff,bossy?3.6:1.7);sparks(e.g.position,bossy?0xff718f:0x74eaff,bossy?28:10);shake=Math.max(shake,bossy?.22:.08);if(e.proPlate){e.proPlate.remove();e.proPlate=null}for(let i=before;i<drops.length;i++)decorateDrop(drops[i],e);if(bossy){banner('VOID CURATOR DEFEATED · THE VEIL GATE CAN FORM');toast('LEGENDARY SIGNAL CACHE +'+creds+' ✦','#ffd56b')}};

const itemNames=['Prismatic Cortex','Veilglass Shard','Signal Filament','Fractured Lens','Resonance Coil','Mantis Memory'];
function decorateDrop(d,e){if(!d||d.pro)return;d.pro=true;let rank=e&&e.boss?3:e&&e.proRank===2?2:Math.random()>.72?1:0;d.rarity=rank;d.itemName=rank===3?'Curator\'s Fractured Eye':itemNames[Math.floor(Math.random()*itemNames.length)];let colors=['#8bdfff','#a56bff','#ffd365','#ff5cae'];d.color=colors[rank];if(d.m.material){d.m.material=d.m.material.clone();d.m.material.emissive=new THREE.Color(d.color);d.m.material.emissiveIntensity=2.4}let lab=document.createElement('div');lab.className='dropLabel';lab.style.color=d.color;lab.textContent=(rank===3?'LEGENDARY · ':rank===2?'RARE · ':rank===1?'ENHANCED · ':'')+d.itemName;document.body.appendChild(lab);d.proLabel=lab;trackedDrops.push(d)}

/* ---------- veil gate / progression ---------- */
function makePortal(){if(portal)return;portal=new THREE.Group();for(let i=0;i<4;i++){let t=new THREE.Mesh(new THREE.TorusGeometry(1.15+i*.08,.035+i*.006,10,64),new THREE.MeshBasicMaterial({color:i%2?0x55eaff:0xc85cff,transparent:true,opacity:.68-i*.1,depthWrite:false,blending:THREE.AdditiveBlending}));t.position.y=1.55;t.rotation.y=Math.PI/2;t.rotation.z=i*.22;portal.add(t)}let core=new THREE.Mesh(new THREE.CircleGeometry(.92,48),new THREE.MeshBasicMaterial({color:0x4d2cff,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));core.position.y=1.55;core.rotation.y=Math.PI/2;portal.add(core);portal.position.set(0,0,11.5);scene.add(portal);addLight(0x7958ff,18,12,0,1.8,11.5);banner('THE VEIL GATE HAS FORMED · REACH THE NORTHERN EDGE')}

/* ---------- responsive damage / render shake ---------- */
const coreRender=renderer.render.bind(renderer);renderer.render=function(s,c){if(shake>0&&c){let ox=(Math.random()-.5)*shake,oy=(Math.random()-.5)*shake*.55,oz=(Math.random()-.5)*shake;c.position.x+=ox;c.position.y+=oy;c.position.z+=oz;coreRender(s,c);c.position.x-=ox;c.position.y-=oy;c.position.z-=oz}else coreRender(s,c)};
function incomingDamageFx(){hurtEl.style.opacity='.72';setTimeout(()=>hurtEl.style.opacity='0',90);shake=Math.max(shake,.09)}

/* ---------- procedural audio, enabled only after player gesture ---------- */
let audioCtx=null,master=null;
function startAudio(){if(audioCtx){audioCtx.resume();return}try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();master=audioCtx.createGain();master.gain.value=.055;master.connect(audioCtx.destination);let osc=audioCtx.createOscillator(),g=audioCtx.createGain(),flt=audioCtx.createBiquadFilter();osc.type='sine';osc.frequency.value=54;g.gain.value=.16;flt.type='lowpass';flt.frequency.value=180;osc.connect(flt);flt.connect(g);g.connect(master);osc.start();let osc2=audioCtx.createOscillator(),g2=audioCtx.createGain();osc2.type='triangle';osc2.frequency.value=81;g2.gain.value=.035;osc2.connect(g2);g2.connect(master);osc2.start()}catch(e){}}
if(window.start)start.addEventListener('click',()=>{startAudio();banner(VERSION+' ACQUIRED · THE GROVE IS ALIVE')});

function proFrame(){
 let now=performance.now(),dt=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;if(!isFinite(dt)||dt<=0)dt=.016;proT+=dt;shake=Math.max(0,shake-dt*.55);
 if(!scene||!player)return;
 motes.rotation.y+=dt*.012;motes.position.y=Math.sin(proT*.15)*.08;
 scene.traverse(o=>{if(o.userData&&o.userData.rune){o.rotation.z+=dt*.12;o.material.opacity=.10+.08*(.5+.5*Math.sin(proT*1.4+o.userData.phase))}});
 for(let s of shrines){s.g.rotation.y+=dt*.5;s.g.children.forEach((o,j)=>{if(o.geometry&&o.geometry.type==='TorusGeometry')o.rotation.z+=dt*(j%2?-.8:.8)});if(!s.used&&s.g.position.distanceTo(player.position)<1.45){s.used=true;shrineBuff=20;manav=150;shieldv=50;s.light.intensity=18;s.g.scale.setScalar(1.16);pulseAt(s.g.position,0x72eaff,3);banner('RESONANCE SHRINE · DAMAGE +28% FOR 20s');toast('RESONANCE SURGE','#75edff')}}
 if(shrineBuff>0)shrineBuff=Math.max(0,shrineBuff-dt);buffEl.textContent=shrineBuff>0?'◆ RESONANCE SURGE  '+shrineBuff.toFixed(1)+'s':'';
 if(comboT>0){comboT-=dt;if(comboT<=0){combo=0;comboEl.style.opacity=0}}
 if(running){nextWave-=dt;let alive=enemies.filter(e=>!e.dead&&!e.boss).length;if(nextWave<=0&&alive<7){nextWave=22+Math.random()*8;for(let i=0;i<Math.min(3,7-alive);i++)spawnEnemy(false);toast('VEIL ACTIVITY · NEW HOSTILES','#d87aff')}}
 for(let e of enemies){if(e.dead){if(e.proPlate){e.proPlate.remove();e.proPlate=null}continue}let p=plateFor(e);if(p){let sc=proj(e.g.position.clone().add(new THREE.Vector3(0,2.15*(e.g.scale.y||1),0)));if(sc.x<-80||sc.x>innerWidth+80||sc.y<-40||sc.y>innerHeight+80){p.style.display='none'}else{p.style.display='block';p.style.left=sc.x+'px';p.style.top=sc.y+'px';p.querySelector('.n').textContent=e.proName||'VEIL MANTIS';p.querySelector('.n').style.color=e.proRank===2?'#ffd36c':e.proRank===1?'#71eaff':'#e9d9c1';p.querySelector('.f').style.width=Math.max(0,e.hp/e.max*100)+'%'}}}
 for(let d of trackedDrops){if(d.gone){if(d.proLabel){d.proLabel.remove();d.proLabel=null}if(!d.proPicked){d.proPicked=true;toast('ACQUIRED · '+d.itemName,d.color)}}else if(d.m&&d.proLabel){let sc=proj(d.m.position.clone().add(new THREE.Vector3(0,.45,0)));d.proLabel.style.left=sc.x+'px';d.proLabel.style.top=sc.y+'px'}}
 for(let i=proFx.length-1;i>=0;i--){let f=proFx[i];f.t+=dt;if(f.kind==='spark'){f.v.y-=4.6*dt;f.m.position.addScaledVector(f.v,dt);f.m.material.opacity=Math.max(0,1-f.t/f.life)}else if(f.kind==='ring'){let k=1+(f.t/f.life)*f.grow;f.m.scale.set(k,k,k);f.m.material.opacity=Math.max(0,.9-f.t/f.life)}if(f.t>=f.life){scene.remove(f.m);proFx.splice(i,1)}}
 if((hpv<lastHP-.2)||(shieldv<lastShield-.8))incomingDamageFx();lastHP=hpv;lastShield=shieldv;
 if(boss&&boss.dead&&anchorsDone>=3&&!portal)makePortal();if(portal){portal.rotation.y+=dt*.18;portal.children.forEach((o,i)=>{if(o.geometry&&o.geometry.type==='TorusGeometry')o.rotation.z+=dt*(i%2?-.55:.55)});if(!portalUsed&&portal.position.distanceTo(player.position)<1.8){portalUsed=true;addXP(300);credits+=75;creditEl.textContent=credits;banner('VEIL GATE SYNCHRONIZED · ACT I PATH UNLOCKED');toast('ACT I ACCESS TOKEN +75 ✦','#ffd46b')}}
}

/* Chain into the already-running render loop without replacing core simulation. */
const coreAnimate=animate;animate=function(){proFrame();coreAnimate()};

/* Existing drops can now receive labels when first seen. */
for(let d of drops)decorateDrop(d,null);
creditEl.textContent=credits;addXP(0);
console.log('[QUETOPIA] '+VERSION+' professional polish layer active');
})();