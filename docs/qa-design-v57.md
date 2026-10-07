# Rasio Labs design revision v57

2026-10-08. Anti Slop applied during design, as selected by the owner.

## Direction and scope

Reading this as a managed website service for business owners, with a bright blue and white product-led introduction: ENERGY 2 / RHYTHM 3 / MOTION 2. The owner's supplied SaaS reference guides hierarchy and depth; Rasio Labs keeps its own logo, content, product previews, navigation, and layout.

This revision updates the homepage hero, several lower-section surfaces, shared header, and template navigation motion. Existing service content, pricing, checkout, CMS, and sector-specific template layouts remain. It does not certify payment processing or email delivery. Prior broader checks are recorded in `qa-layout-v56.md`; its 48 application tests were not rerun for this presentation-only revision.

## Decisions and reasons

- Original brand blue #0C55FC emphasizes the headline and actions; white and pale blue keep the business previews readable. The blue code symbol remains blue, including on the ERP preview's white wordmark.
- DM Sans retains the site's established approachable, compact typography. The hero uses weight and blue text rather than highlighter blocks, uppercase labels, decorative arrows, or a pill above the title.
- The tilted three-service preview stack is the visual focal point. A separate wrapper levitates 14 px over an 8-second cycle, so floating motion does not conflict with the previews' slide transforms.
- Endless levitation is explicitly requested by the owner. The pause button stops both autoplay and levitation, preserving the floating phase. Reduced motion disables both; hidden tabs pause motion and settle pending text transitions.
- Profile, Store, and Custom labels make manual slide selection understandable. The stack remains decorative and cannot be clicked.
- Desktop hero height reserves the first screen while its copy and CTA stay visible. Mobile stacks the content with full-width controls; it uses content height rather than an oversized empty viewport.
- Store pricing uses a restrained blue gradient, AI uses navy, and reviews use pale neutral surroundings with white cards. These distinguish service selection, AI explanation, and reviews without introducing extra sections.
- FAQ uses an open left heading and individually spaced question rows. The inherited white heading was corrected to dark navy after visual QA.
- Large elevation is reserved for the hero preview. Catalogue, review, and blog cards use shallow shadows. Pricing cards retain their owner's requested static hover behavior.
- Native template page links replace an outgoing fade that canceled its animation before navigation and restored the old page. Sector-specific in-page scroll entrances and interaction animations remain.

## Verification

- Final `npm run build` succeeded; `node --check dist/hero.js` and `node --check dist/template-motion.js` passed.
- Source and client copies of hero.js, clean-layout.css, and template-motion.js match after the build.
- Desktop first-screen checks: 1366 x 768 template collection starts at y=768.6; CTA bottom=646.3. At 1280 x 600, collection y=600.6 and CTA bottom=543.3. At 1920 x 1080, collection y=1080.6 and CTA bottom=845.2.
- Tablet 900 x 900, mobile 390 x 844, and narrow mobile 320 x 720 show no horizontal overflow. At 390 px the CTA bottom is 780.3. At 320 px both CTA widths are 264.8 px.
- Manual Profile, Store, and Custom selection updates heading, preview, price, features, and primary destination. Collection document position remains 768.6 desktop and 1218.1 mobile across the three choices.
- Floating wrapper transform changes between observations; computed animation is `labs-levitate`, 8 seconds, ease-in-out, infinite. Pause changes animation-play-state to paused. Resume restores running and autoplay.
- Mobile navigation opens, then Escape closes it. Tab from Custom selects the pause button with a visible blue 2.4 px focus outline.
- Desktop and mobile native links checked for all four families: Architecture -> projects; Padel -> club; Creative -> work; Consulting -> expertise. Each destination renders main opacity 1 with no horizontal overflow. No outgoing page fade remains in the script.
- FAQ CMS question toggles aria-expanded to true. Corrected FAQ heading is #10182D and eyebrow #244174. Review text remains dark on white.
- Rendered homepage text against solid backgrounds, excluding decorative aria-hidden previews, produced no WCAG AA contrast failures. Hero primary white/blue contrast is 5.64:1; outline CTA text is 10.08:1; pause text 9.29:1; secondary/pause borders 3.59:1 on white. Photographic and gradient surfaces were reviewed visually; prior template-wide contrast evidence remains in v56.
- Profile service page retains purchase, green WhatsApp consultation, template CTA, price, and separate inclusions after shared-header changes.
- Browser error/warning log check returned no application errors during the navigation checks.

## Anti Slop delivery gate

Gate assessed by the owning agent for this revision. Owner-authorized template statistics and testimonial examples remain an explicit exception to the skill's default content rules; they are not represented as verified client results. New client metric fields remain empty and disabled, as verified in v56.

### Hard gate

