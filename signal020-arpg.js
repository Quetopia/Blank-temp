(function(){
'use strict';
/* QUETOPIA SIGNAL 020 — DRUID / PUNKIN / DMT MACHINE vertical-slice pass */
const TAG='SIGNAL 020 · DRUID ASCENDANT';
if(typeof THREE==='undefined'||typeof scene==='undefined'||typeof player==='undefined'){console.warn('[QUETOPIA] '+TAG+' host unavailable');return}

/* ---------- presentation ---------- */
const css=document.createElement('style');
css.textContent=`
#q19Status,#q19Mark{display:none!important}
#q20Status{position:fixed;left:50%;bottom:122px;transform:translateX(-50%);z-index:14;pointer-events:none;padding:7px 13px;border:1px solid #aa8b50;background:linear-gradient(180deg,#120d16ed,#060508f5);box-shadow:0 10px 30px #000d,inset 0 1px 0 #ffe8b42c;color:#d8c69e;font:800 8px/1.2 system-ui;letter-spacing:.15em;white-space:nowrap;text-shadow:0 2px 4px #000;backdrop-filter:blur(9px)}
#q20Status b{color:#71eaff}.hotbar{padding:11px 14px!important;gap:7px!important;background:linear-gradient(180deg,#0d0911ef,#040406f5)!important;border-color:#b89553!important;border-radius:4px!important;box-shadow:0 18px 52px #000e,inset 0 1px 0 #ffdf9b30!important}
.hotbar:before{content:'LMB MOVE  ·  1–4 CAST  ·  SPACE PHASE STEP'!important;color:#dbc38b!important;top:-26px!important}
.hotbar .skill{border-color:#907445!important;background:#0a080d!important;box-shadow:inset 0 0 24px #000,0 0 0 1px #1c1511!important}
.hotbar .key{font-size:12px!important;color:#f2dfaa!important;bottom:3px!important;letter-spacing:.06em}
.hotbar .skill:nth-child(5){border-color:#5fa6b2!important}
#q20Mark{position:fixed;left:18px;bottom:18px;z-index:8;pointer-events:none;font:800 7px system-ui;letter-spacing:.19em;color:#8d8193;text-shadow:0 2px 5px #000}#q20Mark b{color:#dfc477}
#q20PhaseLabel{position:fixed;left:50%;top:64%;transform:translate(-50%,-50%);z-index:13;pointer-events:none;opacity:0;font:900 12px Georgia,serif;letter-spacing:.23em;color:#9ef4ff;text-shadow:0 0 18px #61eaff,0 2px 4px #000;transition:opacity .15s}
#q20PhaseLabel.on{opacity:1}
.quest{background:linear-gradient(160deg,#09080de8,#050507f2)!important;border-color:#9f814c!important;box-shadow:0 18px 55px #000e,inset 0 1px 0 #ffe5ab1d!important}
.bossbar{height:20px!important;border-color:#a78a52!important;box-shadow:0 0 0 2px #0c090a,0 0 24px #bd245255!important}
.orb{box-shadow:0 0 0 2px #b08e4e,inset 0 0 34px #000,0 0 36px #000!important}
`;
document.head.appendChild(css);
const status=document.createElement('div');status.id='q20Status';status.innerHTML='<b>SIGNAL 020</b> · LMB MOVE · 1 SIGNAL · 2 PRISM · 3 RESONANCE · 4 FRACTURE · SPACE PHASE';document.body.appendChild(status);
const mark=document.createElement('div');mark.id='q20Mark';mark.innerHTML='<b>SIGNAL 020</b> · DRUID + PUNKIN · DMT MACHINE ECOSYSTEM';document.body.appendChild(mark);
const phaseLabel=document.createElement('div');phaseLabel.id='q20PhaseLabel';phaseLabel.textContent='PHASE STEP';document.body.appendChild(phaseLabel);
document.title='QUETOPIA — SIGNAL 020';
const zoneSub=document.querySelector('.miniwrap .sub');if(zoneSub)zoneSub.textContent='SIGNAL 020';
const introSub=document.querySelector('#intro .sub');if(introSub)introSub.textContent=introSub.textContent.replace(/SIGNAL\s+\d+/,'SIGNAL 020');
const tip=document.querySelector('#intro .tip:last-child');if(tip)tip.textContent='LMB move · 1 Signal Shot · 2 Prism Lance · 3 Resonance Nova · 4 Fracture Field · SPACE Phase Step';
const keysUI=document.querySelectorAll('.hotbar .key');['1','2','3','4','SPACE'].forEach((v,i)=>{if(keysUI[i])keysUI[i].textContent=v});

/* ---------- shared materials ---------- */
const M={
 purple:new THREE.MeshStandardMaterial({color:0x3a164f,emissive:0x21082d,emissiveIntensity:.55,metalness:.14,roughness:.58}),
 purple2:new THREE.MeshStandardMaterial({color:0x6a297f,emissive:0x351042,emissiveIntensity:.42,metalness:.2,roughness:.46}),
 green:new THREE.MeshStandardMaterial({color:0x173e28,emissive:0x0c2317,emissiveIntensity:.28,metalness:.12,roughness:.7}),
 green2:new THREE.MeshStandardMaterial({color:0x285d38,emissive:0x0c2818,emissiveIntensity:.22,metalness:.14,roughness:.62}),
 gold:new THREE.MeshStandardMaterial({color:0x9b793c,emissive:0x2a1806,emissiveIntensity:.24,metalness:.78,roughness:.3}),
 leather:new THREE.MeshStandardMaterial({color:0x4d2f1b,emissive:0x100805,emissiveIntensity:.08,metalness:.05,roughness:.82}),
 skin:new THREE.MeshStandardMaterial({color:0xb88763,emissive:0x170c07,emissiveIntensity:.06,metalness:0,roughness:.78}),
 hair:new THREE.MeshStandardMaterial({color:0x77736d,emissive:0x080808,emissiveIntensity:.05,metalness:.04,roughness:.9}),
 hairHi:new THREE.MeshStandardMaterial({color:0xb5b0a7,emissive:0x0d0d0d,emissiveIntensity:.04,metalness:.02,roughness:.88}),
 wood:new THREE.MeshStandardMaterial({color:0x5a391d,emissive:0x120905,emissiveIntensity:.08,metalness:.02,roughness:.95}),
 orange:new THREE.MeshStandardMaterial({color:0xb85c20,emissive:0x1b0802,emissiveIntensity:.08,metalness:0,roughness:.84}),
 orangeHi:new THREE.MeshStandardMaterial({color:0xe29550,emissive:0x1c0b03,emissiveIntensity:.07,metalness:0,roughness:.78}),
 cream:new THREE.MeshStandardMaterial({color:0xe0c6a0,emissive:0x100b07,emissiveIntensity:.03,metalness:0,roughness:.9}),
 blackMetal:new THREE.MeshStandardMaterial({color:0x17191a,emissive:0x080309,emissiveIntensity:.24,metalness:.82,roughness:.28}),
 bronze:new THREE.MeshStandardMaterial({color:0x4b4b38,emissive:0x120a06,emissiveIntensity:.2,metalness:.88,roughness:.3}),
 armorGreen:new THREE.MeshStandardMaterial({color:0x263529,emissive:0x11170f,emissiveIntensity:.2,metalness:.82,roughness:.26}),
 stone:new THREE.MeshStandardMaterial({color:0x242128,emissive:0x08070a,emissiveIntensity:.04,metalness:.08,roughness:.96})
};
function glow(c,o=.82){return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending})}
function mesh(g,m,x=0,y=0,z=0){let q=new THREE.Mesh(g,m);q.position.set(x,y,z);q.castShadow=true;q.receiveShadow=true;return q}
function cyl(a,b,h,mat,x,y,z,rx=0,ry=0,rz=0,seg=10){let q=mesh(new THREE.CylinderGeometry(a,b,h,seg),mat,x,y,z);q.rotation.set(rx,ry,rz);return q}
function tor(r,t,mat,x,y,z,rx=0,ry=0,rz=0,seg=36){let q=mesh(new THREE.TorusGeometry(r,t,8,seg),mat,x,y,z);q.rotation.set(rx,ry,rz);return q}
function orb(r,mat,x,y,z,seg=16){return mesh(new THREE.SphereGeometry(r,seg,Math.max(8,Math.round(seg*.7))),mat,x,y,z)}
function cone(r,h,mat,x,y,z,rotZ=0,seg=10){let q=mesh(new THREE.ConeGeometry(r,h,seg),mat,x,y,z);q.rotation.z=rotZ;return q}

