/* ============================================================
   RAKSASA — interactions & cinematic scroll
   ============================================================ */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- AGE GATE ---------- */
  var gate = document.getElementById('agegate');
  function passGate(){
    try{ localStorage.setItem('rk_age_ok','1'); }catch(e){}
    gate.classList.add('hide');
    document.body.style.overflow='';
    setTimeout(function(){ gate.style.display='none'; }, 950);
  }
  var ok=false;
  try{ ok = localStorage.getItem('rk_age_ok')==='1'; }catch(e){}
  if(ok){ gate.style.display='none'; }
  else { document.body.style.overflow='hidden'; }
  var yes=document.getElementById('gate-yes');
  if(yes) yes.addEventListener('click', passGate);
  var no=document.getElementById('gate-no');
  if(no) no.addEventListener('click', function(){
    document.querySelector('.gate-inner').innerHTML =
      '<p class="gate-q">Please come back another time.</p>'+
      '<p class="gate-note">You must be of legal drinking age to enter.</p>';
  });

  /* ---------- NAV state ---------- */
  var nav=document.querySelector('.nav');
  var floatBuy=document.querySelector('.float-buy');
  function onScroll(){
    var y=window.scrollY;
    if(y>60) nav.classList.add('solid'); else nav.classList.remove('solid');
    if(y>window.innerHeight*0.7) floatBuy.classList.add('show'); else floatBuy.classList.remove('show');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- REVEAL on intersect ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal, .reveal-lines, .img-wipe').forEach(function(el){ io.observe(el); });

  // hero lines fire on load
  window.addEventListener('load', function(){
    setTimeout(function(){
      var h=document.querySelector('.hero .reveal-lines');
      if(h) h.classList.add('in');
    }, reduce?0:260);
  });

  /* ---------- PARALLAX ---------- */
  var px = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking=false;
  function applyParallax(){
    var vh=window.innerHeight;
    px.forEach(function(el){
      var r=el.getBoundingClientRect();
      if(r.bottom<-200 || r.top>vh+200) return;
      var speed=parseFloat(el.getAttribute('data-parallax'))||0.15;
      var center=r.top + r.height/2 - vh/2;
      el.style.transform='translate3d(0,'+(-center*speed)+'px,0)';
    });
    ticking=false;
  }
  function reqParallax(){ if(!ticking && !reduce){ ticking=true; requestAnimationFrame(applyParallax); } }
  if(!reduce){
    window.addEventListener('scroll', reqParallax, {passive:true});
    window.addEventListener('resize', applyParallax);
    applyParallax();
  }

  /* ---------- COCKTAIL toggles ---------- */
  document.querySelectorAll('.ct').forEach(function(card){
    card.addEventListener('click', function(){
      card.classList.toggle('open');
    });
  });

  /* ---------- MOBILE MENU ---------- */
  var sheet=document.querySelector('.sheet');
  var toggle=document.querySelector('.menu-toggle');
  if(toggle) toggle.addEventListener('click', function(){ sheet.classList.add('open'); document.body.style.overflow='hidden'; });
  var sclose=document.querySelector('.sheet-close');
  if(sclose) sclose.addEventListener('click', function(){ sheet.classList.remove('open'); document.body.style.overflow=''; });
  document.querySelectorAll('.sheet-nav a').forEach(function(a){
    a.addEventListener('click', function(){ sheet.classList.remove('open'); document.body.style.overflow=''; });
  });

  /* ---------- smooth anchor offset for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(ev){
      var id=a.getAttribute('href');
      if(id.length<2) return;
      var t=document.querySelector(id);
      if(!t) return;
      ev.preventDefault();
      var top=t.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({top:top, behavior: reduce?'auto':'smooth'});
    });
  });
})();
