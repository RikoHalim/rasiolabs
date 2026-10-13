# Hospitality and catering page expansion

## Design directions

The references supplied by the owner inform image-led composition, controlled motion, and clear navigation. Hotel and catering visitors still need to choose a stay or plan an event, so the templates do not borrow technology dashboards or decorative performance graphs.

Hospitality uses mineral paper `#f3f5f1`, garden mist `#e1e8df`, deep forest `#142e29`, muted foliage `#53645d`, and teal `#204c45`. Fraunces carries the room and destination headings; DM Sans carries directions, forms, and practical information. The warm cream/burgundy combination was replaced to separate this hotel from the catering template. The signature is a wide, slowly moving view of the property, supported by asymmetrical room photography. The breakfast chapter turns dark and uses one curved image corner as a visual reference to an arched hotel doorway.

```text
Hotel home:       split title + enquiry action
                  wide property photograph
                  quiet story | portrait
                  wide room | offset suite
                  dark breakfast chapter | photograph
                  group stay | practical guide
```

Catering uses milk `#f7f8f4`, herb `#e8ecdf`, olive `#344538`, leaf ink `#253b30`, and paprika `#923c29`. Newsreader is reserved for the food and occasion headings; Hanken Grotesk makes menus, service formats, and forms straightforward. Its signature is an editorial arrangement of a long table and a separate close-up plate. Wedding planning uses a real ordered sequence, corporate catering uses a service comparison, and private dining uses a dark split composition. These pages deliberately avoid repeating the hotel layout.

```text
Catering home:    headline | tall table | close-up plate
                 menu list | sticky dish photograph
Weddings:        heading + action | arched event photograph
                 serving choice, then ordered planning steps
Corporate:       schedule-led introduction | food photograph
                 lunch / conference / reception comparison
Private dining:  dark introduction | portrait food photograph
                 menu | space and service requirements
```

Energy / rhythm / motion: Hospitality 2 / 3 / 2; Catering 2 / 3 / 2. Quiet forms and readable practical pages support the image chapters.

## Pages and use cases

Hospitality now contains ten routes: home, rooms, garden-room, terrace-suite, experiences, visit, dining, groups, stay-guide, and stay. The three added routes let guests plan breakfast with date and dietary details, plan a multi-room stay, and review arrival/accessibility/children/change questions. Group enquiries pass the selected topic into the stay form. The stay form now asks for rooms requested as well as guests.

Catering now contains ten routes: home, menus, seasonal-menu, events, weddings, corporate, private-dining, kitchen, planning-guide, and enquiry. Occasion pages explain the relevant venue, food, equipment, and timing decisions. Each occasion action passes a topic into the event enquiry. The guide exposes useful questions through native keyboard-accessible disclosures.

These are enquiry workflows. They review an entered brief and provide the configured business contact destination; they do not pretend to confirm availability, reserve rooms, charge payments, or issue quotes.

## Motion and resilience

Hospitality keeps a slow camera movement within the property images and a finite aperture opening for photographs. Catering uses finite crop/saturation transitions to move attention from the photograph to the menu. Wedding planning numbers express the actual planning order. Disclosure answers enter with a short positional transition. No new content starts at zero opacity; a refresh does not require an animation to make the page readable. Both themes disable motion for `prefers-reduced-motion`.

Images retain reserved dimensions and use local photography already licensed and recorded in the family photo-source documents. No new photographic assets or invented claims were introduced in this expansion. Photographs can appear on different related pages but are not repeated within an individual page.

## Source verification

- `node --check server/templates/hospitality.mjs` and `node --check server/templates/catering.mjs`: successful.
- In-memory rendering of every route: ten per family; zero links to an unknown route; zero missing field defaults; zero malformed CMS labels.
- Every added field is referenced by `t` or `pic`. Existing hotel latitude/longitude fields are read by the shared map renderer rather than visible text hooks.
- Anti Slop contrast checker: hotel muted text on mist 5.02:1; paper on deep forest 13.18:1; button text on teal 9.40:1. Catering muted text on herb 4.98:1; milk on leaf ink 11.27:1; paprika on herb 6.03:1. All checked combinations pass normal text AA.
- The hotel room gallery now has the accessible name `Room photo gallery`.

Integrated generated-route, browser, CMS save, and deployment checks are owned by the primary agent and must run after the shared build.
