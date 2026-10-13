# Browser verification, 13 October 2026

Environment: local Cloudflare Worker preview at 127.0.0.1:4173, Codex browser. No enquiries sent, reservations made or external messages submitted.

- All 70 routes loaded at 320, 390, 768 and 1366 viewport widths. The final DOM audit reports no page-level horizontal overflow, broken loaded images or AA contrast failures for text on solid surfaces. Evidence: `template-browser-final-v61.json`, 280 rows. Photographic openings were reviewed visually; the automated contrast calculation intentionally excludes photographs and gradients.
- All seven homepages were captured at desktop and mobile widths. Sector-specific photographs, contrasting chapters, readable actions and distinct typography are visible in `template-design-overview-v61.jpg` and `template-mobile-overview-v61.jpg`.
- Logistics calculator: 100 × 50 × 40 cm, three packages produces `0.600 m³ total package volume`.
- Logistics mobile menu opens the navigation and updates its accessible name to Close navigation; Escape closes it and restores aria-expanded=false.
- Hotel room filter: Suites hides The Garden Room and keeps The Terrace Suite. View the room opens the suite detail with amenities, photographs and enquiry action.
- Hotel gallery: bathroom opens a named modal; Next photograph advances to the pool and shows 2 / 2; Escape closes it.
- Hotel room enquiry handoff: Ask about this room opens the enquiry with The Terrace Suite selected.
- Hotel required-input submission displays inline errors and focuses the name field. A completed enquiry prepares a review showing the selected room, 10–12 February 2027, two guests and one room. The next action is Send via WhatsApp, not an automatic submission. Screenshot: `hotel-form-review-v61.png`.
- Consulting working-together page reviewed visually at desktop: readable dark-blue chapter, in-page topic links, real disclosure answers, project discussion links and complete footer navigation.
- Creative mobile fan was changed to a scrollable photo gallery after visual review showed that angled edge labels were cut off. Text remains readable, and each photograph links to its actual discipline page.

The focused runtime tests exercise the shipped scripts beyond the browser samples: every menu/filter/tab/gallery/brief/enquiry contract, invalid dates, missing contacts, clipboard failure, client topic renaming, keyboard focus and reduced motion. The complete regression run passed 79 tests with no failures (`tests-v61.log`). Browser samples complement that suite; they do not imply that every possible device or browser was tested.
