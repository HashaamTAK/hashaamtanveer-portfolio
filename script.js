/* ============================================================
   HASHAAM TANVEER — Personal Portfolio
   script.js

   Lightweight, maintainable JavaScript.
   No heavy libraries. Just clean vanilla JS.
   ============================================================ */


/* ─────────────────────────────────────────────
   1. HERO CANVAS — Subtle node/connection network
   ───────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let nodes = [];
  const NODE_COUNT = 50;
  const MAX_DIST = 150;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      phase: Math.random() * Math.PI * 2
    };
  }

  function init() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(createNode());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.001;

    // Move nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
    }

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(79,124,255,' + alpha + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const p = 0.5 + 0.5 * Math.sin(t * 1.2 + n.phase);
      const alpha = 0.3 + 0.4 * p;
      const r = n.r * (0.9 + 0.25 * p);

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,124,255,' + alpha + ')';
      ctx.fill();

      // Occasional outer ring on every 8th node
      if (i % 8 === 0) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4 + 2 * p, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(79,124,255,' + (0.1 * p) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function() { resize(); init(); });
  resize();
  init();
  draw();
})();


/* ─────────────────────────────────────────────
   2. NAVBAR — Scroll glass effect + active pill
   ───────────────────────────────────────────── */
(function initNav() {
  var nav = document.getElementById('nav');
  var pillLinks = document.querySelectorAll('.nav-pill a');

  window.addEventListener('scroll', function() {
    // Glass background on scroll
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }

    // Active pill highlight
    var current = '';
    var sections = document.querySelectorAll('section[id]');
    for (var i = 0; i < sections.length; i++) {
      if (window.scrollY >= sections[i].offsetTop - 120) {
        current = sections[i].id;
      }
    }
    for (var j = 0; j < pillLinks.length; j++) {
      pillLinks[j].classList.toggle(
        'active',
        pillLinks[j].getAttribute('href') === '#' + current
      );
    }
  }, { passive: true });
})();


/* ─────────────────────────────────────────────
   3. MOBILE DRAWER — Toggle open/close
   ───────────────────────────────────────────── */
var drawerEl = document.getElementById('navDrawer');
var hamburgerEl = document.getElementById('hamburgerBtn');

function toggleDrawer() {
  if (!drawerEl || !hamburgerEl) return;
  var isOpen = drawerEl.classList.toggle('open');
  hamburgerEl.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeDrawer() {
  if (!drawerEl || !hamburgerEl) return;
  drawerEl.classList.remove('open');
  hamburgerEl.classList.remove('open');
  document.body.style.overflow = '';
}

// Close drawer when clicking outside
document.addEventListener('click', function(e) {
  if (drawerEl && drawerEl.classList.contains('open') &&
      !drawerEl.contains(e.target) &&
      hamburgerEl && !hamburgerEl.contains(e.target)) {
    closeDrawer();
  }
});


/* ─────────────────────────────────────────────
   4. TYPEWRITER — Cycles through specialties
   ───────────────────────────────────────────── */
(function initTypewriter() {
  var words = [
    'HubSpot workflows',
    'n8n automations',
    'Zapier integrations',
    'CRM architecture',
    'ClickUp systems',
    'Wrike workspaces',
    'Jira setups',
    'RevOps infrastructure'
  ];

  var el = document.getElementById('heroTyped');
  if (!el) return;

  var wordIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function type() {
    var word = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(type, 1900); // Pause before deleting
        return;
      }
      setTimeout(type, 65);
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 280); // Pause before next word
        return;
      }
      setTimeout(type, 36);
    }
  }

  setTimeout(type, 1000);
})();


/* ─────────────────────────────────────────────
   5. SCROLL REVEAL — Fade-in on scroll
   ───────────────────────────────────────────── */
(function initReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  var elements = document.querySelectorAll('.reveal');
  elements.forEach(function(el) {
    observer.observe(el);
  });
})();


/* ─────────────────────────────────────────────
   6. ANIMATED COUNTERS — Count up on scroll
   ───────────────────────────────────────────── */
(function initCounters() {
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1600;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var elapsed = Math.min(ts - startTime, duration);
      var progress = easeOutCubic(elapsed / duration);
      var current = Math.round(progress * target);
      el.innerHTML = current + '<sup>' + suffix + '</sup>';
      if (elapsed < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && entry.target.dataset.target) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  var counters = document.querySelectorAll('.icard-num[data-target]');
  counters.forEach(function(el) {
    observer.observe(el);
  });
})();


/* ─────────────────────────────────────────────
   7. IMAGE MODAL — Click to expand project images
   ───────────────────────────────────────────── */
function openModal(src) {
  var img = document.getElementById('modalImg');
  var overlay = document.getElementById('modal');
  if (img && overlay) {
    img.src = src;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  var overlay = document.getElementById('modal');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleModalClick(e) {
  if (e.target === document.getElementById('modal')) {
    closeModal();
  }
}

// Escape key closes modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});
