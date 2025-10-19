// Personal Portfolio JavaScript
// Modern ES6+ features with accessibility and performance in mind

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentYear();
        this.setupProjectAnimations();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
        
        // Handle card expansion
        this.setupCardExpansion();
    }
    
    setupCardExpansion() {
        const expandButtons = document.querySelectorAll('.expand-button');
        expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = button.closest('.project-card');
                this.toggleCard(card);
            });
        });
        
        // Also allow clicking on the card header to expand
        const cardHeaders = document.querySelectorAll('.project-header');
        cardHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const card = header.closest('.project-card');
                this.toggleCard(card);
            });
        });
    }
    
    toggleCard(card) {
        const isExpanded = card.getAttribute('data-expanded') === 'true';
        
        if (isExpanded) {
            card.setAttribute('data-expanded', 'false');
        } else {
            card.setAttribute('data-expanded', 'true');
        }
    }

    updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }


    setupProjectAnimations() {
        // Intersection Observer for project card animations
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

        // Observe project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    setupAccessibility() {
        // Add skip link functionality
        this.createSkipLink();
        
        // Improve focus management
        this.setupFocusManagement();
        
        // Add ARIA live regions for dynamic content
        this.setupLiveRegions();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupFocusManagement() {
        // Ensure main content is focusable
        const main = document.querySelector('main');
        if (main) {
            main.id = 'main';
            main.setAttribute('tabindex', '-1');
        }
    }

    setupLiveRegions() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    handleKeyboardNavigation(e) {
        // Handle tab navigation improvements
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }

    handleTabNavigation(e) {
        // Ensure focus is visible and properly managed
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('project-card')) {
            focusedElement.style.outline = '2px solid var(--primary-color)';
            focusedElement.style.outlineOffset = '2px';
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public methods for external use
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for required browser features
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver not supported. Some animations may not work.');
    }
    
    // Initialize the app
    window.portfolioApp = new PortfolioApp();
    
    // Add loading complete class for CSS animations
    document.body.classList.add('loaded');
    
    console.log('Portfolio loaded successfully!');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or reduce activity when page is hidden
        document.body.classList.add('page-hidden');
    } else {
        // Resume normal activity when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
