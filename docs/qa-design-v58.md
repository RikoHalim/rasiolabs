# Rasio Labs revision v58

2026-10-08. Anti Slop applied during design, using the owner's session choice.

## Direction and scope

Managed website service for business owners. The owner's Nexora reference supplies the bright white and blue direction, dimensional hero, compact actions, and sliding company row. ENERGY 2 / RHYTHM 3 / MOTION 2. Rasio Labs keeps its logo, managed-service copy, architecture/store/ERP previews, pricing, templates, and existing routes.

This revision improves the hero components, pointer perspective, company marquee, mobile service grid, review heading, and FAQ action. It does not change payments, accounts, CMS data, or template page navigation. Their previous coverage is recorded in qa-layout-v56.md and qa-design-v57.md; those broader tests were not rerun here.

## Decisions

- The blue code symbol remains #0C55FC. Blue headline emphasis and primary actions connect to that identity. White surroundings keep the three business website previews readable.
- Price and actions precede the compact feature checklist. The circular arrow belongs only to the main hero action, making the package action distinct from the consultation link.
- The sphere and faint perspective floor stay behind the preview stack. They carry the dimensional direction explicitly requested in the reference; they do not become a repeated page background. The small code mark reinforces the Rasio Labs identity.
- The floating wrapper, preview-slide transforms, and pointer perspective use separate transform levels. Pointer angles are clamped to 5 degrees vertically and 7 horizontally, derived from the stable parent bounds, and written through one animation frame.
- Pointer tilt runs only for a mouse with a fine pointer. It resets on leave, cancel, resize, hero pause, reduced motion, and document hiding. The stack remains decorative and has no destination.
- Six original example wordmarks were explicitly requested after the owner selected company logos and answered "Beri logo random saja". The strip has no claim that these are verified customers, partners, or endorsements. This is an owner-authorized example asset exception to the skill's default content rules.
- Two equal-width logo groups cover at least one full marquee window each. Their continuous leftward loop has an independent keyboard-operable pause button. Reduced motion stops it, hides the repeated group and control, and wraps the original logos.
- Mobile service cards now use 320 px rather than 376 px. The panel is 346 px rather than 402 px. Visuals consume the available space and text follows immediately, removing the previous empty gap caused by margin-top:auto. The three tab panels retain the same height.
- Mobile tab names are Profile, Store, and Custom, with full RasioLabs names kept as accessible labels. Desktop keeps the full visible names. The main-card copy names the actual service in fewer words.
- Support cards retain illustrated CMS, search, catalog, payment, shipping, and operational capabilities, rather than adding a duplicate generic feature section. Their card borders and small shadows provide structure, while the main photographic tile remains prominent.
- The review marker now explicitly sets both color and -webkit-text-fill-color. The FAQ action is filled blue with white text, including its focused and hovered states.

## Observed verification

- Final npm run build completed. node --check dist/hero.js passed. Source/client hashes match for hero.js and clean-layout.css. git diff --check passed.
- Desktop 1280 x 600: all three hero choices retain CTA bottom y=486.55 and hero bottom y=600.6. The next section is below the initial screen. No horizontal overflow.
- Desktop 1366 x 768: CTA bottom y=608.55 and hero bottom y=768.6. Pointer positions produced Y=-5.31 degrees on the left and +5.45 on the right, and X=+3.80 at the top versus -2.91 at the bottom. Leaving to the pause button clears both variables.
- Hero pause changes levitation to paused while the independent logo strip stays running. Resume restores motion. Profile/Store/Custom selections update heading, price, features, visual, and real CTA destination.
- Desktop 1920 x 1080: hero bottom y=1080.6, CTA bottom y=781.05, template collection y=1181.4. Logo group and visible marquee window both measure 1216 px.
- At 1366 px, marquee window/group/track widths are 1207.2 / 1207.2 / 2414.4 px. Pause keeps exactly the same transform across separate observations. Space on the pause control resumes the strip and changes its accessible label.
- Mobile 390 x 844: hero CTA widths are 335.2 px and heights 53.8 / 48.2 px. Template collection document position stays 1293.4 across all three hero choices. Pointer perspective uses the fixed mobile angle.
- Mobile 390 x 844 and 320 x 720: each service panel is 346 px, each card 320 px, and all text fits. The previous middle whitespace is absent. Copy bottoms end at the card border (0.8 px border difference), without clipping. Switching the three panels leaves scroll position unchanged at 390 px.
- At 320 px, the three shortened tab buttons are 85.7 x 44 px and fit inside the 276.8 px tab bar.
- Desktop service panels all measure 442 px for Profile, Store, and Custom. Text does not overflow. Tablet 900 x 900 retains 346 px panels and 320 px cards with no clipped text.
- The detail Store action navigates to /layanan-store.html and renders its purchase, consultation, template action, inclusions, and product/payment/shipping content.
- Mobile menu opens and Escape closes it. The selected tab state and accessible names are retained. FAQ CMS question toggles aria-expanded to true. Keyboard focus has a visible blue outline.
- Review marker computed color and -webkit-text-fill-color both equal rgb(12,85,252), giving 5.26:1 on #F4F7FC. FAQ normal white/blue contrast is 5.64:1. The focused action remains white on darker blue with a 2.4 px blue focus outline. Hero primary white on blue is at least 5.64:1 across its gradient; dark-blue hover is 9.55:1.
- Browser application error/warning logs returned no entries during the completed checks.
- Reduced-motion behavior was reviewed in source, not emulated through an unavailable browser capability. It disables autoplay, floating, pointer tilt, marquee animation, and affected transitions; the logo control is disabled and hidden, and the duplicate logo group is hidden.

## Owning-agent Anti Slop delivery gate

