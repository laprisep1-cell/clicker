import {Capacitor,SystemBars,SystemBarsStyle} from '@capacitor/core';
import * as E from './engine.js';
import {createScene} from './scene.js';
const $=id=>document.getElementById(id),KEY='aura-vale-save-v1';
let state;try{state=E.restore(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{state=E.fresh();}
let busy=false,auto=false,panel='auras',lastRollAt=0,lastResult=null,toastTimer,revealTimer,panelSig='',audio,search='',filter='all';
const number=n=>n>=1e12?(n/1e12).toFixed(1)+'T':n>=1e9?(n/1e9).toFixed(1)+'B':n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(n<1e4?1:0)+'K':Math.floor(n).toLocaleString('en-US');
const baseChances=E.probabilities(E.fresh(),{base:true});
const odds=i=>{const n=1/baseChances[i];return '1 in '+(n<10?n.toFixed(1):number(Math.round(n)));};
const glyph=['✧','❋','♨','≋','✿','❄','☀','ϟ','◈','◎','◐','✹','●','≋','✦','♛'];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('Storage is full. Your progress may not save.');}};
const scene=createScene($('world'),()=>state);
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3000);}
function sound(i=0){if(!state.sound)return;try{audio||=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(250+i*37,audio.currentTime);oscillator.frequency.exponentialRampToValueAtTime(400+i*41,audio.currentTime+.12);gain.gain.setValueAtTime(.07,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.28);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+.3);}catch{}}
function set(id,text){if($(id).textContent!==String(text))$(id).textContent=text;}
function clearReveal(){clearTimeout(revealTimer);$('reveal').classList.remove('show');$('reveal').replaceChildren();}
function render(){
  set('dust',number(state.dust));set('rolls',number(state.rolls));set('luck','×'+(E.luck(state,false)>=100?number(E.luck(state,false)):E.luck(state,false).toFixed(1)));set('potions',state.potions);
  const sky=E.weather(state);set('weather',sky.icon+' '+sky.name);set('weather-next',(60-state.rolls%60)+' rolls until the weather changes');
  const aura=E.AURAS.find(a=>a.id===state.equipped),ai=E.AURAS.indexOf(aura);
  set('equipped-name',aura?.name||'A little magic awaits.');$('equipped-name').style.color=aura?.color||'#f7fff5';set('equipped-odds',aura?odds(ai)+' · '+aura.tag:'Roll to discover your first aura');
  set('found-count',state.discovered.filter(Boolean).length+'/'+E.AURAS.length);
  $('bonus-dots').innerHTML=Array.from({length:10},(_,i)=>'<i class="'+(i<state.rolls%10?'on':'')+'"></i>').join('');
  set('bonus-label',state.rolls%10===9?'Next roll: ×2 luck!':'A luck boost every 10 rolls');
  $('auto').disabled=state.rolls<25;$('auto').classList.toggle('active',auto);set('auto-label',state.rolls<25?'AUTO · 25 ROLLS':auto?'AUTO · ON':'AUTO · OFF');
  $('potion').disabled=state.potions===0||state.boostRolls>0;set('boost-note',state.boostRolls>0?'×2 luck active · '+state.boostRolls+' rolls left':'Free rolls. Every discovery is yours to keep.');
  $('goal-dot').hidden=!E.GOALS.some(g=>!state.claimed.includes(g.id)&&g.value(state)>=g.target);
  $('roll').disabled=busy;$('roll').innerHTML=busy?'✧ &nbsp; DISCOVERING…':'<span aria-hidden="true">✧</span> ROLL AURA <kbd>SPACE</kbd>';
  renderPanel();
}
function renderPanel(){
  const signature=JSON.stringify([panel,state.inventory,state.equipped,state.discovered,state.gear,state.activeGear,state.potions,state.dust,state.rolls,state.claimed,search,filter]);if(signature===panelSig)return;panelSig=signature;
  $('collection-tools').hidden=panel!=='auras';
  let html='';
  if(panel==='auras'){
    const found=state.discovered.filter(Boolean).length;
    html=`<div class="panel-heading"><h2>Your collection</h2><span>${found} / ${E.AURAS.length} discovered</span></div><p class="panel-intro">A little luck. A new color. A story to keep.<br>Choose a discovered aura to wear it.</p><div class="aura-grid">`;
    const matches=E.AURAS.map((a,i)=>({a,i})).filter(({a,i})=>a.name.toLowerCase().includes(search.toLowerCase())&&(filter==='all'||(filter==='found'?state.discovered[i]:!state.discovered[i])));
    if(!matches.length)html+='<p class="panel-intro">No auras match. Try another name or filter.</p>';
    html+=matches.map(({a,i})=>`<button class="aura-card ${state.discovered[i]?'':'locked'} ${a.id===state.equipped?'selected':''}" style="--aura:${a.color}" data-equip="${a.id}" ${state.discovered[i]?'':'disabled'} aria-label="${state.discovered[i]?'Wear '+a.name:a.name+' not discovered'}">${state.inventory[i]>1?`<span class="copies">×${number(state.inventory[i])}</span>`:''}${a.id===state.equipped?'<span class="wear">WEARING</span>':''}<span class="glyph" aria-hidden="true">${state.discovered[i]?glyph[i%glyph.length]:'◇'}</span><h3>${a.name}</h3><small>${odds(i)}</small></button>`).join('');
    html+='</div><p class="odds-note">Shown odds are rounded, for a normal roll without boosts or weather bonuses. Gear, potions, bonus rolls, and weather can improve your chances.</p>';
  }else if(panel==='gear'){
    const next=E.GEAR[state.gear];html='<div class="panel-heading"><h2>Make your own luck</h2><span>'+state.gear+' / '+E.GEAR.length+'</span></div><p class="panel-intro">Use dust and extra aura copies to craft gear. You always keep one copy of each aura.</p>';
    if(next){html+=`<article class="gear-card"><div class="gear-icon">${next.icon}</div><h3>${next.name}</h3><p>${next.desc}</p><div class="gear-stats"><span>×${next.luck} luck</span><span>${next.speed/1000}s per roll</span></div><div class="ingredients">${next.minRolls?`<div class="${state.rolls>=next.minRolls?'enough':''}"><span>Total rolls</span><span>${number(state.rolls)} / ${number(next.minRolls)}</span></div>`:''}<div class="${state.dust>=next.cost?'enough':''}"><span>Dust</span><span>${number(state.dust)} / ${number(next.cost)}</span></div>${Object.entries(next.copies).map(([id,n])=>{const i=E.AURAS.findIndex(a=>a.id===id),extra=Math.max(0,state.inventory[i]-1);return `<div class="${extra>=n?'enough':''}"><span>Extra ${E.AURAS[i].name} copies</span><span>${number(extra)} / ${n}</span></div>`;}).join('')}</div><button class="primary" data-craft ${E.canCraft(state)?'':'disabled'}>Craft ${next.name}</button></article>`;}else html+='<article class="gear-card"><div class="gear-icon">✺</div><h3>Firstlight engine complete</h3><p>Your gear is fully upgraded. Keep exploring for your rarest aura yet.</p></article>';
    html+='<div class="brew"><div><h3>Luck potion · ×2 luck</h3><p>Lasts for 20 rolls. You have '+state.potions+'.</p></div><button class="subtle-button" data-brew '+(state.dust>=60?'':'disabled')+'>Brew · 60 dust</button></div>';
    if(state.gear)html+='<label class="gear-choice">Use crafted gear<select id="gear-choice"><option value="0" '+(state.activeGear===0?'selected':'')+'>No gear · ×1 luck</option>'+E.GEAR.slice(0,state.gear).map((g,i)=>'<option value="'+(i+1)+'" '+(state.activeGear===i+1?'selected':'')+'>'+g.name+' · ×'+g.luck+'</option>').join('')+'</select></label><p class="odds-note">Use lower luck to find more common auras.</p><div class="crafted-list">'+E.GEAR.slice(0,state.gear).map(g=>'✓ '+g.name).join('<br>')+'</div>';
  }else{
    html='<div class="panel-heading"><h2>A reason to keep exploring</h2><span>'+state.claimed.length+' / '+E.GOALS.length+'</span></div><p class="panel-intro">Play at your own pace. Claim dust and potions when you complete a goal.</p>';
    html+=E.GOALS.map(g=>{const v=g.value(state),done=state.claimed.includes(g.id),ready=v>=g.target;return `<article class="goal-card ${done?'done':''}"><div class="goal-top"><h3>${g.name}</h3><span>${done?'✓':'✧'}</span></div><p>${g.desc}</p><div class="progress"><span style="width:${Math.min(100,v/g.target*100)}%"></span></div><small>${number(Math.min(v,g.target))} / ${number(g.target)}</small><div class="goal-reward">✦ ${g.dust} dust${g.potions?' · '+g.potions+' potion'+(g.potions>1?'s':''):''}</div>${done?'<small>Reward collected</small>':`<button class="primary" data-claim="${g.id}" ${ready?'':'disabled'}>${ready?'Claim reward':'Keep exploring'}</button>`}</article>`;}).join('');
  }
  $('panel-content').innerHTML=html;
}
function startRoll(){
  if(busy||document.hidden||$('settings-dialog').open)return false;
  busy=true;lastRollAt=performance.now();scene.setRolling(true);clearReveal();
  const result=E.roll(state);lastResult=result;save();render();
  setTimeout(()=>{
    busy=false;scene.setRolling(false);sound(result.index);render();
    if(result.isNew||result.index>=7){const r=$('reveal');r.style.setProperty('--aura',result.aura.color);r.innerHTML=`<strong>${result.aura.name}</strong><small>${result.isNew?'NEW DISCOVERY':'RARE FIND'} · ${odds(result.index)}</small>`;if(!document.body.classList.contains('panel-view'))r.classList.add('show');revealTimer=setTimeout(clearReveal,1700);}
    if(state.rolls===25)toast('Auto roll unlocked. Let the magic come to you.');
  },E.rollSpeed(state));return true;
}
$('roll').onclick=startRoll;$('auto').onclick=()=>{if(state.rolls<25)return;auto=!auto;render();sound(2);};
$('potion').onclick=()=>{if(E.drink(state)){save();render();sound(4);toast('×2 luck for your next 20 rolls.');}};
setInterval(()=>{if(auto&&!busy&&!document.hidden&&!$('settings-dialog').open&&performance.now()-lastRollAt>=E.rollSpeed(state)+100)startRoll();},100);
function choosePanel(value,mobile=false){panel=value==='roll'?'auras':value;panelSig='';clearReveal();if(mobile){document.body.classList.toggle('panel-view',value!=='roll');document.querySelectorAll('[data-screen]').forEach(b=>b.classList.toggle('selected',b.dataset.screen===value));}document.querySelectorAll('[data-panel]').forEach(b=>{const selected=b.dataset.panel===panel;b.classList.toggle('selected',selected);b.setAttribute('aria-selected',String(selected));});$('panel-content').scrollTop=0;renderPanel();scene.resize();}
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>choosePanel(b.dataset.panel));document.querySelectorAll('[data-screen]').forEach(b=>b.onclick=()=>choosePanel(b.dataset.screen,true));
$('aura-search').oninput=e=>{search=e.target.value;panelSig='';renderPanel();};$('aura-filter').onchange=e=>{filter=e.target.value;panelSig='';renderPanel();};$('panel-content').onchange=e=>{if(e.target.id==='gear-choice'&&E.useGear(state,Number(e.target.value))){save();render();}};
$('panel-content').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.equip){if(E.equip(state,b.dataset.equip)){sound(2);toast('Wearing '+E.AURAS.find(a=>a.id===b.dataset.equip).name);}}else if(b.hasAttribute('data-craft')){const gear=E.craft(state);if(gear){sound(9);toast(gear.name+' crafted. Your luck just grew.');}}else if(b.hasAttribute('data-brew')){if(E.brew(state)){sound(4);toast('One luck potion brewed.');}}else if(b.dataset.claim){const goal=E.claim(state,b.dataset.claim);if(goal){sound(8);toast('Goal complete! +'+goal.dust+' dust');}}save();render();};
$('settings').onclick=()=>{set('sound-toggle','Sound: '+(state.sound?'on':'off'));set('auto-equip-toggle','Wear best aura: '+(state.autoEquip?'on':'off'));$('settings-dialog').showModal();};$('close-settings').onclick=()=>$('settings-dialog').close();$('sound-toggle').onclick=()=>{state.sound=!state.sound;save();set('sound-toggle','Sound: '+(state.sound?'on':'off'));sound(3);};
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat&&!['BUTTON','INPUT','TEXTAREA'].includes(e.target.tagName)&&!$('settings-dialog').open){e.preventDefault();startRoll();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();clearReveal();}});window.addEventListener('pagehide',save);
if(Capacitor.getPlatform()==='android')SystemBars.setStyle({style:SystemBarsStyle.Dark}).catch(()=>{});
window.AuraVale={get state(){return state;},roll:startRoll,render,choosePanel,get busy(){return busy;},get auto(){return auto;},get lastResult(){return lastResult;}};
render();save();

$('auto-equip-toggle').onclick=()=>{state.autoEquip=!state.autoEquip;if(state.autoEquip&&state.best)state.equipped=state.best;save();render();set('auto-equip-toggle','Wear best aura: '+(state.autoEquip?'on':'off'));};
