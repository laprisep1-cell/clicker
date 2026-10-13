export const AURAS = [
  {id:'drift',name:'Drift',weight:1200,color:'#b7cbd0',kind:'sparks',tag:'A little magic goes a long way.'},
  {id:'mint',name:'Mint',weight:600,color:'#94e9ba',kind:'petals',tag:'A breeze from somewhere greener.'},
  {id:'ember',name:'Ember',weight:330,color:'#ff9a68',kind:'flame',tag:'A warm spark with a wild heart.'},
  {id:'tide',name:'Tide',weight:200,color:'#78c5ff',kind:'water',tag:'Carry a little ocean with you.'},
  {id:'bloom',name:'Bloom',weight:120,color:'#f4a2d2',kind:'petals',tag:'Even the stars stop to smell flowers.'},
  {id:'frost',name:'Frost',weight:72,color:'#b0efff',kind:'ice',tag:'Quiet as the first snowfall.'},
  {id:'glow',name:'Glow',weight:40,color:'#ffe6a0',kind:'rays',tag:'Your own small sunrise.'},
  {id:'storm',name:'Storm',weight:21,color:'#b0a5ff',kind:'lightning',tag:'The sky has something to say.'},
  {id:'prism',name:'Prism',weight:10,color:'#9cf4ed',kind:'orbit',tag:'One light. A thousand colors.'},
  {id:'orbit',name:'Orbit',weight:4,color:'#e4b4ff',kind:'orbit',tag:'A tiny world revolves around you.'},
  {id:'eclipse',name:'Eclipse',weight:1.8,color:'#faab81',kind:'void',tag:'Where daylight meets the unknown.'},
  {id:'nova',name:'Nova',weight:.65,color:'#ffb6cf',kind:'rays',tag:'A star is born.'},
  {id:'void',name:'Void',weight:.22,color:'#b2a3fd',kind:'void',tag:'Something beautiful beyond the dark.'},
  {id:'aurora',name:'Aurora',weight:.07,color:'#81ffd0',kind:'water',tag:'The whole sky, just for you.'},
  {id:'starlight',name:'Starlight',weight:.018,color:'#e0f1ff',kind:'rays',tag:'A wish that found its way home.'},
  {id:'crown',name:'Sky Crown',weight:.005,color:'#ffe081',kind:'crown',tag:'The valley remembers your name.'}
];
export const WEATHER = [
  {name:'Clear skies',icon:'☀',color:'#92bfbd',boost:['mint','bloom']},
  {name:'Rain',icon:'☂',color:'#759bbe',boost:['tide','storm']},
  {name:'Night',icon:'☾',color:'#a39cde',boost:['orbit','eclipse','void']},
  {name:'Starfall',icon:'✦',color:'#e1b6de',boost:['nova','aurora','starlight','crown']}
];
export const GEAR = [
  {name:'Clover charm',luck:1.5,speed:850,cost:80,copies:{drift:5},icon:'☘',desc:'A lucky little start.'},
  {name:'Spark glove',luck:2,speed:740,cost:250,copies:{mint:3,ember:2},icon:'✧',desc:'A brighter touch. Faster rolls.'},
  {name:'Star lens',luck:3,speed:630,cost:700,copies:{tide:3,frost:2},icon:'◈',desc:'See the rare light hiding in the sky.'},
  {name:'Moon compass',luck:4.5,speed:530,cost:1800,copies:{bloom:3,glow:2},icon:'☾',desc:'A path toward something extraordinary.'},
  {name:'Sky engine',luck:6,speed:440,cost:4500,copies:{storm:2,prism:2},icon:'✺',desc:'Your biggest luck boost yet.'}
];
export const GOALS = [
  {id:'first',name:'Hello, magic',desc:'Roll 10 times',target:10,value:s=>s.rolls,dust:30},
  {id:'auto',name:'Let it flow',desc:'Roll 25 times to unlock auto roll',target:25,value:s=>s.rolls,dust:50,potions:1},
  {id:'five',name:'A colorful start',desc:'Discover 5 different auras',target:5,value:s=>s.discovered.filter(Boolean).length,dust:80},
  {id:'craft',name:'Made by you',desc:'Craft your first gear',target:1,value:s=>s.gear,dust:100,potions:1},
  {id:'hundred',name:'Keep exploring',desc:'Roll 100 times',target:100,value:s=>s.rolls,dust:200,potions:2},
  {id:'storm',name:'A little thunder',desc:'Discover Storm or a rarer aura',target:1,value:s=>s.discovered.slice(7).some(Boolean)?1:0,dust:250},
  {id:'twelve',name:'A sky full of colors',desc:'Discover 12 different auras',target:12,value:s=>s.discovered.filter(Boolean).length,dust:600,potions:3},
  {id:'thousand',name:'Valley explorer',desc:'Roll 1,000 times',target:1000,value:s=>s.rolls,dust:1000,potions:5}
];
const index = id => AURAS.findIndex(a=>a.id===id);
const count = (v,max=1e9)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
export function fresh(){return {v:1,rolls:0,dust:0,inventory:AURAS.map(()=>0),discovered:AURAS.map(()=>false),equipped:null,gear:0,potions:2,boostRolls:0,claimed:[],best:null,sound:true};}
export function restore(raw){
  const s=fresh();if(!raw||typeof raw!=='object')return s;
  for(const key of ['rolls','dust','potions','boostRolls'])s[key]=count(raw[key],key==='boostRolls'?20:1e9);
  s.gear=count(raw.gear,GEAR.length);
  s.inventory=AURAS.map((_,i)=>count(raw.inventory?.[i]));
  s.discovered=AURAS.map((_,i)=>s.inventory[i]>0||raw.discovered?.[i]===true);
  s.equipped=AURAS.some((a,i)=>a.id===raw.equipped&&s.discovered[i])?raw.equipped:null;
  s.best=AURAS.filter((_,i)=>s.discovered[i]).at(-1)?.id||null;
  s.claimed=[...new Set(Array.isArray(raw.claimed)?raw.claimed.filter(id=>GOALS.some(g=>g.id===id)):[])];
  s.sound=raw.sound!==false;return s;
}
export const weather=s=>WEATHER[Math.floor(s.rolls/60)%WEATHER.length];
export const rollSpeed=s=>s.gear?GEAR[s.gear-1].speed:1000;
export const luck=(s,bonus=true)=>(s.gear?GEAR[s.gear-1].luck:1)*(s.boostRolls>0?2:1)*(bonus&&s.rolls%10===9?2:1);
export function probabilities(s,{base=false}={}){
  const l=base?1:luck(s), sky=base?null:weather(s);
  const weights=AURAS.map((a,i)=>a.weight*Math.pow(l,i/4)*(sky?.boost.includes(a.id)?1.6:1));
  const total=weights.reduce((a,b)=>a+b,0);return weights.map(w=>w/total);
}
export function roll(s,rng=Math.random){
  const chances=probabilities(s),r=Math.max(0,Math.min(.999999999999,Number(rng())||0));
  let sum=0,winner=AURAS.length-1;
  for(let i=0;i<chances.length;i++){sum+=chances[i];if(r<sum){winner=i;break;}}
  const aura=AURAS[winner],isNew=!s.discovered[winner];
  s.rolls++;s.inventory[winner]++;s.discovered[winner]=true;
  const earned=2+Math.floor(winner/2)+(isNew?winner*2:2);s.dust+=earned;
  if(s.boostRolls>0)s.boostRolls--;
  if(!s.best||winner>index(s.best))s.best=aura.id;
  if(!s.equipped||winner>index(s.equipped))s.equipped=aura.id;
  return {aura,index:winner,isNew,earned,chance:chances[winner]};
}
export function canCraft(s){
  const g=GEAR[s.gear];return !!g&&s.dust>=g.cost&&Object.entries(g.copies).every(([id,n])=>s.inventory[index(id)]>=n+1);
}
export function craft(s){
  if(!canCraft(s))return false;const g=GEAR[s.gear];s.dust-=g.cost;
  for(const [id,n]of Object.entries(g.copies))s.inventory[index(id)]-=n;
  s.gear++;return g;
}
export function brew(s){if(s.dust<60)return false;s.dust-=60;s.potions++;return true;}
export function drink(s){if(s.potions<1||s.boostRolls>0)return false;s.potions--;s.boostRolls=20;return true;}
export function equip(s,id){const i=index(id);if(i<0||!s.discovered[i])return false;s.equipped=id;return true;}
export function claim(s,id){const g=GOALS.find(x=>x.id===id);if(!g||s.claimed.includes(id)||g.value(s)<g.target)return false;s.claimed.push(id);s.dust+=g.dust;s.potions+=g.potions||0;return g;}
