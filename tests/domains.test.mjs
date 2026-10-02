import test from 'node:test';
import assert from 'node:assert/strict';
import {domainPrices,domainFee,quotedDomainFee} from '../server/domains.mjs';

test('tarif domain hanya memakai harga tahunan valid; tarif kosong tidak menjadi gratis',()=>{
  const fixture=JSON.stringify({com:150000,id:240000,'co.id':310000,net:9999});
  assert.deepEqual(domainPrices(fixture),{com:150000,id:240000,'co.id':310000});
  assert.equal(domainFee(1,'studio.co.id',fixture),310000);
  assert.equal(domainFee(1,'studio.com',undefined),null);
  for(const duration of [12,24,48])assert.equal(domainFee(duration,'studio.com',undefined),0);
  for(const raw of [undefined,'invalid','null','{}','{"com":0,"id":-1,"co.id":"100000"}','{"com":100000001}'])assert.deepEqual(domainPrices(raw),{});
});

test('kutipan domain tidak menambah biaya paket gratis atau mengubah tarif yang sudah dibayar',()=>{
  const paid={domain_included:0,domain_fee:null,payment_status:'pending'};
  assert.equal(quotedDomainFee(paid,undefined),null);
  assert.equal(quotedDomainFee(paid,180000),180000);
  for(const fee of [0,-1,1.5,'150000',100000001])assert.throws(()=>quotedDomainFee(paid,fee));
  const settled={...paid,domain_fee:180000,payment_status:'verified'};
  assert.equal(quotedDomainFee(settled,undefined),180000);
  for(const fee of [null,200000])assert.throws(()=>quotedDomainFee(settled,fee));
  assert.throws(()=>quotedDomainFee({domain_included:1,domain_fee:0},180000));
});
