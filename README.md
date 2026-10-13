# Aura Vale

An original, offline 2D aura clicker with a pixel valley and magical character effects. Inspired by the general free-roll, aura-collection, and gear-crafting gameplay loop of RNG games. Names, visuals, world, progression, code, and UI are original; it is not a Roblox experience or an official Sol's RNG product.

## Play

Tap **Roll aura** (or press Space on desktop). Discover 80 auras and choose one to wear. Every 10th roll has double luck. Auto roll unlocks after 25 rolls. Dust and extra copies craft 25 levels of gear, and luck potions last 20 rolls. 20 weather states change every 60 rolls and favors different auras. 40 goals award dust and potions once each.

All rolls are free. There are no accounts, ads, paid rolls, purchases, or cash prizes. Progress saves locally under `aura-vale-save-v1`. Auto roll stops while the app is hidden. Potions count rolls rather than elapsed time. Crafting always keeps the last copy of an aura. The UI displays rounded baseline odds; actual chances account for gear, potions, the 10th-roll bonus, and weather.

## Browser

The root page is also a buildless browser game compatible with the repository's GitHub Pages hosting. Native Android support loads only inside the Android wrapper. Browser and Android saves are separate.

## Android

The Actions workflow **Build Aura Vale Android APK** tests the game, checks four screen sizes, generates the native project, and uploads an installable debug APK. This is a playtest build, not a Play Store release. The project-local debug key is cached for compatible test updates; production release signing requires a separately backed-up upload key.

The Android app ID is `com.laprisep1.auravale`. It is separate from Egg Clicker and has its own save.

## Development

Use Node 22 or newer. Run `npm install`, `npm test`, and `npm run build`. Serve `dist` to play in a browser. The engine tests cover probability normalization, luck boosts, roll rewards, crafting conservation, potion use, one-time goals, weather, and save validation. The browser tests cover the playable loop, saves, automatic rolling, mobile layout, and runtime errors.

The previous cookie game has been removed from the repository's current files at the owner's request.
