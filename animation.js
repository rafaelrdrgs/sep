// Coloque o código GSAP aqui
window.addEventListener('load', function() {
  const tl = gsap.timeline();
  
  tl.to(".hero-wrap", {
    width: "100%", 
    height: "auto",
    duration: 1.5, 
    ease: "power2.inOut"
  })
  .to(".hero-wrap .content", {
    opacity: 1,
    duration: 1,
    ease: "power1.inOut"
  }, "-=0.5")
  .to(".navbar", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power1.out"
  }, "-=0.5");
});
