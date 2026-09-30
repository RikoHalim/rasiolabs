import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../dist/portal.js', import.meta.url), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));

async function portal({ mode, sessionRole, accessRole, search = '', hash = '', invalidCode = false }) {
  let submit;
  const redirects = [], requests = [], cleared = [];
  const button = { disabled: false,addEventListener(){} };
  const toast = { hidden: true, textContent: '', classList: { toggle() {} } };
  const form = { addEventListener(name, handler) { if (name === 'submit') submit = handler; } };
  const app = { innerHTML: '', querySelector(selector) { return selector === 'form' ? form : button; } };
  const location = { pathname: mode === 'admin' ? '/admin' : '/cms', search, hash,
    replace(url) { redirects.push(url); } };
  runInNewContext(source, {
    document: { body: { dataset: { portal: mode } }, querySelector(selector) {
      if (selector === '#app') return app;
      if (selector === '#toast') return toast;
      if (selector === '#client-username') return {value:'client-test'};
      if (selector === '#client-password') return {value:'Password-test-2026!'};
      if (selector === '#access-code') return { value: 'A'.repeat(43) };
      throw new Error(`Unexpected selector: ${selector}`);
    } },
    window: { addEventListener() {} }, location, URLSearchParams, Blob,
    history: { replaceState(_state, _title, url) { cleared.push(url); location.hash = ''; } },
    setTimeout() { return 1; }, clearTimeout() {},
    fetch: async path => {
      requests.push(path);
      const isAccess = path === '/api/access'||path === '/api/auth/login';
      const role = isAccess ? accessRole : sessionRole;
      return { ok: Boolean(role) && !(isAccess && invalidCode), status: role && !(isAccess && invalidCode) ? 200 : 401,
        json: async () => role && !(isAccess && invalidCode) ? { role, csrf: 'test-csrf' } : { error: 'Kode akses tidak valid.' } };
    },
  });
  await tick();
  return { redirects, requests, cleared, toast, app, async login() {
    assert.ok(submit, 'Login form must be usable');
    await submit({ preventDefault() {}, target: { querySelector() { return button; } } });
    await tick();
  } };
}

test('login klien menggunakan endpoint username dan password', async () => {
  const p = await portal({ mode: 'client', accessRole: 'client' });
  await p.login();
  assert.ok(p.requests.includes('/api/auth/login'));
  assert.deepEqual(p.redirects, []);
});

test('sesi tersimpan diarahkan sesuai peran pada kedua halaman', async () => {
  const admin = await portal({ mode: 'client', sessionRole: 'admin' });
  const client = await portal({ mode: 'admin', sessionRole: 'client' });
  assert.deepEqual(admin.redirects, ['/admin']);
  assert.deepEqual(client.redirects, ['/cms']);
  assert.deepEqual(admin.requests, ['/api/session']);
  assert.deepEqual(client.requests, ['/api/session']);
});

test('kode klien pada halaman admin mengarahkan ke CMS', async () => {
  const p = await portal({ mode: 'admin', accessRole: 'client' });
  await p.login();
  assert.deepEqual(p.redirects, ['/cms']);
});

test('tautan undangan pada halaman admin ditebus sekali dan fragment dihapus', async () => {
  const p = await portal({ mode: 'admin', accessRole: 'client', hash: '#akses=' + 'B'.repeat(43) });
  assert.deepEqual(p.requests, ['/api/access']);
  assert.deepEqual(p.redirects, ['/cms']);
  assert.deepEqual(p.cleared, ['/admin']);
});

test('redirect admin hanya mempertahankan ID pesanan valid, bukan URL atau kode akses', async () => {
  const id = 'a6b058e9-7000-4000-8000-123456789abc';
  const good = await portal({ mode: 'client', sessionRole: 'admin', search: `?order=${id}&return=https://example.org` });
  const bad = await portal({ mode: 'client', sessionRole: 'admin', search: '?order=../../api/access&code=secret' });
  const client = await portal({ mode: 'admin', sessionRole: 'client', search: `?order=${id}` });
  assert.deepEqual(good.redirects, [`/admin?order=${id}`]);
  assert.deepEqual(bad.redirects, ['/admin']);
  assert.deepEqual(client.redirects, ['/cms']);
});

test('kode tidak valid tetap di form login dan mempertahankan pesan API', async () => {
  const p = await portal({ mode: 'client', accessRole: 'admin', invalidCode: true });
  await p.login();
  assert.deepEqual(p.redirects, []);
  assert.equal(p.toast.textContent, 'Kode akses tidak valid.');
  assert.equal(p.toast.hidden, false);
});
