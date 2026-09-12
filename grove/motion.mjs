// Visual helpers are pure so pause, expiry, and stride can be checked independently.
export function catStride(walk,moving){const swing=moving?Math.sin(walk*1.6)*5:0;return {left:swing,right:-swing};}
export function dashGhosts(ghosts,from,to,dashing,dt){
 const next=ghosts.map(g=>({...g,age:g.age+dt})).filter(g=>g.age<g.life);
 if(dashing&&Math.hypot(to.x-from.x,to.y-from.y)>.25){
  next.push({x:from.x,y:from.y,dir:from.dir,age:0,life:.32});
 }
 return next.slice(-18);
}
