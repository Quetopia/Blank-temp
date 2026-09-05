(function(){
'use strict';
/* QUETOPIA SIGNAL 018 — kinetic polish + feedback
   Keeps the SIGNAL 017 systems intact while improving movement feel,
   cooldown readability, anchor reactions, and AOE presentation. */
const TAG='SIGNAL 018 · KINETIC GROVE';
if(typeof THREE==='undefined'){console.warn('[QUETOPIA] '+TAG+' waiting for Three.js');return}

const css=document.createElement('style');
css.textContent=`
#q18Status{position:fixed;left:50%;bottom:118px;transform:translateX(-50%);z-index:9;pointer-events:none;padding:6px 11px;border:1px solid #7e6743;background:linear-gradient(180deg,#0c0a12d9,#05050ad9);box-shadow:0 8px 24px #000a,inset 0 1px 0 #ffe7aa20;color:#d9c797;font:800 8px/1.2 system-ui;letter-spacing:.14em;white-space:nowrap;text-shadow:0 1px 3px #000;opacity:.9}
#q18Status b{color:#70eaff}.skill.q18Ready{box-shadow:inset 0 0 22px #000,0 0 0 1px #d6b66d,0 0 14px #6deaff30}.skill.q18Ready .icon{filter:saturate(1.16) brightness(1.07)}
#q18Flash{position:fixed;inset:0;z-index:6;pointer-events:none;background:radial-gradient(circle at center,#d8ffff55 0,#7b58ff24 23%,transparent 58%);opacity:0;transition:opacity .14s ease-out;mix-blend-mode:screen}
#q18Flash.on{opacity:1}
#q18AnchorToast{position:fixed;left:50%;top:132px;transform:translateX(-50%);z-index:10;pointer-events:none;color:#e8dcba;font:900 11px Georgia,serif;letter-spacing:.18em;text-shadow:0 2px 5px #000,0 0 18px #72eaff;opacity:0;transition:opacity .2s,transform .45s}
#q18AnchorToast.on{opacity:1;transform:translate(-50%,-8px)}
`;
document.head.appendChild(css);

const status=document.createElement('div');status.id='q18Status';status.innerHTML='<b>SIGNAL 018</b> · LMB MOVE · RMB SIGNAL · Q PRISM · E NOVA · R FRACTURE · SPACE PHASE';document.body.appendChild(status);
const flashEl=document.createElement('div');flashEl.id='q18Flash';document.body.appendChild(flashEl);
const toast=document.createElement('div');toast.id='q18AnchorToast';toast.textContent='SIGNAL ANCHOR STABILIZED';document.body.appendChild(toast);

const qfx=[];
let destMarker=null,destCore=null,lastT=performance.now(),prevPos=null,trailClock=0,toastTimer=0;
const activated=new WeakSet();

function basic(c,o=.8){return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending})}
function ring(pos,r0,r1,c,o=.8,y=.08){let m=new THREE.Mesh(new THREE.RingGeometry(r0,r1,64),basic(c,o));m.rotation.x=-Math.PI/2;m.position.copy(pos);m.position.y=y;scene.add(m);return m}
function pointBurst(pos,color,count=18){for(let i=0;i<count;i++){let m=new THREE.Mesh(new THREE.SphereGeometry(.025+Math.random()*.045,7,5),basic(i%3===0?0xffffff:color,.9));let a=Math.random()*Math.PI*2,s=.9+Math.random()*3.4;m.position.copy(pos).add(new THREE.Vector3(0,.18+Math.random()*.35,0));scene.add(m);qfx.push({m,t:0,life:.55+Math.random()*.5,kind:'particle',v:new THREE.Vector3(Math.cos(a)*s,1.4+Math.random()*3,Math.sin(a)*s)})}}
function lightPop(pos,color,intensity=18,life=.6){let l=new THREE.PointLight(color,intensity,10);l.position.copy(pos).add(new THREE.Vector3(0,1.2,0));scene.add(l);qfx.push({light:l,t:0,life,kind:'light'})}
function screenFlash(){flashEl.classList.add('on');setTimeout(()=>flashEl.classList.remove('on'),90)}
function announce(s){toast.textContent=s;toast.classList.remove('on');void toast.offsetWidth;toast.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('on'),1700)}

