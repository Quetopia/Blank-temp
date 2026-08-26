'use client'

import { useEffect, useRef, useState } from 'react'
import { rewardAudioMedley,rewardAudioOffsets } from './rewardAudio'

type Reward={title:string;sub:string;kind:'supernova'|'media'|'match'|'launch'|'save'|'location'|'connect'|'generic';id:number}
type Spark={x:number;y:number;id:number}
let ctx:AudioContext|null=null
let decoded:AudioBuffer|null=null
let loading:Promise<AudioBuffer|null>|null=null
let source:AudioBufferSourceNode|null=null

function getCtx(){if(typeof window==='undefined')return null;const AC=window.AudioContext||(window as any).webkitAudioContext;if(!AC)return null;if(!ctx)ctx=new AC();return ctx}
function loadAudio(){
 if(decoded)return Promise.resolve(decoded);if(loading)return loading
 const c=getCtx();if(!c)return Promise.resolve(null)
 loading=(async()=>{try{const b64=rewardAudioMedley.split(',')[1];const raw=atob(b64);const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);decoded=await c.decodeAudioData(bytes.buffer.slice(0));return decoded}catch(e){console.error('Quetopia audio decode failed',e);return null}})();return loading
}
async function playRewardSound(kind:Reward['kind']){
 try{const c=getCtx();if(!c)return false;if(c.state!=='running')await c.resume();const b=decoded||await loadAudio();if(!b)return false;try{source?.stop()}catch{};const s=c.createBufferSource(),g=c.createGain();s.buffer=b;g.gain.value=.95;s.connect(g);g.connect(c.destination);const start=Math.min(rewardAudioOffsets[kind]??0,Math.max(0,b.duration-.1));s.start(0,start,kind==='supernova'?2.6:1.7);source=s;return true}catch(e){console.error('Quetopia audio play failed',e);return false}
}
function rewardForText(text:string):Reward|null{const t=text.toLowerCase();if(t.includes('sync my ai')||t.includes('signal synchronized'))return{title:'YOUR AI IS ALIVE',sub:'SIGNAL SYNCHRONIZED',kind:'supernova',id:Date.now()};if(t.includes('youtube signal added')||t.includes('demo uploaded')||t.includes('added to your grid'))return{title:'SIGNAL DROPPED',sub:'YOUR CREATIVE GRID JUST GOT LOUDER',kind:'media',id:Date.now()};if(t.includes('scanned')||t.includes('network'))return{title:'ORBIT SCANNED',sub:'NEW SIGNALS ARE IN MOTION',kind:'match',id:Date.now()};if(t.includes('opportunity launched')||t.includes('launched into'))return{title:'PROJECT LAUNCHED',sub:'YOUR IDEA IS NOW BROADCASTING',kind:'launch',id:Date.now()};if(t.includes('profile')&&(t.includes('saved')||t.includes('updated')))return{title:'SIGNAL SHIFTED',sub:'YOUR PROFILE JUST EVOLVED',kind:'save',id:Date.now()};if(t.includes('location')||t.includes('locked in'))return{title:'RADAR LOCKED',sub:'YOUR LOCAL SIGNAL IS LIVE',kind:'location',id:Date.now()};if(t.includes('signal saved')||t.includes('connect'))return{title:'CONNECTION CHARGED',sub:'THE ORBIT JUST CHANGED',kind:'connect',id:Date.now()};if(t.includes('synced'))return{title:'SIGNAL SYNCHRONIZED',sub:'QUETOPIA KNOWS YOU BETTER NOW',kind:'supernova',id:Date.now()};return null}

export default function RewardLayer(){
 const[reward,setReward]=useState<Reward|null>(null),[sparks,setSparks]=useState<Spark[]>([]),[audioReady,setAudioReady]=useState(false);const last=useRef('')
 function fire(r:Reward,skipSound=false){if(last.current===r.title&&reward)return;last.current=r.title;setReward(r);if(!skipSound)void playRewardSound(r.kind);setTimeout(()=>setReward(null),r.kind==='supernova'?4400:3300)}
 async function unlock(){const c=getCtx();if(!c)return;try{await c.resume();const b=await loadAudio();setAudioReady(!!b)}catch{}}
 useEffect(()=>{
  void loadAudio().then(b=>setAudioReady(!!b&&getCtx()?.state==='running'))
  const click=(e:MouseEvent)=>{const target=(e.target as HTMLElement).closest('button,.uploadButton') as HTMLElement|null;if(!target)return;void unlock();const rect=target.getBoundingClientRect(),x=e.clientX||rect.left+rect.width/2,y=e.clientY||rect.top+rect.height/2,id=Date.now()+Math.random();setSparks(s=>[...s.slice(-5),{x,y,id}]);setTimeout(()=>setSparks(s=>s.filter(v=>v.id!==id)),720);const txt=(target.innerText||'').trim().toLowerCase();if(txt.includes('sync my ai')){void playRewardSound('supernova');fire({title:'YOUR AI IS ALIVE',sub:'SIGNAL SYNCHRONIZED',kind:'supernova',id:Date.now()},true)}}
  document.addEventListener('click',click,true)
  const observer=new MutationObserver(muts=>{for(const m of muts){for(const node of Array.from(m.addedNodes)){if(!(node instanceof HTMLElement))continue;const candidates=[node,...Array.from(node.querySelectorAll?.('.toast,.notice')||[]) as HTMLElement[]];for(const c of candidates){if(!c.matches?.('.toast,.notice')||c.classList.contains('bad'))continue;const r=rewardForText(c.textContent||'');if(r&&r.kind!=='supernova'){setTimeout(()=>fire(r),100);return}}}}});observer.observe(document.body,{childList:true,subtree:true});return()=>{document.removeEventListener('click',click,true);observer.disconnect();try{source?.stop()}catch{}}
 },[])
 return <>{!audioReady&&<button onClick={unlock} style={{position:'fixed',right:12,bottom:78,zIndex:99999,padding:'9px 12px',borderRadius:999,border:'1px solid #8ff',background:'#07131ddd',color:'#bff',fontWeight:800}}>🔊 ENABLE SOUND</button>}{sparks.map(s=><span key={s.id} className="tapSpark" style={{left:s.x,top:s.y}}><i/><i/><i/></span>)}{reward&&<div className={'rewardFx '+reward.kind} key={reward.id} aria-live="polite"><div className="rewardVoid"/><div className="rewardCore">Q</div>{Array.from({length:5}).map((_,i)=><i key={'r'+i} className={'rewardRing ring'+i}/>)}<div className="rewardRays">{Array.from({length:18}).map((_,i)=><b key={i} style={{transform:`rotate(${i*20}deg)`}}/>)}</div><div className="rewardStars">{Array.from({length:26}).map((_,i)=><em key={i} style={{['--a' as any]:`${i*137.5}deg`,['--d' as any]:`${90+(i%7)*28}px`,['--delay' as any]:`${(i%5)*.035}s`}}/>)}</div><div className="rewardCopy"><strong>{reward.title}</strong><span>{reward.sub}</span><small>QUETOPIA • SIGNAL LOCKED</small></div></div>}</>}