The following gate is scoped to this revision. Existing owner-requested testimonial and template metric examples remain an explicit instruction override; no new customer result or performance claim is introduced.

### Hard gate

- R-02 PASS: newly authored UI copy contains no em dashes; unchanged template titles keep their existing wording.
- R-03 PASS: 320, 390, 900, 1280, 1366, and 1920 px checks show no horizontal page overflow or clipped changed text; controls are at least 44 px.
- R-17 PASS: no new statistics; service prices and benefits retain owner-provided values.
- R-18 PASS: no testimonial added; existing examples retain the owner's explicit authorization.
- R-23 PASS: original brand assets retained; the owner explicitly requested random company logos and supplied the dimensional reference.
- R-24 PASS: changed actions retain existing package IDs, service routes, and WhatsApp destinations; Store detail was navigated.
- R-25 PASS: review text fill was checked separately from color; corrected review and FAQ action ratios exceed AA, and changed mobile text is readable.
- R-26 PASS: hero choices, pause/resume, pointer reset, company pause/Space resume, tabs, mobile menu, FAQ accordion, and detail action have observed behavior.
- R-27 PASS: no data flow changes; existing empty/loading/error states retain v56 coverage. The marquee has local static content rather than a fetch state.
- R-28 PASS: FAQ remains specific to payment/account access, CMS, activation, multivendor, and domain setup.
- R-32 PASS: Space resumes the company slider, Escape closes the mobile menu, focus outlines remain visible, and mobile tabs keep full accessible labels.
- R-33 PASS: changes were authored directly in HTML, CSS, and JS. The normal build only produces client output and cache versions.
- R-34 PASS: no theme toggle or second theme was introduced.
- R-35 PASS: final build, syntax, source/client checks and changed-control click-through are recorded above; unchanged application flow coverage is not claimed as rerun.
- R-36 PASS: no fabricated security or performance claims; the example-logo strip contains no verified-client or endorsement claim.
- R-37 PASS: the owner's explicit Nexora image and requests set the direction and motion; existing during-mode choice persists.
- R-38 PASS: six example logos are explicitly owner-authorized assets, without a customer claim; real pricing and existing service content are retained.

### Purpose gate

- R-01 PASS: brand blue identifies actions; the single sphere and localized gradients supply requested preview depth.
- R-04 PASS: the code mark is the supplied brand symbol; check marks and pause controls communicate actual functions, without a generic feature icon set.
- R-06 PASS: established DM Sans is retained for a compact, readable managed-service interface; logo wordmarks use limited variation.
- R-07 PASS: the faint perspective floor serves the owner's requested dimensional hero; it is localized behind the stack, not used as a site-wide grid.
- R-08 PASS: the white arrow circle distinguishes the primary hero action; the secondary consultation link has no arrow.
- R-09 PASS: the small brand label identifies who manages the website; it adds no unsupported New/Beta/trust status.
- R-10 PASS: new components are opaque; feature-photo copy explicitly removes inherited blur.
- R-12 PASS: larger elevation stays on the main stack; support cards have shallow border shadows.
- R-13 PASS: no extra glow on logos or feature cards; the hero shadow expresses depth.
- R-14 PASS: the main photo and supporting capability visuals have different roles; equal mobile heights prevent tab-induced jumps.
- R-19 PASS: owner-requested hero levitation, pointer response, and company loop have separate motion responsibilities and pause/reduced-motion handling.
- R-22 PASS: the preview shows service categories and uses the original mark; no generic character illustration was added.

### Liveliness and craftsmanship

- Dials PASS: ENERGY 2 / RHYTHM 3 / MOTION 2 match the stated bright brand, varied content sections, and localized motion.
- Focal point PASS: the headline and large stack organize the first screen; mobile keeps readable actions before the benefit list.
- Whitespace PASS: desktop reserves the first screen; mobile feature visuals and copy fill their cards without the earlier blank gap.
- Accent PASS: original brand blue remains the principal accent, with white and navy text around it.
- Identity PASS: managed-service wording, actual sector previews, blue code mark, package rules, and CMS control distinguish Rasio Labs from the reference SaaS product.
- Design read PASS: page kind, audience, reference direction, and motion responsibilities are recorded before the gate.
- C-1 PASS: major decisions have explicit hierarchy, identity, or interaction reasons above.
- C-2 PASS: changed controls have real observed actions; previews and example logos remain noninteractive.
- C-3 PASS: the logo loop is explicitly requested, and the existing capability grid is improved rather than duplicated.
- C-4 PASS: changed layouts hold on phone, tablet, and desktop; keyboard checks pass and reduced-motion source behavior is documented honestly.
- C-5 PASS: no new fact is presented as a verified customer outcome; owner-authorized example assets are recorded as an explicit exception.
- R-05 PASS: catalogue comparison, capability imagery, pricing, FAQ, and reviews retain distinct content roles. The requested logo strip adds no generic trusted-by claim.
- R-11 PASS: small labels, 8–12 px controls, 18 px preview cards, and underlined service selectors use varied radii.
- R-15 PASS: package viewing, consultation, and service detail actions retain concrete destinations.
- R-16 PASS: no new AI marketing buzzwords or unsupported promotional claims.
- R-20 PASS: three business previews, managed-service copy, and the code mark anchor the design in Rasio Labs.
- R-21 PASS: light remains the default; dark sections already identify AI and selected services.
- R-29 PASS: brand blue, white, navy, and muted neutrals form the primary palette; sector previews retain their own styling.
- R-30 PASS: composition and component principles follow the supplied reference; its logo, copy, imagery, and source code are not copied.
- R-31 PASS: color, typography, depth, spacing, mobile card sizing, logo movement, and pointer motion all have written purposes.
