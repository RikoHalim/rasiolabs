# Rasio Labs

Repository aplikasi Rasio Labs. Homepage, halaman detail layanan, template Padel, dan prototype alur pelanggan dapat dijalankan secara lokal. Import GitHub bukan deployment atau persetujuan transaksi produksi.

## Menjalankan secara lokal

Gunakan Node.js dan npm. Jalankan perintah dari folder repository; pada PowerShell gunakan `npm.cmd` bila `npm` dibatasi execution policy.

```powershell
npm.cmd ci
npm.cmd run build:homepage
npm.cmd run preview:homepage
```

Buka [http://127.0.0.1:4184/](http://127.0.0.1:4184/). Preview membaca `dist/index.html` dan hanya melayani file statis; endpoint API tidak menyediakan backend. Hentikan server dengan Ctrl+C. `RASIO_PREVIEW_PORT` dapat mengganti port.

Pemeriksaan yang tersedia:

```powershell
npm.cmd test
```

Sebagian test membaca output build. Jalankan build marketing setelah mengubah source homepage atau halaman layanan. Build aplikasi lengkap memperbarui template dan salinan client/server:

```powershell
npm.cmd run build
npm.cmd run dev
```

Wrangler memakai [wrangler.jsonc](wrangler.jsonc) dan alamat lokal `http://127.0.0.1:4173`. Alur yang memerlukan database lokal juga membutuhkan `npm.cmd run db:local` serta konfigurasi lokal yang sesuai. Simpan kredensial lokal di `.dev.vars`; file itu dan state `.wrangler/` diabaikan Git. Jangan menyalin kredensial dari instalasi lain.

## Source dan output

- [frontend/marketing](frontend/marketing) memiliki homepage dan tiga halaman layanan: `rasio-profile.html`, `rasio-store.html`, dan `rasio-custom.html`. [DESIGN.md](frontend/marketing/DESIGN.md) menjelaskan sistem visual.
- [frontend/selection.js](frontend/selection.js), script checkout, dan script preview mempertahankan pilihan layanan, template, serta durasi dalam URL.
- [templates/padel](templates/padel) memiliki source template aktif. [server/template-catalog.mjs](server/template-catalog.mjs) hanya mengaktifkan **Padel Club** untuk Profile. Store belum memiliki katalog yang valid; tombol “Lihat Template” dinonaktifkan dengan alasan yang terlihat.
- [server/policy-v4.mjs](server/policy-v4.mjs) memiliki harga, durasi, dan gate produksi. [BUSINESS_DECISIONS.md](BUSINESS_DECISIONS.md) memisahkan keputusan confirmed dari draft, pending, dan proposed. Tampilan prototype tidak mengaktifkan layanan, gateway, atau pembayaran produksi.
- `dist/` masih memuat input legacy yang diperlukan, termasuk `policy-flow.js`, `policy-v4.css`, halaman/script lama, dan `assets/`. Jangan menghapus atau mengabaikan seluruh folder tersebut. `dist/client`, `dist/server`, dan `dist/.openai` adalah salinan build yang diabaikan Git. [.openai/hosting.json](.openai/hosting.json) adalah metadata proyek/resource yang digunakan build.

## Output konsep opsional

Fresh clone menghasilkan output di `dist/` saja. Workspace lama tetap mendapat salinan konsep di `../UI Concepts/2026-10-14` jika folder induk `../UI Concepts` sudah ada. Build tidak membuat folder induk itu pada clone baru.

Untuk memilih lokasi salinan konsep secara eksplisit, isi `RASIO_CONCEPT_DIR` dengan path absolut atau path relatif terhadap repository sebelum build. Contoh PowerShell:

```powershell
$env:RASIO_CONCEPT_DIR = 'portable-smoke/concept'
npm.cmd run build:homepage
Remove-Item Env:RASIO_CONCEPT_DIR
```

Test homepage dan halaman layanan selalu memeriksa `dist`; salinan konsep ikut diperiksa jika output itu diaktifkan. Jalankan build dan test dengan konfigurasi path yang sama. Folder konsep menyimpan `index-v3.html`; preview utama `/` tetap memakai homepage canonical di `dist`.

## Perlindungan dokumen kebijakan

Full build menghasilkan halaman kebijakan tetapi mempertahankan `BUSINESS_DECISIONS.md` dan `docs/policy-v4/CHAPTER-85.md` yang sudah ada. Jika file belum ada, generator membuatnya. Ini menjaga catatan manual terbaru saat build biasa.

Regenerasi kedua dokumen yang sudah ada memerlukan flag eksplisit setelah perubahan manual direkonsiliasi dengan sumber generator:

```powershell
$env:RASIO_REGENERATE_POLICY_DOCS = '1'
node scripts/build-policy-v4.mjs
Remove-Item Env:RASIO_REGENERATE_POLICY_DOCS
```

Flag ini menimpa kedua dokumen dari sumber generator; flag tidak menyetujui kebijakan bisnis atau mengubah gate transaksi. Pekerjaan penuh WEB-02/03/05 tetap terbuka meski panel dan halaman detail telah dibuat.
