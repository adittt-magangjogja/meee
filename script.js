// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check saved theme or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Contact form validation (client-side)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const formSuccess = document.getElementById('formSuccess');
    const nama = document.getElementById('nama');
    const email = document.getElementById('email');
    const subjek = document.getElementById('subjek');
    const pesan = document.getElementById('pesan');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        formSuccess.classList.remove('show');

        const checks = [
            [nama, nama.value.trim().length > 0],
            [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
            [subjek, subjek.value.trim().length > 0],
            [pesan, pesan.value.trim().length > 0]
        ];

        checks.forEach(([field, valid]) => {
            field.closest('.form-group').classList.toggle('invalid', !valid);
        });

        if (checks.every(([, valid]) => valid)) {
            formSuccess.classList.add('show');
            contactForm.reset();
        }
    });

    contactForm.querySelectorAll('input, textarea').forEach((field) => {
        field.addEventListener('input', () => {
            field.closest('.form-group').classList.remove('invalid');
            formSuccess.classList.remove('show');
        });
    });
}

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections (kecuali hero agar langsung fade-in saat load)
document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});
