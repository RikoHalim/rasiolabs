from pathlib import Path
import re
from urllib.parse import quote
from sector_icons import sector_icon

root = Path(__file__).resolve().parents[1]
home = (root / 'dist/index.html').read_text(encoding='utf-8')
head = home.split('<body>')[0]
header = re.search(r'<header[\s\S]*?</header>', home).group()
footer = re.search(r'<footer[\s\S]*?</footer>', home).group()
header = header.replace('href="#', 'href="/#')
footer = footer.replace('href="#', 'href="/#')

products = {
    'store': {
        'name': 'RasioLabs Store', 'label': 'Toko online siap pakai',
        'title': 'Toko Anda.<br /><mark class="marker">Aturan main Anda.</mark>',
        'intro': 'RasioLabs Store menyediakan toko online dengan identitas brand Anda, tempat pelanggan dapat melihat produk, melakukan pembayaran, dan memeriksa pengiriman melalui alur belanja yang terhubung.',
        'board': ['Pelanggan menemukan produk', 'Checkout & pembayaran', 'Pesanan dikirim dan dilacak'],
        'board_title': 'Pelanggan dapat memilih produk, membayar, dan melacak pesanan melalui toko Anda.',
        'board_note': 'Dashboard toko untuk produk, stok, dan pesanan.',
        'sectors': [('Fashion & aksesori','Koleksi, ukuran, dan variasi produk.'),('Beauty & skincare','Katalog dan informasi tiap produk.'),('Home & living','Furniture, dekorasi, dan peralatan.'),('Makanan kemasan','Produk siap kirim dan paket bundling.'),('Hobi & lifestyle','Koleksi khusus dengan pelanggan loyal.')],
        'problems': [('Pesanan tersebar di banyak chat.','Checkout menyatukan detail belanja, pembayaran, dan pesanan.'),('Pertanyaan ongkir datang berulang.','Pembeli dapat melihat ongkir dan mengikuti status pengiriman.'),('Brand sulit dikenali saat berbelanja.','Domain dan tampilan toko membawa identitas bisnis Anda sendiri.')],
        'features': ['Template dengan logo, warna, dan produk Anda','Payment gateway, cek ongkir, resi, dan tracking','Dashboard produk, stok, dan pesanan','AI chatbot untuk pertanyaan pelanggan','Domain gratis selama 1 tahun untuk paket 12 bulan atau lebih','1 email bisnis gratis, hosting, dan SSL','RasioLabs AI Insight tersedia sebagai add-on'],
        'manage_title':'Kelola produk, stok, dan pesanan melalui dashboard toko Anda.',
        'manage':'Tim Rasio Labs membantu setup awal. Setelah aktif, Anda mengelola produk dan pesanan melalui dashboard toko. Rasio Labs menangani maintenance teknis sesuai paket.',
        'note':'Berlangganan tahunan. Rasio Labs tidak mengambil komisi penjualan; biaya transaksi dan pengiriman tetap berlaku sesuai penggunaan.',
    },
    'profile': {
        'name':'RasioLabs Profile', 'label':'Company profile & landing page',
        'title':'Kesan pertama yang<br /><mark class="marker">meyakinkan.</mark>',
        'intro':'Jelaskan siapa Anda, apa yang Anda tawarkan, dan mengapa pelanggan perlu percaya. Tim Rasio Labs menyiapkan sekaligus mengelola seluruh konten website Anda.',
        'board':['Kenalkan identitas bisnis','Tampilkan layanan & karya','Arahkan calon pelanggan menghubungi Anda'],
        'board_title':'Perkenalkan profil, layanan, dan karya agar pelanggan memahami bisnis Anda.',
        'board_note':'Anda kirim materi. Tim Rasio Labs merapikan kontennya.',
        'sectors':[('Konsultan & jasa','Layanan, keahlian, dan cara menghubungi.'),('Properti & konstruksi','Portofolio proyek dan profil tim.'),('Pendidikan & kursus','Program, fasilitas, dan pendaftaran.'),('Manufaktur & B2B','Kapabilitas, katalog, dan profil perusahaan.'),('Hospitality & kreatif','Pengalaman, karya, dan identitas bisnis.')],
        'problems':[('Calon pelanggan sulit memahami layanan.','Susun profil, layanan, dan portofolio dalam halaman yang jelas.'),('Materi bisnis tersebar di banyak dokumen.','Satukan informasi penting di satu alamat yang mudah dibagikan.'),('Tim tidak punya waktu mengedit website.','Kirim materi atau revisi. Seluruh pengeditan konten ditangani Rasio Labs.')],
        'features':['Template company profile atau landing page','Logo, warna, teks, dan foto sesuai bisnis','Formulir calon pelanggan dan tautan kontak','AI chatbot berdasarkan informasi bisnis','Domain gratis selama 1 tahun untuk paket 12 bulan atau lebih','1 email bisnis gratis, hosting, dan SSL','Setup dan perubahan konten oleh tim Rasio Labs'],
        'manage_title':'Fokus pada bisnis. Kontennya kami urus.',
        'manage':'Anda mengirim logo, teks, foto, dan permintaan perubahan melalui kanal Rasio Labs. Tim kami mengedit konten, menyiapkan preview, lalu meminta review Anda. Cakupan revisi mengikuti paket yang disepakati.',
        'note':'Berlangganan tahunan dengan pengelolaan konten oleh Rasio Labs.',
    },
    'custom': {
        'name':'RasioLabs Custom', 'label':'Website & software sesuai kebutuhan',
        'title':'Cara kerja unik.<br /><mark class="marker">Sistem yang mengikuti.</mark>',
        'intro':'Punya alur yang lebih spesifik dari template? Kita mulai dari kebutuhan bisnis, lalu merancang website, software, dan integrasi yang memang Anda perlukan.',
        'board':['Petakan kebutuhan & prioritas','Sepakati ruang lingkup proyek','Bangun, uji, dan terapkan'],
        'board_title':'Fitur dan integrasi dirancang berdasarkan alur kerja bisnis Anda.',
        'board_note':'Estimasi dan penawaran setelah konsultasi.',
        'sectors':[('Marketplace multivendor','Alur seller, katalog, dan transaksi.'),('Distribusi & logistik','Pesanan, stok, dan alur operasional.'),('Layanan & reservasi','Jadwal, pemesanan, dan administrasi.'),('Pendidikan & komunitas','Portal anggota dan akses bertingkat.'),('Operasional perusahaan','Persetujuan, laporan, dan integrasi sistem.')],
        'problems':[('Template tidak cocok dengan alur bisnis.','Rancang fitur dan pengalaman pengguna berdasarkan kebutuhan nyata.'),('Data dipindahkan manual antarsistem.','Hubungkan sistem melalui integrasi dan automasi yang disepakati.'),('Kebutuhan terus bertambah sebelum fitur utama dan prioritas ditentukan.','Tentukan fitur inti, tahapan pengerjaan, dan cakupan sebelum pembangunan.')],
        'features':['1 email bisnis gratis','Riset kebutuhan dan perancangan alur','Desain serta pengembangan khusus','Multivendor, portal, atau software internal','Integrasi API, automasi, dan AI sesuai scope','Pengujian, review, dan persiapan peluncuran','Maintenance dan pengelolaan sesuai kesepakatan'],
        'manage_title':'Diskusikan kebutuhan proyek untuk menentukan fitur, biaya, dan waktu pengerjaan.',
        'manage':'Ceritakan tujuan, alur kerja, fitur utama, dan target waktu. Rasio Labs menyusun cakupan serta penawaran sebelum pembangunan. Pemilihan domain dapat dipersiapkan terlebih dahulu; pembayaran proyek mengikuti penawaran yang disetujui.',
        'note':'Harga ditentukan setelah konsultasi. Pemilihan domain tidak otomatis menjadi pembelian atau kontrak pengerjaan.',
    },
}

