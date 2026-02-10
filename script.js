document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in and slide-up animation for sections on scroll
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Skip the hero section as it has its own initial animation
        if (section.id !== 'home') {
            section.style.opacity = 0;
            section.style.transform = 'translateY(20px)';
            sectionObserver.observe(section);
        }
    });

    // Typewriter effect for hero section
    const typewriterTextElement = document.getElementById('typewriter-text');
    const roles = [" Web Developer", "Coder", "Student", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typewriterTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 150; // Typing speed
        if (isDeleting) {
            typeSpeed /= 2; // Deleting faster
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 1500; // Pause at end of typing
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; // Move to next role
            typeSpeed = 500; // Pause before typing next role
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Start the typewriter effect after a delay
    if (typewriterTextElement) {
        setTimeout(typeWriter, 1000);
    }

    // Simple form submission (for demonstration, no backend)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset(); // Clear the form
        });
    }

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('active'); // Toggle active class for hamburger animation

            // Animate links
            navLinks.querySelectorAll('li').forEach((link, index) => {
                if (navLinks.classList.contains('nav-active')) {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                } else {
                    link.style.animation = 'none';
                }
            });
        });

        // Close nav when a link is clicked (for mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    hamburger.classList.remove('active');
                    navLinks.querySelectorAll('li').forEach(item => {
                        item.style.animation = 'none'; // Reset animation
                    });
                }
            });
        });
    }
});