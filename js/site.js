// /js/site.js
async function inject(targetId, url) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const res = await fetch(url, { cache: "no-cache" });
  el.innerHTML = await res.text();
}

function bindHeaderBehaviors() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const list   = document.querySelector("[data-nav-list]");
  if (!toggle || !list) return;

  const updateAria = () => {
    const open = list.classList.contains("active");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("no-scroll", open);
  };

  const openClose = () => {
    list.classList.toggle("active");
    updateAria();
  };

  toggle.addEventListener("click", openClose);

  // Close menu after selecting a link (mobile)
  list.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      list.classList.remove("active");
      updateAria();
    });
  });

  // Mark active link
  const current = location.pathname.replace(/\/$/, "/index.html").split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === current) a.classList.add("active");
  });
}

// Load header + footer, then bind events that depend on them
(async () => {
  await inject("site-header", "/partials/header.html");
  bindHeaderBehaviors();
  await inject("site-footer", "/partials/footer.html");
})();

// Optional: set target _blank for external links site-wide
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="http"]').forEach(a => {
    if (!a.href.includes(location.host)) a.setAttribute("target", "_blank");
  });
});