products['store'].update({
 'title':'Kembangkan penjualan dengan<br /><mark class="marker">toko online milik brand Anda.</mark>',
 'note':'Berlangganan tahunan. Website pre-made aktif dalam 1–2 × 24 jam setelah pemesanan. Tim menghubungi Anda dalam 1 × 24 jam setelah pembayaran.',
 'features':['Template dengan logo, warna, dan produk Anda','Payment gateway, cek ongkir, resi, dan tracking','CMS toko untuk produk, stok, dan pesanan','SEO dasar dan tombol WhatsApp','AI chatbot untuk pertanyaan pelanggan','Domain gratis selama 1 tahun untuk paket 12 bulan atau lebih','1 email bisnis gratis, hosting, dan SSL','Maintenance selama langganan aktif','Opsional: RasioLabs AI Insight Rp500.000/tahun'],
 'manage':'Tim Rasio Labs membantu setup awal dan panduan penggunaan. Setelah aktif, Anda mengelola produk, stok, dan pesanan melalui CMS toko. Maintenance teknis sudah termasuk selama langganan berlangsung.'
})
products['profile'].update({
 'title':'Bantu calon pelanggan<br /><mark class="marker">mengenal dan memilih bisnis Anda.</mark>',
 'intro':'RasioLabs Profile membantu memperkenalkan layanan, karya, dan identitas bisnis Anda. Tim Rasio Labs menyiapkan konten awal, lalu Anda dapat memperbarui teks, gambar, dan logo melalui CMS sederhana.',
 'board_note':'Ubah teks, gambar, dan logo melalui CMS sederhana.',
 'manage_title':'Perbarui informasi bisnis tanpa mengedit kode.',
 'manage':'Pilih template, kirim logo, teks, dan foto, lalu review hasil setup dari tim Rasio Labs. Setelah website aktif, gunakan CMS sederhana untuk mengubah copywriting, gambar, dan logo. Kami memberikan panduan serta maintenance selama langganan aktif.',
 'note':'Berlangganan tahunan. Website pre-made aktif dalam 1–2 × 24 jam setelah pemesanan. Tim menghubungi Anda dalam 1 × 24 jam setelah pembayaran.',
 'features':['Template company profile yang dapat disesuaikan dengan identitas bisnis','Logo, warna, teks, dan foto sesuai bisnis','CMS sederhana untuk copywriting, gambar, dan logo','SEO dasar dan WhatsApp CTA','AI chatbot berdasarkan informasi bisnis','Domain gratis selama 1 tahun untuk paket 12 bulan atau lebih','1 email bisnis gratis, hosting, dan SSL','Setup awal dan panduan CMS','Maintenance selama langganan berlangsung']
})
products['profile']['problems'][2]=('Informasi website cepat ketinggalan.','Perbarui teks, foto, dan logo sendiri melalui CMS sederhana, tanpa menyentuh kode.')
products['custom'].update({
 'title':'Bangun website, ERP, dan software<br /><mark class="marker">sesuai alur bisnis Anda.</mark>',
 'features':['Pemetaan kebutuhan dan perancangan alur','Desain serta pengembangan khusus','ERP, multivendor, CRM, portal, dan software internal','CMS, SEO, serta WhatsApp CTA untuk website sesuai kebutuhan','Integrasi API, automasi, dan AI sesuai scope','Pengujian, review, dan persiapan peluncuran','Maintenance dan pengelolaan sesuai kesepakatan'],
 'intro':'Dari website khusus hingga ERP dan software operasional, mulai dari kebutuhan yang paling penting bagi bisnis. Rasio Labs membantu merancang fitur, integrasi, dan pengalaman pengguna sesuai alur kerja Anda.'
})
extra_sectors={
 'store':[('Elektronik & gadget','Spesifikasi, aksesori, dan variasi produk.'),('Olahraga & outdoor','Peralatan, pakaian, dan perlengkapan.'),('Ibu & anak','Kebutuhan harian dan koleksi keluarga.'),('Pet supplies','Pakan, aksesori, dan perawatan hewan.'),('Kerajinan lokal','Karya unik, hadiah, dan produk artisan.')],
 'profile':[('Klinik & wellness','Profil layanan dan informasi kontak.'),('Firma hukum','Keahlian, profil tim, dan konsultasi.'),('Travel & wisata','Paket, destinasi, dan permintaan informasi.'),('F&B & hospitality','Menu, lokasi, dan identitas brand.'),('Organisasi & komunitas','Program, kegiatan, dan informasi anggota.')],
 'custom':[('Manufaktur','ERP untuk produksi dan persediaan.'),('Retail & grosir','Alur pembelian, penjualan, dan laporan.'),('Properti','CRM prospek dan pengelolaan unit.'),('Kesehatan','Administrasi layanan dan jadwal.'),('Keuangan perusahaan','Anggaran, persetujuan, dan pelaporan.')]
}
extra_problems={
 'store':[('Produk sulit ditemukan lewat pencarian.','Struktur halaman dan SEO dasar membantu mesin pencari memahami katalog Anda.'),('Pelanggan menanyakan hal yang sama.','AI chatbot menjawab informasi produk dan FAQ; tombol WhatsApp memudahkan percakapan lanjutan.'),('Data penjualan belum membantu menentukan bagian toko yang perlu diperbaiki.','Add-on RasioLabs AI merangkum performa dan memberi saran perbaikan yang dapat Anda tinjau.')],
 'profile':[('Calon pelanggan tidak tahu harus menghubungi siapa.','WhatsApp CTA dan formulir kontak menyediakan jalur yang jelas untuk bertanya.'),('Informasi bisnis sulit ditemukan di mesin pencari.','SEO dasar menata judul, deskripsi, dan struktur informasi setiap halaman.'),('Pertanyaan awal menyita waktu tim.','AI chatbot membantu menjelaskan layanan berdasarkan informasi bisnis yang Anda siapkan.')],
 'custom':[('Stok dan laporan berbeda antardivisi.','ERP dapat menghubungkan proses pembelian, persediaan, dan penjualan dalam alur yang disepakati.'),('Persetujuan pekerjaan sulit dilacak.','Bangun peran pengguna, status pekerjaan, dan alur persetujuan sesuai struktur tim.'),('Pelanggan membutuhkan pengalaman yang lebih khusus.','Rancang portal, CMS, reservasi, atau checkout sesuai kebutuhan pengguna dan bisnis.')]
}
for kind in products:
 products[kind]['sectors']+=extra_sectors[kind]
 products[kind]['problems']+=extra_problems[kind]

