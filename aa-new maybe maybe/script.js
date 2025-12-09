// Navigation active state and page transitions
document.addEventListener('DOMContentLoaded', function() {
    // Create page transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
    
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add click event listeners to all navigation links
    document.querySelectorAll('a').forEach(link => {
        // Skip external links, hash links, and the logo
        if (link.hostname === window.location.hostname && 
            link.pathname !== window.location.pathname &&
            !link.getAttribute('href').startsWith('#') &&
            !link.classList.contains('logo')) {
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.href;
                
                // Random direction for transition animation
                const directions = ['top', 'bottom', 'left', 'right'];
                const randomDirection = directions[Math.floor(Math.random() * directions.length)];
                
                // Remove any existing direction classes
                overlay.classList.remove('from-top', 'from-bottom', 'from-left', 'from-right');
                
                // Add random direction class
                overlay.classList.add(`from-${randomDirection}`);
                
                // Activate the transition overlay
                overlay.classList.add('active');
                
                // Wait for the transition to complete before navigating
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 600);
            });
        }
    });
    
    // Animate in elements when page loads
    setTimeout(() => {
        document.querySelector('.page-content').style.opacity = '1';
        
        // Animate service cards, team members, gallery items, and contact items
        document.querySelectorAll('.service-card, .team-member, .gallery-item, .contact-item').forEach(item => {
            item.classList.add('animate');
        });
    }, 300);
    
    // Form submission handling
    const contactForm = document.getElementById('appointmentForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#d32f2f';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // In a real application, you would send the form data to a server
                alert('Thank you for your appointment request! We will contact you shortly to confirm your details.');
                contactForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.padding = '0.8rem 2rem';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.padding = '1rem 2rem';
        }
    });
    
    // Handle browser back/forward button with transitions
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            overlay.classList.remove('active');
        }
    });
});

// Handle image loading with animations
function handleImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('image-loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('image-loaded');
            });
        }
    });
}
// Reveal-on-scroll for cards
const revealEls = document.querySelectorAll('.service-card, .team-member, .gallery-item, .contact-item');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => io.observe(el));
} else {
  // Fallback for very old browsers
  revealEls.forEach(el => el.classList.add('animate'));
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', handleImageLoading);

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const body = document.body;

    // Open mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('active');
            mobileMenuToggle.classList.add('active');
            body.classList.add('menu-open');
        });
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.classList.remove('menu-open');
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }

    // Close menu when clicking on navigation links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add a small delay to allow the page transition to start
            setTimeout(closeMobileMenu, 100);
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Set active navigation link in mobile menu
    const currentPage = window.location.pathname.split('/').pop();
    mobileNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
// ===== SIMPLE GUARANTEED WORKING STARFIELD =====
function createStarfield() {
    console.log('Creating starfield...'); // Debug log
    
    // Remove any existing star universe
    const existing = document.querySelector('.star-universe');
    if (existing) existing.remove();
    
    // Create container
    const universe = document.createElement('div');
    universe.className = 'star-universe';
    universe.style.position = 'fixed';
    universe.style.top = '0';
    universe.style.left = '0';
    universe.style.width = '100%';
    universe.style.height = '100%';
    universe.style.zIndex = '-1';
    universe.style.background = '#000000';
    universe.style.overflow = 'hidden';
    
    document.body.appendChild(universe);
    
    // Create 300 stars
    for (let i = 0; i < 300; i++) {
        createStar(universe, i);
    }
    
    // Create 8 shooting stars
    for (let i = 0; i < 8; i++) {
        createShootingStar(universe, i);
    }
    
    console.log('Starfield created with', universe.children.length, 'elements'); // Debug log
}

function createStar(container, index) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random size
    const sizes = ['tiny', 'small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    star.classList.add(size);
    
    // Random color (mostly white, some colored)
    if (Math.random() < 0.2) {
        star.classList.add(Math.random() < 0.5 ? 'blue' : 'gold');
    }
    
    // Random position
    star.style.position = 'absolute';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    
    // Random animation delay
    star.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(star);
}


// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting starfield'); // Debug log
    createStarfield();
});

// Also try initializing with a slight delay
setTimeout(() => {
    console.log('Timeout - creating starfield'); // Debug log
    createStarfield();
}, 100);

// ===== About Before/After Slider =====
document.addEventListener('DOMContentLoaded', function() {
    const baContainer = document.querySelector('.ba-container');
    const baAfter = document.querySelector('.ba-after');
    const baHandle = document.querySelector('.ba-handle');
    if (!baContainer || !baAfter || !baHandle) return;

    let dragging = false;
    const updatePosition = (clientX) => {
        const rect = baContainer.getBoundingClientRect();
        let pos = ((clientX - rect.left) / rect.width) * 100;
        pos = Math.max(0, Math.min(100, pos));
        baAfter.style.width = pos + '%';
        baHandle.style.left = pos + '%';
    };

    baHandle.addEventListener('mousedown', (e) => { dragging = true; e.preventDefault(); });
    window.addEventListener('mousemove', (e) => { if (dragging) updatePosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });

    baHandle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
    window.addEventListener('touchmove', (e) => { if (dragging) updatePosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; }, { passive: true });
});

// ===== FAQ keyboard support =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-item summary').forEach(summary => {
        summary.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                summary.click();
            }
        });
    });
});
// Interactive Service Showcase
class ServiceShowcase {
    constructor() {
        this.buttons = document.querySelectorAll('.showcase-btn');
        this.items = document.querySelectorAll('.showcase-item');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.dataset.service;
                this.activateService(service, btn);
            });
        });
    }

    activateService(service, button) {
        // Update buttons
        this.buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update content
        this.items.forEach(item => {
            item.classList.remove('active');
            if (item.id === service) {
                item.classList.add('active');
            }
        });
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    new ServiceShowcase();
    
    // Animated counters
    animateNumbers();
    
    // Scroll progress
    initScrollProgress();
});

// Number counting animation
function animateNumbers() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
            }
        };

        updateCounter();
    });
}

// Scroll progress bar
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}
// Enhanced FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        
        // Add keyboard navigation
        summary.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item);
            }
            
            // Arrow key navigation between FAQs
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = item.nextElementSibling;
                if (nextItem && nextItem.classList.contains('faq-item')) {
                    nextItem.querySelector('summary').focus();
                }
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = item.previousElementSibling;
                if (prevItem && prevItem.classList.contains('faq-item')) {
                    prevItem.querySelector('summary').focus();
                }
            }
        });
        
        // Close other FAQs when one is opened (optional)
        item.addEventListener('toggle', function() {
            if (item.open) {
                // Uncomment the following line if you want only one FAQ open at a time
                // closeOtherFAQs(item);
            }
        });
    });
    
    function toggleFAQ(faqItem) {
        faqItem.open = !faqItem.open;
    }
    
    function closeOtherFAQs(currentItem) {
        faqItems.forEach(item => {
            if (item !== currentItem && item.open) {
                item.open = false;
            }
        });
    }
    
    // Add intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
        const faqObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    faqObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        faqItems.forEach(item => {
            item.style.animationPlayState = 'paused';
            faqObserver.observe(item);
        });
    }
});