/* ============================================================
   HASHAAM TANVEER — AI SYSTEMS
   Main JavaScript — Premium Interactive Engine
   ============================================================ */

// ─── LOADING SCREEN ───
const loader = document.querySelector('.loader');
const loaderBar = document.querySelector('.loader-bar');
let loadProgress = 0;

function updateLoader() {
  loadProgress += Math.random() * 25 + 10;
  if (loadProgress > 100) loadProgress = 100;
  if (loaderBar) loaderBar.style.width = loadProgress + '%';
  if (loadProgress < 100) {
    setTimeout(updateLoader, 200 + Math.random() * 200);
  } else {
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
      initAll();
    }, 400);
  }
}

// ─── SMOOTH SCROLL (Lenis) ───
let lenis;
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// ─── CUSTOM CURSOR ───
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Dot follows instantly
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';

    // Ring follows with lag
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  const hoverElements = document.querySelectorAll('a, button, .service-card, .stack-item, .project-card, .diagram-node, .magnetic, [data-cursor]');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
}

// ─── MAGNETIC BUTTONS ───
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ─── THREE.JS PARTICLE BACKGROUND ───
function initWebGL() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particleCount = 1200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    // Color variation: cyan to purple
    const t = Math.random();
    colors[i * 3] = t * 0.5;            // R
    colors[i * 3 + 1] = 0.6 + t * 0.3;  // G
    colors[i * 3 + 2] = 1.0;             // B

    sizes[i] = Math.random() * 2 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      uniform vec2 uMouse;
      
      void main() {
        vColor = color;
        
        vec3 pos = position;
        pos.x += sin(uTime * 0.3 + position.y * 0.05) * 2.0;
        pos.y += cos(uTime * 0.2 + position.x * 0.05) * 2.0;
        pos.z += sin(uTime * 0.4 + position.x * 0.03) * 1.5;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (40.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        
        vAlpha = smoothstep(80.0, 20.0, -mvPosition.z) * 0.6;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Grid lines
  const gridGeom = new THREE.BufferGeometry();
  const gridPositions = [];
  const gridSize = 100;
  const gridDivisions = 20;
  const step = gridSize / gridDivisions;

  for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
    gridPositions.push(-gridSize / 2, -30, i, gridSize / 2, -30, i);
    gridPositions.push(i, -30, -gridSize / 2, i, -30, gridSize / 2);
  }

  gridGeom.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
  const gridMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.04 });
  const grid = new THREE.LineSegments(gridGeom, gridMat);
  scene.add(grid);

  // Mouse tracking
  let mouseNorm = { x: 0, y: 0 };
  document.addEventListener('mousemove', (e) => {
    mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value += 0.01;
    material.uniforms.uMouse.value.set(mouseNorm.x, mouseNorm.y);

    camera.position.x += (mouseNorm.x * 5 - camera.position.x) * 0.02;
    camera.position.y += (mouseNorm.y * 3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    grid.rotation.y += 0.0005;
    particles.rotation.y += 0.0003;

    renderer.render(scene, camera);
  }
  animate();
}

// ─── GSAP ANIMATIONS ───
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .to('.hero h1', { opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.5')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to('.scroll-indicator', { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.3');

  // Reveal animations
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.reveal-scale').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
    });
  });

  // Staggered card reveals
  document.querySelectorAll('.services-grid, .stack-grid, .stats-row').forEach(grid => {
    const cards = grid.children;
    gsap.from(cards, {
      scrollTrigger: { trigger: grid, start: 'top 80%' },
      opacity: 0, y: 40,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });
  });

  // Approach steps
  document.querySelectorAll('.approach-step').forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 80%' },
      opacity: 0, x: -30,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
    });
  });
}

// ─── SCROLL STORYTELLING ───
function initScrollStory() {
  const storySection = document.querySelector('.scroll-story');
  if (!storySection) return;

  const words = storySection.querySelectorAll('.word');
  const totalWords = words.length;

  ScrollTrigger.create({
    trigger: storySection,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const progress = self.progress;
      const activeIndex = Math.floor(progress * totalWords);
      words.forEach((w, i) => {
        w.classList.toggle('active', i <= activeIndex);
      });
    },
  });
}

