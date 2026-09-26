"""Build the Rasio journal and homepage selection from reviewed article data."""
from pathlib import Path
from html import escape
import json
import re

root = Path(__file__).resolve().parents[1]
dist = root/'dist'
news = json.loads((root/'content/blog-news.json').read_text(encoding='utf-8'))
guides = json.loads((root/'content/blog-guides.json').read_text(encoding='utf-8'))
news.sort(key=lambda a: a['date'], reverse=True)
articles = news + guides
home = (dist/'index.html').read_text(encoding='utf-8')
home = re.sub(r'/blog.css\?v=\d+', '/blog.css?v=17', home)
if '/blog.css?' not in home:
    home = home.replace('</head>', '<link rel="stylesheet" href="/blog.css?v=17" /></head>')
head = home.split('<body>')[0]
header = re.search(r'<header[\s\S]*?</header>', home)[0].replace('href="#', 'href="/#')
footer = re.search(r'<footer[\s\S]*?</footer>', home)[0].replace('href="#', 'href="/#')
header = header.replace('<a href="/blog.html">Blog</a>', '<a href="/blog.html" aria-current="page">Blog</a>')
e = escape

def card(a):
    meta = f'<time datetime="{a["date"]}">{e(a["date_label"])}</time>' if a['kind']=='news' else '<span>Panduan praktis</span>'
    return f'''<article class="blog-card" data-blog-category="{a['filter']}"><div class="blog-card-photo"><img src="/assets/{a['image']}" width="1200" height="800" alt="{e(a['alt'], quote=True)}" loading="lazy" /><span class="blog-kind">{'Berita' if a['kind']=='news' else 'Panduan'}</span></div><div class="blog-card-content"><div class="blog-card-top"><span>{e(a['category'])}</span>{meta}</div><h3><a href="/blog-{a['slug']}.html">{e(a['title'])}</a></h3><p>{e(a['excerpt'])}</p><span class="blog-read" aria-hidden="true">Baca artikel <span>↗</span></span></div></article>'''

def page(slug, title, description, body, script=''):
    h = re.sub(r'<title>.*?</title>', f'<title>{e(title)} — Rasio Agency</title>', head)
    h = re.sub(r'<meta\s+name="description"\s+content="[^"]*"\s*/>', f'<meta name="description" content="{e(description, quote=True)}" />', h)
    (dist/f'{slug}.html').write_text(h+'<body class="blog-page"><a class="skip-link" href="#main-content">Lewati ke konten utama</a>'+header+'<main id="main-content">'+body+'</main>'+footer+'<script src="/navigation.js?v=15"></script>'+script+'</body></html>', encoding='utf-8')

filters = [('all','Semua artikel'),('website','Website & SEO'),('bisnis','Bisnis & UMKM'),('ai','AI untuk bisnis'),('panduan','Panduan')]
filter_html = ''.join(f'<button type="button" data-blog-filter="{key}" aria-pressed="{str(key=="all").lower()}">{e(label)}</button>' for key,label in filters)
cards = ''.join(card(a) for a in articles)
page('blog', 'Berita dan insight bisnis digital', 'Berita website, e-commerce, dan AI dari sumber resmi, beserta panduan praktis untuk bisnis Anda.', f'''<section class="blog-hero shell"><p class="eyebrow">Jurnal Rasio Agency</p><h1>Ikuti perkembangan digital yang <mark class="marker">relevan untuk bisnis Anda.</mark></h1><p>Berita website, e-commerce, dan AI, dengan penjelasan tentang hal yang perlu diperhatikan pemilik bisnis serta panduan untuk menerapkannya.</p><p class="blog-edition">Pilihan berita diperiksa pada 26 September 2026</p></section><section class="shell blog-library" aria-labelledby="articles-title"><div class="blog-library-heading"><h2 id="articles-title">Berita & panduan bisnis digital</h2><span data-blog-count role="status" aria-live="polite">{len(articles)} artikel</span></div><div class="blog-filters" role="group" aria-label="Filter topik artikel">{filter_html}</div><div class="blog-grid">{cards}</div></section><section class="shell blog-help"><div><h2>Siapkan website untuk kebutuhan bisnis Anda berikutnya.</h2><p>Diskusikan halaman, fitur toko, atau alur kerja yang ingin Anda perbaiki bersama tim Rasio.</p></div><a class="button" href="https://wa.me/60142317052?text=Halo%20Rasio%2C%20saya%20ingin%20konsultasi%20kebutuhan%20website." target="_blank" rel="noopener">Konsultasi Gratis ↗</a></section>''', '<script src="/blog.js?v=17"></script>')