/* ---------- Druid hero ---------- */
let heroRig=null,heroParts=null,phaseVisualT=0,walkClock=0,lastHeroPos=player.position.clone();
function tinyMush(parent,x,y,z,s=.1,c=0xa55cff){let stem=cyl(.025*s/.1,.035*s/.1,.18*s/.1,M.cream,x,y,z,0,0,0,7);stem.scale.setScalar(.1);parent.add(stem);let cap=orb(.09,M.purple2,x,y+.08,z,10);cap.scale.set(1.1,.45,1.1);parent.add(cap)}
function buildDruid(){
 const g=new THREE.Group();g.name='Q20_DRUID';
 // Boots and under-robe
 for(const s of[-1,1]){let boot=mesh(new THREE.BoxGeometry(.24,.22,.45),M.leather,.18*s,.13,.03);boot.rotation.y=.05*s;g.add(boot);let shin=cyl(.12,.14,.56,M.green,.18*s,.46,0,0,0,.02*s,9);g.add(shin)}
 let skirt=mesh(new THREE.ConeGeometry(.67,1.55,20,1,true),M.purple,0,.86,0);skirt.scale.z=.9;g.add(skirt);
 let under=mesh(new THREE.ConeGeometry(.53,1.34,18,1,true),M.green,0,.91,.025);under.scale.z=.92;under.rotation.y=.16;g.add(under);
 // robe panels
 for(let i=0;i<8;i++){let a=i/8*Math.PI*2;let mat=i%2?M.green2:M.purple2;let panel=mesh(new THREE.BoxGeometry(.13,1.18,.035),mat,Math.sin(a)*.47,.82,Math.cos(a)*.43);panel.rotation.y=a;panel.rotation.z=Math.sin(a)*.09;g.add(panel)}
 // gold hem and belt
 g.add(tor(.58,.035,M.gold,0,.27,0,Math.PI/2));g.add(tor(.43,.045,M.gold,0,1.17,0,Math.PI/2));
 let torso=cyl(.31,.4,.92,M.green,0,1.55,0,0,0,0,14);g.add(torso);
 let vest=mesh(new THREE.BoxGeometry(.52,.72,.12),M.purple2,0,1.56,.25);vest.rotation.x=-.03;g.add(vest);
 // shoulders
 for(const s of[-1,1]){let shoulder=orb(.23,M.purple2,.39*s,1.78,.02,16);shoulder.scale.set(1.25,.62,1);g.add(shoulder);let trim=tor(.19,.025,M.gold,.39*s,1.78,.02,Math.PI/2,0,0,28);trim.scale.set(1.18,.62,1);g.add(trim)}
 // neck + head
 let neck=cyl(.13,.15,.26,M.skin,0,1.96,0);g.add(neck);let head=orb(.28,M.skin,0,2.18,.045,20);head.scale.set(.9,1.08,.92);g.add(head);
 // nose + brow + eyes (forward = +Z)
 let nose=cone(.065,.19,M.skin,0,2.18,.31,Math.PI/2,10);nose.rotation.x=Math.PI/2;g.add(nose);
 for(const s of[-1,1]){let eye=orb(.035,glow(0xd6c690,.88),.09*s,2.24,.294,10);g.add(eye);let brow=mesh(new THREE.BoxGeometry(.12,.025,.035),M.hair,.09*s,2.32,.28);brow.rotation.z=-.12*s;g.add(brow)}
 // long beard: layered cones/capsules
 let beardRoot=new THREE.Group();beardRoot.position.set(0,2.05,.22);g.add(beardRoot);
 for(let i=0;i<9;i++){let s=(i-4)/4;let strand=cone(.08-(Math.abs(s)*.018),.78-(Math.abs(s)*.16),i%3===0?M.hairHi:M.hair,s*.052,-.36-Math.abs(s)*.04,.05+.03*Math.cos(i),0,8);strand.rotation.x=.07;beardRoot.add(strand)}
 let moust=new THREE.Group();moust.position.set(0,2.12,.31);g.add(moust);for(const s of[-1,1]){let m=mesh(new THREE.CapsuleGeometry(.035,.20,4,7),M.hair,.07*s,0,0);m.rotation.z=s*.72;m.rotation.x=Math.PI/2;moust.add(m)}
 // long swept hair around head
 let hairBack=mesh(new THREE.SphereGeometry(.33,18,12),M.hair,0,2.26,-.08);hairBack.scale.set(1.0,1.12,.55);g.add(hairBack);
 for(let i=0;i<10;i++){let a=(i/9-.5)*1.65;let strand=mesh(new THREE.CapsuleGeometry(.035,.60+Math.random()*.18,4,7),i%3?M.hair:M.hairHi,Math.sin(a)*.29,2.0,-.10-Math.abs(Math.sin(a))*.06);strand.rotation.z=-a*.55;strand.rotation.x=.13;g.add(strand)}
 // layered cloak / cape
 let capeL=mesh(new THREE.PlaneGeometry(.78,1.62),M.purple2,-.29,1.23,-.23);capeL.rotation.x=-.09;capeL.rotation.y=.20;capeL.rotation.z=-.12;g.add(capeL);
 let capeR=mesh(new THREE.PlaneGeometry(.78,1.62),M.green2,.29,1.23,-.24);capeR.rotation.x=-.09;capeR.rotation.y=-.18;capeR.rotation.z=.12;g.add(capeR);
 // arms and hands; staff side
 let armL=cyl(.09,.11,.72,M.purple2,-.43,1.45,.14,0,0,-.30,9);g.add(armL);let handL=orb(.095,M.skin,-.53,1.13,.22,12);g.add(handL);
 let armR=cyl(.09,.11,.76,M.green2,.43,1.46,.13,0,0,.28,9);g.add(armR);let handR=orb(.10,M.skin,.54,1.15,.21,12);g.add(handR);
 // gnarled staff from a curved tube
 const pts=[new THREE.Vector3(.56,.35,.20),new THREE.Vector3(.54,.82,.21),new THREE.Vector3(.56,1.30,.25),new THREE.Vector3(.53,1.78,.31),new THREE.Vector3(.62,2.24,.43),new THREE.Vector3(.54,2.58,.51),new THREE.Vector3(.68,2.80,.47)];
 const curve=new THREE.CatmullRomCurve3(pts);let staff=mesh(new THREE.TubeGeometry(curve,36,.055,9,false),M.wood);staff.castShadow=true;g.add(staff);
 // staff ridges
 for(let i=0;i<6;i++){let p=curve.getPoint(i/5);let knot=orb(.075,M.wood,p.x,p.y,p.z,10);knot.scale.set(1.2,.65,1);g.add(knot)}
 let gem=mesh(new THREE.OctahedronGeometry(.13,1),new THREE.MeshStandardMaterial({color:0x8d58ff,emissive:0x7f33ff,emissiveIntensity:2.6,metalness:.25,roughness:.18}),.68,2.82,.47);g.add(gem);gem.add(new THREE.PointLight(0xa25cff,4.5,4));
 // mushroom details on cloak/staff
 for(const p of [[-.30,1.63,.29],[.24,1.46,.31],[-.18,1.18,.34],[.32,.91,.30],[-.27,.67,.29]]){let st=cyl(.018,.026,.13,M.cream,p[0],p[1],p[2],0,0,0,7);g.add(st);let cp=orb(.065,M.purple2,p[0],p[1]+.065,p[2],9);cp.scale.y=.45;g.add(cp)}
 for(const y of[1.55,2.15,2.55]){let cp=orb(.055,M.purple2,.59,y,.35+(y-1.5)*.09,9);cp.scale.y=.48;g.add(cp)}
 // jewelry
 let med=mesh(new THREE.OctahedronGeometry(.10,1),new THREE.MeshStandardMaterial({color:0x6f42a6,emissive:0x36185a,emissiveIntensity:.7,metalness:.5,roughness:.2}),0,1.53,.33);g.add(med);g.add(tor(.13,.018,M.gold,0,1.53,.32,0,0,0,28));
 g.userData.q20={head,beardRoot,capeL,capeR,staff,gem};
 try{staffTip=gem}catch(_){ }
 return g;
}
function installDruid(){
 if(heroRig)return;
 // hide the original primitive receiver but keep later visual helpers untouched
 for(const c of [...player.children]){if(c.userData&&c.userData.q20Keep)continue;c.visible=false}
 heroRig=buildDruid();heroRig.userData.q20Keep=true;player.add(heroRig);heroParts=heroRig.userData.q20;
}

