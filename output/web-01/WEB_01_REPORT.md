# WEB-01 — kontinuitas pilihan pelanggan

23 Oktober 2026 · selesai di prototype lokal, siap ditinjau pemilik.

## Hasil

Kedua jalur memakai ringkasan `checkout-v4.html` yang sudah ada:

- Homepage → Pilih Template → ringkasan pesanan.
- Homepage → Lihat Template → preview Padel → Gunakan template → ringkasan pesanan.

Layanan, ID `Padel`, durasi, total paket di muka, dan manfaat domain tetap sesuai konfigurasi resmi. Tidak ada checkout baru, perubahan harga, backend, autentikasi, database, pembayaran, atau deployment.

| Durasi Profile | Ekuivalen per bulan | Total paket | Domain tahun pertama |
|---|---:|---:|---|
| 1 bulan | Rp109.000 | Rp109.000 | Tidak termasuk |
| 12 bulan | Rp54.500 | Rp654.000 | Termasuk |
| 24 bulan | Rp32.000 | Rp768.000 | Termasuk |
| 48 bulan | Rp27.750 | Rp1.332.000 | Termasuk |

## Akar masalah

Tautan thumbnail dan “Lihat Template” tidak membawa durasi. Kesepuluh halaman Padel mengarahkan “Gunakan template” ke order legacy tanpa durasi; markup order memilih 24 bulan. Jalur langsung memakai ringkasan v4 yang berbeda dan juga menormalisasi query invalid secara diam-diam. Selain itu, “Ganti layanan” legacy masih menunjuk `#solusi`.

## Perubahan

- `frontend/selection.js`: satu kontrak URL `type`, `template`, `duration`, tervalidasi terhadap katalog dan policy existing. Tidak memakai localStorage/sessionStorage untuk pilihan. Nilai invalid, duplikat, template tidak tersedia, atau template yang tidak sesuai layanan tidak menghasilkan kutipan paket pengganti.
- `frontend/marketing/components.mjs`, `pricing.js`, `interactions.js`: kedua tombol dan thumbnail membawa pilihan melalui native href; durasi/service tersimpan di URL. Kontrol dipulihkan saat history, refresh dan pageshow. Pilihan layanan yang disengaja mempertahankan durasi dan hanya melepas template yang tidak relevan. Font, token, warna, spacing dan CSS tidak didesain ulang.
- `frontend/template-selection.js`: bar pemilihan dan semua tautan internal pada sepuluh halaman Padel membawa query, termasuk fragment lokasi/founders. Preview tanpa durasi menampilkan “Pilih paket”. Script tidak berjalan pada website klien tanpa `.template-access`.
- `frontend/checkout-selection.js`: memisahkan handler ringkasan dari script lifecycle existing. Ringkasan mencantumkan layanan, template, durasi dan total resmi. Durasi yang belum dipilih tetap kosong. Perubahan durasi/template membuat history entry dan memulihkan pilihan saat back/forward. Data domain yang sedang diketik tidak hilang saat durasi berubah. Consent tetap di-reset ketika quote berubah.
- `dist/policy-flow.js`: memanggil handler ringkasan tersebut; lifecycle akun existing dipertahankan. `dist/order.js`: entry Profile/Store legacy diteruskan ke ringkasan yang sama dengan query asli, termasuk query invalid agar bisa dipulihkan. Konsultasi Custom legacy valid tidak diganti. `dist/order.html`: anchor lama diperbaiki ke `#layanan`.
- `templates/padel/pages/*.html` (10 halaman): hanya CTA/bar preview dan module kontinuitas; desain/konten bisnis template tetap.
- `scripts/build-selection.mjs`, `build-homepage.mjs`, `build-active-templates.mjs`: menyalin modul dan konfigurasi resmi ke output yang diperlukan. Salinan concept dan 21 output dist/client disinkronkan; daftar ada di [manifest](synchronized-output.json).
- Tes: `tests/selection.test.mjs` (15 regresi WEB-01); ekspektasi pemilik source disesuaikan pada `tests/marketing.test.mjs` dan `tests/policy-v4.test.mjs`.
- Dokumentasi: root `README.md`, `FUTURE_BACKLOG.md`, `rasio-web/UX-CONTRACT.md`, `frontend/marketing/DESIGN.md`. Hanya WEB-01 ditutup pada prototype lokal; WEB-02–WEB-07 tetap terbuka.

## Verifikasi yang dijalankan

