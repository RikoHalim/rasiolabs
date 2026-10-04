# Audit template Rasio Labs — 5 Oktober 2026

Kesimpulan: empat template sudah memiliki struktur yang dapat dipakai untuk website bisnis di sektornya. Kecocokan ini merupakan penilaian atas isi, alur, CMS, dan praktik website bisnis pembanding; belum merupakan bukti permintaan pasar atau hasil penjualan klien.

| Template | Cocok untuk | Halaman | Fungsi yang membantu calon klien |
| --- | --- | ---: | --- |
| Architecture | Studio arsitektur, interior, dan renovasi | 9 | Portofolio dan detail proyek, studio, proses kerja, panduan perencanaan/renovasi, galeri, permintaan konsultasi |
| Padel | Klub padel, pelatih, dan kegiatan komunitas | 6 | Program bermain, klub/founders, lokasi dan peta, persiapan permainan pertama, group play, permintaan sesi |
| Creative | Studio branding dan desain | 8 | Filter portofolio, studi identitas/digital, studio dan kapabilitas, brief proyek, brand foundations, panduan handover |
| Consulting | Konsultan strategi dan operasional | 8 | Bidang keahlian, pendekatan, perspektif/artikel, prioritas bisnis, persiapan business/operations review, permintaan konsultasi |

Jumlah halaman mencakup beranda: 31. Template dipilih sesuai jenis bisnis; bukan satu layout universal untuk seluruh sektor.

## Dasar riset

- [Olson Kundig — Sol Duc Cabin](https://olsonkundig.com/projects/sol-duc-cabin/) menunjukkan pentingnya konteks lokasi, lingkup, tim, dan fotografi proyek. [Halaman kontak](https://olsonkundig.com/contact/) menyediakan tujuan kontak yang jelas. Implikasi untuk Architecture: foto perlu didampingi cerita proyek nyata, dan formulir perlu menanyakan lokasi, anggaran, serta waktu.
- [Rocket Padel — Ilford](https://www.rocketpadel.com/club/ilford) menggabungkan informasi fasilitas, lokasi, coaching, dan booking. Implikasi untuk Padel: calon pemain perlu memahami pilihan sesi, menemukan klub, dan mengirim permintaan dengan tanggal, waktu, serta jumlah pemain.
- [Pentagram — Univers](https://www.pentagram.com/work/univers) menyajikan konteks desain beserta penerapannya; [koleksi work](https://www.pentagram.com/work) membantu menjelajahi proyek. Implikasi untuk Creative: studi kasus dan brief lebih berguna daripada galeri dekoratif tanpa penjelasan.
- [Bain — Consulting services](https://www.bain.com/consulting-services/) menyusun layanan berdasarkan kebutuhan bisnis; [kontak Bain](https://www.bain.com/about/contact-us/) menyediakan jalur enquiry. Implikasi untuk Consulting: jelaskan bidang keahlian dan pendekatan, lalu kumpulkan perusahaan, peran, dan kebutuhan calon klien.

Pembanding digunakan untuk pola informasi dan kebutuhan pengguna, bukan menyalin desain atau menjamin hasil komersial yang sama.

## Perbaikan yang sudah diterapkan

- Formulir mendapat pertanyaan yang berbeda sesuai sektor. Email opsional; nama dan kebutuhan tetap diperlukan. Pilihan Padel memvalidasi jumlah pemain minimal satu.
- Brief Creative bisa dirangkum dan diteruskan ke formulir enquiry tanpa mengetik ulang. Persiapan proyek juga dapat disalin atau diunduh.
- Navigasi Consulting diperjelas dan semua halaman Architecture tersedia lewat footer.
- Tujuh foto nyata tambahan memisahkan penggunaan gambar yang sebelumnya berulang. Audit menemukan 22 berkas foto dengan hash berbeda, tanpa foto yang sama lintas template atau berulang pada satu halaman. Gambar yang dibuka kembali dalam dialog galeri tidak dihitung sebagai duplikasi konten halaman.
- Foto baru terdaftar sebagai field CMS dan lolos validasi konten. Sumber foto dicatat secara internal dalam [daftar sumber](template-audit-photo-sources.md).
- Hero Creative diperbaiki agar tetap terlihat di mobile.

## Animasi yang berbeda

| Template | Arah animasi |
| --- | --- |
| Architecture | Foto terbuka vertikal, pergerakan tenang, progress baca, parallax hero ringan pada desktop |
| Padel | Teks masuk dari samping, foto terbuka diagonal, urutan program lebih cepat |
| Creative | Headline muncul per kata, foto terbuka dari tengah, elemen editorial bergerak dengan sedikit rotasi |
| Consulting | Fade singkat dan pergeseran kecil, tanpa parallax |

Filter, tab, dan perpindahan halaman mengikuti karakter masing-masing. Preferensi reduced motion dihormati; konten tetap tersedia bila JavaScript tidak aktif.

## Sebelum dipakai oleh klien

1. Masukkan identitas, logo, kontak, dan layanan bisnis klien melalui CMS. Klien mengubah konten dan gambar, sementara desain template tetap terjaga.
2. Architecture dan Creative membutuhkan portofolio/foto pekerjaan asli beserta konteks proyek. Foto stok tidak boleh dianggap sebagai bukti proyek klien.
3. Padel membutuhkan alamat, koordinat peta, jam buka, program, dan informasi founders yang benar. Consulting membutuhkan profil tim, pengalaman, serta lingkup layanan nyata.
4. Uji CTA dan nomor/email tujuan setelah konten diganti. Formulir saat ini menyiapkan pesan WhatsApp; pengunjung perlu mengirim pesan tersebut di WhatsApp.
5. Jika Padel membutuhkan booking otomatis berdasarkan slot lapangan dan pembayaran, tambahkan integrasi booking. Fitur itu belum tersedia dalam alur permintaan WhatsApp saat ini.

## Verifikasi

- Seluruh 31 route diperiksa pada desktop 1366 × 768 dan mobile 390 × 844: judul/konten tampil, tanpa overflow horizontal atau gambar rusak yang terdeteksi.
- Audit link/fragment tidak menemukan tujuan lokal kosong atau hilang.
- Empat set konten default CMS, termasuk foto baru, lolos validasi.
- Alur ringkasan brief Creative → enquiry serta validasi form Padel diperiksa langsung melalui browser lokal.
- Build berhasil; pemeriksaan sintaks kedua berkas JavaScript berhasil.
- 46 pengujian aplikasi berhasil, mencakup CMS, publikasi konten klien, akses, dan pesanan.

Pengujian ini mendukung kesiapan template untuk penyesuaian konten. Pengaturan bisnis klien, integrasi tambahan, serta hasil pemasaran tetap perlu diuji saat onboarding klien nyata.
