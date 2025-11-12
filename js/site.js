// Safely inject partials
async function inject(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(url, { cache: "no-cache" });
  el.innerHTML = await res.text();
}

// Delegated click (survives async injection)
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-nav-toggle]");
  if (!t) return;
  const list = document.querySelector("[data-nav-list]");
  if (!list) return;

  list.classList.toggle("active");
  const open = list.classList.contains("active");
  t.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("no-scroll", open);
});

// Close menu after selecting a link on mobile
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-nav-list] a");
  if (!link) return;
  const list = document.querySelector("[data-nav-list]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (!list) return;
  list.classList.remove("active");
  document.body.classList.remove("no-scroll");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
});

// Highlight active link
function highlightActive() {
  const current = location.pathname.replace(/\/$/, "/index.html").split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === current) a.classList.add("active");
  });
}

// Load header/footer then highlight
(async () => {
  await inject("site-header", "/partials/header.html");
  highlightActive();
  await inject("site-footer", "/partials/footer.html");
})();
