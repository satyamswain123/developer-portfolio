/**
 * Developer Portfolio — script.js
 * Handles: navbar, mobile menu, smooth scrolling, scroll-reveal,
 *          animated counters, skill bar animation, form validation.
 */

/* ══════════════════════════════════════════
   1. DOM REFERENCES
══════════════════════════════════════════ */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const backToTop  = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

/* ══════════════════════════════════════════
   2. NAVBAR — sticky + active link tracking
══════════════════════════════════════════ */
function handleNavbarScroll() {
  // Add scrolled style when page is past hero
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Show / hide back-to-top
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Highlight nav link for current section
  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ══════════════════════════════════════════
   3. MOBILE HAMBURGER MENU
══════════════════════════════════════════ */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-link, .nav-hire').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ══════════════════════════════════════════
   4. BACK TO TOP
══════════════════════════════════════════ */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════════
   5. SCROLL-REVEAL (Intersection Observer)
══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      revealObserver.unobserve(el); // animate once
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach(el => {
  revealObserver.observe(el);
});

/* ══════════════════════════════════════════
   6. ANIMATED STAT COUNTERS (Hero section)
══════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400; // ms
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Trigger counters when hero stat cards enter viewport
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('.stat-card').forEach(card => {
  counterObserver.observe(card);
});

/* ══════════════════════════════════════════
   7. SKILL BAR ANIMATION
══════════════════════════════════════════ */
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Animate all fill bars inside the observed skills section
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        const width = bar.dataset.width || '0';
        setTimeout(() => {
          bar.style.width = `${width}%`;
        }, i * 80); // stagger each bar by 80 ms
      });

      skillBarObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

const skillsSection = document.getElementById('skills');
if (skillsSection) skillBarObserver.observe(skillsSection);

/* ══════════════════════════════════════════
   8. CONTACT FORM VALIDATION
══════════════════════════════════════════ */
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data) {
  let valid = true;
  ['name', 'email', 'subject', 'message'].forEach(clearError);

  if (!data.name.trim()) {
    showError('name', 'Name is required.');
    valid = false;
  }

  if (!data.email.trim()) {
    showError('email', 'Email is required.');
    valid = false;
  } else if (!validateEmail(data.email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!data.subject.trim()) {
    showError('subject', 'Subject is required.');
    valid = false;
  }

  if (!data.message.trim()) {
    showError('message', 'Message is required.');
    valid = false;
  } else if (data.message.trim().length < 20) {
    showError('message', 'Message must be at least 20 characters.');
    valid = false;
  }

  return valid;
}

if (contactForm) {
  // Real-time clearing of errors as the user types
  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => clearError(input.id));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name:    document.getElementById('name').value,
      email:   document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    if (!validateForm(data)) return;

    // Simulate sending (replace with real API call / EmailJS / Formspree)
    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message`;
      formSuccess.textContent = '✓ Message sent! I\'ll get back to you soon.';
      setTimeout(() => { formSuccess.textContent = ''; }, 5000);
    }, 1200);
  });
}

/* ══════════════════════════════════════════
   9. SMOOTH SCROLL for all anchor links
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════
   10. TYPING CURSOR (hero role line)
   Adds a blinking cursor effect on the mono line
══════════════════════════════════════════ */
(function initTypingCursor() {
  const roleEl = document.querySelector('.hero-role');
  if (!roleEl) return;

  const text = roleEl.textContent;
  roleEl.textContent = '';

  let i = 0;
  function type() {
    if (i <= text.length) {
      roleEl.textContent = text.slice(0, i) + (i < text.length ? '█' : '_');
      i++;
      setTimeout(type, 55 + Math.random() * 30);
    } else {
      // Blink the underscore after typing
      let visible = true;
      setInterval(() => {
        roleEl.textContent = text.slice(0, -1) + (visible ? '_' : ' ');
        visible = !visible;
      }, 600);
    }
  }

  // Delay so page has time to paint first
  setTimeout(type, 600);
})();

/* ══════════════════════════════════════════
   11. INITIAL CALL (run once on load)
══════════════════════════════════════════ */
handleNavbarScroll();