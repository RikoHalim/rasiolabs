import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, pricing, validateOrder, validateContent, imageMime } from '../server/model.mjs';

const checkout = {
  service: 'profile', template: 'Architecture', duration: 24, consent: true,
  businessName: 'Studio Contoh', customerName: 'Pemilik Studio',
  whatsapp: '+62 812-3456-7890', email: '', domain: 'studio-contoh.co.id'
};

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

test('checkout menerima email kosong dan menormalkan data tanpa menerima harga dari klien', () => {
  const result = validateOrder({ ...checkout, businessName: '  Studio Contoh  ', domain: 'STUDIO-CONTOH.CO.ID', total: 1, monthly: 1, paymentStatus: 'verified' });
  assert.equal(result.businessName, 'Studio Contoh');
  assert.equal(result.domain, 'studio-contoh.co.id');
  assert.equal(result.email, '');
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

test('unggahan memakai tanda tangan file, bukan nama ekstensi', () => {
  assert.equal(imageMime(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0])), 'image/png');
  assert.equal(imageMime(Uint8Array.from([255, 216, 255, 224, 0, 0, 0, 0])), 'image/jpeg');
  assert.equal(imageMime(new TextEncoder().encode('RIFF1234WEBPdata')), 'image/webp');
  assert.equal(imageMime(new TextEncoder().encode('<svg onload="alert(1)">')), null);
  assert.equal(imageMime(new Uint8Array(0)), null);
});
