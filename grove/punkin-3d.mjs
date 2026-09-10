import * as THREE from './vendor/three/three.module.js';
import {GLTFLoader} from './vendor/three/GLTFLoader.js';

// Render the actual skinned model into the grove's existing depth-sorted canvas.
// The rest of the game remains in its established world coordinate system.
export async function createPunkinRenderer(){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
 renderer.setSize(256,256,false);
 renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.15;
 const scene=new THREE.Scene(),heading=new THREE.Group();scene.add(heading);
 scene.add(new THREE.HemisphereLight(0xe6dcff,0x433d27,2.0));
 const key=new THREE.DirectionalLight(0xffe5bd,3);key.position.set(-3,5,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0x9abbe0,1.3);rim.position.set(3,2,-3);scene.add(rim);
 const camera=new THREE.OrthographicCamera(-2.4,2.4,2.4,-2.4,.1,30);
 camera.position.set(0,5,7);camera.lookAt(0,.8,0);camera.updateMatrixWorld();
 let gltf;
 try{gltf=await new GLTFLoader().loadAsync(new URL('./assets/punkin.gltf',import.meta.url).href);}
 catch(error){renderer.dispose();throw error;}
 const model=gltf.scene;heading.add(model);
 if(!gltf.animations.length){renderer.dispose();throw new Error('Punkin walk animation is missing');}
 model.traverse(o=>{if(o.isMesh){o.frustumCulled=false;}});
 // glTF converts Blender +Y forward into -Z. Keep correction outside animation.
 model.updateMatrixWorld(true);
 const head=model.getObjectByName('head'),spine=model.getObjectByName('spine');
 if(!head||!spine){renderer.dispose();throw new Error('Punkin skeleton is incomplete');}
 const direction=head.getWorldPosition(new THREE.Vector3()).sub(spine.getWorldPosition(new THREE.Vector3()));
 const axisCorrection=new THREE.Group();heading.remove(model);heading.add(axisCorrection);axisCorrection.add(model);
 axisCorrection.rotation.y=Math.atan2(-direction.x,direction.z);
 const mixer=new THREE.AnimationMixer(model),action=mixer.clipAction(gltf.animations[0]);
 action.play();mixer.update(0);scene.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(model,true);
 if(bounds.max.y-bounds.min.y<1||bounds.max.y-bounds.min.y>3){renderer.dispose();throw new Error('Punkin model has an invalid scale');}
 axisCorrection.position.y=-bounds.min.y;
 const origin=new THREE.Vector3(0,0,0).project(camera);
 const anchor={x:(origin.x+1)/2,y:(1-origin.y)/2};
 let last=null,angle=0,targetAngle=0,speed=0,contextLost=false;
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;});
 function render(){renderer.render(scene,camera);}
 render();
 return {
  get available(){return !contextLost;},
  get angle(){return angle;},
  get time(){return action.time;},
  reset(p){last={x:p.x,y:p.y};speed=0;action.time=0;mixer.update(0);render();},
  update(dt,p,active){
   if(!last)last={x:p.x,y:p.y};
   const dx=p.x-last.x,dy=p.y-last.y,travel=Math.hypot(dx,dy);
   last={x:p.x,y:p.y};
   if(!active||dt<=0||contextLost)return;
   if(travel>.01)targetAngle=Math.atan2(dx,dy);
   const turn=Math.atan2(Math.sin(targetAngle-angle),Math.cos(targetAngle-angle));
   angle+=turn*(1-Math.exp(-12*dt));heading.rotation.y=angle;
   const measured=Math.min(300,travel/dt);
   speed+=(measured-speed)*(1-Math.exp(-12*dt));
   action.timeScale=speed<2?0:Math.min(3.4,speed/80);
   mixer.update(dt);render();
  },
  draw(ctx,p){const size=180;ctx.drawImage(renderer.domElement,p.x-anchor.x*size,p.y-anchor.y*size,size,size);},
  dispose(){mixer.stopAllAction();renderer.dispose();model.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of [].concat(o.material))m.dispose();}});}
 };
}
