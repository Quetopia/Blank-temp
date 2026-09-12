import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dashGhosts,catStride} from './motion.mjs';
test('Punkin alternates her stride and rests her feet when stationary',()=>{
 const a=catStride(.5,true),b=catStride(.5+Math.PI/1.6,true);
 assert.ok(a.left*b.left<0);assert.equal(a.left,-a.right);
 assert.equal(catStride(3,false).left,0);
});
test('dash tracers are bounded, preserve facing and expire',()=>{
 let ghosts=[];for(let i=0;i<300;i++)ghosts=dashGhosts(ghosts,{x:i,y:0,dir:2},{x:i+1,y:0},true,1/60);
 assert.ok(ghosts.length<=18);assert.equal(ghosts.at(-1).dir,2);
 ghosts=dashGhosts(ghosts,{x:0,y:0},{x:0,y:0},false,.4);assert.equal(ghosts.length,0);
});