/* ---------- Punkin companion ---------- */
let punkin=null,punkinTail=[];
function buildPunkin(){
 const g=new THREE.Group();g.name='PUNKIN';
 let body=mesh(new THREE.CapsuleGeometry(.30,.72,5,12),M.orange,0,.55,0);body.rotation.z=Math.PI/2;body.scale.set(1.0,.9,1.08);g.add(body);
 let chest=orb(.29,M.orangeHi,.35,.60,.02,18);chest.scale.set(.92,1.08,.95);g.add(chest);
 let head=orb(.30,M.orangeHi,.63,.83,.01,20);head.scale.set(1,.92,.96);g.add(head);
 // muzzle
 for(const s of[-1,1])g.add(orb(.10,M.cream,.84,.76,.09*s,12));let nose=orb(.045,new THREE.MeshStandardMaterial({color:0x8d4f3b,roughness:.7}),.93,.79,0,10);g.add(nose);
 for(const s of[-1,1]){let ear=cone(.12,.30,M.orange,.60,1.11,.16*s,0,7);ear.rotation.x=s*.09;g.add(ear);let eye=orb(.048,glow(0xc9dc78,.95),.88,.88,.105*s,10);g.add(eye)}
 // legs/paws
 for(const x of[.18,.55])for(const z of[-.20,.20]){let leg=cyl(.065,.075,.38,M.orangeHi,x,.25,z,0,0,0,8);g.add(leg);let paw=orb(.085,M.cream,x,.08,z,10);paw.scale.set(1.1,.6,1.2);g.add(paw)}
 // tabby stripes
 for(let i=0;i<5;i++){let stripe=tor(.23-i*.012,.012,new THREE.MeshBasicMaterial({color:0x61331b,transparent:true,opacity:.55}),-.10+i*.11,.61,0,Math.PI/2);stripe.scale.z=.72;g.add(stripe)}
 // green ranger cloak
 let cloak=mesh(new THREE.ConeGeometry(.47,.82,18,1,true),M.green,-.08,.62,0);cloak.rotation.z=-Math.PI/2;cloak.scale.set(1,.75,1);g.add(cloak);
 let hood=tor(.33,.075,M.green,.58,.88,0,0,Math.PI/2,0,28);hood.scale.set(1,.86,1);g.add(hood);
 // leather harness + medallion + satchel
 let strap=tor(.37,.025,M.leather,.25,.64,0,Math.PI/2,0,0,32);strap.scale.z=.82;g.add(strap);let med=mesh(new THREE.CylinderGeometry(.10,.10,.03,18),M.gold,.48,.56,.27);med.rotation.x=Math.PI/2;g.add(med);let gem=orb(.065,new THREE.MeshStandardMaterial({color:0x718d55,emissive:0x233117,emissiveIntensity:.35,metalness:.25,roughness:.35}),.48,.56,.29,12);g.add(gem);
 let bag=mesh(new THREE.BoxGeometry(.31,.33,.14),M.leather,.02,.55,-.32);bag.rotation.y=.15;g.add(bag);bag.add(mesh(new THREE.BoxGeometry(.26,.05,.16),M.gold,0,.14,0));
 // segmented tail
 let tailRoot=new THREE.Group();tailRoot.position.set(-.46,.60,0);g.add(tailRoot);for(let i=0;i<7;i++){let seg=orb(.09-i*.006,i%2?M.orangeHi:M.orange,-i*.13,.05*i,.07*Math.sin(i*.7),10);tailRoot.add(seg);punkinTail.push(seg)}
 g.userData.q20={body,head,cloak,tailRoot};return g;
}
function installPunkin(){
 let fam=null;scene.traverse(o=>{if(!fam&&o.userData&&o.userData.qType==='familiar')fam=o});
 if(!fam||punkin)return;
 for(const c of [...fam.children])c.visible=false;
 punkin=buildPunkin();punkin.userData.q20Keep=true;fam.add(punkin);fam.scale.setScalar(.82);fam.userData.q20Punkin=true;
}

