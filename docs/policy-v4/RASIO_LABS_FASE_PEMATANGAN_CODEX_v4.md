# RASIO LABS — FASE PEMATANGAN WEBSITE & PRODUK
## Master Instruction untuk Codex — Fokus Arsitektur, Fitur, Flow, Copywriting, dan Visual Polish
## TEMPLATE & SEKTOR BARU DIBEKUKAN SEMENTARA
## VERSI v4 — Domain >=12 bulan, Harga Tahunan Confirmed, Revisi Minor Unlimited, Draf Kebijakan Hukum

> **Status:** source of truth fase sekarang  
> **Bahasa implementasi marketing:** Bahasa Indonesia  
> **Scope utama:** membongkar dan mematangkan website Rasio Labs sebelum ekspansi template  
> **Out of scope:** membuat template baru atau sektor baru  
> **Catatan:** fase saat ini adalah validasi HTML/CSS/JS dan prototype alur; tidak sama dengan backend produksi yang sudah aktif.  

---

# 1. KEPUTUSAN SCOPE — WAJIB DIPATUHI

Untuk fase ini, **JANGAN membuat template baru dan JANGAN menambah sektor baru.**

**Business rule pricing yang tidak boleh diubah tanpa instruksi eksplisit:**
Rasio Labs menggunakan empat durasi paket: **1 bulan, 12 bulan, 24 bulan, dan 48 bulan**.

Gunakan hanya template yang sudah ada:

1. Architecture Studio
2. Business Consulting
3. Boutique Hotel
4. Creative Studio
5. Padel Club
6. Catering House
7. Logistics Company

Codex BOLEH:

- memperbaiki catalogue template;
- memperbaiki card template;
- menambah metadata;
- memperbaiki search/filter;
- membuat detail page untuk template yang sudah ada;
- memperbaiki live preview flow;
- memperbaiki CTA “Pilih Template”;
- menghubungkan template ke checkout/onboarding;
- membuat struktur data/manifest agar scalable nanti.

Codex TIDAK BOLEH:

- membuat template baru;
- menambah sektor baru;
- mendesain ulang isi website template existing;
- menambah placeholder template palsu;
- menambah sektor “Coming Soon” hanya untuk terlihat banyak;
- menghabiskan waktu membuat variasi desain baru.

**Tujuan fase ini adalah mematangkan PLATFORM Rasio Labs terlebih dahulu.**

---

# 2. NORTH STAR

Semua page, section, flow, fitur, CTA, motion, dan copy harus mendukung promise ini:

> **Pilih template. Kirim informasi bisnis. Rasio urus sisanya.**

Visitor harus mengerti dalam 5–10 detik bahwa:

1. Rasio Labs menyediakan website subscription;
2. klien memilih template;
3. klien tidak perlu membangun website sendiri;
4. Rasio menyiapkan dan mengelola bagian teknis;
5. klien tetap dapat mengelola konten yang diizinkan;
6. hosting/SSL dan benefit lain sudah dibundel;
7. Rasio AI membantu insight, SEO, dan content.

---

# 3. FOKUS FASE SEKARANG

Prioritas:

```text
1. Information Architecture
2. Product Architecture
3. Conversion Funnel
4. Pricing Architecture
5. Template Catalogue Experience
6. Template Detail Experience
7. How It Works
8. Checkout / Onboarding UX
9. Client Dashboard Prototype
10. Rasio AI
11. Pricing / Billing Explanation
12. Help / FAQ
13. Legal / Policy Structure
14. Visual System
15. Motion System
16. Responsive / Accessibility
17. Code / Data Organization
18. Verification
```

Ekspansi template dilakukan **setelah semua poin di atas matang.**

---

# 4. POSISI BISNIS RASIO LABS

JANGAN tampil seperti:

> jasa web murah.

JANGAN tampil seperti:

> freelancer portfolio.

JANGAN tampil seperti:

> website builder DIY.

JANGAN tampil seperti:

> AI website generator.

Arah positioning:

> **Managed website platform untuk bisnis.**

Customer-facing:

> **Website profesional untuk bisnis Anda. Kami yang siapkan.**

Supporting:

> Pilih template, kirim informasi bisnis, dan tim Rasio Labs menyiapkan website sampai siap online.

---

# 5. PRINSIP HOSTINGER YANG DITERAPKAN

Bukan clone desain Hostinger.

Ambil prinsip:

## 5.1 Sederhanakan hal teknis

Customer tidak perlu mengerti:

- deployment;
- DNS;
- SSL;
- hosting panel;
- server;
- framework;
- database.

Website marketing harus menjual hasil.

---

## 5.2 Productization

Produk Rasio:

```text
Rasio Profile
Rasio Store
Rasio Custom
Rasio AI
```

Masing-masing punya job jelas.

---

## 5.3 Bundling

Customer melihat satu paket yang mencakup kebutuhan website dasar.

---

## 5.4 Template discovery

Template diperlakukan sebagai produk, bukan gallery.

---

## 5.5 Transparent pricing

Monthly-equivalent price + total contract.

---

## 5.6 Dashboard

Customer mengelola website dari satu tempat.

---

## 5.7 AI mengurangi friction

AI customer-facing + internal automation.

---

## 5.8 Self-service help

Help center mengurangi support manual.

---

## 5.9 Land and expand

Add-on dapat dikembangkan setelah core product matang.

---

# 6. PRICING YANG BENAR

## Rasio Profile

| Durasi | Harga ekuivalen | Total |
|---|---:|---:|
| 1 bulan | Rp109.000/bulan | Rp109.000 |
| 12 bulan | **Rp54.500/bulan (mengikuti harga existing yang telah dikonfirmasi pemilik)** | **Rp654.000** |
| 24 bulan | Rp32.000/bulan | Rp768.000 |
| 48 bulan | Rp27.750/bulan | Rp1.332.000 |

12 bulan:

> **Paket Tahunan**

24 bulan:

> **Paling Populer**

48 bulan:

> **Harga Terbaik**

## WAJIB

- pertahankan paket 1, 12, 24, dan 48 bulan;
- **Harga 12 bulan sudah dikonfirmasi oleh pemilik bisnis mengikuti harga existing: Rp54.500/bulan (total Rp654.000)**. Simpan sebagai angka eksplisit dalam pricing config, bukan hasil menghitung diskon;
- hapus Rp27.250;
- hapus total Rp1.308.000;
- jangan menghitung harga paket secara dinamis dari persentase diskon di frontend;
- semua harga paket harus didefinisikan secara eksplisit di satu pricing configuration/source of truth;
- jika pricing berubah di masa depan, cukup ubah source of truth tersebut dan seluruh UI harus mengikuti;
- jangan menghapus, menambah, atau mengubah durasi paket tanpa instruksi bisnis eksplisit.

---

# 7. CENTRALIZED DATA

Codex harus memisahkan data produk dari HTML.

Minimal:

```text
/data/products.js
/data/plans.js
/data/templates.js
/data/faqs.js
/data/features.js
```

Jika masih single HTML:

> gunakan satu object configuration terpusat.

Tidak boleh ada harga manual tersebar di HTML.

---

# 8. TEMPLATE DATA — EXISTING ONLY

Gunakan data terstruktur.

```js
const templates = [
  {
    id: "architecture",
    name: "Architecture Studio",
    sector: "architecture",
    product: "profile",
    previewUrl: "...",
    orderUrl: "...",
    status: "active"
  },
  {
    id: "consulting",
    name: "Business Consulting",
    sector: "consulting",
    product: "profile",
    status: "active"
  },
  {
    id: "hospitality",
    name: "Boutique Hotel",
    sector: "hospitality",
    product: "profile",
    status: "active"
  },
  {
    id: "creative",
    name: "Creative Studio",
    sector: "creative",
    product: "profile",
    status: "active"
  },
  {
    id: "padel",
    name: "Padel Club",
    sector: "sports",
    product: "profile",
    status: "active"
  },
  {
    id: "catering",
    name: "Catering House",
    sector: "catering",
    product: "profile",
    status: "active"
  },
  {
    id: "logistics",
    name: "Logistics Company",
    sector: "logistics",
    product: "profile",
    status: "active"
  }
];
```

Jangan menambah item baru.

---

# 9. ARSITEKTUR WEBSITE FINAL FASE INI

Codex harus membangun / mematangkan:

```text
/
├── Home
├── Templates
│   └── Template Detail
├── Company Profile
├── Online Store
├── Rasio Custom
├── Pricing
├── How It Works
├── Rasio AI
├── Help / FAQ
├── Login Klien
├── Checkout / Order
├── Onboarding
└── Legal
    ├── Terms
    ├── Privacy
    ├── Domain Policy
    └── Cancellation Policy
```

Dashboard prototype:

```text
/dashboard
```

Tidak perlu production backend dulu jika fase ini masih HTML prototype.

---

# 10. HOME — STRUKTUR FINAL

Urutan:

```text
1. Navbar
2. Hero
3. Included Essentials
4. Rasio vs DIY Builder
5. Product Selector
6. Featured Existing Templates
7. How It Works
8. Client Dashboard
9. Rasio AI
10. Pricing Preview
11. Transparency / Trust
12. FAQ
13. Final CTA
14. Footer
```

HAPUS section yang:

- redundant;
- filler;
- tidak membantu buying decision;
- hanya ada untuk membuat homepage panjang.

---

# 11. NAVBAR

Recommended:

