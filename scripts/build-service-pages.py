from pathlib import Path
import re
from urllib.parse import quote

root = Path(__file__).resolve().parents[1]
home = (root / 'dist/index.html').read_text(encoding='utf-8')
head = home.split('<body>')[0]
header = re.search(r'<header[\s\S]*?</header>', home).group()
footer = re.search(r'<footer[\s\S]*?</footer>', home).group()
header = header.replace('href="#', 'href="/#')
footer = footer.replace('href="#', 'href="/#')

products = {
    'store': {
        'name': 'Rasio Store', 'label': 'Toko online siap pakai',
        'title': 'Toko Anda.<br /><mark class="marker">Aturan main Anda.</mark>',
        'intro': 'Bawa pelanggan ke toko milik brand Anda. Produk, pembayaran, dan pengiriman tersusun dalam satu alur belanja yang mudah diikuti.',
        'board': ['Pelanggan menemukan produk', 'Checkout & pembayaran', 'Pesanan dikirim dan dilacak'],
        'board_title': 'Dari lihat produk, sampai tiba di rumah.',
        'board_note': 'Dashboard toko untuk produk, stok, dan pesanan.',
        'sectors': [('Fashion & aksesori','Koleksi, ukuran, dan variasi produk.'),('Beauty & skincare','Katalog dan informasi tiap produk.'),('Home & living','Furniture, dekorasi, dan peralatan.'),('Makanan kemasan','Produk siap kirim dan paket bundling.'),('Hobi & lifestyle','Koleksi khusus dengan pelanggan loyal.')],
        'problems': [('Pesanan tersebar di banyak chat.','Checkout menyatukan detail belanja, pembayaran, dan pesanan.'),('Pertanyaan ongkir datang berulang.','Pembeli dapat melihat ongkir dan mengikuti status pengiriman.'),('Brand sulit dikenali saat berbelanja.','Domain dan tampilan toko membawa identitas bisnis Anda sendiri.')],
        'features': ['Template dengan logo, warna, dan produk Anda','Payment gateway, cek ongkir, resi, dan tracking','Dashboard produk, stok, dan pesanan','AI chatbot untuk pertanyaan pelanggan','Domain, hosting, SSL, dan 1 email bisnis','Rasio AI Insight tersedia sebagai add-on'],
        'manage_title':'Anda pegang kendali toko.',
        'manage':'Tim Rasio membantu setup awal. Setelah aktif, Anda mengelola produk dan pesanan melalui dashboard toko. Rasio menangani maintenance teknis sesuai paket.',
        'note':'Berlangganan tahunan. Rasio tidak mengambil komisi penjualan; biaya transaksi dan pengiriman tetap berlaku sesuai penggunaan.',
    },
    'profile': {
        'name':'Rasio Profile', 'label':'Company profile & landing page',
        'title':'Kesan pertama yang<br /><mark class="marker">meyakinkan.</mark>',
        'intro':'Jelaskan siapa Anda, apa yang Anda tawarkan, dan mengapa pelanggan perlu percaya. Tim Rasio menyiapkan sekaligus mengelola seluruh konten website Anda.',
        'board':['Kenalkan identitas bisnis','Tampilkan layanan & karya','Arahkan calon pelanggan menghubungi Anda'],
        'board_title':'Bisnis Anda, dijelaskan dengan baik.',
        'board_note':'Anda kirim materi. Tim Rasio merapikan kontennya.',
        'sectors':[('Konsultan & jasa','Layanan, keahlian, dan cara menghubungi.'),('Properti & konstruksi','Portofolio proyek dan profil tim.'),('Pendidikan & kursus','Program, fasilitas, dan pendaftaran.'),('Manufaktur & B2B','Kapabilitas, katalog, dan profil perusahaan.'),('Hospitality & kreatif','Pengalaman, karya, dan identitas bisnis.')],
        'problems':[('Calon pelanggan sulit memahami layanan.','Susun profil, layanan, dan portofolio dalam halaman yang jelas.'),('Materi bisnis tersebar di banyak dokumen.','Satukan informasi penting di satu alamat yang mudah dibagikan.'),('Tim tidak punya waktu mengedit website.','Kirim materi atau revisi. Seluruh pengeditan konten ditangani Rasio.')],
        'features':['Template company profile atau landing page','Logo, warna, teks, dan foto sesuai bisnis','Formulir calon pelanggan dan tautan kontak','AI chatbot berdasarkan informasi bisnis','Domain, hosting, SSL, dan 1 email bisnis','Setup dan perubahan konten oleh tim Rasio'],
        'manage_title':'Fokus pada bisnis. Kontennya kami urus.',
        'manage':'Anda mengirim logo, teks, foto, dan permintaan perubahan melalui kanal Rasio. Tim kami mengedit konten, menyiapkan preview, lalu meminta review Anda. Cakupan revisi mengikuti paket yang disepakati.',
        'note':'Berlangganan tahunan dengan pengelolaan konten oleh Rasio.',
    },
    'custom': {
        'name':'Rasio Custom', 'label':'Website & software sesuai kebutuhan',
        'title':'Cara kerja unik.<br /><mark class="marker">Sistem yang mengikuti.</mark>',
        'intro':'Punya alur yang lebih spesifik dari template? Kita mulai dari kebutuhan bisnis, lalu merancang website, software, dan integrasi yang memang Anda perlukan.',
        'board':['Petakan kebutuhan & prioritas','Sepakati ruang lingkup proyek','Bangun, uji, dan terapkan'],
        'board_title':'Dibangun dari cara kerja Anda.',
        'board_note':'Estimasi dan penawaran setelah konsultasi.',
        'sectors':[('Marketplace multivendor','Alur seller, katalog, dan transaksi.'),('Distribusi & logistik','Pesanan, stok, dan alur operasional.'),('Layanan & reservasi','Jadwal, pemesanan, dan administrasi.'),('Pendidikan & komunitas','Portal anggota dan akses bertingkat.'),('Operasional perusahaan','Persetujuan, laporan, dan integrasi sistem.')],
        'problems':[('Template tidak cocok dengan alur bisnis.','Rancang fitur dan pengalaman pengguna berdasarkan kebutuhan nyata.'),('Data dipindahkan manual antarsistem.','Hubungkan sistem melalui integrasi dan automasi yang disepakati.'),('Kebutuhan melebar tanpa prioritas.','Tentukan fitur inti, tahapan pengerjaan, dan cakupan sebelum pembangunan.')],
        'features':['Riset kebutuhan dan perancangan alur','Desain serta pengembangan khusus','Multivendor, portal, atau software internal','Integrasi API, automasi, dan AI sesuai scope','Pengujian, review, dan persiapan peluncuran','Maintenance dan pengelolaan sesuai kesepakatan'],
        'manage_title':'Mulai dari percakapan yang tepat.',
        'manage':'Ceritakan tujuan, alur kerja, fitur utama, dan target waktu. Rasio menyusun cakupan serta penawaran sebelum pembangunan. Pemilihan domain dapat dipersiapkan terlebih dahulu; pembayaran proyek mengikuti penawaran yang disetujui.',
        'note':'Harga ditentukan setelah konsultasi. Pemilihan domain tidak otomatis menjadi pembelian atau kontrak pengerjaan.',
    },
}