for kind,p in products.items():
    wa = 'https://wa.me/60142317052?text=' + quote('Halo Rasio Labs, saya ingin konsultasi gratis tentang ' + p['name'] + '.')
    actions=f'<a class="button" href="{wa}" target="_blank" rel="noopener">Konsultasi Gratis</a><a class="secondary-button" href="/order.html?type={kind}">Cari Domain Anda</a>'
    sectors=''.join(f'<article class="sector-card">{sector_icon(title)}<h3>{title}</h3><p>{copy}</p></article>' for title,copy in p['sectors'])
    problems=''.join(f'<article class="problem-pair"><div><span>Kendala yang sering muncul</span><h3>{problem}</h3></div><div><span>Dengan {p["name"]}</span><p>{solution}</p></div></article>' for problem,solution in p['problems'])
    features=''.join(f'<li>{feature}</li>' for feature in p['features'])
    board=''.join(f'<div class="service-flow-row"><span>{i:02}</span><strong>{text}</strong></div>' for i,text in enumerate(p['board'],1))
    page_head=re.sub(r'<title>.*?</title>',f'<title>{p["name"]} — Rasio Labs</title>',head)
    
    html=f'''{page_head}<body class="service-page service-page-{kind}">
<a class="skip-link" href="#main-content">Lewati ke konten utama</a>{header}
<main id="main-content">
<section class="service-hero"><div class="shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/#solusi">Layanan</a><span>/</span><span aria-current="page">{p['name']}</span></nav>
<div class="service-hero-grid"><div><p class="eyebrow">{p['name']} / {p['label']}</p><h1>{p['title']}</h1><p class="service-intro">{p['intro']}</p><div class="service-actions">{actions}</div><p class="service-caption">{p['note']}</p></div>
<aside class="service-flow-board"><span class="board-label">DIRANCANG UNTUK BISNIS ANDA</span><h2>{p['board_title']}</h2>{board}<p>{p['board_note']}</p></aside></div></div></section>
<section class="sector-section"><div class="shell"><div class="detail-heading"><p class="eyebrow">01 / Cocok untuk siapa?</p><h2>Temukan penerapan {p['name']}<br /><mark class="marker">untuk bidang bisnis Anda.</mark></h2><p>Lihat contoh kebutuhan dari berbagai bidang usaha untuk memahami penerapan layanan ini pada bisnis Anda.</p></div><div class="sector-grid">{sectors}</div></div></section>
<section class="problem-section"><div class="shell"><div class="detail-heading"><p class="eyebrow">02 / Masalah & solusi</p><h2>Atasi kendala bisnis dengan<br />fitur yang memang Anda perlukan.</h2></div><div class="problem-list">{problems}</div></div></section>
<section class="detail-included"><div class="shell detail-included-grid"><div><p class="eyebrow">03 / Cakupan layanan</p><h2>{p['manage_title']}</h2><p>{p['manage']}</p></div><div class="detail-feature-card"><h3>Yang disiapkan untuk Anda</h3><ul class="benefit-checklist">{features}</ul><a class="secondary-button" href="/#harga">Lihat skema harga</a></div></div></section>
<section class="detail-closing shell"><div><p class="eyebrow">Mulai bersama Rasio Labs</p><h2>Diskusikan kebutuhan website dan fitur yang diperlukan bisnis Anda.</h2></div><div><p>Konsultasikan kebutuhan Anda atau mulai dengan mencari nama domain.</p><div class="service-actions">{actions}</div></div></section>
</main>{footer}<script src="/navigation.js?v=15"></script></body></html>'''
    (root / f'dist/layanan-{kind}.html').write_text(html,encoding='utf-8')
print('Generated three service detail pages.')
