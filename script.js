
const FORM_URL = 'https://formspree.io/f/xqpejazp';

// THEME TOGGLE
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

function updateThemeIcon(theme) {
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (!icon) return;

    icon.classList.toggle('fa-sun', theme === 'dark');
    icon.classList.toggle('fa-moon', theme !== 'dark');
}

updateThemeIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });
}

// CONTACT FORM + VALIDASI + KIRIM PESAN
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const formSuccess = document.getElementById('formSuccess');
    const nama = document.getElementById('nama');
    const email = document.getElementById('email');
    const subjek = document.getElementById('subjek');
    const pesan = document.getElementById('pesan');
    const btn = contactForm.querySelector('.btn-submit');

    function setInvalid(field, invalid) {
        const group = field.closest('.form-group');
        if (group) group.classList.toggle('invalid', invalid);
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (formSuccess) {
            formSuccess.classList.remove('show');
            formSuccess.textContent = '';
        }

        const emailValid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

        const checks = [
            [nama, nama.value.trim() !== ''],
            [email, emailValid],
            [subjek, subjek.value.trim() !== ''],
            [pesan, pesan.value.trim() !== '']
        ];

        checks.forEach(([field, valid]) => {
            setInvalid(field, !valid);
        });

        if (!checks.every(([, valid]) => valid)) return;

        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Mengirim...';
        }

        try {
            const response = await fetch(FORM_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: new FormData(contactForm)
            });

            if (!response.ok) {
                throw new Error('Pesan gagal dikirim');
            }

            if (formSuccess) {
                formSuccess.textContent =
                    'Pesan berhasil dikirim. Terima kasih!';
                formSuccess.classList.add('show');
            }

            contactForm.reset();

            checks.forEach(([field]) => setInvalid(field, false));

        } catch (error) {
            if (formSuccess) {
                formSuccess.textContent =
                    'Pesan gagal dikirim. Coba lagi nanti.';
                formSuccess.classList.add('show');
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Kirim Pesan';
            }
        }
    });

    contactForm.querySelectorAll('input, textarea').forEach((field) => {
        field.addEventListener('input', () => {
            setInvalid(field, false);

            if (formSuccess) {
                formSuccess.classList.remove('show');
            }
        });
    });
}

// MOBILE MENU
const mobileMenuToggle =
    document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        const icon = mobileMenuToggle.querySelector('i');

        if (icon) {
            const isOpen = navLinks.classList.contains('active');
            icon.classList.toggle('fa-times', isOpen);
            icon.classList.toggle('fa-bars', !isOpen);
        }
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');

                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// SCROLL ANIMATION
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section:not(.hero)').forEach((section) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition =
            'opacity 0.6s ease, transform 0.6s ease';

        observer.observe(section);
    });
}
