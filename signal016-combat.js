(function(){
'use strict';
let ct=0,last=performance.now(),iframe=0,focus=0,streak=0,streakT=0;
const cfx=[];
const telegraphs=[];

const css=document.createElement('style');css.textContent=`
#combatReadout{position:fixed;left:50%;bottom:126px;transform:translateX(-50%);z-index:8;pointer-events:none;width:250px;text-align:center;font:800 8px system-ui;letter-spacing:.14em;color:#aaa0b3;text-shadow:0 2px 4px #000}.focusRail{height:3px;background:#09070e;border:1px solid #574361;margin-top:4px}.focusFill{height:100%;width:0;background:linear-gradient(90deg,#8d45ff,#52eaff,#ffd26b);box-shadow:0 0 10px #6beaff88;transition:width .12s}.combatFloat{position:fixed;z-index:9;pointer-events:none;font:900 12px Georgia,serif;letter-spacing:.08em;text-shadow:0 2px 4px #000,0 0 9px currentColor}.telegraphLabel{position:fixed;z-index:8;pointer-events:none;transform:translate(-50%,-100%);font:900 8px system-ui;letter-spacing:.13em;color:#ffcb70;text-shadow:0 2px 5px #000,0 0 8px #ff6644}.perfect{animation:qPerfect .35s ease-out}@keyframes qPerfect{0%{filter:brightness(2.2)}100%{filter:none}}`;
document.head.appendChild(css);
const rd=document.createElement('div');rd.id='combatReadout';rd.innerHTML='<span id="focusTxt">RESONANCE FOCUS · 0%</span><div class="focusRail"><div class="focusFill" id="focusFill"></div></div>';document.body.appendChild(rd);const ftxt=document.getElementById('focusTxt'),ffill=document.getElementById('focusFill');

function floatText(pos,text,color='#fff',size=12){let d=document.createElement('div');d.className='combatFloat';d.style.color=color;d.style.fontSize=size+'px';d.textContent=text;let p=proj(pos.clone().add(new THREE.Vector3(0,1.85,0)));d.style.left=p.x+'px';d.style.top=p.y+'px';document.body.appendChild(d);let born=performance.now();let id=requestAnimationFrame(function go(){let t=(performance.now()-born)/700;d.style.transform='translate(-50%,'+(-24*t)+'px) scale('+(1+.12*Math.sin(t*Math.PI))+')';d.style.opacity=Math.max(0,1-t);if(t<1)requestAnimationFrame(go);else d.remove()})}
function ring(pos,r,color,life=.85){let m=new THREE.Mesh(new THREE.RingGeometry(r*.92,r,56),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));m.rotation.x=-Math.PI/2;m.position.copy(pos);m.position.y=.06;scene.add(m);cfx.push({m,t:0,life,type:'ring'});return m}
function lineTelegraph(a,b,color=0xff785c,width=.16){let dir=b.clone().sub(a);dir.y=0;let len=dir.length();if(len<.1)return null;let m=new THREE.Mesh(new THREE.PlaneGeometry(width,len),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));m.rotation.x=-Math.PI/2;m.rotation.z=-Math.atan2(dir.x,dir.z);m.position.copy(a).lerp(b,.5);m.position.y=.055;scene.add(m);return m}
function hurtPlayer(n){if(iframe>0)return false;if(shieldv>0){let q=Math.min(shieldv,n);shieldv-=q;n-=q}if(n>0)hpv-=n;iframe=.16;try{flash(player.position,0xff355f,9)}catch(e){};return true}
function addFocus(n){focus=Math.min(100,focus+n);if(focus>=100){focus=0;manav=Math.min(150,manav+35);shieldv=Math.min(50,shieldv+15);try{say('PERFECT RESONANCE · MANA AND WARD RESTORED');flash(player.position,0x74eaff,25)}catch(e){};ring(player.position,1.1,0x74eaff,1.1)}ffill.style.width=focus+'%';ftxt.textContent='RESONANCE FOCUS · '+Math.round(focus)+'%'}

/* Critical strikes and micro-stagger. This wraps cleanly underneath the passive-tree layer. */
const previousHit=hitEnemy;hitEnemy=function(e,d){if(!e||e.dead)return;let crit=Math.random()<(.105+(focus/100)*.055);let dealt=crit?d*1.62:d;if(crit){floatText(e.g.position,'CRITICAL',e.proRank===2?'#ffd36d':'#7feaff',15);streak++;streakT=2.7;addFocus(9);if(!e.boss){e.speed*=.82;setTimeout(()=>{if(e&&!e.dead)e.speed/=.82},180)}}else addFocus(.9);previousHit(e,dealt)};
const previousKill=killEnemy;killEnemy=function(e){if(!e||e.dead)return;previousKill(e);addFocus(e.boss?25:e.proRank===2?14:5);if(streakT>0&&streak>=3)floatText(e.g.position,'RESONANCE CHAIN ×'+streak,'#f0c96e',13)};

