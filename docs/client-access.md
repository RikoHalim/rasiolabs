# Akses klien Rasio

1. Klien memesan dengan email kontak yang valid. Sesi checkout hanya menampilkan status pesanan.
2. Admin membuka `/admin` melalui URL manual, memeriksa dana masuk dan referensi pembayaran, lalu menyimpan status pembayaran terverifikasi.
3. Sistem menyiapkan satu username per pesanan serta email aktivasi. Verifikasi berulang tidak membuat akun atau email awal ganda.
4. Email berisi username dan tautan untuk membuat password pertama, bukan password sementara. Tautan aktivasi berlaku 24 jam dan hanya bisa digunakan sekali.
5. Klien membuat password minimal 12 karakter, kemudian login melalui `/cms` dengan username dan password. CMS tetap mengedit konten, bukan struktur template.
6. Lupa password mengirim tautan reset satu jam. Password baru membatalkan sesi lama. Pencabutan akses oleh admin juga membatalkan akun dan semua tautan sebelumnya.

## Mengaktifkan email

Implementasi pengiriman memakai Resend. Siapkan domain pengirim terverifikasi dan akun Resend, lalu atur `RESEND_API_KEY` sebagai secret dan `EMAIL_FROM` sebagai alamat pengirim di konfigurasi runtime Sites. Jangan meletakkan API key di frontend, repositori, atau chat. Deploy ulang untuk menerapkan konfigurasi.

`CLIENT_AUTH_SECRET` sudah disiapkan sebagai secret terpisah untuk proteksi password dan enkripsi tautan email. Mengganti secret ini memerlukan reset password akun; jangan melakukan rotasi tanpa rencana pemulihan akses.

Jika email belum dikonfigurasi, pembayaran dan akun tetap tercatat, tetapi status admin menampilkan **Email pengirim belum terhubung**. Admin dapat melihat tautan aktivasi privat untuk pengujian atau mengirim ulang setelah email siap. Status **Email terkirim** hanya ditampilkan setelah penyedia email mengonfirmasi penerimaan, bukan sebagai bukti email masuk inbox.

Email awal dikirim saat verifikasi pembayaran. Tombol admin dapat membuat tautan baru bila pengiriman gagal atau proses terhenti; tautan lama menjadi tidak berlaku. Permintaan lupa password menggunakan respons generik dan pengiriman di latar belakang. Tidak ada jadwal pengiriman ulang tanpa batas.

## Keamanan

Password menggunakan salt acak, pepper dari secret runtime, dan PBKDF2 SHA-256 100.000 iterasi sesuai batas native Workers. Secret dan hash tidak dikirim ke browser. Reset memakai token acak 32 byte, hash di database, payload email terenkripsi, serta klaim transaksi sekali pakai. Sesi memakai cookie HttpOnly, SameSite Strict, token CSRF, pemeriksaan origin dan versi akun. Login/reset dibatasi frekuensinya. Admin tidak ditautkan dari halaman publik dan tetap memerlukan autentikasi.

Payment gateway belum terhubung. Trigger akun saat ini adalah verifikasi pembayaran oleh admin. Pengujian email memakai penyedia tiruan yang hanya ada dalam tes; tidak ada pengiriman email pelanggan selama pengujian.
