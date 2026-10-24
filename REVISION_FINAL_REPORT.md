# Rasio Labs — finalisasi revisi Sprint 1

21 Oktober 2026. Implementasi revisi tersedia untuk review pemilik. Sprint 2 belum dimulai. Pemeriksaan screenshot halaman penuh masih terbatas seperti dijelaskan di bawah.

**Catatan riwayat, 23 Oktober 2026:** laporan di bawah tetap merekam revisi dan pemeriksaan 21 Oktober. Halaman layanan khusus dan generatornya, termasuk `scripts/sync-service-data.mjs`, kemudian dihapus sesuai permintaan pemilik pada 22 Oktober; rujuk [referensi layanan](<../docs/Rasio Labs - Referensi Halaman Layanan.md>) untuk pola yang disimpan. [Evaluasi Website dan Prioritas](<../docs/Rasio Labs - Evaluasi Website dan Prioritas.md>) dan [backlog](../FUTURE_BACKLOG.md) mencatat pekerjaan berikutnya, termasuk temuan durasi melalui preview yang belum diperbaiki. Tidak ada hasil implementasi atau QA baru yang diklaim oleh pembaruan dokumentasi ini.

Preview: http://127.0.0.1:4184/UI%20Concepts/2026-10-14/index-v3.html?duration=48#harga

## Perubahan yang selesai

- Harga resmi Store berasal dari satu konfigurasi, `server/policy-v4.mjs`. Homepage, halaman Store, komponen harga, dan checkout prototype memakai data tersebut. Harga Profile tetap mengikuti keputusan pemilik; Custom tetap berdasarkan penawaran proyek.
- Store mencantumkan produk tanpa batas dan biaya transaksi dari RasioLabs 0%. Bantuan input awal tetap 20 produk. Biaya gateway dan pihak ketiga terpisah; perubahan harga tidak menambah integrasi custom gratis.
- Custom memakai permukaan netral, penekanan harga berdasarkan lingkup proyek, CTA WhatsApp hijau dengan ikon, checklist singkat, dan tiga langkah menuju penawaran. Tidak ada nominal proyek yang dibuat-buat.
- Koreksi pemilik 21 Oktober: ketiga kartu pricing memiliki tinggi sama di desktop. Nama layanan, area harga dan CTA berbagi baris yang sejajar untuk seluruh durasi. Checklist dirapatkan secara konsisten. Di bawah 961px kartu tersusun satu kolom dan tingginya mengikuti isi. Pilihan durasi tidak mengubah label Custom. Bukti terbaru: `output/pricing-alignment/geometry.json`.
- Link navbar desktop berada tepat di tengah. Pengukuran browser pada 901, 1024, dan 1280px menunjukkan selisih pusat 0px.
- Teks marketing tentang pemesanan belum dibuka, demo, serta kalimat panjang basis penghematan dihapus. Informasi domain, revisi, renewal, pembatalan, dan kepemilikan tetap tersedia. Checkout prototype masih menampilkan status operasional yang jujur dan pembayaran tetap terkunci.
- Katalog hanya menawarkan Padel Club sesuai keputusan terbaru. Tiga gambar dekoratif hero Architecture Studio, Creative Studio, dan Padel Club tetap ada. Enam implementasi lama dihapus setelah backup; rincian berada pada `output/final-revision/delete-manifest.json`.
- Section Rasio AI beserta animasi loop yang disetujui dipertahankan. Tidak membuat template, sektor, backend, gateway, atau checkout baru.

## Harga Store

| Durasi | Ekuivalen per bulan | Total dibayar di muka | Badge | Domain tahun pertama |
|---|---:|---:|---|---|
| 1 bulan | Rp299.000 | Rp299.000 | — | Tidak termasuk |
| 12 bulan | Rp179.000 | Rp2.148.000 | — | Gratis |
| 24 bulan | Rp149.000 | Rp3.576.000 | Paling Populer | Gratis |
| 48 bulan | Rp129.000 | Rp6.192.000 | Harga Terbaik | Gratis |

Perpanjangan domain tahun berikutnya dibayar pelanggan. Nilai paket disimpan eksplisit, bukan dihitung menggunakan formula diskon. Penghematan hanya merupakan selisih terhadap tarif bulanan yang dicoret dan tidak menentukan harga paket.

Profile tetap: Rp109.000 / Rp54.500 / Rp32.000 / Rp27.750 per bulan untuk 1/12/24/48 bulan; total Rp109.000 / Rp654.000 / Rp768.000 / Rp1.332.000.

## Arsitektur dan file utama

