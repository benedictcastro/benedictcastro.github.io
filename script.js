(() => {
  const header = document.getElementById('siteHeader');
  const meter = document.getElementById('scrollMeter');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 18);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (meter) meter.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    nav.addEventListener('click', event => {
      if (!event.target.closest('a')) return;
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealItems.forEach(el => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  }

  const countItems = document.querySelectorAll('[data-count]');
  const animateCount = el => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1100;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  countItems.forEach(el => countObserver.observe(el));

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-40% 0px -52% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1200px) rotateX(${(-y * 1.2).toFixed(2)}deg) rotateY(${(x * 1.2).toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
