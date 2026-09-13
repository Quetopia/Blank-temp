import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Grove,distance} from './simulation.mjs';
test('holding mouse movement with arrows cannot double speed or override keyboard direction',()=>{const g=new Grove();g.start();g.enemies=[];const origin={...g.player};g.step(.1,{direction:{x:1,y:0},move:{x:1200,y:300}});assert.ok(Math.abs(g.player.x-origin.x-22)<.001);assert.equal(g.player.y,origin.y);assert.equal(g.target,null);g.step(.1,{move:{x:1200,y:300}});assert.ok(g.player.y<origin.y);});
test('movement speed is independent of simulation subdivision',()=>{let a=new Grove(),b=new Grove();for(const g of[a,b]){g.start();g.enemies=[];g.target={x:1200,y:635};}for(let i=0;i<60;i++)a.step(1/60);for(let i=0;i<120;i++)b.step(1/120);assert.ok(Math.abs(a.player.x-b.player.x)<.001);assert.ok(Math.abs(a.player.x-980)<.01);});
test('mana, cooldown, pause-state and death gate actions',()=>{const g=new Grove();assert.equal(g.cast('nova',g.player),false);g.start();assert.equal(g.cast('nova',g.player),true);assert.equal(g.player.mana,72);assert.equal(g.cast('nova',g.player),false);g.cd={};g.player.mana=0;assert.equal(g.cast('heal',g.player),false);g.player.hp=1;g.hurt(20);assert.equal(g.mode,'lost');const time=g.time;g.step(1);assert.equal(g.time,time);});
test('bolt collision uses swept segment and disappears after impact',()=>{const g=new Grove();g.start();g.enemies=[];g.spawn(850,635,false);let enemy=g.enemies[0];enemy.speed=0;g.cat.attack=100;g.cat.x=300;g.cat.y=850;g.cast('bolt',{x:1000,y:635});for(let i=0;i<12;i++)g.step(1/60);assert.ok(enemy.hp<enemy.maxHp);assert.equal(g.shots.length,0);});
test('all seals gate a guardian and victory is reachable',()=>{const g=new Grove();g.start();g.enemies=[];for(let i=0;i<3;i++){g.enemies=[];Object.assign(g.player,{x:g.anchors[i].x,y:g.anchors[i].y});assert.equal(g.attune(),true);assert.equal(g.attune(),false);}assert.equal(g.encounter,3);let boss=g.enemies.find(e=>e.boss);assert.ok(boss);g.damage(boss,2000);assert.equal(g.mode,'won');});
test('hostiles prevent unsafe seal activation and dodge has bounds',()=>{const g=new Grove();g.start();g.enemies=[];Object.assign(g.player,{x:435,y:298});g.spawn(440,300,false);assert.equal(g.attune(),false);g.player.x=1270;g.cast('dash',{x:9000,y:300});assert.ok(g.player.x<=1280);assert.ok(g.player.inv>0);});
test('Punkin attacks without player input and drops can be collected',()=>{const g=new Grove();g.start();g.enemies=[];g.spawn(780,660,false);for(let i=0;i<300&&g.kills===0;i++)g.step(1/60);assert.ok(g.kills>0);assert.ok(g.relics>0||g.loot.length>0);});
test('projectiles and event queue stay bounded through sustained casting',()=>{const g=new Grove();g.start();g.enemies=[];for(let i=0;i<36000;i++){g.player.hp=240;g.step(1/60,{fire:true,aim:{x:1000,y:635}});}assert.ok(g.shots.length<10);assert.ok(g.events.length<=180);});
test('blessings change combat and survive an expedition reset',()=>{const g=new Grove();g.setBlessing('roots');g.reset();g.start();g.enemies=[];g.spawn(g.player.x+260,g.player.y,false);const enemy=g.enemies[0];g.cast('nova',g.player);assert.ok(enemy.hp<enemy.maxHp);g.cast('roots',enemy);assert.equal(enemy.root,5);g.setBlessing('invalid');assert.equal(g.blessing,null);});
test('piercing spores hit two distinct creatures once each',()=>{const g=new Grove();g.setBlessing('spores');g.start();g.enemies=[];g.cat.attack=100;g.cat.x=300;g.cat.y=850;g.spawn(820,635,false);g.spawn(890,635,false);const enemies=[...g.enemies];for(const e of enemies){e.speed=0;e.cool=100;}g.cast('bolt',{x:1100,y:635});for(let i=0;i<30;i++)g.step(1/60);for(const e of enemies)assert.equal(e.hp,e.maxHp-34);assert.equal(g.shots.length,0);});
test('Punkin blessing restores life without exceeding maximum',()=>{const g=new Grove();g.setBlessing('bond');g.start();g.enemies=[];g.player.hp=239;g.spawn(g.cat.x,g.cat.y,false);g.step(1/60);assert.equal(g.player.hp,240);assert.ok(g.enemies[0].hp<70);});
test('keyboard movement cancels click destination and normalizes diagonals',()=>{const a=new Grove(),b=new Grove();for(const g of[a,b]){g.start();g.enemies=[];g.target={x:250,y:250};}const origin={...a.player};a.step(.1,{direction:{x:1,y:0}});b.step(.1,{direction:{x:1,y:1}});assert.equal(a.target,null);assert.ok(Math.abs(Math.hypot(b.player.x-origin.x,b.player.y-origin.y)-22)<.001);assert.ok(Math.abs(a.player.x-origin.x-22)<.001);});
test('fatal damage is terminal even if an attack remains in flight',()=>{const g=new Grove();g.start();g.enemies=[];g.spawn(g.player.x,g.player.y,false);const e=g.enemies[0];e.wind=.001;e.mark={...g.player};g.player.hp=1;g.cast('bolt',{x:1000,y:635});g.step(1/60);assert.equal(g.mode,'lost');assert.equal(g.player.hp,0);g.hurt(1);assert.equal(g.mode,'lost');});

test('veil step slides through intermediate positions, ignores movement, then lands exactly',()=>{
 const g=new Grove();g.start();g.enemies=[];const x=g.player.x,y=g.player.y;
 assert.equal(g.cast('dash',{x:x+300,y}),true);assert.equal(g.player.x,x);
 g.step(.07,{direction:{x:-1,y:1},move:{x:245,y:890}});
 assert.ok(g.player.x>x&&g.player.x<x+155);assert.equal(g.player.y,y);
 assert.equal(g.cast('nova',g.player),false);
 for(let i=0;i<13;i++)g.step(1/60);
 assert.equal(g.dash,null);assert.equal(g.player.x,x+155);assert.equal(g.player.y,y);
});
test('veil step duration is consistent across timesteps and reset clears it',()=>{
 const a=new Grove(),b=new Grove();for(const g of [a,b]){g.start();g.enemies=[];g.cast('dash',{x:1100,y:450});}
 for(let i=0;i<18;i++)a.step(1/60);for(let i=0;i<36;i++)b.step(1/120);
 assert.ok(Math.hypot(a.player.x-b.player.x,a.player.y-b.player.y)<.001);
 a.cd.dash=0;a.cast('dash',{x:500,y:500});a.reset();assert.equal(a.dash,null);
});
