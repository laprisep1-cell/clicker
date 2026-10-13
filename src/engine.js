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
const extraSets = [
  {color:'#c2e997', names:['Fernlight','Honeydew','Willow','Firefly','Jade','Roseglass','Sunroot','Wildsong','Rainpetal','Mossheart','Citrine','Springveil','Verdant','Faewing','Gardenstar','Worldtree'], kinds:['petals','sparks','petals','sparks','ice','orbit','rays','water','petals','orbit','rays','water','petals','crown','rays','crown'], tags:['A forest lantern after sunset.','Morning dew that never fades.','The calm beneath a willow tree.','A thousand tiny lights guide you.','A gem shaped by the valley.','A rose reflected in crystal.','Warmth runs through every root.','A melody carried by the breeze.','Every raindrop carries a flower.','The oldest tree shares its light.','A sunny stone with a gentle glow.','Spring dances around your shoulders.','Wherever you stand, life follows.','Wings from an unseen garden.','A flower that grew among stars.','The forest reaches beyond the sky.']},
  {color:'#8acbff', names:['Seaglass','Riverstone','Bluehour','Coral','Whirlpool','Monsoon','Icebell','Snowdrift','Thunderbird','Cloudbreaker','Deepsea','Polarflare','Tempest','Tsunami','Skywhale','Oceanheart'], kinds:['ice','water','rays','petals','orbit','water','ice','ice','lightning','rays','void','rays','lightning','water','orbit','crown'], tags:['An ocean memory in your hands.','A stream that follows your footsteps.','The moment before daylight arrives.','Colors from a hidden reef.','A small sea turns around you.','The rain finally found its rhythm.','Cold air rings like a tiny bell.','Snowflakes pause just for you.','A flash with feathered wings.','The clouds open wherever you go.','A soft glow from far below.','The north lights up around you.','The wind has chosen its explorer.','The whole ocean answers your call.','A gentle giant swims among clouds.','The sea keeps its brightest light here.']},
  {color:'#d9a9ff', names:['Dreamdust','Moondrop','Purplehaze','Nightbloom','Lunarhalo','Spellbound','Ghostlight','Mirrorworld','Nebulace','Gravity','Starbridge','Timekeeper','Astral','Darkmatter','Dreamweaver','Moonthrone'], kinds:['sparks','water','void','petals','orbit','rays','flame','ice','water','orbit','rays','crown','orbit','void','petals','crown'], tags:['A pocket full of sleepy stars.','One quiet drop from the moon.','The evening becomes a little stranger.','A flower that only opens at night.','A circle of moonlight follows you.','The valley has learned your name.','A lantern from a friendly ghost.','The sky reflects another sky.','A cloud of distant color.','Even stones want to float nearby.','A path between two bright stars.','A moment that belongs only to you.','Your footsteps cross the night sky.','Something shines inside the darkness.','You bring a dream into daylight.','The moon leaves you its silver seat.']},
  {color:'#ffe3a5', names:['Sunshard','Goldmist','Comettail','Solstice','Starforge','Cosmicflare','Radiant','Supernova','Eventide','Infinity','Galaxyheart','Skykeeper','Dawnbringer','Everlight','Celestial','Firstlight'], kinds:['ice','sparks','flame','rays','crown','flame','rays','orbit','water','orbit','void','crown','rays','rays','crown','rays'], tags:['A piece of sunrise that stayed.','Golden air, soft as a cloud.','A comet left you its brightest trail.','The longest day finds its glow.','A star learns its shape around you.','A flame that never feels too hot.','The valley brightens with every step.','A distant star shares its final color.','Day and night meet at your feet.','A circle with no beginning or end.','A thousand stars beat together.','The sky trusts you with its light.','Morning arrives wherever you walk.','A glow that has forgotten to fade.','The whole valley looks up to you.','The first spark of a brand-new sky.']}
];
const hueColor=h=>{const a=.66*Math.min(.76,1-.76);const f=n=>{const k=(n+h/30)%12;return Math.round(255*(.76-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0');};return '#'+f(0)+f(8)+f(4);};
for(const [group,set] of extraSets.entries())set.names.forEach((name,j)=>{
  const i=group*16+j,hue=(group===3?320+j*7:100+group*75+j*5)%360;
  const color=hueColor(hue);
  AURAS.push({id:name.toLowerCase().replaceAll(' ',''),name,weight:.005*Math.pow(.8,i+1),color,kind:set.kinds[j],tag:set.tags[j],variant:group+1});
});
export const WEATHER = [
  {name:'Clear skies',icon:'☀',color:'#92bfbd',boost:['mint','bloom']},
  {name:'Rain',icon:'☂',color:'#759bbe',boost:['tide','storm']},
  {name:'Night',icon:'☾',color:'#a39cde',boost:['orbit','eclipse','void']},
  {name:'Starfall',icon:'✦',color:'#e1b6de',boost:['nova','aurora','starlight','crown']}
];
const skyExtras = [
 ['Mist','☁',['fernlight','willow']],['Dawn','☀',['honeydew','sunroot']],['Dusk','◐',['roseglass','bluehour']],['Snow','❄',['icebell','snowdrift']],
 ['Thunder','ϟ',['thunderbird','tempest']],['Flowerfall','✿',['rainpetal','springveil']],['Gold rain','✧',['citrine','goldmist']],['Moonrise','☾',['moondrop','lunarhalo']],
 ['Sea breeze','≋',['seaglass','coral']],['Violet sky','✦',['purplehaze','spellbound']],['Deep water','◎',['deepsea','oceanheart']],['Solar wind','☀',['sunshard','solstice']],
 ['Crystal rain','◈',['mirrorworld','polarflare']],['Dark sky','●',['darkmatter','galaxyheart']],['Rainbow','❋',['faewing','dreamweaver']],['First dawn','✺',['celestial','firstlight']]
];
for(const [name,icon,boost]of skyExtras)WEATHER.push({name,icon,color:'#b9d5ec',boost});
const skyColors=[['#93c7c8','#cae6ce'],['#718fab','#9bbac1'],['#36365e','#78718f'],['#66749f','#c7b8c8'],['#a4b9bc','#cedcdb'],['#c1aaa9','#efd1ae'],['#756786','#c5a8b6'],['#a1bfcd','#deeff1'],['#505f82','#8298b4'],['#b5babc','#e8cee0'],['#a3987e','#ecdfb5'],['#494967','#8c8bb0'],['#74bfc2','#b6dfd3'],['#705c94','#bbabce'],['#356880','#7199ab'],['#c39482','#eed2a1'],['#789ab8','#c7dbe6'],['#25263f','#535570'],['#9aafc7','#e4d4dc'],['#cab98d','#f5e5bc']];
const skyVisual=[0,1,2,3,1,0,2,1,1,0,3,2,0,2,1,3,1,2,3,0];
WEATHER.forEach((sky,i)=>{sky.colors=skyColors[i];sky.visual=skyVisual[i];});
export const GEAR = [
  {name:'Clover charm',luck:1.5,speed:850,cost:80,copies:{drift:5},icon:'☘',desc:'A lucky little start.'},
  {name:'Spark glove',luck:2,speed:740,cost:250,copies:{mint:3,ember:2},icon:'✧',desc:'A brighter touch. Faster rolls.'},
  {name:'Star lens',luck:3,speed:630,cost:700,copies:{tide:3,frost:2},icon:'◈',desc:'See the rare light hiding in the sky.'},
  {name:'Moon compass',luck:4.5,speed:530,cost:1800,copies:{bloom:3,glow:2},icon:'☾',desc:'A path toward something extraordinary.'},
  {name:'Sky engine',luck:6,speed:440,cost:4500,copies:{storm:2,prism:2},icon:'✺',desc:'Your biggest luck boost yet.'}
];
const gearNames=['Meadow pendant','Tidal ring','Ember boots','Cloud lantern','Frost buckle','Rose compass','Storm crystal','Night cape','Prism crown','Aurora staff','Star map','Dream lens','Comet band','Solar charm','Moon engine','Galaxy glove','Sky lantern','Infinity lens','Celestial compass','Firstlight engine'];
const gearLuck=[9,14,22,34,52,80,120,180,260,390,570,820,1150,1560,2050,2640,3250,3900,4600,5200];
gearNames.forEach((name,i)=>GEAR.push({name,luck:gearLuck[i],speed:Math.max(200,420-i*12),cost:Math.round(6000*Math.pow(1.28,i)/10)*10,copies:{},minRolls:80+i*50,icon:['☘','◈','✧','☾','❄','✿','ϟ','◎'][i%8],desc:['A small upgrade for a bigger sky.','Bring distant colors a little closer.','Better luck. More discoveries.','A brighter path through the valley.'][i%4]}));
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
const moreRollGoals=[250,500,2000,5000,10000,20000,50000,100000];
moreRollGoals.forEach((target,i)=>GOALS.push({id:'roll-'+target,name:['Finding your rhythm','Another bright day','A long walk through the valley','The sky knows you','Magic in every moment','A patient explorer','A lifetime of colors','The valley is yours'][i],desc:'Roll '+target.toLocaleString('en-US')+' times',target,value:s=>s.rolls,dust:100*(i+3),potions:i+1}));
[10,16,24,32,40,48,64,80].forEach((target,i)=>GOALS.push({id:'find-'+target,name:['More colors to wear','The first sky complete','Garden explorer','Green worlds complete','Ocean explorer','Blue worlds complete','Moon worlds complete','Every color found'][i],desc:'Discover '+target+' different auras',target,value:s=>s.discovered.filter(Boolean).length,dust:200*(i+2),potions:i+2}));
[3,5,8,10,13,16,20,25].forEach((target,i)=>GOALS.push({id:'gear-'+target,name:['A clever pair of hands','Your first sky engine','Tools of the trade','A brighter workshop','A little masterwork','Follow the star map','A sky full of tools','Firstlight crafted'][i],desc:'Craft '+target+' gear upgrades',target,value:s=>s.gear,dust:250*(i+1),potions:i+1}));
['worldtree','oceanheart','moonthrone','firstlight','nova','dreamweaver','celestial','skykeeper'].forEach((id,i)=>GOALS.push({id:'aura-'+id,name:['Heart of the forest','Heart of the ocean','A seat on the moon','The first light','A new star','A dream to wear','Among the stars','Keeper of the sky'][i],desc:'Discover '+AURAS.find(a=>a.id===id).name,target:1,value:s=>s.discovered[AURAS.findIndex(a=>a.id===id)]?1:0,dust:500*(i+1),potions:3+i}));
const index = id => AURAS.findIndex(a=>a.id===id);
const count = (v,max=1e9)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
export function fresh(){return {v:1,rolls:0,dust:0,inventory:AURAS.map(()=>0),discovered:AURAS.map(()=>false),equipped:null,gear:0,activeGear:0,potions:2,boostRolls:0,claimed:[],best:null,sound:true,autoEquip:true};}
export function restore(raw){
  const s=fresh();if(!raw||typeof raw!=='object')return s;
  for(const key of ['rolls','dust','potions','boostRolls'])s[key]=count(raw[key],key==='boostRolls'?20:1e9);
  s.gear=count(raw.gear,GEAR.length);
  s.activeGear=Number.isInteger(raw.activeGear)?count(raw.activeGear,s.gear):s.gear;
  s.inventory=AURAS.map((_,i)=>count(raw.inventory?.[i]));
  s.discovered=AURAS.map((_,i)=>s.inventory[i]>0||raw.discovered?.[i]===true);
  s.equipped=AURAS.some((a,i)=>a.id===raw.equipped&&s.discovered[i])?raw.equipped:null;
  s.best=AURAS.filter((_,i)=>s.discovered[i]).at(-1)?.id||null;
  s.claimed=[...new Set(Array.isArray(raw.claimed)?raw.claimed.filter(id=>GOALS.some(g=>g.id===id)):[])];
  s.sound=raw.sound!==false;s.autoEquip=raw.autoEquip!==false;return s;
}
export const weather=s=>WEATHER[Math.floor(s.rolls/60)%WEATHER.length];
export const rollSpeed=s=>s.activeGear?GEAR[s.activeGear-1].speed:1000;
export const luck=(s,bonus=true)=>(s.activeGear?GEAR[s.activeGear-1].luck:1)*(s.boostRolls>0?2:1)*(bonus&&s.rolls%10===9?2:1);
export function probabilities(s,{base=false}={}){
  const l=base?1:luck(s), sky=base?null:weather(s);
  const weights=AURAS.map((a,i)=>a.weight*Math.pow(l,i<=15?i/4:3.75+(i-15)/24)*(sky?.boost.includes(a.id)?1.6:1));
  const total=weights.reduce((a,b)=>a+b,0);return weights.map(w=>w/total);
}
export function roll(s,rng=Math.random){
  const chances=probabilities(s),r=Math.max(0,Math.min(1-Number.EPSILON,Number(rng())||0));
  let sum=0,winner=AURAS.length-1;
  for(let i=0;i<chances.length;i++){sum+=chances[i];if(r<sum){winner=i;break;}}
  const aura=AURAS[winner],isNew=!s.discovered[winner];
  s.rolls++;s.inventory[winner]++;s.discovered[winner]=true;
  const earned=2+Math.floor(winner/2)+(isNew?winner*2:2);s.dust+=earned;
  if(s.boostRolls>0)s.boostRolls--;
  if(!s.best||winner>index(s.best))s.best=aura.id;
  if(!s.equipped||(s.autoEquip&&winner>index(s.equipped)))s.equipped=aura.id;
  return {aura,index:winner,isNew,earned,chance:chances[winner]};
}
export function canCraft(s){
  const g=GEAR[s.gear];return !!g&&s.dust>=g.cost&&s.rolls>=(g.minRolls||0)&&Object.entries(g.copies).every(([id,n])=>s.inventory[index(id)]>=n+1);
}
export function craft(s){
  if(!canCraft(s))return false;const g=GEAR[s.gear];s.dust-=g.cost;
  for(const [id,n]of Object.entries(g.copies))s.inventory[index(id)]-=n;
  s.gear++;s.activeGear=s.gear;return g;
}
export function brew(s){if(s.dust<60)return false;s.dust-=60;s.potions++;return true;}
export function drink(s){if(s.potions<1||s.boostRolls>0)return false;s.potions--;s.boostRolls=20;return true;}
export function equip(s,id){const i=index(id);if(i<0||!s.discovered[i])return false;s.equipped=id;s.autoEquip=false;return true;}
export function claim(s,id){const g=GOALS.find(x=>x.id===id);if(!g||s.claimed.includes(id)||g.value(s)<g.target)return false;s.claimed.push(id);s.dust+=g.dust;s.potions+=g.potions||0;return g;}

export function useGear(s,level){if(!Number.isInteger(level)||level<0||level>s.gear)return false;s.activeGear=level;return true;}
