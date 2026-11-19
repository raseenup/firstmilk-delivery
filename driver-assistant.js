/* AI guidance for delivery drivers. Read-only, grounded in published company policy. */
(() => {
  'use strict';
  function build(){
    const root=document.createElement('aside');root.id='fmv-driver-assistant';root.className='fmv-floating-help';root.hidden=true;
    root.innerHTML=`<button type="button" class="fmv-chat-toggle" aria-expanded="false" aria-controls="fmv-driver-assistant-panel">✦ Ask First Milk AI</button>
      <section class="fmv-floating-panel" id="fmv-driver-assistant-panel" role="dialog" aria-label="Driver policy assistant" hidden>
        <h3>First Milk delivery assistant</h3><p class="fmv-small">Published company policies and guidance only. For emergency assistance use SOS or emergency services.</p>
        <div class="fmv-floating-feed" id="fmv-driver-assistant-feed" aria-live="polite"><p>Ask me about approved delivery policies.</p></div>
        <form class="fmv-floating-form"><label for="fmv-driver-assistant-input">Your question</label>
          <textarea id="fmv-driver-assistant-input" rows="2" maxlength="1200" required placeholder="What is our return collection policy?"></textarea>
          <button type="submit">Send question</button></form>
      </section>`;
    document.body.append(root);
    root.querySelector('.fmv-chat-toggle').addEventListener('click',()=>{
      const panel=document.getElementById('fmv-driver-assistant-panel');panel.hidden=!panel.hidden;
      root.querySelector('.fmv-chat-toggle').setAttribute('aria-expanded',String(!panel.hidden));
      if(!panel.hidden)document.getElementById('fmv-driver-assistant-input').focus();
    });
    root.querySelector('form').addEventListener('submit',async ev=>{
      ev.preventDefault();if(!FMV.user)return;
      const input=document.getElementById('fmv-driver-assistant-input');const question=input.value.trim();if(!question)return;
      input.value='';
      const feed=document.getElementById('fmv-driver-assistant-feed');
      const append=(message)=>{const p=document.createElement('p');p.textContent=message;feed.append(p);feed.scrollTop=feed.scrollHeight;};
      append('You: '+question);
      const button=ev.currentTarget.querySelector('button');button.disabled=true;
      try{const result=await FMV.request('/assistant/chat',{method:'POST',body:{message:question}});
        append('First Milk: '+result.reply);}
      catch(error){append('Unable to retrieve published guidance: '+error.message);}
      finally{button.disabled=false;}
    });
  }
  document.addEventListener('DOMContentLoaded',build);
  document.addEventListener('fmv:authenticated',()=>{
    if(document.getElementById('fmv-driver-assistant'))document.getElementById('fmv-driver-assistant').hidden=FMV.user?.portal!=='driver';
  });
  document.addEventListener('fmv:locked',()=>{
    if(document.getElementById('fmv-driver-assistant'))document.getElementById('fmv-driver-assistant').hidden=true;
    if(document.getElementById('fmv-driver-assistant-feed'))document.getElementById('fmv-driver-assistant-feed').replaceChildren();
  });
})();