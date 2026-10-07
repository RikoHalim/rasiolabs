# Layout revision v56

## Scope and direction

2026-10-07. This review covers the edited marketing layout, spacing, template statistics, and text colors. It does not certify real payment processing or email delivery. Store checkout retains its existing unavailable-template state; the current catalogue contains four Profile templates.

Reading this as a managed website service for Indonesian business owners, with compact blue and neutral surfaces, ENERGY 2 / RHYTHM 2 / MOTION 2. Architecture uses ENERGY 1 / RHYTHM 2 / MOTION 1; Padel 2 / 2 / 2; Creative 2 / 3 / 2; Consulting 1 / 2 / 2.

The final direction keeps the template collection below the first desktop screen. Hero content starts near the navbar, with larger typography and a wider preview stack; the section reserves the viewport height without vertically centering the text too low.

## Design reasons

- Blue is the Rasio Labs brand accent. Dark blue identifies Store pricing and AI; white and neutral backgrounds keep the other sections readable.
- Shallow shadows distinguish cards from their surfaces. Pricing cards retain their static hover behavior; other existing motion remains.
- Desktop spacing uses 44–60 px section padding, with 40–46 px on mobile. FAQ keeps additional internal room: 24 px after its title, 14 px between questions, and 32 px intro-card padding (26 px on mobile).
- Three equal catalogue columns keep template previews compact. The 1.9 thumbnail ratio reduces desktop media height from 248.7 px to 196.3 px at 1366 px.
- Audience cards use 16 × 18 px padding, an 88 px minimum height, and separate label/body typography.
- Statistics use four sector-specific compositions: architecture strip, centered padel cards, stepped creative composition, and a consulting lead figure. CMS content fields remain intact.
- Template demonstration numbers follow the user's explicit request. They are not installed as claims on new client websites: client defaults are empty and the statistics section is disabled.
- Existing owner-authorized testimonial examples and English template titles are retained. No new testimonials, decorative labels, images, or marketing claims were added in this revision.

## Verification evidence

- Final build: `npm run build` succeeded.
- Application checks: `npm test` passed 48/48 using the local runtime permissions required by Miniflare. The restricted run could not start the Worker runtime; the permitted rerun completed.
- Desktop: audited rendered text and overflow on all 31 template pages at 1366 × 768. No solid/gradient text failures. Padel photo-overlay text was reviewed visually.
- Mobile: reviewed all 31 template pages at 390 × 844. Narrow layout checks covered the homepage and all four template roots at 320 × 720; no horizontal overflow.
- Marketing pages: homepage, three service pages, portfolio, tutorial, blog, CMS login, checkout states, and three current-news articles checked at desktop and mobile sizes. Text clipped to gradients and text over photographs received visual review.
- Feature tabs: Profile, Store, Custom each measured 442 px panel height and 790.4 px section height at 1366 px after switching.
- FAQ: clicked all five questions and observed their `aria-expanded` states change. The title/CTA spacing was reviewed at desktop and mobile sizes.
- Template sector filter: selecting Studio Kreatif showed only Creative Studio; selecting Semua sektor restored the collection.
- Hero: Profile selection and slider pause worked. Desktop hero fills the available viewport; collection begins at y≈769 for 1366 × 768 and y≈1081 for 1920 × 1080. Copy begins at y≈101 and y≈125 respectively; purchase/conversation CTAs remain visible.
- Short desktop: at 1280 × 600, template collection begins at y≈601 and the CTA row ends at y≈506. No horizontal overflow.
- Template refresh: all four roots retained main/heading opacity 1 and no heading clipping after reload. Initial main fade removed; the first intersection observation leaves visible content stable. Later scroll entrances retain sector-specific motion with backwards fill during stagger delays.
- Checkout Profile: 1 month displayed Rp109.000 + domain and excluded free domain; the offer button switched to 48 months/Rp1.308.000; 12 months displayed Rp654.000. Summary and crossed prices were darkened. Store's empty catalogue state remains explicit.
- Mobile menu opened and closed through Escape. Existing focus/hover cascades were reviewed, including corrected padel/creative navigation hover colors. No new interactive controls were introduced.
- Keyboard focus: Tab from the Profile slider control selected Store with a visible blue 2.4 px outline.
- Local browser error log check returned no application errors.
- Saved proof: workspace `rasiolabs-homepage-hero-v56.jpg` and `rasiolabs-faq-v56.jpg`.