/* ---------- biomechanical DMT mantis family ---------- */
const mantisMats={
 shell:M.armorGreen,metal:M.blackMetal,bronze:M.bronze,
 purple:new THREE.MeshStandardMaterial({color:0x44244f,emissive:0x7c25bb,emissiveIntensity:1.35,metalness:.55,roughness:.22}),
 greenGlow:new THREE.MeshStandardMaterial({color:0x37543d,emissive:0x86ff52,emissiveIntensity:1.5,metalness:.3,roughness:.2}),
 glass:new THREE.MeshStandardMaterial({color:0x6842a0,emissive:0x9c4dff,emissiveIntensity:2.2,metalness:.2,roughness:.12,transparent:true,opacity:.94})
};
function tubeBetween(a,b,r=.025,mat=mantisMats.metal){let d=b.clone().sub(a),len=d.length(),q=mesh(new THREE.CylinderGeometry(r,r,len,7),mat);q.position.copy(a).add(b).multiplyScalar(.5);q.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());return q}
function buildMantisMachine(scale=1,variant=0,bossy=false){
 const g=new THREE.Group();g.name=bossy?'MANTIS_HYPERION':'MANTIS_DMT_'+variant;
 const s=scale;
 // abdomen and chest armor
 let abdomen=mesh(new THREE.CapsuleGeometry(.23*s,.78*s,5,10),mantisMats.metal,0,.82*s,-.06*s);abdomen.rotation.z=.03;g.add(abdomen);
 let chest=mesh(new THREE.OctahedronGeometry(.38*s,1),mantisMats.shell,0,1.26*s,.03*s);chest.scale.set(1.1,1.3,.72);g.add(chest);
 // exposed DMT core
 let core=orb(.18*s,mantisMats.glass,0,1.34*s,.29*s,16);core.scale.set(.72,1.35,.5);g.add(core);core.add(new THREE.PointLight(variant%2?0x8c5cff:0xb13cff,bossy?5:2.6,4*s));
 for(let i=0;i<3;i++){let ring=tor((.24+i*.08)*s,.018*s,mantisMats.bronze,0,1.34*s,.27*s,0,0,0,28);ring.scale.y=1.18;g.add(ring)}
 // head shell + eyes
 let head=mesh(new THREE.ConeGeometry(.34*s,.52*s,5),mantisMats.shell,0,1.92*s,.08*s);head.rotation.x=-.12;head.rotation.y=Math.PI/4;g.add(head);
 for(const side of[-1,1]){let eye=orb(.10*s,variant===3?mantisMats.greenGlow:mantisMats.glass,.15*side*s,1.98*s,.25*s,14);eye.scale.set(1.15,.7,.46);g.add(eye);let ant=tubeBetween(new THREE.Vector3(.12*side*s,2.12*s,.10*s),new THREE.Vector3(.44*side*s,2.92*s,.23*s),.018*s,mantisMats.bronze);g.add(ant)}
 // shoulder guards and arms/blades
 for(const side of[-1,1]){
  let sh=mesh(new THREE.ConeGeometry(.20*s,.45*s,6),mantisMats.shell,.38*side*s,1.53*s,.02*s);sh.rotation.z=side*1.05;g.add(sh);
  let upper=tubeBetween(new THREE.Vector3(.34*side*s,1.50*s,.02*s),new THREE.Vector3(.67*side*s,1.28*s,.22*s),.065*s,mantisMats.metal);g.add(upper);
  let elbow=orb(.10*s,mantisMats.bronze,.68*side*s,1.28*s,.22*s,10);g.add(elbow);
  let fore=tubeBetween(new THREE.Vector3(.68*side*s,1.28*s,.22*s),new THREE.Vector3(.90*side*s,1.74*s,.35*s),.052*s,mantisMats.metal);g.add(fore);
  let blade=mesh(new THREE.ConeGeometry(.09*s,.86*s,7),variant===3?mantisMats.greenGlow:mantisMats.purple,.94*side*s,1.98*s,.39*s);blade.rotation.z=side*.34;blade.rotation.x=.07;g.add(blade);
  // rear legs
  let hip=orb(.11*s,mantisMats.bronze,.29*side*s,.75*s,-.05*s,10);g.add(hip);
  let thigh=tubeBetween(new THREE.Vector3(.29*side*s,.73*s,-.05*s),new THREE.Vector3(.68*side*s,.40*s,-.28*s),.055*s,mantisMats.metal);g.add(thigh);
  let shin=tubeBetween(new THREE.Vector3(.68*side*s,.40*s,-.28*s),new THREE.Vector3(.82*side*s,.03*s,.12*s),.04*s,mantisMats.shell);g.add(shin);
  // second leg pair
  let thigh2=tubeBetween(new THREE.Vector3(.22*side*s,.66*s,-.18*s),new THREE.Vector3(.48*side*s,.30*s,.32*s),.045*s,mantisMats.metal);g.add(thigh2);
  let shin2=tubeBetween(new THREE.Vector3(.48*side*s,.30*s,.32*s),new THREE.Vector3(.61*side*s,.03*s,.56*s),.033*s,mantisMats.shell);g.add(shin2);
 }
 // back machine apparatus
 let spine=cyl(.10*s,.15*s,1.05*s,mantisMats.metal,0,1.37*s,-.28*s);g.add(spine);
 let reactor=tor(.45*s,.055*s,mantisMats.bronze,0,1.72*s,-.31*s,0,0,0,44);g.add(reactor);
 let reactor2=tor(.32*s,.025*s,mantisMats.purple,0,1.72*s,-.32*s,0,0,.35,36);g.add(reactor2);
 let reservoir=cyl(.10*s,.10*s,.64*s,mantisMats.glass,0,1.72*s,-.34*s);g.add(reservoir);
 // side canisters + tubes
 for(const side of[-1,1]){let can=cyl(.065*s,.065*s,.40*s,mantisMats.glass,.29*side*s,1.52*s,-.26*s);g.add(can);g.add(tubeBetween(new THREE.Vector3(.28*side*s,1.52*s,-.26*s),new THREE.Vector3(.12*side*s,1.25*s,.03*s),.018*s,mantisMats.bronze))}
 // crystal spikes for Hyperion/elite
 if(bossy||variant===1){for(let i=0;i<6;i++){let a=(i/5-.5)*1.45;let cr=mesh(new THREE.OctahedronGeometry(.10*s,1),mantisMats.glass,Math.sin(a)*.43*s,1.66*s,-.38*s-Math.cos(a)*.15*s);cr.scale.y=1.8;g.add(cr)}}
 // hanging vials for extractor
 if(variant===0){for(const side of[-1,1])for(let i=0;i<2;i++){let x=(.45+i*.20)*side*s;let chain=tubeBetween(new THREE.Vector3(x,1.16*s,.05*s),new THREE.Vector3(x,.72*s,.05*s),.008*s,mantisMats.bronze);g.add(chain);let vial=cyl(.045*s,.045*s,.22*s,mantisMats.glass,x,.61*s,.05*s);g.add(vial)}}
 // wings for harvester
 if(variant===2){for(const side of[-1,1]){let wing=mesh(new THREE.PlaneGeometry(.72*s,1.20*s),glow(0x7353aa,.18),.45*side*s,1.22*s,-.33*s);wing.rotation.y=side*.48;wing.rotation.z=side*.15;g.add(wing)}}
 g.userData.q20Machine={core,reactor,variant,bossy};return g;
}
const upgraded=new WeakSet();
function upgradeEnemy(e,index=0){
 if(!e||e.dead||!e.g||upgraded.has(e))return;
 let old=e.g,p=old.position.clone(),r=old.rotation.y,sc=old.scale.x||1;let v=e.boss?1:(e.proRank>=2?0:(Math.abs(Math.floor((p.x*3+p.z*7)))%4));
 let ng=buildMantisMachine((e.boss?1.45:e.proRank>=2?1.12:1)*Math.max(.82,Math.min(1.2,sc)),v,!!e.boss);ng.position.copy(p);ng.rotation.y=r;scene.add(ng);scene.remove(old);e.g=ng;e.qType='mantis';
 if(e.boss){e.proName='MANTIS HYPERION';if(typeof bossname!=='undefined'&&bossname)bossname.textContent='MANTIS HYPERION'}
 else if(e.proRank>=2)e.proName='MANTIS DMT EXTRACTOR';
 else e.proName=['DMT HARVESTER','PSITHALID','MANTIS PSYCHOPOMP','VOID MANTIS'][v]||'VOID MANTIS';
 upgraded.add(e);
}
function upgradeAll(){if(typeof enemies==='undefined')return;enemies.forEach((e,i)=>upgradeEnemy(e,i))}
try{const sp0=spawnEnemy;spawnEnemy=function(isBoss=false){let r=sp0.apply(this,arguments),e=enemies[enemies.length-1];upgradeEnemy(e,enemies.length-1);return r||e}}catch(e){console.warn('[QUETOPIA] q20 spawn wrap',e)}

