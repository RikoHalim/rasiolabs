# Bab 85 v4: implementasi dan verifikasi

Diperbarui 16 Oktober 2026. Sumber: dokumen v4 pemilik bisnis, Bab 85 lengkap. Ini implementasi lokal untuk review; belum dipublikasikan sebagai kontrak atau checkout produksi.

**Catatan riwayat, 23 Oktober 2026:** isi dan hasil verifikasi di bawah merekam kondisi 16 Oktober. Sesudahnya, harga Store dikonfirmasi, katalog menjadi Padel Club saja, dan halaman layanan khusus beserta generatornya dihapus pada 22 Oktober. Untuk kondisi terbaru, rujuk [keputusan bisnis](../../BUSINESS_DECISIONS.md) dan [desain homepage](../../frontend/marketing/DESIGN.md). [Evaluasi Website dan Prioritas](<../../../docs/Rasio Labs - Evaluasi Website dan Prioritas.md>) mencatat rekomendasi serta temuan kontinuitas yang masih terbuka; pembaruan dokumentasi tidak menjalankan ulang atau memperluas hasil QA historis.

## Cakupan

| Permukaan | Implementasi |
|---|---|
| Homepage dan halaman layanan | Harga Profile empat durasi, total di muka, domain tahun pertama, revisi minor tanpa batas jumlah, renewal menunggu penawaran |
| Konsep UI v3 | Data harga yang sama, tautan pemilihan menuju checkout lokal, koleksi tujuh template lama |
| Footer | Layanan, Template, Rasio AI, Login Klien, Kebijakan. Tidak ada section kebijakan panjang di konten pemasaran |
| Kebijakan | `policies.html` mengarah ke lima halaman. Setiap halaman menandai status draf dan mengarah ke register keputusan |
| Checkout | Pilihan 1/12/24/48 bulan, biaya yang belum diketahui tidak dianggap nol, lima tautan kebijakan sebelum consent, consent awal kosong dan reset bila pilihan berubah |
| Langganan dan tagihan | Contoh periode mulai/akhir, permintaan renewal manual, Tidak Perpanjang, permintaan pengakhiran dini/refund yang ditinjau |
| Domain | Registran, registrar, expiry, kelayakan tahun pertama dan renewal terpisah; permintaan transfer hanya simulasi |
| Revisi | Minor/major/incident, materi, sebelum/sesudah dan riwayat; major masuk penawaran, tidak ada kuota revisi |
| Data dan onboarding | Ekspor JSON contoh, permintaan aset/penghapusan, materi dan template yang sudah ada |
| Email | Pratinjau pengingat website dan domain terpisah, dengan expiry, tarif bila tersedia dan tautan aksi; tidak dikirim |
| CMS/admin yang ada | Tautan simulasi berlabel, status historis tetap dapat difilter, tarif renewal historis tetap dibaca dari pesanan tersimpan |
| Backend | Pesanan baru ditolak sebelum DB write selama gate tertutup. Verifikasi pembayaran baru dan pembatalan baru dibatasi; data historis tidak dihitung ulang |

## Harga Profile yang dikonfirmasi

| Durasi | Ekuivalen per bulan | Total di muka | Domain tahun pertama |
|---|---:|---:|---|
| 1 bulan | Rp109.000 | Rp109.000 | Tidak termasuk |
| 12 bulan | Rp54.500 | Rp654.000 | Eligible |
| 24 bulan | Rp32.000 | Rp768.000 | Eligible |
| 48 bulan | Rp27.750 | Rp1.332.000 | Eligible |

Eligibility belum merupakan pendaftaran domain: TLD, plafon subsidi, registrar dan biaya final harus disahkan. Tarif Store lama ditandai menunggu konfirmasi v4. Harga renewal baru tidak dibuat-buat.

## Verifikasi

