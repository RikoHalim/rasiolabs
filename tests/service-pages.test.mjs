import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {getPlan, profilePlans, storePlans, storeScope} from '../server/policy-v4.mjs';
import {templateCatalog} from '../server/template-catalog.mjs';
import {readSelection} from '../dist/selection.js';
import {initServiceLinks} from '../dist/marketing/service-links.js';
import {getBuildPaths} from '../scripts/build-paths.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
const {dist,concept}=await getBuildPaths();
const outputs = [
  {dir:dist, home:'index.html'},
  ...(concept?[{dir:concept, home:'index-v3.html'}]:[])
];
const services = ['profile', 'store', 'custom'];
const sections = ['hero', 'why', 'features', 'sectors', 'example', 'scope', 'order', 'pricing', 'faq', 'start'];
const documents = new Map();
for (const output of outputs) {
  output.homeHtml = await readFile(path.join(output.dir, output.home), 'utf8');
  output.pages = new Map(await Promise.all(services.map(async service => {
    const filename = path.join(output.dir, `rasio-${service}.html`);
    const html = await readFile(filename, 'utf8');
    documents.set(filename, html);
    return [service, {filename, html}];
  })));
}

const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, token => ({'&amp;':'&', '&quot;':'"', '&apos;':"'", '&#39;':"'", '&lt;':'<', '&gt;':'>'}[token]));
const attributes = source => Object.fromEntries([...source.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(([, name, a, b, c]) => [name, decode(a ?? b ?? c ?? '')]));
const elements = (source, tag) => [...source.matchAll(new RegExp('<(?:'+tag+')\\b([^>]*)>', 'gi'))].map(match => ({attrs:attributes(match[1]), offset:match.index}));
const contents = (source, tag) => [...source.matchAll(new RegExp('<'+tag+'\\b([^>]*)>([\\s\\S]*?)<\\/'+tag+'>', 'gi'))].map(match => ({attrs:attributes(match[1]), html:match[2], offset:match.index}));
const text = source => decode(source.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const money = value => 'Rp'+value.toLocaleString('id-ID');
const policyOrLogin = pathname => /\/(?:policies|terms|domain-policy|cancellation-policy|renewal-policy|ownership-policy|cms|admin)\.html$/.test(pathname);
const panel = (html, service) => {
  const start = html.indexOf(`id="product-${service}"`);
  assert.ok(start >= 0, service+' panel exists');
  const next = services[services.indexOf(service)+1];
  return html.slice(start, next ? html.indexOf(`id="product-${next}"`, start) : html.indexOf('</section>', start));
};

test('every enabled output contains all three complete service pages in the current visual system', () => {
  for (const output of outputs) for (const [service, {html}] of output.pages) {
    const context = output.home+': '+service;
    assert.match(html, new RegExp('<body[^>]*data-service="'+service+'"'), context);
    assert.equal(elements(html, 'h1').length, 1, context+' has one page title');
    const ids = elements(html, '[a-z][\\w:-]*').map(({attrs}) => attrs.id).filter(Boolean);
    assert.equal(ids.length, new Set(ids).size, context+' has unique IDs');
    const pageSections = contents(html, 'section');
    const expectedSections = sections.filter(name => service !== 'profile' || name !== 'scope');
    assert.deepEqual(pageSections.map(({attrs}) => attrs.id), expectedSections.map(name => 'service-'+name), context+' follows the latest approved section list');
    if (service === 'profile') {
      assert.doesNotMatch(html, /id="service-scope"|Penyesuaian dan batas layanan/, 'the owner removed the dedicated scope section from Profile only');
      assert.match(text(html), /CMS tidak membuka pengeditan bebas terhadap layout atau source code/);
      assert.match(text(html), /Jumlah permintaan tidak dibatasi selama langganan aktif/);
      assert.match(text(html), /Perubahan konten kecil pada struktur yang sudah ada/);
    }
    for (const section of pageSections) {
      assert.ok(text(section.html).length > 25, context+': '+section.attrs.id+' has explanatory content');
      assert.ok(ids.includes(section.attrs['aria-labelledby']), context+': section heading is connected');
    }
    assert.ok(contents(html, 'details').length >= 5, context+' has relevant FAQs');
    assert.match(html, /marketing\/service-page\.js/, context+' loads service interactions');
    for (const stylesheet of ['tokens', 'components', 'homepage', 'products', 'services']) assert.match(html, new RegExp('marketing/'+stylesheet+'\\.css'), context);
    assert.match(html, /fonts\/dm-sans-0\.woff2/);
    assert.doesNotMatch(text(html), /\bdemo\b|belum aktif|coming soon|segera hadir|simulasi|\bdraf\b|review hukum|production gate/i, context+' keeps internal status out of customer copy');
    const header = contents(html, 'header')[0].html;
    for (const destination of services) assert.ok(elements(header, 'a').some(({attrs}) => new URL(attrs.href, 'https://rasio.test/').pathname.endsWith(`/rasio-${destination}.html`)), context+' links to '+destination);
  }
});

test('service page assets, local destinations, fragments, and accessibility references resolve', async () => {
  const checked = new Map();
  for (const {pages} of outputs) for (const {filename, html} of pages.values()) {
    const ids = new Set(elements(html, '[a-z][\\w:-]*').map(({attrs}) => attrs.id).filter(Boolean));
    for (const {attrs} of elements(html, '[a-z][\\w:-]*')) {
      for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby']) for (const id of (attrs[attr] || '').split(/\s+/).filter(Boolean)) assert.ok(ids.has(id), `${filename}: ${attr}=${id}`);
    }
    for (const {attrs} of elements(html, 'img')) {
      assert.ok(Object.hasOwn(attrs, 'alt'), filename+' image has alternative text');
      assert.ok(Number(attrs.width) > 0 && Number(attrs.height) > 0, filename+' image reserves its size');
    }
    const refs = new Set(elements(html, 'a|img|link|script').map(({attrs}) => attrs.href || attrs.src).filter(Boolean));
    for (const ref of refs) {
      assert.notEqual(ref, '#', filename+' has no empty link');
      const target = new URL(ref, pathToFileURL(filename));
      if (target.protocol !== 'file:') continue;
      const targetFile = fileURLToPath(target);
      if (!checked.has(targetFile)) checked.set(targetFile, stat(targetFile));
      assert.ok((await checked.get(targetFile)).isFile(), filename+': '+ref);
      if (target.hash) {
        if (!documents.has(targetFile)) documents.set(targetFile, await readFile(targetFile, 'utf8'));
        assert.ok(elements(documents.get(targetFile), '[a-z][\\w:-]*').some(({attrs}) => attrs.id === decodeURIComponent(target.hash.slice(1))), filename+': missing fragment '+ref);
      }
    }
  }
});

test('Profile and Store present exactly the four official plans with totals and domain terms', () => {
  for (const {pages} of outputs) for (const [service, plans] of [['profile', profilePlans], ['store', storePlans]]) {
    const {html} = pages.get(service);
    const cards = contents(html, 'article').filter(({attrs}) => attrs['data-service-plan']);
    assert.deepEqual(cards.map(({attrs}) => Number(attrs['data-service-plan'])), [1, 12, 24, 48]);
    for (const [index, card] of cards.entries()) {
      const plan = plans[index];
      const price = contents(card.html, 'p').find(({attrs}) => attrs.class === 'sp-plan-price');
      const total = contents(card.html, 'p').find(({attrs}) => attrs.class === 'sp-plan-total');
      assert.equal(text(price.html), money(plan.monthlyEquivalent)+' /bulan');
      assert.equal(text(total.html), `Total ${money(plan.totalPrice)} untuk ${plan.months} bulan`);
      assert.ok(text(card.html).includes(plan.freeDomainFirstYear ? 'Domain gratis tahun pertama' : 'Domain dibayar terpisah'));
      const action = elements(card.html, 'a')[0].attrs;
      const choice = readSelection(new URL(action.href, 'https://rasio.test/'));
      assert.equal(choice.service, service);
      assert.equal(choice.months, plan.months);
      assert.deepEqual(choice.plan, getPlan(service, plan.months));
      assert.equal(action['data-service-plan'], String(plan.months), 'the clicked package explicitly overrides a carried duration');
    }
    assert.match(text(html), /ekuivalen.*Total dibayar di muka/);
    assert.match(text(html), /perpanjangan domain tahun berikutnya dibayar pelanggan/i);
  }
});

test('homepage service panels offer the two requested choices, three concrete benefits and legible badge hooks', () => {
  for (const {homeHtml:html} of outputs) {
    for (const service of ['profile', 'store']) {
      const source = panel(html, service);
      const actions = [...contents(source, 'a'), ...contents(source, 'button')];
      assert.equal(actions.filter(action => text(action.html) === 'Lihat Template').length, 1);
      const details = actions.find(action => text(action.html) === 'Lihat Detail Layanan');
      assert.ok(details, service+' detail action exists');
      assert.ok(new URL(details.attrs.href, 'https://rasio.test/').pathname.endsWith(`/rasio-${service}.html`));
      assert.equal(details.attrs['data-service-link'], service);
      const benefits = contents(source, 'ul').find(({attrs}) => attrs.class === 'check-list');
      assert.equal(contents(benefits.html, 'li').length, 3, service+' stays concise');
    }
    const profile = panel(html, 'profile');
    const badges = contents(profile, 'ul').find(({attrs}) => attrs.class === 'profile-feature-badges');
    assert.deepEqual(contents(badges.html, 'li').map(item => text(item.html)), ['Hosting & SSL', 'CMS', 'Revisi minor']);
    assert.ok(contents(badges.html, 'li').every(item => elements(item.html, 'svg').length === 1));
    assert.ok(elements(profile, 'img').some(({attrs}) => attrs.src.endsWith('template-padel-preview.jpg')), 'the approved website screenshot is the Profile visual');
    const custom = panel(html, 'custom');
    assert.ok(contents(custom, 'a').some(action => /Konsultasi Gratis/.test(text(action.html)) && new URL(action.attrs.href).hostname === 'wa.me'));
    assert.ok(contents(custom, 'a').some(action => text(action.html) === 'Lihat Detail Layanan' && action.attrs.href.includes('rasio-custom.html')));
  }
});

test('the absent Store catalogue is explained without a Profile substitute, and fees remain qualified', () => {
  assert.deepEqual(templateCatalog.map(template => [template.id, template.service]), [['Padel', 'profile']]);
  for (const {homeHtml, pages} of outputs) {
    for (const source of [panel(homeHtml, 'store'), contents(pages.get('store').html, 'main')[0].html]) {
      const action = contents(source, 'button').find(button => text(button.html) === 'Lihat Template');
      assert.ok(action && Object.hasOwn(action.attrs, 'disabled'), 'Store catalogue action cannot lead to an incompatible template');
      assert.ok(action.attrs['aria-describedby']);
      assert.match(source, new RegExp('id="'+action.attrs['aria-describedby']+'"[^>]*>Belum ada template Store yang dapat dipilih\\.'));
      for (const {attrs} of elements(source, 'a')) assert.doesNotMatch(attrs.href, /template-padel|template=Padel|#template/);
      assert.match(text(source), /Produk tanpa batas jumlah/i);
      assert.match(text(source), new RegExp('(?:input|mencakup) '+storeScope.initialProductAssistance+' produk'));
      assert.match(text(source), /0%/);
      assert.match(text(source), /gateway dan pihak ketiga.*terpisah/i);
    }
    const fee = contents(pages.get('store').html, 'aside').find(({attrs}) => attrs.class === 'sp-store-fee');
    assert.match(text(fee.html), /0%.*gateway dan pihak ketiga dibayar terpisah/i, 'third-party fee disclosure stays adjacent to the 0% claim');
  }
});

test('Custom remains consultation and proposal based, without a template or subscription checkout', () => {
  for (const {pages} of outputs) {
    const main = contents(pages.get('custom').html, 'main')[0].html;
    assert.doesNotMatch(main, /Lihat Template|Pilih Template|checkout-v4\.html|data-service-plan|Rp[\d.]+/);
    assert.match(text(main), /konsultasi|Konsultasikan/);
    assert.match(text(main), /proposal|penawaran/);
    assert.match(text(main), /AI Chatbot termasuk/);
    const actions = contents(main, 'a');
    assert.ok(actions.length >= 3);
    assert.ok(actions.every(action => new URL(action.attrs.href).hostname === 'wa.me'));
  }
});

test('service policy navigation appears only in the footer', () => {
  for (const {pages} of outputs) for (const {html} of pages.values()) {
    const footer = contents(html, 'footer')[0];
    const policyLinks = elements(html, 'a').filter(({attrs}) => /\/(?:policies|terms|[^/]+-policy)\.html$/.test(new URL(attrs.href, 'https://rasio.test/').pathname));
    assert.ok(policyLinks.length >= 2, 'customers can reach applicable policies');
    assert.ok(policyLinks.every(link => link.offset > footer.offset), 'policy links do not occupy service or pricing cards');
  }
});

function environment(t, href) {
  const previous = Object.fromEntries(['location', 'addEventListener'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const listeners = new Map();
  Object.defineProperty(globalThis, 'location', {value:new URL(href), configurable:true, writable:true});
  Object.defineProperty(globalThis, 'addEventListener', {value:(name, handler) => listeners.set(name, handler), configurable:true, writable:true});
  t.after(() => { for (const [name, descriptor] of Object.entries(previous)) descriptor ? Object.defineProperty(globalThis, name, descriptor) : delete globalThis[name]; });
  return listeners;
}

function documentFor(html, href) {
  const links = contents(html, 'a').map(({attrs, html:body}) => ({
    attrs, textContent:text(body),
    getAttribute(name) { return Object.hasOwn(this.attrs, name) ? this.attrs[name] : null; },
    get href() { return new URL(this.attrs.href, href).href; },
    set href(value) { this.attrs.href = value; }
  }));
  const service = elements(html, 'body')[0]?.attrs['data-service'];
  return {
    links, body:{dataset:service ? {service} : {}},
    querySelectorAll(selector) {
      if (selector === 'a[href]') return links;
      if (selector === 'a[data-service-link]') return links.filter(link => Object.hasOwn(link.attrs, 'data-service-link'));
      throw new Error('Unexpected selector: '+selector);
    }
  };
}

test('native detail-page navigation retains selection for every official duration and deliberate service change', t => {
  environment(t, 'https://rasio.test/');
  for (const {pages} of outputs) for (const [service, {html}] of pages) for (const months of [1, 12, 24, 48]) {
    const href = `https://rasio.test/rasio-${service}.html?type=${service}${service === 'profile' ? '&template=Padel' : ''}&duration=${months}`;
    globalThis.location = new URL(href);
    const root = documentFor(html, href);
    const originals = new Map(root.links.map(link => [link, link.getAttribute('href')]));
    initServiceLinks(root);
    for (const link of root.links) {
      const target = new URL(link.href);
      if (target.origin !== location.origin || policyOrLogin(target.pathname)) {
        assert.equal(link.getAttribute('href'), originals.get(link), 'external, policy and login destinations stay intact');
        continue;
      }
      const original = new URL(originals.get(link), href);
      const intended = link.getAttribute('data-service-link') || original.searchParams.get('type') || service;
      const selected = readSelection(link.href);
      assert.equal(selected.service, intended, link.href);
      assert.equal(selected.months, Number(link.getAttribute('data-service-plan') || months), link.href);
      assert.deepEqual(selected.errors, [], link.href);
      if (intended !== 'profile') assert.equal(selected.template, '', 'a Profile template cannot leak into '+intended);
      else if (service === 'profile') assert.equal(selected.template, 'Padel', 'Padel remains selected across Profile navigation');
      if (intended !== 'custom') assert.deepEqual(selected.plan, getPlan(intended, selected.months));
    }
  }
});

test('homepage updates only declared service actions and keeps template and package selection through native new tabs', t => {
  environment(t, 'https://rasio.test/');
  for (const {homeHtml, home} of outputs) for (const months of [1, 12, 24, 48]) {
    const href = `https://rasio.test/${home}?type=profile&template=Padel&duration=${months}`;
    globalThis.location = new URL(href);
    const root = documentFor(homeHtml, href);
    const originals = new Map(root.links.map(link => [link, link.getAttribute('href')]));
    initServiceLinks(root);
    for (const link of root.links) {
      const intended = link.getAttribute('data-service-link');
      if (!intended) { assert.equal(link.getAttribute('href'), originals.get(link)); continue; }
      const reopened = readSelection(new URL(link.href));
      assert.equal(reopened.service, intended);
      assert.equal(reopened.months, months);
      assert.equal(reopened.template, intended === 'profile' ? 'Padel' : '');
      assert.deepEqual(reopened.errors, []);
    }
  }
});

test('service links refresh from URL history and selection events without sharing mutable selection storage', t => {
  const href = 'https://rasio.test/rasio-profile.html?type=profile&template=Padel&duration=48';
  const listeners = environment(t, href);
  const root = documentFor(outputs[0].pages.get('profile').html, href);
  initServiceLinks(root);
  const back = root.links.find(link => link.textContent === 'Layanan');
  for (const [event, months] of [['popstate', 1], ['pageshow', 12], ['rasio:selection-change', 24], ['popstate', 48]]) {
    assert.ok(listeners.has(event), event+' updates native hrefs');
    globalThis.location = new URL(href.replace('duration=48', 'duration='+months));
    listeners.get(event)();
    const selected = readSelection(back.href);
    assert.equal(selected.months, months);
    assert.equal(selected.template, 'Padel');
    assert.equal(new URL(back.href).hash, '#layanan');
    for (const link of root.links.filter(link => link.getAttribute('data-service-plan'))) assert.equal(readSelection(link.href).months, Number(link.getAttribute('data-service-plan')));
  }
});

test('direct service visits do not silently choose a duration; invalid duration remains recoverable', t => {
  environment(t, 'https://rasio.test/');
  for (const [service, {html}] of outputs[0].pages) {
    const href = `https://rasio.test/rasio-${service}.html`;
    globalThis.location = new URL(href);
    const root = documentFor(html, href);
    initServiceLinks(root);
    const back = root.links.find(link => link.textContent === 'Layanan');
    const selected = readSelection(back.href);
    assert.equal(selected.service, service);
    assert.equal(selected.months, null);
    assert.equal(selected.plan, null);
  }
  const href = 'https://rasio.test/rasio-profile.html?type=profile&template=Padel&duration=1&duration=48';
  globalThis.location = new URL(href);
  const root = documentFor(outputs[0].pages.get('profile').html, href);
  initServiceLinks(root);
  const back = root.links.find(link => link.textContent === 'Layanan');
  assert.deepEqual(new URL(back.href).searchParams.getAll('duration'), ['1', '48']);
  assert.ok(readSelection(back.href).errors.length);
  for (const link of root.links.filter(link => link.getAttribute('data-service-plan'))) {
    const selected = readSelection(link.href);
    assert.deepEqual(selected.errors, [], 'a deliberate package choice resolves a malformed carried duration');
    assert.equal(selected.months, Number(link.getAttribute('data-service-plan')));
  }
});
