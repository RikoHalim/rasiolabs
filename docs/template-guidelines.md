# Rasio template conventions

- The active Rasio Profile catalog contains **Architecture Studio — Designed for Better Living**, **Padel Club — More Than a Match**, **Creative Studio — Ideas Made Visible**, and **Business Consulting — Clarity for What’s Next**. Keep homepage sectors, checkout choices, backend validation, CMS defaults, and rendered website layouts aligned with this catalog. Template previews are not completed client projects.

- The server registry lives in `server/profile-templates.mjs`. `npm run build` generates all four homepages and their 27 interior pages before packaging the Worker. Each order retains its template and saved content. Clients edit text, images, logo, and approved navbar targets without switching template styles.
- `scripts/profile-modern-design.mjs` owns the sector-specific homepage compositions and font selection; `dist/template-modern.css` carries the matching interior-page styles. Architecture uses Manrope and DM Serif Display with editorial image panels, Padel uses Barlow and court photography, Creative uses Space Grotesk and Work Sans with light/dark portfolio panels, and Consulting uses Plus Jakarta Sans with blue bento layouts.

- Display **+60142317052** as a WhatsApp link only in the footer. Other consultation buttons link to `https://wa.me/60142317052` without displaying the number. The Architecture Studio CTA reads “Start a conversation”.
- Use the Rasio Labs logo while allowing each template its own typography, colors, and layout appropriate to the industry.
- Keep homepage photographs distinct within each template and across template families. A selected project may retain its photograph on its own detail page. Keep guide cards typography-led when another image would repeat the same photograph.
- Motion follows the sector: architectural wipes and divider draws, lateral sports motion for Padel, editorial word/image sequences for Creative, and restrained fades for Consulting. Respect reduced motion, preserve usable content without JavaScript, and never animate hidden tab panels.
- Keep decorative motion finite. The Padel text ticker has its own pause/resume control. Hero layouts must grow with valid client copy, while optional statistics remain editable and removable in CMS.
- Do not show a photography credits section in the public template UI. Retain asset sources and license notes in internal documentation, and choose assets whose terms allow this presentation.
- Do not put demo/preview explanations or sample-content notices inside template pages. Keep the catalog/template selector context, and avoid claiming stock photographs are completed client projects; describe spaces and design ideas instead.
- Preview metric values illustrate the requested business statistics layouts. New client websites have empty metric values and statistics disabled until the client supplies their own numbers in CMS.
- Statistics follow each sector: Architecture uses an editorial strip after the studio introduction; Padel uses a centered club row; Creative uses a large brand count with two supporting metrics after its work; Consulting pairs its heading with a primary client metric after the approach section.