## Anti Slop delivery gate

The gate below applies to this revision. Existing owner-specified designs, example content, and unchanged integrations are not represented as newly audited production capabilities.

### Hard gate

- R-02 PASS: no new prose uses an em dash; owner-selected English catalogue titles retained.
- R-03 PASS: desktop/mobile template checks and 320 px root checks found no horizontal overflow.
- R-17 PASS: requested template example metrics are isolated from empty, disabled client defaults; the model and Worker statistics tests passed.
- R-18 PASS: no testimonials added; existing examples expressly requested by the owner retained.
- R-23 PASS: no visual assets or navigation structure added.
- R-24 PASS: inspected navigation targets resolve to existing sections and pages.
- R-25 PASS: affected text colors corrected; 31 desktop template pages and all mobile templates reviewed, including photo/text-gradient exceptions.
- R-26 PASS: edited components preserve real links and tested toggles; Store's unavailable-template state does not pretend to take orders.
- R-27 PASS: existing CMS loading and checkout empty states retained and inspected.
- R-28 PASS: five FAQ questions concern access, CMS, activation, multivendor, and domains.
- R-32 PASS: mobile Escape close worked; existing focus styles remain and hover cascades preserve readable text.
- R-33 PASS: changes live in source styles, source page builders, model defaults, and tests; generated output rebuilt by the normal project build.
- R-34 PASS: no theme toggle exists in the edited surfaces.
- R-35 PASS: final build and 48 application tests passed; changed UI states and catalogue/FAQ/service navigation checked locally.
- R-36 PASS: no new security, customer, or performance promises added.
- R-37 PASS: direction and dials derive from the owner's detailed design brief.
- R-38 PASS: new client sites receive no invented business metrics; retained template/review examples are owner-authorized.

### Purpose gate

- R-01 PASS: blue gradients differentiate Store pricing and AI from the general catalogue.
- R-04 PASS: no new icons; existing checklist/domain/menu icons retain their content purpose.
- R-06 PASS: four existing sector font systems preserved; smaller hierarchy improves scanning.
- R-07 PASS: no decorative background pattern added.
- R-08 PASS: no decorative arrows added; existing link/navigation cues retained.
- R-09 PASS: existing discount badges communicate actual configured duration discounts.
- R-10 PASS: no glass effect added.
- R-12 PASS: smaller catalogue/review/blog shadows identify card edges without broad elevation.
- R-13 PASS: no glow added.
- R-14 PASS: statistics layouts vary by sector; equal catalogue sizes aid comparison.
- R-19 PASS: existing sector motion preserved, manual feature tabs retain equal heights, and no competing animation added.
- R-22 PASS: no generic illustrations added.

### Liveliness

- Dials PASS: declared above for main site and each sector.
- Consistency PASS: compact main layout; sector compositions remain distinct.
- Focal point PASS: hero title and decorative template stack dominate the introduction.
- Structural whitespace PASS: top-aligned hero copy, viewport-sized introduction, tighter section cadence, and explicit FAQ internal gaps.
- Accent PASS: brand blue reserved for emphasis and primary controls; sector accents remain separate.
- Identity PASS: original blue code mark and sector typography retained.
- Design read PASS: taken from the owner's explicit brief before revision.

### Craftsmanship and consistency

- C-1 PASS: principal decisions have reasons recorded above.
- C-2 PASS: no inert controls introduced; toggles/filter/duration behaviors tested.
- C-3 PASS: no filler section added.
- C-4 PASS: checked desktop/mobile layouts and Escape navigation behavior.
- C-5 PASS: no new real-business claims; client metric defaults stay empty.
- R-05 PASS: existing owner-requested sections retained; statistics layouts and section density vary with content.
- R-11 PASS: card, control, and template radii remain differentiated.
- R-15 PASS: no new generic CTAs added.
- R-16 PASS: no new marketing buzzwords added.
- R-20 PASS: Rasio Labs managed-service positioning and four sector identities preserved.
- R-21 PASS: light marketing layout retained; dark sections remain requested emphasis areas.
- R-29 PASS: main palette remains blue, white, and neutrals; template palettes are sector-specific.
- R-30 PASS: no reference site's assets, page markup, or visual composition copied.
- R-31 PASS: layout, type, color, spacing, card, and motion purposes recorded above.
