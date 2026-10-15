# Arcane watercolor reskin

Isolated branch: `reskin/arcane-watercolor`. The baseline commit preserves the
approved gameplay fixes from the original checkout before any reskin changes.

Production: https://andreyvoytov-mushrooms-arcane.pages.dev

The art direction combines painterly, faceted character lighting with clean,
grouped foliage shapes and restrained couture silhouettes. The interface uses
light parchment, sage, brass, Manrope body text and Lora headings. Puzzle boards,
their cell artwork and mechanics retain the baseline behavior.

## Artwork

- `asset-manifest.json`: original logical canvases and sprite bounds.
- `imagegen-prompts.json`: all 43 prompts and reference images, generated using
  the built-in `image_gen` tool (not the CLI).
- `validation.json`: dimensions, transparency and before/after image hashes.
- `generation-results.json`: selected original generation output paths.
- `ui/*.svg`: editable source of 68 interface assets.
- `derived-icons.json`: small character images derived from the new sprites.

43 generated images cover 22 character poses, six locations, ten level headers
and five props/menu illustrations. Five small character icons reuse these
sprites, including the cat on the map. Overlay-only special effects remain
separate from full character art.

Font binaries and their OFL licenses are in `assets/other/fonts/arcane`.
Bitmap atlases include the legacy Latin/Cyrillic glyph set and extra punctuation.

## Preparation

The game builds from checked-in assets; no image generation is needed to play or
deploy. Optional art scripts require `sharp` and, for bitmap fonts, `playwright`
with Chrome. They also support the bundled Codex document runtime.

1. `node tools/normalize-arcane-art.cjs` (requires generation source files).
2. `node tools/generate-arcane-ui.cjs`
3. `node tools/derive-arcane-icons.cjs`
4. `node tools/generate-arcane-fonts.cjs`
5. `npm run atlases`
6. `npm run pages:build`
7. `node tools/prepare-arcane-publication.cjs`

The publication script requires the reskin branch and stages a separate static
site for `andreyvoytov-mushrooms-arcane`. The oversized companion ZIP retains its
existing GitHub Pages download redirect. The original game origin is untouched.