/* ---------- environment fidelity ---------- */
const q20Decor=[];
function lantern(x,z,c=0xc99655){let post=cyl(.035,.045,1.2,M.bronze,x,.6,z);scene.add(post);let bulb=orb(.09,new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:2.8,roughness:.25}),x,1.22,z,12);scene.add(bulb);bulb.add(new THREE.PointLight(c,2.2,4));q20Decor.push(post,bulb)}
function rootArch(x,z,rot=0,s=1){let g=new THREE.Group();let curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.85*s,0,0),new THREE.Vector3(-.55*s,1.1*s,0),new THREE.Vector3(0,1.65*s,0),new THREE.Vector3(.55*s,1.1*s,0),new THREE.Vector3(.85*s,0,0)]);let t=mesh(new THREE.TubeGeometry(curve,36,.10*s,8,false),M.wood);g.add(t);g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);q20Decor.push(g)}
function floorTile(x,z,s=1){let t=mesh(new THREE.BoxGeometry(1.05*s,.10,.78*s),M.stone,x,.02,z);t.rotation.y=(Math.random()-.5)*.08;t.position.y=(Math.random()-.5)*.02;scene.add(t);q20Decor.push(t);if(Math.random()>.68){let rune=tor(.18*s,.010,glow(Math.random()>.5?0x8e58ff:0x58dfff,.16),x,.08,z,Math.PI/2);scene.add(rune);q20Decor.push(rune)}}
for(let ix=-5;ix<=5;ix++)for(let iz=-4;iz<=4;iz++)if(Math.random()>.10)floorTile(ix*1.15,iz*.93,.95+Math.random()*.12);
[[-5.8,-3.6,0],[-5.8,3.6,0],[5.8,-3.6,0],[5.8,3.6,0],[-1.7,5.1,0],[1.7,5.1,0]].forEach(v=>lantern(v[0],v[1],v[0]<0?0x9a65ff:0x55ddff));
rootArch(-7,1.5,.45,1.2);rootArch(7,-1.8,-.5,1.1);rootArch(0,8,0,1.45);
// low stone balustrades for depth
for(const side of[-1,1])for(let i=-4;i<=4;i++){let p=mesh(new THREE.BoxGeometry(.30,.82,.30),M.stone,side*6.5,.40,i*1.25);scene.add(p);q20Decor.push(p);if(i<4){let rail=mesh(new THREE.BoxGeometry(.18,.18,1.15),M.stone,side*6.5,.72,i*1.25+.62);scene.add(rail);q20Decor.push(rail)}}

