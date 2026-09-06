(function(){
'use strict';
/* SIGNAL 019 motion/grounding pass — visual only, no combat math. */
if(typeof THREE==='undefined'||typeof scene==='undefined'){return}
const fx=[];let last=performance.now(),prev=null,stepClock=0,shadow=null,aimRing=null,aimDot=null,cloakL=null,cloakR=null,decorated=false;
const enemyShadow=new WeakMap();
function bm(c,o=.3){return new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending})}
function ring(pos,a,b,c,o=.25,y=.035){let m=new THREE.Mesh(new THREE.RingGeometry(a,b,48),bm(c,o));m.rotation.x=-Math.PI/2;m.position.copy(pos);m.position.y=y;scene.add(m);return m}
function makePlayerExtras(){if(decorated||typeof player==='undefined'||!player)return;decorated=true;
  shadow=new THREE.Mesh(new THREE.CircleGeometry(.58,40),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.34,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.018;scene.add(shadow);
  aimRing=ring(new THREE.Vector3(),.16,.22,0x70eaff,.18,.04);aimDot=new THREE.Mesh(new THREE.CircleGeometry(.035,18),bm(0xeaffff,.38));aimDot.rotation.x=-Math.PI/2;aimDot.position.y=.043;scene.add(aimDot);
  cloakL=new THREE.Mesh(new THREE.PlaneGeometry(.30,.86),bm(0x8451c7,.12));cloakR=new THREE.Mesh(new THREE.PlaneGeometry(.30,.86),bm(0x45cfe0,.10));
  cloakL.position.set(-.18,.72,-.25);cloakR.position.set(.18,.72,-.25);cloakL.rotation.x=cloakR.rotation.x=-.12;player.add(cloakL);player.add(cloakR);
}
function stepFx(pos,side){let p=pos.clone();p.x+=side*.18;let m=ring(p,.05,.11,side>0?0x64eaff:0xa35cff,.20,.025);fx.push({m,t:0,life:.36})}
function updateEnemyShadows(){if(typeof enemies==='undefined')return;for(const e of enemies){if(!e||!e.g)continue;let s=enemyShadow.get(e);if(e.dead||!e.g.parent){if(s?.parent)s.parent.remove(s);enemyShadow.delete(e);continue}if(!s){let size=e.boss?1.05:(e.proRank>=2?.62:.48);s=new THREE.Mesh(new THREE.CircleGeometry(size,28),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:e.boss?.34:.22,depthWrite:false}));s.rotation.x=-Math.PI/2;s.position.y=.015;scene.add(s);enemyShadow.set(e,s)}s.position.x=e.g.position.x;s.position.z=e.g.position.z}}
function worldStaff(){try{let p=new THREE.Vector3();if(typeof staffTip!=='undefined'&&staffTip){staffTip.getWorldPosition(p);return p}}catch(_){}return null}
let tracer=null;
function updateAimVisual(t){if(typeof aim==='undefined'||!aimRing)return;aimRing.position.x=aimDot.position.x=aim.x;aimRing.position.z=aimDot.position.z=aim.z;let s=1+.10*Math.sin(t*7);aimRing.scale.setScalar(s);aimRing.rotation.z+=.012;let firing=typeof rmbHeld!=='undefined'&&rmbHeld;aimRing.material.opacity=firing?.38:.15;aimDot.material.opacity=firing?.62:.28;
  let from=worldStaff();if(!from)return;let to=aim.clone();to.y=.11;let d=to.clone().sub(from),len=d.length();if(len<.2)return;let mid=from.clone().add(to).multiplyScalar(.5);if(!tracer){tracer=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,1,6),bm(0x68eaff,.10));scene.add(tracer)}tracer.visible=firing; if(firing){tracer.position.copy(mid);tracer.scale.y=len;tracer.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());tracer.material.opacity=.08+.05*(.5+.5*Math.sin(t*16))}}
function frame(now){let dt=Math.min(.05,Math.max(.001,(now-last)/1000));last=now;let t=now/1000;makePlayerExtras();updateEnemyShadows();updateAimVisual(t);
 if(typeof player!=='undefined'&&player?.position&&shadow){shadow.position.x=player.position.x;shadow.position.z=player.position.z;shadow.scale.setScalar(.95+.04*Math.sin(t*5));if(!prev)prev=player.position.clone();let v=player.position.clone().sub(prev);v.y=0;let sp=v.length()/dt;if(sp>.25){stepClock-=dt;if(stepClock<=0){stepClock=.22;stepFx(player.position.clone(),Math.sin(t*20)>0?1:-1)}if(cloakL&&cloakR){let sway=Math.sin(t*9)*.08*Math.min(1,sp/4);cloakL.rotation.z=.05+sway;cloakR.rotation.z=-.05-sway;cloakL.rotation.x=cloakR.rotation.x=-.12-Math.min(.22,sp*.018)}}else if(cloakL&&cloakR){cloakL.rotation.z*=.9;cloakR.rotation.z*=.9;cloakL.rotation.x+=( -.12-cloakL.rotation.x)*.12;cloakR.rotation.x+=( -.12-cloakR.rotation.x)*.12}prev.copy(player.position)}
 for(let i=fx.length-1;i>=0;i--){let f=fx[i];f.t+=dt;let p=Math.min(1,f.t/f.life),k=1+p*2.5;f.m.scale.set(k,k,k);f.m.material.opacity=.2*(1-p);if(f.t>=f.life){if(f.m.parent)f.m.parent.remove(f.m);fx.splice(i,1)}}requestAnimationFrame(frame)}
requestAnimationFrame(frame);console.log('[QUETOPIA] SIGNAL 019 motion pass active');
})();