/* site.js — shared across index.html and work/*.html
   Wrapped in an IIFE: exports nothing to global scope, so a page's own inline
   script may freely declare its own `nav`, `io`, `RM`, … without colliding. */
(function(){

/* nav shadow on scroll */
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20),{passive:true});

/* reveal on scroll */
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ---- scroll progress · cursor glow ---- */
/* Inner IIFE so `if(RM)return` keeps its original meaning: the progress bar is
   registered before it and still updates under reduced motion; the glow is
   after it and stays suppressed. */
(function(){
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prog=document.getElementById('progress'),glow=document.getElementById('glow');
  addEventListener('scroll',()=>{const s=scrollY/((document.documentElement.scrollHeight-innerHeight)||1);if(prog)prog.style.width=Math.max(0,Math.min(1,s))*100+'%';},{passive:true});
  if(RM)return;

  /* cursor glow (eased follow) */
  let gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy;
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(glow)glow.style.opacity='1';},{passive:true});
  (function gl(){gx+=(tx-gx)*.14;gy+=(ty-gy)*.14;if(glow){glow.style.left=gx+'px';glow.style.top=gy+'px';}requestAnimationFrame(gl);})();
})();

/* ---- MR monogram: progressive draw + glowing pen tip ---- */
(function(){
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BASE='<path class="chip" d="M30 14 H66 Q82 14 82 30 V44 M82 56 V70 Q82 86 66 86 H30 Q14 86 14 70 V30 Q14 14 30 14" stroke="#EAEFF6" stroke-opacity="0.30" stroke-width="3"/>'
    +'<path class="trace" d="M66 50 H94" stroke="#5EEAD4" stroke-width="3"/>'
    +'<g class="edges" stroke="#EAEFF6" stroke-width="3.6">'
    +'<line x1="28" y1="66" x2="28" y2="34"/><line x1="28" y1="34" x2="40" y2="54"/>'
    +'<line x1="40" y1="54" x2="52" y2="34"/><line x1="52" y1="34" x2="52" y2="66"/>'
    +'<line x1="52" y1="34" x2="66" y2="37"/><line x1="66" y1="37" x2="66" y2="50"/>'
    +'<line x1="66" y1="50" x2="52" y2="50"/><line x1="52" y1="50" x2="68" y2="66"/></g>'
    +'<g class="nodes" fill="#0A0D12" stroke="#EAEFF6" stroke-width="2.4">'
    +'<circle cx="28" cy="66" r="3.2"/><circle cx="28" cy="34" r="3.2"/><circle cx="52" cy="66" r="3.2"/><circle cx="66" cy="37" r="3.2"/><circle cx="68" cy="66" r="3.2"/></g>'
    +'<g class="active" fill="#5EEAD4"><circle cx="40" cy="54" r="3.7"/><circle cx="52" cy="34" r="3.7"/><circle cx="66" cy="50" r="3.7"/></g>'
    +'<circle class="pin" cx="94" cy="50" r="3.4" fill="#5EEAD4"/>';
  const PEN='<path class="tipPath" d="M28 66 L28 34 L40 54 L52 34 L52 66 L52 34 L66 37 L66 50 L52 50 L68 66 L66 50 L94 50" fill="none" stroke="rgba(0,0,0,0)"/>'
    +'<circle class="tip" r="3.2" fill="#EAFFFB" style="filter:drop-shadow(0 0 5px #5EEAD4) drop-shadow(0 0 10px #5EEAD4)"/>';
  const SVG='<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">'+BASE+PEN+'</svg>';

  const marks=[...document.querySelectorAll('.logo .mk')];
  marks.forEach(m=>{m.innerHTML=SVG;});
  if(RM){marks.forEach(m=>{m.classList.add('noanim','play');});return;}

  function penRun(m){
    const tp=m.querySelector('.tipPath'),tip=m.querySelector('.tip');
    if(!tp||!tip)return;
    let LEN=0;try{LEN=tp.getTotalLength();}catch(e){}
    if(!LEN)return;
    const start=performance.now(),W0=120,W1=1640,FADE=360;
    (function raf(now){
      const e=now-start;
      if(e<W0){tip.style.opacity=0;}
      else if(e<=W1){const p=(e-W0)/(W1-W0),pt=tp.getPointAtLength(p*LEN);tip.setAttribute('cx',pt.x);tip.setAttribute('cy',pt.y);tip.style.opacity=1;}
      else if(e<=W1+FADE){const pt=tp.getPointAtLength(LEN);tip.setAttribute('cx',pt.x);tip.setAttribute('cy',pt.y);tip.style.opacity=1-(e-W1)/FADE;}
      else{tip.style.opacity=0;return;}
      requestAnimationFrame(raf);
    })(start);
  }
  function boot(m){
    m.classList.add('noanim');m.classList.remove('play');
    void m.offsetWidth;
    m.classList.remove('noanim');
    void m.offsetWidth;
    m.classList.add('play');
    penRun(m);
  }

  /* replay on hover of either logo */
  document.querySelectorAll('.logo').forEach(a=>{const m=a.querySelector('.mk');if(m)a.addEventListener('pointerenter',()=>boot(m));});
  /* nav draws on load; footer draws when scrolled into view */
  const navMk=document.querySelector('nav .mk');if(navMk)setTimeout(()=>boot(navMk),300);
  const footMk=document.querySelector('footer .mk');
  if(footMk)new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){boot(footMk);o.disconnect();}}),{threshold:.5}).observe(footMk);
})();

})();
