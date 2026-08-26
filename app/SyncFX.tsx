'use client'

import { useEffect, useState } from 'react'

function playSyncAudio(){
 try{
  const AudioCtx=(window.AudioContext||(window as any).webkitAudioContext)
  if(!AudioCtx)return
  const ctx=new AudioCtx()
  const master=ctx.createGain();master.gain.setValueAtTime(.0001,ctx.currentTime);master.gain.exponentialRampToValueAtTime(.22,ctx.currentTime+.04);master.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+2.7);master.connect(ctx.destination)
  const now=ctx.currentTime
  ;[55,82.41,110,164.81,220,329.63,440].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=i<2?'sawtooth':'sine';o.frequency.setValueAtTime(f*.45,now);o.frequency.exponentialRampToValueAtTime(f*1.8,now+1.7+i*.08);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.08/(1+i*.18),now+.06+i*.035);g.gain.exponentialRampToValueAtTime(.0001,now+2.35);o.connect(g);g.connect(master);o.start(now);o.stop(now+2.5)})
  const buffer=ctx.createBuffer(1,ctx.sampleRate*.7,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3)
  const noise=ctx.createBufferSource(),ng=ctx.createGain(),filter=ctx.createBiquadFilter();noise.buffer=buffer;filter.type='bandpass';filter.frequency.setValueAtTime(180,now);filter.frequency.exponentialRampToValueAtTime(4200,now+.55);ng.gain.setValueAtTime(.18,now);ng.gain.exponentialRampToValueAtTime(.0001,now+.68);noise.connect(filter);filter.connect(ng);ng.connect(master);noise.start(now)
  setTimeout(()=>ctx.close().catch(()=>{}),3200)
 }catch{}
}

export default function SyncFX(){
 const [active,setActive]=useState(false)
 useEffect(()=>{
  const onClick=(ev:MouseEvent)=>{
   const el=(ev.target as HTMLElement)?.closest('button')
   if(!el||el.textContent?.trim()!=='SYNC MY AI')return
   playSyncAudio();setActive(false);requestAnimationFrame(()=>setActive(true));setTimeout(()=>setActive(false),3300)
  }
  document.addEventListener('click',onClick)
  return()=>document.removeEventListener('click',onClick)
 },[])
 if(!active)return null
 return <div className="syncSupernova" aria-hidden="true">
   <div className="syncFlash"/><div className="syncTunnel"/><div className="syncCore">Q</div>
   <div className="syncRings">{Array.from({length:7},(_,i)=><i key={i}/>)}</div>
   <div className="syncParticles">{Array.from({length:36},(_,i)=><b key={i} style={{'--i':i} as React.CSSProperties}/>)}</div>
   <div className="syncWords"><small>FIVE SIGNALS LOCKED</small><strong>YOUR AI<br/>IS ALIVE.</strong><span>✦ SIGNAL SYNCHRONIZED ✦</span></div>
 </div>
}
