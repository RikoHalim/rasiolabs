import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {readSelection,selectionHref} from '../dist/selection.js';
import {initTemplateSelection} from '../dist/template-selection.js';
import {getPlan,productionGate} from '../server/policy-v4.mjs';
import {templateCatalog} from '../server/template-catalog.mjs';
import {redirectLegacyOrder} from '../dist/checkout-selection.js';
import {initTabs} from '../dist/marketing/interactions.js';
import {getBuildPaths} from '../scripts/build-paths.mjs';

const {dist,concept}=await getBuildPaths();
const homepageOutputs=[path.join(dist,'index.html'),...(concept?[path.join(concept,'index-v3.html')]:[])];

const origin='http://localhost:4184';
const home=origin+'/UI%20Concepts/2026-10-14/index-v3.html';
const preview=origin+'/template-padel.html';
const checkout=origin+'/checkout-v4.html';
const choice=(months,service='profile')=>readSelection(`${home}?type=${service}${service==='profile'?'&template=Padel':''}&duration=${months}`);
const expectedProfile=[[1,109000,109000,false],[12,54500,654000,true],[24,32000,768000,true],[48,27750,1332000,true]];
const expectedStore=[[1,299000,299000,false],[12,179000,2148000,true],[24,149000,3576000,true],[48,129000,6192000,true]];

test('WEB-01: direct choice and a fresh-tab preview retain every approved Profile package',()=>{
  assert.deepEqual(templateCatalog.map(t=>t.id),['Padel']);
  for(const [months,monthly,total,domain] of expectedProfile){
    const selected=choice(months);
    const direct=readSelection(selectionHref(checkout,selected,home));
    const previewHref=selectionHref(preview,selected,home);
    // Reparse the native href, as a new tab does, without shared in-memory state.
    const freshPreview=readSelection(new URL(previewHref,home));
    const fromPreview=readSelection(selectionHref(checkout,freshPreview,previewHref));
    for(const result of [selected,direct,freshPreview,fromPreview]){
      assert.equal(result.complete,true,`${months} months must remain a complete selection`);
      assert.deepEqual(result.errors,[]);
      assert.equal(result.service,'profile');
      assert.equal(result.template,'Padel');
      assert.equal(result.months,months);
      assert.deepEqual(result.plan,getPlan('profile',months));
      assert.equal(result.plan.monthlyEquivalent,monthly);
      assert.equal(result.plan.totalPrice,total);
      assert.equal(result.plan.freeDomainFirstYear,domain);
    }
  }
});

test('WEB-01: every enabled homepage output provides complete native selection links before interaction',async()=>{
  for(const file of homepageOutputs){
    const html=await readFile(file,'utf8');
    const actions=[...html.matchAll(/<a\b([^>]*)>/g)].filter(match=>/\bdata-template-(?:choice|preview)\b/.test(match[1]));
    assert.equal(actions.length,3,`${file}: choose button, preview button and thumbnail`);
    for(const action of actions){
      const href=action[1].match(/\bhref="([^"]+)"/)?.[1].replaceAll('&amp;','&');
      assert.ok(href);
      const state=readSelection(new URL(href,home));
      assert.equal(state.complete,true,href);
      assert.equal(state.service,'profile');
      assert.equal(state.template,'Padel');
      assert.equal(state.months,48);
      assert.equal(state.plan.totalPrice,1332000);
    }
  }
});

test('WEB-01: Store keeps its own explicit prices and cannot borrow a Profile template',()=>{
  for(const [months,monthly,total,domain] of expectedStore){
    const result=readSelection(selectionHref(checkout,choice(months,'store'),home));
    assert.equal(result.service,'store');
    assert.equal(result.months,months);
    assert.deepEqual(result.plan,getPlan('store',months));
    assert.equal(result.plan.monthlyEquivalent,monthly);
    assert.equal(result.plan.totalPrice,total);
    assert.equal(result.plan.freeDomainFirstYear,domain);
  }
  const incompatible=readSelection(`${checkout}?type=store&template=Padel&duration=1`);
  assert.ok(incompatible.errors.length);
  assert.equal(incompatible.complete,false);
  assert.equal(incompatible.plan,null);
});

