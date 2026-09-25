"""Build the editorial pages and homepage previews from one article collection."""
from pathlib import Path
from html import escape
import re

root = Path(__file__).resolve().parents[1]
dist = root/'dist'
articles = [
    {
        'slug': 'memilih-jenis-website-bisnis', 'category': 'Perencanaan website', 'emoji': '🧭',
        'title': 'Cara memilih jenis website yang sesuai dengan kebutuhan bisnis',
        'excerpt': 'Kenali perbedaan company profile, toko online, dan website custom sebelum menentukan fitur dan desain.',
        'sections': [
            ('Mulai dari tujuan pengunjung', 'Sebelum memilih desain, tentukan tindakan yang ingin Anda bantu pengunjung lakukan. Mereka mungkin perlu memahami layanan, melihat contoh pekerjaan, membeli produk, atau mengakses informasi khusus. Tuliskan satu tujuan utama, lalu catat informasi dan langkah yang diperlukan untuk mencapainya. Daftar ini menjadi dasar ketika membandingkan pilihan website. Pertimbangkan juga siapa yang akan memperbarui isinya setelah website digunakan.'),
            ('Gunakan company profile untuk menjelaskan bisnis', 'Website company profile cocok untuk bisnis yang perlu memperkenalkan perusahaan, menjelaskan layanan, dan menampilkan portofolio. Pengunjung dapat mempelajari penawaran sebelum menghubungi tim. Siapkan profil singkat, uraian layanan, contoh pekerjaan yang boleh dipublikasikan, serta informasi kontak yang akurat. Jika kebutuhan berpusat pada satu penawaran atau kampanye, landing page dapat menyajikan penjelasan secara lebih terarah.'),
            ('Pertimbangkan toko online untuk proses pembelian', 'Toko online sesuai ketika pelanggan perlu memilih produk dan menyelesaikan pembelian melalui website. Kebutuhannya mencakup katalog, variasi produk, stok, keranjang, pembayaran, dan pengiriman. Sebelum menentukan fitur, jelaskan cara bisnis menerima pesanan dan menangani perubahan stok, pembatalan, serta pertanyaan pelanggan. Catat informasi yang diperlukan tim untuk memproses pesanan agar Anda dapat menilai apakah platform mendukung cara kerja toko.'),
            ('Petakan kebutuhan sebelum memilih pengembangan custom', 'Pengembangan custom dapat dipertimbangkan ketika bisnis memerlukan alur kerja, peran pengguna, atau integrasi yang lebih khusus. Contohnya adalah portal pelanggan dengan akses berbeda atau sistem persetujuan internal yang mengikuti struktur tim. Kelompokkan fitur yang wajib tersedia sejak awal dan fitur yang dapat menyusul. Sertakan contoh proses sehari-hari, sistem yang sudah digunakan, serta pihak yang terlibat agar pembahasan cakupan, waktu, dan biaya memiliki dasar yang konkret.'),
        ],
    },
    {
        'slug': 'materi-sebelum-membuat-website', 'category': 'Persiapan konten', 'emoji': '🗂️',
        'title': 'Materi yang perlu disiapkan sebelum membuat website bisnis',
        'excerpt': 'Siapkan teks, logo, foto, dan data produk agar pembuatan website memiliki bahan yang jelas untuk dikerjakan.',
        'sections': [
            ('Tentukan tujuan dan susunan informasi', 'Mulailah dengan menjelaskan siapa yang akan menggunakan website dan informasi apa yang mereka perlukan. Buat daftar bagian utama, misalnya profil bisnis, layanan, portofolio, dan kontak. Tuliskan tujuan setiap bagian agar materi yang dikumpulkan tetap relevan. Halaman layanan, misalnya, perlu menjelaskan cakupan pekerjaan, siapa yang dilayani, dan cara meminta informasi lebih lanjut. Susunan ini dapat disempurnakan bersama pihak yang membuat website.'),
            ('Siapkan teks yang menjawab pertanyaan pelanggan', 'Kumpulkan nama bisnis, deskripsi usaha, informasi layanan, alamat yang boleh ditampilkan, jam operasional, dan saluran kontak. Gunakan penjelasan spesifik agar pengunjung memahami penawaran Anda. Untuk setiap layanan, jelaskan proses, hasil yang diterima, dan ketentuan yang perlu diketahui pelanggan. Pisahkan informasi yang sudah pasti dari materi yang perlu diperiksa, kemudian tentukan siapa yang memberikan persetujuan sebelum teks digunakan.'),
            ('Kumpulkan gambar dan data produk', 'Siapkan logo serta foto yang jelas dan relevan dengan isi halaman. Beri nama file berdasarkan layanan, proyek, atau produk, lalu pastikan Anda memiliki izin untuk menggunakannya. Untuk toko online, kumpulkan nama produk, deskripsi, harga, variasi, stok, berat atau ukuran untuk pengiriman, serta foto setiap variasi. Simpan data dalam format yang konsisten agar tim dapat memeriksa kelengkapan dan menemukan perbedaan informasi dengan mudah.'),
            ('Atur pemeriksaan dan penyerahan materi', 'Simpan materi dalam satu folder dengan pembagian sesuai susunan halaman. Sediakan dokumen utama untuk teks agar koreksi tidak tersebar di banyak percakapan. Tentukan satu penanggung jawab untuk mengumpulkan masukan dan menyetujui hasil pemeriksaan. Sebelum menyerahkan materi, periksa ejaan, nomor kontak, harga, tautan, dan informasi yang tidak boleh dipublikasikan. Catat materi yang belum tersedia beserta orang yang akan melengkapinya.'),
        ],
    },
    {
        'slug': 'mengelola-konten-website', 'category': 'Pengelolaan website', 'emoji': '🛠️',
        'title': 'Cara mengelola konten website setelah website aktif',
        'excerpt': 'Buat kebiasaan memperbarui informasi bisnis, produk, dan kontak agar website tetap relevan bagi pelanggan.',
        'sections': [
            ('Kenali bagian yang dapat diperbarui', 'CMS atau sistem pengelolaan konten membantu pengguna memperbarui bagian website melalui antarmuka yang disediakan. Bagian yang dapat diubah bergantung pada pengaturan website, misalnya teks, gambar, layanan, produk, atau stok. Pelajari panduan dan fungsi setiap kolom sebelum melakukan perubahan. Tentukan siapa yang boleh mengedit dan siapa yang memeriksa hasilnya, terutama untuk informasi yang berpengaruh pada pembelian atau layanan pelanggan.'),
            ('Buat daftar pemeriksaan konten', 'Susun daftar informasi yang perlu ditinjau sesuai aktivitas bisnis. Periksa nomor kontak, alamat, jam operasional, uraian layanan, tautan, dan foto yang sudah tidak relevan. Untuk toko online, tambahkan harga, variasi produk, stok, serta ketentuan pembelian dan pengiriman. Lakukan pemeriksaan tambahan ketika ada perubahan operasional, peluncuran produk, atau berakhirnya penawaran. Catat penanggung jawab setiap informasi agar koreksi diteruskan kepada orang yang tepat.'),
            ('Periksa hasil sebelum dan setelah diterbitkan', 'Sebelum menerbitkan perubahan, baca kembali teks dan gunakan fitur pratinjau jika tersedia. Periksa apakah judul, gambar, tautan, dan tombol sesuai dengan isi halaman. Setelah diterbitkan, buka halaman yang dilihat pengunjung untuk memastikan hasilnya benar. Cobalah melalui ponsel untuk menilai keterbacaan dan kemudahan penggunaan. Jika tersedia riwayat revisi, pelajari cara memulihkan versi sebelumnya agar kesalahan konten dapat ditangani dengan teratur.'),
            ('Catat perubahan dan kebutuhan pengembangan', 'Simpan catatan perubahan penting, seperti pembaruan layanan, ketentuan pembelian, atau struktur katalog. Catatan membantu tim memahami kapan perubahan dilakukan dan siapa yang menyetujuinya. Saat kebutuhan melibatkan alur baru, fitur tambahan, atau integrasi, jelaskan masalah dan contoh penggunaannya kepada pengelola teknis. Dengan memisahkan pembaruan konten dan kebutuhan pengembangan, tim dapat menentukan tanggung jawab, prioritas, dan proses pemeriksaan yang sesuai.'),
        ],
    },
]