```text
Template
Produk
Harga
Cara Kerja
Rasio AI
Bantuan

Login Klien
[Lihat Template]
```

Produk dropdown:

```text
Rasio Profile
Rasio Store
Rasio Custom
```

Primary CTA:

> **Lihat Template**

---

# 12. HERO

Tujuan:

> menjelaskan Rasio tanpa jargon.

Headline recommended:

> **Website profesional untuk bisnis Anda. Kami yang siapkan.**

Subheadline:

> Pilih template yang sesuai, kirim informasi bisnis, dan tim Rasio Labs menyiapkan website sampai siap online.

Primary:

> Lihat Template

Secondary:

> Lihat Harga

Microcopy:

> Mulai Rp27.750/bulan · hosting & SSL termasuk.

JANGAN gunakan Rasio AI sebagai hero badge utama.

---

# 13. HERO VISUAL

Jangan background polos.

Jangan generic AI visual.

Gunakan:

```text
real template screenshot
+
mobile screenshot
+
small dashboard / CMS surface
+
soft background depth
```

Background:

- off-white / light tint;
- radial brand light;
- subtle lines/grid;
- screenshot layering.

Motion:

- screenshot reveal;
- subtle depth;
- max 2–3° pointer tilt desktop;
- mobile disable tilt.

---

# 14. INCLUDED ESSENTIALS

Compact strip:

- Setup oleh Rasio
- Hosting
- SSL
- 1 business email
- Domain gratis untuk pendaftaran tahun pertama pada paket minimal 12 bulan (12/24/48 bulan), dengan batasan TLD dan ketersediaan yang diungkap sebelum checkout

Jangan semua jadi card besar.

---

# 15. RASIO VS DIY BUILDER

Section baru dan penting.

Headline:

> **Anda tidak perlu membuat website sendiri.**

atau:

> **Bukan website builder. Rasio yang menyiapkannya untuk Anda.**

Flow:

```text
Pilih template
↓
Kirim informasi
↓
Rasio siapkan
↓
Review
↓
Online
```

Tujuannya menjelaskan perbedaan Rasio dari Hostinger/Wix DIY.

---

# 16. PRODUCT SELECTOR

## Rasio Profile

> Website untuk memperkenalkan bisnis, menunjukkan layanan/portfolio, dan mendapatkan enquiry.

CTA:

> Lihat Template Profile

## Rasio Store

> Online store untuk menampilkan produk dan menerima order.

Jika belum production-ready:

> Coming Soon

Jangan pura-pura ready.

## Rasio Custom

> Untuk fitur, workflow, atau integrasi di luar template standar.

CTA:

> Diskusikan Kebutuhan

Jangan beri fake monthly pricing.

---

# 17. TEMPLATE CATALOGUE — IMPROVE, BUKAN EXPAND

Route:

```text
/templates
```

Gunakan existing 7 template.

Fitur:

- search;
- sector filter existing;
- product filter jika relevan;
- sort optional;
- empty state;
- preview;
- pilih template.

Jangan buat sector filter yang belum punya template.

---

# 18. TEMPLATE CARD

Current card harus diperbaiki.

Card minimal:

```text
Screenshot
Sector
Template Name
Short purpose
Pages / feature summary jika tersedia

[Pratinjau]
[Pilih Template]
```

Example:

```text
Architecture Studio
Arsitektur & Interior

Untuk menampilkan portfolio, layanan, dan enquiry.

[Pratinjau] [Pilih Template]
```

Tidak perlu menambah page ke template existing dalam fase ini.

Metadata boleh menjelaskan kegunaan yang sudah ada.

---

# 19. TEMPLATE DETAIL PAGE

Route:

```text
/templates/{slug}
```

Untuk existing template saja.

Isi:

1. Template name
2. Sector
3. Preview desktop
4. Preview mobile jika tersedia
5. Live preview
6. Cocok untuk
7. Tujuan bisnis
8. Ringkasan page existing
9. Fitur existing
10. Apa yang Rasio sesuaikan
11. Apa yang tidak termasuk
12. Pricing shortcut
13. CTA Gunakan Template

Primary CTA:

> **Gunakan Template Ini**

Mobile:

> sticky bottom CTA.

---

# 20. HOW IT WORKS

Route:

```text
/how-it-works
```

Juga tampil versi ringkas di Home.

Full flow:

```text
01 Pilih template
02 Pilih paket
03 Checkout
04 Buat akun
05 Isi data bisnis
06 Upload material
07 Rasio siapkan website
08 Review
09 Domain
10 Website online
```

Harus menjawab:

> Apa yang terjadi setelah saya bayar?

---

# 21. ONBOARDING

Ini salah satu fokus terbesar.

Buat prototype flow:

```text
Step 1 — Business Info
Step 2 — Brand
Step 3 — Content
Step 4 — Contact
Step 5 — Domain
Step 6 — Review
```

## Business Info

- Business Name
- Category
- Description
- Address
- WhatsApp
- Email
- Phone
- Operating Hours
- Social

## Branding

- Logo
- Brand color
- Brand assets

## Content

- Services / products
- About
- Images
- Gallery
- FAQ optional

## Domain

- use existing domain
- need domain
- later

## UX

- progress indicator;
- autosave prototype state;
- back/next;
- clear required field;
- summary before submit.

---

# 22. ONBOARDING AI

Rasio AI internal dapat membantu menghasilkan draft.

Flow:

```text
Onboarding Data
↓
AI Draft
↓
Rasio Staff Review
↓
Client Preview
```

Draft:

- hero headline;
- business description;
- service copy;
- FAQ;
- CTA;
- SEO title;
- meta description.

AI tidak publish langsung.

---

# 23. CLIENT DASHBOARD PROTOTYPE

Route:

```text
/dashboard
```

Navigation:

```text
Overview
Website
Content
Media
Analytics
Rasio AI
Domain
Business Email
Subscription
Billing
Support
Settings
```

Tujuan fase ini:

> prototype UX yang matang.

Belum harus backend production.

---

# 24. DASHBOARD — OVERVIEW

Show:

- website status;
- domain status;
- subscription;
- visitors;
- WhatsApp clicks;
- recent edits;
- Rasio AI recommendation;
- quick actions.

Quick Actions:

- Edit Content
- View Website
- Analytics
- Billing

---

# 25. DASHBOARD — WEBSITE / CONTENT

Jangan drag-and-drop builder.

Client boleh:

- edit supported text;
- change image;
- enable/disable supported content;
- update contact;
- update service/product;
- preview.

Template structure tetap protected.

---

# 26. DASHBOARD — MEDIA

Features:

- upload;
- library;
- image preview;
- delete;
- replace;
- usage state optional.

UX:

- file validation;
- progress;
- empty state;
- error state.

---

# 27. DASHBOARD — ANALYTICS

MVP metrics:

- Visitors
- Page Views
- Top Pages
- Traffic Sources
- WhatsApp Clicks
- Contact Form
- CTA Clicks

Visual harus meaningful.

Jangan decorative chart.

---

# 28. RASIO AI — MAIN PAGE

Route:

```text
/rasio-ai
```

AI modules:

1. Website Insights
2. SEO Assistant
3. Content Assistant

Tidak perlu chatbot sekarang.

---

# 29. AI WEBSITE INSIGHTS

UI:

- period;
- visitor change;
- top page;
- source;
- WhatsApp / conversion;
- AI recommendation.

Example:

> Traffic naik 18% bulan ini. Halaman Layanan merupakan halaman yang paling banyak dikunjungi. Pertimbangkan menempatkan CTA WhatsApp setelah portfolio.

AI tidak boleh mengarang data.

---

# 30. AI SEO ASSISTANT

Flow:

```text
Scan
↓
Issue
↓
Recommendation
↓
AI Draft Fix
↓
Approve
```

Check:

- title;
- meta description;
- H1;
- headings;
- image alt;
- internal link;
- indexability;
- local business info.

CTA:

> Perbaiki dengan Rasio AI

Tetap draft.

---

# 31. AI CONTENT ASSISTANT

Actions:

- Generate
- Rewrite
- Shorten
- Expand
- Professional
- Friendly
- Improve CTA

Content:

- headline;
- About;
- service;
- FAQ;
- CTA;
- promo;
- meta.

Preview before save.

---

# 32. PRICING PAGE

Route:

```text
/pricing
```

Sections:

1. Pricing cards
2. Compare plans
3. Included
4. Domain
5. Email
6. Hosting
7. Setup
8. AI
9. Customization limits
10. Payment
11. Subscription expiry
12. FAQ

---

# 33. PRICING CARD DESIGN

1 month:

> Fleksibel

12 months:

> Tahunan

24 months:

> Paling Populer

48 months:

> Harga Terbaik

Always show:

```text
Rp32.000 / bulan
Rp768.000 dibayar untuk 24 bulan
```

Jangan menyembunyikan total.

---

# 34. PAYMENT / CHECKOUT PROTOTYPE

Flow:

```text
Selected Template
↓
Selected Product
↓
Plan
↓
Customer
↓
Payment Method
↓
Summary
↓
Pay
```

Payment provider direction:

- Midtrans first;
- DOKU adapter later.

HTML prototype boleh simulasi.

Jangan implement secret key di frontend.

---

# 35. CHECKOUT SUMMARY

Wajib show:

- template;
- package;
- duration;
- monthly-equivalent;
- total;
- domain inclusion;
- email;
- hosting;
- terms acknowledgment.

---

# 36. DOMAIN UX

Dashboard Domain:

