/* Small, independent interactions. No framework, tracking, or external runtime. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const header = document.querySelector('#site-header');
  const hero = document.querySelector('#home');
  const portrait = document.querySelector('.hero-image');
  const progress = document.querySelector('.reading-progress');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  // The palette preference is optional: blocked storage never breaks the page.
  function syncThemeLabel() {
    const dark = root.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    themeToggle.setAttribute('title', `Switch to ${dark ? 'light' : 'dark'} theme`);
  }
  syncThemeLabel();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('bc-portfolio-theme', root.dataset.theme); } catch (_) { /* Optional preference. */ }
    syncThemeLabel();
  });

  function closeMenu(restoreFocus = false) {
    mobileNav.hidden = true;
    header.classList.remove('menu-is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) menuToggle.focus({ preventScroll: true });
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    if (open) { closeMenu(); return; }
    mobileNav.hidden = false;
    header.classList.add('menu-is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
  });
  mobileNav.addEventListener('click', e => {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
  });
  document.addEventListener('click', e => {
    if (!mobileNav.hidden && !header.contains(e.target)) closeMenu();
  });
  window.matchMedia('(min-width: 601px)').addEventListener('change', e => {
    if (e.matches) closeMenu();
  });

  // Keep navigation transparent over the hero, and solid over subsequent sections.
  // Native scrolling is retained; only a gentle 22px portrait drift is applied.
  let scrollQueued = false;
  const navTargets = [...document.querySelectorAll('[data-nav]')].map(link => ({
    link, section: document.getElementById(link.dataset.nav)
  }));
  function updateScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    header.classList.toggle('is-solid', y >= hero.offsetHeight - header.offsetHeight);
    const length = root.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${length > 0 ? Math.min(y / length, 1) : 0})`;
    if (!reduceMotion.matches && window.innerWidth > 600 && y < hero.offsetHeight) {
      portrait.style.transform = `translateY(${Math.min(y * .035, 22)}px) scale(1.025)`;
    } else {
      portrait.style.transform = '';
    }
    const marker = y + window.innerHeight * .35;
    navTargets.forEach(({ link, section }) => {
      const active = marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScroll() {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateScroll);
    }
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  window.addEventListener('load', updateScroll);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleScroll).observe(document.body);
  updateScroll();

  // Content is visible by default. Only below-the-fold items are prepared for a reveal.
  const reveals = [...document.querySelectorAll('.reveal')];
  let revealObserver;
  const activeAnimations = new Set();
  if ('IntersectionObserver' in window && !reduceMotion.matches && Element.prototype.animate) {
    revealObserver = new IntersectionObserver(entries => {
      let stagger = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        revealObserver.unobserve(el);
        el.style.opacity = '';
        if (reduceMotion.matches) return;
        const animation = el.animate([
          { opacity: 0, transform: 'translateY(24px)', filter: 'blur(3px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }
        ], { duration: 780, delay: Math.min(stagger++ * 60, 180), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        activeAnimations.add(animation);
        animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
      });
    }, { threshold: .07, rootMargin: '0px 0px -28px 0px' });
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top > window.innerHeight * .95) el.style.opacity = '0';
      revealObserver.observe(el);
    });
    document.addEventListener('focusin', e => {
      const parent = e.target.closest('.reveal');
      if (parent) { parent.style.opacity = ''; revealObserver.unobserve(parent); }
    });
  }
  reduceMotion.addEventListener('change', e => {
    if (e.matches) {
      revealObserver?.disconnect();
      reveals.forEach(el => { el.style.opacity = ''; });
      activeAnimations.forEach(animation => animation.cancel());
    }
    scheduleScroll();
  });

  // A faint moving highlight responds to the pointer without moving the text.
  document.querySelectorAll('.project-card').forEach(card => {
    let frame;
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduceMotion.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - box.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - box.top}px`);
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    });
  });

  // Informative external links preserve the visitor's place in the portfolio.
  document.querySelectorAll('.keyword-list a').forEach(link => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${link.textContent.trim()} — definition or reference, opens in a new tab`);
    link.title = `Read about ${link.textContent.trim()}`;
  });

  // Native dialog provides a focus trap, inert background, and keyboard semantics.
  const dialog = document.querySelector('#project-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const category = document.querySelector('#dialog-category');
  let sourceCard = null;
  let sourceLink = null;
  let modalAnimation = null;
  let closing = false;

  function cardTransform() {
    const from = sourceCard.getBoundingClientRect();
    const to = dialog.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${Math.max(.15, from.width / to.width)}, ${Math.max(.15, from.height / to.height)})`;
  }

  function openProject(key, trigger) {
    if (dialog.open || closing) return;
    const original = document.getElementById(`case-${key}`);
    if (!original) return;
    sourceLink = trigger;
    sourceCard = trigger.closest('.project-card');
    category.textContent = original.dataset.category;
    const content = original.cloneNode(true);
    content.removeAttribute('id');
    content.removeAttribute('data-category');
    content.querySelector('.case-back')?.remove();
    const heading = content.querySelector('h2');
    heading.id = 'project-dialog-title';
    heading.tabIndex = -1;
    dialogContent.replaceChildren(content);
    document.body.classList.add('modal-open');
    dialog.classList.remove('is-closing');
    dialog.showModal();
    dialog.scrollTop = 0;
    heading.focus({ preventScroll: true });
    sourceLink.setAttribute('aria-expanded', 'true');
    if (!reduceMotion.matches && dialog.animate && sourceCard) {
      const from = cardTransform();
      modalAnimation = dialog.animate([
        { transform: from, opacity: .35, borderRadius: '20px' },
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1, borderRadius: '23px' }
      ], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
      const details = content.querySelectorAll('.case-lede,.case-tools,.case-flow,.case-body,.case-note');
      details.forEach((element, index) => {
        const animation = element.animate([
          { opacity: 0, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 440, delay: 130 + index * 35, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        activeAnimations.add(animation);
        animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
      });
      modalAnimation.finished.catch(() => {}).finally(() => { modalAnimation = null; });
    }
  }

  async function closeProject() {
    if (!dialog.open || closing) return;
    closing = true;
    modalAnimation?.cancel();
    if (!reduceMotion.matches && dialog.animate && sourceCard) {
      dialog.classList.add('is-closing');
      const animation = dialog.animate([
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
        { transform: cardTransform(), opacity: 0 }
      ], { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)' });
      await animation.finished.catch(() => {});
    }
    dialog.close();
    dialog.classList.remove('is-closing');
    document.body.classList.remove('modal-open');
    sourceLink?.setAttribute('aria-expanded', 'false');
    sourceLink?.focus({ preventScroll: true });
    closing = false;
  }

  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('.show-project').forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('aria-controls', 'project-dialog');
      link.addEventListener('click', e => {
        // Preserve normal anchor behavior for modified clicks and older browsers.
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        openProject(link.dataset.project, link);
      });
    });
    document.querySelectorAll('.close-project').forEach(button => button.addEventListener('click', closeProject));
    dialog.addEventListener('cancel', e => { e.preventDefault(); closeProject(); });
    let pointerStartedOutside = false;
    const outsideDialog = e => {
      const rect = dialog.getBoundingClientRect();
      return e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', e => { pointerStartedOutside = outsideDialog(e); });
    dialog.addEventListener('click', e => {
      if (e.target === dialog && pointerStartedOutside && outsideDialog(e)) closeProject();
      pointerStartedOutside = false;
    });
    // A history navigation must never leave the document scroll-locked.
    window.addEventListener('pagehide', () => {
      if (dialog.open) dialog.close();
      document.body.classList.remove('modal-open');
    });
  }
})();
