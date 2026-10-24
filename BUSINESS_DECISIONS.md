# Business decisions — Bab 85 v4

Source of truth: [Master v4](docs/policy-v4/RASIO_LABS_FASE_PEMATANGAN_CODEX_v4.md), [Bab 85 lengkap](docs/policy-v4/CHAPTER-85.md).

Bab 85 mengesampingkan aturan lama. Harga Store dan katalog Padel saja diperbarui melalui keputusan pemilik 19 Oktober 2026. Matriks harga eksplisit berada di server/policy-v4.mjs. Harga renewal lama tidak menjadi janji baru. Kontrak/pesanan historis tidak dimigrasi atau dihitung ulang.

| Keputusan | Status | Peninjau | Catatan |
|---|---|---|---|
| Harga Profile 1/12/24/48 bulan | CONFIRMED | Pemilik bisnis | Rp109.000 / Rp654.000 / Rp768.000 / Rp1.332.000 total. |
| Domain tahun pertama untuk 12/24/48; bukan 1 bulan | CONFIRMED | Pemilik bisnis | Kelayakan durasi dikonfirmasi; TLD dan plafon belum ditetapkan. |
| Revisi minor tanpa batas jumlah selama aktif | CONFIRMED | Pemilik bisnis | CMS hanya mengedit field yang didukung; tidak ada penghitung sisa revisi. |
| Tarif Store 1/12/24/48 bulan | CONFIRMED | Pemilik bisnis, 19 Oktober 2026 | Total Rp299.000 / Rp2.148.000 / Rp3.576.000 / Rp6.192.000; keputusan pembaruan harga final pemilik. |
| Scope standar Store | CONFIRMED_BUSINESS_PENDING_TECHNICAL | Pemilik bisnis, 20 Oktober 2026 + teknis | Produk tanpa batas jumlah, bantuan input 20 produk pertama, biaya transaksi dari RasioLabs 0%. Biaya gateway/pihak ketiga terpisah. Kesiapan implementasi perlu diverifikasi sebelum produksi. |
| Satu template aktif: Padel Club | CONFIRMED | Pemilik bisnis, 19 Oktober 2026 | Enam implementasi dihapus setelah backup; tiga screenshot hero dipertahankan sebagai aset marketing. |
| TLD, plafon subsidi, registrar, pajak, transfer masuk, domain khusus dan pembelian bulanan | PENDING | Bisnis + hukum | Harus diumumkan sebelum pembayaran. Domain premium/biaya tambahan perlu persetujuan. |
| Domain tahun kedua dan seterusnya dibayar pelanggan | DRAFT_POLICY_PENDING_LEGAL_REVIEW | Bisnis + hukum | Harga dan expiry domain terpisah dari kontrak website. |
| Registran pelanggan, transfer, dan domain sendiri | DRAFT_POLICY_PENDING_LEGAL_REVIEW | Bisnis + hukum | Benefit yang tidak dipakai tidak otomatis menjadi uang/kredit. Domain tidak ditahan untuk tagihan website. |
| Definisi minor/major, antrean dan penawaran custom | DRAFT_POLICY_PENDING_LEGAL_REVIEW | Bisnis + hukum | Tidak menjanjikan SLA atau penyelesaian 24/7. |
| Pembatalan, refund proporsional, biaya pihak ketiga dan pengaduan | DRAFT_POLICY_PENDING_LEGAL_REVIEW | Bisnis + hukum | Usulan 7 hari kalender sebelum setup individual/pengeluaran; formula dan waktu pemrosesan belum disetujui. |
| Renewal manual dengan persetujuan aktif dan harga penawaran | DRAFT_POLICY_PENDING_LEGAL_REVIEW | Bisnis + hukum | Tidak ada auto charge default. Tarif renewal lama bukan penawaran v4 final. |
| Pengingat H-30/14/7/1 dan kanal persetujuan | PROPOSED | Bisnis + operasional + hukum | Pengingat website dan domain harus terpisah. |
| Masa tenggang 14 hari dan prosedur suspensi | PROPOSED | Bisnis + operasional + hukum | Tidak menjalankan suspensi otomatis sebelum disahkan. |
| Lisensi template, aset pelanggan, karya khusus, output AI dan IP Custom | DRAFT_POLICY_PENDING_LEGAL_REVIEW | Bisnis + hukum | Lisensi template selama aktif; tidak mengalihkan source code. |
| Ekspor 30 hari; retensi pemulihan 60 hari; backup dan pengecualian | PROPOSED | Bisnis + hukum + penanggung jawab data | Titik awal periode dan jadwal penghapusan harus ditegaskan. Tidak ada penghapusan otomatis. |
| Identitas badan usaha, pajak, PSE/PMSE, PDP, kontrak registrar dan sengketa | PENDING_LEGAL_REVIEW | Penasihat hukum Indonesia | Termasuk legal basis, processor/data processing, lisensi pihak ketiga dan kontrak elektronik. |
| Gateway, persetujuan versi syarat, bukti pembayaran dan refund | PENDING | Bisnis + hukum + teknis | Belum ada persetujuan/konfigurasi produksi. |

