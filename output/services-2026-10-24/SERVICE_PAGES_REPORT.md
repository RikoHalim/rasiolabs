# Revisi panel layanan dan halaman detail Rasio Labs

Tanggal: 24 Oktober 2026. Status: implementasi lokal siap ditinjau pemilik.

## Hasil

- Tab Company profile, Online store, dan Custom tetap dipertahankan. Setiap panel menjelaskan hasil layanan, tiga manfaat, dan langkah berikutnya.
- Profile memakai screenshot Padel yang sudah tersedia. Tiga badge Hosting & SSL, CMS, dan Revisi minor berada di bawah screenshot, bukan menutupi kontennya.
- Profile dan Store memiliki Lihat Template dan Lihat Detail Layanan. Tombol template Store dinonaktifkan dengan alasan yang jelas karena katalog Store belum tersedia. Tidak ada tautan Store menuju Padel atau katalog buatan.
- Custom tetap memakai konsultasi WhatsApp dan memiliki tautan detail.
- Halaman detail baru: `rasio-profile.html`, `rasio-store.html`, dan `rasio-custom.html`. Halaman memakai DM Sans, heading 550, body 400, komponen tombol, warna, radius, dan focus state homepage. Halaman lama `layanan-*.html` tidak dipulihkan.
- Store dan Custom mencakup sepuluh section: hero, alasan penggunaan, fitur, contoh sektor, contoh hasil/alur, batas cakupan, cara memesan, biaya, FAQ, dan CTA penutup. Profile memiliki sembilan section mengikuti instruksi lanjutan pemilik: section “Penyesuaian dan batas layanan” dihapus khusus dari halaman Profile. Penjelasan CMS dan batas revisi minor tetap tersedia dalam fitur serta FAQ. Sektor penggunaan dibedakan dari katalog template aktif.
- Harga dibaca langsung dari `server/policy-v4.mjs`. Paket tetap 1/12/24/48 bulan; domain gratis hanya tahun pertama untuk paket minimal 12 bulan. Store tetap unlimited produk, bantuan input 20 produk pertama, dan 0% pungutan transaksi Rasio dengan biaya pihak ketiga terpisah.

## Integrasi pilihan pelanggan

`service-links.js` menggunakan kontrak pilihan WEB-01 yang sudah ada. Tautan membawa layanan, template yang relevan, dan durasi melalui URL; pilihan paket yang sengaja diklik menggantikan durasi sebelumnya. Tautan hash tetap native, konsultasi eksternal serta halaman kebijakan/login tidak diberi query pesanan. Perubahan durasi homepage memberi notifikasi kepada tautan detail tanpa menambah penyimpanan atau backend.

Delapan alur Profile diuji pada browser: homepage → detail → katalog → Pilih Template, serta homepage → detail → katalog → Lihat Template → Gunakan template; masing-masing untuk 1/12/24/48 bulan. Ringkasan menunjukkan Padel dan total Rp109.000/Rp654.000/Rp768.000/Rp1.332.000 sesuai durasi. Empat tautan paket Store mencapai ringkasan dengan total Rp299.000/Rp2.148.000/Rp3.576.000/Rp6.192.000. Ini verifikasi ringkasan yang sudah ada, bukan pengaktifan checkout produksi.

Perubahan durasi, refresh, back/forward, serta membuka preview melalui Ctrl+klik pada tautan website ke tab baru juga diverifikasi. Pemulihan query tidak valid dan template yang tidak sesuai diuji melalui tes regresi.

## File source yang berubah

| File | Perubahan |
| --- | --- |
| `frontend/marketing/sections.mjs` | Isi dan CTA panel layanan saja |
| `frontend/marketing/styles/products.css` | Komposisi screenshot/badge serta reflow panel |
| `frontend/marketing/service-content.mjs` | Konten layanan terstruktur |
| `frontend/marketing/service-pages.mjs` | Renderer tiga halaman detail |
| `frontend/marketing/styles/services.css` | Layout halaman detail dan breakpoint |
| `frontend/marketing/service-links.js` | Kontinuitas URL pada tautan layanan |
| `frontend/marketing/service-page.js` | Inisialisasi navigasi, tautan, dan motion halaman detail |
| `frontend/marketing/homepage.js` | Memasang inisialisasi tautan layanan |
| `frontend/marketing/pricing.js` | Mengirim event setelah durasi berubah |
| `scripts/build-homepage.mjs` | Menghasilkan dan menyalin halaman/modul layanan |
| `tests/service-pages.test.mjs` | 11 tes regresi halaman dan integrasi |
| `tests/marketing.test.mjs` | Ekstraksi panel mengakomodasi daftar badge |

Dokumentasi: README workspace, FUTURE_BACKLOG, DESIGN marketing, dan brief panel layanan. Output disinkronkan ke `dist`, concept preview yang sudah ada, serta 23 file client yang diperlukan. Manifest salinan tersedia dalam `integrity-after.json`.

