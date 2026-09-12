import {Grove as Base,SKILLS as BASE_SKILLS,distance,constrain} from './base-simulation.mjs';
import {byId,kitFor} from './roster.mjs';
export {W,H,WAND_CHARGE,BLESSINGS,distance} from './base-simulation.mjs';
export const SKILLS={...BASE_SKILLS};
export class Grove extends Base {
 reset(){super.reset();this.zones=[];this.mirrors=0;this.mirrorLife=0;this.phase=0;this.heat=0;this.overheat=0;this.petPulse=2;this.build=this.build||0;this.character=this.character||'druid';this.configure();}
 configure(){this.spec=byId(this.character);this.kit=kitFor(this.character);Object.assign(SKILLS,this.kit);this.player.maxHp=this.spec.hp+(this.build===2?30:0);this.player.hp=this.player.maxHp;}
 select(id,build=0){if(this.mode==='playing')return false;this.character=byId(id).id;this.build=Math.max(0,Math.min(2,Math.floor(build)||0));this.reset();return true;}
 aimDir(p,to){super.aimDir(p,to);p.heading=Math.atan2(to.x-p.x,to.y-p.y);}
 damage(e,n){super.damage(e,n*(this.build===0?1.08:this.build===2?.92:1));}
 projectile(aim,power=34,spread=0,count=1,pierce=0,origin=this.player){const a=Math.atan2(aim.y-origin.y,aim.x-origin.x);for(let i=0;i<count;i++){const t=a+(i-(count-1)/2)*spread;this.shots.push({x:origin.x,y:origin.y-20,vx:Math.cos(t)*660,vy:Math.sin(t)*660,life:1.45,power:power*this.power*(this.build===1?1.25:1),pierce:pierce+(this.blessing==='spores'?1:0),hit:new Set()});}this.event('cast',origin);}
 area(pos,r,n,root=0,bonus=()=>1){for(const e of this.enemies){if(e.dead||distance(pos,e)>r)continue;if(root)e.root=Math.max(e.root,e.boss?Math.min(1,root):root);this.damage(e,n*this.power*bonus(e));}this.event(root?'roots':'nova',pos,{r});}
 recover(n,inv=.6){this.player.hp=Math.min(this.player.maxHp,this.player.hp+n);this.player.inv=Math.max(this.player.inv,inv);this.event('heal',this.player);}
 cast(id,aim){if(this.character==='druid'||id==='dash')return super.cast(id,aim);if(this.mode!=='playing'||this.dash||!aim||!Number.isFinite(aim.x)||!Number.isFinite(aim.y))return false;const s=this.kit[id],p=this.player;if(!s||this.cd[id]>0||p.mana<s.cost)return false;
 if(this.character==='ember-sovereign'&&((['bolt','nova'].includes(id)&&this.overheat>0)||(id==='heal'&&this.heat<40)))return false;
 this.cd[id]=s.cd;p.mana-=s.cost;p.cast=.24;this.aimDir(p,aim);const c=this.character;
 if(c==='diamond-girl'){
 if(id==='bolt'){this.projectile(aim,43,0,1,2);if(this.mirrors)for(const side of [-1,1])this.projectile(aim,18,0,1,0,{x:p.x+side*60,y:p.y});}
 if(id==='nova'){this.mirrors=2;this.mirrorLife=6;this.event('anchor',p);}
 if(id==='roots')this.recover(45,1.1);
 if(id==='heal')for(let i=0;i<12;i++)this.projectile({x:p.x+Math.cos(i*Math.PI/6)*100,y:p.y+Math.sin(i*Math.PI/6)*100},48,0,1,2);
 }else if(c==='crescent-weaver'){
 if(id==='bolt'){this.phase=(this.phase+1)%3;this.projectile(aim,this.phase===0?26:21,.18,this.phase===0?5:2);}
 if(id==='nova')this.area(aim,190,36,3);
 if(id==='roots'){this.recover(60);this.cd.dash=0;}
 if(id==='heal')this.area(p,330,145,2);
 }else if(c==='ember-sovereign'){
 if(id==='bolt'||id==='nova'){this.heat=Math.min(100,this.heat+(id==='bolt'?12:20));const a=Math.atan2(aim.y-p.y,aim.x-p.x),range=id==='bolt'?190:320;for(const e of this.enemies){const t=Math.atan2(e.y-p.y,e.x-p.x)-a;if(distance(p,e)<range&&Math.cos(t)>.45)this.damage(e,(id==='bolt'?62:115)*this.power*(this.build===1?1.25:1));}this.event('nova',p,{r:range});if(this.heat===100)this.overheat=2;}
 if(id==='roots'){this.heat=Math.max(0,this.heat-35);this.recover(45,1);}
 if(id==='heal'){this.heat-=40;this.area(p,350,190);}
 }else if(c==='sally'){
 if(id==='bolt')this.projectile(aim,17,.16,3);
 if(id==='nova'){if(this.zones.length>=3){const z=this.zones.shift();this.area(z,145,100);}this.zones.push({...constrain({...aim}),life:2.5,kind:'bomb'});}
 if(id==='roots'){this.recover(50);for(const e of this.enemies)if(distance(p,e)<200){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1;e.x+=dx/d*80;e.y+=dy/d*80;constrain(e);e.root=1;}this.event('nova',p,{r:200});}
 if(id==='heal'){for(const z of this.zones)this.area(z,180,145);this.zones=[];this.area(aim,210,115);}
 }else if(c==='cyberdine'){
 if(id==='bolt'){this.projectile(aim,38,0,1,1);this.shots[this.shots.length-1].frayBonus=true;}
 if(id==='nova'){for(const e of this.enemies)if(distance(aim,e)<180)e.fray=5;this.area(aim,180,30,2);}
 if(id==='roots'){this.recover(75);for(const e of this.enemies)if(e.fray>0)this.damage(e,35*this.power);}
 if(id==='heal')this.area(aim,230,100,0,e=>e.fray>0?2:1);
 }else if(c==='abyssal-cantor'){
 if(id==='bolt')this.projectile(aim,20,.23,3);
 if(id==='nova'){if(this.zones.length>=2)this.zones.shift();this.zones.push({...constrain({...aim}),life:5,tick:0,kind:'pool'});}
 if(id==='roots')this.recover(65,1);
 if(id==='heal')this.area(p,330,110,0,e=>e.soaked>0?2:1);
 }
 return true;}
 step(dt,input={}){if(this.mode!=='playing')return;super.step(dt,input);if(this.mode!=='playing')return;this.mirrorLife=Math.max(0,this.mirrorLife-dt);if(!this.mirrorLife)this.mirrors=0;this.overheat=Math.max(0,this.overheat-dt);this.heat=Math.max(0,this.heat-dt*2);for(const e of this.enemies){e.fray=Math.max(0,(e.fray||0)-dt);e.soaked=Math.max(0,(e.soaked||0)-dt);}
 for(const z of this.zones){z.life-=dt;if(z.kind==='bomb'&&z.life<=0)this.area(z,145,100);if(z.kind==='pool'){z.tick-=dt;if(z.tick<=0){z.tick=.5;for(const e of this.enemies)if(distance(z,e)<150){e.soaked=2;this.damage(e,14*this.power);}this.event('roots',z,{r:150,life:.5});}}}this.zones=this.zones.filter(z=>z.life>0);
 this.petPulse-=dt;if(this.petPulse<=0){this.petPulse=this.build===2?2:4;const target=this.enemies.find(e=>!e.dead&&distance(this.cat,e)<270);if(target){const c=this.character;if(c==='diamond-girl')this.projectile(target,18,0,1,1,this.cat);if(c==='crescent-weaver'){target.root=Math.max(target.root,.6);this.event('cat',target);}if(c==='ember-sovereign')this.area(this.cat,140,20);if(c==='sally')this.projectile(target,12,.2,3,0,this.cat);if(c==='cyberdine'){target.fray=3;this.event('cat',target);}if(c==='abyssal-cantor'){target.soaked=3;this.recover(8,0);}if(this.build===2)this.damage(target,24*this.power);}}
 }
}
