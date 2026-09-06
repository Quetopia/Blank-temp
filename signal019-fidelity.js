(function(){
'use strict';
/* QUETOPIA SIGNAL 019 — veil fidelity pass
   Non-destructive visual layer on top of SIGNAL 018/017 systems.
   Adds richer materials, environment dressing, player detail, hit/cast feedback,
   elite readability and restrained atmospheric motion without changing game math. */
const TAG='SIGNAL 019 · VEIL FIDELITY';
if(typeof THREE==='undefined'){console.warn('[QUETOPIA] '+TAG+' waiting for Three.js');return}
if(typeof scene==='undefined'||!scene){console.warn('[QUETOPIA] '+TAG+' scene unavailable');return}

try{
  if(typeof renderer!=='undefined'&&renderer){
    renderer.shadowMap.enabled=true;
    if(THREE.PCFSoftShadowMap)renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    if('toneMappingExposure' in renderer)renderer.toneMappingExposure=Math.max(renderer.toneMappingExposure||1,1.42);
    if('outputColorSpace' in renderer&&THREE.SRGBColorSpace)renderer.outputColorSpace=THREE.SRGBColorSpace;
  }
  if(scene.fog&&typeof scene.fog.density==='number')scene.fog.density=Math.min(scene.fog.density,.0195);
}catch(e){console.warn('[QUETOPIA] 019 renderer tune',e)}

const css=document.createElement('style');
css.textContent=`
#q19Mark{position:fixed;left:18px;bottom:18px;z-index:8;pointer-events:none;font:800 7px/1 system-ui;letter-spacing:.19em;color:#8e8199;text-shadow:0 2px 5px #000}#q19Mark b{color:#d9bf78}
#q19Veil{position:fixed;inset:0;z-index:5;pointer-events:none;background:radial-gradient(ellipse at 50% 40%,transparent 0 42%,rgba(11,4,24,.08) 64%,rgba(2,1,6,.38) 100%),linear-gradient(180deg,rgba(72,40,117,.035),transparent 24%,transparent 74%,rgba(0,0,0,.18));mix-blend-mode:screen}
.hotbar{border-color:#c39d58!important;box-shadow:0 0 0 1px #070509,0 16px 48px #000d,inset 0 1px 0 #ffe8ac26!important}
.skill{transition:transform .08s ease,box-shadow .12s ease,filter .12s ease}.skill.q19Pulse{transform:translateY(-2px) scale(1.025);filter:brightness(1.16) saturate(1.16)}
.quest{box-shadow:0 16px 48px #000c,inset 0 1px 0 #ffe9b81a!important}
#q18Status{bottom:120px!important;background:linear-gradient(180deg,#100c17ee,#06060bf2)!important;border-color:#96784b!important;backdrop-filter:blur(8px)}
`;
document.head.appendChild(css);
const mark=document.createElement('div');mark.id='q19Mark';mark.innerHTML='<b>SIGNAL 019</b> · VEIL FIDELITY';document.body.appendChild(mark);
const veil=document.createElement('div');veil.id='q19Veil';document.body.appendChild(veil);

const fx=[];
let qtime=0,last=performance.now(),trailTick=0;
function addFx(o){fx.push(o);return o}
function glow(c,o=.72){return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending})}
function pbr(c,e=.18,metal=.25,rough=.42){return new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:e,metalness:metal,roughness:rough})}
function ring(pos,a,b,c,o=.6,y=.06){let m=new THREE.Mesh(new THREE.RingGeometry(a,b,64),glow(c,o));m.rotation.x=-Math.PI/2;m.position.copy(pos);m.position.y=y;scene.add(m);return m}
function flashLight(pos,c,intensity=12,life=.22){let l=new THREE.PointLight(c,intensity,6);l.position.copy(pos).add(new THREE.Vector3(0,.8,0));scene.add(l);addFx({kind:'light',o:l,t:0,life})}
function sparks(pos,c=0x72eaff,n=10,power=2.5){for(let i=0;i<n;i++){let m=new THREE.Mesh(new THREE.TetrahedronGeometry(.035+Math.random()*.035),glow(i%4===0?0xffffff:c,.9));m.position.copy(pos).add(new THREE.Vector3(0,.35+Math.random()*.35,0));scene.add(m);let a=Math.random()*Math.PI*2,s=.5+Math.random()*power;addFx({kind:'spark',o:m,t:0,life:.32+Math.random()*.35,v:new THREE.Vector3(Math.cos(a)*s,.8+Math.random()*2.3,Math.sin(a)*s),spin:(Math.random()-.5)*8})}}
function pulse(pos,c=0x72eaff,r=.55){let m=ring(pos,r,r+.075,c,.68,.075);addFx({kind:'pulse',o:m,t:0,life:.46});return m}

