document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-links');
    const progress = document.querySelector('.scroll-progress');

    /* ---------- Menu ---------- */
    function setOpen(open) {
        if (!menu || !hamburger) return;
        menu.classList.toggle('nav-active', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    }

    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            setOpen(!menu.classList.contains('nav-active'));
        });

        // Close when clicking outside the menu
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
                setOpen(false);
            }
        });

        // Close after picking a link
        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setOpen(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    /* ---------- Scroll progress bar and header that hides on the way down ---------- */
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        if (progress) {
            progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
        }

        if (header) {
            if (y > lastY && y > 120) {
                header.classList.add('hide');
                setOpen(false);
            } else if (y < lastY) {
                header.classList.remove('hide');
            }
        }

        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    onScroll();

    /* ---------- Reveal content as it scrolls into view ---------- */
    const items = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

        items.forEach((el) => observer.observe(el));
    } else {
        items.forEach((el) => el.classList.add('in'));
    }
});