test('WEB-01: refresh and browser history can reconstruct each selection solely from its URL',()=>{
  const history=expectedProfile.map(([months])=>selectionHref(checkout,choice(months),home));
  for(const index of [0,1,2,3,2,1,0,1,2,3]){
    const refreshed=readSelection(new URL(history[index]));
    assert.equal(refreshed.months,expectedProfile[index][0]);
    assert.equal(refreshed.plan.totalPrice,expectedProfile[index][2]);
    assert.equal(refreshed.template,'Padel');
  }
});

test('WEB-01: a direct preview without a package remains incomplete, with no implicit 24/48-month charge',()=>{
  const direct=readSelection(`${preview}?type=profile&template=Padel`);
  assert.deepEqual(direct.errors,[]);
  assert.equal(direct.months,null);
  assert.equal(direct.complete,false);
  assert.equal(direct.plan,null);
  const next=readSelection(selectionHref(checkout,direct,preview));
  assert.equal(next.template,'Padel');
  assert.equal(next.months,null);
  assert.equal(next.plan,null);
  const empty=readSelection(preview);
  assert.equal(empty.complete,false);
  assert.equal(empty.plan,null);
});

test('WEB-01: malformed or duplicate selections cannot silently become another payable package',()=>{
  const invalidDurations=['','0','2','36','01','1.0','1e0',' 24 ','-1','24.5','Infinity','NaN','12months'];
  const queries=[
    ...invalidDurations.map(value=>`type=profile&template=Padel&duration=${encodeURIComponent(value)}`),
    'type=profile&template=Padel&duration=1&duration=48',
    'type=profile&template=Padel&duration=1&duration=1',
    'type=profile&type=store&template=Padel&duration=1',
    'type=profile&template=Padel&template=Padel&duration=1',
    'type=profile&template=Architecture&duration=1',
    'type=profile&template=padel&duration=1',
    'type=unknown&template=Padel&duration=1'
  ];
  for(const query of queries){
    const result=readSelection(`${checkout}?${query}`);
    assert.ok(result.errors.length,query);
    assert.equal(result.complete,false,query);
    assert.equal(result.plan,null,query);
  }
});

test('WEB-01: Custom remains a quotation, without a silently substituted subscription price',()=>{
  const custom=readSelection(`${checkout}?type=custom&duration=1`);
  assert.equal(custom.service,'custom');
  assert.equal(custom.complete,false);
  assert.equal(custom.plan,null);
});

test('WEB-01: invalid raw state remains actionable across links instead of being silently discarded',()=>{
  for(const query of [
    'type=profile&template=Removed&duration=1',
    'type=profile&template=Padel&duration=1&duration=48',
    'type=profile&template=Padel&duration=01'
  ]){
    const source=new URL(`${home}?${query}`);
    const result=new URL(selectionHref(`${checkout}?type=store&duration=24`,readSelection(source),home),home);
    for(const key of ['type','template','duration'])assert.deepEqual(result.searchParams.getAll(key),source.searchParams.getAll(key),key);
    assert.ok(readSelection(result).errors.length);
    assert.equal(readSelection(result).plan,null);
  }
});

test('WEB-01: service-change return links use the current section and retain relevant choice',()=>{
  for(const [months,,total] of expectedProfile){
    const back=new URL(selectionHref('/#layanan',choice(months),checkout),checkout);
    assert.equal(back.hash,'#layanan');
    assert.equal(back.searchParams.get('duration'),String(months));
    assert.equal(back.searchParams.get('type'),'profile');
    assert.equal(back.searchParams.get('template'),'Padel');
    assert.equal(readSelection(back).plan.totalPrice,total);
  }
});

test('WEB-01: selection-only changes do not open a production operation',()=>{
  assert.equal(Object.values(productionGate).some(value=>value===true),false);
});

