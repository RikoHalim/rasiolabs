# Template functional audit, revision 61

Audit date: 10 October 2026, Asia/Makassar. This is a functional audit, separate from the owning agent's visual and Anti Slop delivery gate.

## Scope

The audit enumerates every generated page across the seven families registered in `server/profile-templates.mjs` and `server/profile-pages.mjs`: **70 pages, ten per family**. Its route coverage grows with the registry; there is no hardcoded page count. It checks the client renderer, not only the public template previews. Browser checks and publishing remain with the owning agent.

`tests/template-navigation.test.mjs` verifies:

- Every page has a heading and substantive main content. All local links, fragments, approved CMS navbar targets, scripts, styles, and image paths exist.
- Forms have a supported handler contract, validation inputs, feedback, and a non-JavaScript contact route. Tabs, filters, galleries, and brief preparation tools have their required targets and controls.
- The real Cloudflare `HTMLRewriter` runs through Miniflare with client content. Page links and navbar stay under the client's `/website/...` base. Preview catalog controls and the preview contact are replaced. Text is escaped, contact details are changed, and supported CMS text edits affect page content.
- The CMS does not offer fields that are absent from every page in the selected template.
- The actual shipped scripts run against focused DOM fixtures: mobile menu open/close, Escape, filter selection, tab keyboard navigation, gallery navigation and focus restoration, enquiry validation, WhatsApp/email preparation, missing-contact feedback, and enquiry-topic handoff.
- Map-based templates reject malformed or out-of-range CMS coordinates. Historical unused fields do not stop old clients saving and rendering supported edits.
- Every page is reachable from its family's home page. Gallery dialogs and embedded maps have accessible names.
- Every registered subpage is offered as an approved CMS menu destination, validated by the model, and rendered under the client's own website base. Unregistered destinations are rejected.
- Photographs are not recycled across sector families; a business logo is deliberately shared in the previews.
- The real preparation tool handles empty answers, review, clipboard success/failure, brief download, and one-time enquiry handoff without sending the visitor's data.
- The real legacy motion script keeps the initial viewport readable and does not animate when reduced motion is requested.
- The actual business motion script suppresses first-paint reveal effects while preserving the hotel camera pan; both its JavaScript and CSS respect reduced motion.
- Enquiry topics remove exact duplicate choices without losing the selected option, separately renamed offerings, or a custom handoff topic. Prepared WhatsApp/email messages use the same human labels and values as the review.

## Existing template usefulness

| Template | Pages | Real visitor task |
| --- | ---: | --- |
| Architecture | 10 | Browse spaces and project details, inspect photographs, review commercial design, prepare residential, renovation or commercial briefs, and contact the studio. |
| Padel | 10 | Compare sessions, coaching and memberships, plan a group event, inspect club/founders, read the player guide, find the location, and prepare a playing enquiry. |
| Creative | 10 | Filter work, inspect case studies, review brand/digital/packaging capabilities, prepare campaign or brand briefs, and plan a handover. |
| Consulting | 10 | Select expertise, review engagements and workshops, read perspectives, prepare a business/operations question, and contact the team. |
| Boutique Hotel | 10 | Filter rooms, explore room galleries, review experiences/dining/group stays, read the stay guide, find the location, and prepare an enquiry with valid stay dates. |
| Catering | 10 | Filter menus, compare wedding/corporate/private occasions, review kitchen and dietary planning, read event questions, and prepare a catering enquiry. |
| Logistics | 10 | Compare freight/storage/distribution, read cargo requirements, complete a preparation checklist, calculate package volume, and prepare a shipment enquiry. |

These are company profile and enquiry templates. A club session or hotel stay is confirmed by the business; the templates do not pretend to provide a live availability or reservation system. A logistics volume result is a dimensional calculation, not a carrier price or tracking service.

## Defects found