- domain;
- status;
- SSL;
- renewal date;
- renewal payer;
- action.

Status:

```text
Pending
Connected
Active
Renewal Required
Expired
```

---

# 37. BUSINESS EMAIL UX

Show:

- mailbox address;
- status;
- open webmail;
- reset/manage flow placeholder;
- add mailbox upsell later.

Do not expose mailbox password.

---

# 38. SUBSCRIPTION UX

Show:

- current plan;
- start date;
- end date;
- payment status;
- domain benefit;
- renewal;
- invoice/history.

Action:

- renew;
- view payment;
- contact support.

---

# 39. HELP CENTER

Route:

```text
/help
```

Start categories:

```text
Mulai
Website
Domain
Email
Pembayaran
Rasio AI
Akun
```

Features:

- search;
- category cards;
- FAQ;
- contact support.

Do not write 100 filler articles.

---

# 40. FAQ

Marketing FAQ must cover real objections.

Questions:

1. Apa itu Rasio Labs?
2. Bagaimana cara kerjanya?
3. Apakah saya membuat website sendiri?
4. Apa yang perlu saya kirim?
5. Apa yang bisa diubah?
6. Apakah layout bisa diganti?
7. Apakah hosting termasuk?
8. Apakah SSL termasuk?
9. Apakah domain termasuk?
10. Berapa lama domain gratis?
11. Apa yang terjadi tahun kedua?
12. Apakah email bisnis termasuk?
13. Bagaimana pembayaran 24/48 bulan?
14. Apa yang terjadi jika subscription selesai?
15. Bisakah saya pakai domain sendiri?
16. Berapa lama setup?
17. Bagaimana revisi?
18. Apa itu Rasio AI?
19. Bagaimana support?
20. Apa bedanya dengan website builder?

---

# 41. LEGAL PAGE STRUCTURE

Create placeholder/structured pages:

```text
/terms
/privacy
/domain-policy
/cancellation-policy
```

Tidak perlu Codex mengarang legal advice final.

Beri placeholder:

> Konten legal harus direview sebelum production.

---

# 42. TRUST SECTION

Jangan fake social proof.

Jangan:

- fake review;
- fake customer count;
- fake company logos;
- fake rating.

Trust dengan transparency:

- harga jelas;
- total jelas;
- domain jelas;
- scope jelas;
- proses jelas;
- template bisa dipreview;
- policy bisa dibaca.

Headline:

> **Semua detail penting dijelaskan dari awal.**

---

# 43. RASIO CUSTOM PAGE

Route:

```text
/custom
```

Explain:

- when to use;
- example categories;
- process;
- scope discovery;
- custom quote.

No fake pricing.

CTA:

> Diskusikan Project

---

# 44. ONLINE STORE PAGE

Route:

```text
/online-store
```

Jika Store belum siap production:

> mark Coming Soon.

Tetap boleh buat marketing/product architecture.

Sections:

- purpose;
- product management;
- order;
- payment;
- shipping;
- templates later;
- AI later;
- FAQ.

Jangan claim unsupported feature.

---

# 45. COMPANY PROFILE PAGE

Route:

```text
/company-profile
```

Sections:

1. Hero
2. Who it is for
3. What it solves
4. Included
5. Existing templates
6. Setup flow
7. Dashboard
8. AI
9. Pricing
10. FAQ
11. CTA

---

# 46. COPYWRITING RULES

Language:

> Bahasa Indonesia.

Tone:

- direct;
- professional;
- friendly;
- concise.

Avoid:

> Solusi inovatif untuk transformasi digital.

Prefer:

> Tampilkan bisnis, layanan, portfolio, lokasi, dan kontak dalam satu website.

Avoid:

> Empower your digital journey.

Prefer:

> Pilih template. Kirim informasi bisnis. Kami siapkan websitenya.

---

# 47. DESIGN DIRECTION

Website harus:

- modern;
- clean;
- premium;
- minimal;
- product-led;
- tidak polos;
- tidak AI slop.

Clean ≠ putih kosong.

Premium ≠ gradient di mana-mana.

Animation ≠ semua bergerak.

---

# 48. BACKGROUND SYSTEM

Jangan semua:

```css
background: #fff;
```

Gunakan:

- off-white;
- soft tint;
- radial light;
- subtle grid;
- screenshot;
- dark product section;
- restrained gradient;
- line pattern;
- texture/noise sangat tipis.

Setiap background harus mendukung konteks.

---

# 49. SIGNATURE VISUAL

Rasio = website product.

Gunakan:

> layered real website previews.

Motif:

- browser;
- mobile viewport;
- dashboard;
- analytics;
- content editor;
- template screenshot.

Hindari:

- random orb;
- 3D balls;
- sparkles;
- glass card everywhere.

---

# 50. BUTTON SYSTEM

Semua button polished.

## Primary

For:

- Lihat Template
- Gunakan Template
- Pilih Paket
- Mulai Setup

Min height:

```text
44–48px
```

States:

- default;
- hover;
- active;
- focus;
- loading;
- disabled.

Hover:

- slight elevation;
- color shift;
- arrow move.

No generic blue rectangle.

---

# 51. SECONDARY BUTTON

Use:

- Preview
- Lihat Harga
- Lihat Cara Kerja

Style:

- surface;
- border;
- strong hover.

---

# 52. CTA COPY

Use specific verbs.

Good:

- Lihat Template
- Gunakan Template Ini
- Pilih Paket
- Mulai Setup
- Lihat Dashboard
- Perbaiki dengan Rasio AI
- Diskusikan Project

Bad:

- Submit
- Click Here
- Learn More everywhere.

---

# 53. MOTION SYSTEM

Motion harus terasa intentional.

---

# 54. HERO LOAD

Sequence:

```text
0ms     navbar
100ms   headline
180ms   subheadline
260ms   CTA
350ms   product preview
```

Opacity + translate only.

Duration:

```text
450–700ms
```

---

# 55. SCROLL REVEAL

Use:

```text
opacity 0 → 1
translateY 20px → 0
```

Trigger once.

Stagger:

```text
50–90ms
```

---

# 56. TEMPLATE CARD MOTION

Hover:

- translateY(-4px);
- screenshot scale(1.02);
- border;
- shadow;
- arrow shift.

No dramatic tilt.

---

# 57. HOW IT WORKS MOTION

Preferred:

- progress line;
- active step;
- visual changes with step.

Mobile:

- stacked;
- no sticky complicated animation.

---

# 58. AI MOTION

Insights:

- chart draw once;
- metric count;
- recommendation fade.

SEO:

- scan once;
- issue updates.

Content:

- short text replacement.

No infinite loop.

---

# 59. REDUCED MOTION

WAJIB.

Implement:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 60. RESPONSIVE

Test:

```text
1440
1280
1024
768
430
390
360
```

Requirements:

- no horizontal overflow;
- touch target >= 44px;
- readable pricing;
- mobile menu;
- sticky CTA when useful;
- no hover dependency;
- no 9px body text;
- no pointer tilt mobile.

---

# 61. ACCESSIBILITY

Must:

- semantic HTML;
- keyboard;
- focus visible;
- labels;
- tab ARIA;
- contrast;
- reduced motion;
- meaningful alt;
- accessible search/filter;
- mobile menu Escape behavior.

---

# 62. PAGE TITLE / SEO BASICS

Each page:

- real `<title>`;
- meta description;
- canonical placeholder;
- OG metadata;
- semantic headings;
- one H1.

---

# 63. CONVERSION FUNNEL

Final target:

```text
Traffic
↓
Home
↓
Templates
↓
Template Detail
↓
Gunakan Template
↓
Choose Plan
↓
Checkout
↓
Account
↓
Onboarding
↓
Rasio Setup
↓
Client Review
↓
Domain
↓
Live
↓
Dashboard
```

WhatsApp = assistance channel.

Bukan primary funnel.

---

# 64. INTERNAL OPERATION GOAL

Website bukan hanya cantik.

Harus mendukung scale.

Goal:

> mengurangi human work per client.

Track future:

- onboarding completion;
- setup time;
- revision count;
- support volume;
- publish time.

---

# 65. FASE IMPLEMENTASI CODEX

## FASE 1 — AUDIT

Baca existing HTML penuh.

Buat:

```text
AUDIT.md
```

Isi:

- existing section;
- JS behavior;
- pricing;
- link;
- template;
- dead code;
- duplicate;
- incorrect business rule;
- accessibility issue;
- visual issue.

---

# 66. FASE 2 — DATA REFACTOR

Centralize:

- plans;
- products;
- templates;
- FAQs;
- features.

Do this before major UI work.

---

# 67. FASE 3 — HOMEPAGE IA

Rebuild section order.

Fix:

- hero;
- product explanation;
- How It Works;
- dashboard;
- AI;
- pricing;
- trust;
- FAQ.

---

# 68. FASE 4 — TEMPLATE EXPERIENCE

**Existing templates only.**

Build:

- `/templates`;
- search;
- current sectors only;
- improved card;
- detail page;
- preview;
- selection flow.

DO NOT create new template.

---

# 69. FASE 5 — CORE PAGES

Build:

```text
/company-profile
/online-store
/custom
/pricing
/how-it-works
/rasio-ai
/help
```

---

# 70. FASE 6 — CHECKOUT + ONBOARDING PROTOTYPE

Build front-end flow.

No production secrets.

---

# 71. FASE 7 — DASHBOARD PROTOTYPE

Build all dashboard sections.

Use realistic empty/loading/success states.