function previewDocument(html,href){
  const match=html.match(/<div class="template-access">[\s\S]*?<\/div>/);
  assert.ok(match,'The template selection bar remains available in preview output.');
  const start=match.index,end=start+match[0].length;
  const inBar=new Set();
  const links=[...html.matchAll(/<a\b([^>]*\bhref="([^"]*)"[^>]*)>([\s\S]*?)<\/a>/g)].map(anchor=>{
    const attrs=anchor[1],original=anchor[2].replaceAll('&amp;','&');
    const link={
      href:new URL(original,href).href,textContent:anchor[3].replace(/<[^>]*>/g,''),
      getAttribute:name=>name==='href'?original:null,
      matches:selector=>selector==='[data-use-template]'&&/\bdata-use-template\b/.test(attrs)
    };
    if(anchor.index>=start&&anchor.index<end)inBar.add(link);
    return link;
  });
  let error;
  const bar={contains:link=>inBar.has(link),querySelector:()=>error||null,append:node=>{error=node;}};
  return {
    links,barLinks:[...inBar],get error(){return error;},
    querySelector:selector=>selector==='.template-access'?bar:null,
    querySelectorAll:selector=>selector==='a[href]'?links:[],
    createElement:()=>({dataset:{},setAttribute(){}})
  };
}

function previewEnvironment(t,href){
  const previous={location:Object.getOwnPropertyDescriptor(globalThis,'location'),addEventListener:Object.getOwnPropertyDescriptor(globalThis,'addEventListener')};
  const listeners=new Map();
  Object.defineProperty(globalThis,'location',{value:new URL(href),configurable:true,writable:true});
  Object.defineProperty(globalThis,'addEventListener',{value:(name,handler)=>listeners.set(name,handler),configurable:true,writable:true});
  t.after(()=>{for(const [name,descriptor] of Object.entries(previous))descriptor?Object.defineProperty(globalThis,name,descriptor):delete globalThis[name];});
  return listeners;
}

test('WEB-01: every built Padel page rewrites native preview navigation and order links for all durations',async t=>{
  const files=(await readdir(new URL('../templates/padel/pages/',import.meta.url))).filter(file=>file.endsWith('.html'));
  assert.equal(files.length,10);
  previewEnvironment(t,preview);
  for(const file of files){
    const html=await readFile(new URL('../dist/'+file,import.meta.url),'utf8');
    assert.match(html,/type="module"[^>]*src="\/template-selection\.js"|src="\/template-selection\.js"[^>]*type="module"/);
    for(const [months,,total] of expectedProfile){
      const href=selectionHref(origin+'/'+file,choice(months),home);
      globalThis.location.href=href;
      const root=previewDocument(html,href);
      initTemplateSelection(root);
      const action=root.barLinks.find(link=>link.matches('[data-use-template]'));
      assert.ok(action,`${file}: usable order CTA`);
      const selected=readSelection(action.href);
      assert.equal(new URL(action.href).pathname,'/checkout-v4.html');
      assert.equal(selected.months,months,`${file}: checkout duration`);
      assert.equal(selected.template,'Padel');
      assert.equal(selected.plan.totalPrice,total);
      const internal=root.links.filter(link=>/^\/template-padel(?:[/.\-]|$)/.test(new URL(link.href).pathname));
      assert.ok(internal.length,`${file}: real internal pages remain linked`);
      for(const link of internal){
        const target=readSelection(link.href);
        assert.equal(target.months,months,`${file}: ${link.href}`);
        assert.equal(target.template,'Padel');
        assert.equal(target.plan.totalPrice,total);
      }
      const back=root.barLinks.find(link=>link!==action);
      assert.equal(new URL(back.href).hash,'#template');
      assert.equal(readSelection(back.href).months,months);
    }
  }
});

