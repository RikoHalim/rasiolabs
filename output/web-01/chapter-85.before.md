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

