(function(){
'use strict';
const WTAG='SIGNAL 016 WORLD';
let wt=0,last=performance.now(),familiar=null,familiarCD=.5,bossPhase=0;
const animCreatures=[],worldFx=[];

/* Visual language pulled from the Quetopia references: ornate iridescence, mushrooms, cats, serpents, gold + neon. */
function mat(c,e=.15,metal=.18,rough=.42){return new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:e,metalness:metal,roughness:rough})}
function glowMat(c,o=.75){return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide})}
function remember(g,type){g.userData.qType=type;animCreatures.push(g);return g}

function prismLynx(rank=0){
 let g=new THREE.Group();
 let body=new THREE.Mesh(new THREE.CapsuleGeometry(.30,.82,4,10),mat(rank===2?0x9b5c32:0x302542,.28,.26,.32));body.rotation.z=Math.PI/2;body.position.y=.72;g.add(body);
 let chest=new THREE.Mesh(new THREE.SphereGeometry(.30,16,12),mat(0x412b5f,.35,.2,.3));chest.position.set(.36,.79,0);chest.scale.set(.85,1.1,.85);g.add(chest);
 let head=new THREE.Mesh(new THREE.SphereGeometry(.27,18,13),mat(rank===2?0xd2a85a:0x43305f,.38,.25,.28));head.position.set(.68,1.02,0);head.scale.set(1,.88,.92);g.add(head);
 for(let s of [-1,1]){let ear=new THREE.Mesh(new THREE.ConeGeometry(.11,.28,5),mat(rank===2?0xffcf69:0x704c9b,.5));ear.position.set(.66,1.28,.15*s);ear.rotation.x=s*.12;g.add(ear);let eye=new THREE.Mesh(new THREE.SphereGeometry(.045,10,8),glowMat(s>0?0x55efff:0xff55dc,.95));eye.position.set(.905,1.05,.105*s);g.add(eye)}
 for(let sx of [-.33,.35])for(let sz of [-.2,.2]){let leg=new THREE.Mesh(new THREE.CylinderGeometry(.045,.035,.56,7),mat(0x251b34,.12));leg.position.set(sx,.39,sz);leg.rotation.z=sx<0?-.12:.12;g.add(leg)}
 let tail=new THREE.Group();tail.position.set(-.53,.78,0);g.add(tail);for(let i=0;i<5;i++){let seg=new THREE.Mesh(new THREE.SphereGeometry(.09-i*.009,9,7),mat(i%2?0x7349a6:0x35b9c6,.45));seg.position.set(-i*.15,.06*Math.sin(i),.08*Math.sin(i*.8));tail.add(seg)}
 let halo=new THREE.Mesh(new THREE.TorusGeometry(.38,.022,8,36),glowMat(0x6deeff,.58));halo.position.set(.68,1.03,0);halo.rotation.y=Math.PI/2;g.add(halo);
 g.userData.parts={tail,halo,body};return remember(g,'lynx')
}

function sporeOracle(rank=0){
 let g=new THREE.Group();
 let robe=new THREE.Mesh(new THREE.ConeGeometry(.38,.95,12),mat(rank===2?0x6c3f26:0x2a2037,.18,.16,.5));robe.position.y=.49;g.add(robe);
 let stem=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,.72,10),mat(0x9b8f83,.12,.05,.65));stem.position.y=1.05;g.add(stem);
 let cap=new THREE.Mesh(new THREE.SphereGeometry(.52,20,12,0,Math.PI*2,0,Math.PI/2),mat(rank===2?0xff6b38:0xc64286,.75,.1,.3));cap.position.y=1.42;cap.scale.y=.58;g.add(cap);
 for(let i=0;i<9;i++){let dot=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.025,7,6),glowMat(i%3===0?0x71efff:0xffdb77,.9));let a=i/9*Math.PI*2;dot.position.set(Math.cos(a)*(.21+Math.random()*.2),1.54+Math.random()*.12,Math.sin(a)*(.21+Math.random()*.2));g.add(dot)}
 let eye=new THREE.Mesh(new THREE.TorusGeometry(.12,.035,8,24),glowMat(0x73eaff,.82));eye.position.set(.03,1.15,.17);eye.rotation.x=Math.PI/2;g.add(eye);
 for(let s of [-1,1]){let hand=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),glowMat(s>0?0xa65cff:0x4cecff,.7));hand.position.set(.42*s,.92,0);g.add(hand)}
 g.userData.parts={cap,eye};return remember(g,'oracle')
}

