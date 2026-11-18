document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

   
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        
        if (section.id !== 'home') {
            section.style.opacity = 0;
            section.style.transform = 'translateY(20px)';
            sectionObserver.observe(section);
        }
    });

  
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
            typeSpeed = 1500; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; 
            typeSpeed = 500; 
        }

        setTimeout(typeWriter, typeSpeed);
    }

 
    if (typewriterTextElement) {
        setTimeout(typeWriter, 1000);
    }



  
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('active');
        });


        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    hamburger.classList.remove('active');
                }
            }
        });

       
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }
});
