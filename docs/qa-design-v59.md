# Rasio Labs revision v59

2026-10-08. Owning-agent review. Anti Slop applied during design using the owner's session choice.

## Direction and changes

The owner's bright white and blue reference, decorative website stack, restrained floating motion, and continuous company strip remain the direction. ENERGY 2 / RHYTHM 3 / MOTION 2.

- Removed the two visible pause controls at the owner's request. Reduced motion and hidden-document handling remain in the motion code.
- Hero choices now read Company Profile, Online Store, and Custom. Their underline-only treatment is the owner's latest instruction. Actual secondary actions, template filters, feature tabs, and duration controls receive visible borders.
- Updated the requested domain wording to `Domain gratis 1 tahun (langganan 12-24 bulan)` and placed the requested `Our partners` label above the existing company strip.
- The existing six example wordmarks were explicitly requested by the owner as random logos. The owner subsequently requested the `Our partners` heading. This is an explicit instruction override of the skill's default placeholder requirements, not independently verified partnerships. No additional company or testimonial assets were created.
- Reserve height on the complete hero copy instead of the heading/description block. Shorter slides no longer leave an empty area above the service choices, while the overall hero keeps the same height.
- At widths up to 1050 px, anchor `Pesanan baru` 12 px from the image area's top and right. Clear its inherited bottom anchor and restore its mobile display. Text remains below the photograph. Parent motion is retained.

## Observed verification

- `npm run build`, `node --check dist/hero.js`, and the CRLF-aware `git diff --check` passed.
- Mobile 390 x 844: Online Store tab click selects its panel. Panel height 346 px, main card height 320 px. Badge y=495.83..546.63, image y=483.83..674.58, copy starts y=674.58. The badge is contained in the photo and separated from the headline. Screenshot saved as `rasiolabs-mobile-store-v59.png` in the parent workspace.
- Mobile 320 x 740: badge y=540.25..591.05, image y=528.25..695.25. No badge/copy overlap. Panel remains 346 px; page has no horizontal overflow.
- Tablet 900 x 800: badge remains inside the 148 px photograph, with its bottom 85.2 px above the copy. Panel remains 346 px; no horizontal page overflow. Positions were read after responsive reflow, so the panel was outside the viewport at that observation.
- Desktop 1366 x 768: Company Profile and Custom selections were clicked and subsequently observed as selected. Both keep an 8 px gap from description to choices and hero height 695.8 px. CTA bottoms 504.65 and 478.4 px remain inside the initial screen.
- Hero pause controls count is zero. Company logo strip still moves; the two equal-width groups and hidden duplicate semantics are retained.
- Earlier v59 checks: hero choices fit one row at 320 px with 44 px targets; feature tabs fit with 58 px targets and no clipped labels. Store panel click and keyboard ArrowRight update the selected state and show the blue focus ring.
- Changed secondary action dark-blue text/border on white and darker hover state remain readable. Neutral selector borders #7888A3 have 3.59:1 contrast on white; active controls use brand blue. The order badge uses dark #152444 text on white, with secondary text #667086, both readable at their actual size.
- Browser application error/warning logs returned no entries. Screenshot proof also saved as `rasiolabs-homepage-v59.png` in the parent workspace.
- Reduced motion was reviewed in source; no unsupported browser emulation is claimed. Payment, CMS, accounts, template routes, and data flows were unchanged and were not retested. Prior broader coverage is recorded in v56-v58 reports.

## Owning-agent Anti Slop delivery gate

Gate scoped to the changed UI and copy. The user's existing testimonial/example instructions and current company-strip instruction override the skill's default content requirements.

### Hard gate

- R-02 PASS: new UI copy contains no em dash.
- R-03 PASS: mobile/tablet geometry above proves no badge overlap or page overflow; changed selectors fit at 320 px.
- R-17 PASS: prices retained from the owner's approved schedule; no new business statistics.
- R-18 PASS: no testimonial added or changed.
- R-23 PASS: no asset or new navigation structure created; existing owner-requested logos retained.
- R-24 PASS: real package IDs, service pages, and consultation destinations retained.
- R-25 PASS: dark order-badge text on white and blue/white CTA states remain legible; selector borders meet non-text contrast.
- R-26 PASS: selected hero/feature states and keyboard tab behavior were observed; no new dead control.
- R-27 PASS: no asynchronous data feature added; existing loading, empty, and error flows unchanged.
- R-28 PASS: existing product-specific FAQ unchanged.
- R-32 PASS: hero targets are 44 px, mobile tabs 58 px; focus outlines retained and observed.
- R-33 PASS: edits written directly in source HTML, CSS, and JS; normal build produces client output.
- R-34 PASS: no theme toggle added.
- R-35 PASS: build, syntax, diff, scoped click-through, logs, screenshots, and responsive geometry recorded above.
- R-36 PASS: no new performance/security/customer result claim. Requested partner heading is an explicit owner instruction, not a verified endorsement.
- R-37 PASS: owner's reference and during-mode choice persist; declared direction retained.
- R-38 PASS: example logos and partner heading retain explicit owner authorization; no new invented content.

### Purpose gate

- R-01 PASS: blue continues to identify primary actions and active services.
- R-04 PASS: check mark communicates an order confirmation; no generic icon set added.
- R-06 PASS: existing readable DM Sans retained; no extra typeface introduced.
- R-07 PASS: existing localized hero perspective floor retained; no background pattern added.
- R-08 PASS: primary action arrow retained; no arrow added to the secondary consultation action.
- R-09 PASS: no new promotional or trust badge.
- R-10 PASS: mobile photo copy and order badge remain opaque.
- R-12 PASS: existing badge elevation separates it from the photograph; no new large shadow.
- R-13 PASS: no extra glow introduced.
- R-14 PASS: equal panel heights prevent page jumps; main photo and supporting visuals retain different roles.
- R-19 PASS: existing levitation, perspective, and company loop retain separate purposes; reduced-motion handling remains after requested visible-control removal.
- R-22 PASS: no illustration asset added.

### Liveliness

- PASS: ENERGY 2 / RHYTHM 3 / MOTION 2 retained; blue headline and dimensional stack remain the focal point.
- PASS: compact text-to-choice spacing and separate photo/copy regions use structural whitespace.
- PASS: brand-blue accent and code symbol retain the owner's identity motif.
- PASS: design direction established before these incremental changes.

### Craftsmanship and quality locks

- C-1 PASS: each change addresses an explicit request or the observed mobile overlap.
- C-2 PASS: existing interactions retain their real behavior and destinations.
- C-3 PASS: no extra section or filler text added.
- C-4 PASS: responsive geometry, screenshots, and source/build checks recorded.
- C-5 PASS: changes stay within established spacing, typography, colors, and motion.
- R-05/R-11/R-15/R-16/R-20/R-21/R-29/R-30/R-31 PASS: existing hierarchy and design tokens retained; underline-only choices deliberately distinguished from actual actions; mobile photo/copy layout has no overlap.

Overall scoped delivery gate: PASS.
