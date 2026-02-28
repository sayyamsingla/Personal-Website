
// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

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

// Add active state to navigation based on URL
const currentPath = window.location.pathname;
const currentPage = currentPath.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
        link.classList.add('active');
    }
});

// Apple-style scroll animations
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // Stagger children animations
            const children = entry.target.querySelectorAll('.stagger-child');
            children.forEach((child, i) => {
                child.style.transitionDelay = `${i * 120}ms`;
                child.classList.add('revealed');
            });

            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.05,
    rootMargin: '0px 0px -60px 0px'
});

// Mark elements for reveal animation
document.querySelectorAll('section').forEach(section => {
    if (section.id === 'home') return; // Hero has its own animation

    section.classList.add('reveal');
    revealObserver.observe(section);

    // Mark cards and items as stagger children
    section.querySelectorAll('.skill-card, .project-card, .education-card, .experience-card, .photo-card').forEach(child => {
        child.classList.add('stagger-child');
    });
});

// Hero entrance animation
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroBanner = document.querySelector('.hero-banner');
    if (heroContent) heroContent.classList.add('hero-entered');
    if (heroBanner) heroBanner.classList.add('hero-entered');
});


// Typing effect for tagline
const tagline = document.querySelector('.tagline');
let text = '';
let i = 0;

function typeWriter() {
    if (tagline && i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

if (tagline) {
    text = tagline.textContent;
    tagline.textContent = '';
}




// Scroll to top button
const scrollBtn = document.getElementById("scrollToTop");

window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Start typing after hero animations
setTimeout(typeWriter, 1000);

// Dark Mode Toggle (Default: Light Mode)
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
} else {
    body.classList.remove('dark-mode');
    darkModeToggle.textContent = '🌙';
}

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeToggle.textContent = '🌙';
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Image Modal Functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.modal-close');

// Add click event to all expandable images
document.querySelectorAll('.expandable-img').forEach(img => {
    img.addEventListener('click', function () {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalCaption.textContent = this.alt;
    });
});

// Close modal when clicking the X
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});