---

# 72. FASE 8 — VISUAL REFINEMENT

Only after IA stable:

- background;
- typography;
- buttons;
- cards;
- section transition;
- spacing;
- screenshots.

---

# 73. FASE 9 — MOTION

Add intentional motion.

Do not use animation to hide weak layout.

---

# 74. FASE 10 — RESPONSIVE + ACCESSIBILITY

Test all breakpoints.

---

# 75. FASE 11 — SCREENSHOT REVIEW

Render:

```text
Home desktop
Home mobile
Templates desktop
Template Detail
Pricing
How It Works
Rasio AI
Checkout
Onboarding
Dashboard
```

Critique:

- hierarchy?
- CTA?
- empty area?
- too many cards?
- boring background?
- animation?
- button generic?
- copy?
- mobile?

Then refine once.

---

# 76. FASE 12 — VERIFICATION

Checklist:

```text
[ ] pricing 1 / 12 / 24 / 48 bulan benar
[ ] paket 12 bulan tetap tersedia: Rp54.500/bulan, total Rp654.000, status confirmed
[ ] no Rp27.250
[ ] total 48 = Rp1.332.000
[ ] domain rules benar
[ ] only existing templates
[ ] no new sectors
[ ] no fake social proof
[ ] no unsupported feature claim
[ ] all CTA works
[ ] all pages linked
[ ] buttons all states
[ ] reduced motion
[ ] keyboard
[ ] responsive
[ ] no overflow
[ ] no console errors
[ ] no broken links
```

---

# 77. YANG DILARANG PADA FASE INI

Do NOT:

- membuat template baru;
- membuat sektor baru;
- membuat 20 niche landing pages;
- membuat blog besar;
- membuat referral system production;
- membuat partner system production;
- membuat store backend;
- membuat AI chatbot;
- membuat AI website generator;
- membuat microservices;
- membuat backend production penuh;
- mengubah project menjadi kompleks sebelum UX matang.

---

# 78. FITUR YANG BOLEH DI-PROTOTYPE TAPI BELUM PRODUCTION

- Checkout
- Onboarding
- Dashboard
- Analytics
- Rasio AI
- Billing
- Domain
- Email
- Support

Gunakan realistic mock data.

Jangan menyatakan mock sebagai live functionality.

---

# 79. ANTI-AI-SLOP

Dilarang:

- orb;
- random blob;
- semua purple;
- glow semua section;
- semua element dalam card;
- gradient icon square;
- decorative fake dashboard;
- random chart;
- excessive glassmorphism;
- infinite floating animation.

Focus:

> real Rasio product surfaces.

---

# 80. DEFINITION OF DONE

Fase ini selesai ketika:

1. Rasio Labs punya website architecture yang jelas.
2. Visitor paham product dalam 5–10 detik.
3. Existing template mudah ditemukan.
4. Setiap template punya detail page.
5. Visitor tahu proses setelah membeli.
6. Pricing transparan.
7. Checkout UX jelas.
8. Onboarding UX jelas.
9. Dashboard prototype matang.
10. Rasio AI prototype matang.
11. Help / support structure matang.
12. Legal structure ada.
13. Desktop/mobile polished.
14. Motion intentional.
15. Button system polished.
16. Tidak ada misleading feature.
17. Tidak ada template/sektor baru.
18. Website terasa seperti platform, bukan freelance agency.

Setelah ini baru lanjut:

> **FASE EKSPANSI TEMPLATE & SEKTOR.**

---

# 81. INSTRUKSI FINAL UNTUK CODEX

Baca dokumen ini penuh.

**Jangan mulai dengan membuat template baru.**

**Jangan menambah sektor baru.**

Gunakan template existing sebagai sample catalogue sementara.

Prioritaskan:

```text
PRODUCT ARCHITECTURE
→ INFORMATION ARCHITECTURE
→ CONVERSION FLOW
→ CORE PAGES
→ ONBOARDING
→ DASHBOARD
→ RASIO AI
→ PRICING
→ HELP
→ VISUAL SYSTEM
→ MOTION
→ RESPONSIVE
→ VERIFICATION
```

Saat membuat visual:

> jangan background polos.

Saat membuat motion:

> jangan berlebihan.

Saat membuat button:

> semua state harus polished.

Saat membuat section:

> harus punya fungsi bisnis.

Saat membuat fitur:

> jangan klaim live jika masih prototype.

Saat ada konflik dengan HTML lama:

> business rules dalam dokumen ini menang.

North Star:

> **Pilih template. Kirim informasi bisnis. Rasio urus sisanya.**

---

# 82. PROMPT EKSEKUSI AWAL UNTUK CODEX (ARSIP: GUNAKAN PROMPT BAGIAN 84 SEBAGAI INSTRUKSI TERBARU)

Gunakan prompt berikut saat mulai:

```text
Gunakan file HTML Rasio Labs existing sebagai baseline dan dokumen
RASIO_LABS_FASE_PEMATANGAN_CODEX_v3.md sebagai source of truth.

Untuk fase ini JANGAN membuat template baru atau sektor baru.

Langkah pertama:
1. Audit seluruh existing HTML/CSS/JS.
2. Buat AUDIT.md.
3. Identifikasi struktur, pricing lama, duplicate content, dead links,
   unsupported claims, JS behavior, accessibility issue, dan responsive issue.
4. Centralize data produk, pricing, template existing, FAQ, dan features.
5. Setelah audit, buat rencana milestone dan laporkan temuannya. JANGAN melakukan rewrite besar sebelum audit dan rencana ditinjau pemilik bisnis.
6. Pertahankan hanya tujuh template existing.
7. Setelah homepage matang, lanjutkan ke Templates, Template Detail,
   Pricing, How It Works, Rasio AI, Checkout, Onboarding, dan Dashboard.
8. Jangan menambah template/sektor baru tanpa instruksi eksplisit.
9. Gunakan real product surfaces sebagai visual, bukan AI-style decoration.
10. Buat background memiliki depth, button polished, dan motion terarah.
11. Test desktop/mobile/accessibility.
12. Render screenshot setiap major page dan lakukan refinement pass.

Jangan berhenti hanya karena code berhasil.
Hasil harus terasa seperti produk SaaS/managed platform yang matang.
```

---

**END OF CURRENT-PHASE SPEC**

---

# 83. ADDENDUM GPT-6 — PRIORITAS TAMBAHAN SEBELUM IMPLEMENTASI BESAR

Bagian ini adalah **perbaikan atas v2**, dan menang jika bertentangan dengan kalimat lama yang belum spesifik. Bukan permintaan membuat fitur baru tanpa batas. Kerjakan pada arsitektur/prototype yang relevan dan tunda integrasi backend produksi.

## 83.1. Pisahkan aturan bisnis yang sudah diputuskan dari yang belum

**Sudah diputuskan:**

- Rasio adalah managed website subscription, bukan DIY builder.
- Durasi paket **1 / 12 / 24 / 48 bulan**, semuanya harus dipertahankan.
- Harga Rasio Profile yang sudah ditetapkan: 1 bulan Rp109.000, **12 bulan Rp54.500/bulan (total Rp654.000)**, 24 bulan Rp32.000/bulan (total Rp768.000), 48 bulan Rp27.750/bulan (total Rp1.332.000).
- Tujuh template existing tetap digunakan. Tidak membuat template/sektor baru.
- Fokus pada halaman utama, katalog, flow, onboarding, dashboard prototype, AI prototype, dan polish.

**Perlu konfirmasi bisnis sebelum checkout produksi:**

- Apakah pembayaran 12/24/48 bulan selalu dibayar penuh di depan; opsi 1 bulan dibayar bulanan; renewal harga mengikuti harga lama atau harga baru.
- TLD yang masuk subsidi domain, batas harga pendaftaran, biaya renewal tahun berikutnya, siapa membayar, dan kebijakan transfer domain.
- Detail jam layanan, target waktu respons, halaman yang termasuk, estimasi setup setelah bahan lengkap, dan daftar perubahan yang memerlukan penawaran custom. **Jumlah revisi minor tidak dibatasi selama langganan aktif.**
- Sebelum dipublikasikan, **draf prosedur pembatalan/refund, renewal, domain, lisensi website, dan pengelolaan data pada Bab 85 wajib ditinjau penasihat hukum Indonesia**. Pilihan angka operasional yang diajukan harus disetujui bisnis.
- Status ketersediaan dan limit penggunaan Rasio AI, Rasio Store, pembayaran, analitik, serta domain/email provisioning.

**Instruksi Codex:** buat `BUSINESS_DECISIONS.md` dengan tabel `Aturan | Status: Confirmed/Provisional/Pending | Sumber | Dampak UI | Pertanyaan`. Jangan menuliskan keputusan pending sebagai janji final di website atau checkout.

## 83.2. Jangan samakan uang masuk di awal dengan laba

Untuk kontrak 24/48 bulan, cash diterima sekarang tetapi layanan diberikan berbulan-bulan atau bertahun-tahun. Saat merancang dashboard admin/financial overview, pisahkan:

- nilai kontrak yang diterima;
- revenue yang diakui selama periode layanan;
- estimasi biaya hosting/email/support/AI/domain selama masa kontrak;
- cadangan biaya masa depan;
- refund/chargeback jika berlaku.

Jangan tampilkan `cash collected = profit` atau memasarkan keuntungan model bisnis dengan angka tanpa biaya.

## 83.3. Tambahkan SERVICE SCOPE yang membatasi support creep

