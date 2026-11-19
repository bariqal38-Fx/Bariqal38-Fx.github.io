/* ==========================================================================
   Alif Bariq — Portfolio
   main.js  —  render data, navigasi, form kontak
   ========================================================================== */
(() => {
    'use strict';

    const $  = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --------------------------------------------------------------------
       1. RENDER DATA
       -------------------------------------------------------------------- */
    const FALLBACK_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
            <rect width="100%" height="100%" fill="#000000"/>
            <text x="50%" y="50%" fill="#ff98a2" font-family="monospace" font-size="26"
                  text-anchor="middle" dominant-baseline="middle">Gambar</text>
        </svg>
    `);

    /** Muat gambar langsung + coba ulang sebelum menyerah pada cadangan. */
    function watchImages() {
        $$('img[data-fallback]').forEach((img) => {
            img.loading = 'eager';
            let tries = 0;
            img.addEventListener('error', () => {
                tries += 1;
                if (tries <= 2) {
                    img.setAttribute('src', img.getAttribute('src'));
                    return;
                }
                img.src = FALLBACK_IMG;
            });
        });
    }

    function renderAbout(items) {
        const mount = $('#aboutCards');
        if (!mount) return;

        mount.innerHTML = items.map((item, i) => `
            <article class="row reveal">
                <span class="row-num">${String(i + 1).padStart(2, '0')}</span>
                <div class="row-body">
                    <h3 class="row-title">${item.title}</h3>
                    <p class="row-desc">${item.desc}</p>
                </div>
                <i class="bi ${item.icon} row-icon" aria-hidden="true"></i>
            </article>
        `).join('');
    }

    function renderCertificates(items) {
        const mount = $('#certificateGrid');
        if (!mount) return;

        mount.innerHTML = items.map((item) => `
            <article class="cert reveal">
                <a class="cert-media" href="${item.link}" target="_blank" rel="noopener noreferrer">
                    <img src="${item.img}" alt="Sertifikat ${item.title}" decoding="async" data-fallback>
                </a>
                <div class="cert-body">
                    <span class="cert-year">${item.year}</span>
                    <h3 class="cert-title">${item.title}</h3>
                    <p class="cert-desc">${item.desc}</p>
                    <a class="cert-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                        Lihat <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }

    function renderProjects(items) {
        const mount = $('#projectGrid');
        if (!mount) return;

        mount.innerHTML = items.map((item, i) => `
            <article class="row reveal">
                <span class="row-num">${String(i + 1).padStart(2, '0')}</span>
                <div class="row-body">
                    <h3 class="row-title">${item.title}</h3>
                    <p class="row-desc">${item.desc}</p>
                </div>
                <span class="row-arrow" aria-hidden="true">&rarr;</span>
            </article>
        `).join('');
    }

    function renderHobi(data) {
        const mount = $('#hobiCards');
        if (!mount) return;

        mount.innerHTML = data.cards.map((card, i) => `
            <figure class="shot reveal">
                <img src="${card.img}" alt="${card.title}" decoding="async" data-fallback>
                <figcaption>
                    <div>
                        <h3>${card.title}</h3>
                        <p>${card.desc}</p>
                    </div>
                    <span class="shot-index">${String(i + 1).padStart(2, '0')}</span>
                </figcaption>
            </figure>
        `).join('');
    }

    function renderFeatured(item) {
        const mount = $('#featuredProject');
        if (!mount) return;

        mount.innerHTML = `
            <article class="feature reveal">
                <a class="feature-media" href="${item.live || item.repo}" target="_blank" rel="noopener noreferrer"
                   aria-label="Buka ${item.title}">
                    <img src="${item.img}" alt="Tampilan ${item.title}" decoding="async" data-fallback>
                </a>
                <div class="feature-body">
                    <p class="feature-kicker">${item.kicker}</p>
                    <h3 class="feature-title">${item.title}</h3>
                    <p class="feature-desc">${item.desc}</p>
                    <div class="feature-stack">
                        ${item.stack.map((tech) => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <div class="feature-actions">
                        <a class="btn btn--solid" href="${item.live || item.repo}" target="_blank" rel="noopener noreferrer">
                            Lihat Live <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                        </a>
                        <a class="btn btn--outline" href="${item.repo}" target="_blank" rel="noopener noreferrer">
                            Kode Sumber
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    function renderAll() {
        renderAbout(PORTFOLIO.about);
        renderCertificates(PORTFOLIO.certificates);
        renderProjects(PORTFOLIO.projects);
        renderHobi(PORTFOLIO.hobi);
        renderFeatured(PORTFOLIO.featured);
        watchImages();
    }

    /* --------------------------------------------------------------------
       2. NAVIGASI
       -------------------------------------------------------------------- */
    function initNav() {
        const header    = $('#siteHeader');
        const toggle    = $('#navToggle');
        const menu      = $('#navMenu');
        const progress  = $('#scrollProgress');
        const backToTop = $('#backToTop');

        if (toggle && menu) {
            const setMenu = (open) => {
                menu.classList.toggle('open', open);
                toggle.classList.toggle('is-open', open);
                toggle.setAttribute('aria-expanded', String(open));
                toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
            };

            toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
            $$('a', menu).forEach((link) => link.addEventListener('click', () => setMenu(false)));
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') setMenu(false);
            });
        }

        const onScroll = () => {
            const y   = window.scrollY || document.documentElement.scrollTop;
            const max = document.documentElement.scrollHeight - window.innerHeight;

            if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            if (header)  header.classList.toggle('scrolled', y > 24);
            if (backToTop) backToTop.classList.toggle('show', y > 600);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                if (window.__smoothScrollTo) { window.__smoothScrollTo(0); return; }
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        }
    }

    /** Tandai tautan nav yang sesuai dengan section yang sedang terlihat. */
    function initScrollSpy() {
        const links = $$('#navMenu a');
        if (!links.length || !('IntersectionObserver' in window)) return;

        const targets = links
            .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
            .filter(Boolean);
        if (!targets.length) return;

        const setActive = (id) => {
            links.forEach((link) => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);
                if (isActive) link.setAttribute('aria-current', 'true');
                else         link.removeAttribute('aria-current');
            });
        };

        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        targets.forEach((target) => spy.observe(target));
    }

    /* --------------------------------------------------------------------
       3. ANIMASI TEKS
       -------------------------------------------------------------------- */
    function initTyping() {
        const el = $('#typingText');
        if (!el) return;

        const roles = PORTFOLIO.roles;
        if (reduceMotion) { el.textContent = roles[0]; return; }

        let role = 0, char = 0, deleting = false;

        const tick = () => {
            const word = roles[role];
            let delay;

            if (deleting) {
                char = Math.max(0, char - 1);
                el.textContent = word.slice(0, char);
                if (char === 0) { deleting = false; role = (role + 1) % roles.length; delay = 350; }
                else delay = 30;
            } else {
                char = Math.min(word.length, char + 1);
                el.textContent = word.slice(0, char);
                if (char === word.length) { deleting = true; delay = 1800; }
                else delay = 65;
            }

            setTimeout(tick, delay);
        };

        tick();
    }

    /* --------------------------------------------------------------------
       4. FORM KONTAK
       -------------------------------------------------------------------- */
    function initContactForm() {
        const form = $('#contactForm');
        if (!form) return;

        const alertBox   = $('#formAlert');
        const submitBtn  = $('#submitBtn');
        const loadingBtn = $('#loadingBtn');

        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxt4C8BLiTquEDwsxknOQgOFcZB86S5c0M__zYsrjs4l40O6CZehs8lbWp42feWeFSX7g/exec';

        const showAlert = (type, message) => {
            if (!alertBox) return;
            alertBox.className = `form-alert form-alert--${type}`;
            alertBox.textContent = message;
            alertBox.hidden = false;
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            submitBtn.classList.add('is-hidden');
            loadingBtn.classList.remove('is-hidden');

            fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form) })
                .then(() => { showAlert('success', 'Pesan Anda telah terkirim. Terima kasih!'); form.reset(); })
                .catch(() => showAlert('error', 'Terjadi kesalahan. Silakan coba lagi.'))
                .finally(() => {
                    loadingBtn.classList.add('is-hidden');
                    submitBtn.classList.remove('is-hidden');
                });
        });
    }

    /* --------------------------------------------------------------------
       INISIALISASI
       -------------------------------------------------------------------- */
    function init() {
        renderAll();
        initNav();
        initScrollSpy();
        initTyping();
        initContactForm();

        const yearEl = $('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
