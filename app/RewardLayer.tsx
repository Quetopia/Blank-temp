'use client'

import { useEffect, useRef, useState } from 'react'

type Reward={title:string;sub:string;kind:'supernova'|'media'|'match'|'launch'|'save'|'location'|'connect'|'generic';id:number}
type Spark={x:number;y:number;id:number}

function playRewardSound(kind:Reward['kind']){
 try{
  const AC=(window.AudioContext||(window as any).webkitAudioContext); if(!AC)return
  const ctx=new AC(); const now=ctx.currentTime; const master=ctx.createGain(); master.gain.setValueAtTime(.0001,now); master.gain.exponentialRampToValueAtTime(.18,now+.035); master.gain.exponentialRampToValueAtTime(.0001,now+1.15); master.connect(ctx.destination)
  const base=kind==='media'?110:kind==='match'?138:kind==='location'?165:kind==='supernova'?82:123
  ;[1,1.5,2,3].forEach((mult,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=i%2?'triangle':'sine';o.frequency.setValueAtTime(base*mult,now);o.frequency.exponentialRampToValueAtTime(base*mult*(kind==='supernova'?5.5:3.2),now+.72);g.gain.setValueAtTime(.0001,now+i*.025);g.gain.exponentialRampToValueAtTime(.11/(i+1),now+.07+i*.025);g.gain.exponentialRampToValueAtTime(.0001,now+.9);o.connect(g);g.connect(master);o.start(now+i*.018);o.stop(now+1)});
  const len=Math.floor(ctx.sampleRate*.24),buffer=ctx.createBuffer(1,len,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);const noise=ctx.createBufferSource(),ng=ctx.createGain(),filter=ctx.createBiquadFilter();noise.buffer=buffer;filter.type='bandpass';filter.frequency.value=kind==='supernova'?1200:1900;filter.Q.value=.8;ng.gain.setValueAtTime(.0001,now+.48);ng.gain.exponentialRampToValueAtTime(kind==='supernova'?.32:.18,now+.53);ng.gain.exponentialRampToValueAtTime(.0001,now+.82);noise.connect(filter);filter.connect(ng);ng.connect(master);noise.start(now+.48);noise.stop(now+.85)
  setTimeout(()=>ctx.close(),1500)
 }catch{}
}

function rewardForText(text:string):Reward|null{
 const t=text.toLowerCase()
 if(t.includes('sync my ai')||t.includes('signal synchronized'))return {title:'YOUR AI IS ALIVE',sub:'SIGNAL SYNCHRONIZED',kind:'supernova',id:Date.now()}
 if(t.includes('youtube signal added')||t.includes('demo uploaded')||t.includes('added to your grid'))return {title:'SIGNAL DROPPED',sub:'YOUR CREATIVE GRID JUST GOT LOUDER',kind:'media',id:Date.now()}
 if(t.includes('scanned')||t.includes('network'))return {title:'ORBIT SCANNED',sub:'NEW SIGNALS ARE IN MOTION',kind:'match',id:Date.now()}
 if(t.includes('opportunity launched')||t.includes('launched into'))return {title:'PROJECT LAUNCHED',sub:'YOUR IDEA IS NOW BROADCASTING',kind:'launch',id:Date.now()}
 if(t.includes('profile')&&(t.includes('saved')||t.includes('updated')))return {title:'SIGNAL SHIFTED',sub:'YOUR PROFILE JUST EVOLVED',kind:'save',id:Date.now()}
 if(t.includes('location')||t.includes('locked in'))return {title:'RADAR LOCKED',sub:'YOUR LOCAL SIGNAL IS LIVE',kind:'location',id:Date.now()}
 if(t.includes('signal saved')||t.includes('connect'))return {title:'CONNECTION CHARGED',sub:'THE ORBIT JUST CHANGED',kind:'connect',id:Date.now()}
 if(t.includes('synced'))return {title:'SIGNAL SYNCHRONIZED',sub:'QUETOPIA KNOWS YOU BETTER NOW',kind:'supernova',id:Date.now()}
 return null
}

export default function RewardLayer(){
 const [reward,setReward]=useState<Reward|null>(null),[sparks,setSparks]=useState<Spark[]>([]);const last=useRef('')
 function fire(r:Reward){if(last.current===r.title&&reward)return;last.current=r.title;setReward(r);playRewardSound(r.kind);setTimeout(()=>setReward(null),1900)}
 useEffect(()=>{
  const click=(e:MouseEvent)=>{const target=(e.target as HTMLElement).closest('button,.uploadButton') as HTMLElement|null;if(!target)return;const rect=target.getBoundingClientRect(),x=e.clientX||rect.left+rect.width/2,y=e.clientY||rect.top+rect.height/2,id=Date.now()+Math.random();setSparks(s=>[...s.slice(-5),{x,y,id}]);setTimeout(()=>setSparks(s=>s.filter(v=>v.id!==id)),720);const txt=(target.innerText||'').trim().toLowerCase();if(txt.includes('sync my ai'))setTimeout(()=>fire({title:'YOUR AI IS ALIVE',sub:'SIGNAL SYNCHRONIZED',kind:'supernova',id:Date.now()}),90)}
  document.addEventListener('click',click,true)
  const observer=new MutationObserver(muts=>{for(const m of muts){for(const node of Array.from(m.addedNodes)){if(!(node instanceof HTMLElement))continue;const candidates=[node,...Array.from(node.querySelectorAll?.('.toast,.notice')||[]) as HTMLElement[]];for(const c of candidates){if(!c.matches?.('.toast,.notice'))continue;if(c.classList.contains('bad'))continue;const r=rewardForText(c.textContent||'');if(r){setTimeout(()=>fire(r),160);return}}}}})
  observer.observe(document.body,{childList:true,subtree:true})
  return()=>{document.removeEventListener('click',click,true);observer.disconnect()}
 },[])
 return <>{sparks.map(s=><span key={s.id} className="tapSpark" style={{left:s.x,top:s.y}}><i/><i/><i/></span>)}{reward&&<div className={'rewardFx '+reward.kind} key={reward.id} aria-live="polite"><div className="rewardVoid"/><div className="rewardCore">Q</div>{Array.from({length:5}).map((_,i)=><i key={'r'+i} className={'rewardRing ring'+i}/>)}<div className="rewardRays">{Array.from({length:18}).map((_,i)=><b key={i} style={{transform:`rotate(${i*20}deg)`}}/>)}</div><div className="rewardStars">{Array.from({length:26}).map((_,i)=><em key={i} style={{['--a' as any]:`${i*137.5}deg`,['--d' as any]:`${90+(i%7)*28}px`,['--delay' as any]:`${(i%5)*.035}s`}}/>)}</div><div className="rewardCopy"><strong>{reward.title}</strong><span>{reward.sub}</span></div></div>}</>
}
