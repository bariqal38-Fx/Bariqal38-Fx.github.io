/* ==========================================================================
   Alif Bariq — Luxury Tech Portfolio
   animations.js  (animasi tambahan, opsional — butuh anime.js)
   --------------------------------------------------------------------------
   Aman dimuat tanpa anime.js: semua efek di file ini otomatis dilewati dan
   halaman tetap tampil normal (reveal CSS di main.js yang mengambil alih).
   ========================================================================== */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const anime        = window.anime;          // undefined bila CDN gagal dimuat

    const $  = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    /* ---------------------------------------------------------------------
       1. HERO — semua elemen masuk berjenjang saat halaman dibuka
       --------------------------------------------------------------------- */
    function initHero() {
        const hero = $('.hero');
        if (!hero || !anime) return;

        const targets = [
            hero.querySelector('.avatar'),
            hero.querySelector('.eyebrow'),
            hero.querySelector('.hero-title'),
            hero.querySelector('.hero-role'),
            hero.querySelector('.hero-desc'),
            hero.querySelector('.hero-actions'),
            hero.querySelector('.hero-terminal'),
        ].filter(Boolean);

        if (!targets.length) return;

        anime.set(targets, { opacity: 0, translateY: 36 });

        anime({
            targets,
            opacity:   [0, 1],
            translateY: [36, 0],
            duration: 1000,
            easing: 'easeOutExpo',
            delay: anime.stagger(120, { start: 200 }),
            complete: () => anime.set(targets, { opacity: '', translateY: '' }),
        });
    }

    /* ---------------------------------------------------------------------
       2. JUDUL SECTION — dipecah per kata, muncul satu per satu
       --------------------------------------------------------------------- */
    function splitWords(el) {
        const text = el.textContent.trim();
        if (!text) return;

        el.setAttribute('aria-label', text);
        el.textContent = '';

        text.split(/\s+/).forEach((word) => {
            const span = document.createElement('span');
            span.className = 'split-word';
            span.textContent = word;
            el.appendChild(span);
            el.appendChild(document.createTextNode(' '));
        });
    }

    function initSplitTitles() {
        const titles = $$('.section-title');
        if (!titles.length) return;

        titles.forEach((el) => {
            splitWords(el);
            const words = $$('.split-word', el);

            if (anime) {
                anime.set(words, { opacity: 0, translateY: 26 });
            } else {
                words.forEach((w) => w.classList.add('is-hidden-w'));
            }

            const show = () => {
                if (anime) {
                    anime({
                        targets: words,
                        opacity:   [0, 1],
                        translateY: [26, 0],
                        duration: 720,
                        easing: 'easeOutExpo',
                        delay: anime.stagger(90),
                        complete: () => anime.set(words, { opacity: '', translateY: '' }),
                    });
                } else {
                    words.forEach((w) => w.classList.remove('is-hidden-w'));
                }
            };

            if (!('IntersectionObserver' in window)) { show(); return; }

            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) { show(); io.disconnect(); }
                });
            }, { threshold: 0.35 });

            io.observe(el);
        });
    }

    /* ---------------------------------------------------------------------
       3. TOMBOL MAGNET — tombol tertarik halus ke arah kursor
       --------------------------------------------------------------------- */
    function initMagnetic() {
        if (!anime || !finePointer) return;

        $$('.btn').forEach((el) => {
            el.addEventListener('mousemove', (event) => {
                const r = el.getBoundingClientRect();
                const x = event.clientX - (r.left + r.width  / 2);
                const y = event.clientY - (r.top  + r.height / 2);

                anime.remove(el);
                anime({
                    targets: el,
                    translateX: x * 0.22,
                    translateY: y * 0.22 - 3,
                    duration: 420,
                    easing: 'easeOutQuad',
                });
            });

            el.addEventListener('mouseleave', () => {
                anime.remove(el);
                anime({
                    targets: el,
                    translateX: 0,
                    translateY: 0,
                    duration: 700,
                    easing: 'easeOutElastic(1, .45)',
                });
            });
        });
    }

    /* ---------------------------------------------------------------------
       4. PARALLAX — glow latar bergerak mengikuti gulir
       --------------------------------------------------------------------- */
    function initParallax() {
        const g1 = $('.glow--1');
        const g2 = $('.glow--2');
        if (!g1 && !g2) return;

        let ticking = false;

        const update = () => {
            const y = window.scrollY || document.documentElement.scrollTop || 0;
            if (g1) g1.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
            if (g2) g2.style.transform = `translate3d(0, ${(-y * 0.08).toFixed(1)}px, 0)`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });

        update();
    }

    /* ---------------------------------------------------------------------
       5. SOROTAN KARTU — cahaya lembut mengikuti kursor di dalam kartu
       --------------------------------------------------------------------- */
    function initCardSpotlight() {
        if (!finePointer) return;

        $$('.card, .hobi-card, .featured-card').forEach((el) => {
            el.addEventListener('mousemove', (event) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mx', `${event.clientX - r.left}px`);
                el.style.setProperty('--my', `${event.clientY - r.top}px`);
            });
        });
    }

    /* ---------------------------------------------------------------------
       INISIALISASI
       --------------------------------------------------------------------- */
    ready(() => {
        if (reduceMotion) return;      // hormati pengguna yang mematikan animasi

        initHero();
        initSplitTitles();
        initParallax();

        if (finePointer) {
            initMagnetic();
            initCardSpotlight();
        }
    });
})();
