// ================================
// Talent Loop - Main JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded!');

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
    }

    // ================================
    // STAT COUNTER ANIMATION
    // FIX: Old code used strict bounding-rect check requiring ALL 4 edges
    // inside viewport simultaneously — nearly impossible for a full-width
    // section. Replaced with IntersectionObserver at threshold:0.3 so
    // animation fires as soon as 30% of the stats section is visible.
    // ================================
    function startCounter(element) {
        const target    = parseInt(element.getAttribute('data-target'));
        const label     = element.parentElement.querySelector('.stat-label').textContent;
        const duration  = 2000;
        const framerate = 50;
        const increment = target / (duration / framerate);
        let current = 0;

        const needsPercent = label.includes('Rate') || label.includes('rate');
        const needsHours   = label.toLowerCase().includes('hour');

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            let suffix = needsPercent ? '%' : needsHours ? 'h' : '+';
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, framerate);
    }

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number[data-target]').forEach(startCounter);
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
                ? '0 4px 16px rgba(0,0,0,0.1)'
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
    // FADE-IN ANIMATION
    // ================================
    const fadeElements = document.querySelectorAll('.feature-card, .blog-card, .value-item, .team-member');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(element);
        });
    }
});
