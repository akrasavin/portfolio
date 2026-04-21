const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');
const year = document.getElementById('year');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const reveals = [...document.querySelectorAll('.reveal')];
let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
root.setAttribute('data-theme', theme);
function renderToggle() { if (!toggle) return; toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`); toggle.innerHTML = `<span aria-hidden="true">${theme === 'dark' ? '☀' : '☾'}</span>`; }
renderToggle();
toggle?.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', theme); renderToggle(); });
if (year) year.textContent = new Date().getFullYear();
const sectionObserver = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { const current = `#${entry.target.id}`; navLinks.forEach((link) => link.setAttribute('aria-current', link.getAttribute('href') === current ? 'true' : 'false')); } }); }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.05 });
sections.forEach((section) => sectionObserver.observe(section));
const revealObserver = new IntersectionObserver((entries, observer) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
reveals.forEach((node) => revealObserver.observe(node));
// Lightbox
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox && lightboxImg && lightboxClose) {

  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      lightboxImg.src = trigger.dataset.src;
      lightboxImg.alt = trigger.querySelector('img').alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

}