| Source | Perubahan |
|---|---|
| `server/policy-v4.mjs` | Matrix harga, unlimited produk, bantuan 20 produk, biaya RasioLabs 0%, register keputusan |
| `server/template-catalog.mjs`, `server/templates/padel-data.mjs` dan modul template terkait | Katalog aktif Padel saja; data template tetap dapat dirender |
| `frontend/marketing/sections.mjs` | Manfaat Store dan komposisi kartu Custom |
| `frontend/marketing/components.mjs` | Ikon WhatsApp reusable |
| `frontend/marketing/content.mjs`, `policies.mjs` | Copy marketing dan ringkasan kebijakan |
| `frontend/marketing/styles/components.css` | CTA WhatsApp dan navbar desktop terpusat |
| `frontend/marketing/styles/products.css` | Spacing, permukaan Custom, breakpoint pricing, isolasi aturan durasi |
| `scripts/sync-service-data.mjs` | Sinkronisasi halaman layanan existing |
| `dist/policy-flow.js` | Ringkasan Store pada alur prototype existing |
| `scripts/build-active-templates.mjs`, `scripts/build-worker.mjs`, `scripts/build-homepage.mjs` | Build dari source aktif dan sinkronisasi output |
| `tests/marketing.test.mjs`, `tests/policy-v4.test.mjs` serta fixture template terkait | Harga, benefit, route, katalog, dan integritas perilaku |
| `DESIGN.md`, `frontend/marketing/DESIGN.md`, `BUSINESS_DECISIONS.md`, `../FUTURE_BACKLOG.md` | Keputusan desain, bisnis dan batas pekerjaan berikutnya |

Output dibangun ke `dist/`, `dist/client/`, serta `../UI Concepts/2026-10-14/`. Source CSS pricing dan ketiga salinan generated memiliki hash identik setelah build terakhir. Jangan menjadikan HTML generated sebagai source utama.

## Pengujian

| Pemeriksaan | Hasil dan bukti |
|---|---|
| Build terakhir, 21 Oktober | `npm run build` berhasil; `build-final.log` |
| Suite lengkap fungsional | 86 lulus, 0 gagal; `test-final-revision-full.log`. Dijalankan sebelum koreksi CSS terakhir |
| Regression setelah CSS terakhir | 16 lulus, 0 gagal; `test-pricing-final.log` |
| Empat durasi, browser 21 Oktober | Diuji dengan ArrowRight pada radio native. Harga, total, domain, badge, dan CTA benar; `output/final-revision/browser-pricing-final.json` |
| Stabilitas Custom | Label tetap terlihat; area harga 175,99px pada seluruh durasi di viewport 390px |
| Responsive terakhir | 1280, 1024, 901, 768, 430, 390, 360px; tanpa horizontal overflow dan tanpa gambar rusak; `browser-viewports-final.json` |
| Tablet 768px | Satu kolom pricing 520px, mengoreksi hasil lama yang masih tiga kolom |
| Menu mobile | Buka/tutup, Escape, dan link Harga diuji pada 20 Oktober; menu menutup setelah navigasi |
| CTA Store | Membuka checkout existing dengan `type=store&duration=48`, Rp129.000/bulan dan total Rp6.192.000; pembayaran tetap disabled |
| Console | Tidak ada error/warning pada pemeriksaan homepage dan checkout yang direkam |
| Kontras terpilih | CTA Custom putih/hijau 6,50:1; teks sekunder Store pada endpoint navy paling terang 7,65:1 |
| Premium strict audit | 0 error dan 0 warning pada audit 20 Oktober; `output/final-revision/premium-audit.txt` |
| Integritas aset | Pemeriksaan 20 Oktober: 17/17 HTML/aset Padel dan 3/3 gambar hero cocok dengan backup; `integrity-final.json` |

Ukuran 1440px belum diperiksa ulang dalam pass terakhir. Reduced motion diperiksa melalui source dan regression; emulasi preferensi browser serta pengujian screen reader penuh tidak diklaim selesai.

## Screenshot dan batas visual QA

Screenshot nyata tersimpan di `output/final-revision/`:

- `custom-mobile-final-heading.jpg`: header dan area penawaran Custom, 21 Oktober.
- `custom-mobile-final-button.jpg`: tombol WhatsApp, focus ring dan checklist, 21 Oktober.
- `pricing-desktop.jpg`: potongan viewport pricing desktop, 20 Oktober.
- `custom-mobile.jpg`, `custom-mobile-button.jpg`: bukti visual sebelumnya.