- `node --test tests/*.test.mjs`: **88 lulus, 0 gagal**. Log: `../../../output/policy-v4-tests-final.log`.
- Tes meliputi harga/domain, validasi revisi, gate transaksi, pemisahan notifikasi, keamanan/session/CMS yang sudah ada, dan render daftar admin kosong/historis.
- Fixture Worker untuk kontrak historis menyuntikkan harga/benefit dan izin historis hanya di modul pengujian. Fixture tersebut tidak disalin ke kode deploy. Tes khusus kebijakan yang belum disetujui memastikan respons 409 dan tidak ada order baru.
- Build Worker dan halaman kebijakan berhasil. Paket konsep standalone lolos syntax, asset tertanam, anchor dan tautan antarhalaman.
- Browser konsep: empat durasi dan perubahan consent, error formulir lalu review valid, Tidak Perpanjang, renewal/refund, minor/major, domain transfer, ekspor contoh, deletion request dan onboarding telah dicoba. Semua tetap simulasi tanpa network write.
- Footer desktop: lima tautan mempunyai koordinat Y yang sama (537px pada viewport browser yang tersedia); Kebijakan membuka halaman indeks lima kebijakan. Blok `.policy-v4-summary` tidak ada lagi dalam main.
- Footer sempit: menu membungkus tanpa overflow horizontal (lebar konten 289px pada lebar jendela CSS 293px). Pengaturan viewport browser tidak selalu menghasilkan ukuran yang diminta; angka ini adalah ukuran aktual yang diamati, bukan klaim pengujian perangkat fisik.
- Bukti visual: `../../../UI Concepts/2026-10-14/footer-policy-v4.png` dan `v4-account-mobile.jpg` dalam folder konsep yang sama.
- Preview browser sumber lama pada port 4185 tidak berhasil dibuka. UI sumber lama diperiksa statis dan melalui regresi render/admin serta backend; tidak diklaim sudah lolos E2E browser produksi.

## Gate desain untuk perubahan kebijakan/footer

- **PASS, navigasi:** satu tautan Kebijakan di footer membuka indeks; lima tujuan ada pada hasil build. Kebijakan checkout tetap dekat consent.
- **PASS, keterbacaan:** teks footer putih di biru #0b4de0, tautan punya area 44px dan outline fokus yang terlihat. Tampilan sempit tidak meluber.
- **PASS, tujuan komponen:** daftar kebijakan dipisahkan agar homepage tidak menjadi dokumen kontrak. Amber hanya mengomunikasikan draf. Tidak menambah gambar, angka pemasaran, atau testimonial.
- **PASS, ritme dan identitas:** konsep mempertahankan ENERGY 2 / RHYTHM 3 / MOTION 2; area baca/form menggunakan MOTION 1. Logo, tipografi dan biru Rasio tetap konsisten.
- **PASS, perilaku:** consent aktif, validasi inline, permintaan lokal memiliki feedback dan status. Pembayaran belum tersedia diberi alasan, bukan tombol yang tampak aktif.
- **PASS, bukti:** hasil tes, build, pemeriksaan browser dan batas pemeriksaan dicatat di atas. Ini bukan klaim semua halaman produksi telah diaudit ulang secara visual.

## Sebelum produksi

Daftar lengkap ada di `../../BUSINESS_DECISIONS.md`. Tidak ada approval yang diisi otomatis.

1. Persetujuan bisnis dan review hukum Indonesia untuk pembatalan/refund, renewal, domain, kepemilikan, retensi, SLA dan penyedia layanan.
2. Penetapan harga Store, TLD, plafon, pajak, biaya final, serta harga renewal yang benar-benar ditawarkan.
3. Backend aman untuk request lifecycle, otorisasi per akun, audit log, bukti consent/versi kontrak, pembayaran/refund idempotent dan notifikasi.
4. Migrasi schema/quote snapshot sebelum membuka checkout: kolom lama `orders.renewal_monthly` masih NOT NULL, sedangkan v4 mengembalikan null bila belum ada penawaran. Jangan membuka gate atau mengganti null dengan nol untuk melewati constraint. Pertahankan nilai pesanan historis.
5. Kebijakan retensi 30/60 hari, grace 14 hari dan reminder H-30/14/7/1 masih usulan. Tidak ada penghapusan, penagihan, transfer domain atau refund otomatis yang diaktifkan.
6. Jalankan E2E browser deployment staging dengan backend/gateway uji setelah poin di atas selesai, sebelum produksi.

Gunakan `scripts/build-worker.mjs` untuk build dan `scripts/build-policy-v4.mjs` untuk regenerasi kebijakan. `scripts/migrate-policy-v4.mjs` adalah migrasi satu kali yang sudah diterapkan, bukan generator halaman rutin.