Buat tabel yang dipakai bersama pada pricing, onboarding, FAQ, dan kebijakan:

| Kategori | Yang dijelaskan |
|---|---|
| Setup awal | Data/material yang harus diberikan klien, langkah pengerjaan, batas waktu setelah semua bahan lengkap |
| Konten | Field yang bisa diubah lewat CMS dan konten yang dikerjakan tim Rasio |
| Revisi | Revisi minor tanpa batas jumlah selama langganan aktif; definisi minor versus request custom |
| Struktur template | Yang bisa disesuaikan dan yang fixed dalam template |
| Hosting/SSL | Termasuk selama periode aktif, kondisi pengakhiran layanan |
| Domain | Pendaftaran, kepemilikan, renewal, transfer, biaya tahun berikutnya |
| Email | Jumlah mailbox dasar, periode aktif, tambahan berbayar jika ada |
| Support | Jam layanan dan kanal kontak, bukan klaim 24/7 tanpa kemampuan nyata |
| Expiry | Apa yang terjadi pada website, domain, email, konten, dan akun setelah masa kontrak |

**Codex tidak boleh mengarang angka kuota atau janji SLA.** Jika belum diputuskan, tampilkan sebagai butir keputusan bisnis yang perlu disetujui, bukan sebagai benefit pasti.

## 83.4. Definisikan STATE MACHINE untuk keseluruhan customer journey

Prototype HTML tidak cukup hanya membuat tombol Next dan Back. Buat status yang bisa dipahami klien dan admin:

```text
ORDER:
draft → pending_payment → paid
                        ↘ failed / expired / cancelled

ONBOARDING:
not_started → in_progress → submitted
                              ↘ incomplete / needs_more_info

WEBSITE:
waiting_for_material → preparing → internal_review → client_review
                                              ↑                  ↓
                                           revision_requested ←─┘
                                           client_approved → publishing → live
                                                               ↘ publish_failed

SUBSCRIPTION:
pending → active → expiring → renewed / expired / cancelled
```

Dalam prototype, simulasi skenario berikut:

1. Pembayaran gagal / kedaluwarsa dan dapat dicoba ulang.
2. Checkout belum dibayar — website tidak dianggap aktif.
3. Onboarding belum lengkap — pelanggan tahu apa yang kurang.
4. Material tidak memenuhi kualitas minimum — staff meminta perbaikan.
5. Preview menunggu approval — tombol approve / request revision jelas.
6. Revisi diminta — alasan, status, dan versi preview jelas.
7. Domain belum tersambung — website tidak boleh diklaim live di custom domain.
8. Publish gagal — retry/eskalasi, tidak menampilkan status sukses palsu.
9. Subscription hampir habis / sudah habis — langkah selanjutnya jelas.

**Jangan membuat pembayaran atau aktivasi subscription sungguhan hanya melalui perubahan state di browser.** Di implementasi produksi nanti, status bayar harus berasal dari verifikasi server-side/payment webhook yang aman.

## 83.5. Pisahkan prototype UI dari fungsi yang benar-benar aktif

Saat ini HTML/CSS/JS merupakan alat validasi. Berikan label jelas dalam dokumentasi proyek:

- `PROTOTYPE_ONLY`: checkout simulasi, dashboard contoh, SEO audit dummy, Rasio AI dummy, analytics dummy.
- `FUNCTIONAL_FRONTEND`: filter template, navigasi, form validation lokal, preview.
- `FUTURE_BACKEND_INTEGRATION`: payment webhook, real login, multi-tenant, persistent onboarding, publish pipeline, real analytics, real AI.

Setiap CTA perlu tujuan yang bermakna. Jika aksi belum tersedia, gunakan demo yang jujur/disabled dengan pesan jelas, bukan tombol seolah berhasil membayar atau mempublikasikan website.

Jangan meminta kredensial pembayaran sungguhan dalam prototype. Jangan menyimpan data pribadi, password, API key, atau informasi pembayaran sensitif di localStorage/front-end source. Gunakan data contoh non-sensitif.

## 83.6. Berikan acceptance criteria untuk setiap milestone

**Milestone A — Audit & aturan bisnis**

- `AUDIT.md` selesai: markup, flow, visual, dead links, aksesibilitas, pricing.
- `BUSINESS_DECISIONS.md` membedakan keputusan yang confirmed dan pending.
- Daftar route, current-to-target mapping, dan rencana pengerjaan jelas.
- Hentikan perubahan besar sampai audit/rencana ditinjau pemilik bisnis.

**Milestone B — Marketing / Product discovery**

- Homepage menjelaskan managed service dalam 5–10 detik.
- Semua nav/CTA bermakna.
- Katalog hanya menampilkan 7 template existing.
- Filter/search/empty state/preview/detail berfungsi pada berbagai ukuran layar.
- Halaman harga menampilkan durasi 1/12/24/48 serta total dengan sumber config tunggal; 12 bulan adalah confirmed Rp654.000 total.

**Milestone C — Simulasi pembelian & onboarding**

- Pengunjung dapat memilih template + plan dan melihat ringkasan harga yang konsisten.
- Ada simulasi success/failure/expired payment.
- Form onboarding dapat maju/mundur, memvalidasi, dan menunjukkan bahan yang kurang.
- Preview → request revision → approve → publish status dapat didemokan tanpa mengklaim live.

**Milestone D — Dashboard, AI & bantuan**

- Navigasi dashboard utuh dan semua halaman punya loading/empty/error/success state sesuai kegunaan.
- Mock metric diberi penanda demo; AI output tidak mengarang metrik dan perubahan konten belum langsung dipublish.
- Help/FAQ dan jalur dukungan dapat ditemukan dengan mudah.

**Milestone E — UI, Motion & QA**

- Sistem button, background, typography, layout, motion konsisten.
- Tidak ada fake trust/AI slop/dead CTA.
- Mobile 360–430px, tablet, desktop, keyboard, reduced-motion teruji.
- Capture screenshot dan refinement pass.

**Penting:** selesai satu milestone → tes → catat hasil → lanjut. Jangan rewrite seluruh website dalam satu commit besar yang sulit direview.

## 83.7. Instrumentasi funnel Rasio sejak tahap desain

Siapkan event schema untuk integrasi analytics nanti:

```text
home_view
product_view
template_list_view
template_preview_opened
template_selected
plan_selected
checkout_started
payment_verified (server only)
onboarding_started
onboarding_submitted
preview_approved
site_published (server only)
```

Sertakan `template_id`, `product_id`, dan `plan_id` bila aman dan relevan, tetapi jangan mengirim konten pribadi klien/secret sebagai analytics events. Untuk tahap HTML, cukup definisikan naming conventions dan demo event logger; belum perlu penyedia tracking produksi.

## 83.8. Aturan template existing tetap berlaku

Pada `/templates/{slug}`, tampilkan **halaman dan fitur yang BENAR-BENAR ADA pada file template existing**. Jangan menyalin contoh blueprint sektor dari dokumen lama lalu mengklaim itu sudah tersedia. Jika ingin menambah field/fitur di kemudian hari, itu masuk backlog ekspansi template setelah platform matang.

## 83.9. Kualitas teknis minimum

- Site harus nyaman pada jaringan mobile lambat: optimalkan file HTML berisi asset Base64 sangat besar, lazy-load gambar, kompres media, hindari asset duplikat.
- Gunakan web performance metrics (LCP, CLS, INP) sebagai alat ukur, bukan hanya screenshot visual.
- Jangan mengunci arsitektur ke satu HTML monolitik bila sudah ada banyak page; gunakan komponen, data, dan design tokens reusable sesuai stack yang ada sekarang. **Tidak perlu migrasi stack penuh pada fase ini.**
- Beda jelas halaman publik vs dashboard/checkout: data mock tidak boleh bocor sebagai data pelanggan nyata.
- Tampilkan state keyboard, focus, error, loading, empty, mobile, and reduced motion pada pengujian.

---

# 84. PROMPT FINAL UNTUK CODEX — MULAI DARI AUDIT

```text
Baca seluruh project Rasio Labs existing dan file
RASIO_LABS_FASE_PEMATANGAN_CODEX_v3.md sebagai source of truth.

Fokus fase sekarang: arsitektur halaman, product clarity, conversion funnel,
pricing, checkout/onboarding UX, dashboard prototype, Rasio AI prototype,
help, responsivitas, visual polish, dan motion. JANGAN membuat template baru
atau sektor baru; gunakan hanya tujuh template existing.

Empat durasi Rasio Profile adalah 1, 12, 24, dan 48 bulan. Paket 12 bulan
WAJIB dipertahankan. Rp54.500/bulan (total Rp654.000) adalah harga existing
yang sudah ditegaskan untuk dipertahankan oleh pemilik bisnis.
Tidak boleh menghapus 12 bulan atau mengubah harga secara sepihak.

Mulai dari audit, BUKAN redesign massal.
1. Baca seluruh HTML/CSS/JS dan daftar route/link/komponen existing.
2. Buat AUDIT.md berisi masalah product, funnel, pricing, UX, responsive,
   accessibility, performance, unsupported claims, dan dead CTA.
3. Buat BUSINESS_DECISIONS.md: confirmed / provisional / pending.
4. Buat rencana milestone A–E dan kriteria penerimaan setiap milestone.
5. Hindari mengganti stack dan backend produksi dulu.
6. Tunggu review audit/rencana sebelum melakukan rewrite besar.
7. Setelah disetujui, implementasi bertahap dengan verifikasi per milestone.

Desain harus modern, premium, bertenaga namun tidak generik: depth pada
background, template screenshot asli, buttons dengan states lengkap,
motion yang intentional, dan mobile first-class. Tidak boleh AI slop,
background monoton, fake testimonials, fake statistics, atau fake dashboard
live claims. Semua interaksi harus bermakna.

North Star: “Pilih template. Kirim informasi bisnis. Rasio urus sisanya.”
```

