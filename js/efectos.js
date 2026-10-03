const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const boton = document.querySelector('.menu-btn');
const menu = document.querySelector('nav');
const enlaces = [...menu.querySelectorAll('a')];
const hero = document.querySelector('.hero');
document.documentElement.classList.add('js');

// Menú móvil
enlaces.forEach((a, i) => a.style.setProperty('--i', i));
const alternar = (abrir) => {
  menu.classList.toggle('abierto', abrir);
  document.body.classList.toggle('bloqueado', abrir);
  boton.setAttribute('aria-expanded', abrir);
  boton.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
};
boton.addEventListener('click', () => alternar(!menu.classList.contains('abierto')));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) alternar(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') alternar(false); });
matchMedia('(min-width: 801px)').addEventListener('change', () => alternar(false));

// Enlace activo según la sección visible
const secciones = document.querySelectorAll('main section[id]');
new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) enlaces.forEach((a) => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' }).observe && secciones.forEach((s) => {
  new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) enlaces.forEach((a) => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' }).observe(s);
});

// Cinta con las tecnologías
const frase = 'Desarrollo web · Soporte técnico · Java · HTML · CSS · JavaScript · MySQL · Windows Server · Git · ';
const cinta = document.createElement('div');
cinta.className = 'cinta';
cinta.setAttribute('aria-hidden', 'true');
cinta.innerHTML = `<div><span>${frase.repeat(4)}</span><span>${frase.repeat(4)}</span></div>`;
hero.after(cinta);

if (!reducido) {
  // Barra de progreso
  const progreso = document.createElement('div');
  progreso.className = 'progreso';
  document.body.append(progreso);
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progreso.style.setProperty('--p', max > 0 ? scrollY / max : 0);
  }, { passive: true });

  // El aro de la portada reacciona al ratón
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5) * 2);
    hero.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5) * 2);
  });

  // Aparición escalonada
  const ver = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('main h2, .contenido > p, article, .grupo, .cifras li, .etiquetas').forEach((el) => {
    el.style.setProperty('--d', [...el.parentElement.children].indexOf(el) % 4 * 90 + 'ms');
    el.classList.add('aparece');
    ver.observe(el);
  });

  // Contadores
  const contar = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, fin = +el.dataset.n, inicio = performance.now();
      const paso = (t) => {
        const k = Math.min((t - inicio) / 1100, 1);
        el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
      obs.unobserve(el);
    });
  });
  document.querySelectorAll('[data-n]').forEach((el) => { el.textContent = '0'; contar.observe(el); });
}

// Marca cada sección cuando entra en pantalla (dibuja la línea de los títulos)
const marcar = new IntersectionObserver((entradas, obs) => {
  entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('en-vista'); obs.unobserve(e.target); } });
}, { threshold: 0.2 });
document.querySelectorAll('main section').forEach((s) => marcar.observe(s));