/* ---------- controls: 1–4 skills, mouse movement, reliable SPACE phase ---------- */
let q20PhaseCooldown=0;
function phaseBurst(pos){
 let ring=new THREE.Mesh(new THREE.RingGeometry(.35,.48,56),glow(0x6deaff,.9));ring.rotation.x=-Math.PI/2;ring.position.copy(pos);ring.position.y=.08;scene.add(ring);let born=performance.now();(function tick(){let t=(performance.now()-born)/520,sc=1+t*5;ring.scale.set(sc,sc,sc);ring.material.opacity=.9*(1-t);if(t<1)requestAnimationFrame(tick);else scene.remove(ring)})();
 let l=new THREE.PointLight(0x6deaff,18,8);l.position.copy(pos).add(new THREE.Vector3(0,1,0));scene.add(l);setTimeout(()=>scene.remove(l),180);
}
function q20Phase(){
 if(q20PhaseCooldown>0)return;
 let before=player.position.clone();let used=false;
 try{let olddc=typeof dc==='number'?dc:0;dash();used=typeof dc==='number'&&dc>olddc}catch(_){ }
 if(!used){let v=(typeof moveTarget!=='undefined'&&typeof mouseMoving!=='undefined'&&mouseMoving)?moveTarget.clone().sub(player.position):aim.clone().sub(player.position);v.y=0;if(v.lengthSq()<.01)v.set(0,0,1);v.normalize();player.position.addScaledVector(v,3.7);try{if(typeof dc==='number'&&typeof MAX!=='undefined')dc=MAX.dc}catch(_){}}
 if(player.position.distanceTo(before)<1){let v=aim.clone().sub(player.position);v.y=0;if(v.lengthSq()>.01)player.position.addScaledVector(v.normalize(),3.4)}
 q20PhaseCooldown=1.0;phaseVisualT=.46;phaseBurst(before);phaseBurst(player.position);phaseLabel.classList.add('on');setTimeout(()=>phaseLabel.classList.remove('on'),330);
}
function onKey(e){
 if(e.repeat)return;let k=e.key.toLowerCase();if(['input','textarea','select'].includes((e.target?.tagName||'').toLowerCase()))return;
 if(k==='1'||k==='2'||k==='3'||k==='4'||e.code==='Space'||k==='q'||k==='e'||k==='r'){
  if(k==='1')signalShot();else if(k==='2')prism();else if(k==='3')nova();else if(k==='4')fracture();else if(e.code==='Space')q20Phase();
  e.preventDefault();e.stopImmediatePropagation();
 }
}
addEventListener('keydown',onKey,true);
function bindMouse(){if(typeof renderer==='undefined'||!renderer?.domElement)return;renderer.domElement.addEventListener('mousedown',e=>{if(e.button===2){e.preventDefault();e.stopImmediatePropagation();try{rmbHeld=false}catch(_){}}},true);renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault(),true)}
bindMouse();

