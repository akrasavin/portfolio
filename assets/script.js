const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');
const year = document.getElementById('year');
const brandLink = document.querySelector('.brand');

const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const reveals = [...document.querySelectorAll('.reveal')];

let theme =
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

root.setAttribute('data-theme', theme);

function renderToggle() {
  if (!toggle) return;

  toggle.setAttribute(
    'aria-label',
    `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
  );

  toggle.innerHTML = theme === 'dark' ? '☀' : '☾';
}

renderToggle();

toggle?.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  renderToggle();
});

if (year) {
  year.textContent = new Date().getFullYear();
}

function clearActiveStates() {
  navLinks.forEach(link => link.removeAttribute('aria-current'));
  brandLink?.removeAttribute('aria-current');
}

function setActiveHero() {
  clearActiveStates();
  brandLink?.setAttribute('aria-current', 'true');
}

function setActiveNav(id) {
  clearActiveStates();

  navLinks.forEach(link => {
    if (link.getAttribute('href') === `#${id}`) {
      link.setAttribute('aria-current', 'true');
    }
  });
}

function updateActiveNav() {
  const topThreshold = 80;
  const reachedTop = window.scrollY <= topThreshold;

  if (reachedTop) {
    setActiveHero();
    return;
  }

  const reachedBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

  if (reachedBottom) {
    setActiveNav('contact');
    return;
  }

  const viewportCenter = window.innerHeight * 0.5;
  let currentSection = null;
  let closestDistance = Infinity;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height * 0.5;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      currentSection = section;
    }
  });

  if (currentSection) {
    setActiveNav(currentSection.id);
  }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', updateActiveNav);
window.addEventListener('load', updateActiveNav);

updateActiveNav();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

reveals.forEach(node => revealObserver.observe(node));

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox && lightboxImg && lightboxClose) {
  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();

      const img = trigger.querySelector('img');
      lightboxImg.src = trigger.dataset.src;
      lightboxImg.alt = img ? img.alt : '';

      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}