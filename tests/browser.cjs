const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:360,height:800}});const errors=[];
 page.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});
 await page.goto('http://127.0.0.1:8765');await page.waitForFunction(()=>window.AuraVale?.state);
 assert.equal(await page.title(),'Aura Vale');assert.equal(await page.evaluate(()=>AuraVale.state.rolls),0);
 await page.locator('#roll').click();await page.waitForFunction(()=>!AuraVale.busy);assert.equal(await page.evaluate(()=>AuraVale.state.rolls),1);
 await page.reload();await page.waitForFunction(()=>window.AuraVale?.state);assert.equal(await page.evaluate(()=>AuraVale.state.rolls),1);
 await page.locator('#potion').click();assert.equal(await page.evaluate(()=>AuraVale.state.boostRolls),20);
 await page.locator('#roll').click();await page.waitForFunction(()=>!AuraVale.busy);assert.equal(await page.evaluate(()=>AuraVale.state.boostRolls),19);assert.equal(await page.locator('#potion').isDisabled(),true);
 await page.evaluate(()=>{const s=AuraVale.state;s.dust=100;s.inventory[0]=6;s.discovered[0]=true;s.rolls=24;AuraVale.render();});
 await page.locator('[data-screen="gear"]').click();await page.locator('[data-craft]').click();assert.equal(await page.evaluate(()=>AuraVale.state.gear),1);assert.equal(await page.evaluate(()=>AuraVale.state.inventory[0]),1);
 await page.locator('[data-screen="roll"]').click();await page.locator('#roll').click();await page.waitForFunction(()=>!AuraVale.busy);assert.equal(await page.evaluate(()=>AuraVale.state.rolls),25);assert.equal(await page.locator('#auto').isDisabled(),false);
 await page.locator('#auto').click();const before=await page.evaluate(()=>AuraVale.state.rolls);await page.waitForFunction(n=>AuraVale.state.rolls>n,before);await page.locator('#auto').click();assert.equal(await page.evaluate(()=>AuraVale.auto),false);await page.waitForFunction(()=>!AuraVale.busy);
 await page.locator('[data-screen="auras"]').click();
 assert.equal(await page.locator('.aura-card').count(),80);
 await page.locator('#aura-search').fill('firstlight');assert.equal(await page.locator('.aura-card').count(),1);
 await page.locator('#aura-search').fill('');await page.locator('#aura-filter').selectOption('found');assert.ok(await page.locator('.aura-card').count()<80);
 await page.locator('#aura-filter').selectOption('all');await page.locator('[data-equip="drift"]').click();assert.equal(await page.evaluate(()=>AuraVale.state.equipped),'drift');
 await page.locator('[data-screen="goals"]').click();const dust=await page.evaluate(()=>AuraVale.state.dust);await page.locator('[data-claim="first"]').click();assert.equal(await page.evaluate(()=>AuraVale.state.dust),dust+30);assert.equal(await page.locator('[data-claim="first"]').count(),0);
 await page.locator('[data-screen="gear"]').click();await page.locator('#gear-choice').selectOption('0');assert.equal(await page.evaluate(()=>AuraVale.state.activeGear),0);
 await page.locator('#gear-choice').selectOption('1');assert.equal(await page.evaluate(()=>AuraVale.state.activeGear),1);
 await page.evaluate(()=>{AuraVale.state.rolls=300;AuraVale.render();});
 await page.locator('[data-screen="roll"]').click();assert.equal(await page.locator('#reveal').evaluate(e=>e.classList.contains('show')),false);
 await page.locator('#settings').click();await page.locator('#sound-toggle').click();await page.locator('#close-settings').click();assert.equal(await page.evaluate(()=>AuraVale.state.sound),false);
 await page.reload();await page.waitForFunction(()=>window.AuraVale?.state);assert.equal(await page.evaluate(()=>AuraVale.state.gear),1);assert.equal(await page.evaluate(()=>AuraVale.state.equipped),'drift');
 for(const viewport of [{width:320,height:640},{width:360,height:800},{width:412,height:915},{width:1360,height:900}]){
  await page.setViewportSize(viewport);await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
  assert.equal(await page.locator('header').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
  if(viewport.width<760){const button=await page.locator('#roll').boundingBox(),nav=await page.locator('.mobile-nav').boundingBox();assert.ok(button.y+button.height<=nav.y,'Roll button must fit above navigation');}
 }
 await page.setViewportSize({width:1360,height:900});await page.waitForTimeout(300);await page.screenshot({path:'aura-vale-desktop.png'});
 await page.setViewportSize({width:360,height:800});await page.waitForTimeout(300);await page.screenshot({path:'aura-vale-phone.png'});
 await page.locator('[data-screen="auras"]').click();await page.screenshot({path:'aura-vale-collection.png'});
 const raw=await browser.newPage({viewport:{width:360,height:800}});raw.on('pageerror',e=>errors.push(e.message));
 await raw.goto('http://127.0.0.1:8766');await raw.waitForFunction(()=>window.AuraVale?.state);await raw.locator('#roll').click();await raw.waitForFunction(()=>!AuraVale.busy);assert.equal(await raw.evaluate(()=>AuraVale.state.rolls),1);
 assert.deepEqual(errors,[]);console.log('Passed: rolls, saved progress, potions, crafting, auto roll, equipment, one-time goals, tab popup cleanup, settings, four responsive sizes, no runtime errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