function veilSerpent(rank=0){
 let g=new THREE.Group(),chain=new THREE.Group();g.add(chain);let segs=[];
 for(let i=0;i<9;i++){let r=.20-i*.012,s=new THREE.Mesh(new THREE.SphereGeometry(r,12,9),mat(i%2?(rank===2?0xf0aa43:0x5f3ea0):0x256e83,.48,.22,.28));s.position.set(-i*.23,.72+i*.045,Math.sin(i*.65)*.12);chain.add(s);segs.push(s)}
 let head=new THREE.Mesh(new THREE.ConeGeometry(.31,.52,5),mat(rank===2?0xffc45b:0x7d55c7,.75,.24,.22));head.rotation.z=-Math.PI/2;head.position.set(.28,.82,0);g.add(head);
 for(let s of [-1,1]){let horn=new THREE.Mesh(new THREE.ConeGeometry(.055,.35,6),mat(0x55eaff,.8));horn.position.set(.08,1.04,.17*s);horn.rotation.z=-.45;horn.rotation.x=.28*s;g.add(horn);let eye=new THREE.Mesh(new THREE.SphereGeometry(.04,8,6),glowMat(s>0?0xff63db:0x65efff,.95));eye.position.set(.47,.86,.11*s);g.add(eye)}
 let crown=new THREE.Mesh(new THREE.TorusGeometry(.34,.024,8,34),glowMat(0xd057ff,.62));crown.position.set(.13,1.04,0);crown.rotation.y=Math.PI/2;g.add(crown);
 g.userData.parts={chain,segs,crown};return remember(g,'serpent')
}

function modelFor(type,rank){if(type==='lynx')return prismLynx(rank);if(type==='oracle')return sporeOracle(rank);if(type==='serpent')return veilSerpent(rank);return null}
function creatureType(e,i){if(e.boss)return 'mantis';let seed=Math.abs(Math.sin((e.g.position.x*7.31+e.g.position.z*13.77+i*2.91)));if(seed>.78)return 'serpent';if(seed>.53)return 'lynx';if(seed>.31)return 'oracle';return 'mantis'}
function convertEnemy(e,i=0){if(!e||e.dead||e.boss||e.qCreature)return;e.qCreature=true;let type=creatureType(e,i);e.qType=type;if(type==='mantis'){e.proName=e.proRank===2?'CROWNED VOID MANTIS':e.proRank===1?'PHASE MANTIS':'VEIL MANTIS';return}let ng=modelFor(type,e.proRank||0);if(!ng)return;let old=e.g,p=old.position.clone(),rot=old.rotation.y,sc=old.scale.clone();scene.remove(old);ng.position.copy(p);ng.rotation.y=rot;ng.scale.copy(sc);scene.add(ng);e.g=ng;if(type==='lynx'){e.proName=e.proRank===2?'CROWNED PRISM LYNX':'PRISM LYNX';e.speed*=1.12}else if(type==='oracle'){e.proName=e.proRank===2?'MYCELIAL HIEROPHANT':'SPORE ORACLE';e.speed*=.82;e.hp*=1.18;e.max=e.hp}else if(type==='serpent'){e.proName=e.proRank===2?'IRIDESCENT WYRM':'VEIL SERPENT';e.speed*=1.04}}
enemies.forEach(convertEnemy);
const previousSpawn=spawnEnemy;spawnEnemy=function(isBoss=false){let e=previousSpawn(isBoss);if(e&&!isBoss)convertEnemy(e,enemies.length);return e};

