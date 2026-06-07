/* =========================================================
   VEXHOOK - interactions.js
   Vanilla JS: theme toggle, mobile menu, scroll reveal.
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme: localStorage > saved > prefers-color-scheme ---------- */
  var STORAGE_KEY = "vh-theme";
  var toggle = document.querySelector(".vh-theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    var prefersLight = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector(".vh-menu-toggle");
  var mobileNav = document.getElementById("vh-mobile-nav");

  function closeMenu() {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    mobileNav.hidden = true;
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
      menuBtn.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      mobileNav.hidden = open;
    });

    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var targets = document.querySelectorAll(
    ".vh-card, .vh-feature, .vh-work, .vh-process li, .vh-section__head, .vh-about__inner, .vh-final__inner"
  );

  if ("IntersectionObserver" in window && targets.length) {
    targets.forEach(function (el) { el.classList.add("vh-reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }
})();