test('WEB-01: direct preview requests a package; refresh/history events restore native action URLs',async t=>{
  const listeners=previewEnvironment(t,preview);
  const root=previewDocument(await readFile(new URL('../dist/template-padel.html',import.meta.url),'utf8'),preview);
  initTemplateSelection(root);
  const action=root.barLinks.find(link=>link.matches('[data-use-template]'));
  assert.equal(action.textContent,'Pilih paket');
  assert.equal(readSelection(action.href).months,null);
  assert.equal(readSelection(action.href).template,'Padel');
  for(const [event,months] of [['popstate',1],['pageshow',48],['popstate',12],['pageshow',24]]){
    assert.equal(typeof listeners.get(event),'function');
    globalThis.location.href=selectionHref(preview,choice(months),home);
    listeners.get(event)();
    assert.equal(readSelection(action.href).months,months);
    assert.equal(readSelection(action.href).plan.totalPrice,getPlan('profile',months).totalPrice);
  }
});

test('WEB-01: selection code is inert on a published client site without the preview bar',()=>{
  assert.doesNotThrow(()=>initTemplateSelection({
    querySelector:()=>null,
    querySelectorAll(){throw new Error('Client navigation must not be changed.');}
  }));
});

test('WEB-01: legacy order passes the original query to the existing summary, including missing/invalid duration',t=>{
  previewEnvironment(t,origin+'/order?type=profile&template=Padel&duration=1');
  const prior=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{value:{querySelector:()=>({})},configurable:true});
  t.after(()=>prior?Object.defineProperty(globalThis,'document',prior):delete globalThis.document);
  for(const query of ['type=profile&template=Padel&duration=1','type=profile&template=Padel','type=profile&template=Padel&duration=2','type=profile&template=missing&duration=12','type=custom&duration=2','type=custom&type=profile']){
    const original=new URL(origin+'/order?'+query);let replacement;
    Object.defineProperty(globalThis,'location',{value:{href:original.href,search:original.search,replace:href=>{replacement=href;}},configurable:true});
    assert.equal(redirectLegacyOrder(),true);
    const next=new URL(replacement);
    assert.equal(next.pathname,'/checkout-v4.html');assert.equal(next.search,original.search);
  }
  Object.defineProperty(globalThis,'location',{value:new URL(origin+'/order?type=custom'),configurable:true});
  assert.equal(redirectLegacyOrder(),false,'Valid legacy Custom consultation is unchanged');
});

test('WEB-01: service tabs restore URL choice and keep duration through refresh and history',t=>{
  const listeners=previewEnvironment(t,origin+'/?type=store&duration=12#layanan');
  const previous={history:Object.getOwnPropertyDescriptor(globalThis,'history'),dispatchEvent:Object.getOwnPropertyDescriptor(globalThis,'dispatchEvent')};
  Object.defineProperty(globalThis,'history',{value:{pushState(_state,_title,href){globalThis.location.href=href;}},configurable:true});
  Object.defineProperty(globalThis,'dispatchEvent',{value:()=>{},configurable:true});
  t.after(()=>{for(const [key,descriptor] of Object.entries(previous))descriptor?Object.defineProperty(globalThis,key,descriptor):delete globalThis[key];});
  const panels=new Map(['profile','store','custom'].map(name=>['product-'+name,{hidden:true}]));
  const tabs=[...panels.keys()].map(id=>({handlers:{},attrs:{'aria-controls':id},getAttribute(key){return this.attrs[key];},setAttribute(key,value){this.attrs[key]=value;},addEventListener(key,fn){this.handlers[key]=fn;}}));
  const list={querySelectorAll:()=>tabs};
  initTabs({querySelectorAll:()=>[list],getElementById:id=>panels.get(id)});
  assert.equal(panels.get('product-store').hidden,false);
  globalThis.location.href=origin+'/?type=profile&template=Padel&duration=1#layanan';listeners.get('popstate')();
  assert.equal(panels.get('product-profile').hidden,false);
  tabs[1].handlers.click();
  assert.equal(readSelection(globalThis.location.href).service,'store');
  assert.equal(readSelection(globalThis.location.href).months,1);
  assert.equal(readSelection(globalThis.location.href).template,'');
  listeners.get('pageshow')();assert.equal(panels.get('product-store').hidden,false);
});