home = (dist/'index.html').read_text(encoding='utf-8')
if '/blog.css?' not in home:
    home = home.replace('</head>', '<link rel="stylesheet" href="/blog.css?v=14" /></head>')
head = home.split('<body>')[0]
header = re.search(r'<header[\s\S]*?</header>', home)[0].replace('href="#', 'href="/#')
footer = re.search(r'<footer[\s\S]*?</footer>', home)[0].replace('href="#', 'href="/#')
header = header.replace('<a href="/blog.html">Blog</a>', '<a href="/blog.html" aria-current="page">Blog</a>')

def card(a):
    return f'''<article class="blog-card"><div class="blog-card-top"><span class="emoji" aria-hidden="true">{a['emoji']}</span><span>{a['category']}</span></div><h3><a href="/blog-{a['slug']}.html">{a['title']}</a></h3><p>{a['excerpt']}</p><span class="blog-read" aria-hidden="true">Baca panduan <span>↗</span></span></article>'''

def page(slug, title, description, body):
    h = re.sub(r'<title>.*?</title>', f'<title>{escape(title)} — Rasio Agency</title>', head)
    h = re.sub(r'<meta\s+name="description"\s+content="[^"]*"\s*/>', f'<meta name="description" content="{escape(description, quote=True)}" />', h)
    (dist/f'{slug}.html').write_text(h+'<body class="blog-page"><a class="skip-link" href="#main-content">Lewati ke konten utama</a>'+header+'<main id="main-content">'+body+'</main>'+footer+'<script src="/navigation.js?v=15"></script></body></html>', encoding='utf-8')