for kind,p in products.items():
    wa = 'https://wa.me/60142317052?text=' + quote('Halo Rasio, saya ingin konsultasi gratis tentang ' + p['name'] + '.')
    actions=f'<a class="button" href="{wa}" target="_blank" rel="noopener">Konsultasi Gratis</a><a class="secondary-button" href="/order.html?type={kind}">Cari Domain Anda</a>'
    sectors=''.join(f'<article class="sector-card"><span aria-hidden="true">{i:02}</span><h3>{title}</h3><p>{copy}</p></article>' for i,(title,copy) in enumerate(p['sectors'],1))
    problems=''.join(f'<article class="problem-pair"><div><span>Kendala yang sering muncul</span><h3>{problem}</h3></div><div><span>Dengan {p["name"]}</span><p>{solution}</p></div></article>' for problem,solution in p['problems'])
    features=''.join(f'<li>{feature}</li>' for feature in p['features'])
    board=''.join(f'<div class="service-flow-row"><span>{i:02}</span><strong>{text}</strong></div>' for i,text in enumerate(p['board'],1))
    page_head=re.sub(r'<title>.*?</title>',f'<title>{p["name"]} — Rasio Agency</title>',head)
    
    html=f'''{page_head}<body class="service-page service-page-{kind}">
<a class="skip-link" href="#main-content">Lewati ke konten utama</a>{header}
<main id="main-content">
<section class="service-hero"><div class="shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Beranda</a><span>/</span><a href="/#solusi">Layanan</a><span>/</span><span aria-current="page">{p['name']}</span></nav>
<div class="service-hero-grid"><div><p class="eyebrow">{p['name']} / {p['label']}</p><h1>{p['title']}</h1><p class="service-intro">{p['intro']}</p><div class="service-actions">{actions}</div><p class="service-caption">{p['note']}</p></div>
<aside class="service-flow-board"><span class="board-label">DIRANCANG UNTUK BISNIS ANDA</span><h2>{p['board_title']}</h2>{board}<p>{p['board_note']}</p></aside></div></div></section>
<section class="sector-section"><div class="shell"><div class="detail-heading"><p class="eyebrow">01 / Cocok untuk siapa?</p><h2>Beragam sektor.<br /><mark class="marker">Kebutuhan yang relevan.</mark></h2><p>Beberapa contoh bisnis yang dapat menggunakan {p['name']}.</p></div><div class="sector-grid">{sectors}</div></div></section>
<section class="problem-section"><div class="shell"><div class="detail-heading"><p class="eyebrow">02 / Masalah & solusi</p><h2>Ada kebutuhan.<br />Ada cara yang lebih baik.</h2></div><div class="problem-list">{problems}</div></div></section>
<section class="detail-included"><div class="shell detail-included-grid"><div><p class="eyebrow">03 / Cakupan layanan</p><h2>{p['manage_title']}</h2><p>{p['manage']}</p></div><div class="detail-feature-card"><h3>Yang disiapkan untuk Anda</h3><ul class="benefit-checklist">{features}</ul><a class="secondary-button" href="/#harga">Lihat skema harga</a></div></div></section>
<section class="detail-closing shell"><div><p class="eyebrow">Mulai bersama Rasio</p><h2>Siapkan langkah<br />berikutnya.</h2></div><div><p>Konsultasikan kebutuhan Anda atau mulai dengan mencari nama domain.</p><div class="service-actions">{actions}</div></div></section>
</main>{footer}<script src="/navigation.js?v=4.1"></script></body></html>'''
    (root / f'dist/layanan-{kind}.html').write_text(html,encoding='utf-8')
print('Generated three service detail pages.')