- R-02 PASS: no new prose introduces em dashes; existing page titles are unchanged.
- R-03 PASS: checked six viewport sizes and four template family routes; no horizontal overflow.
- R-17 PASS: no new statistics; existing requested template examples remain separated from empty client defaults.
- R-18 PASS: no new testimonials; existing examples were explicitly requested by the owner.
- R-23 PASS: no new visual assets or navigation structure; three existing preview visuals retained.
- R-24 PASS: changed CTA destinations use existing package IDs, service page, and WhatsApp; template routes navigated successfully.
- R-25 PASS: hero contrast ratios and rendered solid-surface audit passed; FAQ inherited white text corrected and visually verified.
- R-26 PASS: three slide choices, pause/resume, mobile menu, FAQ, and native template links have observed working behavior; remaining controls retain v56 coverage.
- R-27 PASS: no data flow changed; existing CMS loading and checkout empty/error states retained and previously checked in v56.
- R-28 PASS: FAQ remains specific to access, CMS, activation, multivendor, and domains.
- R-32 PASS: Tab displays focus; Escape closes the mobile menu; controls are at least 44 px in the changed hero.
- R-33 PASS: authored changes live directly in source files; normal build regenerates client output and template cache versions.
- R-34 PASS: no theme toggle exists in the edited surfaces.
- R-35 PASS: final build and syntax checks passed; changed interactive controls and desktop/mobile routes were exercised and recorded above.
- R-36 PASS: no new security, performance, or customer claims added.
- R-37 PASS: the owner's explicit reference and levitation request set the direction; design read was stated before editing and its dials are recorded above.
- R-38 PASS: no new fabricated content; owner-authorized examples retained without installing them as client metrics.

### Purpose gate

- R-01 PASS: pale hero gradient separates previews from the white copy; Store and AI gradients identify distinct content roles.
- R-04 PASS: no new decorative icon set; checklist, menu, WhatsApp, and pause icons communicate their actual controls.
- R-06 PASS: established DM Sans retains readable compact hierarchy; four template font systems remain distinct.
- R-07 PASS: no background grid or dot pattern added.
- R-08 PASS: decorative arrows removed from hero CTAs; existing external/navigation arrows remain.
- R-09 PASS: no new capsule label; discount badges still correspond to configured duration prices.
- R-10 PASS: header is opaque white; no new glass effect.
- R-12 PASS: larger shadow elevates only the hero preview; lower-card shadows are shallow.
- R-13 PASS: no decorative glow added; preview shadow expresses depth.
- R-14 PASS: equal catalogue sizes aid comparison, while service visuals and template sectors keep varied compositions.
- R-19 PASS: owner-requested floating focuses on one hero object; pause, visibility, and reduced-motion handling are explicit. Other animations retain their existing content purpose.
- R-22 PASS: no generic illustration asset added; hero visuals depict actual service categories.

### Liveliness

- Dials PASS: ENERGY 2 / RHYTHM 3 / MOTION 2 declared in the direction above.
- Consistency PASS: restrained blue emphasis, varied section surfaces, and localized hero motion match the dials.
- Focal point PASS: business headline and large preview stack organize the initial screen; lower sections use their own titles and content focus.
- Whitespace PASS: viewport-sized desktop hero, compact section padding, and explicit FAQ gaps serve hierarchy.
- Accent PASS: original brand blue is the main action and headline accent.
- Identity PASS: Rasio Labs blue code mark, managed-service positioning, and three distinctive service previews remain.
- Design read PASS: page kind, audience, bright blue direction, and localized motion were stated before edits.

### Craftsmanship and consistency

- C-1 PASS: major visual decisions have product reasons recorded above.
- C-2 PASS: changed controls work; decorative previews remain noninteractive.
- C-3 PASS: no filler section, fake logo row, or duplicate explanatory text added.
- C-4 PASS: desktop, tablet, mobile, keyboard, pause, reduced-motion source behavior, and native navigation reviewed.
- C-5 PASS: no new testimonial, metric, or performance claim; existing owner examples remain an explicit instruction override.
- R-05 PASS: existing content-driven sections retained; catalogue, pricing, feature visuals, AI, FAQ, and review density differ.
- R-11 PASS: controls use 8–11 px radii, preview frames 18 px, and lower cards 14–16 px; slide selectors are underlined labels.
- R-15 PASS: hero CTAs name package viewing and consultation; no new generic action text.
- R-16 PASS: no new AI marketing buzzwords.
- R-20 PASS: service management, CMS control, and sector previews remain specific to Rasio Labs.
- R-21 PASS: light layout remains default; dark blue only emphasizes selected sections.
- R-29 PASS: main palette is blue, white, and neutrals; template sector palettes remain independent.
- R-30 PASS: reference hierarchy inspired the revision; no reference assets, logo, copy, or markup copied.
- R-31 PASS: color, typography, spacing, card elevation, layout, and motion each have written reasons.
