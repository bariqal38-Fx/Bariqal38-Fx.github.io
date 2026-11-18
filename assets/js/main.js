/* ==========================================================================
   Alif Bariq — Luxury Tech Portfolio
   main.js
   --------------------------------------------------------------------------
   Semua interaksi halaman ada di sini, urutannya:
     1. Render data        (sertifikat, proyek, hobi, about)
     2. Navigasi           (menu mobile, efek gulir, link aktif)
     3. Animasi            (reveal, mengetik, glow mengikuti mouse)
     4. Form kontak        (kirim ke Google Sheets)

   Isi konten ada di assets/js/data.js — tidak perlu menyentuh file ini
   hanya untuk menambah/mengubah data.
   ========================================================================== */
(() => {
    'use strict';

    const $  = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ======================================================================
       1. RENDER DATA
       ====================================================================== */

    // Gambar cadangan bila file gambar gagal dimuat.
    const FALLBACK_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
            <rect width="100%" height="100%" fill="#0b0d12"/>
            <text x="50%" y="50%" fill="#e8c468" font-family="monospace" font-size="26"
                  text-anchor="middle" dominant-baseline="middle">Gambar</text>
        </svg>
    `);

    /** Pasang penangan error pada semua img yang bertanda data-fallback. */
    function watchImages() {
        $$('img[data-fallback]').forEach((img) => {
            img.addEventListener('error', () => { img.src = FALLBACK_IMG; }, { once: true });
        });
    }

    function renderAbout(items) {
        const mount = $('#aboutCards');
        if (!mount) return;

        mount.innerHTML = items.map((item) => `
            <article class="card about-card reveal">
                <span class="about-icon" aria-hidden="true"><i class="bi ${item.icon}"></i></span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </article>
        `).join('');
    }

    function renderCertificates(items) {
        const mount = $('#certificateGrid');
        if (!mount) return;

        mount.innerHTML = items.map((item) => `
            <article class="card certificate-card reveal">
                <a class="certificate-media" href="${item.link}" target="_blank" rel="noopener noreferrer">
                    <img src="${item.img}" alt="Sertifikat ${item.title}"
                         loading="lazy" decoding="async" data-fallback>
                </a>
                <div class="certificate-body">
                    <span class="badge-year">${item.year}</span>
                    <h3 class="certificate-title">${item.title}</h3>
                    <p class="certificate-desc">${item.desc}</p>
                    <a class="btn btn--ghost btn--sm" href="${item.link}" target="_blank" rel="noopener noreferrer">
                        Lihat Sertifikat <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }

    function renderProjects(items) {
        const mount = $('#projectGrid');
        if (!mount) return;

        mount.innerHTML = items.map((item) => `
            <article class="card project-card reveal">
                <div class="project-media">
                    <img src="${item.img}" alt="${item.title}"
                         loading="lazy" decoding="async" data-fallback>
                </div>
                <div class="project-body">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </article>
        `).join('');
    }

    function renderHobi(data) {
        const cardMount = $('#hobiCards');
        if (cardMount) {
            cardMount.innerHTML = data.cards.map((card) => `
                <figure class="hobi-card reveal${card.featured ? ' hobi-card--featured' : ''}">
                    <img src="${card.img}" alt="${card.title}"
                         loading="lazy" decoding="async" data-fallback>
                    <figcaption>
                        <h3>${card.title}</h3>
                        <p>${card.desc}</p>
                    </figcaption>
                </figure>
            `).join('');
        }
    }

    function renderFeatured(item) {
        const mount = $('#featuredProject');
        if (!mount) return;

        mount.innerHTML = `
            <article class="featured-card reveal">
                <a class="featured-media" href="${item.live || item.repo}" target="_blank" rel="noopener noreferrer"
                   aria-label="Buka ${item.title} secara langsung">
                    <img src="${item.img}" alt="Tampilan ${item.title}" loading="lazy" decoding="async" data-fallback>
                    <span class="featured-tag">${item.tag}</span>
                </a>
                <div class="featured-body">
                    <p class="featured-kicker">${item.kicker}</p>
                    <h3>${item.title}</h3>
                    <p class="featured-desc">${item.desc}</p>
                    <div class="badges">
                        ${item.stack.map((tech) => `<span class="badge">${tech}</span>`).join('')}
                    </div>
                    <div class="featured-actions">
                        <a class="btn btn--primary btn--sm" href="${item.live || item.repo}" target="_blank" rel="noopener noreferrer">
                            <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i> Lihat Live
                        </a>
                        <a class="btn btn--ghost btn--sm" href="${item.repo}" target="_blank" rel="noopener noreferrer">
                            <i class="bi bi-github" aria-hidden="true"></i> Kode Sumber
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

    /* ======================================================================
       2. NAVIGASI
       ====================================================================== */

    function initNav() {
        const header    = $('#siteHeader');
        const toggle    = $('#navToggle');
        const menu      = $('#navMenu');
        const progress  = $('#scrollProgress');
        const backToTop = $('#backToTop');

        // Buka/tutup menu mobile
        if (toggle && menu) {
            const setMenu = (open) => {
                menu.classList.toggle('open', open);
                toggle.classList.toggle('is-open', open);
                toggle.setAttribute('aria-expanded', String(open));
                toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
            };

            toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

            // Otomatis tutup saat tautan diklik
            $$('a', menu).forEach((link) => {
                link.addEventListener('click', () => setMenu(false));
            });

            // Tutup saat menekan tombol Escape
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') setMenu(false);
            });
        }

        // Progress bar, header, dan tombol ke atas — semuanya dari satu listener
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
                // Bila Lenis aktif, pakai scrollTo halus dari Lenis
                if (window.__smoothScrollTo) {
                    window.__smoothScrollTo(0);
                    return;
                }
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        }
    }

    /** Tandai tautan nav yang sesuai dengan section yang sedang terlihat. */
    function initScrollSpy() {
        const links = $$('#navMenu a');
        if (!links.length || !('IntersectionObserver' in window)) return;

        // Target bisa berupa <section> maupun <div> (mis. #hobi).
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

    /* ======================================================================
       3. ANIMASI
       ====================================================================== */

    /** Munculkan elemen .reveal saat masuk viewport, dengan jeda berjenjang. */
    function initReveal() {
        const items = $$('.reveal');
        if (!items.length) return;

        // Beri jeda berbeda per kartu dalam satu kelompok.
        const counters = new Map();
        items.forEach((el) => {
            const parent = el.parentElement;
            const index  = counters.get(parent) || 0;
            el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
            counters.set(parent, index + 1);
        });

        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('in'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        items.forEach((el) => observer.observe(el));
    }

    /** Efek mengetik peran/jabatan di hero. */
    function initTyping() {
        const el = $('#typingText');
        if (!el) return;

        const roles = PORTFOLIO.roles;
        if (reduceMotion) {
            el.textContent = roles[0];
            return;
        }

        let role = 0;
        let char = 0;
        let deleting = false;

        const tick = () => {
            const word = roles[role];
            let delay;

            if (deleting) {
                char = Math.max(0, char - 1);
                el.textContent = word.slice(0, char);
                if (char === 0) {
                    deleting = false;
                    role = (role + 1) % roles.length;
                    delay = 350;
                } else {
                    delay = 32;
                }
            } else {
                char = Math.min(word.length, char + 1);
                el.textContent = word.slice(0, char);
                if (char === word.length) {
                    deleting = true;
                    delay = 1800;
                } else {
                    delay = 70;
                }
            }

            setTimeout(tick, delay);
        };

        tick();
    }

    /** Cahaya lembut yang mengikuti kursor (hanya di perangkat dengan mouse). */
    function initMouseGlow() {
        const glow = $('#mouseGlow');
        if (!glow || reduceMotion || !finePointer) return;

        const radius = 250; // setengah dari ukuran elemen glow
        let targetX = window.innerWidth / 2;
        let targetY = 120;
        let x = targetX;
        let y = targetY;
        let raf = null;

        const loop = () => {
            x += (targetX - x) * 0.08;
            y += (targetY - y) * 0.08;
            glow.style.transform = `translate(${x - radius}px, ${y - radius}px)`;

            const settled = Math.abs(targetX - x) < 0.5 && Math.abs(targetY - y) < 0.5;
            raf = settled ? null : requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
            if (!raf) raf = requestAnimationFrame(loop);
        }, { passive: true });
    }

    /* ======================================================================
       4. FORM KONTAK
       ====================================================================== */
    function initContactForm() {
        const form = $('#contactForm');
        if (!form) return;

        const alertBox  = $('#formAlert');
        const submitBtn = $('#submitBtn');
        const loadingBtn = $('#loadingBtn');

        // URL Google Apps Script sudah disiapkan di spreadsheet.
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxt4C8BLiTquEDwsxknOQgOFcZB86S5c0M__zYsrjs4l40O6CZehs8lbWp42feWeFSX7g/exec';

        const showAlert = (type, message) => {
            if (!alertBox) return;
            const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
            alertBox.className = `form-alert form-alert--${type}`;
            alertBox.innerHTML = `<i class="bi ${icon}" aria-hidden="true"></i><span>${message}</span>`;
            alertBox.hidden = false;
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            submitBtn.classList.add('is-hidden');
            loadingBtn.classList.remove('is-hidden');

            fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form) })
                .then(() => {
                    showAlert('success', 'Pesan Anda telah terkirim. Terima kasih!');
                    form.reset();
                })
                .catch((error) => {
                    console.error('Gagal mengirim pesan:', error);
                    showAlert('error', 'Terjadi kesalahan. Silakan coba lagi.');
                })
                .finally(() => {
                    loadingBtn.classList.add('is-hidden');
                    submitBtn.classList.remove('is-hidden');
                });
        });
    }

    /* ======================================================================
       INISIALISASI
       ====================================================================== */
    function init() {
        renderAll();
        initReveal();
        initNav();
        initScrollSpy();
        initTyping();
        initMouseGlow();
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
