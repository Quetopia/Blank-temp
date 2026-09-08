export const W=1536,H=1024;
export const SKILLS={bolt:{name:'Spore lance',cost:0,cd:.32,key:'Q'},nova:{name:'Fungal bloom',cost:28,cd:4,key:'W'},roots:{name:'Root snare',cost:22,cd:6,key:'E'},heal:{name:'Verdant bond',cost:30,cd:10,key:'R'},dash:{name:'Veil step',cost:0,cd:1.6,key:'SPACE'}};
export const BLESSINGS={spores:{name:'Prismatic spores',description:'Spore lance pierces one additional creature.'},bond:{name:'Punkin’s promise',description:'Punkin strikes 40% harder and restores 3 life on each hit.'},roots:{name:'Ancient roots',description:'Root snare lasts 5 seconds; bloom reaches 20% farther.'}};
export const distance=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*1.25);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function constrain(p){p.x=clamp(p.x,245,1280);p.y=clamp(p.y,240,890);return p;}
export class Grove {
 constructor(seed=9){this.seed=seed;this.blessing=null;this.reset();}
 setBlessing(id){this.blessing=Object.hasOwn(BLESSINGS,id)?id:null;}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
 reset(){this.time=0;this.mode='ready';this.player={x:760,y:635,hp:240,maxHp:240,mana:100,dir:0,walk:0,inv:0,cast:0};this.cat={x:700,y:665,dir:0,walk:0,attack:0};this.enemies=[];this.shots=[];this.events=[];this.loot=[];this.cd={};this.kills=0;this.relics=0;this.power=1;this.target=null;this.bossSpawned=false;this.anchors=[{x:435,y:298,on:false},{x:1080,y:365,on:false},{x:777,y:731,on:false}];this.encounter=0;this.spawnWave(4);}
 start(){this.mode='playing';this.event('notice',this.player,{text:'Awaken the three root seals. F to attune.'});}
 event(type,p,extra={}){if(this.events.length<180)this.events.push({type,x:p.x,y:p.y,...extra});}
 spawnWave(n){for(let i=0;i<n;i++){let a=this.random()*Math.PI*2;this.spawn(768+Math.cos(a)*400,495+Math.sin(a)*190,false);}}
 spawn(x,y,boss){this.enemies.push({x,y,hp:boss?1250:95+this.encounter*12,maxHp:boss?1250:95+this.encounter*12,boss,dir:0,walk:0,speed:boss?48:63+this.random()*20,cool:1+this.random(),wind:0,root:0,flash:0,dead:false});}
 aimDir(p,target){const dx=target.x-p.x,dy=target.y-p.y;p.dir=dy<0?(dx>=0?2:3):(dx>=0?0:1);}
 move(p,to,speed,dt){const d=Math.hypot(to.x-p.x,to.y-p.y);if(d<3)return false;const k=Math.min(1,speed*dt/d);this.aimDir(p,to);p.x+=(to.x-p.x)*k;p.y+=(to.y-p.y)*k;p.walk+=speed*dt*.055;constrain(p);return true;}
 damage(e,n){if(e.dead)return;e.hp-=n;e.flash=.14;this.event('hit',e,{n:Math.round(n)});if(e.hp<=0){e.dead=true;this.kills++;this.event('death',e);this.loot.push({x:e.x,y:e.y,boss:e.boss});if(e.boss){this.mode='won';this.event('notice',e,{text:'THE VEIL REMEMBERS YOU'});}}}
 hurt(n){if(this.mode!=='playing')return;let p=this.player;if(p.inv>0)return;p.hp=Math.max(0,p.hp-n);p.inv=.4;this.event('hurt',p,{n});if(p.hp<=0){this.mode='lost';this.event('notice',p,{text:'THE ROOTS WILL BRING YOU BACK'});}}
 cast(id,aim){if(this.mode!=='playing')return false;const s=SKILLS[id],p=this.player;if(!s||this.cd[id]>0||p.mana<s.cost)return false;this.cd[id]=s.cd;p.mana-=s.cost;p.cast=.22;this.aimDir(p,aim);if(id==='bolt'){let dx=aim.x-p.x,dy=aim.y-p.y,d=Math.hypot(dx,dy)||1;this.shots.push({x:p.x,y:p.y-20,vx:dx/d*640,vy:dy/d*640,life:1.45,power:34*this.power,pierce:this.blessing==='spores'?1:0,hit:new Set()});this.event('cast',p);}
 if(id==='nova'){const r=this.blessing==='roots'?294:245;for(const e of this.enemies)if(distance(p,e)<r)this.damage(e,90*this.power);this.event('nova',p,{r});}
 if(id==='roots'){for(const e of this.enemies)if(distance(aim,e)<170){e.root=this.blessing==='roots'?5:3;this.damage(e,40*this.power);}this.event('roots',aim,{r:170});}
 if(id==='heal'){p.hp=Math.min(p.maxHp,p.hp+95);p.inv=.8;this.event('heal',p);}
 if(id==='dash'){let dx=aim.x-p.x,dy=aim.y-p.y,d=Math.hypot(dx,dy)||1;this.event('dash',p);p.x+=dx/d*155;p.y+=dy/d*155;constrain(p);p.inv=.6;this.target=null;this.event('dash',p);}
 return true;}
 attune(){if(this.mode!=='playing')return false;let a=this.anchors.find(a=>!a.on&&distance(a,this.player)<105);if(!a)return false;if(this.enemies.some(e=>!e.dead&&distance(e,a)<180)){this.event('notice',a,{text:'Clear the creatures around this seal.'});return false;}a.on=true;this.encounter++;this.player.hp=Math.min(this.player.maxHp,this.player.hp+50);this.player.mana=100;this.event('anchor',a);if(this.encounter===3){this.bossSpawned=true;this.spawn(768,290,true);this.event('notice',a,{text:'THE THORN CROWN · GUARDIAN OF THE VEIL'});}else{this.spawnWave(3+this.encounter);this.event('notice',a,{text:`Root seal ${this.encounter} / 3 awakened`});}return true;}
 step(dt,input={}){if(this.mode!=='playing')return;this.time+=dt;let p=this.player;p.inv=Math.max(0,p.inv-dt);p.cast=Math.max(0,p.cast-dt);p.mana=Math.min(100,p.mana+12*dt);for(const k in this.cd)this.cd[k]=Math.max(0,this.cd[k]-dt);
 if(input.direction&&(input.direction.x||input.direction.y)){this.target=null;this.move(p,{x:p.x+input.direction.x*100,y:p.y+input.direction.y*100},220,dt);}
 else {if(input.move)this.target=constrain({...input.move});if(this.target){if(!this.move(p,this.target,220,dt))this.target=null;}}
 if(input.fire&&input.aim)this.cast('bolt',input.aim);
 for(const e of this.enemies){if(e.dead)continue;e.root=Math.max(0,e.root-dt);e.flash=Math.max(0,e.flash-dt);e.cool-=dt;let d=distance(p,e);if(e.wind>0){e.wind-=dt;if(e.wind<=0){this.event('strike',e.mark,{r:e.boss?140:65,boss:e.boss});if(distance(p,e.mark)<(e.boss?140:65))this.hurt(e.boss?45:18);if(this.mode!=='playing')return;e.cool=e.boss?1.3:1.5;}}else if(e.cool<=0&&d<(e.boss?330:95)){e.mark={x:p.x,y:p.y};e.wind=e.boss?.95:.65;this.event('telegraph',e.mark,{r:e.boss?140:65,life:e.wind});}else if(!e.root&&d>55)this.move(e,p,e.speed,dt);}
 // Separation prevents an unreadable pile of creatures and keeps the work bounded.
 for(let i=0;i<this.enemies.length;i++)for(let j=i+1;j<this.enemies.length;j++){let a=this.enemies[i],b=this.enemies[j];if(a.dead||b.dead)continue;let dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d>0&&d<38){const push=(38-d)*dt*2;a.x+=dx/d*push;b.x-=dx/d*push;a.y+=dy/d*push;b.y-=dy/d*push;}}
 for(const s of this.shots){const old={x:s.x,y:s.y};s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;for(const e of this.enemies){if(e.dead||s.hit?.has(e))continue;const dx=s.x-old.x,dy=s.y-old.y,l=dx*dx+dy*dy,t=clamp(((e.x-old.x)*dx+(e.y-20-old.y)*dy)/(l||1),0,1);if(Math.hypot(old.x+t*dx-e.x,old.y+t*dy-(e.y-20))<(e.boss?48:28)){this.damage(e,s.power);s.hit?.add(e);if(s.pierce>0){s.pierce--;}else{s.life=0;break;}}}}
 this.shots=this.shots.filter(s=>s.life>0);this.enemies=this.enemies.filter(e=>!e.dead);
 const c=this.cat;c.attack-=dt;let nearest=this.enemies.reduce((best,e)=>distance(e,p)<310&&(!best||distance(e,c)<distance(best,c))?e:best,null);if(nearest){this.move(c,nearest,245,dt);if(distance(c,nearest)<65&&c.attack<=0){c.attack=.85;this.damage(nearest,24*this.power*(this.blessing==='bond'?1.4:1));if(this.blessing==='bond')p.hp=Math.min(p.maxHp,p.hp+3);this.event('cat',nearest);}}else if(distance(c,p)>65)this.move(c,{x:p.x-55,y:p.y+25},220,dt);
 for(const drop of this.loot){if(distance(drop,p)<90){drop.gone=true;this.relics++;p.mana=Math.min(100,p.mana+10);if(this.relics%3===0){this.power+=.16;this.event('notice',p,{text:'AMETHYST ROOT · spell damage increased'});}this.event('pickup',drop);}}this.loot=this.loot.filter(x=>!x.gone);
 }
}
