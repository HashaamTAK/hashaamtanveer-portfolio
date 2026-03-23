/* ============================================================
   HASHAAM TANVEER — Portfolio
   script.js — Zero external dependencies
   ============================================================ */

/* ─── 1. HERO CANVAS — node network animation ─── */
(function() {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, nodes = [];
  var COUNT = 50, DIST = 150;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function init() {
    nodes = [];
    for (var i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8, phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var t = Date.now() * 0.001;
    var i, j, a, b, dx, dy, dist, alpha, p, r;

    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
    }

    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < DIST) {
          alpha = (1 - dist / DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(79,124,255,' + alpha + ')';
          ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
    }

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      p = 0.5 + 0.5 * Math.sin(t * 1.2 + a.phase);
      alpha = 0.3 + 0.4 * p;
      r = a.r * (0.9 + 0.25 * p);
      ctx.beginPath();
      ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,124,255,' + alpha + ')';
      ctx.fill();
      if (i % 8 === 0) {
        ctx.beginPath();
        ctx.arc(a.x, a.y, r + 4 + 2 * p, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(79,124,255,' + (0.1 * p) + ')';
        ctx.lineWidth = 1; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function() { resize(); init(); });
  resize(); init(); draw();
})();


/* ─── 2. NAV — scroll glass + active pill ─── */
(function() {
  var nav = document.getElementById('nav');
  var pills = document.querySelectorAll('.nav-pill a');

  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);

    var cur = '';
    var sects = document.querySelectorAll('section[id]');
    for (var i = 0; i < sects.length; i++) {
      if (window.scrollY >= sects[i].offsetTop - 120) cur = sects[i].id;
    }
    for (var j = 0; j < pills.length; j++) {
      pills[j].classList.toggle('active', pills[j].getAttribute('href') === '#' + cur);
    }
  }, { passive: true });
})();


/* ─── 3. MOBILE DRAWER ─── */
var drawerEl = document.getElementById('navDrawer');
var hbgEl = document.getElementById('hbgBtn');

function toggleDrawer() {
  if (!drawerEl || !hbgEl) return;
  var open = drawerEl.classList.toggle('open');
  hbgEl.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeDrawer() {
  if (!drawerEl || !hbgEl) return;
  drawerEl.classList.remove('open');
  hbgEl.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('click', function(e) {
  if (drawerEl && drawerEl.classList.contains('open') &&
      !drawerEl.contains(e.target) && hbgEl && !hbgEl.contains(e.target)) {
    closeDrawer();
  }
});


/* ─── 4. TYPEWRITER ─── */
(function() {
  var words = [
    'HubSpot workflows', 'n8n automations', 'Zapier integrations',
    'CRM architecture', 'ClickUp systems', 'Wrike workspaces',
    'Jira setups', 'RevOps infrastructure'
  ];
  var el = document.getElementById('heroTyped');
  if (!el) return;

  var wi = 0, ci = 0, del = false;
  function type() {
    var word = words[wi];
    if (!del) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) { del = true; setTimeout(type, 1900); return; }
      setTimeout(type, 65);
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(type, 280); return; }
      setTimeout(type, 36);
    }
  }
  setTimeout(type, 1000);
})();


/* ─── 5. SCROLL REVEAL ─── */
(function() {
  var obs = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('visible');
        obs.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.08 });

  var els = document.querySelectorAll('.reveal');
  for (var i = 0; i < els.length; i++) obs.observe(els[i]);
})();


/* ─── 6. ANIMATED COUNTERS ─── */
(function() {
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function animate(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var elapsed = Math.min(ts - start, dur);
      var val = Math.round(ease(elapsed / dur) * target);
      el.innerHTML = val + '<sup>' + suffix + '</sup>';
      if (elapsed < dur) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var obs = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting && entries[i].target.dataset.target) {
        animate(entries[i].target);
        obs.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.5 });

  var els = document.querySelectorAll('.icard-num[data-target]');
  for (var i = 0; i < els.length; i++) obs.observe(els[i]);
})();


/* ─── 7. IMAGE MODAL ─── */
function openModal(src) {
  var img = document.getElementById('modalImg');
  var ov = document.getElementById('modal');
  if (img && ov) { img.src = src; ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal() {
  var ov = document.getElementById('modal');
  if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
}
function handleModalClick(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