const decor=[];
function crystalCluster(x,z,s=1,base=0x5d46a0,edge=0x6ceaff){let g=new THREE.Group();for(let i=0;i<5;i++){let h=(.55+Math.random()*1.1)*s,r=(.08+Math.random()*.08)*s;let c=new THREE.Mesh(new THREE.ConeGeometry(r,h,5),pbr(i%2?base:edge,.55,.38,.24));let a=i/5*Math.PI*2+Math.random()*.5;c.position.set(Math.cos(a)*.22*s,h/2,Math.sin(a)*.22*s);c.rotation.z=(Math.random()-.5)*.28;c.castShadow=true;g.add(c)}let halo=new THREE.Mesh(new THREE.TorusGeometry(.36*s,.018*s,7,32),glow(edge,.24));halo.rotation.x=Math.PI/2;halo.position.y=.06;g.add(halo);g.position.set(x,0,z);scene.add(g);decor.push({kind:'crystal',g,phase:Math.random()*6.28});return g}
function runeSeal(x,z,s=1,c1=0x5eeaff,c2=0xb85cff){let g=new THREE.Group();for(let i=0;i<3;i++){let r=new THREE.Mesh(new THREE.RingGeometry((.48+i*.18)*s,(.495+i*.18)*s,64),glow(i===1?c2:c1,.20-i*.025));r.rotation.x=-Math.PI/2;r.position.y=.025+i*.003;g.add(r)}for(let i=0;i<6;i++){let a=i/6*Math.PI*2;let bar=new THREE.Mesh(new THREE.BoxGeometry(.035*s,.012*s,.34*s),glow(i%2?c2:c1,.22));bar.position.set(Math.cos(a)*.64*s,.03,Math.sin(a)*.64*s);bar.rotation.y=-a;g.add(bar)}g.position.set(x,0,z);scene.add(g);decor.push({kind:'rune',g,phase:Math.random()*6.28});return g}

[[-10,6,1.15],[9,8,.9],[-9,-8,.95],[10,-7,1.1],[-2,11,.72],[4,-11,.8]].forEach((v,i)=>crystalCluster(v[0],v[1],v[2],i%2?0x7f3c91:0x3c477f,i%3?0x6ceaff:0xff67d8));
[[-6,2,.75],[6,-1,.72],[2,7,.6],[-3,-7,.62]].forEach((v,i)=>runeSeal(v[0],v[1],v[2],i%2?0x69eaff:0xa866ff,i%2?0xd15cff:0x5eeaff));
try{let centerRing=ring(new THREE.Vector3(0,0,0),5.8,5.84,0x744cff,.10,.018);decor.push({kind:'center',g:centerRing,phase:0})}catch(_){ }

