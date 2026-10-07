import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, defaultsFor, contentWithDefaults, pricing, validateOrder, validateContent, imageMime } from '../server/model.mjs';
import { profileTemplates } from '../server/profile-templates.mjs';

const checkout = {
  service: 'profile', template: 'Architecture', duration: 24, consent: true,
  businessName: 'Studio Contoh', customerName: 'Pemilik Studio',
  whatsapp: '+62 812-3456-7890', email: 'owner@example.test', domain: 'studio-contoh.co.id'
};

test('angka contoh template tidak menjadi klaim di website klien baru', () => {
  for (const template of Object.keys(profileTemplates)) {
    const content = defaultsFor(template);
    assert.equal(content.statisticsVisible, false, template);
    for (let index = 1; index <= 3; index++) {
      assert.equal(content['stat' + index + 'Value'], '', template);
    }
  }
});

test('harga yang disepakati berlaku untuk setiap durasi dan tarif perpanjangan', () => {
  assert.deepEqual([1, 12, 24, 48].map(pricing), [
    { monthly: 109000, total: 109000, renewalMonthly: 87200 },
    { monthly: 54500, total: 654000, renewalMonthly: 87200 },
    { monthly: 32700, total: 784800, renewalMonthly: 87200 },
    { monthly: 27250, total: 1308000, renewalMonthly: 87200 }
  ]);
  for (const duration of [0, 2, 36, -12, NaN, '24']) {
    assert.throws(() => pricing(duration));
  }
});

test('checkout mewajibkan email akses login dan menormalkan data tanpa menerima harga dari klien', () => {
  const result = validateOrder({ ...checkout, businessName: '  Studio Contoh  ', domain: 'STUDIO-CONTOH.CO.ID', total: 1, monthly: 1, paymentStatus: 'verified' });
  assert.equal(result.businessName, 'Studio Contoh');
  assert.equal(result.domain, 'studio-contoh.co.id');
  assert.equal(result.email, 'owner@example.test');
  assert.throws(()=>validateOrder({...checkout,email:''}));
  assert.equal(Object.hasOwn(result, 'total'), false);
  assert.equal(Object.hasOwn(result, 'paymentStatus'), false);
});

test('checkout menolak layanan atau template yang belum tersedia, domain rusak dan persetujuan kosong', () => {
  for (const change of [
    { service: 'store' }, { template: 'unknown' }, { consent: false },
    { domain: '-studio.com' }, { domain: 'studio-.com' }, { domain: 'studio' },
    { domain: 'studio.com/path' }, { domain: 'studio..com' }, { duration: 6 },
    { businessName: '' }, { whatsapp: 'hello 12345678' },
    { whatsapp: '+1234567890123456' }, { email: 'owner@example' }
  ]) assert.throws(() => validateOrder({ ...checkout, ...change }), JSON.stringify(change));
});

test('CMS hanya menerima bidang konten; URL eksternal dan perubahan struktur tidak diterima', () => {
  const content = validateContent({ ...defaults, heroTitle: '<script>alert(1)</script>', injectedStyle: 'display:none' });
  assert.equal(content.heroTitle, '<script>alert(1)</script>');
  assert.equal(Object.hasOwn(content, 'injectedStyle'), false);
  for (const image of ['https://example.com/photo.jpg', 'javascript:alert(1)', '/assets/../secret', '/media/not-an-id']) {
    assert.throws(() => validateContent({ ...defaults, heroImage: image }));
  }
  assert.throws(() => validateContent({ ...defaults, heroTitle: '' }));
  assert.throws(() => validateContent({ ...defaults, aboutLead: 'x'.repeat(801) }));
});

test('template Profile memakai konten dan menu sendiri tanpa mengubah harga', () => {
  assert.deepEqual(Object.keys(profileTemplates), ['Architecture', 'Padel', 'Creative', 'Consulting']);
  for (const template of Object.keys(profileTemplates)) {
    const order = validateOrder({ ...checkout, template });
    assert.equal(order.template, template);
    assert.deepEqual(pricing(order.duration), pricing(checkout.duration));
    const content = defaultsFor(template);
    assert.deepEqual(validateContent(content, template), content);
    const legacy = { ...content, heroTitle: 'Konten milik klien' };
    for (const key of Object.keys(legacy)) if (key.startsWith('nav')) delete legacy[key];
    assert.equal(contentWithDefaults(legacy, template).nav1Label, content.nav1Label);
    assert.equal(validateContent(legacy, template).nav1Target, content.nav1Target);
    assert.equal(contentWithDefaults(legacy, template).heroTitle, 'Konten milik klien');
  }
  for (const template of [null, {}, ['Padel'], '__proto__', 'Padel ']) {
    assert.throws(() => validateOrder({ ...checkout, template }));
    assert.throws(() => defaultsFor(template));
  }
});

test('unggahan memakai tanda tangan file, bukan nama ekstensi', () => {
  assert.equal(imageMime(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0])), 'image/png');
  assert.equal(imageMime(Uint8Array.from([255, 216, 255, 224, 0, 0, 0, 0])), 'image/jpeg');
  assert.equal(imageMime(new TextEncoder().encode('RIFF1234WEBPdata')), 'image/webp');
  assert.equal(imageMime(new TextEncoder().encode('<svg onload="alert(1)">')), null);
  assert.equal(imageMime(new Uint8Array(0)), null);
});

test('navbar lama mendapatkan default dan hanya menerima menu dari bagian yang tersedia',()=>{
  const legacy={...defaults};for(const key of Object.keys(legacy))if(key.startsWith('nav'))delete legacy[key];
  const restored=validateContent(legacy);
  assert.equal(restored.nav1Label,'Our work');assert.equal(restored.nav1Target,'work');assert.equal(restored.navCtaVisible,true);
  const edited=validateContent({...defaults,nav1Label:'Tentang Kami',nav1Target:'studio',nav2Visible:false,navCtaLabel:'Chat WhatsApp',whatsapp:'+60 142317052'});
  assert.equal(edited.nav1Target,'studio');assert.equal(edited.nav2Visible,false);assert.equal(edited.navCtaLabel,'Chat WhatsApp');
  for(const change of [{nav1Target:'https://example.com'},{nav1Target:'javascript:alert(1)'},{nav1Target:'missing'},{nav2Visible:'false'},{navCtaVisible:0},{nav1Label:''},{nav1Label:'x'.repeat(25)},{navCtaLabel:''}])assert.throws(()=>validateContent({...defaults,...change}));
  assert.equal(validateContent({...defaults,nav1Visible:false,nav1Label:''}).nav1Label,'');
});
