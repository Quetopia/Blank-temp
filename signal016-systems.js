(function(){
'use strict';
const SAVE_KEY='quetopia_signal016_systems_v1';
const rarities=[{n:'COMMON',c:'#9fdcf0'},{n:'ENHANCED',c:'#a875ff'},{n:'RARE',c:'#ffd166'},{n:'RELIC',c:'#ff5ead'}];
const itemPool=['Veilglass Focus','Prism Lynx Claw','Iridescent Mycelium Band','Mantis Cortex','Ouroboros Coil','Cat-Eye Resonator','Fractal Staff Tip','Signal Filament','Dreamcap Sigil','Curator Bone Lens','Chromatic Fang','Astral Receiver Plate'];
let state={kills:0,points:1,lastLevel:1,items:[],nodes:{edge:0,ward:0,echo:0,hunter:0,phase:0,fortune:0}};
try{let s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s&&s.nodes)state=Object.assign(state,s,{nodes:Object.assign(state.nodes,s.nodes)})}catch(e){}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state))}catch(e){}}

const css=document.createElement('style');css.textContent=`
#qMenuShade{position:fixed;inset:0;z-index:40;background:rgba(1,1,6,.78);backdrop-filter:blur(8px);display:none;place-items:center;font-family:system-ui;pointer-events:auto}#qMenuShade.on{display:grid}
#qMenu{width:min(920px,90vw);height:min(650px,82vh);background:linear-gradient(155deg,#15101feF,#06060bf7 64%,#0c0814f7);border:1px solid #b08b4d;box-shadow:0 30px 110px #000,0 0 55px #713dff33,inset 0 1px 0 #ffe5aa22;display:grid;grid-template-rows:auto 1fr;overflow:hidden}
#qMenuHead{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #6d5736;background:linear-gradient(90deg,#191120,#0b0910);letter-spacing:.16em}.qBrand{font:800 19px Georgia,serif;color:#efd293;margin-right:auto}.qTab,.qClose{cursor:pointer;color:#d7c9ad;background:#100c16;border:1px solid #6f593a;padding:8px 12px;font:800 10px system-ui;letter-spacing:.12em}.qTab.on{color:#71eaff;border-color:#67c8d6;box-shadow:inset 0 0 15px #32bfff22}.qClose{color:#f0c7c7}
.qPage{display:none;overflow:auto;padding:22px}.qPage.on{display:block}.qSectionTitle{font:800 12px Georgia,serif;letter-spacing:.2em;color:#e6c678;margin-bottom:14px}.qMeta{font-size:10px;letter-spacing:.08em;color:#a99e8e}
#qInventoryGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:9px}.qItem{min-height:82px;padding:10px;border:1px solid #453852;background:linear-gradient(145deg,#191122,#09070d);box-shadow:inset 0 0 20px #0008;position:relative}.qItem b{display:block;font:800 10px system-ui;letter-spacing:.06em;margin-bottom:6px}.qItem small{font-size:9px;color:#a9a2af}.qItem:after{content:attr(data-rarity);position:absolute;right:7px;bottom:5px;font-size:7px;letter-spacing:.12em;color:currentColor;opacity:.8}.qEmpty{opacity:.23;border-style:dashed;display:grid;place-items:center;font-size:19px}
#qTree{position:relative;min-height:470px;border:1px solid #2e2638;background:radial-gradient(circle at 50% 50%,#171026,#08070d 55%,#040407);overflow:hidden}.qTreeRing{position:absolute;border:1px solid #614c7a55;border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%)}.qTreeRing.r1{width:180px;height:180px}.qTreeRing.r2{width:380px;height:380px}.qNode{position:absolute;width:116px;min-height:72px;transform:translate(-50%,-50%);border:1px solid #604a75;background:radial-gradient(circle at 50% 25%,#231635,#0a080f 72%);color:#cdbde0;cursor:pointer;padding:9px;text-align:center;box-shadow:0 8px 20px #000b}.qNode b{font:800 9px system-ui;letter-spacing:.09em;display:block;color:#e5d6bd}.qNode small{font:8px/1.35 system-ui;color:#9d93a8}.qNode .rank{margin-top:6px;font:800 9px system-ui;color:#6feaff}.qNode.max{border-color:#d4ac5c;box-shadow:0 0 22px #d7a44722,inset 0 0 18px #6a42ff19}.qNode:hover{border-color:#73deea}.treePoints{text-align:center;margin:0 0 12px;color:#74eaff;font:800 11px system-ui;letter-spacing:.15em}
#qPause{position:fixed;inset:0;z-index:45;background:radial-gradient(circle,#15101fe8,#020207f7 65%);display:none;place-items:center;pointer-events:auto;text-align:center}#qPause.on{display:grid}#qPause h1{font:900 44px Georgia,serif;letter-spacing:.18em;color:#efd59d;margin:0;text-shadow:0 0 35px #8d4cff77}#qPause p{font:10px system-ui;letter-spacing:.18em;color:#aaa0b4}.qResume{cursor:pointer;border:1px solid #b18b4e;background:#1c1224;color:#f2dba7;padding:12px 24px;font-weight:800;letter-spacing:.12em}
#qKeyHints{position:fixed;left:50%;bottom:142px;transform:translateX(-50%);z-index:8;pointer-events:none;font:700 8px system-ui;letter-spacing:.16em;color:#b9ad98;text-shadow:0 2px 4px #000;opacity:.78}
@media(max-width:760px){#qInventoryGrid{grid-template-columns:repeat(3,1fr)}#qMenu{height:88vh}.qNode{width:95px}.qTreeRing.r2{width:320px;height:320px}}
`;document.head.appendChild(css);

