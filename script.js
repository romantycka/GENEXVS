/* Čistá URL — skrýt "index.html" z adresního řádku */
if (location.pathname.endsWith('/index.html')) {
    history.replaceState(null, '', location.pathname.slice(0, -10) + location.search + location.hash);
}

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true
    });

    /* ---- Header (stín po odscrollování; na úvodu až za hero) ---- */
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const hasHero = !!document.querySelector('.hero-bg');
        const onHeaderScroll = () => {
            const threshold = hasHero ? window.innerHeight - 100 : 10;
            siteHeader.classList.toggle('scrolled', window.scrollY > threshold);
        };
        onHeaderScroll();
        window.addEventListener('scroll', onHeaderScroll, { passive: true });
    }

    /* ---- Scroll cue (šipka na hero) ---- */
    const scrollCue = document.querySelector('.scroll-cue');
    if (scrollCue) {
        scrollCue.addEventListener('click', () => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        });
    }

    /* ---- Mobile Menu ---- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('header nav');

    if (mobileBtn && nav) {
        const setMenu = (open) => {
            mobileBtn.classList.toggle('active', open);
            nav.classList.toggle('active', open);
            mobileBtn.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        };

        mobileBtn.addEventListener('click', () => {
            setMenu(!nav.classList.contains('active'));
        });

        // Zavřít menu po kliknutí na odkaz (na mobilu zůstávalo otevřené)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) setMenu(false);
            });
        });
    }

    /* ---- Kontaktní formulář (mailto + honeypot + math) ---- */
    document.querySelectorAll('form.contact-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const honeypotEl = form.querySelector('input[name="honeypot"]');
            if (honeypotEl && honeypotEl.value) {
                return; // Spam – tiše ignorovat
            }

            const mathEl = form.querySelector('input[name="mathCheck"]');
            if (mathEl && parseInt(mathEl.value, 10) !== 7) {
                alert('Chybná odpověď na kontrolní otázku. Zkuste to prosím znovu.');
                return;
            }

            const name = form.querySelector('input[name="name"]')?.value || '';
            const email = form.querySelector('input[name="email"]')?.value || '';
            const subject = form.querySelector('input[name="subject"]')?.value || 'Zpráva z webu';
            const message = form.querySelector('textarea[name="message"]')?.value || '';

            const body = `Jméno: ${name}%0D%0AEmail: ${email}%0D%0AZpráva:%0D%0A${message}`;
            const mailtoLink = `mailto:zaludova@genexvs.cz,genex@genexvs.cz?subject=${encodeURIComponent(subject)}&body=${body}`;

            window.location.href = mailtoLink;
            alert('Váš e-mailový klient se nyní otevře s předvyplněnou zprávou.');
            form.reset();
        });
    });

    /* ---- Slideshow ---- */
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }

    /* ---- Logo Marquee Coloring (pozastaveno mimo viewport) ---- */
    const marqueeContainer = document.querySelector('.marquee-container');
    const marqueeLogos = document.querySelectorAll('.marquee-logo');

    if (marqueeContainer && marqueeLogos.length > 0) {
        let running = false;
        let rafId = null;

        const updateLogoColors = () => {
            const containerRect = marqueeContainer.getBoundingClientRect();
            const centerX = containerRect.left + containerRect.width / 2;

            const logosWithDistance = [];
            marqueeLogos.forEach(logo => {
                const logoRect = logo.getBoundingClientRect();
                const logoCenterX = logoRect.left + logoRect.width / 2;
                logosWithDistance.push({ logo, distance: Math.abs(centerX - logoCenterX) });
            });
            logosWithDistance.sort((a, b) => a.distance - b.distance);

            marqueeLogos.forEach(logo => logo.classList.remove('active-color'));
            for (let i = 0; i < 4 && i < logosWithDistance.length; i++) {
                logosWithDistance[i].logo.classList.add('active-color');
            }

            if (running) rafId = requestAnimationFrame(updateLogoColors);
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !running) {
                    running = true;
                    updateLogoColors();
                } else if (!entry.isIntersecting && running) {
                    running = false;
                    if (rafId) cancelAnimationFrame(rafId);
                }
            });
        }, { threshold: 0 });
        io.observe(marqueeContainer);
    }

    /* ---- Back to Top ---- */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 300);
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
