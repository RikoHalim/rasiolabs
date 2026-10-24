# Rasio Labs — service page update

Historical implementation record. The owner subsequently requested removal of all dedicated service pages on 22 October 2026. The implementation and preview links below are retired. Selected content/style reference: `../docs/Rasio Labs - Referensi Halaman Layanan.md`. This log is not an instruction to restore the pages.

22 October 2026. Local implementation, not a production deployment.

## Delivered

- Profile, Store and Custom each have four concise feature cards and a separate three-benefit “Mengapa…” section.
- Store reuses authentic existing Visa, QRIS, Mastercard, BCA, BNI, BRI, Mandiri and ShopeePay assets. Its payment-method grid and approved 0% Rasio transaction-fee card are separate.
- Gateway/third-party fees appear beside the fee claim. Payment-method availability follows gateway and store activation at launch; the logos do not claim a live integration.
- Existing service-page headers, heroes, package checklists, ordering flows, sector icons and footers are retained. No payment integration or production gate is enabled.

## Maintained sources

`frontend/services/{profile,store,custom}.html` own the service shells. `content.mjs`, `render.mjs` and `styles.css` own the new components. `scripts/build-service-content.mjs` builds these pages and synchronizes approved package data; `npm run build` also copies them into `dist/client`. `npm run build:services` builds only the service pages in `dist`.

## Verification

- Final full build passed.
- Focused marketing and policy checks: 16 passed, 0 failed.
- Existing full suite: 50 passed, 36 failed. Thirty-three worker tests failed their setup hook and three template-renderer tests failed Miniflare dispatch, all reporting Undici `TypeError: fetch failed`. Their underlying local transport/setup cause is not established. No failed assertion identifies the new service components; the full suite is not claimed to pass.
- Browser checked all three pages at CSS widths 1280, 768, 390 and 360px: no document overflow or clipped feature/benefit content was detected. Each page has four feature cards and three benefit items. Why icons are 32px. All eight Store payment logos loaded.
- Heading contrast was corrected after the first inspection: the legacy service heading selector had overridden white text. The confirmation pass reports white feature headings on the blue section.
- New text palette exceeds AA contrast: muted text on white 7.16:1; muted text on ice 6.67:1; ice on the navy fee card 12.59:1. These palette checks complement, not replace, a complete rendered accessibility audit.
- Generated IDs are unique, payment asset paths resolve, no content placeholders remain, and production payment gates remain closed.
- No new interactive controls or motion were introduced. The Store console check returned no errors or warnings.

## Visual evidence and limits

`output/service-pages-2026-10-22/browser-layout.json` contains the browser measurements. `store-grid-partial.jpg` is a genuine browser capture showing the payment grid, separate fee card, catalogue/setup cards and the beginning of “Mengapa…”. It is a partial capture; its top crops the 0% figure. Full-page screenshot output remained clipped/unreliable, so whole-page screenshot QA is not claimed complete. Native browser state changed away from the Store preview during the final capture attempt; no further native input was used. Temporary viewport overrides were reset.

## Local preview

- http://127.0.0.1:4184/layanan-profile.html#service-features-title
- http://127.0.0.1:4184/layanan-store.html#service-features-title
- http://127.0.0.1:4184/layanan-custom.html#service-features-title

The local preview was started for review of the implementation, PID 33252. Stop it with `Stop-Process -Id 33252` when no longer needed; verify that process is still the preview before stopping it.
