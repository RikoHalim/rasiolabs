# Rasio template conventions

- The active Rasio Profile catalog contains **Architecture Studio — Designed for Better Living**, **Padel Club — More Than a Match**, **Creative Studio — Ideas Made Visible**, and **Business Consulting — Clarity for What’s Next**. Keep homepage sectors, checkout choices, backend validation, CMS defaults, and rendered website layouts aligned with this catalog. Template previews are not completed client projects.

- The server registry lives in `server/profile-templates.mjs`. `npm run build` generates the three additional template pages before packaging the Worker. Each order stores its selected template; existing Architecture orders retain their original defaults and layout. Clients edit text, images, logo, and approved navbar targets without switching template styles.

- Display **+60142317052** as a WhatsApp link only in the footer. Other consultation buttons link to `https://wa.me/60142317052` without displaying the number. The Architecture Studio CTA reads “Start a conversation”.
- Use the Rasio Agency logo while allowing each template its own typography, colors, and layout appropriate to the industry.
- Do not show a photography credits section in the public template UI. Retain asset sources and license notes in internal documentation, and choose assets whose terms allow this presentation.
- Do not put demo/preview explanations or sample-content notices inside template pages. Keep the catalog/template selector context, and avoid claiming stock photographs are completed client projects; describe spaces and design ideas instead.
