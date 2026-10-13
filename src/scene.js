import {AURAS,weather} from './engine.js';
export function createScene(canvas,getState){
  const ctx=canvas.getContext('2d');const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let w=480,h=400,rolling=false;
  const palettes=[['#93c7c8','#cae6ce','#6e9d9d','#456e76','#2e555d'],['#718fab','#9bbac1','#607b93','#40576f','#293e56'],['#36365e','#78718f','#555479','#393b60','#262b47'],['#66749f','#c7b8c8','#7e819e','#535c7e','#333e5d']];
  const rand=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
  function size(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;w=480;h=Math.round(w*r.height/r.width);canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false;}
  new ResizeObserver(size).observe(canvas);size();
  function rect(x,y,width,height,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(width),Math.round(height));}
  function tree(x,y,s,color){rect(x-2*s,y,4*s,18*s,color);for(let k=0;k<4;k++){const q=(4-k)*5*s;rect(x-q/2,y-15*s+k*6*s,q,8*s,color);}}
  function hills(y,color,seed){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w+10;x+=10){const yy=y-Math.sin(x*.012+seed)*22-Math.sin(x*.033+seed)*12;ctx.lineTo(x,Math.round(yy/4)*4);}ctx.lineTo(w,h);ctx.fill();}
  function star(x,y,s,color){rect(x-s/2,y-1,s,2,color);rect(x-1,y-s/2,2,s,color);}
  function avatar(x,y,t){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(1.65,1.65);
    const bob=Math.sin(t*2)*.7;ctx.translate(0,bob);
    rect(-13,-2,26,4,'#1b2c403d');rect(-9,-8,7,7,'#273548');rect(3,-8,7,7,'#273548');
    rect(-11,-25,23,18,'#374964');rect(-10,-21,22,8,'#526d7e');rect(-11,-24,3,13,'#76968c');
    rect(-14,-23,4,13,'#384b5e');rect(12,-23,4,13,'#384b5e');rect(-14,-12,4,4,'#dbb595');rect(12,-12,4,4,'#dbb595');
    rect(-7,-39,15,15,'#e0bb9a');rect(-10,-45,19,8,'#292d43');rect(-8,-39,3,8,'#292d43');rect(6,-39,4,5,'#292d43');
    rect(-3,-34,2,2,'#344453');rect(4,-34,2,2,'#344453');rect(0,-28,3,1,'#aa856e');
    rect(-8,-25,16,3,'#9dd7c1');rect(5,-23,3,9,'#9dd7c1');
    if(getState().gear>0){rect(12,-16,4,5,'#d6bd79');rect(-14,-16,4,5,'#d6bd79');}
    ctx.restore();
  }
  function aura(a,x,y,t){
    if(!a)return;const c=a.color,r=rolling?88:70;
    const glow=ctx.createRadialGradient(x,y-43,5,x,y-43,r*1.5);glow.addColorStop(0,c+'3d');glow.addColorStop(1,c+'00');ctx.fillStyle=glow;ctx.fillRect(x-r*1.7,y-r*2.5,r*3.4,r*3);
    ctx.save();ctx.strokeStyle=c+'99';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y+1,r*.58,11,0,0,Math.PI*2);ctx.stroke();
    if(['orbit','void','crown'].includes(a.kind)){ctx.beginPath();ctx.ellipse(x,y-40,67,32,Math.sin(t*.3)*.4,0,Math.PI*2);ctx.stroke();}
    if(a.kind==='void'){ctx.fillStyle='#232944';ctx.beginPath();ctx.arc(x,y-96,18,0,Math.PI*2);ctx.fill();ctx.stroke();}
    if(a.kind==='rays'||a.kind==='crown'){for(let k=0;k<7;k++){const angle=k*Math.PI/7+t*.12;ctx.strokeStyle=c+'38';ctx.beginPath();ctx.moveTo(x+Math.cos(angle)*20,y-40+Math.sin(angle)*20);ctx.lineTo(x+Math.cos(angle)*100,y-40+Math.sin(angle)*100);ctx.stroke();}}
    for(let i=0;i<28;i++){
      const angle=t*(.3+rand(i)*.3)+i*2.4,rr=30+rand(i+20)*45;
      let px=x+Math.cos(angle)*rr,py=y-42+Math.sin(angle)*rr*.9;
      if(['flame','water','petals'].includes(a.kind)){px=x+(rand(i+30)-.5)*110+Math.sin(t+i)*8;py=y-((t*18+i*9)%110);}
      const col=a.id==='prism'?['#aef0d4','#ffb6c9','#ffe395','#b9b6ff'][i%4]:c;
      ctx.globalAlpha=.35+.6*(.5+.5*Math.sin(t*2+i));
      if(a.kind==='ice'){star(px,py,6,col);}else if(a.kind==='petals'){rect(px,py,3,5,col);rect(px+2,py-1,3,2,col);}else{rect(px,py,i%3?2:4,i%3?2:4,col);}
    }
    ctx.globalAlpha=1;
    if(a.kind==='lightning'){const cycle=Math.floor(t*5);for(let k=0;k<3;k++){const xx=x-60+k*60;ctx.beginPath();ctx.moveTo(xx,y-95);ctx.lineTo(xx+rand(cycle+k)*12,y-63);ctx.lineTo(xx-8,y-56);ctx.lineTo(xx+4,y-25);ctx.strokeStyle=c+(k===cycle%3?'ee':'55');ctx.stroke();}}
    if(a.kind==='crown'){rect(x-20,y-102,40,7,c);for(let k=0;k<3;k++)rect(x-18+k*15,y-112-(k===1?5:0),6,12,c);}
    ctx.restore();
  }
  function draw(ms){
    requestAnimationFrame(draw);if(document.hidden)return;const state=getState();if(!state)return;const t=reduced?0:ms/1000,wi=Math.floor(state.rolls/60)%4,p=palettes[wi],ground=h*.76,x=w/2,y=ground-8;
    const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,p[0]);sky.addColorStop(1,p[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
    if(wi>=2)for(let i=0;i<45;i++){ctx.globalAlpha=.4+Math.sin(t*.8+i)*.25;star(rand(i+90)*w,rand(i+190)*h*.48,3,'#f5e6cb');}ctx.globalAlpha=1;
    const orbX=w*.79,orbY=h*.22;ctx.fillStyle=wi<2?'#e8efd85c':'#f0e5d69c';ctx.beginPath();ctx.arc(orbX,orbY,wi<2?23:18,0,Math.PI*2);ctx.fill();
    if(wi===2){ctx.fillStyle=p[0];ctx.beginPath();ctx.arc(orbX+8,orbY-5,16,0,Math.PI*2);ctx.fill();}
    hills(h*.51,p[2],1);hills(h*.59,p[3],4);
    for(let i=0;i<17;i++)tree(i*33+rand(i)*18,h*.64+rand(i+8)*22,.6+rand(i+9)*.8,p[3]);
    hills(ground+35,p[4],2);
    rect(x-86,ground-6,172,14,'#73928b');rect(x-82,ground+8,164,23,'#566c74');rect(x-78,ground+31,156,16,'#425763');
    for(let i=0;i<18;i++){const xx=x-83+i*10;rect(xx,ground-8+Math.floor(rand(i+13)*3),10,4,'#acd2a1');rect(xx+2,ground+12+rand(i+5)*16,6,2,'#80918d');}
    rect(x-47,ground-7,94,5,'#9daca2');rect(x-44,ground-2,88,4,'#c1c7ac');
    for(const side of [-1,1]){const xx=x+side*130;rect(xx-5,ground-37,10,40,'#526773');rect(xx-10,ground-43,20,8,'#758d8c');rect(xx-3,ground-40,6,6,'#dbe5b8');star(xx,ground-37,11,'#e9f2b252');}
    for(let i=0;i<20;i++){const xx=rand(i+44)*w,yy=ground+38+rand(i+25)*(h-ground-38);rect(xx,yy,2,5,'#80a29a');if(i%3===0)rect(xx-1,yy-2,4,3,'#d0cbb2');}
    if(wi===1){ctx.strokeStyle='#d4e6ef50';ctx.lineWidth=1;for(let i=0;i<35;i++){const xx=(rand(i+70)*w+t*15)%w,yy=(rand(i+71)*h+t*70)%h;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx-2,yy+9);ctx.stroke();}}
    if(wi===3){for(let i=0;i<6;i++){const xx=(rand(i+60)*w+t*8)%w,yy=(rand(i+65)*h*.6+t*6)%(h*.6);star(xx,yy,5,'#fff0d4aa');}}
    const a=AURAS.find(a=>a.id===state.equipped);aura(a,x,y,t);avatar(x,y,t);
    for(let i=0;i<9;i++){const xx=rand(i+88)*w,yy=ground-10-Math.sin(t*.7+i)*35;rect(xx,yy,2,2,'#e0f4ae80');}
  }
  requestAnimationFrame(draw);return {setRolling:value=>{rolling=value;},resize:size};
}
