document.addEventListener('DOMContentLoaded', () => {

  // ================================
  // MOBILE NAVIGATION
  // ================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = isActive ? 'rotate(45deg) translate(7px, 6px)' : '';
      spans[1].style.opacity = isActive ? '0' : '1';
      spans[2].style.transform = isActive ? 'rotate(-45deg) translate(7px, -6px)' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      });
    });
  }

  // ================================
  // NAVBAR SCROLL EFFECT
  // ================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
  }

  // ================================
  // STAT COUNTER ANIMATION
  // ================================
  const getSuffix = label => {
    const t = label.toLowerCase();
    if (t.includes('rate')) return '%';
    if (t.includes('hour') || t.includes('hours')) return 'h';
    return '+';
  };

  const animateCounter = (el) => {
    const statItem = el.closest('.stat-item');
    const labelEl = statItem ? statItem.querySelector('.stat-label') : null;
    const labelText = labelEl ? labelEl.textContent : '';
    const suffix = getSuffix(labelText);
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const frameRate = 16;
    const steps = duration / frameRate;
    const increment = target / steps;
    let current = 0;

    el.textContent = '0' + suffix;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, frameRate);
  };

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-number[data-target]');
          counters.forEach(animateCounter);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }

  // ================================
  // SCROLL REVEAL ANIMATIONS
  // ================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ================================
  // 3D PARALLAX ON HERO (mouse move)
  // ================================
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      const orbs = hero.querySelectorAll('.hero-orb');
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 15;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });

    hero.addEventListener('mouseleave', () => {
      const orbs = hero.querySelectorAll('.hero-orb');
      orbs.forEach(orb => {
        orb.style.transform = '';
        orb.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { orb.style.transition = ''; }, 800);
      });
    });
  }

  // ================================
  // 3D TILT ON FEATURE CARDS
  // ================================
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const inner = card.querySelector('.feature-card-inner');
      if (!inner) return;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      const tiltX = (y - 0.5) * -8;
      const tiltY = (x - 0.5) * 8;
      inner.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.feature-card-inner');
      if (!inner) return;
      inner.style.transform = '';
      inner.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { inner.style.transition = ''; }, 500);
    });
  });

  // ================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ================================
  // CONTACT FORM
  // ================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('formSuccess');
      if (successMsg) {
        successMsg.style.display = 'block';
        contactForm.reset();
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    });
  }

  // ================================
  // JOBS FILTER
  // ================================
  const filterTags = document.querySelectorAll('.filter-tag');
  const jobCards = document.querySelectorAll('.job-card');
  const visibleCount = document.getElementById('visibleCount');

  if (filterTags.length > 0) {
    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        const filter = tag.getAttribute('data-filter');
        let count = 0;
        jobCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
            count++;
          } else {
            card.style.display = 'none';
          }
        });
        if (visibleCount) visibleCount.textContent = count;
      });
    });
  }
});
