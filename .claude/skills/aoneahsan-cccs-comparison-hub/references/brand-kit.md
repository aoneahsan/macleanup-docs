# Brand kit

Saved in both places: `brand-kit/` at the app repo root, and `linkedin-social-content/<slug>/brand-kit/` in the notebook.

🔴 Built from the product's existing approved mark, as its header component draws it. Never redesigned without the owner asking. Words and fonts come from the product; text is outlined to paths, so no font is needed to open a file.

| File | What |
|---|---|
| `mark.svg/.png` | The icon alone, 1024 px, transparent |
| `favicon.svg`, `favicon-16/32/48.png`, `favicon.ico`, `apple-touch-icon.png` | Favicon set |
| `in-app-logo.svg/.png` | As it sits in the app header |
| `logo-horizontal.svg/.png` | Icon left, product name right |
| `logo-stacked.svg/.png` | Icon above, name below |
| `logo-stacked-tagline.svg/.png` | Icon, name, tagline |
| `logo-horizontal-mono.svg/.png`, `logo-horizontal-reversed.svg/.png` | One colour, and for dark grounds |
| `splash-light.svg/.png`, `splash-dark.svg/.png` | 2732 × 2732, mark safe-zone centred; match `resources/` when it exists |
| `README.md` | One table: file, use, and the command that made the PNG |

PNGs come from direct CLI (`rsvg-convert`), no script files. Tagline comes from the Story Bible. If the kit shows a mismatch between favicon and header, report it; the header wins.

Looking test: view every file at real size, on light and dark, beside the live header.

## Print set (owner, 2026-11-07): his jerseys and T-shirts

His words: *"each and every product must have one perfect logo"* · just the icon · icon and text, left and bottom · icon, text and tagline, left and bottom · *"full white, full black, and colored"* · *"if the t-shirt is full white, then on back the logo should be full black. If the t-shirt back is full black, then they should be white, and on front ... on the shoulders ... a colored variants"* · *"they must not look or feel like AI generated"* · *"use the latest versions ... colors, everything, font, style, look and feel is up to date with the project"*.

**5 layouts x 4 colourways = 20 logos**, in `brand-kit/print/`, named `<layout>-<white|black|color-dark|color-light>`. `color-dark` is for dark cloth: the mark in brand colour, the name and tagline white. `color-light` is for light cloth: the mark in brand colour, the name and tagline in the brand's ink. 🔴 Never an outline or contour around type or mark to make it readable: that reads as a sticker. Choose the right colourway for the cloth instead.

| Layout | What |
|---|---|
| `icon` | The icon alone |
| `horizontal` | Icon left, name right |
| `stacked` | Icon above, name below |
| `horizontal-tagline` | Icon left, name and tagline right |
| `stacked-tagline` | Icon, name, tagline stacked |

Each one: **SVG master + PDF (`rsvg-convert -f pdf`) + transparent PNG 4096 px on the long side at 300 dpi.**

🔴 Print rules, because a printer gets these: flat fills only, no gradients, shadows, filters, blurs or partial opacity · `white` is literally one colour, #FFFFFF, and `black` literally #000000 · `color-dark` and `color-light` use at most four flat spot colours from the product's current tokens, with the hex values listed in the README · text outlined to paths, strokes expanded · holds up at 25 mm wide, so a detail that fills in at that size is redrawn simpler for print · a gradient mark gets a flat redraw that keeps its shape; the app's mark is not changed.

🔴 Latest state first: colours, font and mark come from the product's current header and tokens today, never an old asset. A rebuilt site (Video Controls Plus) uses the new look.

**Mockup:** `brand-kit/print/mockups/`, on `production-projects/tshirt-design-i-will-print-my-products-logos-on.jpeg`: the sample brand's marks removed, ours placed. Front chest `stacked-tagline-color-dark`, left chest and shorts small `icon`, back `stacked-white` on the black panel, and a second mockup on white showing `stacked-black`. Looked at before it is called done.
