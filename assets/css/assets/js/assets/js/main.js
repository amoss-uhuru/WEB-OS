/* ===================================================================
   Kitui Rural Constituency Digital Platform — site behaviour
   No build step, no framework: fast to load on 2G/3G rural connections.
=================================================================== */
(function () {
  "use strict";

  const toggle = document.querySelector(".mobile-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  const badgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("ongoing")) return "badge-ongoing";
    if (s.includes("complete")) return "badge-completed";
    if (s.includes("delay")) return "badge-delayed";
    return "badge-planned";
  };

  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("not ok");
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function renderProjects(targetSel, opts) {
    const target = $(targetSel);
    if (!target) return;
    const data = await loadJSON("assets/data/projects.json");
    if (!data) { target.innerHTML = '<p class="notice">Could not load project data. If you opened this file directly, run it through a local server (see README) — fetch() needs http:// not file://.</p>'; return; }
    const limit = (opts && opts.limit) || data.length;
    target.innerHTML = "";
    data.slice(0, limit).forEach((p) => {
      const tile = el("article", "tile");
      tile.innerHTML = `
        <div class="tile-bar"><span style="width:${p.progress}%"></span></div>
        <div class="tile-body">
          <div class="tile-meta" style="margin-bottom:10px">
            <span class="badge ${badgeClass(p.status)}">${p.status}</span>
            <span>${p.ward}</span>
          </div>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="tile-meta">
            <span>${p.category}</span>
            <span>${p.progress}% complete</span>
          </div>
        </div>`;
      target.appendChild(tile);
    });
    if (opts && opts.filters) initProjectFilters(data, target);
  }

  function initProjectFilters(data, target) {
    const bar = $("#project-filters");
    if (!bar) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      bar.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.getAttribute("data-filter");
      const filtered = f === "all" ? data : data.filter((p) => p.status.toLowerCase() === f);
      target.innerHTML = "";
      filtered.forEach((p) => {
        const tile = el("article", "tile");
        tile.innerHTML = `
          <div class="tile-bar"><span style="width:${p.progress}%"></span></div>
          <div class="tile-body">
            <div class="tile-meta" style="margin-bottom:10px">
              <span class="badge ${badgeClass(p.status)}">${p.status}</span>
              <span>${p.ward}</span>
            </div>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="tile-meta"><span>${p.category}</span><span>${p.progress}% complete</span></div>
          </div>`;
        target.appendChild(tile);
      });
      if (!filtered.length) target.innerHTML = '<p class="small">No projects in this category yet.</p>';
    });
  }

  async function renderAnnouncements(targetSel, opts) {
    const target = $(targetSel);
    if (!target) return;
    const data = await loadJSON("assets/data/announcements.json");
    if (!data) { target.innerHTML = '<p class="notice">Could not load announcements.</p>'; return; }
    const limit = (opts && opts.limit) || data.length;
    target.innerHTML = "";
    data.slice(0, limit).forEach((a) => {
      const tile = el("article", "card");
      tile.innerHTML = `
        <span class="icon">${a.icon || "📣"}</span>
        <div class="tile-meta" style="margin-bottom:8px"><span class="badge badge-ongoing">${a.category}</span><span>${a.date}</span></div>
        <h3>${a.title}</h3>
        <p>${a.summary}</p>
        <span class="small">${a.ward}</span>`;
      target.appendChild(tile);
    });
  }

  async function renderOpportunities(targetSel) {
    const target = $(targetSel);
    if (!target) return;
    const data = await loadJSON("assets/data/opportunities.json");
    if (!data) { target.innerHTML = '<p class="notice">Could not load opportunities.</p>'; return; }
    target.innerHTML = "";
    data.forEach((o) => {
      const row = el("div", "service-card");
      row.innerHTML = `
        <span class="icon">${o.icon || "🎯"}</span>
        <div>
          <div class="tile-meta" style="margin-bottom:6px"><span class="badge badge-planned">${o.type}</span><span>Closes ${o.deadline}</span></div>
          <h3 style="margin-bottom:4px">${o.title}</h3>
          <p style="margin-bottom:0">${o.description}</p>
        </div>`;
      target.appendChild(row);
    });
  }

  window.KRC = { renderProjects, renderAnnouncements, renderOpportunities };

  const feedbackForm = $("#feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const year = new Date().getFullYear();
      let seq = 4820;
      try {
        seq = parseInt(localStorage.getItem("krc_ref_seq") || "4820", 10) + 1;
        localStorage.setItem("krc_ref_seq", String(seq));
      } catch (err) {}
      const ref = `KRC-${year}-${String(seq).padStart(6, "0")}`;
      const box = $("#feedback-ref");
      $("#feedback-ref-code").textContent = ref;
      box.classList.add("show");
      feedbackForm.reset();
      box.scrollIntoView({ behavior: "smooth", block: "center" });

      try {
        const list = JSON.parse(localStorage.getItem("krc_feedback_log") || "[]");
        list.unshift({ ref, date: new Date().toISOString() });
        localStorage.setItem("krc_feedback_log", JSON.stringify(list.slice(0, 20)));
      } catch (err) {}
    });
  }
})();
