/* Tonium — Interactive Script */

const year = document.getElementById('year');
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const contactForm = document.getElementById('contact-form');
const header = document.querySelector('.header');

// Set current year
if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile menu toggle
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Contact form handling
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    // Prepare mailto link
    const mailtoLink = `mailto:mutisya.antony@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    
    // Show success state
    btn.textContent = '✓ Opening email client...';
    btn.disabled = true;
    
    // Open email client
    setTimeout(() => {
      window.location.href = mailtoLink;
      
      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    }, 500);
  });
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply animation to elements
document.querySelectorAll('.fade-in').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Header scroll effect
window.addEventListener('scroll', () => {
  if (!header) {
    return;
  }

  if ((window.pageYOffset || document.documentElement.scrollTop) > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

console.log('🚀 Tonium is live and ready to impress!');
