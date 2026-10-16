# Arcane — alignment and state polish

This revision unifies low-attention states through pale, desaturated materials. Inactive cells keep a faint embossed motif, so they remain distinct from empty uncovered cells. Active cells retain their color and their existing gold interaction highlight. Gameplay eligibility and energy accounting are unchanged.

## Artwork and production

- The new inactive cover was edited with the **built-in ImageGen tool** using the active hex as a reference. [Prompt and selected master](generation-results.json).
- The selected master is normalized into `assets/base/hex/hexDark.png` and `assets/base/hex/hexHouseDark.png`, both **180×191**, matching the original canvases. [Applied paths and hashes](applied-assets.json).
- `node tools/prepare-arcane-polish.cjs` prepares these two runtime assets. Large generation masters are outside the published assets. The existing painted ribbons, card surfaces and notice frames are reused for loading, item cards and purchase confirmation.
- `node tools/check-painted-art.cjs` checks the current combined artwork and writes [asset-budget.json](asset-budget.json). The previous ensemble preparation script is guarded against restoring the superseded dark covers.

## Ten review iterations

| Iteration | Review and resulting refinements |
| --- | --- |
| 1 | Trees transition at 390×844, 900×1600 and 390×640. Replaced the accidentally remapped dark loading caption with explicit cream lettering on the painted teal ribbon. Corrected overscan coordinates on tall screens; reserved ellipsis width to prevent horizontal jitter. |
| 2 | House and forest inactive covers, uncovered faces and pointer gates. Selected the pale ImageGen variant; retained the motif at 28% opacity and the existing disabled input behavior. |
| 3 | Dark forest, lake/sand and flower biomes, including late tutorials. Confirmed that pale inactive covers remain distinguishable from both saturated active cells and blank revealed faces. |
| 4 | Main UI ensembles and glyph measurements. Centered visible glyph bounds instead of the bitmap font's invisible line-height padding. Centered multiline text in measured centered boxes and removed old button-caption offsets. |
| 5 | Settings, energy and level briefing rows. Balanced icon/value and icon/price groups, aligned explanatory rows to the panel center, centered the sound row and spaced objectives symmetrically. Darkened a bundle quantity after its new position exposed a lower-contrast painted area. |
| 6 | Three longest actual Russian replicas and the DOM world overlay. Checked dialogue wrapping, names, action/Skip separation, tabs and overflow. |
| 7 | Shop bank, item cards, purchase receipt and purchased state. Replaced stacked old item-card backgrounds with the painted mauve card; reserved title, stats, usage, level and price rows. Rebuilt the receipt with a bounded reward icon and separate title/body/action areas. Removed the purchased card's dark overlay. Before/after review caught and corrected lettering over decorative borders. |
| 8 | Secondary panels and conditional states: skills, heroes, equipment, maximum level, help/about, daily/campaign/claimed tasks, diary turns, exit and failure. Kept titles and counters within their painted areas; preserved the long-name and diary-page fixes. |
| 9 | English and German at 360×800; hard levels, longest objective and large balances. Aligned the briefing title to the painted band center and shop tabs to their shared rail. Checked wrapping, contrast and narrow-layout containment. |
| 10 | Real level transition, actual pointer interaction, final main-screen capture, transition checks at three aspect ratios, regression suite and published-site verification. Results are recorded in [qa-final.json](qa-final.json). |

Centered bitmap labels now use their visible glyph envelopes; top-aligned story copy and right-aligned numeric/form labels preserve their respective alignment. Text measurement uses the actual font glyphs, and remains stable after text, style and font-size updates.

The review covers the implemented Russian layouts plus representative English/German lengths. Contrast sampling and bounds checks supplement visual inspection; they are not a linguistic audit of every translation.

## Published verification — 2026-10-16

- [Production](https://andreyvoytov-mushrooms-arcane.pages.dev/) · [deployment preview](https://d777eb13.andreyvoytov-mushrooms-arcane.pages.dev/) · deployed game commit `1203b73357287652301143df8e673dc28664a0a6`.
- 71 final captures with measured text, including 12 published mobile screens; 618 labels, minimum sampled contrast **4.79:1**, no remaining UI text-box intersections or runtime errors in the final datasets. Long-dialogue, DOM-tab, transition and pointer-flow checks are recorded separately.
- 114 labels checked against their actual glyph envelopes: 112 centered horizontally and 99 vertically, with no residual local offset. Loading-caption contrast is at least **12.28:1** across the three tested viewport formats.
- The actual House→Forest transition was observed over 621 rendered frames. A click on an inactive cell leaves it closed and spends zero energy; an active-cell click opens it and spends one energy. All 17 regression checks passed.
- 66 deployed files verified byte-for-byte; original production bundle checksum, tracker card and companion download redirect verified. The original working checkout remains separate.
- All 609 original texture canvases retain their dimensions. The two 180×191 replacements are 22,506 bytes each. Atlas WebP bytes decreased by 286; cold published same-origin resources measured **22,466,028 encoded body bytes (21.43 MiB)**.
- [Full results and deployed hashes](qa-final.json).