Browser aplikasi menghasilkan screenshot area panel yang terpotong; capture halaman penuh gagal pada pass sebelumnya. Screenshot di atas tidak mewakili homepage penuh. Layout DOM sudah diperiksa pada ukuran yang tercatat, tetapi review screenshot full desktop/mobile dan seluruh section belum dapat dinyatakan tuntas. Tidak ada gambar hasil rekonstruksi yang digunakan sebagai bukti browser.

## Impeccable dan keputusan refinement

Method: dual-agent (A: `/root/review_design_final` · B: `/root/review_evidence_final`). A selesai sebelum temuan B dibaca untuk sintesis. Laporan sumber: `output/final-revision/impeccable-design.md` dan `impeccable-evidence.md`.

Hasil sintesis disimpan di `output/final-revision/impeccable-final.md`. Penilaian A bersifat sementara dan berbasis source karena browser tidak tersedia dalam runtime agen tersebut. Parent melakukan pemeriksaan browser yang tercatat di atas. Detector benar-benar dicoba tetapi engine tidak tersedia, exit 127; tidak ada klaim hasil detector bersih. Penyimpanan snapshot bawaan juga tidak tersedia, exit 127, sehingga laporan project ini menjadi arsip manual.

Temuan aturan durasi yang memengaruhi Custom sudah diperbaiki dan diuji. Saran pengelompokan checklist Store tidak diterapkan karena pemilik meminta satu checklist lengkap. Mendekatkan penjelasan biaya gateway dan menyederhanakan istilah CMS/SKU dapat dipertimbangkan dalam review copy berikutnya, tanpa menambah section.

## Hal yang masih terbuka

1. Review visual homepage penuh dan capture desktop/mobile penuh masih perlu dituntaskan ketika fasilitas screenshot mendukungnya.
2. Keputusan kontraktual/operasional yang belum final tetap berada di `BUSINESS_DECISIONS.md`. Gate checkout produksi, recurring charge, refund, transfer domain dan penghapusan data tetap nonaktif.
3. Kesiapan teknis Store dan fitur AI perlu diverifikasi sebelum peluncuran. Pembaruan harga ini tidak mengimplementasikan ecommerce atau AI production.
4. Sprint 2 menunggu review pemilik. Kebutuhan visual template picker masa depan sudah dicatat di `FUTURE_BACKLOG.md`, belum diimplementasikan.

Backup sebelum penghapusan: `../Backups/2026-10-19-final-revision/rasio-before-template-removal.zip`, disertai manifest file dan hash Padel.

Questions skipped: pemilik sudah menentukan revisi yang harus diterapkan; tidak diperlukan keputusan desain baru untuk menutup pekerjaan ini.

## Koreksi tinggi pricing, 21 Oktober 2026

CSS subgrid menyelaraskan lima baris kartu pada desktop, dengan fallback flex. Ketiga kartu terukur 904,68px pada lebar 1280px, dan 956,23px pada lebar 1024px. Nama layanan, area harga dan CTA sejajar pada durasi 1/12/24/48 bulan. Pada 390px, tinggi mengikuti konten tanpa overflow. Screenshot desktop merupakan potongan panel aplikasi: `output/pricing-alignment/desktop-pricing-partial.jpg`. Build dan 16 regression checks terkait lolos; tidak ada console error/warning pada pass browser ini. Source perubahan terbatas pada `sections.mjs` dan `styles/products.css`, disertai pembaruan dokumentasi serta output build.

## Penyelesaian detail tombol, 22 Oktober 2026

Ditemukan selisih 2px pada CTA Custom karena ikon WhatsApp. Ikon dibatasi 20px sehingga ketiga tombol pricing kini memiliki tinggi 48px dan tepi bawah yang sejajar. Perubahan source ada pada `frontend/marketing/styles/components.css`; output dist, client, dan concept disinkronkan melalui build.

Pemeriksaan browser mencakup 28 kombinasi: empat durasi pada lebar aktual 1280, 1024, 961, 960, 768, 430, dan 360px. Pada desktop, tinggi kartu, nama layanan, area harga, serta tepi atas/bawah CTA sejajar. Pada mobile tinggi kartu mengikuti konten. Tidak ditemukan horizontal overflow atau clipping horizontal pada card/tombol. Harga dan parameter CTA tetap tercatat dalam `output/pricing-alignment/geometry-2026-10-22.json`. Build berhasil dan 16 regression checks terkait lolos. Review source independen tidak menemukan regresi markup atau selector; CSS generated identik dengan source. Screenshot tetap berupa potongan panel aplikasi dan bukan sign-off halaman penuh.
