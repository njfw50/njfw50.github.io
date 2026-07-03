/**
 * MICHEL DE SOUZA - PORTFOLIO SCRIPT
 * Handles theme switching, scroll animations, and accessibility features
 */

// ============================================
// THEME MANAGEMENT
// ============================================

class ThemeManager {
  constructor() {
    this.theme = this.loadTheme();
    this.init();
  }

  loadTheme() {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  init() {
    this.applyTheme(this.theme);
    this.createThemeToggle();
    this.setupSystemThemeListener();
  }

  applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }

  toggle() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  createThemeToggle() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.setAttribute('title', `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} mode`);
    toggle.innerHTML = this.theme === 'dark' ? '☀️' : '🌙';

    toggle.addEventListener('click', () => {
      this.toggle();
      toggle.innerHTML = this.theme === 'dark' ? '☀️' : '🌙';
      toggle.setAttribute('title', `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} mode`);
    });

    nav.appendChild(toggle);
  }

  setupSystemThemeListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupSmoothScroll();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('section, .exp-card, .project-card, .edu-card, .skill-card').forEach((el) => {
      observer.observe(el);
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// ============================================
// ACCESSIBILITY FEATURES
// ============================================

class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.addSkipLink();
    this.enhanceSemantics();
    this.setupKeyboardNavigation();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    const main = document.querySelector('main') || document.querySelector('section');
    if (main) {
      main.id = 'main-content';
    }
  }

  enhanceSemantics() {
    // Add ARIA labels to navigation links
    document.querySelectorAll('.nav-links a').forEach((link) => {
      const text = link.textContent.trim();
      link.setAttribute('aria-label', `Navigate to ${text} section`);
    });

    // Add ARIA labels to buttons
    document.querySelectorAll('.btn').forEach((btn) => {
      const text = btn.textContent.trim();
      if (!btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', text);
      }
    });

    // Add role to contact items
    document.querySelectorAll('.contact-item').forEach((item) => {
      item.setAttribute('role', 'link');
    });
  }

  setupKeyboardNavigation() {
    // Ensure all interactive elements are keyboard accessible
    document.querySelectorAll('a, button').forEach((el) => {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
    });
  }
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.prefetchLinks();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    }
  }

  prefetchLinks() {
    // Prefetch internal links on hover
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          target.style.willChange = 'transform';
        }
      });
    });
  }
}

// ============================================
// SCROLL INDICATOR
// ============================================

class ScrollIndicator {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateScrollIndicator());
  }

  updateScrollIndicator() {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
      indicator.style.width = scrolled + '%';
    }
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  new ThemeManager();
  new ScrollAnimations();
  new AccessibilityManager();
  new PerformanceOptimizer();
  new ScrollIndicator();

  // Log initialization
  console.log('Portfolio initialized successfully');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Get current theme
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'dark';
}

// Debounce function for scroll events
function debounce(func, wait) {
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


// ============================================
// EXPERIENCE FILTER
// ============================================

class ExperienceFilter {
  constructor() {
    this.filterSelect = document.getElementById('category-filter');
    this.experienceList = document.getElementById('experience-list');
    if (this.filterSelect && this.experienceList) {
      this.init();
    }
  }

  init() {
    this.filterSelect.addEventListener('change', (e) => this.handleFilterChange(e));
  }

  handleFilterChange(event) {
    const selectedCategory = event.target.value;
    const categories = this.experienceList.querySelectorAll('.exp-category');

    categories.forEach((category) => {
      const categoryData = category.getAttribute('data-category');
      
      if (selectedCategory === 'all' || categoryData === selectedCategory) {
        category.style.display = 'block';
        // Trigger animation
        category.style.opacity = '0';
        setTimeout(() => {
          category.style.transition = 'opacity 0.4s ease';
          category.style.opacity = '1';
        }, 10);
      } else {
        category.style.display = 'none';
      }
    });
  }
}

// ============================================
// INITIALIZATION UPDATE
// ============================================

// Update the initialization to include ExperienceFilter
const originalInit = () => {
  new ThemeManager();
  new ScrollAnimations();
  new AccessibilityManager();
  new PerformanceOptimizer();
  new ScrollIndicator();
  new ExperienceFilter();
  console.log('Portfolio initialized successfully');
};

document.addEventListener('DOMContentLoaded', originalInit);