let motes=null;
try{
  const arr=[];for(let i=0;i<220;i++)arr.push((Math.random()-.5)*34,.25+Math.random()*5.5,(Math.random()-.5)*34);
  let moteGeom=new THREE.BufferGeometry();moteGeom.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));
  motes=new THREE.Points(moteGeom,new THREE.PointsMaterial({color:0xbca4ff,size:.035,transparent:true,opacity:.25,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(motes);
}catch(e){console.warn('[QUETOPIA] 019 motes',e)}

let playerDecorated=false;
function decoratePlayer(){if(playerDecorated||typeof player==='undefined'||!player)return;playerDecorated=true;
  try{
    const chestGlow=new THREE.Mesh(new THREE.TorusGeometry(.19,.018,8,30),glow(0x6ceaff,.75));chestGlow.position.set(0,1.47,.30);chestGlow.rotation.x=Math.PI/2;player.add(chestGlow);
    const belt=new THREE.Mesh(new THREE.TorusGeometry(.31,.035,8,28),pbr(0xb18a48,.22,.58,.28));belt.position.y=1.08;belt.rotation.x=Math.PI/2;player.add(belt);
    for(const s of[-1,1]){
      const shoulder=new THREE.Mesh(new THREE.SphereGeometry(.17,14,9),pbr(0x49305f,.35,.48,.26));shoulder.scale.set(1.4,.58,1.0);shoulder.position.set(.34*s,1.58,.03);shoulder.castShadow=true;player.add(shoulder);
      const ribbon=new THREE.Mesh(new THREE.PlaneGeometry(.18,.72),glow(s>0?0x6ceaff:0xb65cff,.18));ribbon.position.set(.24*s,.92,-.14);ribbon.rotation.x=-.16;ribbon.rotation.y=.18*s;player.add(ribbon);
    }
    const backHalo=new THREE.Mesh(new THREE.TorusGeometry(.54,.018,8,48),glow(0xa55cff,.24));backHalo.position.set(0,1.75,-.28);backHalo.rotation.x=Math.PI/2;player.add(backHalo);player.userData.q19BackHalo=backHalo;
  }catch(e){console.warn('[QUETOPIA] 019 player detail',e)}
}

const enemyMarks=new WeakMap();
function markEnemy(e){if(!e||!e.g||e.dead||enemyMarks.has(e))return;let rank=e.boss?3:(e.proRank||0);if(rank<=0)return;let c=e.boss?0xff5f8a:(rank>=2?0xffc95f:0x8f6cff);let r=e.boss?1.18:(rank>=2?.78:.62);let m=ring(e.g.position,r,r+.045,c,e.boss?.44:.25,.045);enemyMarks.set(e,m)}
function updateEnemyMarks(){if(typeof enemies==='undefined'||!enemies)return;for(const e of enemies){markEnemy(e);let m=enemyMarks.get(e);if(!m)continue;if(e.dead||!e.g||!e.g.parent){if(m.parent)m.parent.remove(m);enemyMarks.delete(e);continue}m.position.x=e.g.position.x;m.position.z=e.g.position.z;m.rotation.z+=.004*(e.boss?2:1);m.material.opacity=(e.boss?.32:.18)+.09*(.5+.5*Math.sin(qtime*(e.boss?5:3)+(e.g.position.x||0)))}}

try{
  const hitPrev=hitEnemy;
  hitEnemy=function(e,d){let p=e?.g?.position?.clone?.();let r=hitPrev.apply(this,arguments);if(p){sparks(p,d>150?0xffd66b:0x72eaff,d>150?16:8,d>150?4:2.2);if(d>150)pulse(p,0xffd66b,.42)}return r};
}catch(e){console.warn('[QUETOPIA] 019 hit wrap',e)}

function staffPos(){try{if(typeof staffTip!=='undefined'&&staffTip){let p=new THREE.Vector3();staffTip.getWorldPosition(p);return p}}catch(_){ }return typeof player!=='undefined'&&player?player.position.clone().add(new THREE.Vector3(0,1.35,0)):new THREE.Vector3()}
function castFlash(color){let p=staffPos();flashLight(p,color,9,.18);sparks(p,color,5,1.2);let r=ring(p,.08,.16,color,.75,p.y);r.rotation.x=0;addFx({kind:'cast',o:r,t:0,life:.22})}
try{
  const shotPrev=signalShot;signalShot=function(){let b=typeof fc==='number'?fc:999,r=shotPrev.apply(this,arguments);if(b<=.01&&typeof fc==='number'&&fc>b){castFlash(0xae68ff);document.querySelector('.hotbar .skill:nth-child(1)')?.classList.add('q19Pulse');setTimeout(()=>document.querySelector('.hotbar .skill:nth-child(1)')?.classList.remove('q19Pulse'),90)}return r};
  const prismPrev=prism;prism=function(){let b=typeof pc==='number'?pc:999,r=prismPrev.apply(this,arguments);if(b<=.01&&typeof pc==='number'&&pc>b){castFlash(0x68eaff);document.querySelector('.hotbar .skill:nth-child(2)')?.classList.add('q19Pulse');setTimeout(()=>document.querySelector('.hotbar .skill:nth-child(2)')?.classList.remove('q19Pulse'),100)}return r};
}catch(e){console.warn('[QUETOPIA] 019 cast wrap',e)}

const shotSeen=new WeakMap();
function projectileTrails(dt){if(typeof shots==='undefined'||!shots)return;trailTick-=dt;if(trailTick>0)return;trailTick=.045;let emitted=0;for(const s of shots){if(emitted>10||!s?.m||!s.m.parent)continue;let p=s.m.position,old=shotSeen.get(s);if(old&&p.distanceToSquared(old)>.02){let m=new THREE.Mesh(new THREE.SphereGeometry(.025,6,5),glow(s.enemy?0xff6578:0x75eaff,.35));m.position.copy(p);scene.add(m);addFx({kind:'trail',o:m,t:0,life:.24});emitted++}shotSeen.set(s,p.clone())}}

function frame(now){
  let dt=Math.min(.05,Math.max(.001,(now-last)/1000));last=now;qtime+=dt;
  decoratePlayer();updateEnemyMarks();projectileTrails(dt);
  if(motes){motes.rotation.y+=dt*.006;motes.position.y=Math.sin(qtime*.22)*.08}
  for(const d of decor){if(!d.g||!d.g.parent)continue;if(d.kind==='crystal')d.g.rotation.y+=dt*.035;if(d.kind==='rune')d.g.rotation.y+=dt*(.035+.012*Math.sin(qtime+d.phase));if(d.kind==='center')d.g.rotation.z+=dt*.02}
  if(playerDecorated&&player?.userData?.q19BackHalo){player.userData.q19BackHalo.rotation.z+=dt*.22;player.userData.q19BackHalo.material.opacity=.18+.11*(.5+.5*Math.sin(qtime*2.2))}
  for(let i=fx.length-1;i>=0;i--){let f=fx[i];f.t+=dt;let p=Math.min(1,f.t/f.life);if(f.kind==='spark'){f.v.y-=5.2*dt;f.o.position.addScaledVector(f.v,dt);f.o.rotation.x+=f.spin*dt;f.o.rotation.z-=f.spin*.7*dt;f.o.material.opacity=.9*(1-p)}else if(f.kind==='light'){f.o.intensity*=Math.pow(.03,dt/f.life)}else if(f.kind==='pulse'){let k=1+p*3.2;f.o.scale.set(k,k,k);f.o.material.opacity=.68*(1-p)}else if(f.kind==='cast'){let k=1+p*2.4;f.o.scale.set(k,k,k);f.o.material.opacity=.75*(1-p)}else if(f.kind==='trail'){f.o.scale.setScalar(1+p*1.8);f.o.material.opacity=.35*(1-p)}if(f.t>=f.life){if(f.o?.parent)f.o.parent.remove(f.o);fx.splice(i,1)}}
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame);
console.log('[QUETOPIA] '+TAG+' active');
})();