for a in articles:
    toc = ''.join(f'<a href="#bagian-{i}"><span>0{i}</span>{e(title)}</a>' for i,(title,_) in enumerate(a['sections'],1))
    body = ''
    for i,(title,copy) in enumerate(a['sections'],1):
        citation = ''
        if i in a.get('source_sections',[]):
            source = a['sources'][0]
            citation = f'<a class="article-inline-source" href="{e(source["url"], quote=True)}" target="_blank" rel="noopener">Baca pengumuman resmi ↗</a>'
        body += f'<section id="bagian-{i}"><h2>{e(title)}</h2><p>{e(copy)}</p>{citation}</section>'
    meta = '<span>Panduan praktis</span>'
    sources = ''
    if a['kind']=='news':
        meta = f'<span>{e(a["date_context"])}</span><time datetime="{a["date"]}">{e(a["date_label"])}</time>'
        source_list = ''.join(f'<li><a href="{e(s["url"], quote=True)}" target="_blank" rel="noopener">{e(s["label"])} ↗</a><span>{e(s["date"])}</span></li>' for s in a['sources'])
        sources = f'<section class="article-sources" aria-labelledby="sources-title"><h2 id="sources-title">Sumber berita</h2><ul>{source_list}</ul><p>Ringkasan diperiksa pada <time datetime="{a["reviewed"]}">26 September 2026</time>. Catatan Rasio merupakan interpretasi editorial yang dipisahkan dari pengumuman penyedia.</p></section>'
    related_pool = news if a['kind']=='news' else guides
    related = ''.join(card(other) for other in related_pool if other['slug']!=a['slug'])
    cta_url = '/layanan-'+a['service']+'.html' if a.get('service') else '/#solusi'
    cta = a.get('service_cta','Lihat layanan Rasio')
    page('blog-'+a['slug'], a['title'], a['excerpt'], f'''<article><header class="article-header shell"><a class="article-back" href="/blog.html">← Kembali ke Blog</a><p class="eyebrow">{e(a['category'])}</p><h1>{e(a['title'])}</h1><p>{e(a['excerpt'])}</p><div class="article-meta">{meta}</div></header><figure class="article-cover shell"><img src="/assets/{a['image']}" width="1200" height="800" alt="{e(a['alt'], quote=True)}" fetchpriority="high" /><figcaption>Foto ilustrasi aktivitas bisnis.</figcaption></figure><div class="shell article-layout"><aside class="article-toc"><strong>Di dalam artikel ini</strong><nav aria-label="Daftar isi artikel">{toc}</nav></aside><div class="article-body">{body}{sources}<div class="article-next"><p>Pelajari layanan yang dapat membantu Anda menyiapkan website dan pengelolaan bisnis.</p><a class="secondary-button" href="{cta_url}">{e(cta)} ↗</a></div></div></div></article><section class="shell blog-related" aria-labelledby="related-title"><h2 id="related-title">Bacaan lain untuk bisnis Anda</h2><div class="blog-grid">{related}</div></section>''')

preview = f'''<!-- blog-preview:start --><section class="blog-home" id="blog" aria-labelledby="blog-title"><div class="shell"><div class="section-heading blog-heading"><div><p class="eyebrow">Jurnal Rasio / Berita & insight</p><h2 id="blog-title">Ikuti perkembangan digital yang <mark class="marker">memengaruhi bisnis Anda.</mark></h2><p class="blog-section-intro">Baca kabar terbaru tentang website, e-commerce, dan AI, beserta hal yang perlu Anda perhatikan sebagai pemilik bisnis.</p></div><a class="secondary-button" href="/blog.html">Lihat semua artikel ↗</a></div><div class="blog-grid">{''.join(card(a) for a in news[:3])}</div></div></section><!-- blog-preview:end -->'''
if '<!-- blog-preview:start -->' in home:
    home = re.sub(r'<!-- blog-preview:start -->[\s\S]*?<!-- blog-preview:end -->', preview, home)
else:
    home = home.replace('    </main>', preview+'\n    </main>')
(dist/'index.html').write_text(home, encoding='utf-8')
print(f'Built Blog, {len(news)} news articles, {len(guides)} guides, and homepage previews.')