cards = ''.join(card(a) for a in articles)
page('blog', 'Blog dan panduan website bisnis', 'Panduan memilih website, menyiapkan materi, dan mengelola konten untuk kebutuhan bisnis Anda.', f'''<section class="blog-hero shell"><p class="eyebrow">Blog Rasio Agency</p><h1>Pahami cara merencanakan dan <mark class="marker">mengelola website bisnis Anda.</mark></h1><p>Panduan praktis untuk membantu Anda menentukan kebutuhan, menyiapkan materi, dan menjaga informasi website tetap relevan bagi pelanggan.</p></section><section class="shell blog-library" aria-labelledby="articles-title"><div class="blog-library-heading"><h2 id="articles-title">Panduan untuk memulai dan mengelola website</h2><span>3 artikel</span></div><div class="blog-grid">{cards}</div></section><section class="shell blog-help"><div><h2>Perlu bantuan menentukan website yang sesuai?</h2><p>Ceritakan proses bisnis dan kebutuhan pelanggan Anda agar tim Rasio dapat membantu memilih layanan yang tepat.</p></div><a class="button" href="https://wa.me/60142317052?text=Halo%20Rasio%2C%20saya%20ingin%20konsultasi%20kebutuhan%20website." target="_blank" rel="noopener">Konsultasi Gratis ↗</a></section>''')
for a in articles:
    toc = ''.join(f'<a href="#bagian-{i}"><span>0{i}</span>{title}</a>' for i,(title,_) in enumerate(a['sections'],1))
    body = ''.join(f'<section id="bagian-{i}"><h2>{title}</h2><p>{copy}</p></section>' for i,(title,copy) in enumerate(a['sections'],1))
    related = ''.join(card(other) for other in articles if other != a)
    page('blog-'+a['slug'], a['title'], a['excerpt'], f'''<article><header class="article-header shell"><a class="article-back" href="/blog.html">← Kembali ke Blog</a><p class="eyebrow">{a['category']}</p><h1>{a['title']}</h1><p>{a['excerpt']}</p></header><div class="shell article-layout"><aside class="article-toc"><strong>Di dalam panduan ini</strong><nav aria-label="Daftar isi artikel">{toc}</nav></aside><div class="article-body">{body}<div class="article-next"><p>Pelajari pilihan fitur dan layanan sebelum menentukan website untuk bisnis Anda.</p><a class="secondary-button" href="/#solusi">Lihat layanan Rasio ↗</a></div></div></div></article><section class="shell blog-related" aria-labelledby="related-title"><h2 id="related-title">Lanjutkan dengan panduan lainnya</h2><div class="blog-grid">{related}</div></section>''')

preview = f'''<!-- blog-preview:start --><section class="blog-home" id="blog" aria-labelledby="blog-title"><div class="shell"><div class="section-heading blog-heading"><div><p class="eyebrow">Blog & panduan bisnis</p><h2 id="blog-title">Pelajari cara memilih dan <mark class="marker">mengelola website bisnis Anda.</mark></h2></div><a class="secondary-button" href="/blog.html">Lihat semua artikel ↗</a></div><div class="blog-grid">{cards}</div></div></section><!-- blog-preview:end -->'''
if '<!-- blog-preview:start -->' in home:
    home = re.sub(r'<!-- blog-preview:start -->[\s\S]*?<!-- blog-preview:end -->', preview, home)
else:
    home = home.replace('    </main>', preview+'\n    </main>')
(dist/'index.html').write_text(home, encoding='utf-8')
print('Built Blog, 3 articles, and homepage previews.')
