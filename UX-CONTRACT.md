# Kebijakan dan alur pelanggan v4

Bab 85 dalam `docs/policy-v4/CHAPTER-85.md` mengesampingkan keputusan terdahulu. `BUSINESS_DECISIONS.md` memisahkan confirmed, draft, pending dan proposed. Register tidak memberikan approval otomatis.

Catatan 23 Oktober 2026: [Evaluasi Website dan Prioritas](<../docs/Rasio Labs - Evaluasi Website dan Prioritas.md>) dan [backlog](../FUTURE_BACKLOG.md) tetap mencatat usulan tanpa approval produksi. Pemilik kemudian memberi izin implementasi terbatas untuk WEB-01. Kedua jalur Padel kini memakai ringkasan `checkout-v4.html` yang sudah ada dengan kontrak URL `type`, `template`, dan `duration`; harga dibaca dari konfigurasi resmi. Riwayat, refresh, tab baru, dan sepuluh halaman preview membawa pilihan yang sama. Preview langsung tanpa durasi meminta pilihan paket; query tidak valid menampilkan pemulihan tanpa harga pengganti. “Ganti layanan” menuju `#layanan` dengan pilihan yang masih relevan. Bukti ada di [laporan WEB-01](output/web-01/WEB_01_REPORT.md). WEB-02–WEB-07 dan seluruh gate produksi tidak berubah.

## Arahan presentasi checkout — 23 Oktober 2026

Pemilik meninjau checkout secara pribadi dan meminta tampilan seperti versi akhir untuk pelanggan. Brief checkout tidak memakai label status pengembangan seperti “demo”, “belum aktif”, “coming soon”, atau banner “Pratinjau checkout · pembayaran belum aktif”. Status pengembangan, penjelasan simulasi, versi internal, dan catatan review tetap dicatat dalam dokumentasi. Arahan ini menggantikan saran banner pratinjau pada pembahasan checkout sebelumnya; belum diterapkan pada kode melalui pembaruan dokumen ini.

Pilihan template menggunakan kartu dengan screenshot website yang benar-benar tersedia, penanda terpilih, dan akses ke preview; dropdown nama template bukan kontrol utama. Alur serta ringkasan mengacu pada kejelasan WebEkspor/Hostinger, dengan identitas dan tipografi homepage Rasio. Katalog aktif tetap mengikuti template-catalog; referensi visual tidak menambah template.

Informasi material tetap jelas: layanan, template, durasi, total paket di muka, biaya domain atau biaya lain yang relevan, ketentuan yang terkait keputusan pelanggan, serta pesan validasi. Penyederhanaan presentasi tidak mengubah harga, status kebijakan, atau izin transaksi produksi.

Arahan tambahan pemilik: semua tautan kebijakan checkout, termasuk syarat dan ketentuan, pembatalan/refund, serta revisi, ditempatkan di footer saja. Daftar tautan tidak diulang dalam card ringkasan, panel pemilihan, atau disclosure di dalam card. Ringkasan berfokus pada layanan, thumbnail/nama template, durasi, domain, rincian biaya, dan CTA. Kontrol persetujuan, jika digunakan, tetap singkat; navigasi kebijakan berada di footer. Informasi biaya dan periode yang diperlukan untuk memahami pesanan tetap terlihat pada keputusan yang relevan.

## Acuan implementasi yang sudah tercatat

| Capability | Owner | Contract / verification |
|---|---|---|
| Harga dan kelayakan domain | `server/policy-v4.mjs`, disalin build ke browser | Empat durasi; angka eksplisit; unit tests |
| Kebijakan customer-facing | `scripts/build-policy-v4.mjs` + Bab 85 | Lima halaman draf; link pada seluruh permukaan terkait |
| Kontinuitas pilihan | `frontend/selection.js`, `frontend/marketing/pricing.js`, `frontend/template-selection.js` | URL sebagai sumber pilihan; validasi katalog/durasi; native href membawa pilihan ke tab baru; popstate/pageshow memulihkan kontrol |
| Select/Listbox | Native select pada `frontend/checkout-selection.js`; lifecycle lama tetap `dist/policy-flow.js` | Popup OS diterima; label dan keyboard native; durasi yang belum dipilih tetap kosong |
| Forms | `checkout-selection.js` untuk ringkasan; `policy-flow.js` untuk lifecycle | novalidate, inline error, fokus field, consent awal kosong/reset saat quote berubah |
| Scrollbar | `dist/policy-v4.css` | Standar thumb/track; tidak disembunyikan |
| Feedback | Inline role status/alert | Tidak memakai native dialog atau toast saja untuk info penting |
| Lifecycle mock | sessionStorage, key `rasio-policy-v4-demo` | Data contoh terpisah dari order/login; reset eksplisit; tidak ada network write |
| Pembayaran/refund/transfer/delete | `requireProductionApproval` | Locked; operasi tidak dijalankan, API order baru gagal sebelum write |
| CMS lama | `dist/portal.js` | Konten/auth tetap; link simulasi diberi nama jelas, tidak memindahkan data/order nyata |

Halaman baru menggunakan bahasa Indonesia dan token DM Sans / biru Rasio / navy dari konsep v3. Form dan policy reading memakai motion 1, border untuk grouping dan amber hanya untuk status draf. WEB-01 hanya mengubah tautan/bar pemilihan pada preview Padel, tanpa mengubah desain atau konten bisnis internalnya. Script kontinuitas tidak berjalan pada website klien yang tidak memiliki bar preview.

Harga renewal belum berupa penawaran sah. Tampilkan kosong/menunggu penawaran, jangan mengubah null menjadi nol atau menyalin harga akuisisi sebagai renewal. Checkout final tetap belum tersedia saat TLD, cap, pajak, atau biaya belum final. Syarat yang belum disetujui tidak dianggap disahkan oleh checkbox prototipe.

Versi kontrak/order historis tidak dihitung ulang. Tidak memperpanjang berbeda dari pengakhiran dini dan refund. Domain dan kontrak punya tanggal berakhir berbeda. Ekspor contoh hanya JSON bisnis, tidak berisi software, secret atau data nyata. Tidak ada SLA atau reminder/email aktif di prototipe.

Per 16 Oktober 2026, akses kebijakan pada halaman pemasaran berada di satu baris navigasi footer bersama Layanan, Template, Rasio AI dan Login Klien. `policies.html` menjadi indeks; tidak ada blok panjang kebijakan pada main. Arahan checkout terbaru, 23 Oktober: tautan kebijakan juga berada di footer checkout, sementara kontrol persetujuan mengikuti alur pesanan tanpa mengulang daftar tautan dalam card. Bukti dan batas pemeriksaan terdahulu tercatat di `docs/policy-v4/IMPLEMENTATION.md`; arahan presentasi baru belum diterapkan melalui pembaruan dokumen ini.
