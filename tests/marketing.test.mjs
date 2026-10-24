import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {profilePlans,productionGate} from '../server/policy-v4.mjs';
import {templates} from '../frontend/marketing/content.mjs';
import {sectionOrder} from '../frontend/marketing/homepage.mjs';
import {pricingView} from '../dist/marketing/pricing.js';
import {resolvePreviewPath} from '../scripts/preview-homepage.mjs';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=await readFile(path.join(project,'dist/index.html'),'utf8');

test('homepage preserves the one approved template destination with explicit buttons',()=>{
  assert.deepEqual(templates.map(t=>t.slug),['padel']);
  assert.equal((html.match(/class="template-card"/g)||[]).length,1);
  assert.match(html,/<select name="sector" aria-label="Sektor">/);
  for(const t of templates){
    assert.ok(html.includes(`aria-label="Lihat template ${t.name.replaceAll('&','&amp;')}"`));
    assert.ok(html.includes(`aria-label="Pilih template ${t.name.replaceAll('&','&amp;')}"`));
    assert.ok(html.includes(`href="checkout-v4.html?type=profile&amp;template=${t.id}&amp;duration=48"`));
    assert.ok(html.includes(`href="template-${t.slug}.html?type=profile&amp;template=${t.id}&amp;duration=48"`));
  }
  assert.match(html,/data-load-templates aria-controls="template-grid" hidden>Muat lebih banyak/);
});

test('homepage order follows revision; dashboard and interactive AI are absent',()=>{
  const positions=sectionOrder.map(id=>html.indexOf(`id="${id}"`));
  assert.ok(positions.every((p,i)=>p>=0&&(!i||p>positions[i-1])));
  assert.doesNotMatch(html,/dashboard-preview|Coba pratinjau dashboard|ai-tabs|data-ai-demo/);
  const ai=html.slice(html.indexOf('id="rasio-ai"'),html.indexOf('id="harga"'));
  assert.equal((ai.match(/class="ai-feature"/g)||[]).length,3);
  assert.doesNotMatch(ai,/<button|role="tab"/);
  assert.match(ai,/AI Chatbot Termasuk/);
});

test('service panels contain product visuals and include chatbot in every service',()=>{
  for(const name of ['profile','store','custom']){
    const panel=html.split(`id="product-${name}"`)[1].split('<div class="product-panel')[0].split('</section>')[0];
    assert.match(panel,/AI Chatbot/);
    assert.doesNotMatch(panel,/person|portrait|meeting|woman|man-working/);
  }
  assert.match(html,/marketing\/hero\/architecture\.jpg/);
});

test('displayed prices use exact approved values and correctly distinguish domain eligibility',()=>{
  const expected=[[1,109000,109000,false],[12,54500,654000,true],[24,32000,768000,true],[48,27750,1332000,true]];
  assert.deepEqual(profilePlans.map(p=>[p.months,p.monthlyEquivalent,p.totalPrice,p.freeDomainFirstYear]),expected);
  for(const [months,monthly,total,domain] of expected){
    const v=pricingView(months);
    assert.equal(v.monthly,'Rp'+monthly.toLocaleString('id-ID'));
    assert.equal(v.total,'Rp'+total.toLocaleString('id-ID'));
    assert.equal(v.saving,109000*months-total);
    assert.equal(v.domain,domain);
  }
  assert.doesNotMatch(html,/27\.250|1\.308\.000/);
  assert.match(html,/0% biaya transaksi dari RasioLabs/);
  assert.match(html,/Produk tanpa batas/);
  assert.doesNotMatch(html,/belum menerima pesanan|Pemesanan belum dibuka|Penghematan dibanding tarif|Rp499\.000|Rp249\.000|Rp224\.000|Rp199\.000/);
});

test('all homepage links, anchors, scripts, styles and images resolve locally',async()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'duplicate IDs');
  const references=[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
  for(const ref of new Set(references)){
    if(ref.startsWith('#')){assert.ok(ids.includes(ref.slice(1)),ref);continue;}
    if(/^https?:/.test(ref))continue;
    const url=new URL(ref,'http://localhost/rasio-web/dist/index.html');
    assert.ok((await stat(resolvePreviewPath(url.href))).isFile(),ref);
  }
});

test('preview maps existing template subpages and rejects sensitive/outside paths',()=>{
  assert.match(resolvePreviewPath('/template-padel/play'),/template-padel-play\.html$/);
  for(const url of ['/server/worker.mjs','/.dev.vars','/assets/%2e%2e%5c%2e%2e%5cpackage.json','/missing.txt'])assert.throws(()=>resolvePreviewPath(url));
});

test('marketing policy summaries contain no internal review labels and do not open production',async()=>{
  const files=['policies','terms','domain-policy','renewal-policy','cancellation-policy','ownership-policy'];
  for(const file of files){
    const page=await readFile(path.join(project,'dist',file+'.html'),'utf8');
    assert.doesNotMatch(page,/Draf|review bisnis|tinjauan hukum|Status review|PENDING|CONFIRMED/);
    assert.doesNotMatch(page,/Pemesanan belum dibuka/);
  }
  assert.equal(Object.values(productionGate).some(value=>value===true),false);
});

test('animation rules include reduced-motion and no homepage dashboard code',async()=>{
  const files=['components.css','homepage.css','products.css'];
  for(const file of files){
    const css=await readFile(path.join(project,'frontend/marketing/styles',file),'utf8');
    assert.match(css,/prefers-reduced-motion: reduce/);
    assert.doesNotMatch(css,/dashboard-preview|dashboard-shell|ai-tabs|ai-demo-panel/);
  }
});

test('core text and interactive palette passes AA text contrast',()=>{
  const luminance=hex=>hex.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  for(const [fg,bg] of [['142640','ffffff'],['52627a','edf3ff'],['52627a','f5f3ee'],['52627a','e3edff'],['ffffff','1454ed'],['ffffff','103db2'],['bccbe2','1a2c49'],['13754e','ffffff'],['174ea0','e0ebff'],['ffffff','146b49'],['ffffff','10583c'],['c3d2e8','223957']]){
    const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    assert.ok(ratio>=4.5,`${fg}/${bg}: ${ratio}`);
  }
});