function anchorCelebration(pos){
 screenFlash();announce('SIGNAL ANCHOR STABILIZED');lightPop(pos,0x69eaff,28,.9);pointBurst(pos,0x9a63ff,34);
 for(let i=0;i<5;i++){let r=ring(pos,.35+i*.16,.43+i*.16,i%2?0x65eaff:0xbd5cff,.9-i*.1,.09+i*.01);qfx.push({m:r,t:-i*.055,life:1.45,kind:'shock'})}
 let beam=new THREE.Mesh(new THREE.CylinderGeometry(.06,.42,10,24,1,true),basic(0x6ceaff,.52));beam.position.copy(pos);beam.position.y=5;scene.add(beam);qfx.push({m:beam,t:0,life:1.4,kind:'beam'});
}
function resonanceCelebration(pos){
 lightPop(pos,0xc056ff,20,.45);pointBurst(pos,0x6ceaff,22);
 for(let i=0;i<4;i++){let r=ring(pos,.4+i*.12,.50+i*.12,i%2?0x6feaff:0xce5cff,.9-i*.12,.10+i*.012);qfx.push({m:r,t:-i*.045,life:.95,kind:'nova'})}
 let dome=new THREE.Mesh(new THREE.SphereGeometry(1.0,24,14,0,Math.PI*2,0,Math.PI/2),basic(0x784cff,.14));dome.position.copy(pos);dome.position.y=.05;scene.add(dome);qfx.push({m:dome,t:0,life:.65,kind:'dome'});
}
function fractureCelebration(pos){
 lightPop(pos,0x4c8fff,16,.7);pointBurst(pos,0xb75cff,16);
 let outer=ring(pos,3.35,3.52,0x6ceaff,.88,.085),inner=ring(pos,1.78,1.90,0xd25cff,.78,.095);qfx.push({m:outer,t:0,life:5.0,kind:'fieldRing',phase:0});qfx.push({m:inner,t:0,life:5.0,kind:'fieldRing',phase:1.7});
 for(let i=0;i<8;i++){let a=i/8*Math.PI*2,p=pos.clone().add(new THREE.Vector3(Math.cos(a)*2.65,0,Math.sin(a)*2.65));let spike=new THREE.Mesh(new THREE.ConeGeometry(.07,.75,6),basic(i%2?0x6feaff:0xa95cff,.66));spike.position.copy(p);spike.position.y=.38;scene.add(spike);qfx.push({m:spike,t:0,life:5.0,kind:'fieldSpike',phase:a})}
}

function ensureDestination(){if(destMarker||typeof scene==='undefined')return;destMarker=ring(new THREE.Vector3(),.28,.36,0x71eaff,.76,.07);destCore=ring(new THREE.Vector3(),.06,.11,0xe9ffff,.82,.075);destMarker.visible=destCore.visible=false}
function updateDestination(t){ensureDestination();if(!destMarker)return;let active=typeof mouseMoving!=='undefined'&&mouseMoving&&typeof moveTarget!=='undefined';destMarker.visible=destCore.visible=!!active;if(!active)return;destMarker.position.x=destCore.position.x=moveTarget.x;destMarker.position.z=destCore.position.z=moveTarget.z;let s=1+Math.sin(t*7)*.12;destMarker.scale.setScalar(s);destMarker.rotation.z+=.025;destCore.scale.setScalar(1.1+Math.sin(t*10)*.18)}
function trailStep(pos,dir){let back=pos.clone().addScaledVector(dir,-.38);let m=ring(back,.05,.13,0x5eeaff,.38,.045);m.scale.z=.55;qfx.push({m,t:0,life:.45,kind:'trail'});if(Math.random()<.34)pointBurst(back,0x7a5cff,3)}

