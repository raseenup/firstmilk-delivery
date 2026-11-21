/* Driver announcements do not affect delivery and require click-to-play. */
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const script=fs.readFileSync('driver-promotions.js','utf8');
const html=fs.readFileSync('index.html','utf8');
test('Driver promotions use existing authenticated, schedule-filtered campaign API',()=>{
  assert.match(script,/FMV\.request\('\/content'\)/);
  assert.match(script,/item\.placement==='driver'/);
  assert.match(script,/FMV\.user\?\.portal!=='driver'/);
  assert.match(script,/FMV\.token!==session/);
  assert.match(html,/driver-promotions\.js/);
});
test('No auto-loading 50MB video until user clicks to play',()=>{
  assert.match(script,/data-driver-promo-play/);
  assert.match(script,/event\.target\.closest/);
  assert.match(script,/video\.preload='metadata'/);
  assert.match(script,/loading="lazy"/);
  assert.doesNotMatch(script,/<video[^>]*autoplay/);
  assert.match(script,/replaceWith\(video\)/);
});
test('Promotions never read another portal confidential data',()=>{
  assert.doesNotMatch(script,/localStorage\.getItem/);
  assert.doesNotMatch(script,/customer_email|customer_phone|driver_earnings|pickup_pin/);
  assert.match(script,/FMV\.escape/);
});
