/* Assigned physical return pickups. The driver never sees the customer PIN. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=x=>FMV.escape(x??'');
  const api=(url,options)=>FMV.request(url,options);
  let items=[],cases=[],busy=null,lastFetch=0,active=false;
  function build(){
    const dashboard=$('dashboard-view');if(!dashboard)return;
    const pane=document.createElement('section');pane.id='fmv-driver-collections';
    pane.className='fmv-driver-pane hidden fmv-collection-workspace';pane.setAttribute('role','tabpanel');
    pane.setAttribute('aria-labelledby','driver-tab-collections');
    pane.innerHTML=`<div class="driver-section-heading"><div><span class="driver-eyebrow">VERIFIED RETURN PICKUPS</span>
      <h3>Collect returned items</h3><p>Confirm the actual item and ask the customer for their six-digit pickup code. Do not request their sign-in password or delivery PIN.</p></div>
      <button class="fmv-btn secondary" type="button" id="fmv-driver-refresh-pickups">Refresh</button></div>
      <p class="fmv-small" id="fmv-driver-pickup-status" role="status"></p>
      <div id="fmv-driver-pickup-list" class="fmv-driver-pickup-list"></div>
      <section class="fmv-driver-incident-section"><h3>Quality reviews & driver statements</h3>
        <p class="fmv-small">Yard discrepancies are reviewed independently. You may provide your explanation and evidence before an accounts decision.</p>
        <div id="fmv-driver-quality-cases" class="fmv-driver-pickup-list"></div></section>`;
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
      active=false;items=[];cases=[];busy=null;lastFetch=0;
      $('fmv-driver-pickup-list')?.replaceChildren();
      $('fmv-driver-quality-cases')?.replaceChildren();
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
          <label class="fmv-studio-label">Any new damage while collecting or transporting?
            <select name="additional_damage" required>
              <option value="">Select your inspection finding</option>
              <option value="none">No additional damage observed</option>
              <option value="observed">Additional damage observed</option>
              <option value="uncertain">Unable to verify condition</option>
            </select></label>
          <label class="fmv-studio-label">Condition notes<textarea name="note" maxlength="700" rows="3" placeholder="Record condition, seal, handling and any damage"></textarea></label>
          <label class="fmv-studio-label fmv-check"><input type="checkbox" name="attestation_confirmed"> I physically inspected the item and confirm the statement is accurate.</label>
          <p class="fmv-small">You must report any new damage or uncertainty. This statement is kept in an audit record and can be reviewed by the yard team.</p>
          <button class="fmv-btn" type="submit">Verify pickup PIN & record inspection</button>
        </form>`:`<p class="fmv-small">Collected at ${esc(item.collected_at || 'Recorded')}. Give the item to the assigned collection hub for warehouse verification.</p>`}
      </article>`;
    }).join('') || '<p class="fmv-small">There are no return collections currently assigned to you.</p>';
    $('fmv-driver-pickup-status').textContent=sorted.filter(x=>x.status==='scheduled').length+' pending return pickups';
    const target=$('fmv-driver-quality-cases');if(!target)return;
    target.innerHTML=cases.map(item=>`<article class="fmv-driver-pickup-card">
      <strong>Return ${esc(item.id)} · ${esc(String(item.status).replaceAll('_',' '))}</strong>
      <p>${esc(item.summary || 'Return quality discrepancy is under review.')}</p>
      ${item.decision?`<p>Decision: ${esc(item.decision.replaceAll('_',' '))}</p>`:''}
      ${item.driver_response?`<p>Your submitted response: ${esc(item.driver_response)}</p>`:''}
      ${item.status==='awaiting_driver_response' && !item.driver_response?
        `<form class="fmv-driver-pickup-form" data-driver-case-response="${esc(item.id)}">
           <label class="fmv-studio-label">Your statement about pickup and handling
             <textarea name="statement" rows="4" minlength="20" maxlength="1800" required
              placeholder="Describe collection condition and handling, with facts and dates"></textarea></label>
           <label class="fmv-studio-label">Supporting evidence reference
             <input name="evidence_reference" maxlength="180" placeholder="Incident/photo reference, if available"></label>
           <button class="fmv-btn" type="submit">Submit explanation for review</button>
         </form>`:''
      }</article>`).join('')||'<p class="fmv-small">No quality incidents or action required.</p>';
  }
  async function load(force=false){
    if(FMV.user?.portal!=='driver')return;
    if(busy)return busy;
    if(!force && Date.now()-lastFetch<15000){render();return;}
    const owner=FMV.user.id;
    busy=(async()=>{
      const [response,review]=await Promise.all([
        api('/driver/return-collections'),api('/driver/return-quality')
      ]);
      if(FMV.user?.id!==owner)return;
      items=Array.isArray(response.pickups)?response.pickups:[];
      cases=Array.isArray(review.cases)?review.cases:[];
      lastFetch=Date.now();
      render();
    })().finally(()=>{busy=null;});
    return busy;
  }
  async function submit(event){
    const caseForm=event.target.closest('[data-driver-case-response]');
    if(caseForm){
      event.preventDefault();if(FMV.user?.portal!=='driver'||!caseForm.reportValidity())return;
      const submitButton=caseForm.querySelector('button');submitButton.disabled=true;
      try{
        await api('/driver/return-quality/'+encodeURIComponent(caseForm.dataset.driverCaseResponse)+'/response',{
          method:'POST',body:{statement:caseForm.elements.statement.value,
            evidence_reference:caseForm.elements.evidence_reference.value}
        });
        FMV.notice('Your quality incident explanation has been recorded.');
        lastFetch=0;await load(true);
      }catch(error){FMV.notice(error.message,true);}
      finally{submitButton.disabled=false;}
      return;
    }
    const form=event.target.closest('[data-driver-return-form]');if(!form)return;
    event.preventDefault();if(FMV.user?.portal!=='driver'||!form.reportValidity())return;
    const id=form.dataset.driverReturnForm,button=form.querySelector('button[type=submit]');
    const additionalDamage=form.elements.additional_damage.value;
    const attested=form.elements.attestation_confirmed.checked;
    if(!additionalDamage || !attested){
      FMV.notice('Inspect the item and confirm your condition statement before collection.',true);return;
    }
    if(additionalDamage!=='none' && form.elements.note.value.trim().length<12){
      FMV.notice('Describe all observed damage or uncertainty before submitting.',true);return;
    }
    if(!confirm('Confirm that you physically collected the item and checked its condition?'))return;
    button.disabled=true;
    try{
      const payload={pickup_pin:form.elements.pickup_pin.value.trim(),
        condition:form.elements.condition.value,note:form.elements.note.value,
        additional_damage:additionalDamage,attestation_confirmed:attested};
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