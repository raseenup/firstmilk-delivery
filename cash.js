/* A submitted handover stays outstanding until accounts confirms receipt. */
(() => {
  'use strict';
  let cash=null,key='';
  const $=id=>document.getElementById(id),e=value=>FMV.escape(value);
  function render(value,notifications){
    cash=value;
    FMV.setHTML('fmv-cash-detail',`<div class="fmv-success-banner"><strong>Outstanding cash · all dates</strong><p class="fmv-driver-cash-total">${FMV.money(cash.net_cash_to_remit)}</p><p>COD collections less approved expenses and cash received by accounts.</p>${cash.reimbursement_due>0?`<p>Accounts owes you ${FMV.money(cash.reimbursement_due)} for approved expenses.</p>`:''}<button type="button" class="fmv-btn" id="fmv-submit-handover" ${cash.available_to_submit<=0?'disabled':''}>Submit cash handover</button></div><div class="driver-finance-grid"><div class="driver-finance-metric"><span>COD collected · all dates</span><strong>${FMV.money(cash.lifetime_cod_collected)}</strong></div><div class="driver-finance-metric"><span>Received by accounts</span><strong>${FMV.money(cash.cash_received)}</strong></div><div class="driver-finance-metric"><span>Approved expenses</span><strong>${FMV.money(cash.approved_expenses)}</strong></div><div class="driver-finance-metric"><span>Expenses awaiting review</span><strong>${FMV.money(cash.pending_expenses)}</strong></div></div><p class="fmv-small">Handovers awaiting confirmation: ${FMV.money(cash.pending_handover)}. Pending expenses and handovers do not clear the amount you account for.</p><h3>Cash handovers</h3>${cash.handovers.slice().reverse().map(h=>`<div class="driver-expense-row"><div><strong>${e(h.reference)}</strong><p>${e(h.status)} · ${e(h.created_at)}</p></div><strong>${FMV.money(h.amount)}</strong></div>`).join('') || FMV.empty('No handovers submitted. Accounts can also record cash received directly.')}<h3>Accounts receipts</h3>${cash.receipts.slice().reverse().map(r=>`<div class="driver-expense-row"><div><strong>${e(r.reference)}</strong><p>${e(r.received_at)}<br>Received by ${e(r.received_by)}</p></div><strong>${FMV.money(r.amount)}</strong></div>`).join('') || FMV.empty('Accounts receipts will appear after cash is received.')}<h3>Expense activity · all dates</h3>${cash.expenses.slice().reverse().map(exp=>`<div class="driver-expense-row"><div><strong>${e(exp.category)}</strong><p>${e(exp.date)} · ${e(exp.approval_status || 'pending')}</p></div><strong>${FMV.money(exp.amount)}</strong></div>`).join('') || FMV.empty('No recorded expenses.')}`);
    $('fmv-submit-handover')?.addEventListener('click',()=>{
      const form=$('fmv-cash-handover-form');form.reset();key=crypto.randomUUID().replaceAll('-','');form.elements.amount.max=cash.available_to_submit;form.elements.amount.value=cash.available_to_submit;$('fmv-handover-error').textContent='';$('fmv-cash-handover-dialog').showModal();
    });
    FMV.setHTML('fmv-driver-notification-list',notifications.slice().reverse().map(n=>`<article class="fmv-success-banner"><strong>${e(n.title)}</strong><p>${e(n.message)}</p></article>`).join('') || FMV.empty('No profile notifications.'));
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const dialog=document.createElement('dialog');dialog.id='fmv-cash-handover-dialog';dialog.className='fmv-handover-dialog';dialog.setAttribute('aria-labelledby','fmv-handover-title');
    dialog.innerHTML='<div class="fmv-row"><h2 id="fmv-handover-title">Submit cash handover</h2><button type="button" class="fmv-btn secondary" id="fmv-close-handover">Close</button></div><p>Your outstanding cash clears after accounts confirms receiving it.</p><form id="fmv-cash-handover-form"><label>Cash handed to accounts (INR)<input name="amount" type="number" min="0.01" step="0.01" required></label><label>Handover reference<input name="reference" maxlength="200" required placeholder="Who received the cash / deposit reference"></label><p id="fmv-handover-error" role="alert"></p><button class="fmv-btn" type="submit">Submit for confirmation</button></form>';
    document.body.append(dialog);$('fmv-close-handover').addEventListener('click',()=>dialog.close());
    $('fmv-cash-handover-form').addEventListener('submit',async event=>{
      event.preventDefault();const form=event.currentTarget,button=form.querySelector('[type=submit]');if(button.disabled)return;button.disabled=true;
      try{
        const result=await FMV.request('/driver/cash/handovers',{method:'POST',headers:{'Idempotency-Key':key},body:{amount:Number(form.elements.amount.value),reference:form.elements.reference.value.trim()}});
        dialog.close();FMV.notice(result.message || 'This handover has already been submitted.');await refreshDriver();
      }catch(error){$('fmv-handover-error').textContent=error.message;}finally{button.disabled=false;}
    });
    const notifications=document.createElement('section');notifications.id='fmv-driver-notifications';notifications.className='fmv-panel';notifications.innerHTML='<h3>Profile notifications</h3><div id="fmv-driver-notification-list"></div>';$('profile-view').append(notifications);
  });
  document.addEventListener('fmv:locked',()=>{cash=null;$('fmv-cash-handover-dialog')?.close();$('fmv-cash-handover-form')?.reset();$('fmv-cash-detail')?.replaceChildren();$('fmv-driver-notification-list')?.replaceChildren();});
  window.FMVDriverCash={render};
})();