const shade=document.createElement('div');shade.id='qMenuShade';shade.innerHTML=`<div id="qMenu"><div id="qMenuHead"><div class="qBrand">QUETOPIA · RECEIVER</div><button class="qTab on" data-page="inv">INVENTORY [I]</button><button class="qTab" data-page="tree">PASSIVES [P]</button><button class="qClose">CLOSE [ESC]</button></div><div><section id="qInv" class="qPage on"><div class="qSectionTitle">SIGNAL CACHE</div><div class="qMeta" id="qInvMeta"></div><div id="qInventoryGrid"></div></section><section id="qTreePage" class="qPage"><div class="qSectionTitle">RECEIVER CONSTELLATION</div><div class="treePoints" id="qPoints"></div><div id="qTree"><div class="qTreeRing r1"></div><div class="qTreeRing r2"></div></div></section></div></div>`;document.body.appendChild(shade);
const pause=document.createElement('div');pause.id='qPause';pause.innerHTML='<div><h1>QUETOPIA</h1><p>THE SIGNAL IS HELD IN SUSPENSION</p><button class="qResume">RETURN TO THE GROVE</button></div>';document.body.appendChild(pause);
const hints=document.createElement('div');hints.id='qKeyHints';hints.textContent='I INVENTORY  ·  P PASSIVES  ·  M MAP  ·  ESC PAUSE';document.body.appendChild(hints);
const grid=document.getElementById('qInventoryGrid'),meta=document.getElementById('qInvMeta'),tree=document.getElementById('qTree'),pointsEl=document.getElementById('qPoints');
let panelOpen=false,paused=false,resumeRun=false,currentPage='inv';

const nodeDefs={
 edge:{name:'RESONANT EDGE',desc:'+10% spell damage / rank',max:3,x:50,y:18},
 ward:{name:'WARD SYNTHESIS',desc:'Recover shield on kills',max:3,x:21,y:39},
 echo:{name:'PRISM ECHO',desc:'Signal Shot can fork a bonus bolt',max:3,x:79,y:39},
 hunter:{name:'VEIL HUNTER',desc:'+12% damage to elites / rank',max:3,x:19,y:76},
 phase:{name:'PHASE CAPACITOR',desc:'Phase Step restores mana',max:3,x:81,y:76},
 fortune:{name:'FRACTAL FORTUNE',desc:'Improves relic drop chance',max:3,x:50,y:88}
};
function renderTree(){tree.querySelectorAll('.qNode').forEach(n=>n.remove());for(const [id,d] of Object.entries(nodeDefs)){let n=document.createElement('button');n.className='qNode'+(state.nodes[id]>=d.max?' max':'');n.style.left=d.x+'%';n.style.top=d.y+'%';n.dataset.id=id;n.innerHTML=`<b>${d.name}</b><small>${d.desc}</small><div class="rank">${state.nodes[id]}/${d.max}</div>`;n.onclick=()=>buyNode(id);tree.appendChild(n)}pointsEl.textContent='UNSPENT SIGNAL POINTS · '+state.points}
function buyNode(id){let d=nodeDefs[id];if(!d||state.points<=0||state.nodes[id]>=d.max)return;state.nodes[id]++;state.points--;save();renderTree();try{say(d.name+' · RECEIVER PATH STABILIZED')}catch(e){}}
function renderInventory(){grid.innerHTML='';let shown=state.items.slice(-20).reverse();for(let i=0;i<20;i++){let it=shown[i];if(!it){let d=document.createElement('div');d.className='qItem qEmpty';d.textContent='◇';grid.appendChild(d);continue}let d=document.createElement('div');d.className='qItem';d.style.color=rarities[it.r].c;d.dataset.rarity=rarities[it.r].n;d.innerHTML=`<b>${it.name}</b><small>${it.stat}</small>`;grid.appendChild(d)}meta.textContent=`${state.items.length} ARTIFACTS RECOVERED · ${state.kills} HOSTILES DISSOLVED · LOCAL RECEIVER SAVE ACTIVE`}
function showPage(p){currentPage=p;document.querySelectorAll('.qTab').forEach(b=>b.classList.toggle('on',b.dataset.page===p));document.getElementById('qInv').classList.toggle('on',p==='inv');document.getElementById('qTreePage').classList.toggle('on',p==='tree');if(p==='inv')renderInventory();else renderTree()}
function openPanel(p='inv'){if(panelOpen)return showPage(p);resumeRun=running;running=false;panelOpen=true;shade.classList.add('on');showPage(p)}
function closePanel(){if(!panelOpen)return;shade.classList.remove('on');panelOpen=false;if(resumeRun)running=true}
document.querySelectorAll('.qTab').forEach(b=>b.onclick=()=>showPage(b.dataset.page));document.querySelector('.qClose').onclick=closePanel;
function pauseGame(){if(panelOpen){closePanel();return}if(paused)return resumeGame();resumeRun=running;running=false;paused=true;pause.classList.add('on')}
function resumeGame(){pause.classList.remove('on');paused=false;if(resumeRun)running=true}
document.querySelector('.qResume').onclick=resumeGame;