## Production gate

Checkout baru, refund, recurring charges, transfer domain dan penghapusan data terkunci. Persetujuan bisnis tertulis, review hukum Indonesia, konfigurasi domain/gateway, consent versioning, otorisasi, audit log dan uji backend wajib selesai sebelum gate dapat diubah. Angka 7/14/30/60 hari dan reminder H-30/14/7/1 adalah usulan, bukan SLA/kewajiban hukum final.

## Bukti persetujuan

Belum ada persetujuan bisnis atau opini hukum untuk kebijakan yang berstatus draf. Identitas reviewer, tanggal, versi dokumen, keputusan, dan bukti harus direkam saat review benar-benar dilakukan. Jangan isi otomatis.

## Revisi homepage Sprint 1 — 16 Oktober 2026

- AI Chatbot termasuk dalam Rasio Profile, Store, dan Custom: keputusan pemilik pada revisi Sprint 1. Implementasi AI, sumber pengetahuan bisnis, batas pemakaian, privasi, dan kesiapan operasional tetap harus diverifikasi sebelum peluncuran. Tidak ada add-on berbayar yang ditambahkan.
- Homepage dan ringkasan kebijakan memakai bahasa pelanggan, bukan label review internal. Ketentuan lengkap tersedia sebelum persetujuan pesanan. Label status pemesanan di marketing dihapus sesuai instruksi pemilik; production gate tetap terkunci. Penyederhanaan copy bukan persetujuan kontraktual atas kebijakan yang masih pending.
- Perpanjangan domain dibayar pelanggan, lisensi template selama layanan aktif, dan hak atas aset ditampilkan mengikuti arahan copy pemilik. Status review hukum, prosedur transfer, biaya domain/TLD, refund, renewal, grace period, dan retensi pada tabel di atas tidak berubah.
- Harga Store resmi diperbarui 19 Oktober 2026; bantuan 20 produk awal dan produk tanpa batas jumlah termasuk cakupan standar. Tidak ada diskon renewal, batas numerik revisi minor, SLA, jadwal refund, atau masa retensi baru. Semua pembayaran produksi tetap terkunci.
- Materi lengkap Bab 85 dan register ini menyimpan rincian usulan yang tidak dijadikan janji pemasaran, termasuk 7/14/30/60 hari dan pengingat H-30/14/7/1.

## Evaluasi informasi penawaran — 23 Oktober 2026

Rujukan: [Rasio Labs — Evaluasi Website dan Prioritas](<../docs/Rasio Labs - Evaluasi Website dan Prioritas.md>). Evaluasi ini membahas kejelasan keputusan pengunjung dan logika penawaran dibandingkan referensi kompetitor. Ini bukan penetapan kebijakan baru berdasarkan klaim kompetitor.

Evaluasi dan verifikasi sumber dilakukan pada 22 Oktober 2026; pencatatan ini diperbarui pada 23 Oktober 2026. Topik di bawah terutama menindaklanjuti **WEB-02** (pemilihan layanan), **WEB-03** (cakupan), dan **WEB-04** (harga, siklus langganan, dan dasar badge) pada dokumen evaluasi.

Permintaan pemilik pada 23 Oktober 2026 mengizinkan pembaruan dokumentasi. Permintaan tersebut tidak mengizinkan perubahan UI, copy website aktif, kode, harga, kontrak, atau production gate. Semua pilihan substantif baru di bawah berstatus **PROPOSED**, menunggu keputusan pemilik; keputusan yang menyangkut kebijakan tetap mengikuti status review pada register utama.

Konteks dari pemilik: Rasio Labs belum memiliki pelanggan berbayar. Karena itu, belum ada data pembelian untuk membuktikan paket yang paling populer. Pemilik masih memprioritaskan penyelesaian website sebelum mencari klien.

