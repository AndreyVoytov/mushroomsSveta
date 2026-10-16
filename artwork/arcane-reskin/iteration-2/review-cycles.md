# Painted UI refinement — five review cycles

Scope: the Arcane watercolor branch only. Existing illustrated characters and location backgrounds remain. Static UI artwork is generated with the built-in ImageGen tool, then cropped, resized or nine-sliced for the existing game canvases. Text and changing masks remain native for localization and interaction.

## Cycle 1 — dialogue and text roles

Before: 12 live game states captured locally. Pale stat values disappeared into the hero card; settings and task headings were tinted into their backing; energy purchase text was unreadable; dialogue treatment was sparse. Cold first navigation transferred 46.04 MiB of same-origin resource bodies, including 42.91 MiB of WebP atlases.

Changes: ImageGen parchment dialogue frame, teal brass nameplates and action button; Lora dialogue type; explicit ivory-on-teal text role; dark ink on light surfaces; painted secondary insets and skip control.

After: all sampled dialogue, hub, level-start, level-8, victory and diary labels pass the 4.5:1 sampling threshold. The independent review found additional legacy tint conflicts in settings/shop and the energy counter, plus poor task-panel joins. Those are carried into the next cycles. Twelve states rendered without runtime errors. Screens: `.local-workbench/ui-reviews/cycle-1-before` and `cycle-1-after`.

## Cycle 2 — complete UI and portrait controls

Changes: 101 painted UI assets plus the illustrated equipment card, portrait frames and charge masks. Energy panel textures reduced from 1536×1024 / 1292×1217 / 1900×678 to 960×640 / 160×150 / 512×160. Removed legacy multiply tints and doubled close symbols in settings/shop; rebuilt the energy counter, close control and readable explanatory type.

Review: 12 live states captured, zero runtime errors. Settings, energy and bank sampled labels now all pass 4.5:1. Found three further issues: oversized visible energy glyph caused by old transparent padding, repeated progress capsules in the hub bar, and the character information heading intersecting a painted rim. Field greens remain too saturated against the new header. Screens: `.local-workbench/ui-reviews/cycle-2-after`.

## Cycle 3 — field palette and nature

Changes: ImageGen sage/jade hexes, three leaf families, clover, three vine strengths and eight edge-foliage assets. New ground texture retains its 118×118 source size. Restored the energy glyph's original visible bounds, and sampled the centre of the painted progress fill for seamless repeat.

Review: 12 live states, zero runtime errors. Hub and level labels pass the sampled contrast check. Visual review found rectangular opened-ground patches where independently resized textures did not align, a sharp green join below the scenic header, and a progress fill too tall for its frame. These concrete findings are fixed in cycle 4, together with panel composition. Screens: `.local-workbench/ui-reviews/cycle-3-after`.

## Cycle 4 — panel composition and mobile

Changes: replaced broken stitched task-panel parts with continuous painted paper surfaces; corrected task-track proportions; added a title plaque over the equipment-card rim; ImageGen stat icons, reward chests and divider. DOM menus reuse the same painted surfaces. Feathered the scenic header into the ground and corrected the hub fill bounds.

Review: 12 desktop states at 900×1600 and the same 12 at 390×844, zero runtime errors. Visible sampled headings/buttons pass contrast. Independent mobile review found task/body explanations too small. It also exposed that the surface prep pipeline discarded joined alpha, leaving rectangular ground patches; cycle 5 corrects the channel handling and asserts retained transparency. Lossless painted atlases make first navigation 48.73 MiB, so the final cycle must reduce transfer weight. Screens: `.local-workbench/ui-reviews/cycle-4-desktop` and `cycle-4-mobile`.

## Cycle 5 — independent final review and loading budget

Changes: larger task / character / energy explanations, darker task text, corrected output alpha, WebP quality 92 with lossless alpha and untouched lossless bitmap fonts. Fresh review of actual longest dialogue lines found 3–6 pixels of overlap with the skip control; moved it down. DOM menu review found distorted nine-sliced capsule ends; switched those controls to complete painted button artwork. Added the reference's plum/brass dialogue medallion. Replaced noisy ground with four quiet watercolor tiles, reflected at seams, including dark forest / lake / meadow palettes.

Final confirmation: 12 desktop + 12 mobile states, 101 visible labels sampled on each; minimum measured ratio 4.87:1. Three actual longest dialogue texts do not overlap the skip button. Four DOM menu sections have no horizontal overflow or missing images. Five board environments render correctly. All 17 existing mechanic suites pass; actual hero gameplay passes empty slots, all three abilities, gross-energy charging, bonus-energy exclusion and restart cleanup. A final header test removed the obsolete opaque grass strip that caused a horizontal seam. Tiny reflected ground canvases are cached for the game lifetime to keep outgoing transition textures valid.

Output budget: all 609 registered original textures checked, zero resolution increases, three large energy images reduced; eight small new UI canvases. Fresh first-navigation bodies fell from 46.04 to 24.03 MiB (47.8%). Source masters remain outside the publication. Five representative shipped WebP pages preserve alpha exactly; bitmap fonts remain lossless. See `asset-budget.json`, `codec-quality.json`, `performance.json` and `qa-final.json`.

Contrast sampling hides bitmap labels temporarily and samples their visible background. Masked/offscreen rows and labels behind modal overlays require manual interpretation; these are not claimed as accessibility certification.