---

# 85. ADENDUM v4 — KEPUTUSAN BISNIS BARU DAN DRAF KEBIJAKAN PELANGGAN

> **Hierarki keputusan:** Bab 85 ini mengesampingkan seluruh pernyataan *pending* atau *provisional* sebelumnya mengenai harga 12 bulan, domain tahun pertama, dan revisi minor. Bab ini adalah rancangan kebijakan operasional/kontraktual untuk konteks pasar Indonesia; **BUKAN pendapat hukum final** dan harus direview penasihat hukum sebelum ditayangkan sebagai syarat kontrak yang mengikat.
>
> **Status:** harga/durasi, kelayakan domain berdasarkan durasi, dan revisi minor unlimited = **CONFIRMED oleh pemilik bisnis**. Mekanisme pembatalan/refund, durasi grace period dan data retention di bawah ini = **REKOMENDASI DRAF, perlu approval bisnis + review hukum sebelum produksi**.

## 85.1. RINGKASAN ATURAN RESMI

| Komponen | Aturan | Status |
|---|---|---|
| 1 bulan | Rp109.000 total | CONFIRMED |
| 12 bulan | Rp54.500/bulan ekuivalen, total Rp654.000 | CONFIRMED |
| 24 bulan | Rp32.000/bulan ekuivalen, total Rp768.000 | CONFIRMED |
| 48 bulan | Rp27.750/bulan ekuivalen, total Rp1.332.000 | CONFIRMED |
| Domain gratis tahun pertama | Untuk paket **12, 24, dan 48 bulan** | CONFIRMED |
| Paket 1 bulan | Tidak termasuk pendaftaran domain gratis | CONFIRMED |
| Domain tahun kedua dst. | Pembaruan ditanggung pelanggan dan diinformasikan lebih dulu | REKOMENDASI |
| Revisi minor | Tanpa batas **jumlah permintaan** yang masuk cakupan selama langganan aktif | CONFIRMED |
| CMS | Pelanggan bebas melakukan perubahan pada field konten yang didukung template | CONFIRMED |
| Revisi besar / custom | Penawaran dan persetujuan biaya terpisah | REKOMENDASI |
| Renewal kontrak | Tidak dibebankan otomatis secara default; butuh persetujuan aktif | REKOMENDASI |
| Hak atas template/code | Lisensi penggunaan saat layanan aktif; bukan pengalihan source code | REKOMENDASI |
| Hak atas domain dan aset milik pelanggan | Tetap pada pelanggan | REKOMENDASI |

**Pricing implementation:**

```js
export const profilePlans = [
  { months: 1,  monthlyEquivalent: 109000, totalPrice: 109000,  freeDomainFirstYear: false },
  { months: 12, monthlyEquivalent: 54500,  totalPrice: 654000,  freeDomainFirstYear: true  },
  { months: 24, monthlyEquivalent: 32000,  totalPrice: 768000,  freeDomainFirstYear: true, badge: 'Paling Populer' },
  { months: 48, monthlyEquivalent: 27750,  totalPrice: 1332000, freeDomainFirstYear: true, badge: 'Harga Terbaik' }
];
```

Jangan tampilkan domain gratis secara general tanpa memeriksa `freeDomainFirstYear` dari selected plan.

## 85.2. KEBIJAKAN DOMAIN — DRAF CUSTOMER-FACING

> **Domain gratis tahun pertama.** Pelanggan yang membeli paket 12, 24, atau 48 bulan berhak atas pembebasan biaya pendaftaran satu nama domain yang memenuhi ketentuan program Rasio Labs untuk masa pendaftaran pertama selama satu tahun. Paket 1 bulan tidak mendapatkan manfaat ini.
>
> **Syarat kelayakan.** Domain tergantung ketersediaan, pilihan ekstensi/TLD yang didukung, dan batas nilai pendaftaran yang diumumkan secara jelas sebelum pembayaran. Domain premium, domain dengan harga khusus, dan biaya tambahan yang tidak ditanggung paket memerlukan persetujuan pelanggan sebelum dibebankan. Rasio wajib menetapkan daftar TLD dan batas subsidi secara terbuka sebelum benefit ini ditawarkan di checkout produksi.
>
> **Tahun kedua dan selanjutnya.** Biaya perpanjangan domain setelah tahun pertama merupakan tanggung jawab pelanggan, termasuk ketika paket website masih aktif dalam masa kontrak 12, 24, atau 48 bulan. Rasio akan menampilkan tanggal kedaluwarsa domain dan tarif perpanjangan yang berlaku saat penagihan sebelum meminta pembayaran.
>
> **Registran domain.** Apabila pendaftaran dilakukan melalui Rasio, data registran/penanggung jawab yang berhak harus mencerminkan pelanggan atau entitas bisnisnya sesuai persyaratan registrar dan TLD. Rasio dapat menjadi pengelola teknis berdasarkan otorisasi pelanggan tetapi bukan pemegang hak domain atas nama dirinya untuk mengunci pelanggan.
>
> **Transfer.** Pelanggan dapat meminta transfer/perubahan pengelola domain yang secara sah terdaftar atas namanya, mengikuti ketentuan registrar/registri dan ketentuan transfer yang berlaku. Pembatalan layanan website tidak dengan sendirinya mengalihkan domain kepada Rasio. Biaya transfer/renewal dari registrar (jika ada) diinformasikan sebelum pelaksanaan; jangan menahan domain sebagai jaminan atas tagihan website yang tidak terkait.
>
> **Domain sendiri.** Pelanggan boleh menggunakan domain yang sudah dimiliki. Manfaat domain gratis tidak otomatis dapat diuangkan, dikonversi menjadi kredit, atau menambah masa kontrak jika tidak digunakan; hal ini harus dijelaskan sebelum pembelian.

**Catatan legal:** Domain adalah hak pendaftaran/penggunaan menurut mekanisme registri, bukan klaim hak milik absolut atas string internet. Status registran dan mekanisme transfer mengikuti ketentuan TLD terkait.

**Penentuan yang masih harus diputuskan sebelum live:** daftar TLD subsidi, plafon harga tahun pertama, registrar pilihan, pembebanan pajak, opsi transfer masuk, persyaratan nama domain khusus, tata cara pembelian domain untuk paket 1 bulan. Ini tidak mengubah hak benefit domain tahun pertama bagi pelanggan paket >=12 bulan.

## 85.3. REVISI MINOR TANPA BATAS JUMLAH — DRAF CUSTOMER-FACING

> **Revisi minor tanpa batas jumlah.** Selama langganan aktif, pelanggan dapat mengajukan perubahan kecil pada website yang sudah termasuk dalam cakupan template kapan pun diperlukan, tanpa batas jumlah permintaan revisi. Pelanggan juga dapat memperbarui sendiri konten yang didukung melalui CMS tanpa perlu menghubungi tim Rasio Labs.
>
> **Termasuk revisi minor:** koreksi salah ketik, perbaikan kalimat pendek, penggantian nomor telepon/WhatsApp/alamat/jam operasional, pembaruan tautan sosial, penggantian foto yang telah disediakan pelanggan pada slot yang ada, serta penyesuaian konten kecil lain tanpa menambah atau mengubah struktur halaman, komponen, maupun fungsi sistem.
>
> **Bukan revisi minor:** mendesain ulang layout, mengganti template secara penuh, menambahkan halaman/section/fitur baru, mengubah alur transaksi, membuat integrasi API, mengubah source code, membuat foto atau ilustrasi baru, input data massal besar, atau pekerjaan yang membutuhkan pengembangan khusus. Permintaan ini dapat diproses melalui estimasi biaya dan persetujuan terpisah.
>
> **Prosedur:** ajukan permintaan melalui kanal dukungan yang ditetapkan dengan informasi halaman, konten sebelum/sesudah, dan materi pendukung. Rasio menangani permintaan sesuai antrean dan jam layanan yang diumumkan. Permintaan tidak dibatasi jumlahnya, namun beberapa permintaan pada saat yang sama dapat dikonsolidasikan atau dikerjakan berurutan untuk menjaga kualitas dan keamanan website.
>
> **Batasan wajar:** hak revisi minor tidak mencakup spam, permintaan yang melanggar hukum/hak pihak lain, perubahan di luar ruang lingkup, atau instruksi yang berpotensi mengganggu keamanan sistem. Rasio harus menjelaskan alasan jika sebuah permintaan dinilai di luar cakupan, serta menawarkan alternatif atau penawaran custom yang transparan. Tidak boleh memperkenalkan batas numerik tersembunyi sambil mengiklankan 'tanpa batas'.

**Codex:** Buat definisi `revision_type: minor | major | incident`, `revision_status: submitted | triaged | awaiting_material | queued | in_progress | completed | needs_quote`; dashboard harus menunjukkan riwayat permintaan dan penjelasan cakupan. **Jangan membuat penghitung “sisa revisi”**. Tidak ada janji penyelesaian 24/7 atau SLA yang belum disahkan.

