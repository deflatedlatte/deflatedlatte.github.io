function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function toggleMobileMenu(mobileMenuToggle, navLinks) {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Smooth Scroll for Anchor Links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
            return;
        }

        navbar.style.boxShadow = 'var(--shadow-md)';
        lastScroll = currentScroll;
    });
}

function init() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    const searchInput = document.getElementById('searchInput');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener(
            'click',
            (e) => {toggleMobileMenu(mobileMenuToggle, navLinks);}
        );
    }

    setupSmoothScroll();
    setupNavbarScroll();

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            toggleMobileMenu(mobileMenuToggle, navLinks);
        }
    });

    // Handle escape key for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMobileMenu(mobileMenuToggle, navLinks);
        }
    });
}

// Initialize theme
//
// This does not have to wait for DOM to be ready. Also, the theme has to be
// initialized immediately in order to prevent flickering.
//
initTheme();

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