// ─── 3D TILT CARDS ───
function initTiltCards() {
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    });
  });
}

// ─── ANIMATED COUNTERS ───
function initCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = prefix + Math.floor(this.targets()[0].val) + suffix;
          },
        });
      },
    });
  });
}

// ─── NAV BEHAVIOR ───
function initNav() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const curr = window.scrollY;
    if (curr > 100 && curr > lastScroll) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    lastScroll = curr;
  });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });
  }

  // Page transitions
  document.querySelectorAll('.nav-link[href], .page-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.endsWith('.html') && !href.startsWith('http')) {
        e.preventDefault();
        const transition = document.querySelector('.page-transition');
        if (transition) {
          transition.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 600);
        } else {
          window.location.href = href;
        }
      }
    });
  });
}

// ─── AI CHAT ASSISTANT ───
function initAIChat() {
  const toggle = document.querySelector('.ai-chat-toggle');
  const window_ = document.querySelector('.ai-chat-window');
  const input = document.querySelector('.ai-chat-input input');
  const sendBtn = document.querySelector('.ai-chat-input button');
  const messages = document.querySelector('.ai-chat-messages');

  if (!toggle || !window_) return;

  toggle.addEventListener('click', () => {
    window_.classList.toggle('open');
  });

  const responses = {
    'hello': 'Hello! Welcome to AI Systems. I can help you learn about our services, tech stack, and projects. What interests you?',
    'hi': 'Hey there! I\'m the AI assistant for Hashaam\'s portfolio. Ask me about AI agents, automation, or our tech stack!',
    'services': 'We specialize in three core areas: AI Agent Development (autonomous systems), Automation Pipelines (workflow optimization), and Scalable System Architecture. Want details on any?',
    'projects': 'Our flagship projects include multi-agent orchestration systems, RAG pipelines, and automated data workflows. Check the Systems page for detailed case studies!',
    'stack': 'Our core stack includes Python, TypeScript, LangChain, FastAPI, React, PostgreSQL, Redis, Docker, and various cloud services. Visit the Stack page for the full breakdown!',
    'contact': 'You can reach Hashaam via email or LinkedIn. Links are in the footer. Looking forward to connecting!',
    'ai': 'We build intelligent AI systems — from autonomous agents to full automation pipelines. Our approach combines cutting-edge LLMs with robust engineering practices.',
    'default': 'Interesting question! I\'m designed to help you navigate this portfolio. Try asking about services, projects, tech stack, or how to get in touch.',
  };

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `ai-msg ${type}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'ai-msg bot typing';
    typing.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    typing.id = 'typing-indicator';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }

  function getResponse(input) {
    const lower = input.toLowerCase().trim();
    for (const key of Object.keys(responses)) {
      if (key !== 'default' && lower.includes(key)) {
        return responses[key];
      }
    }
    return responses['default'];
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(getResponse(text), 'bot');
    }, 800 + Math.random() * 800);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

// ─── DIAGRAM INTERACTIONS ───
function initDiagrams() {
  const nodes = document.querySelectorAll('.diagram-node');
  const detailPanel = document.querySelector('.node-detail');
  const overlay = document.querySelector('.detail-overlay');
  const detailClose = document.querySelector('.node-detail-close');

  if (!nodes.length || !detailPanel) return;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const title = node.getAttribute('data-title') || node.textContent.trim();
      const desc = node.getAttribute('data-desc') || 'Component of the system architecture.';

      detailPanel.querySelector('h3').textContent = title;
      detailPanel.querySelector('p').textContent = desc;
      detailPanel.classList.add('visible');
      if (overlay) overlay.classList.add('visible');
    });
  });

  if (detailClose) {
    detailClose.addEventListener('click', () => {
      detailPanel.classList.remove('visible');
      if (overlay) overlay.classList.remove('visible');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      detailPanel.classList.remove('visible');
      overlay.classList.remove('visible');
    });
  }
}

// ─── INIT EVERYTHING ───
function initAll() {
  initLenis();
  initCursor();
  initMagnetic();
  initWebGL();
  initGSAP();
  initScrollStory();
  initTiltCards();
  initCounters();
  initNav();
  initAIChat();
  initDiagrams();
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  updateLoader();
});