## 85.4. PEMBATALAN DAN PENGEMBALIAN DANA — USUL KEBIJAKAN

### A. Nonaktifkan perpanjangan (cancel renewal)

> Pelanggan dapat memilih **Tidak Perpanjang** kapan saja sebelum periode berikutnya ditagihkan. Tindakan ini tidak langsung menonaktifkan website yang sudah dibayar: website, CMS, dan benefit dalam kontrak tetap tersedia sampai akhir masa berlangganan, kecuali terdapat alasan hukum atau keamanan yang sah. Setelah memilih tidak memperpanjang, pelanggan tidak dikenai biaya untuk masa kontrak berikutnya tanpa persetujuan baru.

### B. Pembatalan sebelum pekerjaan khusus dimulai

**Usulan kebijakan goodwill, bukan klaim kewajiban undang-undang umum:** pelanggan dapat meminta pembatalan **dalam tujuh hari kalender setelah pembayaran** selama Rasio belum memulai pekerjaan setup individual dan belum melakukan pengeluaran pihak ketiga atas instruksi pelanggan yang telah diberitahukan. Jika syarat ini dipenuhi, pengembalian dana penuh diproses lewat metode pembayaran yang memungkinkan.

Jika domain sudah didaftarkan atas permintaan pelanggan, pendaftaran biasanya tidak dapat dibatalkan di tingkat registrar. Biaya riil pihak ketiga yang telah dikonfirmasi sebelumnya perlu dijelaskan secara rinci. **Jangan otomatis memotong “biaya setup” tersembunyi saat halaman penjualan mengatakan setup gratis.** Domain yang sudah terdaftar tetap menjadi hak registran.

### C. Pembatalan setelah pekerjaan dimulai tetapi sebelum website tayang

Jika pelanggan meminta berhenti ketika pekerjaan telah dimulai, Rasio harus memberi ringkasan pekerjaan yang telah diselesaikan dan biaya pihak ketiga yang sudah terjadi, serta menghitung pengembalian dana secara wajar atas layanan yang belum diberikan dengan memperhatikan perjanjian dan hukum yang berlaku. Tidak boleh menerapkan klausula tunggal “semua uang hangus”. Bukti layanan yang telah dikerjakan dan komponen biaya yang telah disepakati perlu disimpan.

### D. Setelah website tayang, pelanggan tidak ingin melanjutkan

Pilihan default yang jelas adalah **berhenti pada akhir periode yang telah dibayar**. Jika pelanggan meminta pengakhiran lebih dini, berikan prosedur pengajuan dan penilaian proporsional terhadap layanan yang sudah/ belum diberikan, biaya pihak ketiga yang tidak dapat dikembalikan yang telah diungkap, dan hak-hak konsumen yang berlaku. Jangan menjanjikan otomatis tidak ada refund untuk semua kondisi, dan jangan menggunakan penalti pengakhiran yang tidak pernah dijelaskan di checkout.

### E. Jika Rasio gagal memenuhi kewajibannya

Apabila Rasio tidak dapat memberikan layanan sesuai kontrak, pelanggan berhak mengajukan perbaikan/pemenuhan layanan, pembatalan, atau pengembalian yang layak berdasarkan kontrak dan hukum yang berlaku. Jangan menulis pengalihan tanggung jawab seluruhnya ke pelanggan atau pihak ketiga. Hak hukum pelanggan tidak boleh ditiadakan hanya lewat checkbox.

### F. Prosedur penanganan

1. Pelanggan membuka permohonan melalui dashboard atau email dukungan resmi.
2. Sistem mengirim nomor tiket dan konfirmasi penerimaan.
3. Rasio memverifikasi kontrak, status pembayaran, domain, dan pengerjaan yang sudah dilakukan.
4. Rasio memberi rincian keputusan, dasar perhitungan, dan saluran pengajuan keberatan.
5. Pengembalian dilakukan via kanal pembayaran yang tersedia dan statusnya tercatat; waktu pemrosesan aktual perlu diumumkan secara jujur setelah sistem pembayaran ditetapkan.
6. Sengketa diupayakan selesai lewat mekanisme pengaduan/kesepakatan yang seimbang tanpa menghilangkan hak menempuh mekanisme penyelesaian sengketa yang disediakan hukum.

**Catatan:** Detail formula refund setelah pekerjaan dimulai, biaya eksternal yang recoverable, serta rentang hari kerja untuk proses refund merupakan keputusan bisnis + review hukum **yang masih harus disetujui** sebelum checkout nyata.

## 85.5. RENEWAL LANGGANAN — USUL KEBIJAKAN

> **Tidak ada auto-renewal berbayar sebagai default.** Rasio Labs tidak melakukan penagihan otomatis untuk kontrak berikutnya tanpa persetujuan aktif dan dasar pembayaran yang sah. Pelanggan bisa memperpanjang melalui dashboard sebelum masa aktif berakhir.
>
> **Pengingat sebelum berakhir.** Rasio menampilkan expiry date sejak awal dan mengirim pengingat yang ditargetkan pada H-30, H-14, H-7, dan H-1, sesuai kanal komunikasi yang disetujui.
>
> **Harga saat memperpanjang.** Sebelum konfirmasi, tampilkan paket, durasi, harga ekuivalen bulanan, **total pembayaran**, tanggal mulai/selesai periode berikutnya, dan biaya domain/email terpisah bila berlaku. Harga perpanjangan mengikuti penawaran yang disetujui pelanggan saat memperpanjang, bukan perubahan diam-diam atas kontrak berjalan.
>
> **Pilihan paket.** Pelanggan boleh memilih paket 1/12/24/48 bulan yang tersedia saat renewal. Perubahan periode tidak boleh dijalankan tanpa persetujuan pelanggan.
>
> **Gagal membayar.** Jika masa aktif habis tanpa renewal, sistem memberikan masa tenggang sesuai kebijakan operasional yang dipublikasikan; website kemudian dapat disuspensi secara tertib setelah pemberitahuan. Domain memiliki tanggal kedaluwarsa dan aturan registrar terpisah dari langganan website.

**Usulan konfigurasi untuk diputuskan:** `subscription_grace_days = 14` (periode pemulihan selepas expiry sebelum website disuspensi), `reminder_days = [30,14,7,1]`. Nilai ini bukan kewajiban hukum universal dan belum dijanjikan kepada pelanggan sampai disetujui serta diuji operasionalnya.

**Penting:** Tanggal kontrak Rasio dan expiry domain **tidak selalu sama**. Pada paket 48 bulan, website sudah dibayar 4 tahun, tetapi domain hanya gratis **tahun pertama**; untuk tahun ke-2, ke-3, dan ke-4 pelanggan tetap harus memperpanjang domain tepat waktu. Apabila domain tidak diperpanjang, domain bisa berhenti berfungsi menurut aturan registrar meski langganan website masih aktif. Rasio harus memberi pengingat terpisah untuk kedua jenis expiry.

## 85.6. KEPEMILIKAN WEBSITE, DOMAIN DAN KONTEN — DRAF CUSTOMER-FACING

> **Aset pelanggan.** Seluruh logo, merek, foto, video, naskah, daftar produk, informasi kontak, konten bisnis, dan data yang diserahkan pelanggan tetap menjadi milik atau berada di bawah hak penggunaan sah pelanggan/pemilik aslinya. Pelanggan memberi Rasio lisensi terbatas untuk menggunakan aset tersebut guna menyiapkan, mengoperasikan, mendukung, dan menampilkan website selama diperlukan untuk menjalankan layanan.
>
> **Template dan perangkat lunak.** Desain template standar, source code, komponen UI, CMS, dashboard, struktur database platform, otomasi, dan sistem Rasio yang dimiliki atau dilisensikan secara sah kepada Rasio tidak dialihkan hak ciptanya kepada pelanggan melalui pembayaran berlangganan. Pelanggan memperoleh **lisensi penggunaan website berbasis template selama masa layanan aktif**, bukan hak memiliki atau mendistribusikan ulang template/source code.
>
> **Domain.** Hak sebagai registran/pengguna domain mengikuti data registrasi pelanggan dan kebijakan registrar/registri. Rasio dapat mengurus teknis atau perpanjangan atas kuasa pelanggan. Hak pelanggan atas domain tidak berakhir otomatis ketika langganan website Rasio berhenti.
>
> **Konten yang dibuat khusus.** Copy/foto/grafik yang dibuat khusus oleh Rasio atau AI-assisted output dan telah dibayar perlu dibedakan dari software/template standar. Hak atas karya khusus dan lisensi penggunaannya ditetapkan eksplisit dalam order/kontrak; jangan berasumsi transfer otomatis semua hak cipta. Output AI dapat mengandung pembatasan legal dan ketentuan penyedia model yang terpisah.
>
> **Pengakhiran langganan.** Setelah masa aktif dan masa tenggang berakhir, Rasio tidak berkewajiban terus menghosting atau melisensikan penggunaan template/platform tanpa pembayaran. Namun pelanggan tetap berhak atas aset asli miliknya, serta akses ekspor data bisnis yang wajar sesuai ketentuan kontrak dan hukum. Ekspor tidak termasuk source code proprietary, plugin berbayar, secret, credential internal, atau teknologi pihak ketiga yang tidak boleh dialihkan.
>
> **Portabilitas.** Rasio menyediakan mekanisme permintaan ekspor konten bisnis dalam bentuk wajar (mis. CSV/JSON untuk konten terstruktur dan arsip aset yang memang berhak diekspor) saat kontrak masih aktif dan selama periode transisi yang diumumkan. Jangan membuat pelanggan kehilangan akses atas data bisnisnya hanya karena memakai CMS Rasio.
>
> **Data pribadi.** Penghapusan/penahanan arsip dan backup harus berdasarkan tujuan sah, masa retensi yang diterangkan, dan hak subjek data; jangan menyatakan semua data dihapus seketika bila ada backup/audit/legal obligations yang secara sah masih berlaku.

