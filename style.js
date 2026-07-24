document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================
       1. INTERSECTION OBSERVER FOR FADE-UP ANIMATIONS (FIXED)
       Disimpan di paling atas agar elemen langsung muncul!
    =================================================== */
    const fadeElements = document.querySelectorAll('.fade-up');

    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const observerOptions = {
            root: null, // Menggunakan viewport browser
            threshold: 0.01, // Pemicu sangat sensitif (1% terlihat langsung muncul)
            rootMargin: "0px"
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => appearOnScroll.observe(el));

        // Fallback pemicu jika observer terlambat mendeteksi
        setTimeout(() => {
            fadeElements.forEach(el => el.classList.add('visible'));
        }, 300);
    } else {
        // Fallback untuk browser lama
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    /* ===================================================
       2. SCROLL PROGRESS, STICKY NAV & BACK TO TOP
    =================================================== */
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.getElementById('mainNav');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTop');

    function handleScroll() {
        const winScroll = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // A. Progress Bar Update
        if (progressBar && height > 0) {
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = `${scrolled}%`;
        }

        // B. Sticky Navbar
        if (navbar) {
            if (winScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // C. Active Nav Link Highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            if (winScroll >= sectionTop && winScroll < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // D. Back to Top Button Visibility
        if (backToTopBtn) {
            if (winScroll > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger awal saat halaman dimuat

    // Action Back to Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ===================================================
       3. AUTO CLOSE MOBILE NAVBAR MENU (SAFE CHECK)
    =================================================== */
    const navCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navCollapse && navCollapse.classList.contains('show')) {
                try {
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
                        bsCollapse.hide();
                    } else {
                        navCollapse.classList.remove('show');
                    }
                } catch (e) {
                    navCollapse.classList.remove('show');
                }
            }
        });
    });

    /* ===================================================
       4. OPTIMIZED MOUSE GLOW FOLLOWER
    =================================================== */
    const mouseGlow = document.getElementById('mouse-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let isMouseMoving = false;

    if (mouseGlow && window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;
        }, { passive: true });

        function animateGlow() {
            if (isMouseMoving) {
                glowX += (mouseX - glowX) * 0.1;
                glowY += (mouseY - glowY) * 0.1;
                mouseGlow.style.left = `${glowX}px`;
                mouseGlow.style.top = `${glowY}px`;
            }
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    /* ===================================================
       5. TYPING TEXT EFFECT
    =================================================== */
    const typingTextElement = document.getElementById('typing-text');
    const words = [
        "Software & AI Engineer",
        "Frontend Developer",
        "Financial & Forex Trader",
        "Continuous Learner"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!typingTextElement) return;

        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 35 : 75;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    /* ===================================================
       6. 3D TILT EFFECT UNTUK CARDS
    =================================================== */
    if (window.matchMedia('(hover: hover)').matches) {
        const glassCards = document.querySelectorAll('.glass-card, .academic-card, .project-card');

        glassCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s ease';
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            });
        });
    }

});