/* Dash creates a brief evade window for the new telegraphed attacks. */
const previousDash=dash;dash=function(){let ready=dc<=0;previousDash();if(ready){iframe=.34;ring(player.position,.58,0x61eaff,.48);document.body.classList.add('perfect');setTimeout(()=>document.body.classList.remove('perfect'),340)}};

function warningLabel(t,name){if(t.label)return;let d=document.createElement('div');d.className='telegraphLabel';d.textContent=name;t.label=d;document.body.appendChild(d)}
function updateWarningLabel(t){if(!t.label||!t.enemy||t.enemy.dead)return;let p=proj(t.enemy.g.position.clone().add(new THREE.Vector3(0,2.45,0)));t.label.style.left=p.x+'px';t.label.style.top=p.y+'px'}
function removeTele(t){if(t.mesh)scene.remove(t.mesh);if(t.label)t.label.remove();t.dead=true}
function queueSlam(e){if(!e||e.dead)return;let t={enemy:e,type:'slam',time:0,dur:.82,rad:e.boss?3.2:e.proRank===2?2.25:1.65,pos:e.g.position.clone()};t.mesh=ring(t.pos,t.rad,e.boss?0xff315b:0xff8a4c,1.2);warningLabel(t,e.boss?'VOID IMPACT':'RUPTURE');telegraphs.push(t)}
function queueBeam(e){if(!e||e.dead)return;let from=e.g.position.clone(),to=player.position.clone();let t={enemy:e,type:'beam',time:0,dur:1.05,from,to};t.mesh=lineTelegraph(from,to,e.proRank===2?0xffca55:0x9b68ff,.19);warningLabel(t,'PRISM LANCE');telegraphs.push(t)}
function resolve(t){if(t.type==='slam'){let d=player.position.distanceTo(t.pos);if(d<t.rad){let amount=t.enemy&&t.enemy.boss?34:t.enemy&&t.enemy.proRank===2?22:14;if(hurtPlayer(amount))floatText(player.position,'-'+amount,'#ff7182',15);else{floatText(player.position,'PHASED','#73eaff',12);addFocus(7)}}ring(t.pos,t.rad,0xffe06b,.4)}else if(t.type==='beam'){let a=t.from,b=t.to,p=player.position.clone();let ab=b.clone().sub(a);ab.y=0;let ap=p.clone().sub(a);ap.y=0;let u=Math.max(0,Math.min(1,ap.dot(ab)/Math.max(.001,ab.lengthSq())));let close=a.clone().addScaledVector(ab,u);if(close.distanceTo(p)<.62){let amount=t.enemy&&t.enemy.proRank===2?26:18;if(hurtPlayer(amount))floatText(player.position,'-'+amount,'#ff7182',15);else{floatText(player.position,'PHASED','#73eaff',12);addFocus(8)}}for(let i=0;i<5;i++){let q=a.clone().lerp(b,i/4);ring(q,.22,0x9f68ff,.35)}}removeTele(t)}

function armEnemy(e,i){if(!e||e.dead||e.qCombat)return;e.qCombat=true;e.qAttack=1.1+Math.random()*2.3+(i%3)*.4}
enemies.forEach(armEnemy);const spawnBeforeCombat=spawnEnemy;spawnEnemy=function(isBoss=false){let e=spawnBeforeCombat(isBoss);armEnemy(e,enemies.length);return e};

function frame(){let now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(!isFinite(dt)||dt<=0)dt=.016;ct+=dt;iframe=Math.max(0,iframe-dt);if(streakT>0){streakT-=dt;if(streakT<=0)streak=0}
 if(running){for(let i=0;i<enemies.length;i++){let e=enemies[i];if(e.dead)continue;armEnemy(e,i);let dist=e.g.position.distanceTo(player.position);e.qAttack-=dt;if(e.qAttack<=0&&dist<(e.boss?8.5:6.2)){e.qAttack=(e.boss?2.4:3.4)+Math.random()*2.2;if(e.boss||e.proRank===2)queueSlam(e);else if(e.qType==='oracle'||e.qType==='serpent'||e.proRank===1)queueBeam(e)}}}
 for(let t of telegraphs){if(t.dead)continue;if(!t.enemy||t.enemy.dead){removeTele(t);continue}t.time+=dt;updateWarningLabel(t);if(t.mesh&&t.mesh.material)t.mesh.material.opacity=.24+.56*Math.min(1,t.time/t.dur);if(t.time>=t.dur)resolve(t)}for(let i=telegraphs.length-1;i>=0;i--)if(telegraphs[i].dead)telegraphs.splice(i,1);
 for(let f of cfx){f.t+=dt;if(f.m&&f.m.material){let k=1+f.t*1.8;f.m.scale.set(k,k,k);f.m.material.opacity=Math.max(0,.75-f.t/f.life*.75)}}for(let i=cfx.length-1;i>=0;i--){if(cfx[i].t>=cfx[i].life){if(cfx[i].m)scene.remove(cfx[i].m);cfx.splice(i,1)}}
}
const animateBeforeCombat=animate;animate=function(){frame();animateBeforeCombat()};
console.log('[QUETOPIA] SIGNAL 016 combat module active');
})();