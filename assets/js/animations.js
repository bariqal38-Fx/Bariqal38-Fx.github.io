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
       6. TEMA PER SECTION — body[data-active] dikuti accent & nuansa
       --------------------------------------------------------------------- */
    function initThemeSpy() {
        const sections = $$('section[id]');
        if (!sections.length) return;

        let tops = [];
        let current = '';

        const measure = () => {
            tops = sections.map((s) => s.getBoundingClientRect().top + (window.scrollY || 0));
        };

        const update = () => {
            const probe = (window.scrollY || 0) + window.innerHeight * 0.42;
            let idx = 0;
            for (let i = 0; i < tops.length; i++) {
                if (tops[i] <= probe) idx = i;
            }
            const id = sections[idx].id;
            if (id !== current) {
                current = id;
                document.body.setAttribute('data-active', id);
            }
        };

        let raf = null;
        let stable = 0;

        const tick = () => {
            raf = null;
            update();
            stable += 1;
            if (stable < 120) raf = requestAnimationFrame(tick);
        };

        const wake = () => {
            measure();
            stable = 0;
            update();                       // langsung, tidak menunggu bingkai
            if (!raf) raf = requestAnimationFrame(tick);
        };

        window.addEventListener('scroll', wake, { passive: true });
        window.addEventListener('resize', wake, { passive: true });

        measure();
        update();
        window.__updateTheme = wake;
    }

    /* ---------------------------------------------------------------------
       7. SMOOTH SCROLL (Lenis) — opsional, dilewati bila CDN gagal
       --------------------------------------------------------------------- */
    function initLenis() {
        if (!window.Lenis) return null;

        const lenis = new window.Lenis({
            lerp: 0.09,
            smoothWheel: true,
            touchMultiplier: 1.4,
        });

        const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);

        // Navigasi anchor & tombol ke atas memakai Lenis (halus, ada offset header)
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const id = link.getAttribute('href');
            if (!id || id.length < 2) return;

            const target = document.querySelector(id);
            if (!target) return;

            event.preventDefault();
            lenis.scrollTo(target, { offset: -84, duration: 1.5 });
        }, true);

        window.__smoothScrollTo = (target) => lenis.scrollTo(target, { duration: 1.5 });
        window.__lenis = lenis;

        return lenis;
    }

    /* ---------------------------------------------------------------------
       8. PARTIKEL — hujan partikel halus berwarna accent (seperti lenis.dev)
       --------------------------------------------------------------------- */
    function initParticles() {
        const canvas = $('#particles');
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        let w = 0;
        let h = 0;
        let dpr = 1;
        let parts = [];
        let raf = null;

        const density = () => {
            const area = window.innerWidth * window.innerHeight;
            return Math.max(24, Math.min(80, Math.round(area / 34000)));
        };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.width  = Math.floor(window.innerWidth  * dpr);
            h = canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width  = window.innerWidth  + 'px';
            canvas.style.height = window.innerHeight + 'px';
        };

        const make = () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: (Math.random() * 1.5 + .6) * dpr,
            vy: -(Math.random() * .22 + .07) * dpr,
            vx: (Math.random() - .5) * .1 * dpr,
            a: Math.random() * .45 + .12,
            tw: Math.random() * Math.PI * 2,
        });

        const seed = () => { parts = Array.from({ length: density() }, make); };

        const accentRGB = () => {
            const raw = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#e8c468';
            const m = raw.match(/#([0-9a-f]{6})/i);
            return m
                ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)]
                : [232, 196, 104];
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const [r, g, b] = accentRGB();

            for (const p of parts) {
                p.y += p.vy;
                p.x += p.vx;
                p.tw += .03;

                if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
                if (p.x < -8) p.x = w + 8;
                else if (p.x > w + 8) p.x = -8;

                const alpha = p.a * (.6 + .4 * Math.sin(p.tw));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        resize();
        seed();
        draw();

        window.addEventListener('resize', () => { resize(); seed(); }, { passive: true });
        return () => cancelAnimationFrame(raf);
    }

    /* ---------------------------------------------------------------------
       9. VELOCITY — seberapa cepat halaman digulir (untuk skew judul)
       --------------------------------------------------------------------- */
    function initVelocity() {
        const root = document.documentElement;
        let lastY = window.scrollY || 0;
        let vel = 0;

        const loop = () => {
            const y = window.scrollY || 0;
            const raw = y - lastY;
            lastY = y;
            vel += (raw - vel) * 0.12;

            const norm = Math.max(-1, Math.min(1, vel / 22));
            root.style.setProperty('--vel', norm.toFixed(3));
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    /* ---------------------------------------------------------------------
       10. MARQUEE — teks berjalan, makin cepat bila guliran makin cepat
       --------------------------------------------------------------------- */
    function initMarquee() {
        const track = $('#hobiMarquee');
        if (!track) return;

        const base = track.innerHTML;
        let period = 0;

        const build = () => {
            track.innerHTML = base + base;
            const unit = track.scrollWidth / 2;
            const n = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(unit, 1)));
            track.innerHTML = base.repeat(n);
            period = track.scrollWidth / n;
        };

        build();
        window.addEventListener('resize', build, { passive: true });

        let x = 0;
        let vel = 0;
        let lastY = window.scrollY || 0;

        const loop = () => {
            const y = window.scrollY || 0;
            const v = y - lastY;
            lastY = y;
            vel += (v - vel) * 0.1;

            x += 0.7 + Math.min(9, Math.abs(vel) * 0.55);

            if (period > 0) {
                const pos = ((x % period) + period) % period;
                track.style.transform = `translate3d(${(-pos).toFixed(1)}px, 0, 0)`;
            }
            requestAnimationFrame(loop);
        };

        if (!reduceMotion) requestAnimationFrame(loop);
    }

    /* ---------------------------------------------------------------------
       11. SECTION HEAD — isi judul muncul berjenjang (anime.js)
       --------------------------------------------------------------------- */
    function initSectionHeads() {
        if (!anime) return;

        $$('.section-head').forEach((head) => {
            const items = Array.from(head.children).filter((el) => el.offsetParent !== null || el.getClientRects().length);
            if (!items.length) return;

            anime.set(items, { opacity: 0, translateY: 30 });

            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    io.disconnect();
                    anime({
                        targets: items,
                        opacity:   [0, 1],
                        translateY: [30, 0],
                        duration: 900,
                        easing: 'easeOutExpo',
                        delay: anime.stagger(110),
                        complete: () => anime.set(items, { opacity: '', translateY: '' }),
                    });
                });
            }, { threshold: 0.3 });

            io.observe(head);
        });
    }

    /* ---------------------------------------------------------------------
       INISIALISASI
       --------------------------------------------------------------------- */
    ready(() => {
        initThemeSpy();

        if (reduceMotion) return;      // hormati pengguna yang mematikan animasi

        initLenis();
        initHero();
        initSplitTitles();
        initParallax();
        initSectionHeads();
        initVelocity();
        initMarquee();
        initParticles();

        if (finePointer) {
            initMagnetic();
            initCardSpotlight();
        }
    });
})();
