document.addEventListener('DOMContentLoaded', function() {

    // ================================
    // MOBILE NAVIGATION
    // ================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // ================================
    // STAT COUNTER ANIMATION
    // ================================
    function getSuffix(labelText) {
        const t = labelText.toLowerCase();
        if (t.includes('rate'))  return '%';
        if (t.includes('hour'))  return 'h';
        return '+';
    }

    function startCounter(el) {
        const statItem  = el.closest('.stat-item');
        const labelEl   = statItem ? statItem.querySelector('.stat-label') : null;
        const labelText = labelEl ? labelEl.textContent : '';
        const suffix    = getSuffix(labelText);
        const target    = parseInt(el.getAttribute('data-target'), 10);

        if (isNaN(target)) return;

        const duration  = 2000;
        const frameRate = 16;
        const steps     = duration / frameRate;
        const increment = target / steps;
        let current     = 0;

        el.textContent = '0' + suffix;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, frameRate);
    }

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                    counters.forEach(startCounter);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(statsSection);
    }

    // ================================
    // NAVBAR SCROLL EFFECT
    // ================================
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 100
                ? '0 4px 20px rgba(0,0,0,0.08)'
                : '0 2px 4px rgba(0,0,0,0.05)';
        }
    });

    // ================================
    // CONTACT FORM
    // ================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
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
    // SMOOTH SCROLL
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ================================
    // SCROLL REVEAL ANIMATION
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
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
});
