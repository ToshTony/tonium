(function () {
  "use strict";

 /* =====================================
   THEME TOGGLE
   ===================================== */
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(isLight) {
  if (isLight) {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  }

  window.dispatchEvent(
    new CustomEvent("themeChanged", { detail: { isLight } })
  );
}

// Default to DARK mode unless user explicitly chose light mode
const savedTheme = localStorage.getItem("theme");
let isLightMode = savedTheme === "light";

applyTheme(isLightMode);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    isLightMode = !isLightMode;
    applyTheme(isLightMode);
  });
}

  /* =====================================
     LOADER
     ===================================== */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add("done");
        // Ensure it gets unmounted out of the way for interaction
        setTimeout(() => loader.style.display = "none", 800);
      }
    }, 800);
  });

  /* =====================================
     HEADER SCROLL & MOBILE MENU
     ===================================== */
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 60);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("active");
      });
    });
  }

  /* =====================================
     MAGNETIC BUTTONS (Wow Factor)
     ===================================== */
  const magneticEls = document.querySelectorAll('.magnetic');
  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - (rect.height / 2);
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });

  /* =====================================
     SMOOTH SCROLLING
     ===================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* =====================================
     FOOTER YEAR
     ===================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================
     INTERSECTION OBSERVER (REVEALS)
     ===================================== */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll("[data-anim]").forEach((el) => {
    observer.observe(el);
  });


  /* =====================================
     CURSOR GLOW
     ===================================== */
  const glow = document.getElementById("glow-cursor");
  if (glow) {
    window.addEventListener("mousemove", (e) => {
      // Small requestAnimationFrame for smooth non-blocking update
      requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      });
    });
  }

  /* =====================================
     GSAP PARALLAX & HERO ENTRANCE
     ===================================== */
  function initGSAP() {
    if (!window.gsap) return;

    gsap.registerPlugin(ScrollTrigger);

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk) return;

    const tl = gsap.timeline({ delay: 1 });

    tl.to(".hero-label", { opacity: 1, duration: 0.8, y: 0 })
      .to(".hero-title .line", { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.4")
      .to(".hero-desc", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".hero .btn", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");

    gsap.to("#hero-canvas", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  if (document.readyState === "complete") {
    initGSAP();
  } else {
    window.addEventListener("load", initGSAP);
  }
})();
