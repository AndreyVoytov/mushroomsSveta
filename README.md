# Mushrooms — Arcane

Independent checkout: `C:\proj\mushroomsArcane`, created from
`reskin/arcane-watercolor` at `ea7dc09`. UI fixes use `codex/arcane-ui-polish`.
The original game remains in `C:\proj\mushroomsSveta`.

Arcane production: https://andreyvoytov-mushrooms-arcane.pages.dev

Run `npm ci --legacy-peer-deps`, then `npm run build`. For a local preview:
`$env:GAME_PREVIEW_PORT='8895'; node tools/serve-game-preview.js`.
Package with `npm run pages:build` and `node tools/prepare-arcane-publication.cjs`.
That script targets only the separate Arcane Cloudflare project.

## Original project documentation

Development and publication use the single `main` branch. Each push to `main` runs
the game checks, builds the site and deploys it to
https://andreyvoytov.github.io/mushroomsSveta/ through GitHub Actions.

For a local publication build, run `npm ci --legacy-peer-deps` and
`npm run pages:build`. The complete static site is placed in `.pages-dist/`,
including `/animals/`, `/mechanics/`, `/roadmap/`, `/ideas/`, `/ideas2/` and
the existing `/reports/` and downloadable archives. `public/` contains static
publication files that do not have another source in the project.

The local world-system implementation and the remaining work for all 27 selected
issues are documented in [the implementation report](docs/implementation/index.html).
It includes optional encounters, permanent wardrobe bonuses, relationships,
personal adventures, seasons and expeditions. A Supabase serverless adapter for
both Yandex Games and the ordinary web version is prepared in `supabase/`.
See [the serverless setup and validation guide](docs/implementation/serverless.html).
It is not connected to a live game project. Web checkout awaits a provider;
full clothing rendering and gameplay-wide server authority remain unfinished.

After `npm run build`, run `node tools/serve-game-preview.js` and open
`http://127.0.0.1:8893/`. The local analytics dashboard is at
`http://127.0.0.1:8893/docs/operations/`. Use a separate preview origin for debug
fixtures, since `?level=21` changes campaign progress in that browser profile.

![screenshot](https://i.imgur.com/XXyX8KO.png)
![screenshot](https://i.imgur.com/YuzMdYi.png)
![screenshot](https://i.imgur.com/GIdIa5q.png)

# Setup
You’ll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/troyedwardsjr/phaser3-typescript-webpack.git```

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies (optionally you could install [yarn](https://yarnpkg.com/)):

Navigate to the cloned repo’s directory.

Run:

```npm install```

or if you choose yarn, just run ```yarn```

## 4. Run the development server:

Run:

```npm run dev```

This will run a server so you can run the game in a browser.

Open your browser and enter localhost:3000 into the address bar.

Also this will start a watch process, so you can change the source and the process will recompile and refresh the browser


## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.

## Credits

- `assets/other/audio/treeLeavesRustle.ogg` — “moving leaves stereo” by Augmentality (Brandon Morris), [OpenGameArt](https://opengameart.org/content/random-sounds-samples), CC0.

This work is based off of several existing repos:

https://github.com/nkholski/phaser3-es6-webpack

https://github.com/lean/phaser-es6-webpack