**Usulan transisi data untuk ditinjau:** akses ekspor mandiri ketika akun aktif, jendela permintaan ekspor 30 hari setelah akhir kontrak, retensi pemulihan data operasional hingga 60 hari sesudahnya sebelum penghapusan terjadwal dengan pengecualian kewajiban hukum/backup yang transparan. Angka tersebut adalah pilihan kebijakan, bukan angka yang diwajibkan hukum.

**Hak cipta:** perlu mengatur secara tertulis klasifikasi aset pelanggan, template proprietary, aset stok berlisensi, hasil pekerjaan khusus, hak atas output AI, dan source code yang di-*custom build*. Paket Rasio Custom bisa memerlukan perjanjian IP terpisah.

## 85.7. PENGALAMAN PELANGGAN DAN UI WAJIB

**Pricing card dan checkout:**

- Tampilkan empat durasi termasuk 12 bulan. Sebut `harga ekuivalen/bulan` dan **jumlah yang dibayar saat checkout**.
- Benefit domain: label `Domain gratis tahun pertama` pada 12/24/48 bulan; pada 1 bulan tulis `Domain tidak termasuk`.
- Tooltip/FAQ dekat benefit: `Tahun kedua dan seterusnya dibayar terpisah oleh pelanggan`.
- Domain choices dan biaya ekstensi di luar subsidi harus transparan sebelum bayar.
- Jelaskan setup/CMS, revisi minor unlimited, batas customisasi, dan layanan aktif sepanjang kontrak.
- Link langsung ke `Terms`, `Cancellation & Refund Policy`, `Domain Policy`, `Renewal Policy`, `Ownership & Data Policy` sebelum tombol bayar.
- Persetujuan syarat pembayaran harus aktif dan dapat ditinjau, bukan checkbox dicentang otomatis.

**Halaman dashboard:**

```text
Subscription
  - paket / start / end
  - renewal price / reminder / manual renew
  - turn off renewal (jika tersedia auto renew kelak)
  - stop at end of term
  - ask for early termination / refund

Domain
  - registrant / registrar / expiry
  - year-1 covered? / renewal cost / payment status
  - transfer management request

Website / Support
  - CMS self-edit
  - Ajukan Revisi Minor
  - Tinjau Status Revisi
  - Ajukan Perubahan Besar (dengan estimasi)

Account / Data
  - Export Konten
  - Transfer Domain
  - Permintaan Hapus Data
```

**State penting:** `renewal_opt_in`, `renewal_requested`, `renewal_paid`, `domain_first_year_eligible`, `domain_year_one_registered`, `domain_renewal_due`, `subscription_expiring`, `subscription_grace`, `website_suspended`, `data_export_requested`, `revision_queued`, `early_termination_requested`, `refund_under_review`, `refund_completed`.

**Email notifications:** domain renewal dan subscription renewal harus dipisahkan, termasuk jika waktunya jauh berbeda. Pemberitahuan harus berisi tanggal, harga, dan jalur aksi; jangan membuat urgency palsu.

## 85.8. LANDASAN HUKUM DAN RISIKO YANG WAJIB DIAUDIT

Rujukan publik yang digunakan saat menyusun **draf**, bukan garansi legalitas semua klausula:

1. **UU Nomor 8 Tahun 1999 tentang Perlindungan Konsumen** — terutama Pasal 18 mengenai klausula baku. Hindari pengalihan tanggung jawab sepihak, larangan mutlak terhadap pengembalian dana dalam segala kondisi, serta perubahan syarat kontrak sepihak.
   - https://jdih.kemenkeu.go.id/api/download/fulltext/1999/8TAHUN~1999UU.htm
2. **PP Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik**, khususnya Pasal 45–50: kesepakatan, transparansi, kewajiban informasi produk, dan kontrak elektronik berbahasa Indonesia; kontrak mencakup biaya, prosedur pembatalan, dan mekanisme pengaduan.
   - https://jdih.komdigi.go.id/produk_hukum/view/id/695/t/common
3. **PP Nomor 80 Tahun 2019 tentang Perdagangan Melalui Sistem Elektronik** (periksa kewajiban e-commerce/PSE yang berlaku pada operasional sesungguhnya).
   - https://jdih.kemendag.go.id/peraturan/peraturan-pemerintah-nomor-80-tahun-2019-tentang-perdagangan-melalui-sistem-elektronik
4. **UU Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi**, khususnya prinsip pemrosesan, penghapusan, dan masa retensi data.
   - https://jdih.komdigi.go.id/produk_hukum/view/id/832/t/crc32/
5. **UU Nomor 28 Tahun 2014 tentang Hak Cipta**, termasuk program komputer, hak ekonomi, dan pentingnya pengaturan tertulis mengenai hak atas hasil pesanan.
   - https://jdih.kemenkeu.go.id/dok/68e5afea-c41a-4d5d-9474-d7c708ecad3e
6. **Kebijakan Pendaftaran Nama Domain `.id` PANDI**, khususnya ketentuan registran, registrar, perpanjangan, dan pengalihan nama domain.
   - https://pandi.id/public/files/2024/10/kebijakan-pendaftaran-nama-domain-versi-9-0-bilingual-new-1729151599.pdf
7. **ICANN Registrant Rights**, relevan bagi TLD internasional, bukan pengganti kebijakan TLD `.id`.
   - https://www.icann.org/registrants

**BEFORE PRODUCTION:** penasihat hukum Indonesia perlu mengecek nama/kapasitas hukum penyedia Rasio, dokumen perusahaan dan pajak, kewajiban PSE/PMSE, mekanisme pembayaran dan refund, klausula baku, legal basis serta pengendalian/prosesor data, perjanjian pemrosesan data bila relevan, hak penggunaan konten pihak ketiga, domain/registrar contracts, dan mekanisme penyelesaian sengketa.

## 85.9. INSTRUKSI KOREKSI KHUSUS UNTUK CODEX

1. Ubah `BUSINESS_DECISIONS.md`:
   - `12-month plan exists`: CONFIRMED
   - `12-month price Rp654.000 (equiv. Rp54.500/mo)`: CONFIRMED
   - `free domain year one for 12/24/48`: CONFIRMED
   - `free domain year one for 1 month`: FALSE
   - `minor revisions unlimited while active`: CONFIRMED
   - `renewal/refund/ownership text`: DRAFT_POLICY_PENDING_LEGAL_REVIEW
   - `eligible TLD/cap/domain renewal costs`: PENDING
   - `operational SLA/grace period/retention`: PROPOSED
2. Jangan lagi meminta klarifikasi yang sudah dijawab pemilik bisnis (12 bulan, harga, domain >=12, revisi minor unlimited).
3. Bangun draft halaman/section kebijakan sesuai Bab 85 dan hubungkan ke Pricing, FAQ, Checkout, Billing, Dashboard, Domain.
4. Gunakan mock state untuk tahap HTML; **jangan mengaktifkan refund, domain transfer, atau recurring charges produksi tanpa backend yang aman dan persetujuan bisnis/hukum**.
5. Perbarui seluruh FAQ terdahulu yang mengatakan domain gratis hanya pada 24/48 atau revisi terbatas. Dalam kasus konflik: **Bab 85 menang**.
6. Setelah audit, gunakan implementasi bertahap; jangan menambah template/sektor baru.

---

# 86. PROMPT SINGKAT UNTUK CODEX (JIKA MENERUSKAN PEKERJAAN SAAT INI)

```text
Lanjutkan pekerjaan Rasio Labs berdasarkan RASIO_LABS_FASE_PEMATANGAN_CODEX_v4.md.

Jangan membuat template/sektor baru. Ubah aturan bisnis berikut menjadi CONFIRMED:
- Harga/durasi Profile: 1 bulan Rp109.000; 12 bulan Rp54.500/bulan,
  total Rp654.000; 24 bulan Rp32.000/bulan, total Rp768.000;
  48 bulan Rp27.750/bulan, total Rp1.332.000.
- Domain gratis PENDAFTARAN TAHUN PERTAMA untuk paket 12/24/48 bulan,
  bukan paket 1 bulan. Domain renewal tahun ke-2 dst dibayar pelanggan.
- Revisi MINOR tanpa batas jumlah selama subscription aktif; CMS dapat
  digunakan pelanggan untuk mengedit field konten yang didukung.

Baca Bab 85 lengkap tentang pembatalan, refund, renewal, kepemilikan,
domain, portabilitas konten, dan legal disclosures. Jangan mengubah rekomendasi
kebijakan hukum menjadi klaim final atau memicu penagihan/refund otomatis.
Buat draft Terms/Policies dan business-decision register untuk review
pemilik dan penasihat hukum. Ubah Pricing, FAQ, How It Works, Onboarding,
Checkout, Domain, Subscription, Dashboard, dan Help agar konsisten.

Prioritaskan audit existing project dan arsitektur, bukan redesign template.
Setelah itu implementasi bertahap dengan screenshot desktop/mobile,
reduced-motion, accessibility, QA dan verifikasi seluruh CTA.
```