1. **Inert CMS fields in existing templates.** Padel exposed 15 editable fields without any page hook; Creative exposed one; Consulting exposed nine. Their edits could be saved without changing the website. The owning agent scoped the CMS to content that each design actually renders, rather than adding repeated sections merely to consume old fields. The coverage test now passes; old stored fields remain safely compatible through defaults.
2. **Enquiry handoff only recognised old page slugs.** New room, menu, or service links were not captured by the old `brief`, `contact`, and `visit#enquiry` listener. `dist/profile-pages.js` now recognises `[data-enquiry-topic]` directly, prefers the explicit topic, and uses a normalised home pathname to keep briefs separate between client sites. A focused client-room handoff test passes.
3. **New module integration checks.** The owning agent generalised public template routes, preserved client-contact rewriting for the new enquiry hook, validated editable map coordinates, and provided the new page modules. Generated-page and client-renderer checks pass across all seven families.
4. **Renamed offerings retained preview enquiry topics.** New room, menu, and service titles could change in visible CMS content while topic links and select options retained their original names. The new generator now binds those attributes and options to their CMS title keys, and the renderer changes both the option's label/value and the link's enquiry topic. Catering and Logistics topic lists derive from their editable offerings.
5. **Form resilience and accessible feedback.** Source review found fractional headcounts/package counts in the new enquiry generator, a date helper that accepted impossible calendar dates, and new forms relying on native validation bubbles. The shared validation now associates inline errors with controls, focuses the first invalid input and preserves entered values. Date and integer handling are repaired. The focused runtime fixtures pass.
6. **Contact and gallery semantics.** The hotel gallery lacked an accessible dialog name. The new mailto helper and renderer did not encode the email address, allowing malformed query text into a destination. The dialog now has a name; contact destinations encode addresses and reject query characters. The focused contact fixtures pass.
7. **Legacy offering names.** Padel, Creative, Architecture and Consulting enquiry radio choices retained preview service names after CMS changes. Their generated inputs and visible labels now use the editable service titles. Renamed offering checks pass for all seven families.
8. **Hotel related-room label.** The related-room action used a hardcoded title with different casing from its CMS title. It escaped automatic label binding and remained stale after renaming. The action now derives its name from the editable room title. Room detail metadata, footer labels, offering choices and related-room actions pass the client rename regression.
9. **Non-JavaScript submission.** JavaScript-owned enquiry and brief forms had no native action; without JavaScript their buttons could perform a default GET with visitor inputs in the address. Generated pages now hide those unsupported forms in a `noscript` fallback and offer a direct business contact route. Preparation tools also use the shared inline validation contract.
10. **Logistics destination mismatch.** The homepage Distribution action opened Freight. An explicit offering-to-page mapping now sends freight, warehouse and distribution to their respective detail pages. A regression checks both the homepage and service catalogue against each destination's actual title hook.
11. **Duplicate Catering enquiry choices.** Two default CMS offerings had the same Private dining value. The shipped runtime now removes exact duplicate options during form initialisation, preserving the selected option and distinct renamed offerings. Custom enquiry handoff topics still insert correctly. The prepared contact message also uses the review's human labels instead of machine field keys.
12. **Hotel camera motion disabled at first paint.** The shared motion initialiser applied a static animation override to the hotel's camera pan. Only that transform-only effect is now exempted; text, photo and aperture reveal effects remain static in the first viewport. A runtime regression verifies the exception, below-fold motion and reduced-motion handling.
13. **Legacy submit label described the wrong step.** The legacy enquiry button said Open WhatsApp although it prepared a local contact link. Generated buttons now say Review enquiry for every contact method, without runtime or renderer relabelling. The explicit Continue in WhatsApp / Continue by email action remains intact. Runtime and email-client Worker regressions verify the two steps and the encoded footer contact.

## Verification status

**Final functional test status: PASS.**

Command: `node --test tests/template-navigation.test.mjs tests/business-enquiry.test.mjs`.

Focused result: **31 tests passed, 0 failed**, after generation of all **70 pages**. Evidence is saved in `docs/functional-tests-v61.log`. The real Worker renderer ran outside the Windows sandbox because workerd's filesystem initialisation is blocked inside it. The test uses local assets and synthetic client data; it does not read credentials, call a public site, or send enquiries.

Full regression command: `npm test`. Final result: **79 tests passed, 0 failed**. Evidence is saved in `docs/tests-v61.log`.

Both results were rerun against the final generated assets, including the Review enquiry button and the latest shared form validation.

Evidence:

- Links, fragments, assets, substantive page content, and navbar options pass for every registered page.
- Every client's page link remains under its own base path, including all CMS-approved page menu targets; every enquiry form receives its client's WhatsApp and email; client text is escaped and applied to CMS hooks.
- All exposed content fields occur on at least one rendered page. Padel, Creative, and Consulting historical content remains editable after irrelevant fields are removed from their CMS.
- Invalid coordinates, empty latitude, and coordinates outside the geographic range are rejected for Padel and Hospitality.
- The real shipped scripts pass mobile menu, filter, tab keyboard, gallery cycling/focus, inline enquiry validation/fallback, and room-topic handoff fixtures.
- Legacy enquiry buttons consistently say Review enquiry. Their prepared actions retain Continue in WhatsApp / Continue by email; email-only client preview and published pages expose the encoded real footer mailto.
- Brief review, copying, download and handoff work; empty answers, invalid continuation and blocked clipboard access have useful recovery.
- Business enquiry review preserves entered values, focuses associated errors, supports a client email fallback, clears an obsolete review after changes, and does not automatically send visitor data.
- Duplicate topic removal preserves the selected option, distinct offering names and custom handoff topics. Prepared WhatsApp/email labels and values match the visible review.
- The cargo calculator reports cubic metres and handles invalid package quantities; the preparation checklist reports partial and complete progress.
- Initial-viewport text stays readable when legacy motion starts. Business first-paint reveal effects remain static, hotel camera pan remains available, and reduced motion disables the tested animations.
- Logistics homepage and catalogue actions reach each offering's corresponding usable detail page.
- The additional business enquiry tests verify centimetre-to-cubic-metre conversion and package quantity, encoded client contact URLs, calendar-valid hotel dates, and departure dates later than arrival dates.

Enquiry forms prepare a client contact link; they do not automatically send a message or claim a reservation is confirmed. The new business forms also show a review before that contact action. The owning agent performs their browser click-through separately.

## Practical limits

Structural and runtime fixture tests cannot establish image quality, text contrast, mobile fit, or motion quality. The owning agent must inspect these in the browser. A successful enquiry test proves that a correctly addressed, encoded contact action is prepared; it does not send a message or verify that a business responds.

Before a client's website is published, its owner needs to supply its real identity, contact details, service content, photographs, location where relevant, and any business statistics it chooses to display. Optional statistics begin disabled for new client websites. The template's structure is reusable; example content is not evidence of a client's actual projects or performance.