| Pemeriksaan | Hasil |
|---|---|
| Kedua jalur × 1/12/24/48 bulan di browser | Lolos, layanan/ID/durasi/total cocok |
| Harga dan domain dibanding `server/policy-v4.mjs` | Lolos; Profile dan Store tetap memakai angka resmi |
| Sepuluh halaman Padel × empat durasi | Lolos tes handler aktual/native href |
| Ganti durasi di homepage dan ringkasan | Lolos; harga, query dan tautan ikut berubah |
| Refresh dan back/forward | Lolos; kontrol dipulihkan dari URL |
| Tab baru melalui Control+Enter pada tautan website | Lolos; lanjut ke halaman Club, refresh, lalu ringkasan tetap 1 bulan/Rp109.000 |
| Preview langsung tanpa pilihan sebelumnya | Lolos; durasi kosong, tidak memberi default 24/48; memilih 12 bulan menghasilkan Rp654.000 |
| Query invalid (durasi, layanan, template, duplikat, ketidakcocokan layanan/template) | Lolos; tidak ada quote pengganti dan tersedia pemulihan |
| Ganti layanan | Lolos; menuju `#layanan`; Profile dan Store memulihkan pilihan relevan |
| Legacy `/order?...duration=1` | Lolos; diteruskan ke ringkasan 1 bulan, bukan default 24 |
| Keyboard dan validasi inline | Lolos; pesan domain invalid hilang saat diperbaiki; tanpa transaksi |
| Desktop 1280×900 dan mobile 390×840 CSS px | Ditinjau melalui screenshot; tidak ada horizontal overflow pada ringkasan |
| Console warning/error pada alur yang diuji | Tidak ditemukan |
| Production gate | Seluruhnya tetap tertutup; tes server menolak checkout sebelum write |

Perintah yang dijalankan:

```text
node scripts/build-active-templates.mjs
node scripts/build-homepage.mjs
node scripts/build-selection.mjs
node --check frontend/selection.js
node --check frontend/checkout-selection.js
node --check frontend/template-selection.js
node --check frontend/marketing/pricing.js
node --check frontend/marketing/interactions.js
node --test tests/selection.test.mjs tests/marketing.test.mjs tests/policy-v4.test.mjs
node --test tests/*.test.mjs
```

Tes terarah: **31/31 lolos**. Tes lengkap terakhir: **101/101 lolos**. Percobaan tes lengkap pertama dalam sandbox gagal pada koneksi runtime Miniflare; pengulangan dengan akses loopback lokal berhasil. Ini bukan deployment. Lihat [log terarah](tests-focused.log), [log lengkap terakhir](tests-final.log), dan [hasil browser aktual](browser-verification.json).

## Bukti visual

- [Ringkasan desktop](order-desktop.png)
- [Ringkasan mobile](order-mobile.png)
- [Cuplikan kontrol dan total 1 bulan](selection-proof-desktop.png)

Keduanya benar-benar diambil dari browser dan ditinjau. Capture native memiliki ruang canvas tambahan; dimensi CSS dan overflow diperiksa terpisah melalui DOM. Pengujian navigasi menggunakan aktivasi keyboard dan native select; klik koordinat bukan bukti kelulusan karena pemetaan zoom tool tidak akurat. Native new-tab benar-benar dibuka dari tautan website, bukan hanya menyalin URL ke tab buatan.

## Keamanan build dan batas pekerjaan

Build terarah dipakai, tanpa membersihkan dist dan tanpa menjalankan full `npm run build`. Full builder existing masih meregenerasi register keputusan dan Bab 85; tidak dijalankan untuk pekerjaan ini. `BUSINESS_DECISIONS.md`, termasuk catatan manual 23 Oktober, dan `CHAPTER-85.md` diverifikasi tidak berubah byte-for-byte. Hash dan sinkronisasi ada di [bukti integritas output](output-integrity.json).

Katalog tetap Padel saja; tiga visual hero dipertahankan. Tidak ada halaman layanan yang dikembalikan atau template baru. Visual picker, pembenahan presentasi checkout yang terpisah, kesiapan Store/AI, serta persetujuan domain/pajak/renewal/kebijakan tetap pekerjaan berikutnya sesuai backlog dan keputusan pemilik. Ringkasan masih prototype; total paket terpisah dari total checkout final yang belum dapat ditetapkan. Tidak ada claim pembayaran produksi aktif. Verifikasi lintas browser/perangkat fisik belum dilakukan; QA browser memakai in-app Chromium lokal.

Tidak ada masalah kontinuitas WEB-01 yang tersisa pada cakupan yang diuji. Hasil menunggu review pemilik; Sprint 2 belum dimulai.
