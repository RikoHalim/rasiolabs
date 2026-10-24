import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const script=await readFile(new URL('../dist/portal.js',import.meta.url),'utf8');
for(const orders of [[],[{id:'historical-order',businessName:'Bisnis tersimpan',reference:'OLD-01',duration:24,total:784800,status:'cancelled',statusLabel:'Dibatalkan',paymentStatus:'pending'}]]){
  test(`dashboard admin tetap memuat ${orders.length?'pesanan historis':'daftar kosong'} setelah perubahan kebijakan`,async()=>{
    const notices=[];
    const control={addEventListener(){},classList:{toggle(){}},set textContent(value){notices.push(value);}};
    const app={innerHTML:'',querySelector(selector){return selector.startsWith('[data-page-')?null:control;}};
    const context={
      document:{body:{dataset:{portal:'admin'}},querySelector(selector){return selector==='#app'?app:control;}},
      window:{addEventListener(){}},location:{hash:'',search:'',pathname:'/admin',replace(){throw new Error('Unexpected redirect');}},
      URLSearchParams,Blob,setTimeout(){return 0;},clearTimeout(){},
      fetch:async url=>({ok:true,json:async()=>url==='/api/session'?{role:'admin',csrf:'test'}:{orders,stats:{total:orders.length},hasMore:false}})
    };
    vm.runInNewContext(script,context);
    await new Promise(resolve=>setImmediate(resolve));
    assert.deepEqual(notices,[]);
    assert.match(app.innerHTML,/Pesanan website/);
    assert.match(app.innerHTML,/Dibatalkan \(historis\)/);
    assert.doesNotMatch(app.innerHTML,/Data belum dapat dimuat/);
    assert.match(app.innerHTML,orders.length?/Bisnis tersimpan/:/Belum ada pesanan/);
  });
}
