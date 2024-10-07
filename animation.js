<!-- Importando o GSAP (você pode colocar esse script dentro da página no Webflow ou no código customizado) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>

<script>
  window.addEventListener('load', function() {
    // Timeline para controlar a sequência de animações
    const tl = gsap.timeline();

    // Anima o bloco verde (hero) para a posição original
    tl.to(".hero-wrap", {
      width: "100%", 
      height: "auto",
      duration: 1.5, 
      ease: "power2.inOut"
    })
    // Faz o conteúdo aparecer após a animação do hero
    .to(".hero-content", {
      opacity: 1,
      duration: 1,
      ease: "power1.inOut"
    }, "-=0.5") // Inicia um pouco antes do final da animação do hero

    // Anima o menu (navbar) de cima para baixo com fade-in
    .to(".navbar", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power1.out"
    }, "-=0.5"); // Inicia um pouco antes do final do fade-in do conteúdo
  });
</script>