function updateSkillReady(){let cards=document.querySelectorAll('.hotbar .skill');if(!cards.length)return;let cds=[typeof fc==='number'?fc:1,typeof pc==='number'?pc:1,typeof qc==='number'?qc:1,typeof ec==='number'?ec:1,typeof dc==='number'?dc:1];let mana=typeof manav==='number'?manav:999,need=[1,18,28,34,0];cards.forEach((c,i)=>c.classList.toggle('q18Ready',(cds[i]??1)<=.01&&mana>=need[i]))}
function anchorState(){if(typeof anchors==='undefined'||!anchors)return;for(const a of anchors){if(!a||!a.g)continue;if(a.on&&!activated.has(a)){activated.add(a);anchorCelebration(a.g.position.clone())}}
function nearbyAnchorHint(){if(typeof anchors==='undefined'||typeof player==='undefined'||!player)return false;let n=anchors.find(a=>a&&!a.on&&a.g&&a.g.position.distanceTo(player.position)<2.8);if(n){status.innerHTML='<b>ANCHOR IN RANGE</b> · MOVE CLOSER TO STABILIZE · RMB FIRE · E NOVA · R FRACTURE';return true}return false}

/* Wrap current post-SIGNAL-017 combat functions so all build math remains intact. */
try{
 const novaPrev=nova;nova=function(){let before=typeof qc==='number'?qc:999,p=player?.position?.clone();let r=novaPrev.apply(this,arguments);if(p&&before<=.01&&qc>before)resonanceCelebration(p);return r};
 const fracPrev=fracture;fracture=function(){let before=typeof ec==='number'?ec:999,p=(typeof aim!=='undefined'&&aim?.clone)?aim.clone():player?.position?.clone();let r=fracPrev.apply(this,arguments);if(p&&before<=.01&&ec>before)fractureCelebration(p);return r};
}catch(e){console.warn('[QUETOPIA] SIGNAL 018 combat wrap',e)}

function frame(now){
 let dt=Math.min(.05,Math.max(.001,(now-lastT)/1000));lastT=now;let t=now/1000;
 if(typeof player!=='undefined'&&player&&player.position){
   if(!prevPos)prevPos=player.position.clone();let v=player.position.clone().sub(prevPos);v.y=0;let speed=v.length()/dt;
   if(speed>.25){let d=v.clone().normalize();trailClock-=dt;if(trailClock<=0){trailClock=.075;trailStep(player.position.clone(),d)}
      if(player.userData?.halo)player.userData.halo.rotation.y+=dt*(.7+Math.min(1.6,speed*.08));
      if(player.userData?.headRig)player.userData.headRig.rotation.z=Math.sin(t*9)*.025*Math.min(1,speed/4);
   }else if(player.userData?.headRig){player.userData.headRig.rotation.z*=.88}
   prevPos.copy(player.position);
 }
 updateDestination(t);anchorState();updateSkillReady();if(!nearbyAnchorHint())status.innerHTML='<b>SIGNAL 018</b> · LMB MOVE · RMB SIGNAL · Q PRISM · E NOVA · R FRACTURE · SPACE PHASE';
 for(let i=qfx.length-1;i>=0;i--){let f=qfx[i];f.t+=dt;let p=Math.max(0,Math.min(1,f.t/f.life));if(f.kind==='particle'){f.v.y-=5.5*dt;f.m.position.addScaledVector(f.v,dt);f.m.material.opacity=Math.max(0,.9-p*.9);f.m.scale.setScalar(1+p*.6)}else if(f.kind==='light'){f.light.intensity*=Math.pow(.07,dt/f.life)}else if(f.kind==='shock'||f.kind==='nova'){if(f.t>=0){let k=1+p*(f.kind==='shock'?6.8:5.1);f.m.scale.set(k,k,k);f.m.material.opacity=Math.max(0,.9-p*.9)}}else if(f.kind==='beam'){f.m.material.opacity=Math.max(0,.52-p*.52);f.m.scale.x=f.m.scale.z=1+p*.55}else if(f.kind==='dome'){f.m.scale.setScalar(1+p*4.6);f.m.material.opacity=Math.max(0,.14-p*.14)}else if(f.kind==='fieldRing'){f.m.rotation.z+=dt*(f.phase?-.65:.7);f.m.material.opacity=.36+.35*(.5+.5*Math.sin(t*5+f.phase));let k=1+.025*Math.sin(t*4+f.phase);f.m.scale.setScalar(k)}else if(f.kind==='fieldSpike'){f.m.material.opacity=.32+.34*(.5+.5*Math.sin(t*6+f.phase));f.m.scale.y=.85+.25*(.5+.5*Math.sin(t*5+f.phase))}else if(f.kind==='trail'){f.m.material.opacity=Math.max(0,.38-p*.38);let k=1+p*1.8;f.m.scale.x=k;f.m.scale.y=k}
   if(f.t>=f.life){if(f.m&&f.m.parent)f.m.parent.remove(f.m);if(f.light&&f.light.parent)f.light.parent.remove(f.light);qfx.splice(i,1)}
 }
 requestAnimationFrame(frame)
}
requestAnimationFrame(frame);
console.log('[QUETOPIA] '+TAG+' active');
})();