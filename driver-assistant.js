/* AI guidance for delivery drivers. Read-only, grounded in published company policy. */
(() => {
  'use strict';
  function build(){
    const profile=document.getElementById('profile-view');if(!profile)return;
    // Keep FMV AI in the driver's Profile screen, not over every page.
    const root=document.createElement('section');root.id='fmv-driver-assistant';root.className='fmv-driver-inline-ai fmv-panel';
    root.setAttribute('aria-label','FMV AI driver policy assistant');
    root.innerHTML=`<h3>FMV AI</h3><p class="fmv-small">Ask FMV AI about published company delivery and return policies. For urgent assistance, use SOS or contact emergency services.</p>
        <div class="fmv-inline-chat-feed" id="fmv-driver-assistant-feed" aria-live="polite"><p>Welcome. Ask FMV AI about company policies.</p></div>
        <form class="fmv-floating-form"><label for="fmv-driver-assistant-input">Ask FMV AI</label>
          <textarea id="fmv-driver-assistant-input" rows="3" maxlength="1200" required placeholder="What is our return collection policy?"></textarea>
          <button type="submit">Send question</button>
        </form>`;
    profile.append(root);
    root.querySelector('form').addEventListener('submit',async ev=>{
      ev.preventDefault();if(FMV.user?.portal!=='driver')return;
      const input=document.getElementById('fmv-driver-assistant-input');
      const question=input.value.trim();if(!question)return;input.value='';
      const feed=document.getElementById('fmv-driver-assistant-feed');
      const append=(message)=>{const p=document.createElement('p');p.textContent=message;feed.append(p);feed.scrollTop=feed.scrollHeight;};
      append('You: '+question);
      const button=ev.currentTarget.querySelector('button');button.disabled=true;
      try{
        const result=await FMV.request('/assistant/chat',{method:'POST',body:{message:question}});
        append('FMV AI: '+result.reply);
      }catch(error){append('FMV AI could not retrieve company guidance: '+error.message);}
      finally{button.disabled=false;}
    });
  }
  document.addEventListener('DOMContentLoaded',build);
  // Profile visibility is controlled by existing driver navigation.
  document.addEventListener('fmv:locked',()=>{
    if(document.getElementById('fmv-driver-assistant-feed'))document.getElementById('fmv-driver-assistant-feed').replaceChildren();
  });
})();