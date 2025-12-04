document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true
    });
    console.log('Genex VS Website Loaded');

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Contact Form Logic - Handles all forms with class .contact-form or id contactForm
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Honeypot Check
            const honeypot = form.querySelector('input[name="honeypot"]').value;
            if (honeypot) {
                console.log('Spam detected (honeypot)');
                return; // Silently fail
            }

            // 2. Math Challenge Check
            const mathCheck = form.querySelector('input[name="mathCheck"]').value;
            if (parseInt(mathCheck) !== 7) {
                alert('Chybná odpověď na kontrolní otázku. Zkuste to prosím znovu.');
                return;
            }

            // 3. Prepare Mailto
            const name = form.querySelector('input[name="name"]').value;
            const email = form.querySelector('input[name="email"]').value;
            const subject = form.querySelector('input[name="subject"]').value || 'Zpráva z webu';
            const message = form.querySelector('textarea[name="message"]').value;

            const body = `Jméno: ${name}%0D%0AEmail: ${email}%0D%0AZpráva:%0D%0A${message}`;
            const mailtoLink = `mailto:zaludova@genexvs.cz,genex@genexvs.cz?subject=${encodeURIComponent(subject)}&body=${body}`;

            // 4. Open Mail Client
            window.location.href = mailtoLink;

            // Optional: Show success message or reset form
            alert('Váš e-mailový klient se nyní otevře s předvyplněnou zprávou.');
            form.reset();
        });
    });
    // Slideshow Logic
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000); // Change every 3 seconds
    }

    // Logo Marquee Coloring Logic
    const marqueeContainer = document.querySelector('.marquee-container');
    const marqueeLogos = document.querySelectorAll('.marquee-logo');

    if (marqueeContainer && marqueeLogos.length > 0) {
        function updateLogoColors() {
            const containerRect = marqueeContainer.getBoundingClientRect();
            const centerX = containerRect.left + containerRect.width / 2;

            // Calculate distance from center for each logo
            const logosWithDistance = [];
            marqueeLogos.forEach(logo => {
                const logoRect = logo.getBoundingClientRect();
                const logoCenterX = logoRect.left + logoRect.width / 2;
                const distance = Math.abs(centerX - logoCenterX);
                logosWithDistance.push({ logo, distance });
            });

            // Sort by distance (closest to center first)
            logosWithDistance.sort((a, b) => a.distance - b.distance);

            // Reset all logos
            marqueeLogos.forEach(logo => logo.classList.remove('active-color'));

            // Activate top 4 closest
            for (let i = 0; i < 4 && i < logosWithDistance.length; i++) {
                logosWithDistance[i].logo.classList.add('active-color');
            }

            requestAnimationFrame(updateLogoColors);
        }

        updateLogoColors();
    }

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
