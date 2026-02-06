
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

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add a small delay for staggered effect
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.skill-card, .project-card, .education-card, .experience-card, section h2, .experience-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
});

// 3D Tilt Effect for Cards
const tiltCards = document.querySelectorAll('.project-card, .skill-card');

tiltCards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// Typing effect for tagline
const tagline = document.querySelector('.tagline');
const text = tagline.textContent;
tagline.textContent = '';
let i = 0;

function typeWriter() {
    if (i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

// Interactive warp around the profile image - Sun-like gravitational effect
// Canvas-based mesh rendering for reliable cross-browser warping
const profileWarp = document.querySelector('.profile-warp');
const profileOrbit = document.querySelector('.profile-orbit');

if (profileWarp && profileOrbit) {
    // Create canvas for mesh
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    profileWarp.appendChild(canvas);

    // Mesh configuration
    const GRID_SIZE = 28; // pixels between grid lines
    const GRAVITY_STRENGTH = 120; // how strongly the center pulls
    const GRAVITY_RADIUS = 180; // radius of gravity effect

    let pulsePhase = 0;
    let width, height;

    const resize = () => {
        const rect = profileWarp.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Get the center point (where profile pic is)
    const getCenter = () => {
        const orbitRect = profileOrbit.getBoundingClientRect();
        const warpRect = profileWarp.getBoundingClientRect();
        return {
            x: orbitRect.left + orbitRect.width / 2 - warpRect.left,
            y: orbitRect.top + orbitRect.height / 2 - warpRect.top
        };
    };

    // Calculate gravitational displacement for a point
    const getDisplacement = (x, y, center, strength) => {
        const dx = x - center.x;
        const dy = y - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) return { x: 0, y: 0 };

        // Gravitational pull toward center - creates depression effect
        const pull = strength / (dist * 0.5 + 30);
        const factor = Math.min(pull, dist * 0.8); // Clamp to prevent extreme warping

        return {
            x: -dx / dist * factor,
            y: -dy / dist * factor
        };
    };

    // Draw the warped mesh
    const drawMesh = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const lineColor = isDarkMode ? 'rgba(243, 242, 239, 0.35)' : 'rgba(28, 27, 26, 0.38)';

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;

        const center = getCenter();

        // Pulsating gravity strength
        pulsePhase += 0.02;
        const pulse = Math.sin(pulsePhase) * 0.12 + 1.0;
        const currentStrength = GRAVITY_STRENGTH * pulse;

        // Calculate grid points with displacement
        const cols = Math.ceil(width / GRID_SIZE) + 2;
        const rows = Math.ceil(height / GRID_SIZE) + 2;

        // Store displaced points for drawing
        const points = [];
        for (let row = 0; row <= rows; row++) {
            points[row] = [];
            for (let col = 0; col <= cols; col++) {
                const baseX = col * GRID_SIZE - GRID_SIZE;
                const baseY = row * GRID_SIZE - GRID_SIZE;
                const disp = getDisplacement(baseX, baseY, center, currentStrength);
                points[row][col] = {
                    x: baseX + disp.x,
                    y: baseY + disp.y
                };
            }
        }

        // Draw horizontal lines
        for (let row = 0; row <= rows; row++) {
            ctx.beginPath();
            for (let col = 0; col <= cols; col++) {
                const pt = points[row][col];
                if (col === 0) {
                    ctx.moveTo(pt.x, pt.y);
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.stroke();
        }

        // Draw vertical lines
        for (let col = 0; col <= cols; col++) {
            ctx.beginPath();
            for (let row = 0; row <= rows; row++) {
                const pt = points[row][col];
                if (row === 0) {
                    ctx.moveTo(pt.x, pt.y);
                } else {
                    ctx.lineTo(pt.x, pt.y);
                }
            }
            ctx.stroke();
        }
    };

    // Animation loop
    const animate = () => {
        drawMesh();
        requestAnimationFrame(animate);
    };

    // Start after a small delay to ensure layout is complete
    setTimeout(() => {
        resize();
        animate();
    }, 100);
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
