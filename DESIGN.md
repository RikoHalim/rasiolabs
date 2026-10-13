---
version: alpha
colors:
  primary: "#0c55fc"
  form-ink: "#182d38"
  form-surface: "#ffffff"
  field-border: "#6e7a78"
  field-error: "#a32323"
  focus: "#0874d3"
omitted:
  - section: typography
    reason: "Template families own separate font pairs; the exact sources and roles are recorded below."
  - section: rounded
    reason: "Shape differs by sector; existing runtime styles remain canonical."
  - section: spacing
    reason: "Composition-specific geometry remains canonical in each template stylesheet."
  - section: components
    reason: "Shared controls are implemented by the files mapped below, rather than a second component token layer."
---

## Overview

Rasio Labs sells managed, editable company-profile websites. Templates are marketing/content sites with enquiry tools; the admin, authentication and billing application is a separate register. This revision extends the template catalogue and does not redesign billing or authentication.

Each family supports ten purposeful pages. Clients edit identity, copy, photos, contact details and approved navbar destinations. Routes, typography and layout remain part of the selected template. Enquiries prepare a reviewed WhatsApp or email message; no availability, paid reservation, transport quote or shipment tracking is fabricated.

The reference study draws on Cowboy's product photography and purposeful model selection, Apple's large visual chapters, Vercel's restrained hierarchy, and Linktree's confident colour. Yapp's public content was inspected, but its browser page stopped at a security verification screen. The latest owner-supplied Aeline, avatar-fan and Upmind screenshots strengthen the direction toward immersive photography and layered composition. No reference assets or layouts are copied. The October 12 composition decisions and self-critique are recorded in `docs/template-art-direction-v61.md`.

## Colors

Runtime CSS remains canonical (token ownership Model B). Shared form colours above map to `dist/business-templates.css`; field-error maps to that file and `dist/template-modern.css`; focus maps to the shared focus-visible rule. Each family owns `--ink`, `--paper` and `--accent` in its stylesheet. Logo blue retains the supplied original artwork.

The primary token records Rasio Labs logo blue; each template retains its own action palette. Logistics uses blue-grey paper `#edf1f3`, port ink `#132b3a` and industrial orange `#a33c18`, with light amber on its dark hero. Hospitality uses garden ink `#142e29`, pale paper `#f3f5f1` and deep green `#204c45`. Catering uses warm paper `#fbf7f8`, aubergine ink `#382139` and pale citrus `#e7edb5`. Form error text uses a white backing where an inherited dark surface would lower contrast. Photographic overlays protect stationary copy from the image beneath it.

## Typography

| Family | Display / reading fonts | Reason |
| --- | --- | --- |
| Architecture | DM Serif Display / Manrope | Spatial editorial headings with practical project information. |
| Padel | Barlow Condensed / Barlow | Court signage and an energetic club identity. |
| Creative | Space Grotesk / Work Sans | Composed studio work, without a dashboard aesthetic. |
| Consulting | Plus Jakarta Sans | Clear business reading and restrained decision hierarchy. |
| Hospitality | Fraunces / DM Sans | A place-led invitation with legible stay information. |
| Catering | Newsreader / Hanken Grotesk | Food and menu editorial, with simple enquiry controls. |
| Logistics | Archivo Narrow / Archivo | Transport typography with readable operational detail. |

Existing font pairs are declared in `scripts/profile-modern-design.mjs`; new pairs are declared in `server/templates/{hospitality,catering,logistics}.mjs`. Generators emit the corresponding stylesheets. No single font or hero arrangement is imposed on all families.

All template faces are self-hosted with their licenses in `dist/assets/fonts`. `scripts/template-fonts.mjs` owns heading/body preloads and the final build replaces external font stylesheets. Optional font display avoids late layout shifts. Creative's desktop fan becomes a horizontally scrollable, keyboard-accessible photo gallery on narrow screens so the discipline labels remain readable.

## Layout

