/* Driver-only pickup UI, with server authorization as source of truth. */
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const src=fs.readFileSync('return-collections.js','utf8');
const driver=fs.readFileSync('driver.js','utf8');
const html=fs.readFileSync('index.html','utf8');
test('Driver pickup panel is additive and separated from deliveries',()=>{
 assert.match(src,/driver\/return-collections/);
 assert.match(driver,/collections:\['RETURN COLLECTIONS'/);
 assert.match(html,/src="return-collections\.js"/);
 assert.match(src,/fmv:driver-tab/);
});
test('Driver must enter customer PIN, not shown by assignment',()=>{
 assert.match(src,/input name="pickup_pin"/);
 assert.match(src,/\[0-9\]\{6\}/);
 assert.match(src,/condition/);
 assert.doesNotMatch(src,/derive_pin|pin_nonce/);
});