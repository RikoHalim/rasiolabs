# GitHub import — Rasio Labs

24 Oktober 2026.

Tujuan: [RikoHalim/rasiolabs](https://github.com/RikoHalim/rasiolabs), repository **private**. Source aplikasi berada pada root repo; folder kerja historis di komputer tetap bernama `rasio-web` dalam workspace Rasio Agency. Impor ini tidak menjalankan deployment atau mengubah gate produksi.

## Persiapan source

- Source frontend, backend prototype, template Padel, konfigurasi harga, dokumen kebijakan, aset, dan input legacy dist dipertahankan. Enam template yang telah dihapus tidak diaktifkan kembali.
- `.dev.vars`, varian lokalnya, `.env*`, database/state Wrangler, dependencies, dan folder pemeriksaan sementara tidak diunggah. Audit source dan riwayat tidak menemukan pola token/private key berkeyakinan tinggi. Tidak ada blob melebihi 50 MB.
- README repository menjelaskan instalasi, build, preview, test, input dist yang harus dipertahankan, output konsep opsional, dan perlindungan dokumen kebijakan.
- `scripts/build-paths.mjs` memusatkan lokasi output. Clone baru tidak membuat folder `UI Concepts` di luar repo. Workspace lama tetap dapat menghasilkan output konsep yang sudah ada; `RASIO_CONCEPT_DIR` mengatur lokasi eksplisit.
- Preview `/` membaca `dist/index.html`. Link konsep dan aset memakai path relatif yang dihitung dari lokasi output.
- Build penuh mempertahankan BUSINESS_DECISIONS.md dan CHAPTER-85.md yang sudah ada. Regenerasi disengaja memerlukan `RASIO_REGENERATE_POLICY_DOCS=1`; flag ini tidak menyetujui kebijakan atau mengaktifkan transaksi.
- Fixture tes selalu memeriksa dist dan ikut memeriksa konsep jika lokasi itu diaktifkan.

## Verifikasi

- Repository dibuat dan label Private diperiksa melalui GitHub UI. Akses remote kosong berhasil memakai akun GitHub yang sudah tersimpan.
- Salinan disposable dengan nama folder berbeda: full build berhasil, tidak membuat sibling konsep, dan **112/112 tes lulus** dengan izin loopback lokal untuk runtime Miniflare.
- Focused suite workspace dan salinan disposable: **35/35 lulus**. Build dengan output konsep eksplisit dan focused suite-nya juga lulus.
- Hash BUSINESS_DECISIONS.md dan CHAPTER-85.md sama sebelum dan sesudah full build. Guard dokumen serta regenerasi eksplisit diuji hanya pada salinan disposable.
- Dependensi test memakai instalasi lokal yang tersedia; unduhan bersih `npm ci` dari jaringan belum dijalankan sebagai bagian smoke test.
- Section “Penyesuaian dan batas layanan” sudah dihapus khusus dari Profile, kemudian diperiksa lewat browser dan tes regresi.

[Hasil smoke test](portable-smoke-results.json) · [Full test log pada salinan disposable](portable-full-tests.log) · [Laporan layanan](SERVICE_PAGES_REPORT.md)

Verifikasi push dilakukan dengan mencocokkan HEAD lokal dan `refs/heads/main` pada remote; hash commit akhir dicantumkan pada respons pengiriman.
