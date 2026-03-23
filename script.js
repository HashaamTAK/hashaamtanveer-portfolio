/* ═══════════════════════════════════════════════════════
   SCRIPT.JS — Hashaam Tanveer Portfolio
   All JavaScript extracted and safely wrapped.
   GSAP ScrollTrigger used for premium section animations.
═══════════════════════════════════════════════════════ */

/* ═══════════════════════
   CANVAS NETWORK ANIMATION
   Runs immediately (outside DOMContentLoaded for performance)
═══════════════════════ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W, H, nodes = [], frame;
  const NODE_COUNT = 55;
  const MAX_DIST = 160;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Node() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.38;
    this.vy = (Math.random() - 0.5) * 0.38;
    this.r = Math.random() * 1.8 + 0.8;
    this.pulse = Math.random() * Math.PI * 2;
  }

  function init() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(new Node());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.001;

    // Update positions
    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = a.x - b.x,
          dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.28;
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
    nodes.forEach(function (n, i) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + n.pulse);
      const alpha = 0.35 + 0.45 * pulse;
      const r = n.r * (0.9 + 0.25 * pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,124,255,' + alpha + ')';
      ctx.fill();
      // Occasional "active" nodes with outer ring
      if (i % 8 === 0) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4 + 2 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(79,124,255,' + 0.12 * pulse + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    frame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () {
    resize();
    init();
  });
  resize();
  init();
  draw();
})();

/* ═══════════════════════
   MOBILE DRAWER — global functions for inline onclick
═══════════════════════ */
function toggleDrawer() {
  var drawerEl = document.getElementById('navDrawer');
  var hbgEl = document.getElementById('hbgBtn');
  if (!drawerEl || !hbgEl) return;
  var open = drawerEl.classList.toggle('open');
  hbgEl.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeDrawer() {
  var drawerEl = document.getElementById('navDrawer');
  var hbgEl = document.getElementById('hbgBtn');
  if (drawerEl) drawerEl.classList.remove('open');
  if (hbgEl) hbgEl.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══════════════════════
   IMAGE MODAL — global functions for inline onclick
═══════════════════════ */
function openModal(src) {
  var img = document.getElementById('modalImg');
  var modal = document.getElementById('modal');
  if (img) img.src = src;
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var modal = document.getElementById('modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function handleModalClick(e) {
  var modal = document.getElementById('modal');
  if (modal && e.target === modal) closeModal();
}

/* ═══════════════════════════════════════════════════════
   MAIN INIT — DOMContentLoaded
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  /* ═══════════════════════
     NAV SCROLL GLASS
  ═══════════════════════ */
  var navEl = document.getElementById('nav');
  if (navEl) {
    window.addEventListener(
      'scroll',
      function () {
        navEl.classList.toggle('scrolled', window.scrollY > 24);
      },
      { passive: true }
    );
  }

  /* ═══════════════════════
     ACTIVE PILL ON SCROLL
  ═══════════════════════ */
  var pillAs = document.querySelectorAll('.nav-pill a');
  if (pillAs.length) {
    window.addEventListener(
      'scroll',
      function () {
        var cur = '';
        document.querySelectorAll('section[id]').forEach(function (s) {
          if (window.scrollY >= s.offsetTop - 120) cur = s.id;
        });
        pillAs.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
        });
      },
      { passive: true }
    );
  }

  /* ═══════════════════════
     CLOSE DRAWER ON OUTSIDE CLICK
  ═══════════════════════ */
  var drawerEl = document.getElementById('navDrawer');
  var hbgEl = document.getElementById('hbgBtn');
  document.addEventListener('click', function (e) {
    if (
      drawerEl &&
      hbgEl &&
      drawerEl.classList.contains('open') &&
      !drawerEl.contains(e.target) &&
      !hbgEl.contains(e.target)
    ) {
      closeDrawer();
    }
  });

  /* ═══════════════════════
     TYPEWRITER
  ═══════════════════════ */
  var typedWords = [
    'HubSpot workflows',
    'n8n automations',
    'Zapier integrations',
    'CRM architecture',
    'ClickUp systems',
    'Wrike workspaces',
    'Jira setups',
    'RevOps infrastructure',
  ];
  var twi = 0,
    tci = 0,
    tDeleting = false;
  var tEl = document.getElementById('heroTyped');

  function type() {
    if (!tEl) return;
    var word = typedWords[twi];
    if (!tDeleting) {
      tEl.textContent = word.slice(0, ++tci);
      if (tci === word.length) {
        tDeleting = true;
        setTimeout(type, 1900);
        return;
      }
      setTimeout(type, 65);
    } else {
      tEl.textContent = word.slice(0, --tci);
      if (tci === 0) {
        tDeleting = false;
        twi = (twi + 1) % typedWords.length;
        setTimeout(type, 280);
        return;
      }
      setTimeout(type, 36);
    }
  }
  setTimeout(type, 1000);

  /* ═══════════════════════
     SCROLL REVEAL (IntersectionObserver)
  ═══════════════════════ */
  var revObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revObs.observe(el);
  });

  /* ═══════════════════════
     ANIMATED COUNTERS
  ═══════════════════════ */
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

  var counterObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.target.dataset.target) {
          animateCounter(e.target);
          counterObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.icard-num[data-target]').forEach(function (el) {
    counterObs.observe(el);
  });

  /* ═══════════════════════
     ESCAPE KEY → CLOSE MODAL
  ═══════════════════════ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ═══════════════════════════════════════════════════════
     GSAP SCROLLTRIGGER MOTION UPGRADES
     Premium section entrance animations.
     Only runs if GSAP + ScrollTrigger are available.
  ═══════════════════════════════════════════════════════ */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    var isMobile = window.innerWidth < 768;
    var defaultEase = 'power3.out';

    /* --- Work section: stagger cards --- */
    var workCards = gsap.utils.toArray('.wcard');
    if (workCards.length) {
      gsap.from(workCards, {
        scrollTrigger: {
          trigger: '.work-grid',
          start: 'top 85%',
          once: true,
        },
        y: isMobile ? 20 : 40,
        opacity: 0,
        duration: isMobile ? 0.5 : 0.7,
        stagger: isMobile ? 0.08 : 0.12,
        ease: defaultEase,
      });
    }

    /* --- Stack section: stagger tiles --- */
    var stackTiles = gsap.utils.toArray('.stile');
    if (stackTiles.length) {
      gsap.from(stackTiles, {
        scrollTrigger: {
          trigger: '.stack-grid',
          start: 'top 85%',
          once: true,
        },
        scale: 0.88,
        opacity: 0,
        duration: isMobile ? 0.4 : 0.55,
        stagger: {
          each: isMobile ? 0.03 : 0.05,
          grid: 'auto',
          from: 'start',
        },
        ease: 'back.out(1.4)',
      });
    }

    /* --- About section: services slide in --- */
    var svcCards = gsap.utils.toArray('.svc');
    if (svcCards.length) {
      gsap.from(svcCards, {
        scrollTrigger: {
          trigger: '.services',
          start: 'top 85%',
          once: true,
        },
        x: isMobile ? 12 : 24,
        opacity: 0,
        duration: isMobile ? 0.45 : 0.6,
        stagger: 0.09,
        ease: defaultEase,
      });
    }

    /* --- Impact section: stagger cards --- */
    var impactCards = gsap.utils.toArray('.icard');
    if (impactCards.length) {
      gsap.from(impactCards, {
        scrollTrigger: {
          trigger: '.impact-grid',
          start: 'top 85%',
          once: true,
        },
        y: isMobile ? 16 : 30,
        opacity: 0,
        duration: isMobile ? 0.5 : 0.65,
        stagger: 0.1,
        ease: defaultEase,
      });
    }

    /* --- Contact section: scale-in CTA links --- */
    var contactLinks = gsap.utils.toArray('.clink');
    if (contactLinks.length) {
      gsap.from(contactLinks, {
        scrollTrigger: {
          trigger: '.contact-links',
          start: 'top 90%',
          once: true,
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.6)',
      });
    }

    /* --- Marquee: fade in --- */
    var marqueeEl = document.querySelector('.marquee-wrap');
    if (marqueeEl) {
      gsap.from(marqueeEl, {
        scrollTrigger: {
          trigger: marqueeEl,
          start: 'top 90%',
          once: true,
        },
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: defaultEase,
      });
    }

    /* --- Dividers: width reveal --- */
    gsap.utils.toArray('.divider').forEach(function (div) {
      gsap.from(div, {
        scrollTrigger: {
          trigger: div,
          start: 'top 95%',
          once: true,
        },
        scaleX: 0,
        transformOrigin: 'center center',
        duration: 1,
        ease: 'power2.out',
      });
    });
  }
});
