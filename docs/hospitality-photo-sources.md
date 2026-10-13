# Hospitality template: photograph sources and design decisions

## Photographs

The photographs are real Pexels stock photography. Downloaded 9 October 2026 via the Pexels image CDN at widths from 900 to 1800 px, JPEG quality 82. These photographs are design content for a reusable hotel template, not evidence that Rasio Labs operates the pictured hotels. Replace property photography and location content with the client's own before publishing their business site. No credits are placed in the customer-facing template.

| Local asset | Photographer | Official photograph page |
| --- | --- | --- |
| hospitality-pool.jpg | Bagus Prabangkara | [Luxurious Poolside Resort in Bali](https://www.pexels.com/photo/luxurious-poolside-resort-in-bali-indonesia-32503088/) |
| hospitality-garden-room.jpg | Beautiful Bali Villas | [Beautiful Bedroom in a Villa](https://www.pexels.com/photo/beautiful-bedroom-in-a-villa-5649731/) |
| hospitality-terrace-suite.jpg | kevin yung | [Elegant Modern Hotel Room in Bali](https://www.pexels.com/photo/elegant-modern-hotel-room-in-bali-34790702/) |
| hospitality-bathroom.jpg | Наталья Маркина | [Photo of a Hotel Bathroom](https://www.pexels.com/photo/photo-of-a-hotel-bathroom-9696595/) |
| hospitality-breakfast.jpg | Алеся Горбунова | [Plate with Eggs Beside a Cup of Coffee](https://www.pexels.com/photo/photo-of-a-plate-with-eggs-beside-a-cup-of-coffee-8872308/) |
| hospitality-palms.jpg | Kseniya Kobi | [Garden Resort with Palm Trees Near Swimming Pool](https://www.pexels.com/photo/garden-resort-with-palm-trees-near-swimming-pool-8159777/) |
| hospitality-ubud.jpg | Tom Fisk | [Lush Bali Rice Terraces with Palm Trees](https://www.pexels.com/photo/lush-bali-rice-terraces-with-palm-trees-36896228/) |
| hospitality-evening.jpg | Valera Rychman | [Pool and Palm Trees in Resort at Sunset](https://www.pexels.com/photo/pool-and-palm-trees-in-resort-at-sunset-20639392/) |

[Pexels License](https://www.pexels.com/license/). No image is repeated within a page, apart from the selected enlargement inside the gallery dialog.

## Design read

Hotel company profile for guests deciding where to stay, with a warm editorial visual language. ENERGY 2 / RHYTHM 3 / MOTION 3. The explicit brief requests premium, varied company-profile templates with real functional pages and distinct dynamic animation.

- Sand paper and burgundy actions echo the warmth of natural materials and separate enquiry controls from photography.
- Fraunces gives the room and stay headlines a literary hospitality voice; DM Sans keeps practical directions and forms easy to scan.
- Straight navigation and square controls belong to an understated editorial layout, rather than the rounded SaaS navigation used elsewhere.
- Room images use unequal scale and offset because visitors need to compare two different accommodation categories without a repetitive feature-card grid.
- Each image serves a decision: the hotel setting, room character, bathroom, meal, day out, or arrival landscape.
- Cinema image panning and slow photographic reveals invite visitors to look at the place itself; filter changes are quicker so the selection remains responsive. Reduced motion must preserve all content without animation.
- The dark burgundy invitation is the single strong color moment; supporting sections use related warm neutral surfaces.
- Forms request actual dates, guests, and room preference. There is no invented live availability, instant booking, star rating, guest count, or testimonial.

## Page contract

Home, Rooms, Garden Room, Terrace Suite, Experiences, Visit, Stay enquiry. Rooms has a real category filter. Room details include amenities, a keyboard-operated gallery, and a room-specific enquiry route. Visit includes an editable map and directions link. Stay enquiry validates required fields and date order, then prepares a message for the configured business contact.

## Source checks

Module syntax passes `node --check server/templates/hospitality.mjs`. Rendering all seven page variants with an instrumented context exercised 79 CMS text/image hooks: zero unregistered hooks, missing values, missing local images, over-limit copy values, invalid page destinations, or image repeats within a page. All navigation targets resolve to a registered page. Browser interaction evidence is recorded by the owning agent after integration.

The smallest normal-text palette contrast is 5.33:1 (muted text on the warm secondary surface). Main text on paper is 12.33:1, burgundy links on paper 9.39:1, CTA text on burgundy 10.27:1, and hover CTA contrast 13.90:1. Form/filter/menu border contrast was corrected to 3.83:1 on paper and 3.30:1 on the secondary surface. Photo captions use an opaque paper surface, so text contrast is independent of the picture behind it. Navigation, filters, gallery controls, and CTAs have minimum 44 px targets and explicit focus treatment.