/* ---------- psychedelic grove set dressing ---------- */
function giantMush(x,z,s,c1,c2){let g=new THREE.Group();let st=new THREE.Mesh(new THREE.CylinderGeometry(.13*s,.24*s,1.6*s,10),mat(0x8b7b8d,.12,.08,.7));st.position.y=.8*s;g.add(st);let cap=new THREE.Mesh(new THREE.SphereGeometry(.65*s,20,12,0,Math.PI*2,0,Math.PI/2),mat(c1,.55,.08,.32));cap.position.y=1.58*s;cap.scale.y=.55;g.add(cap);let under=new THREE.Mesh(new THREE.TorusGeometry(.39*s,.06*s,8,38),glowMat(c2,.46));under.rotation.x=Math.PI/2;under.position.y=1.58*s;g.add(under);for(let i=0;i<6;i++){let sp=new THREE.Mesh(new THREE.SphereGeometry(.035*s,7,5),glowMat(i%2?c2:0xffffff,.65));let a=i/6*Math.PI*2;sp.position.set(Math.cos(a)*.34*s,1.72*s,Math.sin(a)*.34*s);g.add(sp)}g.position.set(x,0,z);scene.add(g);return g}
const mushData=[[-11,9,1.2,0xb83a89,0x62eaff],[12,8,.9,0x6a42b5,0xff62d0],[-12,-10,1.0,0xd44a55,0x77eaff],[11,-11,1.15,0x7840aa,0x63efff],[5,12,.65,0xe15d38,0xffd568],[-4,-12,.72,0xc83782,0x69eaff]];mushData.forEach(v=>giantMush(...v));

function sigilTotem(x,z,s=1){let g=new THREE.Group();let pillar=new THREE.Mesh(new THREE.CylinderGeometry(.19*s,.28*s,2.5*s,8),mat(0x2a2038,.25,.5,.35));pillar.position.y=1.25*s;g.add(pillar);for(let i=0;i<3;i++){let tor=new THREE.Mesh(new THREE.TorusGeometry((.38+i*.16)*s,.026*s,8,40),glowMat(i===1?0x5feaff:0xd65cff,.46));tor.position.y=(.7+i*.64)*s;tor.rotation.x=Math.PI/2;tor.rotation.z=i*.45;g.add(tor)}let eye=new THREE.Mesh(new THREE.OctahedronGeometry(.15*s,1),mat(0x6ff1ff,2.2,.22,.12));eye.position.y=2.6*s;g.add(eye);g.position.set(x,0,z);scene.add(g);return g}
[[-13,1,.8],[13,-1,.8],[-4,13,.72],[5,-13,.75]].forEach(v=>sigilTotem(...v));

/* flowing neon mycelium veins */
function vein(points,color){let curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],.025,p[1])));let tube=new THREE.Mesh(new THREE.TubeGeometry(curve,40,.026,5,false),glowMat(color,.28));scene.add(tube);worldFx.push({kind:'vein',m:tube,phase:Math.random()*6.28})}
vein([[-13,-4],[-8,-1],[-4,-2],[0,1],[4,0],[8,3],[13,2]],0x4feaff);vein([[-11,6],[-7,3],[-3,5],[1,3],[5,6],[10,5]],0xc052ff);vein([[-9,-10],[-4,-7],[0,-8],[5,-6],[10,-9]],0xff4fa8);

/* floating ornamental arches around the playable island */
for(let i=0;i<4;i++){let a=i/4*Math.PI*2,x=Math.cos(a)*15,z=Math.sin(a)*15;let arc=new THREE.Mesh(new THREE.TorusGeometry(1.6,.07,8,50,Math.PI),mat(i%2?0x5d3e91:0x276875,.5,.4,.28));arc.position.set(x,1.8,z);arc.rotation.z=Math.PI/2;arc.rotation.y=-a;scene.add(arc)}

/* ---------- spectral cat familiar ---------- */
function makeFamiliar(){let g=prismLynx(1);g.scale.setScalar(.52);g.userData.qType='familiar';scene.add(g);return g}
familiar=makeFamiliar();
function familiarShot(target){if(!target||target.dead)return;let dir=target.g.position.clone().sub(familiar.position);dir.y=0;if(dir.lengthSq()<.01)return;dir.normalize();let m=new THREE.Mesh(new THREE.SphereGeometry(.075,10,8),glowMat(0x62eaff,.95));m.position.copy(familiar.position).add(new THREE.Vector3(0,.65,0));scene.add(m);m.add(new THREE.PointLight(0x5eeaff,3.5,3));shots.push({m,v:dir.multiplyScalar(10.5),damage:18,life:1.4,enemy:false})}

