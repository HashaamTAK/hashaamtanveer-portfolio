// SCROLL REVEAL (APPLE STYLE)
const elements = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){
      el.classList.add("active");
    }
  });
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener("click", function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({behavior:"smooth"});
  });
});

// PARALLAX BACKGROUND (SUBTLE)
window.addEventListener("mousemove", e=>{
  const bg = document.querySelector(".bg");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  bg.style.transform = `translate(${x*20}px, ${y*20}px)`;
});