| Topik keputusan | Status | Peninjau | Usulan dan batas yang perlu diputuskan |
|---|---|---|---|
| Batas pemilihan Profile, Store, dan Custom | PROPOSED | Pemilik bisnis | Rumuskan panduan berdasarkan tujuan: profil atau katalog informasi dengan jalur kontak WhatsApp/formulir; transaksi melalui keranjang dan checkout; atau alur kerja serta integrasi khusus. Putuskan kapan katalog + WhatsApp masih masuk Profile dan kapan memerlukan Store atau Custom. Ini tidak menambahkan katalog produk atau checkout sebagai fitur Profile yang sudah disetujui. |
| Kustomisasi awal dan hak edit CMS | PROPOSED | Pemilik bisnis + teknis | Rinci penyesuaian awal yang termasuk dan field yang benar-benar dapat diedit pelanggan. Pisahkan teks, foto, logo, warna, struktur halaman, layout, fitur, dan integrasi sesuai kemampuan serta cakupan yang disetujui. CMS tetap hanya mengedit field yang didukung; evaluasi ini tidak memperluas akses edit atau janji kustomisasi. |
| Penjelasan renewal, expiry, dan ekspor data | PROPOSED | Pemilik bisnis + operasional + hukum | Susun informasi terpisah untuk masa aktif website, domain tahun berikutnya, penawaran renewal, dan pilihan saat tidak melanjutkan. Tentukan apa yang dapat diekspor, format, titik awal periode, dan ketentuan akses sebelum menjadi janji pelanggan. Harga renewal, masa tenggang, retensi, dan mekanisme pembatalan tetap mengikuti status draf/usulan yang sudah tercatat; tidak ada tanggal atau durasi baru yang disahkan. |
| Upgrade layanan dan pergantian template | PROPOSED | Pemilik bisnis + teknis | Putuskan alur permintaan Profile ke Store atau Custom, kebutuhan pembangunan ulang, biaya/penawaran, serta perlakuan terhadap domain, konten, dan sisa masa aktif. Tentukan juga cakupan pergantian template sebelum menjanjikan gratis atau tanpa kehilangan data. Saat ini hanya Padel Club yang aktif; topik ini tidak mengaktifkan template lain atau menjamin perpindahan otomatis. |
| Dasar harga coret dan perbandingan penghematan | PROPOSED | Pemilik bisnis | Dokumentasikan pembanding untuk setiap angka coret dan klaim hemat. Jika pembanding berasal dari tarif paket 1 bulan dikalikan durasi, jelaskan sebagai perbandingan terhadap tarif bulanan, bukan harga historis paket panjang. Pemilik perlu memutuskan label dan basis perbandingan yang ditampilkan. Harga total dan ekuivalen 1/12/24/48 bulan yang sudah CONFIRMED tidak berubah. |
| Bukti badge “Paling Populer” dan alternatif rekomendasi | PROPOSED | Pemilik bisnis | Jangan memperlakukan badge yang ada sebagai bukti perilaku pembeli saat belum ada pelanggan berbayar. Usulan: ganti klaim popularitas dengan “Direkomendasikan” hanya jika pemilik menetapkan alasan rekomendasi yang jelas, atau gunakan label durasi/manfaat yang faktual. Pilihan kata, paket yang direkomendasikan, dan alasannya belum disetujui; belum ada perubahan badge pada UI atau kode. |
| Kejelasan cakupan revisi dan biaya penyedia lain | PROPOSED | Pemilik bisnis + operasional + hukum + teknis | Perjelas contoh minor/major, antrean, kebutuhan materi, dan perubahan yang perlu penawaran terpisah tanpa mencabut revisi minor tanpa batas jumlah. Pisahkan biaya transaksi Rasio Labs 0% dari biaya gateway dan pihak ketiga. Tentukan cara menjelaskan metode pembayaran yang bergantung pada penyedia serta aktivasi merchant; logo atau contoh metode tidak berarti seluruhnya sudah didukung aktif. |

### Keputusan terdahulu yang tetap berlaku

- Revisi minor tanpa batas jumlah selama langganan aktif tetap **CONFIRMED**. Tidak ada kuota revisi, penghitung sisa revisi, atau SLA baru. Definisi rinci minor/major dan mekanisme antrean tetap berstatus draf sebagaimana register utama.
- Scope Store yang telah disetujui tetap mencakup produk tanpa batas jumlah, bantuan input 20 produk pertama, dan biaya transaksi Rasio Labs 0%. Biaya gateway/pihak ketiga tetap terpisah; kesiapan implementasi Store dan pembayaran tidak disahkan oleh pembaruan dokumen ini.
- Harga Profile dan Store, empat durasi paket, kelayakan domain tahun pertama, serta penyertaan AI Chatbot tidak berubah. Batas penggunaan, privasi, dan kesiapan fitur AI tetap perlu ditentukan atau diverifikasi sesuai catatan yang sudah ada.
- Status kebijakan domain, renewal, refund, kepemilikan, ekspor, retensi, dan identitas badan usaha tidak naik menjadi disetujui. Seluruh production gate tetap terkunci.
- Usulan di atas dapat dijelaskan melalui struktur homepage, FAQ, atau alur yang kelak disetujui. Pencatatan topik tidak mengizinkan pembuatan ulang halaman layanan khusus yang sudah dihapus, penambahan katalog, atau implementasi fitur baru.