function addItem(e){let bossy=e&&e.boss,elite=e&&e.proRank===2;let chance=bossy?1:.28+state.nodes.fortune*.09+(elite?.18:0);if(Math.random()>chance)return;let r=bossy?3:elite&&Math.random()>.3?2:Math.random()<(.10+state.nodes.fortune*.04)?2:Math.random()<.35?1:0;let name=bossy?'Eye of the Void Curator':itemPool[Math.floor(Math.random()*itemPool.length)];let stats=['+'+(4+r*4+Math.floor(Math.random()*5))+' Resonance','+'+(3+r*3+Math.floor(Math.random()*4))+' Ward','+'+(2+r*4+Math.floor(Math.random()*6))+' Prism Power','+'+(2+r*2+Math.floor(Math.random()*4))+' Phase Stability'];state.items.push({name,r,stat:stats[Math.floor(Math.random()*stats.length)],t:Date.now()});if(state.items.length>60)state.items=state.items.slice(-60);save();if(panelOpen&&currentPage==='inv')renderInventory()}

/* Multiplicative passives stack after the SIGNAL 016 polish multiplier. */
const prevHit=hitEnemy;hitEnemy=function(e,d){let m=1+state.nodes.edge*.10;if(e&&e.proRank===2)m*=1+state.nodes.hunter*.12;prevHit(e,d*m)};
const prevKill=killEnemy;killEnemy=function(e){if(!e||e.dead)return;let wasBoss=e.boss;prevKill(e);state.kills++;if(state.nodes.ward){shieldv=Math.min(50,shieldv+state.nodes.ward*(wasBoss?8:2.5))}addItem(e);save()};
const prevShot=signalShot;signalShot=function(){let can=fc<=0&&manav>=1;prevShot();if(can&&state.nodes.echo&&Math.random()<state.nodes.echo*.11){let d=aimDir().clone().applyAxisAngle(new THREE.Vector3(0,1,0),(Math.random()-.5)*.12);fire(d,16,18+state.nodes.echo*5,0x70eaff,.075,1.35)}};
const prevDash=dash;dash=function(){let can=dc<=0;prevDash();if(can&&state.nodes.phase){manav=Math.min(150,manav+state.nodes.phase*5);shieldv=Math.min(50,shieldv+state.nodes.phase*.8)}};

/* Map focus uses the existing minimap rather than building a separate navigation system. */
let mapBig=false;function toggleMap(){let mw=document.querySelector('.miniwrap');if(!mw)return;mapBig=!mapBig;mw.style.transition='.22s';if(mapBig){mw.style.position='fixed';mw.style.right='50%';mw.style.top='50%';mw.style.transform='translate(50%,-50%) scale(2.3)';mw.style.zIndex='30';mw.style.filter='drop-shadow(0 20px 45px #000)'}else{mw.style.position='absolute';mw.style.right='22px';mw.style.top='18px';mw.style.transform='';mw.style.zIndex='';mw.style.filter=''}}

addEventListener('keydown',e=>{if(e.repeat)return;let k=e.key.toLowerCase();if(k==='i'){e.preventDefault();openPanel('inv')}else if(k==='p'){e.preventDefault();openPanel('tree')}else if(k==='m'){e.preventDefault();toggleMap()}else if(e.key==='Escape'){e.preventDefault();pauseGame()}});

/* Watch the main progression HUD and grant a passive point each new receiver level. */
let lvlWatch=setInterval(()=>{let el=document.getElementById('proLvl');if(!el)return;let n=parseInt(el.textContent||'1',10)||1;if(n>state.lastLevel){state.points+=n-state.lastLevel;state.lastLevel=n;save();renderTree()}},600);
renderInventory();renderTree();
console.log('[QUETOPIA] SIGNAL 016 systems module active');
})();