## Build dan pengujian

- Focused build `node scripts/build-homepage.mjs`: berhasil. Script build penuh dibaca tetapi tidak dijalankan karena meregenerasi dokumen kebijakan. Dist tidak dibersihkan.
- Full Node suite: **112 lulus, 0 gagal, 0 skipped**. Miniflare memerlukan akses loopback lokal; log percobaan sandbox dan hasil akhirnya disimpan terpisah.
- Setelah penyempurnaan CSS terakhir: **35 tes terarah lulus**, mencakup marketing, selection, dan service pages.
- Setelah penghapusan section batas layanan Profile sesuai instruksi lanjutan pemilik: focused build berhasil dan **35 tes terarah lulus**. Tes memeriksa Profile sembilan section tanpa `service-scope`, Store/Custom tetap sepuluh, serta penjelasan CMS dan revisi minor Profile tetap tersedia.
- Integritas SHA-256: konfigurasi harga/katalog, checkout HTML/runtime, BUSINESS_DECISIONS, CHAPTER-85, tokens dan komponen dasar tidak berubah. Markup hero, Rasio AI, dan pricing homepage juga tidak berubah.
- Tiga halaman detail diperiksa pada lebar CSS 1440, 1280, 1024, 768, 430, 390, dan 360 px: tidak ditemukan overflow horizontal, heading/tombol terpotong, atau gambar gagal dimuat. Tombol konten berukuran minimal 48 px.
- Ketiga tab homepage diperiksa pada 1280/768/390/360 px. Tinggi panel dan posisi dokumen section berikutnya sama antar-tab; badge tidak menimpa screenshot.
- Arrow-key tab, Enter/Escape menu mobile, FAQ dengan keyboard, focus outline, dan target menu 46 px diperiksa langsung. Dukungan reduced motion diperiksa pada source CSS; preferensi OS tidak diubah.
- Console halaman layanan dan homepage yang diperiksa tidak menampilkan error/warning.

## Penyempurnaan dari pemeriksaan

- Instruksi lanjutan pemilik, 24 Oktober 2026: menghapus seluruh section “Penyesuaian dan batas layanan” hanya dari detail Rasio Profile. Ini pengecualian eksplisit terhadap brief awal sepuluh section; Store dan Custom tetap memiliki section tersebut. Konten produk, harga, serta kebijakan tidak diubah.
- Menyesuaikan selector dan markup stylesheet: ukuran harga hero, pembungkus ikon/badge, penomoran langkah, panel biaya transaksi, metode pembayaran, dan konektor alur.
- Menjaga badge mobile dalam aliran layout agar tidak menutupi screenshot.
- Menjaga tinggi panel antar-tab agar section selanjutnya tidak meloncat.
- Tombol konsultasi navbar Custom dibuat satu baris. Tingginya kembali 44 px; tidak bertabrakan dengan tautan navbar pada ukuran sekitar breakpoint desktop, 1024, 1280, dan 1440 px.

## Bukti

Screenshot browser asli berupa capture viewport/section, bukan mockup atau screenshot seluruh halaman:

- [Panel homepage desktop](homepage-services-desktop.jpg)
- [Profile desktop](profile-desktop.jpg) · [Profile mobile](profile-mobile.jpg)
- [Store desktop](store-desktop.jpg) · [Store mobile](store-mobile.jpg)
- [Custom desktop](custom-desktop.jpg) · [Custom mobile](custom-mobile.jpg)

Capture mobile berukuran layout 390 px; sebagian capture menampilkan fase entrance animation. Screenshot homepage mobile/pricing yang tidak tepat posisi tidak digunakan sebagai bukti.

Log dan data pemeriksaan:

- [Full suite](tests-final.log), [tes setelah refinement](tests-after-refinement.log)
- [Responsive](responsive-checks.json), [panel homepage](homepage-panel-checks.json), [navbar](navbar-browser-checks.json)
- [Alur Profile](selection-browser-checks.json), [alur Store](store-browser-checks.json), [history](history-browser-checks.json), [tab baru](new-tab-browser-check.json), [keyboard](keyboard-browser-checks.json)
- [Baseline integritas](integrity-before.json), [integritas akhir dan client manifest](integrity-after.json)

## Batas dan pekerjaan terbuka

1. Store belum memiliki katalog template yang valid. Diperlukan keputusan/otorisasi terpisah untuk menyediakannya; template baru tidak dibuat dalam tugas ini.
2. Checkout lama beserta catatan/status internalnya tidak didesain ulang dalam tugas ini. Gate produksi, autentikasi, database, pembayaran, dan kebijakan yang belum diputuskan tetap seperti sebelumnya.
3. Verifikasi browser dilakukan di browser dalam aplikasi, bukan matriks lintas-browser/perangkat fisik atau audit screen reader penuh.
4. WEB-02, WEB-03, dan WEB-05 tetap parsial; WEB-04/06/07 tidak ditutup. Tidak ada deployment atau Sprint 2.
