// Menú móvil
const boton = document.querySelector('.menu-btn');
const menu = document.querySelector('nav');

boton.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  boton.setAttribute('aria-expanded', abierto);
});

menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('abierto');
    boton.setAttribute('aria-expanded', false);
  }
});

// Enlace activo según la sección visible
const enlaces = document.querySelectorAll('nav a');
const secciones = document.querySelectorAll('main section[id]');

const observadorSecciones = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      enlaces.forEach((a) => {
        a.classList.toggle('activo', a.getAttribute('href') === '#' + entrada.target.id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

secciones.forEach((s) => observadorSecciones.observe(s));

// Aparición suave al hacer scroll
const elementos = document.querySelectorAll('main article, .grupo');
elementos.forEach((el) => el.classList.add('aparece'));

const observadorAparicion = new IntersectionObserver((entradas, obs) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      obs.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12 });

elementos.forEach((el) => observadorAparicion.observe(el));