/* ---------- animation and camera ---------- */
function frame(now){
 const t=now/1000;installDruid();installPunkin();upgradeAll();
 if(q20PhaseCooldown>0)q20PhaseCooldown=Math.max(0,q20PhaseCooldown-.016);
 if(heroRig){let delta=player.position.distanceTo(lastHeroPos);walkClock+=delta*4.5;let moving=delta>.002;heroRig.position.y=(phaseVisualT>0?Math.sin((1-phaseVisualT/.46)*Math.PI)*.42:0)+(moving?Math.sin(walkClock)*.025:0);if(phaseVisualT>0)phaseVisualT=Math.max(0,phaseVisualT-.016);if(heroParts){heroParts.capeL.rotation.z=-.12+(moving?Math.sin(walkClock*.65)*.07:0);heroParts.capeR.rotation.z=.12-(moving?Math.sin(walkClock*.65)*.07:0);heroParts.beardRoot.rotation.z=(moving?Math.sin(walkClock*.55)*.025:0);heroParts.gem.rotation.y+=.018}lastHeroPos.copy(player.position)}
 if(punkin){punkin.position.y=.02+Math.sin(t*4.4)*.018;if(punkin.userData.q20?.tailRoot)punkin.userData.q20.tailRoot.rotation.y=Math.sin(t*3.8)*.38;for(let i=0;i<punkinTail.length;i++)punkinTail[i].position.z=.07*Math.sin(t*4-i*.55)}
 if(typeof enemies!=='undefined')for(const e of enemies){if(e.dead||!e.g?.userData?.q20Machine)continue;let q=e.g.userData.q20Machine;q.core.scale.y=1.25+.10*Math.sin(t*5+e.g.position.x);q.reactor.rotation.z+=.006*(e.boss?1.8:1);e.g.position.y=(e.boss?.04:.02)+Math.sin(t*3+e.g.position.x)*.015}
 requestAnimationFrame(frame)
}
requestAnimationFrame(frame);
try{const u0=update;update=function(dt){let r=u0.apply(this,arguments);if(camera&&player){camera.fov+=(35-camera.fov)*.08;camera.updateProjectionMatrix();let desired=player.position.clone().add(new THREE.Vector3(12.2,14.0,12.2));camera.position.lerp(desired,.16);camera.lookAt(player.position.clone().add(new THREE.Vector3(0,1.02,0)))}return r}}catch(e){console.warn('[QUETOPIA] q20 camera wrap',e)}
try{if(renderer){renderer.toneMappingExposure=1.52;renderer.shadowMap.enabled=true}if(scene.fog&&typeof scene.fog.density==='number')scene.fog.density=Math.min(scene.fog.density,.0175)}catch(_){ }

installDruid();installPunkin();upgradeAll();
console.log('[QUETOPIA] '+TAG+' active');
})();