/* ---------- boss presentation and phases ---------- */
function bossPulse(color=0xff4f89){if(!boss||boss.dead)return;for(let i=0;i<3;i++){let r=new THREE.Mesh(new THREE.RingGeometry(.7+i*.28,.77+i*.28,48),glowMat(i===1?0x77eaff:color,.62-i*.12));r.rotation.x=-Math.PI/2;r.position.copy(boss.g.position);r.position.y=.08;scene.add(r);worldFx.push({kind:'pulse',m:r,t:-i*.07,life:1.05})}flash(boss.g.position,color,22)}
function phaseCheck(){if(!boss||boss.dead)return;let p=boss.hp/boss.max;if(bossPhase===0&&p<.67){bossPhase=1;boss.speed*=1.16;bossPulse(0xff6b9b);say('CURATOR PHASE II · THE GROVE BENDS');for(let i=0;i<2;i++)spawnEnemy(false)}else if(bossPhase===1&&p<.34){bossPhase=2;boss.speed*=1.2;boss.cd=Math.min(boss.cd,.5);bossPulse(0xffd45f);say('CURATOR PHASE III · PRISMATIC FURY');for(let i=0;i<3;i++)spawnEnemy(false)}}

function updateCreatureAnim(dt){for(let g of animCreatures){if(!g.parent||!g.userData.parts)continue;let p=g.userData.parts;if(g.userData.qType==='lynx'){if(p.tail)p.tail.rotation.y=Math.sin(wt*4+g.position.x)*.35;if(p.halo)p.halo.rotation.z+=dt*.8;if(p.body)p.body.position.y=.72+Math.sin(wt*5+g.position.z)*.025}else if(g.userData.qType==='oracle'){if(p.cap)p.cap.rotation.y+=dt*.35;if(p.eye)p.eye.rotation.z+=dt*.9;g.position.y=.02+Math.sin(wt*2.4+g.position.x)*.04}else if(g.userData.qType==='serpent'){if(p.crown)p.crown.rotation.x+=dt*.55;if(p.segs)for(let i=0;i<p.segs.length;i++){p.segs[i].position.z=Math.sin(wt*3-i*.58)*(.08+i*.008)}g.position.y=.06+Math.sin(wt*2.8+g.position.z)*.08}}}

function worldFrame(){let now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(!isFinite(dt)||dt<=0)dt=.016;wt+=dt;updateCreatureAnim(dt);for(let f of worldFx){if(f.kind==='vein')f.m.material.opacity=.20+.10*(.5+.5*Math.sin(wt*2+f.phase));if(f.kind==='pulse'){f.t=(f.t||0)+dt;if(f.t>=0){let k=1+f.t*3.3;f.m.scale.set(k,k,k);f.m.material.opacity=Math.max(0,.7-f.t*.68)}}}for(let i=worldFx.length-1;i>=0;i--){let f=worldFx[i];if(f.kind==='pulse'&&f.t>f.life){scene.remove(f.m);worldFx.splice(i,1)}}
 if(familiar&&player){let ang=wt*.55;let desired=player.position.clone().add(new THREE.Vector3(Math.cos(ang)*1.35,.02,Math.sin(ang)*1.35));familiar.position.lerp(desired,.08);familiar.rotation.y=Math.atan2(player.position.x-familiar.position.x,player.position.z-familiar.position.z);familiarCD-=dt;if(running&&familiarCD<=0){familiarCD=.85;let near=null,nd=8;for(let e of enemies){if(e.dead)continue;let d=e.g.position.distanceTo(familiar.position);if(d<nd){nd=d;near=e}}if(near)familiarShot(near)}}
 phaseCheck();
}
const priorAnimate=animate;animate=function(){worldFrame();priorAnimate()};

/* Add a lore line without crowding the combat HUD. */
let q=document.querySelector('.quest');if(q){let p=document.createElement('p');p.className='dim';p.style.marginTop='10px';p.innerHTML='◈ Biome: <span style="color:#73eaff">Iridescent Mycelium</span><br>◈ Familiar: Prism Lynx';q.appendChild(p)}
console.log('[QUETOPIA] '+WTAG+' module active');
})();