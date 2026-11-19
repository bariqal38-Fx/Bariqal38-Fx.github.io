/* ==========================================================================
   Alif Bariq — Portfolio
   animations.js  —  Lenis smooth scroll + animasi yang sinkron dengan Lenis
   ========================================================================== */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const $  = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    function ready(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
        else fn();
    }

    /* Pekerjaan yang dijalankan tiap ada guliran. */
    const scrollJobs = [];
    const onScroll = (fn) => scrollJobs.push(fn);

    /* --------------------------------------------------------------------
       1. LENIS — mesin gulir halus
       -------------------------------------------------------------------- */
    function initLenis() {
        if (!window.Lenis) return null;

        const lenis = new window.Lenis({
            lerp: 0.1,
            smoothWheel: true,
            touchMultiplier: 1.4,
        });

        const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);

        lenis.on('scroll', () => { scrollJobs.forEach((fn) => fn()); });

        // Navigasi anchor ikut halus, dengan offset header
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const id = link.getAttribute('href');
            if (!id || id.length < 2) return;

            const target = document.querySelector(id);
            if (!target) return;

            event.preventDefault();
            lenis.scrollTo(target, { offset: -72, duration: 1.4 });
        }, true);

        window.__smoothScrollTo = (target) => lenis.scrollTo(target, { duration: 1.4 });
        window.__lenis = lenis;

        return lenis;
    }

    /* --------------------------------------------------------------------
       2. REVEAL — masuk viewport
       -------------------------------------------------------------------- */
    function initReveal() {
        const items = $$('.reveal');
        if (!items.length) return;

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

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

        items.forEach((el) => io.observe(el));
    }

    /* --------------------------------------------------------------------
       3. HERO — judul masuk berjenjang
       -------------------------------------------------------------------- */
    function initHero() {
        const hero = $('.hero');
        if (!hero || reduceMotion) return;

        const targets = $$('.eyebrow, .hero-title span, .hero-role, .hero-desc, .hero-actions, .terminal', hero);
        targets.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(26px)';
            el.style.transition = `opacity .9s cubic-bezier(.16,1,.3,1) ${140 + i * 90}ms,`
                                + `transform .9s cubic-bezier(.16,1,.3,1) ${140 + i * 90}ms`;
        });

        requestAnimationFrame(() => requestAnimationFrame(() => {
            targets.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
        }));
    }

    /* --------------------------------------------------------------------
       4. PARALLAKS — foto hero/hobi
       -------------------------------------------------------------------- */
    function initParallax() {
        const imgs = $$('.bleed img, .hero-media img');
        if (!imgs.length) return;

        onScroll(() => {
            const vh = window.innerHeight || 1;
            imgs.forEach((img) => {
                const r = img.parentElement.getBoundingClientRect();
                const progress = (r.top + r.height / 2 - vh / 2) / vh;
                img.style.transform = `translate3d(0, ${(progress * 26).toFixed(1)}px, 0) scale(1.15)`;
            });
        });
    }

    /* --------------------------------------------------------------------
       5. SERTIFIKAT — guliran halaman menggerakkan rel ke samping
       -------------------------------------------------------------------- */
    function initRail() {
        const wrap = $('#certWrap');
        const rail = $('#certificateGrid');
        if (!wrap || !rail) return;

        onScroll(() => {
            const r = wrap.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const total = Math.max(1, r.height - vh);
            const passed = Math.min(Math.max(-r.top, 0), total);
            const max = rail.scrollWidth - rail.clientWidth;

            rail.scrollLeft = Math.round((passed / total) * max);
        });

        // Tombol panah tetap bisa dipakai
        const step = () => Math.max(240, rail.clientWidth * 0.7);
        const prev = $('#certPrev');
        const next = $('#certNext');
        if (prev) prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
        if (next) next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
    }

    /* --------------------------------------------------------------------
       6. PANGGUNG GITAR — gitar membesar, lalu masuk ke foto
       -------------------------------------------------------------------- */
    function initStage() {
        const stage = $('#hobiStage');
        const photo = stage ? $('.stage__photo', stage) : null;
        const guitar = stage ? $('.stage__guitar', stage) : null;
        if (!stage || !photo || !guitar) return;

        onScroll(() => {
            const r = stage.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const total = Math.max(1, r.height + vh);
            const passed = Math.min(Math.max(vh - r.top, 0), total);
            const p = passed / total;

            guitar.style.transform = `translate(-50%, -50%) scale(${(0.45 + p * 1.5).toFixed(3)})`;
            guitar.style.opacity = String(Math.max(0, 1 - Math.max(0, p - 0.22) / 0.33));
        });
    }

    /* --------------------------------------------------------------------
       7. TOMBOL MAGNET — tertarik halus ke kursor (tanpa library)
       -------------------------------------------------------------------- */
    function initMagnetic() {
        if (!finePointer || reduceMotion) return;

        $$('.btn, .rail-btn').forEach((el) => {
            let raf = null;
            let tx = 0, ty = 0, cx = 0, cy = 0;

            const loop = () => {
                cx += (tx - cx) * 0.18;
                cy += (ty - cy) * 0.18;
                el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
                if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) raf = requestAnimationFrame(loop);
                else raf = null;
            };

            el.addEventListener('mousemove', (event) => {
                const box = el.getBoundingClientRect();
                tx = (event.clientX - (box.left + box.width / 2)) * 0.18;
                ty = (event.clientY - (box.top + box.height / 2)) * 0.18;
                if (!raf) raf = requestAnimationFrame(loop);
            });

            el.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
        });
    }

    /* --------------------------------------------------------------------
       INISIALISASI
       -------------------------------------------------------------------- */
    ready(() => {
        initReveal();
        initHero();
        initMagnetic();

        if (reduceMotion) return;

        const lenis = initLenis();

        if (lenis) {
            // Lenis memanggil semua pekerjaan gulir
            initParallax();
            initRail();
            initStage();
        } else {
            // Cadangan: Lenis gagal dimuat
            const wake = () => scrollJobs.forEach((fn) => fn());
            window.addEventListener('scroll', wake, { passive: true });
            initParallax();
            initRail();
            initStage();
            wake();
        }
    });
})();
