import test, {before, after, describe} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {Miniflare, Log, LogLevel, convertV4MiniflareOptions} from 'miniflare';
import {profileTemplates} from '../server/profile-templates.mjs';
import {profilePages, profileAsset, profileBase, navigationHref} from '../server/profile-pages.mjs';
import {defaultsFor, fieldsFor, validateContent, contentWithDefaults} from '../server/model.mjs';
import {packageVolume, enquiryDestination, validStay} from '../dist/business-enquiry.mjs';
import * as logisticsTemplate from '../server/templates/logistics.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://template-audit.test';
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, token => ({'&amp;':'&','&quot;':'"','&apos;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'}[token]));
const escape = value => String(value).replace(/[&<>"']/g, token => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[token]));
const attributes = source => Object.fromEntries([...source.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(([,name,a,b,c]) => [name,decode(a ?? b ?? c ?? '')]));
const elements = (source, tag) => [...source.matchAll(new RegExp('<'+tag+'\\b([^>]*)>', 'gi'))].map(match => ({attrs:attributes(match[1]),offset:match.index}));
const documents = new Map();
const assetCache = new Map();
let renderer;

async function asset(assetPath) {
  if(!assetCache.has(assetPath)) assetCache.set(assetPath, readFile(path.join(repo,'dist',assetPath.replace(/^\//,'')), 'utf8'));
  return assetCache.get(assetPath);
}

function registeredDestination(href, fromAsset) {
  const url = new URL(href, origin+fromAsset);
  if(url.origin !== origin) return null;
  const family = Object.keys(profileTemplates).find(template => url.pathname === profileBase(template) || url.pathname.startsWith(profileBase(template)+'/'));
  if(family) {
    const page = url.pathname.slice(profileBase(family).length).replace(/^\/|\/$/g,'');
    return {asset:profileAsset(family,page),hash:decodeURIComponent(url.hash.slice(1)),family,page};
  }
  const pathname = url.pathname === '/' ? '/index.html' : path.posix.extname(url.pathname) ? url.pathname : url.pathname+'.html';
  return {asset:pathname,hash:decodeURIComponent(url.hash.slice(1))};
}

describe('generated template and client renderer contracts', () => {
before(async () => {
  for(const template of Object.keys(profileTemplates)) {
    assert.ok(profilePages[template], template+' has a page registry');
    for(const page of Object.keys(profilePages[template])) {
      const assetPath = profileAsset(template,page);
      const html = await asset(assetPath);
      documents.set(assetPath,{template,page,html});
    }
  }
  const script = `
    import {defaultsFor} from '../server/model.mjs';
    import {profileAsset} from '../server/profile-pages.mjs';
    import {renderProfileTemplate} from '../server/profile-renderer.mjs';
    export default {async fetch(request,env) {
      const url=new URL(request.url),template=url.searchParams.get('template'),page=url.searchParams.get('page')||'';
      const data={...defaultsFor(template),...await request.json()};
      const source=await env.ASSETS.fetch(new Request(new URL(profileAsset(template,page),request.url)));
      if(!source.ok)return source;
      return renderProfileTemplate(source,data,{template,base:'/website/client-'+template.toLowerCase(),page});
    }};
  `;
  renderer = new Miniflare(convertV4MiniflareOptions({workers:[{
    name:'template-renderer-audit',modules:[
      {type:'ESModule',path:path.join(repo,'tests/template-audit.virtual.mjs'),contents:script},
      ...(await readdir(path.join(repo,'server'),{recursive:true})).filter(name=>name.endsWith('.mjs')).map(name=>({type:'ESModule',path:path.join(repo,'server',name)}))
    ],modulesRoot:repo,compatibilityDate:'2026-09-01',
    assets:{directory:path.join(repo,'dist'),binding:'ASSETS',run_worker_first:true,routerConfig:{has_user_worker:true}}
  }],log:new Log(LogLevel.ERROR)}));
});

after(async () => { if(renderer) await renderer.dispose(); });

test('every registered template page has real content, valid links, fragments, and loaded assets', async () => {
  for(const [assetPath,{template,page,html}] of documents) {
    const context=template+'/'+(page||'home');
    const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
    assert.ok(main,context+' has a main landmark');
    assert.match(main,/<h1\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/i,context+' has a page title');
    assert.ok(main.replace(/<[^>]*>/g,'').replace(/\s/g,'').length>100,context+' is not a blank decorative page');
    const ids=elements(html,'[a-z][\\w:-]*').map(el=>el.attrs.id).filter(Boolean);
    assert.equal(new Set(ids).size,ids.length,context+' has unique element IDs');
    for(const {attrs} of elements(html,'a')) {
      assert.ok(attrs.href?.trim(),context+' contains a link without a destination');
      assert.notEqual(attrs.href,'#',context+' contains an empty hash link');
      assert.doesNotMatch(attrs.href,/^javascript:/i,context+' contains a script URL');
      if('data-site-page' in attrs) {
        const [target,fragment]=attrs['data-site-page'].split('#');
        assert.ok(Object.hasOwn(profilePages[template],target),context+' links to an unregistered client page: '+attrs['data-site-page']);
        const targetHtml=await asset(profileAsset(template,target));
        if(fragment)assert.ok(elements(targetHtml,'[a-z][\\w:-]*').some(el=>el.attrs.id===fragment),context+' has a missing client fragment: '+fragment);
      }
      const destination=registeredDestination(attrs.href,assetPath);
      if(!destination)continue;
      assert.ok(destination.asset,context+' links to a missing registered page: '+attrs.href);
      const targetHtml=await asset(destination.asset);
      if(destination.hash)assert.ok(elements(targetHtml,'[a-z][\\w:-]*').some(el=>el.attrs.id===destination.hash),context+' has a missing fragment: '+attrs.href);
    }
    for(const {attrs} of [...elements(html,'script'),...elements(html,'link'),...elements(html,'img')]) {
      const href=attrs.src || attrs.href;
      if(!href?.startsWith('/') || href.startsWith('//'))continue;
      await access(path.join(repo,'dist',new URL(href,origin).pathname.replace(/^\//,'')));
    }
    assert.match(html,/src="\/profile-templates\.js[^\"]*"/,context+' loads mobile navigation behaviour');
    assert.match(html,/src="\/profile-pages\.js[^\"]*"/,context+' loads page interactions');
    assert.match(html,/src="\/(?:template-motion|business-templates)\.js[^\"]*"/,context+' loads its motion implementation');
  }
});

test('navbar defaults and every CMS-approved destination resolve to real client content', async () => {
  for(const template of Object.keys(profileTemplates)) {
    const options=fieldsFor(template).flatMap(group=>group.items).filter(field=>/^nav[1-4]Target$/.test(field.key));
    const data=defaultsFor(template);
    for(const field of options)for(const option of field.options) {
      const href=navigationHref(template,profileBase(template),option.value);
      const destination=registeredDestination(href,profileAsset(template));
      assert.ok(destination?.asset,template+' CMS menu target has no page: '+option.value);
      const html=await asset(destination.asset);
      if(destination.hash)assert.ok(elements(html,'[a-z][\\w:-]*').some(el=>el.attrs.id===destination.hash),template+' CMS menu target has no section: '+option.value);
    }
    for(const n of [1,2,3,4])assert.ok(options.find(field=>field.key==='nav'+n+'Target').options.some(option=>option.value===data['nav'+n+'Target']),template+' has invalid default navigation');
  }
});

test('CMS-approved page navigation is validated and rendered under the client website base', async () => {
  for(const template of Object.keys(profileTemplates)) {
    const defaults=defaultsFor(template),field=fieldsFor(template).flatMap(group=>group.items).find(field=>field.key==='nav1Target');
    const pageOptions=field.options.filter(option=>option.value.startsWith('page:'));
    assert.equal(pageOptions.length,Object.keys(profilePages[template]).filter(Boolean).length,template+' does not offer all registered subpages as client menu destinations');
    for(const option of pageOptions) {
      const data=validateContent({...defaults,nav1Target:option.value,nav1Visible:true},template);
      const response=await renderer.dispatchFetch(origin+'/?template='+template,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      assert.equal(response.status,200);
      const html=await response.text(),nav=elements(html,'a').find(element=>element.attrs['data-cms-menu']==='1');
      assert.ok(nav,template+' client navigation is missing');
      assert.equal(nav.attrs.href,navigationHref(template,'/website/client-'+template.toLowerCase(),option.value),template+' page menu target escaped its client base');
    }
    assert.throws(()=>validateContent({...defaults,nav1Target:'page:not-a-registered-page'},template),template+' accepts an unregistered client menu destination');
    assert.equal(navigationHref(template,profileBase(template),'page:not-a-registered-page'),profileBase(template),template+' unresolved page targets must not create a ghost route');
  }
});

test('forms, filters, tabs, galleries and preparation tools expose usable hooks and feedback', () => {
  for(const [assetPath,{html}] of documents) {
    for(const match of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)) {
      const attrs=attributes(match[1]),body=match[2];
      assert.ok('data-enquiry' in attrs || 'data-business-enquiry' in attrs || 'data-prep-builder' in attrs || 'data-volume-calculator' in attrs || 'data-cargo-checklist' in attrs,assetPath+' contains an unhandled form');
      if(!('data-cargo-checklist' in attrs))assert.match(body,/<button\b[^>]*type="submit"/,assetPath+' form is not submittable');
      if('data-enquiry' in attrs)assert.match(body,/<button\b[^>]*type="submit">Review enquiry<\/button>/,assetPath+' legacy submit label must describe the local review step');
      assert.match(body,/role="status"|data-prep-field|data-volume-output|data-checklist-status/,assetPath+' form has no feedback or preparation fields');
      if('data-cargo-checklist' in attrs){assert.match(body,/type="checkbox"/,assetPath+' cargo checklist has no usable items');assert.match(body,/data-checklist-status[^>]*aria-live="polite"/,assetPath+' cargo checklist does not announce progress');}
      if('data-enquiry' in attrs || 'data-business-enquiry' in attrs) {
        assert.ok(attrs['data-kind'],assetPath+' enquiry has no subject');
        assert.match(body,/name="name"[^>]*required/,assetPath+' enquiry requires a name');
        assert.match(body,/name="message"/,assetPath+' enquiry has no message field');
        assert.match(body,/class="enquiry-status" role="status"|data-enquiry-status/,assetPath+' enquiry has no submission status');
        assert.match(body,/<noscript>/,assetPath+' enquiry has no non-JavaScript contact route');
      }
      if('data-volume-calculator' in attrs) {
        for(const name of ['length','width','height','quantity'])assert.match(body,new RegExp('name="'+name+'"[^>]*required'),assetPath+' calculator lacks required '+name);
        assert.match(body,/<output\b[^>]*aria-live="polite"[^>]*data-volume-output/,assetPath+' calculator does not announce its result');
      }
    }
    const ids=new Set(elements(html,'[a-z][\\w:-]*').map(el=>el.attrs.id).filter(Boolean));
    for(const {attrs} of elements(html,'button')) {
      if(attrs.role==='tab') {
        assert.ok(ids.has(attrs['aria-controls']),assetPath+' tab references a missing panel');
        assert.ok(['true','false'].includes(attrs['aria-selected']),assetPath+' tab has no selection state');
      }
      if('data-filter' in attrs && attrs['data-filter']!=='all')assert.ok(elements(html,'[a-z][\\w:-]*').some(el=>el.attrs['data-category']===attrs['data-filter']),assetPath+' filter has no matching content');
      if('data-gallery-image' in attrs)assert.match(html,/<dialog\b[^>]*class="gallery-dialog"/,assetPath+' gallery has no viewer');
    }
    for(const {attrs} of elements(html,'dialog')) {
      assert.ok(attrs['aria-label']?.trim() || ids.has(attrs['aria-labelledby']),assetPath+' dialog has no accessible name');
    }
    for(const {attrs} of elements(html,'iframe'))assert.ok(attrs.title?.trim(),assetPath+' embedded map has no accessible name');
    if(elements(html,'form').some(element=>'data-prep-builder' in element.attrs))for(const hook of ['data-prep-summary','data-prep-copy','data-prep-download','data-prep-continue','class="prep-status" role="status"'])assert.ok(html.includes(hook),assetPath+' preparation tool lacks '+hook);
  }
});

test('every registered page is reachable through the family navigation or visitor journey', () => {
  for(const template of Object.keys(profileTemplates)) {
    const found=new Set(['']),pending=[''];
    while(pending.length) {
      const page=pending.pop(),source=documents.get(profileAsset(template,page))?.html;
      assert.ok(source,template+' lacks generated content for '+page);
      for(const {attrs} of elements(source,'a')) {
        const destination=registeredDestination(attrs.href,profileAsset(template,page));
        if(destination?.family!==template || found.has(destination.page))continue;
        found.add(destination.page);pending.push(destination.page);
      }
    }
    assert.deepEqual([...found].sort(),Object.keys(profilePages[template]).sort(),template+' has an orphan page not reachable from the home page');
  }
});

test('template families use distinct photography rather than recycling another sector imagery', () => {
  const owners=new Map();
  for(const {template,html} of documents.values())for(const {attrs} of elements(html,'img')) {
    if(!attrs.src || attrs['data-cms-image']==='logo' || /\/(?:rasio|rasiolabs)[^/]*\.(?:png|svg)$/.test(attrs.src.split('?')[0]))continue;
    const source=attrs.src.split('?')[0];if(!owners.has(source))owners.set(source,new Set());owners.get(source).add(template);
  }
  for(const [source,families] of owners)assert.equal(families.size,1,'Photograph '+source+' is repeated across templates: '+[...families].join(', '));
});

test('client renderer rewrites all page links, navbar, contact and CMS values for every template page', async () => {
  for(const [assetPath,{template,page,html:source}] of documents) {
    const data={...defaultsFor(template),statisticsVisible:true};
    for(const field of fieldsFor(template).flatMap(group=>group.items))if(['text','textarea'].includes(field.type)&&!/^nav|whatsapp$|email$|locationLat$|locationLon$/.test(field.key))data[field.key]='Client & '+field.key;
    Object.assign(data,{businessName:'Client & Company',heroTitle:'Client <heading>',whatsapp:'+6281234567890',email:'owner@example.test',nav1Label:'Client navigation',navCtaLabel:'Contact client',contactLabel:'Client enquiry'});
    const response=await renderer.dispatchFetch(origin+'/?template='+template+'&page='+page,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    assert.equal(response.status,200,assetPath+' client renderer failed');
    const html=await response.text(),base='/website/client-'+template.toLowerCase();
    assert.doesNotMatch(html,/class="template-access"/,assetPath+' leaks catalog controls into a client website');
    assert.doesNotMatch(html,/wa\.me\/60142317052/,assetPath+' still points to Rasio contact');
    assert.match(html,/href="https:\/\/wa.me\/6281234567890"/,assetPath+' client contact was not applied');
    assert.match(html,/>Client &amp; Company</,assetPath+' client business name was not applied');
    if(!page)assert.match(html,/Client &lt;heading&gt;/,assetPath+' content was not safely rendered');
    for(const {attrs} of elements(html,'a')) {
      if('data-site-page' in attrs)assert.equal(attrs.href,base+(attrs['data-site-page']?'/'+attrs['data-site-page']:''),assetPath+' points to template previews rather than client pages');
      if(attrs['data-cms-menu']==='1')assert.equal(attrs.href,navigationHref(template,base,data.nav1Target),assetPath+' navbar points outside the client website');
    }
    for(const {attrs} of elements(html,'form'))if('data-enquiry' in attrs || 'data-business-enquiry' in attrs) {
      assert.equal(attrs['data-whatsapp'],'6281234567890',assetPath+' enquiry form still uses the preview contact');
      assert.equal(attrs['data-contact-email'],'owner@example.test',assetPath+' enquiry email fallback was not rewritten');
    }
    const fieldKeys=new Set(elements(source,'[a-z][\\w:-]*').map(el=>el.attrs['data-cms-field']).filter(Boolean));
    for(const field of fieldsFor(template).flatMap(group=>group.items)) {
      if(!fieldKeys.has(field.key) || !['text','textarea'].includes(field.type) || /^nav|locationLat|locationLon/.test(field.key))continue;
      assert.ok(html.includes(escape(data[field.key])),assetPath+' CMS edit is inert: '+field.key);
    }
  }
});

test('CMS only offers content fields that affect a rendered client page', () => {
  const special=/^(nav|statisticsVisible$|whatsapp$|email$|locationLat$|locationLon$|contactLabel$)/;
  for(const template of Object.keys(profileTemplates)) {
    const source=[...documents.values()].filter(doc=>doc.template===template).map(doc=>doc.html).join('');
    const keys=new Set(elements(source,'[a-z][\\w:-]*').flatMap(el=>[el.attrs['data-cms-field'],el.attrs['data-cms-image']]).filter(Boolean));
    const missing=fieldsFor(template).flatMap(group=>group.items).map(field=>field.key).filter(key=>!keys.has(key)&&!special.test(key));
    assert.deepEqual(missing,[],template+' exposes editable fields that no page renders');
  }
});

test('editable location coordinates reject malformed values for all map-based templates', () => {
  for(const template of Object.keys(profileTemplates)) {
    const keys=new Set(fieldsFor(template).flatMap(group=>group.items).map(field=>field.key));
    if(!keys.has('locationLat'))continue;
    const defaults=defaultsFor(template);
    assert.doesNotThrow(()=>validateContent(defaults,template),template+' accepts valid coordinates');
    for(const coordinates of [{locationLat:'not-a-number'}, {locationLon:'181'}, {locationLat:'-91'}, {locationLat:''}])assert.throws(()=>validateContent({...defaults,...coordinates},template),/Koordinat lokasi/,template+' accepted malformed coordinates');
  }
});

test('historical unused fields do not prevent a client from editing supported content', () => {
  for(const template of ['Padel','Creative','Consulting']) {
    const historical={...defaultsFor(template),work2Description:'Legacy description',processTitle:'Legacy process title',heroTitle:'Current client title'};
    const validated=validateContent(historical,template);
    const supported=new Set(fieldsFor(template).flatMap(group=>group.items).map(field=>field.key));
    assert.equal(validated.heroTitle,'Current client title');
    for(const key of Object.keys(validated))assert.ok(supported.has(key),template+' retained an unsupported editable field');
    const restored=contentWithDefaults(validated,template);
    assert.equal(restored.heroTitle,'Current client title');assert.ok(restored.work2Description,template+' retains generator defaults for old layout fields');
  }
});

test('renamed client rooms, menus and services stay consistent in enquiry links and topic choices', async () => {
  for(const [template,field] of [['Architecture','service1Title'],['Padel','service1Title'],['Creative','service1Title'],['Consulting','service1Title'],['Hospitality','work1Title'],['Catering','menu1Title'],['Logistics','service1Title']]) {
    const defaults=defaultsFor(template),title='Client '+field+' & details';
    let optionFound=false,linkFound=false;
    for(const [assetPath,{template:family,page,html:source}] of documents) {
      if(family!==template)continue;
      const response=await renderer.dispatchFetch(origin+'/?template='+template+'&page='+page,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...defaults,[field]:title,whatsapp:'+6281234567890',email:'owner@example.test'})});
      const html=await response.text();
      for(const {attrs} of elements(html,'a'))if(attrs['data-cms-topic-key']===field) {
        linkFound=true;assert.equal(attrs['data-enquiry-topic'],title,assetPath+' retains a preview enquiry topic after the client renames it');
      }
      for(const match of html.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)) {
        const attrs=attributes(match[1]);if(attrs['data-cms-topic-key']!==field)continue;
        optionFound=true;assert.equal(attrs.value,title,assetPath+' topic value ignores CMS edits');assert.equal(decode(match[2]),title,assetPath+' topic label ignores CMS edits');
      }
      for(const {attrs} of elements(html,'input')) {
        if(attrs['data-cms-topic-key']!==field)continue;
        optionFound=true;assert.equal(attrs.value,title,assetPath+' radio topic value ignores CMS edits');
        assert.ok(html.includes('data-cms-field="'+field+'"')&&html.includes(escape(title)),assetPath+' renamed radio topic has no visible client label');
      }
      if(source.includes('data-enquiry-topic="'+escape(defaults[field])+'"'))assert.ok(elements(html,'a').some(el=>el.attrs['data-enquiry-topic']===title),assetPath+' topic link is not tied to the editable title');
    }
    assert.ok(optionFound,template+' renamed topic is not present in the client enquiry selector');
    if(['Padel','Consulting','Hospitality','Catering'].includes(template))assert.ok(linkFound,template+' has no bound enquiry link for its editable offering');
  }
});

test('renamed hotel rooms appear in detail metadata, footer labels and other-room links', async () => {
  const data={...defaultsFor('Hospitality'),businessName:'Client Hotel',work1Title:'Garden & sea <room>',work2Title:'A private terrace',whatsapp:'+6281234567890',email:'owner@example.test'};
  for(const [page,field] of [['garden-room','work1Title'],['terrace-suite','work2Title']]) {
    const response=await renderer.dispatchFetch(origin+'/?template=Hospitality&page='+page,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const html=await response.text();
    assert.ok(html.includes('<title>'+escape(data[field])+' | Client Hotel</title>'),'hotel detail metadata uses the original preview room name');
    const links=[...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
    for(const match of links) {
      const attrs=attributes(match[1]),key=attrs['data-cms-link-label-key'];
      if(!['work1Title','work2Title'].includes(key))continue;
      assert.equal(decode(match[2]),(attrs['data-cms-link-label-prefix']||'')+data[key]+(attrs['data-cms-link-label-suffix']||''),'bound link did not preserve its surrounding label while replacing the room name');
    }
    for(const key of ['work1Title','work2Title'])assert.ok(links.some(match=>{
      const attrs=attributes(match[1]);return attrs.class?.includes('footer-page')&&attrs['data-cms-link-label-key']===key&&decode(match[2])===data[key];
    }),'hotel footer does not reflect renamed '+key);
    const otherField=field==='work1Title'?'work2Title':'work1Title';
    assert.ok(links.some(match=>{
      const attrs=attributes(match[1]);return !attrs.class?.includes('footer-page')&&attrs['data-cms-link-label-key']===otherField&&decode(match[2]).includes(data[otherField]);
    }),'other-room action does not reflect the renamed room');
  }
});
});

class Control {
  constructor({attrs={},dataset={},values={},selectors={},lists={}}={}) {
    this.attrs=new Map(Object.entries(attrs));this.dataset=dataset;this.values=values;
    this.selectors=selectors;this.lists=lists;this.events=new Map();this.children=[];this.hidden=false;
    this.style={};
    this.validity={valid:true};
    const classes=new Set();this.classList={add:(...values)=>values.forEach(value=>classes.add(value)),remove:(...values)=>values.forEach(value=>classes.delete(value)),toggle:(value,force)=>{const next=force??!classes.has(value);next?classes.add(value):classes.delete(value);return next;},contains:value=>classes.has(value)};
  }
  getAttribute(name){return this.attrs.get(name)??null;}
  setAttribute(name,value){this.attrs.set(name,String(value));}
  hasAttribute(name){return this.attrs.has(name);}
  addEventListener(name,handler){if(!this.events.has(name))this.events.set(name,[]);this.events.get(name).push(handler);}
  emit(name,event={}){for(const handler of this.events.get(name)||[])handler({target:this,preventDefault(){this.defaultPrevented=true;},...event});}
  dispatchEvent(event){this.emit(event.type,event);}
  querySelector(selector){return this.selectors[selector]??null;}
  querySelectorAll(selector){return this.lists[selector]??[...new Set(selector.split(',').flatMap(part=>this.lists[part.trim()]??[]))];}
  closest(selector){return this.selectors['closest:'+selector]??null;}
  matches(){return false;}
  getBoundingClientRect(){return {x:0,y:0,left:0,top:0,right:100,bottom:100,width:100,height:100};}
  focus(){this.focused=true;}
  click(){this.emit('click');this.clicked=true;}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=[...children];this.textContent='';}
  reportValidity(){return this.valid!==false;}
  checkValidity(){return this.valid!==false && !this.customValidity;}
  setCustomValidity(value){this.customValidity=value;this.validationMessage=value;this.validity.customError=Boolean(value);this.validity.valid=!value&&this.valid!==false;}
  showModal(){this.open=true;}
  close(){this.open=false;this.emit('close');}
}

async function pageRuntime({selectors={},lists={},storage=new Map(),clipboard={writeText:async()=>{}}}={}) {
  const opened=[],created=[],downloads=[],document=new Control({selectors,lists});
  document.body=new Control();document.body.classList.add('theme-consulting');
  document.createElement=()=>{const element=new Control();created.push(element);return element;};
  class RuntimeURL extends URL {static createObjectURL(value){downloads.push(value);return 'blob:local-brief';}static revokeObjectURL(){}}
  const context={document,window:{open:url=>opened.push(url),RasioTemplateForms:{initialize(){},validate:form=>form.valid!==false}},location:{href:origin+'/website/client/brief'},URL:RuntimeURL,Blob,setTimeout,navigator:{clipboard},
    matchMedia:()=>({matches:true}),CustomEvent:class {constructor(type){this.type=type;}},
    sessionStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    FormData:class {constructor(form){this.values=form.values;}get(name){return this.values[name]??null;}getAll(name){const value=this.values[name];return value===undefined?[]:Array.isArray(value)?value:[value];}}
  };
  runInNewContext(await asset('/profile-pages.js'),context,{filename:'profile-pages.js'});
  return {document,opened,context,storage,created,downloads};
}

test('actual navigation script opens the mobile menu and closes on Escape or chosen links', async () => {
  const button=new Control({attrs:{'aria-expanded':'false'}}),link=new Control(),nav=new Control({lists:{a:[link]}});
  const document=new Control({selectors:{'.studio-menu':button,'.studio-nav':nav}});
  runInNewContext(await asset('/profile-templates.js'),{document},{filename:'profile-templates.js'});
  button.emit('click');assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(nav.classList.contains('is-open'),true);
  document.emit('keydown',{key:'Escape'});assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(nav.classList.contains('is-open'),false);
  button.emit('click');link.emit('click');assert.equal(nav.classList.contains('is-open'),false);
});

test('actual filter and tab script selects matching content and supports keyboard navigation', async () => {
  const all=new Control({dataset:{filter:'all'}}),interior=new Control({dataset:{filter:'interior'}}),material=new Control({dataset:{filter:'material'}});
  const first=new Control({dataset:{category:'interior'}}),second=new Control({dataset:{category:'material'}});
  const filter=new Control({lists:{'[data-filter]':[all,interior,material],'[data-category]':[first,second]}});
  const tab1=new Control({attrs:{'aria-controls':'one','aria-selected':'true'}}),tab2=new Control({attrs:{'aria-controls':'two','aria-selected':'false'}});
  const panel1=new Control(),panel2=new Control();panel1.id='one';panel2.id='two';panel2.hidden=true;
  const tabs=new Control({lists:{'[role="tab"]':[tab1,tab2],'[role="tabpanel"]':[panel1,panel2]}});
  await pageRuntime({lists:{'[data-filter-scope]':[filter],'[data-tabs]':[tabs]}});
  material.emit('click');assert.equal(first.hidden,true);assert.equal(second.hidden,false);assert.equal(material.getAttribute('aria-pressed'),'true');
  all.emit('click');assert.equal(first.hidden,false);assert.equal(second.hidden,false);
  tab1.emit('keydown',{key:'ArrowRight'});assert.equal(panel1.hidden,true);assert.equal(panel2.hidden,false);assert.equal(tab2.focused,true);assert.equal(tab2.tabIndex,0);
  tab2.emit('keydown',{key:'Home'});assert.equal(panel1.hidden,false);assert.equal(panel2.hidden,true);assert.equal(tab1.getAttribute('aria-selected'),'true');
});

test('actual gallery script changes photographs, wraps navigation, and restores trigger focus', async () => {
  const image1={src:origin+'/first.jpg',alt:'First space'},image2={src:origin+'/second.jpg',alt:'Second space'};
  const trigger1=new Control({selectors:{img:image1}}),trigger2=new Control({selectors:{img:image2}}),image=new Control(),caption=new Control(),count=new Control(),close=new Control(),previous=new Control(),next=new Control();
  const dialog=new Control({selectors:{img:image,p:caption,'[data-gallery-count]':count,'.gallery-close':close,'[data-gallery-prev]':previous,'[data-gallery-next]':next}});
  await pageRuntime({selectors:{'.gallery-dialog':dialog},lists:{'[data-gallery-image]':[trigger1,trigger2]}});
  trigger1.emit('click');assert.equal(dialog.open,true);assert.equal(image.src,image1.src);assert.equal(count.textContent,'1 / 2');
  next.emit('click');assert.equal(image.src,image2.src);assert.equal(caption.textContent,image2.alt);
  next.emit('click');assert.equal(image.src,image1.src);
  previous.emit('click');assert.equal(image.src,image2.src);
  close.emit('click');assert.equal(dialog.open,false);assert.equal(trigger1.focused,true);
});

test('actual enquiry script validates and prepares an explicit client contact link without automatically sending', async () => {
  for(const {phone,email,method} of [{phone:'6281234567890',email:'',method:'whatsapp'},{phone:'',email:'owner@example.test',method:'email'},{phone:'',email:'',method:'none'}]) {
    const status=new Control(),submit={firstChild:{textContent:'Review enquiry'}};
    const form=new Control({dataset:{whatsapp:phone,contactEmail:email,kind:'Business enquiry'},values:{name:'Alex',email:'alex@example.test',topic:'Strategy',message:'A specific business question.',Company:'Example company'},selectors:{'.enquiry-status':status,'[type="submit"]':submit},lists:{'[data-enquiry-detail]':[{name:'Company'}]}});
    const {opened}=await pageRuntime({lists:{'[data-enquiry]':[form]}});
    assert.equal(submit.firstChild.textContent,'Review enquiry','the review action is independent of the client contact method');
    form.valid=false;form.emit('submit');assert.equal(opened.length,0,'invalid enquiry should not open an external app');
    form.valid=true;form.emit('submit');
    if(method==='none'){assert.equal(opened.length,0);assert.equal(status.textContent,'Please use the contact details in the footer.');continue;}
    assert.equal(opened.length,0,'the visitor decides when to open their contact application');assert.equal(status.children.length,1,'visitor retains a visible contact action');
    assert.equal(status.children[0].focused,true);
    const url=new URL(status.children[0].href);
    if(method==='whatsapp'){assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/'+phone);assert.match(url.searchParams.get('text'),/Alex[\s\S]*Business enquiry: Strategy[\s\S]*Company: Example company[\s\S]*specific business question/);}
    else{assert.equal(url.protocol,'mailto:');assert.equal(decodeURIComponent(url.pathname),email);assert.match(url.searchParams.get('body'),/specific business question/);}
    assert.equal(submit.firstChild.textContent,'Review enquiry');assert.equal(status.children[0].textContent,method==='whatsapp'?'Continue in WhatsApp':'Continue by email');
  }
});

test('an enquiry link keeps its chosen room, menu or service on the client enquiry page', async () => {
  const home={href:origin+'/website/client'},storage=new Map();
  const link=new Control({attrs:{'data-site-page':'stay','data-enquiry-topic':'Garden room'},dataset:{sitePage:'stay',enquiryTopic:'Garden room'}});
  await pageRuntime({selectors:{'[data-site-page=""]':home},lists:{'[data-enquiry-topic]':[link],'[data-site-page="stay"]':[link]},storage});
  link.emit('click');
  assert.ok(storage.get('profile-brief:/website/client'),'a topic-bearing client link prepares the enquiry even without a surrounding card');
  const message={value:'',maxLength:6000},topic={value:'Garden room',checked:false};
  const form=new Control({dataset:{whatsapp:'6281234567890',kind:'Stay enquiry'},selectors:{'[name="message"]':message},lists:{'[name="topic"]':[topic]}});
  await pageRuntime({selectors:{'[data-site-page=""]':home},lists:{'[data-enquiry]':[form]},storage});
  assert.equal(topic.checked,true);assert.match(message.value,/Garden room/);assert.equal(storage.has('profile-brief:/website/client'),false,'one completed handoff does not spill into the next enquiry');
});

test('the actual brief tool reviews, copies, downloads and hands off a visitor brief without sending it', async () => {
  const summary=new Control(),status=new Control(),copy=new Control(),download=new Control(),next=new Control({attrs:{'data-prep-continue':''}});
  const scope=new Control({selectors:{'[data-prep-summary]':summary,'.prep-status':status,'[data-prep-copy]':copy,'[data-prep-download]':download,'[data-prep-continue]':next}});
  const form=new Control({dataset:{kind:'Brand brief'},values:{Company:'Example business',Goals:['New identity','Packaging']},selectors:{'closest:.prep-layout':scope},lists:{'[data-prep-field]':[{name:'Company'},{name:'Goals'},{name:'Goals'}]}});
  const copied=[],storage=new Map(),home={href:origin+'/website/client/'};
  const runtime=await pageRuntime({selectors:{'[data-site-page=""]':home},lists:{'[data-prep-builder]':[form]},storage,clipboard:{writeText:async value=>copied.push(value)}});
  form.emit('input');assert.equal(summary.children.length,1);assert.equal(summary.children[0].children.length,2,'checkbox choices are combined rather than repeated');
  form.emit('submit');assert.equal(status.textContent,'Brief ready. Continue to enquiry when you’re ready.');
  copy.emit('click');await new Promise(resolve=>setImmediate(resolve));assert.equal(copied[0],'Brand brief\n\nCompany: Example business\n\nGoals: New identity, Packaging');assert.equal(status.textContent,'Brief copied.');
  download.emit('click');assert.equal(runtime.downloads.length,1);assert.equal(await runtime.downloads[0].text(),copied[0]);assert.ok(runtime.created.some(control=>control.download==='project-brief.txt'&&control.clicked));
  next.emit('click');assert.deepEqual(JSON.parse(storage.get('profile-brief:/website/client')),{message:copied[0],topic:''});assert.equal(runtime.opened.length,0,'preparing a brief does not dispatch an enquiry');
});

test('the actual brief tool handles empty answers, clipboard failure and invalid continuation', async () => {
  const summary=new Control(),status=new Control(),copy=new Control(),download=new Control(),next=new Control({attrs:{'data-prep-continue':''}});
  const scope=new Control({selectors:{'[data-prep-summary]':summary,'.prep-status':status,'[data-prep-copy]':copy,'[data-prep-download]':download,'[data-prep-continue]':next}});
  const form=new Control({dataset:{kind:'Space brief'},values:{Goals:''},selectors:{'closest:.prep-layout':scope},lists:{'[data-prep-field]':[{name:'Goals'}]}});
  const storage=new Map();
  const runtime=await pageRuntime({lists:{'[data-prep-builder]':[form]},storage,clipboard:{writeText:async()=>{throw new Error('denied');}}});
  form.emit('input');assert.equal(summary.children[0].textContent,'Your answers will appear here.');
  copy.emit('click');download.emit('click');assert.equal(status.textContent,'Add your answers first.');assert.equal(runtime.downloads.length,0);
  form.values.Goals='A renovation';copy.emit('click');await new Promise(resolve=>setImmediate(resolve));assert.equal(status.textContent,'Copy is unavailable. Use Download brief.');
  form.valid=false;let prevented=false;next.emit('click',{preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(storage.size,0,'invalid required fields cannot be silently passed to the enquiry');
});

test('the actual legacy motion script keeps the initial viewport readable and respects reduced motion', async () => {
  for(const reduced of [false,true]) {
    const frames=[],hero=new Control(),photograph=new Control();hero.tagName='H1';photograph.tagName='IMG';
    for(const element of [hero,photograph])element.animate=(keyframes,options)=>{frames.push({element,keyframes,options});return {finished:Promise.resolve(),cancel(){},finish(){}};};
    const observerCallbacks=[],document=new Control();document.body=new Control();document.documentElement={scrollHeight:2000};document.createElement=()=>new Control();
    document.querySelectorAll=selector=>selector.startsWith('main h1,main h2')?[hero,photograph]:[];
    const window=new Control();window.IntersectionObserver=true;
    class Observer {constructor(callback){observerCallbacks.push(callback);}observe(){}unobserve(){}}
    const media=new Control();media.matches=reduced;
    runInNewContext(await asset('/template-motion.js'),{document,window,matchMedia:()=>media,IntersectionObserver:Observer,WeakSet,Set,innerHeight:900,innerWidth:1366,scrollY:0,requestAnimationFrame:callback=>{callback();return 1;}},{filename:'template-motion.js'});
    assert.equal(observerCallbacks.length,1);
    observerCallbacks[0]([{target:hero,isIntersecting:true},{target:photograph,isIntersecting:false}]);
    assert.equal(frames.length,0,'initial viewport does not disappear after first paint');
    observerCallbacks[0]([{target:photograph,isIntersecting:true}]);
    assert.equal(frames.length,reduced?0:1);
    if(!reduced)assert.ok(frames[0].options.duration>0&&frames[0].options.fill==='backwards');
  }
});

async function businessRuntime({forms=[],calculators=[],checklists=[],motions=[],reduced=true,storage=new Map(),search='',homePath='/website/client-hotel'}={}) {
  const created=[],opened=[],observers=[],document=new Control({selectors:{'[data-site-page=""]':{href:origin+homePath}},lists:{'[data-business-enquiry]':forms,'[data-volume-calculator]':calculators,'[data-cargo-checklist]':checklists,'[data-motion]':motions}});
  document.body=new Control();document.createElement=()=>{const element=new Control();created.push(element);return element;};document.getElementById=id=>created.find(element=>element.id===id)||null;
  const formValue=(form,key)=>form.elements?.namedItem(key)?.value??form.values[key];
  const window={open:url=>opened.push(url)};
  class Observer {constructor(callback){this.callback=callback;this.observed=[];observers.push(this);}observe(element){this.observed.push(element);}unobserve(element){this.observed=this.observed.filter(item=>item!==element);}}
  window.IntersectionObserver=Observer;
  const context={document,window,location:{href:origin+homePath+'/stay',search},URL,URLSearchParams,Date,packageVolume,enquiryDestination,validStay,
    matchMedia:()=>({matches:reduced}),IntersectionObserver:Observer,innerHeight:900,Option:class{constructor(text,value){this.textContent=text;this.value=value;}},
    sessionStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    FormData:class {constructor(form){this.form=form;}get(name){return formValue(this.form,name)??null;}*[Symbol.iterator](){for(const key of Object.keys(this.form.values))yield [key,formValue(this.form,key)];}}
  };
  runInNewContext(await asset('/template-validation.js'),context,{filename:'template-validation.js'});
  runInNewContext((await asset('/business-templates.js')).replace(/^import[^\n]+\n/,''),context,{filename:'business-templates.js'});
  return {document,window,created,opened,storage,observers};
}

test('the actual business motion script keeps first-paint content static while retaining camera pan and respecting reduced motion', async () => {
  for(const reduced of [false,true]) {
    const pan=new Control({dataset:{motion:'pan'}}),photo=new Control({dataset:{motion:'photo'}}),text=new Control({dataset:{motion:'text'}}),aperture=new Control({dataset:{motion:'aperture'}}),later=new Control({dataset:{motion:'photo'}});
    later.getBoundingClientRect=()=>({top:1200,bottom:1400});
    const {document,observers}=await businessRuntime({motions:[pan,photo,text,aperture,later],reduced});
    assert.equal(document.body.classList.contains('motion-ready'),!reduced);
    assert.equal(observers.length,reduced?0:1);
    for(const element of [pan,photo,text,aperture])assert.equal(element.classList.contains('is-visible'),!reduced);
    assert.equal(pan.classList.contains('motion-static'),false,'the transform-only camera pan remains available in the initial viewport');
    for(const element of [photo,text,aperture])assert.equal(element.classList.contains('motion-static'),!reduced,'first-paint reveal effects are suppressed');
    assert.equal(later.classList.contains('is-visible'),false);
    if(!reduced){assert.deepEqual(observers[0].observed,[later]);observers[0].callback([{target:later,isIntersecting:true}]);assert.equal(later.classList.contains('is-visible'),true);assert.equal(observers[0].observed.length,0);}
  }
  assert.match(await asset('/business-templates.css'),/@media\(prefers-reduced-motion:reduce\)[\s\S]*?animation:none!important/,'CSS also disables all motion when requested');
});

function businessForm({phone='6281234567890',email='owner@example.test',dates=false}={}) {
  const status=new Control(),values={name:'Alex',email:'alex@example.test',topic:'Garden room',message:'An enquiry & a question.'},inputs=new Map();
  if(dates)Object.assign(values,{'Arrival date':'2026-12-01','Departure date':'2026-12-04',Guests:'2'});
  for(const [name,value] of Object.entries(values)) {
    const label=new Control(),input=new Control({selectors:{'closest:label':label}});input.name=name;input.value=value;input.type=name.includes('date')?'date':name==='email'?'email':name==='Guests'?'number':'text';inputs.set(name,input);
  }
  const topic=inputs.get('topic');topic.options=[{value:'Garden room'},{value:'Terrace suite'}];topic.add=option=>topic.options.push(option);
  const controls=[...inputs.values()];
  const form=new Control({dataset:{whatsapp:phone,contactEmail:email,kind:'Stay enquiry'},values,selectors:{'[data-enquiry-status]':status},lists:{'input,select,textarea':controls,'input[type=date]':controls.filter(input=>input.type==='date')}});
  form.elements={namedItem:name=>inputs.get(name),topic};
  return {form,status,inputs};
}

test('the real shared validator associates inline errors, focuses the first error and preserves answers', async () => {
  const {form,inputs,status}=businessForm(),name=inputs.get('name'),email=inputs.get('email');
  name.validity={valid:false,valueMissing:true};email.validity={valid:false,typeMismatch:true};
  const runtime=await businessRuntime({forms:[form]});
  assert.equal(form.noValidate,true);
  form.emit('submit');assert.equal(name.focused,true);assert.equal(name.getAttribute('aria-invalid'),'true');assert.equal(status.children.length,0);assert.equal(email.value,'alex@example.test');
  const error=runtime.document.getElementById(name.dataset.errorId);assert.equal(error.textContent,'Complete this field.');assert.ok(name.getAttribute('aria-describedby').split(' ').includes(error.id));
  name.validity={valid:true};name.emit('input');assert.equal(error.textContent,'');assert.equal(name.getAttribute('aria-invalid'),'false');
  email.validity={valid:true};form.emit('submit');assert.equal(status.children[0].textContent,'Check your enquiry');assert.equal(runtime.opened.length,0);
});

test('the actual business enquiry script reviews values and prepares only an explicitly chosen client contact', async () => {
  for(const settings of [{phone:'6281234567890',email:'owner@example.test',protocol:'https:'},{phone:'',email:'owner+stay@example.test',protocol:'mailto:'},{phone:'',email:'',protocol:null}]) {
    const {form,status,inputs}=businessForm(settings),runtime=await businessRuntime({forms:[form]});
    form.emit('submit');assert.equal(runtime.opened.length,0);assert.equal(inputs.get('name').value,'Alex');
    if(!settings.protocol){assert.match(status.textContent,/Contact details are not available/);continue;}
    assert.equal(status.children.length,3);const link=status.children[2],url=new URL(link.href);assert.equal(url.protocol,settings.protocol);assert.equal(link.focused,true);
    if(settings.protocol==='https:'){assert.equal(url.pathname,'/6281234567890');assert.match(url.searchParams.get('text'),/Stay enquiry[\s\S]*An enquiry & a question/);assert.equal(link.rel,'noopener');}
    else{assert.equal(decodeURIComponent(url.pathname),settings.email);assert.equal(url.searchParams.get('subject'),'Stay enquiry');assert.match(url.searchParams.get('body'),/Alex[\s\S]*An enquiry & a question/);}
    const message=url.searchParams.get(settings.protocol==='https:'?'text':'body');
    const review=status.children[1].children;
    for(let index=0;index<review.length;index+=2)assert.ok(message.includes(review[index].textContent+': '+review[index+1].textContent),'prepared contact message differs from the visible review label or value');
    assert.doesNotMatch(message,/(?:^|\n)(?:name|email|topic|message):/,'visitor-facing contact messages contain machine field names');
    form.emit('input');assert.equal(status.children.length,0,'changing the enquiry removes an obsolete review');
  }
});

test('the actual business enquiry script rejects a non-increasing stay and supports one-time topic handoff', async () => {
  const {form,status,inputs}=businessForm({dates:true}),storage=new Map([['profile-brief:/website/client-hotel',JSON.stringify({topic:'Terrace suite'})]]);
  const runtime=await businessRuntime({forms:[form],storage});assert.equal(form.elements.topic.value,'Terrace suite');assert.equal(storage.size,0);
  const departure=inputs.get('Departure date');departure.value='2026-12-01';form.emit('submit');
  assert.equal(departure.getAttribute('aria-invalid'),'true');assert.equal(departure.focused,true);assert.match(runtime.document.getElementById(departure.dataset.errorId).textContent,/Departure must be after arrival/);assert.equal(status.children.length,0);
  departure.value='2026-12-04';form.emit('submit');assert.equal(departure.getAttribute('aria-invalid'),'false');assert.equal(status.children[0].textContent,'Check your enquiry');
  const link=new URL(status.children[2].href);assert.match(link.searchParams.get('text'),/Interested in: Terrace suite/);assert.equal(runtime.opened.length,0);
});

test('the actual business topic selector removes duplicate values while preserving selection and distinct client offerings', async () => {
  const {form}=businessForm(),select=form.elements.topic;
  const original={value:'Private dining'},selected={value:'Private dining',selected:true},corporate={value:'Corporate catering'},renamed={value:'Private celebration'};
  select.options=[original,corporate,selected,renamed];select.value='Private dining';
  for(const option of select.options)option.remove=()=>select.options.splice(select.options.indexOf(option),1);
  await businessRuntime({forms:[form]});
  assert.deepEqual(select.options.map(option=>option.value),['Corporate catering','Private dining','Private celebration']);
  assert.ok(select.options.includes(selected),'the selected duplicate keeps its option identity');assert.ok(!select.options.includes(original));assert.equal(select.value,'Private dining');
  const next=businessForm(),topic=next.form.elements.topic;
  topic.options=[{value:'Dinner service'},{value:'Private dining'}];topic.value='Dinner service';
  const storage=new Map([['profile-brief:/website/client-hotel',JSON.stringify({topic:'Chef’s table'})]]);
  await businessRuntime({forms:[next.form],storage});
  assert.deepEqual(topic.options.map(option=>option.value),['Dinner service','Private dining','Chef’s table'],'separately renamed CMS offerings are retained and a new handoff topic is added');
  assert.equal(topic.value,'Chef’s table');assert.equal(storage.size,0,'a custom handoff is consumed once');
});

test('the actual cargo calculator and checklist provide useful results and recovery without a service quote', async () => {
  const output=new Control(),calculator=new Control({values:{length:'100',width:'50',height:'40',quantity:'3'},selectors:{'[data-volume-output]':output}});
  calculator.elements={namedItem(){return null;}};
  const boxes=[new Control(),new Control()],progress=new Control(),checklist=new Control({selectors:{'[data-checklist-status]':progress},lists:{'input[type=checkbox]':boxes}});
  await businessRuntime({calculators:[calculator],checklists:[checklist]});
  calculator.emit('submit');assert.equal(output.textContent,'0.600 m³ total package volume');calculator.emit('input');assert.match(output.textContent,/Calculate again/);
  calculator.values.quantity='1.5';calculator.emit('submit');assert.match(output.textContent,/whole number/);
  boxes[0].checked=true;checklist.emit('change');assert.equal(progress.textContent,'1 of 2 items prepared');boxes[1].checked=true;checklist.emit('change');assert.equal(progress.textContent,'Checklist complete. Ready to prepare your enquiry.');
});

test('stay dates and email contact URLs reject malformed data and preserve real addresses', () => {
  assert.equal(validStay('2026-02-31','2026-03-01'),false);assert.equal(validStay('2026-02-28','2026-02-29'),false);assert.equal(validStay('2028-02-28','2028-02-29'),true);
  assert.equal(enquiryDestination('','owner@example.test?subject=Injected','Stay','Notes'),null);
  const contact=enquiryDestination('','owner+stay@example.test','A subject & details','A visitor message?');
  const url=new URL(contact.href);assert.equal(decodeURIComponent(url.pathname),'owner+stay@example.test');assert.equal(url.searchParams.get('subject'),'A subject & details');assert.equal(url.searchParams.get('body'),'A visitor message?');
});

test('Logistics home and service catalogue take each offering to its own usable detail page', () => {
  const data=defaultsFor('Logistics'),ctx={data,t:(field,tag='span')=>`<${tag} data-cms-field="${field}">${escape(data[field])}</${tag}>`,pic:()=>'',link:(page,label)=>`<a data-site-page="${page}" href="${profileBase('Logistics')}/${page}">${escape(label)}</a>`,enquiry:()=>''};
  for(const page of ['', 'services']) {
    const html=logisticsTemplate.renderPage(page,ctx);
    const offeringRows=[...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)];
    for(const [field,destination,titleField] of [['service1Title','freight','freightTitle'],['service2Title','warehouse','warehouseTitle'],['service3Title','distribution','distributionTitle']]) {
      const row=offeringRows.find(match=>match[1].includes('data-cms-field="'+field+'"'));
      assert.ok(row,'Logistics '+(page||'home')+' lacks the '+data[field]+' offering');
      const link=elements(row[1],'a').find(element=>'data-site-page' in element.attrs);
      assert.equal(link?.attrs['data-site-page'],destination,data[field]+' does not open its own detail page from '+(page||'home'));
      const detail=logisticsTemplate.renderPage(destination,ctx);
      assert.ok(detail.includes('data-cms-field="'+titleField+'"'),data[field]+' destination lacks its own detail content');
    }
  }
});