| Family | Composition signature | Energy / rhythm / motion |
| --- | --- | --- |
| Architecture | Immersive space photograph, measured frame, anchored discipline rail and project chapters | 3 / 3 / 3 |
| Padel | Condensed court typography, panoramic court window, session rail and club programmes | 3 / 3 / 3 |
| Creative | Dark studio stage, lilac accent, photographic fan, typographic work index and case studies | 3 / 3 / 3 |
| Consulting | Atmospheric blue photograph, centered statement, decision dock and practical workshops | 3 / 3 / 3 |
| Hospitality | Immersive place photograph, framed detail, room comparison and stay guide | 3 / 3 / 3 |
| Catering | Aubergine food composition, staggered photography, menu rows and event briefs | 3 / 3 / 3 |
| Logistics | Port panorama, functional dispatch panel, horizontal service rows and cargo tools | 3 / 3 / 3 |

The main content stays within a 1240px maximum on new families. Tablet navigation switches at 800px, and the single-column phone layout has 20px side gutters. Photos reserve dimensions and capped heights. Tabs reserve compatible geometry; controls never depend on hover alone. No scroll hijacking or compulsory multi-screen pinning is introduced.

## Elevation & Depth

Depth comes primarily from photography, image crops and section contrast. The Creative fan and Consulting decision dock have shadows to separate actionable foreground content from their scenes. Static editorial sections and every card do not float simultaneously. The hero remains visible at first paint; motion must not hide it after it has appeared. Large reading areas and forms settle to motion 1 despite the expressive openings.

## Shapes

Architecture uses spatial proportions, Padel court geometry, Creative compositional crops, Consulting decision lines, Hospitality framed views, Catering plate/ingredient compositions, and Logistics cargo routes. Per the owner's October 13 preference, all seven families share a floating rounded-rectangle navbar. Colours and typography remain family-specific. `dist/template-navigation.css` owns its final geometry, mobile dropdown spacing and sticky placement.

## Components

Canonical owners:

- Routes and approved client navigation: `server/profile-pages.mjs`.
- Content validation and CMS fields: `server/model.mjs`; all approved page destinations are selectable.
- Escaped client content, topic labels and contact replacement: `server/profile-renderer.mjs`.
- Menus, filters, accessible tabs, galleries and existing brief tools: `dist/profile-pages.js`.
- Authored inline field errors and first-invalid focus: `dist/template-validation.js`.
- Growing multiline fields: `dist/template-validation.js`, with a readable minimum and a viewport-relative cap; CSS disables manual resizing in enquiry and brief forms.
- Date, volume and contact rules: `dist/business-enquiry.mjs`; new enquiry review: `dist/business-templates.js`.
- Existing family chapter motion: `dist/template-motion.js` and `dist/template-legacy-expansion.css`.
- Architecture, Padel, Creative and Consulting hero composition and per-family chapter refinements: `scripts/profile-modern-design.mjs` and `dist/template-signatures.css`. This stylesheet follows `template-modern.css` and owns the signature components without changing shared enquiry contracts.
- New family motion: each family CSS plus `dist/business-templates.js`.

Motion carries meaning: a measured architecture sweep, padel court travel, creative crop composition, consulting decision progression, hotel camera movement, catering image aperture, and cargo route travel. Reduced motion disables decorative animation. Infinite movement is confined to a small non-essential diagram or photographic effect; text, controls and reading layouts remain stable.

## Do's and Don'ts

Use real sector photography, concrete page titles and actionable enquiries. Preserve keyboard focus, native control semantics, sufficiently large targets and AA text contrast. Keep every page reachable from a relevant parent or footer. Use useful FAQs instead of repeated marketing cards.

Do not introduce invented live booking, tracking, teams, testimonials, security claims or business performance. Existing owner-approved preview statistics stay separate from client data; new clients start with statistics disabled. Do not add Demo markers, photo credits, source labels or unnecessary explanatory text to the product UI.

Verification includes the actual Worker client renderer, page graph and CMS field hooks, browser navigation, form errors and review, gallery focus, reduced motion, and narrow-to-desktop layout inspection. The root agent records the Anti Slop delivery gate separately after verification.
