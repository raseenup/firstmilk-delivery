/* Load visible driver promotions on demand. Respect reduced motion and data saving. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=value=>FMV.escape(value??'');
  let campaigns=[],last=0,pending=null,observer=null,rendered='';
  const mediaURL=path=>/^\/media\/campaign\/[a-zA-Z0-9_-]+$/.test(path||'')
    ? FMV.apiBase+path:'';
  function play(button,region){
    const item=campaigns.find(c=>c.id===button.dataset.driverPromoPlay);
    if(!region.contains(button) || !item || item.mime_type!=='video/mp4')return;
    const src=mediaURL(item.media_url);if(!src)return;
    const video=document.createElement('video');
    video.controls=false;video.muted=true;video.loop=true;video.playsInline=true;
    video.preload='metadata';video.disablePictureInPicture=true;
    video.setAttribute('aria-label',item.alt_text || item.title);
    video.src=src;button.replaceWith(video);
    video.play().catch(()=>{if(region.contains(video))video.replaceWith(button);});
  }
  function render(){
    const region=$('fmv-driver-promotions');if(!region)return;
    const signature=JSON.stringify(campaigns);
    if(signature===rendered)return;
    rendered=signature;observer?.disconnect();observer=null;
    region.hidden=!campaigns.length;
    if(!campaigns.length){region.replaceChildren();return;}
    region.innerHTML='<div class="fmv-driver-promo-heading"><div><span class="driver-eyebrow">FIRST MILK VENTURE</span><h3>News & promotions</h3></div></div>'+
      campaigns.slice(0,4).map(item=>{
        const src=mediaURL(item.media_url);
        const video=item.mime_type==='video/mp4';
        const image=src&&!video?`<img src="${esc(src)}" loading="lazy" decoding="async" alt="${esc(item.alt_text||item.title)}">`:'';
        const play=src&&video?`<button type="button" class="fmv-btn secondary" data-driver-promo-play="${esc(item.id)}" aria-label="Play ${esc(item.alt_text||item.title)}">Play video</button>`:'';
        return `<article class="fmv-driver-promo-card">
          <div class="fmv-driver-promo-visual">${image}${play}</div>
          <div><h4>${esc(item.title)}</h4><p>${esc(item.description)}</p>
            ${item.terms?`<small>${esc(item.terms)}</small>`:''}
          </div>
        </article>`;
      }).join('');
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(!reduced && !navigator.connection?.saveData && 'IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>{
        for(const entry of entries)if(entry.isIntersecting){
          observer?.unobserve(entry.target);play(entry.target,region);
        }
      });
      region.querySelectorAll('[data-driver-promo-play]').forEach(button=>observer.observe(button));
    }
  }
  async function load(force=false){
    if(FMV.user?.portal!=='driver')return;
    if(pending)return pending;
    if(!force && Date.now()-last<60000){render();return;}
    const session=FMV.sessionId;
    pending=(async()=>{
      const result=await FMV.request('/content');
      if(FMV.sessionId!==session)return;
      campaigns=(result.campaigns||[]).filter(item=>item.placement==='driver'
        && item.status==='published').slice(0,8);
      last=Date.now();render();
    })().finally(()=>{pending=null;});
    return pending;
  }
  function build(){
    const parent=$('fmv-driver-work');if(!parent)return;
    const region=document.createElement('section');region.id='fmv-driver-promotions';
    region.className='fmv-driver-promotions';region.hidden=true;
    region.setAttribute('aria-label','First Milk Venture driver announcements');
    const controls=$('fmv-work-controls');
    if(controls)controls.after(region);else parent.prepend(region);
    region.addEventListener('click',event=>{
      const button=event.target.closest('[data-driver-promo-play]');if(!button)return;
      observer?.unobserve(button);play(button,region);
    });
    document.addEventListener('fmv:driver-tab',event=>{
      if(event.detail==='work')FMV.guard(()=>load());
    });
    document.addEventListener('fmv:authenticated',()=>{
      if(FMV.user?.portal==='driver')FMV.guard(()=>load());
    });
    document.addEventListener('fmv:locked',()=>{
      observer?.disconnect();observer=null;rendered='';campaigns=[];last=0;pending=null;region.replaceChildren();region.hidden=true;
    });
    if(FMV.user?.portal==='driver')FMV.guard(()=>load());
  }
  document.addEventListener('DOMContentLoaded',build);
})();