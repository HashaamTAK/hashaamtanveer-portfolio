// ==========================
// GSAP INIT
// ==========================
gsap.registerPlugin(ScrollTrigger);


// ==========================
// HERO ENTRY (CINEMATIC)
// ==========================
const heroTL = gsap.timeline();

heroTL
.from(".hero-badge", {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
})
.from(".hero-h1", {
  y: 80,
  opacity: 0,
  duration: 1,
  ease: "power4.out"
}, "-=0.5")
.from(".hero-desc", {
  y: 50,
  opacity: 0,
  duration: 0.8
}, "-=0.6")
.from(".hero-stats .hstat", {
  y: 30,
  opacity: 0,
  stagger: 0.15
}, "-=0.5")
.from(".hero-btns a", {
  y: 20,
  opacity: 0,
  stagger: 0.1
}, "-=0.4")
.from(".hero-card", {
  scale: 0.92,
  opacity: 0,
  duration: 1
}, "-=0.7");


// ==========================
// SECTION STORYTELLING (UPGRADE)
// ==========================
gsap.utils.toArray("section").forEach((section) => {

  const elements = section.querySelectorAll(
    ".section-title, .section-sub, .wcard, .stile, .icard, p, h2"
  );

  gsap.from(elements, {
    scrollTrigger: {
      trigger: section,
      start: "top 75%"
    },
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.12
  });

});


// ==========================
// WORK CARDS STAGGER
// ==========================
gsap.from(".wcard", {
  scrollTrigger: {
    trigger: ".work-grid",
    start: "top 80%"
  },
  y: 100,
  opacity: 0,
  stagger: 0.15,
  ease: "power4.out"
});


// ==========================
// STACK GRID POP
// ==========================
gsap.from(".stile", {
  scrollTrigger: {
    trigger: ".stack-grid",
    start: "top 80%"
  },
  scale: 0.85,
  opacity: 0,
  stagger: 0.08,
  ease: "back.out(1.7)"
});


// ==========================
// IMPACT COUNT-UP
// ==========================
document.querySelectorAll(".icard-num").forEach(el => {
  let value = parseInt(el.innerText);

  gsap.fromTo(el, {innerText: 0}, {
    innerText: value,
    duration: 2,
    snap: { innerText: 1 },
    scrollTrigger: {
      trigger: el,
      start: "top 85%"
    }
  });
});


// ==========================
// HERO PARALLAX
// ==========================
gsap.to("#hero-canvas", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});


// ==========================
// NAV SCROLL EFFECT
// ==========================
ScrollTrigger.create({
  start: "top -80",
  onEnter: () => document.getElementById("nav").classList.add("scrolled"),
  onLeaveBack: () => document.getElementById("nav").classList.remove("scrolled")
});


// ==========================
// MAGNETIC BUTTONS
// ==========================
document.querySelectorAll(".btn-primary, .btn-ghost").forEach(btn => {

  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.4
    });
  });

});


// ==========================
// 3D CARD INTERACTION
// ==========================
document.querySelectorAll(".wcard").forEach(card => {

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotationY: x * 10,
      rotationX: -y * 10,
      transformPerspective: 800,
      duration: 0.4
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6
    });
  });

});


// ==========================
// CURSOR LIGHT EFFECT
// ==========================
const light = document.createElement("div");

light.style.position = "fixed";
light.style.width = "300px";
light.style.height = "300px";
light.style.borderRadius = "50%";
light.style.pointerEvents = "none";
light.style.background = "radial-gradient(circle, rgba(79,124,255,0.15), transparent 70%)";
light.style.zIndex = "1";

document.body.appendChild(light);

window.addEventListener("mousemove", e => {
  gsap.to(light, {
    x: e.clientX - 150,
    y: e.clientY - 150,
    duration: 0.3
  });
});


// ==========================
// HERO CANVAS (OPTIMIZED)
// ==========================
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 40; i++) { // reduced for performance
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  });
}

// LIMIT FPS (BIG PERFORMANCE BOOST)
let lastTime = 0;

function draw(time) {

  if (time - lastTime < 33) {
    requestAnimationFrame(draw);
    return;
  }

  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.fillStyle = "#4f7cff";
    ctx.fillRect(p.x, p.y, 2, 2);

    particles.forEach(p2 => {
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = "rgba(79,124,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });

  });

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
// ==========================
// MODAL FUNCTIONS
// ==========================
function openModal(src) {
  document.getElementById('modalImg').src = src;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

function handleModalClick(e) {
  if (e.target === document.getElementById('modal')) {
    closeModal();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


// ==========================
// NAV DRAWER (MOBILE)
// ==========================
function toggleDrawer() {
  document.getElementById('navDrawer').classList.toggle('open');
  document.getElementById('hbgBtn').classList.toggle('open');
}
if (window.innerWidth < 768) {
  // disable heavy animations on mobile
}
if (canvas) {
  const ctx = canvas.getContext("2d");
  // rest of code
}

function closeDrawer() {
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('hbgBtn').classList.remove('open');
}
