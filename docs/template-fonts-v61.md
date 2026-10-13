# Template typography delivery

The existing 13 Google Fonts typefaces are self-hosted as Latin WOFF2 files under `dist/assets/fonts`. Each family retains its own typography. The heading and body faces are preloaded, and font-display is optional to prevent a late font swap moving an already painted page. A very slow first visit can retain its readable fallback for that document; subsequent navigation uses cached local fonts.

Source: Google Fonts CSS API, with original SIL Open Font License files from https://github.com/google/fonts/tree/main/ofl stored alongside each font. `scripts/fetch-template-fonts.mjs` records the reproducible download and generates `template-fonts.css` plus the preload manifest. The build uses checked-in assets and needs no external font network request.

The canonical rebrand/build pass owns font-head injection for all 70 public template pages and their client-rendered equivalents. No JavaScript hides the document until fonts are ready.
