/* Assigned physical return pickups. The driver never sees the customer PIN. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=x=>FMV.escape(x??'');
  const api=(url,options)=>FMV.request(url,options);
  let items=[],busy=null,lastFetch=0,active=false;
  function build(){
    const dashboard=$('dashboard-view');if(!dashboard)return;
    const pane=document.createElement('section');pane.id='fmv-driver-collections';
    pane.className='fmv-driver-pane hidden fmv-collection-workspace';pane.setAttribute('role','tabpanel');
    pane.setAttribute('aria-labelledby','driver-tab-collections');
    pane.innerHTML=`<div class="driver-section-heading"><div><span class="driver-eyebrow">VERIFIED RETURN PICKUPS</span>
      <h3>Collect returned items</h3><p>Confirm the actual item and ask the customer for their six-digit pickup code. Do not request their sign-in password or delivery PIN.</p></div>
      <button class="fmv-btn secondary" type="button" id="fmv-driver-refresh-pickups">Refresh</button></div>
      <p class="fmv-small" id="fmv-driver-pickup-status" role="status"></p>
      <div id="fmv-driver-pickup-list" class="fmv-driver-pickup-list"></div>`;
    dashboard.append(pane);
    $('fmv-driver-refresh-pickups').addEventListener('click',()=>FMV.guard(()=>load(true)));
    $('fmv-driver-pickup-list').addEventListener('submit',ev=>FMV.guard(()=>submit(ev)));
    document.addEventListener('fmv:driver-tab',ev=>{
      active=ev.detail==='collections';
      if(active)FMV.guard(()=>load());
    });
    document.addEventListener('fmv:sync',()=>{
      if(active && Date.now()-lastFetch>20000)FMV.guard(()=>load());
    });
    document.addEventListener('fmv:locked',()=>{
      active=false;items=[];busy=null;lastFetch=0;
      $('fmv-driver-pickup-list')?.replaceChildren();
    });
  }
  function render(){
    const list=$('fmv-driver-pickup-list');if(!list)return;
    const sorted=items.slice().sort((a,b)=>String(b.scheduled_date).localeCompare(String(a.scheduled_date)));
    list.innerHTML=sorted.map(item=>{
      const pending=item.status==='scheduled';
      return `<article class="fmv-driver-pickup-card">
        <div class="fmv-flex"><strong>Return ${esc(item.id)}</strong><span class="fmv-return-state">${esc(item.status)}</span></div>
        <p><strong>Order:</strong> ${esc(item.order_number)}</p>
        <p><strong>Pickup date:</strong> ${esc(item.scheduled_date)}</p>
        <p><strong>Customer:</strong> ${esc(item.customer_name)}</p>
        <p><strong>Phone:</strong> ${esc(item.customer_phone || 'Not provided')}</p>
        <p><strong>Pickup address:</strong> ${esc(item.pickup_address)}</p>
        <p><strong>Items:</strong> ${esc(item.items_summary)}</p>
        <p class="fmv-small">${esc(item.instructions)}</p>
        ${item.note?`<p class="fmv-small">Manager note: ${esc(item.note)}</p>`:''}
        ${pending?`<form data-driver-return-form="${esc(item.id)}" class="fmv-driver-pickup-form">
          <label class="fmv-studio-label">Customer pickup PIN (six digits)
            <input name="pickup_pin" type="text" pattern="[0-9]{6}" maxlength="6" inputmode="numeric"
              autocomplete="one-time-code" required aria-label="Customer-provided return pickup PIN"></label>
          <label class="fmv-studio-label">Item condition
            <select name="condition" required>
              <option value="sealed">Sealed</option><option value="opened">Opened</option>
              <option value="damaged">Damaged</option><option value="other">Other</option>
            </select></label>
          <label class="fmv-studio-label">Collection notes<textarea name="note" maxlength="700" rows="2" placeholder="Condition details (optional)"></textarea></label>
          <button class="fmv-btn" type="submit">Verify PIN & confirm collection</button>
        </form>`:`<p class="fmv-small">Collected at ${esc(item.collected_at || 'Recorded')}. Give the item to the assigned collection hub for warehouse verification.</p>`}
      </article>`;
    }).join('') || '<p class="fmv-small">There are no return collections currently assigned to you.</p>';
    $('fmv-driver-pickup-status').textContent=sorted.filter(x=>x.status==='scheduled').length+' pending return pickups';
  }
  async function load(force=false){
    if(FMV.user?.portal!=='driver')return;
    if(busy)return busy;
    if(!force && Date.now()-lastFetch<15000){render();return;}
    const owner=FMV.user.id;
    busy=(async()=>{
      const response=await api('/driver/return-collections');
      if(FMV.user?.id!==owner)return;
      items=Array.isArray(response.pickups)?response.pickups:[];
      lastFetch=Date.now();
      render();
    })().finally(()=>{busy=null;});
    return busy;
  }
  async function submit(event){
    const form=event.target.closest('[data-driver-return-form]');if(!form)return;
    event.preventDefault();if(FMV.user?.portal!=='driver'||!form.reportValidity())return;
    const id=form.dataset.driverReturnForm,button=form.querySelector('button[type=submit]');
    if(!confirm('Confirm that you physically collected the item and checked its condition?'))return;
    button.disabled=true;
    try{
      const payload={pickup_pin:form.elements.pickup_pin.value.trim(),
        condition:form.elements.condition.value,note:form.elements.note.value};
      const data=await api('/driver/return-collections/'+encodeURIComponent(id)+'/collect',{
        method:'POST',body:payload});
      FMV.notice(data.message || 'Return item collection recorded.');
      lastFetch=0;await load(true);
    }catch(error){
      FMV.notice(error.message,true);
      // Do not retain PIN in the input after any failed attempt.
      form.elements.pickup_pin.value='';
    }finally{button.disabled=false;}
  }
  document.addEventListener('DOMContentLoaded',build);
})();