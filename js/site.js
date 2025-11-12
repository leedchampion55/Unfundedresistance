// /js/site.js
(async () => {
  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    // 1) Inject header & footer partials
    await inject("#site-header", "/partials/header.html");
    await inject("#site-footer", "/partials/footer.html");

    // 2) After header exists, wire up nav + active link
    setupMobileMenu();
    highlightActiveNav();

    // 3) Link behavior: external => new tab, internal => same tab
    normalizeLinkTargets();
  }

  async function inject(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      host.innerHTML = await res.text();
    } catch (e) {
      console.warn(`Failed to load partial ${url}:`, e);
    }
  }

  function setupMobileMenu() {
    const toggle = document.querySelector("#menuToggle") || document.querySelector(".menu-toggle");
    const links  = document.querySelector("#navLinks")   || document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      links.classList.toggle("active");
    });

    // Close menu on link click (mobile UX)
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => links.classList.remove("active"));
    });
  }

  function highlightActiveNav() {
    const links = document.querySelectorAll('#site-header .nav-links a, nav .nav-links a');
    if (!links.length) return;

    // Current path normalized (treat "/" as "index.html")
    const path = window.location.pathname.replace(/\/+$/, ""); // strip trailing slash
    const current = path === "" || path === "/" ? "/index.html" : path;

    links.forEach(a => {
      const routeAttr = a.getAttribute("data-route"); // preferred if present
      const href      = a.getAttribute("href") || "";

      // Support absolute and relative matches
      const targetPath = routeAttr
        ? `/${routeAttr.replace(/^\//, "")}`
        : href.startsWith("http")
          ? new URL(href, window.location.origin).pathname
          : `/${href.replace(/^\//, "")}`;

      if (current === targetPath) {
        a.classList.add("active");
      }
    });
  }

  function normalizeLinkTargets() {
    const origin = window.location.origin;

    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');

      // Ignore anchors, JS links, mailto/tel
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Build absolute URL safely
      let url;
      try { url = new URL(href, origin); } catch { return; }

      // External domain => open in new tab
      if (url.origin !== origin) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      } else {
        // Internal => same tab
        a.removeAttribute('target');
        a.removeAttribute('rel');
      }
    });
  }
})();
