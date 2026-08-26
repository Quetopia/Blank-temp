'use client'

import { useEffect, useRef, useState } from 'react'

type Reward={title:string;sub:string;kind:'supernova'|'media'|'match'|'launch'|'save'|'location'|'connect'|'generic';id:number}
type Spark={x:number;y:number;id:number}

function playRewardSound(kind:Reward['kind']){
 try{
  const AC=(window.AudioContext||(window as any).webkitAudioContext); if(!AC)return
  const ctx=new AC(); const now=ctx.currentTime
  const master=ctx.createGain(); master.gain.setValueAtTime(.0001,now); master.gain.exponentialRampToValueAtTime(kind==='supernova'?.22:.15,now+.05); master.gain.exponentialRampToValueAtTime(.0001,now+(kind==='supernova'?3.45:1.8)); master.connect(ctx.destination)
  const compressor=ctx.createDynamicsCompressor(); compressor.threshold.value=-18; compressor.knee.value=20; compressor.ratio.value=4; compressor.attack.value=.008; compressor.release.value=.35; compressor.connect(master)

  // warm sub impact instead of a short electronic beep
  const sub=ctx.createOscillator(),subGain=ctx.createGain(); sub.type='sine'; sub.frequency.setValueAtTime(kind==='supernova'?48:62,now); sub.frequency.exponentialRampToValueAtTime(31,now+.75); subGain.gain.setValueAtTime(.0001,now); subGain.gain.exponentialRampToValueAtTime(.34,now+.035); subGain.gain.exponentialRampToValueAtTime(.0001,now+1.15); sub.connect(subGain);subGain.connect(compressor);sub.start(now);sub.stop(now+1.2)

  // lush suspended chord / shimmer
  const chord=kind==='supernova'?[146.83,220,293.66,369.99,440]:kind==='media'?[110,164.81,220,293.66]:[123.47,185,246.94,311.13]
  chord.forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type=i<2?'sine':'triangle';o.frequency.setValueAtTime(freq,now);o.detune.value=(i-2)*4;f.type='lowpass';f.frequency.setValueAtTime(700,now);f.frequency.exponentialRampToValueAtTime(4200,now+1.25);g.gain.setValueAtTime(.0001,now+.12+i*.025);g.gain.exponentialRampToValueAtTime((kind==='supernova'?.065:.045)/(1+i*.12),now+.52+i*.035);g.gain.setValueAtTime((kind==='supernova'?.055:.04)/(1+i*.12),now+1.35);g.gain.exponentialRampToValueAtTime(.0001,now+(kind==='supernova'?3.2:1.7));o.connect(f);f.connect(g);g.connect(compressor);o.start(now+.08);o.stop(now+(kind==='supernova'?3.3:1.8))})

  // filtered noise riser + soft impact gives the visual explosion some body
  const dur=kind==='supernova'?1.45:.8,len=Math.floor(ctx.sampleRate*dur),buffer=ctx.createBuffer(1,len,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*Math.pow(i/len,.7);const noise=ctx.createBufferSource(),ng=ctx.createGain(),filter=ctx.createBiquadFilter();noise.buffer=buffer;filter.type='bandpass';filter.Q.value=.7;filter.frequency.setValueAtTime(280,now);filter.frequency.exponentialRampToValueAtTime(5200,now+dur);ng.gain.setValueAtTime(.0001,now);ng.gain.exponentialRampToValueAtTime(kind==='supernova'?.12:.075,now+dur*.8);ng.gain.exponentialRampToValueAtTime(.0001,now+dur+.18);noise.connect(filter);filter.connect(ng);ng.connect(compressor);noise.start(now);noise.stop(now+dur+.2)

  // small glassy constellation at the end of the supernova
  if(kind==='supernova'){
   ;[659.25,783.99,987.77,1174.66].forEach((freq,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=freq;const st=now+1.18+i*.18;g.gain.setValueAtTime(.0001,st);g.gain.exponentialRampToValueAtTime(.055,st+.025);g.gain.exponentialRampToValueAtTime(.0001,st+.65);o.connect(g);g.connect(compressor);o.start(st);o.stop(st+.7)})
  }
  setTimeout(()=>ctx.close(),kind==='supernova'?3900:2100)
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
 function fire(r:Reward){if(last.current===r.title&&reward)return;last.current=r.title;setReward(r);playRewardSound(r.kind);setTimeout(()=>setReward(null),r.kind==='supernova'?3900:2400)}
 useEffect(()=>{
  const click=(e:MouseEvent)=>{const target=(e.target as HTMLElement).closest('button,.uploadButton') as HTMLElement|null;if(!target)return;const rect=target.getBoundingClientRect(),x=e.clientX||rect.left+rect.width/2,y=e.clientY||rect.top+rect.height/2,id=Date.now()+Math.random();setSparks(s=>[...s.slice(-5),{x,y,id}]);setTimeout(()=>setSparks(s=>s.filter(v=>v.id!==id)),720);const txt=(target.innerText||'').trim().toLowerCase();if(txt.includes('sync my ai'))setTimeout(()=>fire({title:'YOUR AI IS ALIVE',sub:'SIGNAL SYNCHRONIZED',kind:'supernova',id:Date.now()}),90)}
  document.addEventListener('click',click,true)
  const observer=new MutationObserver(muts=>{for(const m of muts){for(const node of Array.from(m.addedNodes)){if(!(node instanceof HTMLElement))continue;const candidates=[node,...Array.from(node.querySelectorAll?.('.toast,.notice')||[]) as HTMLElement[]];for(const c of candidates){if(!c.matches?.('.toast,.notice'))continue;if(c.classList.contains('bad'))continue;const r=rewardForText(c.textContent||'');if(r){setTimeout(()=>fire(r),160);return}}}}})
  observer.observe(document.body,{childList:true,subtree:true})
  return()=>{document.removeEventListener('click',click,true);observer.disconnect()}
 },[])
 return <>{sparks.map(s=><span key={s.id} className="tapSpark" style={{left:s.x,top:s.y}}><i/><i/><i/></span>)}{reward&&<div className={'rewardFx '+reward.kind} key={reward.id} aria-live="polite"><div className="rewardVoid"/><div className="rewardCore">Q</div>{Array.from({length:5}).map((_,i)=><i key={'r'+i} className={'rewardRing ring'+i}/>)}<div className="rewardRays">{Array.from({length:18}).map((_,i)=><b key={i} style={{transform:`rotate(${i*20}deg)`}}/>)}</div><div className="rewardStars">{Array.from({length:26}).map((_,i)=><em key={i} style={{['--a' as any]:`${i*137.5}deg`,['--d' as any]:`${90+(i%7)*28}px`,['--delay' as any]:`${(i%5)*.035}s`}}/>)}</div><div className="rewardCopy"><strong>{reward.title}</strong><span>{reward.sub}</span></div></div>}</>
}
