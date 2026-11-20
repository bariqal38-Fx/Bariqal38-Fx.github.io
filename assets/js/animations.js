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
        const viewport = wrap && wrap.querySelector('.rail-viewport');
        if (!wrap || !rail || !viewport) return;

        let max = 0;
        const measure = () => {
            max = Math.max(0, rail.scrollWidth - viewport.clientWidth);
        };
        measure();
        window.addEventListener('resize', measure);

        // Gerakan dihaluskan: posisi aktual mengejar target tiap frame
        let target = 0, current = 0, raf = null;
        const ease = () => {
            current += (target - current) * 0.12;
            if (Math.abs(target - current) < 0.15) current = target;
            rail.style.transform = `translate3d(${current.toFixed(2)}px, 0, 0)`;
        };
        const loop = () => {
            ease();
            raf = current !== target ? requestAnimationFrame(loop) : null;
        };

        onScroll(() => {
            const r = wrap.getBoundingClientRect();
            const total = r.height - window.innerHeight;
            const passed = Math.min(Math.max(-r.top, 0), Math.max(total, 1));
            const p = total > 0 ? passed / total : 0;
            target = -p * max;
            ease();
            if (!raf && current !== target) raf = requestAnimationFrame(loop);
        });

        const jump = (dir) => {
            const r = wrap.getBoundingClientRect();
            const total = r.height - window.innerHeight;
            const card = rail.querySelector('.cert');
            const stepPx = card ? card.getBoundingClientRect().width + 24 : 320;
            const frac = max > 0 ? stepPx / max : 0.2;
            const targetY = window.scrollY - r.top + dir * frac * total;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        };
        const prev = $('#certPrev');
        const next = $('#certNext');
        if (prev) prev.addEventListener('click', () => jump(-1));
        if (next) next.addEventListener('click', () => jump(1));
    }

    /* --------------------------------------------------------------------
       6. HOBI — menyelam ke dalam gitar raksasa
       -------------------------------------------------------------------- */
    function initDive() {
        const dive = $('#hobiDive');
        if (!dive) return;
        const guitar = dive.querySelector('.dive__guitar');
        const word = dive.querySelector('.dive__word');
        const cap = dive.querySelector('.dive__cap');
        const hint = dive.querySelector('.dive__hint');

        onScroll(() => {
            const r = dive.getBoundingClientRect();
            const total = r.height - window.innerHeight;
            const passed = Math.min(Math.max(-r.top, 0), Math.max(total, 1));
            const p = total > 0 ? passed / total : 0;

            const g = Math.min(1, p / 0.72);
            guitar.style.transform =
                `translate(-50%, -50%) scale(${(0.55 + g * 7).toFixed(3)}) rotate(${(-8 + g * 12).toFixed(2)}deg)`;
            guitar.style.opacity = Math.max(0, 1 - Math.max(0, p - 0.60) / 0.16).toFixed(3);

            const s = Math.max(0, Math.min(1, (p - 0.60) / 0.30));
            word.style.opacity = s.toFixed(3);
            word.style.transform = `scale(${(1.5 - s * 0.5).toFixed(3)})`;

            if (cap) cap.style.opacity = Math.max(0, 1 - p * 2.2).toFixed(3);
            if (hint) hint.style.opacity = Math.max(0, 1 - p * 3).toFixed(3);
        });
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
       LEMARI — pintu pembuka, bingkai dalam, dan keluar di kontak
       -------------------------------------------------------------------- */
    function initWardrobe(lenis) {
        const ward = document.getElementById('wardrobe');
        const cab = document.getElementById('cabinet');
        const contact = document.getElementById('contact');
        if (!ward) return;

        const unlock = () => {
            document.body.classList.remove('is-locked');
            if (lenis && lenis.start) lenis.start();
        };

        const finish = () => {
            ward.classList.add('is-done');
            unlock();
            if (cab) cab.classList.add('is-on');
            window.setTimeout(() => { ward.style.display = 'none'; }, 800);
        };

        const open = () => {
            if (ward.classList.contains('is-open')) return;
            ward.classList.add('is-open');
            window.setTimeout(finish, reduceMotion ? 60 : 1450);
        };

        // Pengamat kontak: begitu sampai kontak, bingkai lemari memudar
        if (contact && 'IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    const out = e.isIntersecting && e.intersectionRatio > 0.25;
                    document.body.classList.toggle('is-outside', out);
                    if (cab) cab.classList.toggle('is-on', !out && ward.classList.contains('is-done'));
                });
            }, { threshold: [0, 0.25, 0.6] });
            io.observe(contact);
        }

        if (reduceMotion) { finish(); return; }

        document.body.classList.add('is-locked');
        if (lenis && lenis.stop) lenis.stop();

        const btn = document.getElementById('openWardrobe');
        if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); open(); });
        ward.addEventListener('click', open);
        window.addEventListener('wheel', open, { passive: true, once: true });
        window.addEventListener('touchstart', open, { passive: true, once: true });
        window.addEventListener('keydown', (e) => {
            if (['Enter', ' ', 'ArrowDown', 'PageDown'].includes(e.key)) open();
        });
    }

    /* --------------------------------------------------------------------
       INISIALISASI
       -------------------------------------------------------------------- */
    ready(() => {
        initReveal();
        initHero();
        initMagnetic();

        if (reduceMotion) { initWardrobe(null); return; }

        const lenis = initLenis();
        initWardrobe(lenis);

        if (lenis) {
            // Lenis memanggil semua pekerjaan gulir
            initParallax();
            initRail();
            initDive();
            // Jaring pengaman: peristiwa gulir asli juga memicu pekerjaan,
            // supaya efek tetap jalan walau rAF Lenis sedang tertahan.
            window.addEventListener('scroll', () => scrollJobs.forEach((fn) => fn()), { passive: true });
            scrollJobs.forEach((fn) => fn());
        } else {
            // Cadangan: Lenis gagal dimuat
            const wake = () => scrollJobs.forEach((fn) => fn());
            window.addEventListener('scroll', wake, { passive: true });
            initParallax();
            initRail();
            initDive();
            wake();
        }
    });
})();
