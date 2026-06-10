/**
 * FINCENTIVE IO — Main JS
 * Scroll animations (IntersectionObserver) + mobile nav toggle
 */

(function () {
  'use strict';

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const body      = document.body;

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMobile.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     HEADER SCROLL STATE
     ============================================================ */
  const header = document.getElementById('site-header');

  if (header) {
    function updateHeader () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ============================================================
     INTERSECTION OBSERVER — SCROLL ANIMATIONS
     Add will-animate first so CSS starts at opacity:1 by default,
     then JS opts elements into the animation only when ready.
     ============================================================ */
  const animatedEls = document.querySelectorAll('.fade-up, .fade-in');

  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {

    // Mark elements for animation BEFORE observer fires
    animatedEls.forEach(function (el) {
      el.classList.add('will-animate');
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });

  } else {
    // No IntersectionObserver — elements already visible via CSS default
    animatedEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================================
     HERO COUNTER ANIMATION
     ============================================================ */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-target]');

  if (counterEls.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ============================================================
     ACTIVE NAV LINK
     ============================================================ */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
    const linkPath = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (linkPath === currentPath || (currentPath === '' && linkPath === '/')) {
      link.classList.add('active');
    }
  });

})();
