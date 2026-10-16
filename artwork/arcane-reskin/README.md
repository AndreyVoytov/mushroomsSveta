# Arcane watercolor reskin

Isolated branch: `reskin/arcane-watercolor`. The baseline commit preserves the
approved gameplay fixes from the original checkout before any reskin changes.

Production: https://andreyvoytov-mushrooms-arcane.pages.dev

The art direction combines painterly, faceted character lighting with clean,
grouped foliage shapes and restrained couture silhouettes. The interface uses
light parchment, sage, brass, Manrope body text and Lora headings. Puzzle boards,
their geometry and mechanics retain the baseline behavior. The second revision
also brings field greens into a softer sage/jade palette.

## Artwork

- `asset-manifest.json`: original logical canvases and sprite bounds.
- `imagegen-prompts.json`: all 43 prompts and reference images, generated using
  the built-in `image_gen` tool (not the CLI).
- `validation.json`: dimensions, transparency and before/after image hashes.
- `generation-results.json`: selected original generation output paths.
- `ui/*.svg` and `ui-manifest.json`: archived v1 experiment / canvas mapping,
  superseded by the painted assets below.
- `derived-icons.json`: small character images derived from the new sprites.
- `iteration-2/generation-results.json`: 58 selected built-in ImageGen UI,
  foliage and field prompts, with their original generation paths.
- `iteration-2/applied-assets.json`: shipped painted sprite paths, dimensions
  and hashes. The full resolution generation masters are kept outside assets.
- `iteration-2/derived-surfaces.json`: technical alpha-mask and repeat-fill prep.
- `iteration-2/review-cycles.md`: five visual review / improvement cycles.
- `iteration-2/asset-budget.json`: checked dimensions and atlas size budget.

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
2. `node tools/apply-painted-ui.cjs`
3. `node tools/apply-painted-ui.cjs --group=character`
4. `node tools/apply-painted-ui.cjs --group=field`
5. `node tools/derive-painted-surfaces.cjs`
6. `node tools/derive-arcane-icons.cjs` / `node tools/generate-arcane-fonts.cjs`
   only when the original character / font sources changed.
7. `npm run atlases` (WebP quality 92, alpha quality 100; PNG fallback retained).
8. `node tools/check-painted-art.cjs`
9. `npm run pages:build`
10. `node tools/prepare-arcane-publication.cjs`

Never run the archived SVG UI generator over the current painted UI. Logical
texture canvases do not grow. Energy modal images were reduced to their actual
display needs; new portrait frames are 148×148 and rendered at up to 136×136.

The publication script requires the reskin branch and stages a separate static
site for `andreyvoytov-mushrooms-arcane`. The oversized companion ZIP retains its
existing GitHub Pages download redirect. The original game origin is untouched.

## Current UI revision

The current shipped UI is the [purpose-designed ensemble pass](iteration-3/README.md). It replaces the generic painted rectangles from iteration 2 and restores the opened-cell backgrounds. Use its preparation script and manifests for further changes; the earlier generic generators are archived.
