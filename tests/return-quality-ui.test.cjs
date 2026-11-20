const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const source=fs.readFileSync('return-collections.js','utf8');
test('Driver must explicitly declare additional damage and confirm attestation',()=>{
 assert.match(source,/name="additional_damage"/);
 assert.match(source,/name="attestation_confirmed"/);
 assert.match(source,/additionalDamage!==['"]none['"]/);
 assert.match(source,/attestation_confirmed:attested/);
 assert.match(source,/pickup_pin/);
 assert.doesNotMatch(source,/derive_pin|pin_nonce/);
});
test('Driver incident response only accesses own assigned case endpoint',()=>{
 assert.match(source,/\/driver\/return-quality/);
 assert.match(source,/data-driver-case-response/);
 assert.match(source,/statement:caseForm\.elements\.statement\.value/);
 assert.doesNotMatch(source,/\/admin\/return-quality/);
});