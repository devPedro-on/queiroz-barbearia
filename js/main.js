(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Live open/closed status (America/Sao_Paulo) ----
  var HOURS = { 0: null, 1: [600, 1140], 2: [540, 1200], 3: [540, 1200], 4: [540, 1200], 5: [540, 1200], 6: [540, 1200] };
  var DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  function label(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    return h + 'h' + (m ? String(m).padStart(2, '0') : '');
  }
  function nowSP() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
    var wk = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day = wk.indexOf(map.weekday);
    var hour = parseInt(map.hour, 10) % 24;
    return { day: day, minutes: hour * 60 + parseInt(map.minute, 10) };
  }
  function computeStatus() {
    var t = nowSP();
    var today = HOURS[t.day];
    if (today && t.minutes >= today[0] && t.minutes < today[1]) {
      return { open: true, text: 'Aberto agora · fecha às ' + label(today[1]) };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (t.day + i) % 7;
      var h = HOURS[d];
      if (h) {
        var when = i === 1 ? 'amanhã' : DAY_NAMES[d];
        return { open: false, text: 'Fechado · abre ' + when + ' às ' + label(h[0]) };
      }
    }
    return { open: false, text: 'Fechado' };
  }
  function paintStatus() {
    var s = computeStatus();
    var hero = document.getElementById('statusHero');
    var card = document.getElementById('statusCard');
    if (hero) hero.textContent = s.text;
    if (card) { card.textContent = s.text; card.classList.toggle('closed', !s.open); }
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  var yearEl = document.getElementById('fyear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Intro loader ----
  var loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () { loader.classList.add('done'); }, reduce ? 0 : 2250);
  });
  if (reduce) loader.style.display = 'none';

  // ---- Scroll progress + header shrink ----
  var progress = document.getElementById('progress');
  var header = document.getElementById('siteHeader');
  function onScroll() {
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = pct + '%';
    header.classList.toggle('scrolled', h.scrollTop > 8);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('[data-reveal], .menu-row[data-reveal-row], .g-item');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

    var rows = document.querySelectorAll('.menu-row[data-reveal-row]');
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var idx = Array.prototype.indexOf.call(rows, e.target);
          setTimeout(function () { e.target.classList.add('in'); }, idx * 90);
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    rows.forEach(function (el) { io2.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.menu-row').forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Custom cursor (fine pointer only) ----
  if (window.matchMedia('(pointer: fine)').matches && !reduce) {
    document.documentElement.classList.add('has-cursor');
    var dot = document.getElementById('curDot'), ring = document.getElementById('curRing');
    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .g-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('big'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('big'); });
    });
  }

  // ---- Magnetic buttons ----
  if (!reduce) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });

    // ---- Plaquette tilt ----
    var card = document.getElementById('pqCard');
    if (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + (px * 6) + 'deg) rotateX(' + (py * -6) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    }
  }

  // ---- Lightbox ----
  var lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lb-cap');
  document.querySelectorAll('.g-item').forEach(function (item) {
    item.addEventListener('click', function () {
      lbImg.src = item.getAttribute('data-full');
      lbCap.textContent = item.getAttribute('data-cap');
      lb.classList.add('open');
    });
  });
  function closeLb() { lb.classList.remove('open'); }
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  // ---- Grain canvas ----
  var canvas = document.getElementById('grain');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    function size() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    size(); window.addEventListener('resize', size);
    function draw() {
      var w = canvas.width, h = canvas.height;
      var imgData = ctx.createImageData(w, h);
      var buf = new Uint32Array(imgData.data.buffer);
      for (var i = 0; i < buf.length; i++) {
        var v = (Math.random() * 255) | 0;
        buf[i] = (255 << 24) | (v << 16) | (v << 8) | v;
      }
      ctx.putImageData(imgData, 0, 0);
    }
    if (!reduce) {
      var last = 0;
      function tick(t) { if (t - last > 90) { draw(); last = t; } requestAnimationFrame(tick); }
      requestAnimationFrame(tick);
    } else { draw(); }
  }
})();
