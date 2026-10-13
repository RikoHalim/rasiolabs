import {test} from 'node:test';
import assert from 'node:assert/strict';
import {packageVolume,enquiryDestination,validStay} from '../dist/business-enquiry.mjs';
test('cargo calculator converts cm dimensions to cubic metres across packages',()=>{
 assert.equal(packageVolume(100,50,40,3),.6);
 assert.equal(packageVolume(10,20,30,1),.006);
 for(const args of [[0,10,20,1],[-1,10,20,1],[1201,10,20,1],[1,1,1,1.5],[1,1,1,100001],['x',1,1,1]])assert.throws(()=>packageVolume(...args));
});
test('business enquiries use only the actual client contact and URL-encode the brief',()=>{
 const wa=enquiryDestination('+62 8123456789','client@example.test','Stay enquiry','Room: Garden & Terrace\nNotes: <hello>');
 assert.match(wa.href,/^https:\/\/wa.me\/628123456789\?text=/);
 assert.equal(new URL(wa.href).searchParams.get('text'),'Stay enquiry\n\nRoom: Garden & Terrace\nNotes: <hello>');
 assert.equal(enquiryDestination('','owner@example.test','Event','Guests: 20').label,'Send by email');
 assert.equal(enquiryDestination('bad','bad','Shipment','Cargo'),null);
});
test('a hotel departure must be later than arrival',()=>{
 assert.equal(validStay('2026-11-01','2026-11-02'),true);
 assert.equal(validStay('2026-11-01','2026-11-01'),false);
 assert.equal(validStay('2026-11-02','2026-11-01'),false);
 assert.equal(validStay('','2026-11-02'),false);
});
