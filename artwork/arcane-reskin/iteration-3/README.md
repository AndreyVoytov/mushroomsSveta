# Arcane: purpose-designed UI ensembles

This pass replaces repeated nested paper rectangles with painted ensembles that have their own silhouette, material hierarchy, and text areas. All art was generated with the **built-in ImageGen tool**, including the final edit of the settings title ribbon. The renderer supplies live localized text and interaction; decorative surfaces are raster paintings.

## Production assets

- [Generation prompts, selected masters, and revision history](generation-results.json): 26 selected image families. Large masters remain outside the game assets.
- [Applied assets](applied-assets.json): 42 normalized game surfaces, with exact file paths, dimensions, hashes, and source IDs.
- [Runtime asset budget](asset-budget.json): original canvas sizes, opaque opened tiles, and darker grayed covers.
- New dedicated surfaces live in `assets/base/ui/arcane/`. Replacements also live in the existing `assets/base/ui/`, `assets/base/task/`, and `assets/base/hex/` paths recorded in the manifest.
- Preparation: `node tools/prepare-arcane-ensembles.cjs`. Validation: `node tools/check-painted-art.cjs`. Iteration 2's generic replacement script is now guarded to avoid overwriting this artwork.

## Ensembles reviewed

| Ensemble | Final treatment and placement checks |
| --- | --- |
| Story dialogue | Sculpted brass/linen frame, inset body copy, glyph-based wrapping; Skip has a separate footer position. Longest actual Russian replicas checked. |
| Level start | Expedition folio with a title band, objective tray and three hero slots. Old stacked frames and duplicate header illustration removed from the composition. |
| Victory | Laurel plaque, curved silk title banner, character area and result column. Reward and energy value have separate measured positions. |
| Gameplay HUD | Pale celadon rail. Objective icons sit above counts; level caption and number have distinct footer rows. |
| Settings | Sage instrument panel, darker painted title ribbon, lavender controls. Sound, title and button copy measured independently. |
| Energy | Botanical instrument panel; icon/value, status, purchase, reset time and explanatory copy occupy separate rows. |
| Shop | Mauve display cards and matching bundle trays. Compact currencies/booster counts and purchase buttons have reserved areas. Heroes tab displays the available party and an explanatory empty state. |
| Tasks | Bound ledger with integrated header and slim quest rows; excess item/reward inset rectangles removed. Daily/campaign, progress, scroll clipping, reward labels reviewed. |
| Heroes/equipment | Sage statistics plaque; lavender title/action plates; measured upgrade caption and currency icon. Character, equipment and skill explanations reviewed. |
| Diary/world overlay | Painted linen journal and quieter page hierarchy; repeated card borders removed. Mobile tabs scroll without document overflow; buttons have sufficient end padding. |
| Tutorials/confirmations | Painted notice and retry frames; adaptive tutorial body, illustration row and action placement. Exit, failure, support and about panels reviewed. |
| Field states | Fully opaque uncovered hex faces restored; grayed cells use darker slate teal. Sand, water and flower tiles and their motifs brought into the pastel palette. Dark-forest clue digits keep a readable world size on painted medallions. |

## Review cycles

1. **Whole-screen composition.** Captured 12 real game states at 900×1600. Found the level subtitle on a frame seam, victory title on its crest, energy text crowding, and insufficient contrast in several brown labels. Repositioned the text and simplified nested frames.
2. **Mobile and secondary panels.** Captured the same states at 390×844 plus equipment, skill help, other heroes, support, about, campaign, diary, exit and failure. Fixed small dark-forest digits, equipment caption/icon spacing, helper panels, and lingering low-contrast colors.
3. **Long text and controls.** Tested the three longest real Russian replicas and DOM panels. Removed double wrapping that unnecessarily shrank copy. Moved Skip outside the dialogue body; improved native text, button padding and disabled-label legibility.
4. **Biomes and narrower layouts.** Tested normal/open/grayed states together, late biome tutorials, and English/German layouts at 360×800. Refined sand/flower artwork and darkened only the settings title ribbon after a short heading exposed its lighter center.
5. **Final regression and publication review.** Checked hard levels, the longest objective, large balances, claimed tasks, equipment at maximum level, long character names, and diary page turns. Removed a leftover purple hard-level overlay, preserved adaptive nameplate dimensions during entrance animation, and fixed stale diary page numbers. Final screenshots, text bounds/contrast checks, runtime checks, texture budget, core mechanics tests, and exact deployed-asset verification are recorded in [qa-final.json](qa-final.json).

The review checks the implemented Russian layouts and representative English/German lengths. It does not claim a linguistic audit of every translation. One simultaneous three-browser stress run lost its WebGL context; final verification is run serially as well to distinguish browser resource pressure from game errors.

The original working checkout and original production site are kept separate from this reskin branch.
