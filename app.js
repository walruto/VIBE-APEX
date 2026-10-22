(function () {
  const LANG_KEY = "vibe-apex-lang";
  const LIBRARY_KEY = "vibe-apex-library";
  const TABS = ["discover", "labs", "sandbox", "library"];

  let lang = readStorage(LANG_KEY, "en");
  let filter = "all";
  let library = readStorage(LIBRARY_KEY, []);
  let openId = null;
  let toastTimer = null;

  const byId = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function readStorage(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable (private window); the page still works without it */
    }
  }

  function t(key) {
    return (UI[lang] && UI[lang][key]) || UI.en[key] || key;
  }

  function levelLabel(level) {
    return t("lvl_" + level);
  }

  function statusLabel(status) {
    const map = {
      code_released: { en: "Code Released", es: "Código publicado", hi: "कोड जारी" },
      weights_available: { en: "Weights Available", es: "Pesos disponibles", hi: "वेट्स उपलब्ध" },
      preprint_open: { en: "Preprint Open", es: "Preprint abierto", hi: "प्रीप्रिंट खुला" },
      open: { en: "Open", es: "Abierta", hi: "खुला" },
      rolling: { en: "Rolling", es: "Continua", hi: "रोलिंग" }
    };
    return map[status][lang] || map[status].en;
  }

  function paperById(id) {
    return PAPERS.find((p) => p.id === id);
  }

  function summaryOf(item) {
    return item.summary[lang] || item.summary.en;
  }

  // Translated title when one exists; the English original is shown beneath it.
  function titleOf(p) {
    return (p.titles && p.titles[lang]) || p.title;
  }

  function titleBlock(p, cls) {
    const translated = titleOf(p);
    const original = translated !== p.title
      ? `<span class="block text-[11px] font-mono font-normal normal-case tracking-normal text-black/50 mt-2">${esc(p.title)}</span>`
      : "";
    return `<span class="${cls}">${esc(translated)}${original}</span>`;
  }

  function badges(p) {
    return `
      <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[p.status]}">${esc(statusLabel(p.status))}</span>
      <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${LEVEL_STYLES[p.level]}">${esc(levelLabel(p.level))}</span>`;
  }

  // ---------- Discover grid ----------
  function renderGrid() {
    const visible = PAPERS.filter((p) => filter === "all" || p.level === filter);
    byId("paperGrid").innerHTML = visible.map((p) => `
      <article class="bg-white border border-black/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-black/30 transition">
        <div class="flex flex-wrap gap-2">${badges(p)}</div>
        <p class="text-[11px] font-mono text-black/50">arXiv:${esc(p.arxiv)} · ${esc(p.date)}</p>
        <h3 class="font-display font-black text-xl leading-tight uppercase">${titleBlock(p, "")}</h3>
        <p class="text-sm text-black/60 leading-relaxed">${esc(summaryOf(p))}</p>
        <div class="mt-auto pt-4 border-t border-black/10 flex items-center justify-between">
          <button class="open-btn text-xs font-mono font-bold uppercase text-terracotta hover:underline cursor-pointer" data-id="${p.id}">${esc(t("inspect"))} ↗</button>
          <button class="save-btn text-xs font-mono font-bold uppercase cursor-pointer px-3 py-1.5 rounded-full border ${isSaved(p.id) ? "bg-obsidian text-white border-obsidian" : "border-black/20"}" data-id="${p.id}">${esc(isSaved(p.id) ? t("saved") : t("save"))}</button>
        </div>
      </article>`).join("") || `<p class="text-sm text-black/50">—</p>`;
  }

  function renderFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle("bg-obsidian", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("border-obsidian", active);
      btn.classList.toggle("border-black/15", !active);
    });
  }

  // ---------- Opportunities (Labs tab) ----------
  function renderOpportunities() {
    byId("oppGrid").innerHTML = OPPORTUNITIES.map((o) => {
      const isOpen = o.status === "open";
      const when = isOpen
        ? `<div><dt class="text-[10px] uppercase text-cream/50">${esc(t("opp_deadline"))}</dt><dd class="mt-1">${esc(o.deadline)} · ${esc(o.time)}</dd></div>`
        : `<div><dt class="text-[10px] uppercase text-cream/50">${esc(t("opp_deadline"))}</dt><dd class="mt-1">${esc(t("opp_rolling"))}</dd></div>`;
      return `
      <article class="rounded-2xl bg-[#141418] border border-white/10 p-6 flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status]}">${esc(statusLabel(o.status))}</span>
          <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-white/20">${esc(levelLabel(o.level))}</span>
        </div>
        <h3 class="font-display font-black text-xl leading-tight uppercase">${esc(o.name)}</h3>
        <p class="text-sm text-cream/70 leading-relaxed">${esc(summaryOf(o))}</p>
        <dl class="grid grid-cols-2 gap-3 text-sm font-mono border-t border-white/10 pt-4">
          ${when}
          <div><dt class="text-[10px] uppercase text-cream/50">${esc(t("opp_amount"))}</dt><dd class="mt-1">${esc(o.amount)}</dd></div>
        </dl>
        <a href="${esc(o.url)}" target="_blank" rel="noopener" class="mt-auto text-center py-2.5 rounded-full border border-white/30 text-xs font-bold tracking-widest uppercase hover:bg-cream hover:text-obsidian transition">${esc(t("opp_open_link"))}</a>
      </article>`;
    }).join("");
  }

  function renderLabs() {
    byId("labsList").innerHTML = PAPERS.map((p) => `
      <li class="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p class="font-display font-bold uppercase text-sm">${esc(p.authors)}</p>
          <p class="text-xs text-cream/60 mt-1">${esc(titleOf(p))}</p>
        </div>
        <a href="https://arxiv.org/abs/${esc(p.arxiv)}" target="_blank" rel="noopener" class="text-xs font-mono font-bold uppercase text-terracotta-light underline shrink-0">arXiv:${esc(p.arxiv)} ↗</a>
      </li>`).join("");
  }

  // ---------- Sandbox ----------
  function renderSandbox() {
    byId("sandboxTracks").innerHTML = SANDBOX_TRACKS.map((tr, i) => `
      <article class="bg-[#141418] text-cream rounded-2xl p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-white/20">${esc(levelLabel(tr.level))}</span>
          <span class="text-[10px] font-mono text-cream/40">0${i + 1}</span>
        </div>
        <pre class="bg-black/60 rounded-lg p-4 text-[12px] font-mono text-cream/90 whitespace-pre-wrap break-all">${esc(tr.command)}</pre>
        <p class="text-xs text-cream/60 leading-relaxed">${esc(tr.note[lang] || tr.note.en)}</p>
        <button class="copy-btn mt-auto py-2.5 rounded-full border border-white/30 text-xs font-bold tracking-widest uppercase hover:bg-cream hover:text-obsidian transition cursor-pointer" data-index="${i}">${esc(t("copy"))}</button>
      </article>`).join("");
  }

  // ---------- Library ----------
  function isSaved(id) {
    return library.includes(id);
  }

  function renderLibrary() {
    byId("libraryCount").textContent = String(library.length);
    byId("libTotal").textContent = String(library.length);

    const tiers = ["vibe", "agent", "master"];
    byId("libTiers").innerHTML = tiers.map((lvl) => {
      const n = library.filter((id) => paperById(id) && paperById(id).level === lvl).length;
      return `<div class="flex justify-between border-b border-black/5 pb-2"><span>${esc(levelLabel(lvl))}</span><span>${n}</span></div>`;
    }).join("");

    const rows = library.map((id) => paperById(id)).filter(Boolean);
    byId("libList").innerHTML = rows.length
      ? rows.map((p) => `
        <li class="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div class="flex flex-wrap gap-2 mb-2">${badges(p)}</div>
            <p class="font-display font-bold uppercase text-sm leading-snug">${titleBlock(p, "")}</p>
            <p class="text-[11px] font-mono text-black/50 mt-1">arXiv:${esc(p.arxiv)} · ${esc(p.date)}</p>
          </div>
          <div class="flex gap-3 shrink-0">
            <button class="open-btn text-xs font-mono font-bold uppercase text-terracotta underline cursor-pointer" data-id="${p.id}">${esc(t("inspect"))}</button>
            <button class="save-btn text-xs font-mono font-bold uppercase underline cursor-pointer" data-id="${p.id}">${esc(t("remove"))}</button>
          </div>
        </li>`).join("")
      : `<li class="py-10 text-sm text-black/50 font-mono">${esc(t("lib_empty"))}</li>`;
  }

  // ---------- Drawer ----------
  function openDrawer(id) {
    const p = paperById(id);
    if (!p) return;
    openId = id;
    byId("drawerLevel").className = `text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${LEVEL_STYLES[p.level]}`;
    byId("drawerLevel").textContent = levelLabel(p.level);
    byId("drawerTitle").textContent = titleOf(p);
    byId("drawerAuthors").textContent = `${t("lbl_authors")}: ${p.authors}`;
    byId("drawerStatus").textContent = statusLabel(p.status);
    byId("drawerDate").textContent = p.date;
    byId("drawerTime").textContent = t("time_na");
    byId("drawerArxiv").textContent = p.arxiv;
    byId("drawerSummary").textContent = summaryOf(p);
    byId("drawerAbstract").textContent = p.abstract;
    byId("drawerLink").href = `https://arxiv.org/abs/${p.arxiv}`;
    byId("drawerLink").textContent = t("open_arxiv");
    refreshDrawerSave();
    byId("drawer").classList.replace("drawer-closed", "drawer-open");
    byId("modalBackdrop").classList.remove("opacity-0", "pointer-events-none");
    byId("modalBackdrop").classList.add("opacity-100");
  }

  function refreshDrawerSave() {
    if (!openId) return;
    byId("drawerSave").textContent = t(isSaved(openId) ? "remove" : "save");
  }

  function closeDrawer() {
    openId = null;
    byId("drawer").classList.replace("drawer-open", "drawer-closed");
    byId("modalBackdrop").classList.add("opacity-0", "pointer-events-none");
    byId("modalBackdrop").classList.remove("opacity-100");
  }

  // ---------- Actions ----------
  function toggleSave(id) {
    if (isSaved(id)) {
      library = library.filter((x) => x !== id);
      toast(t("toast_removed"));
    } else {
      library = [...library, id];
      toast(t("toast_saved"));
    }
    writeStorage(LIBRARY_KEY, library);
    refreshAll();
  }

  function toast(message) {
    const el = byId("toast");
    el.textContent = message;
    el.classList.remove("toast-hide");
    el.classList.add("toast-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("toast-show");
      el.classList.add("toast-hide");
    }, 2400);
  }

  function copyCommand(index, btn) {
    const text = SANDBOX_TRACKS[index].command;
    const done = () => {
      btn.textContent = t("copied");
      toast(t("toast_copied"));
      setTimeout(() => (btn.textContent = t("copy")), 1500);
    };
    try {
      navigator.clipboard.writeText(text).then(done, () => toast(text));
    } catch (e) {
      toast(text);
    }
  }

  // ---------- Tabs & language ----------
  function showTab(name) {
    if (!TABS.includes(name)) name = "discover";
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.toggle("is-active", pane.id === "tab-" + name);
    });
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      const active = btn.dataset.tab === name;
      btn.classList.toggle("text-terracotta", active);
      btn.classList.toggle("border-terracotta", active);
      btn.classList.toggle("text-black/60", !active);
      btn.classList.toggle("border-transparent", !active);
    });
    document.querySelectorAll(".nav-tab-m").forEach((btn) => {
      const active = btn.dataset.tab === name;
      btn.classList.toggle("bg-terracotta", active);
      btn.classList.toggle("text-white", active);
    });
    history.replaceState(null, "", "#" + name);
    window.scrollTo({ top: 0 });
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("bg-obsidian", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("text-black/60", !active);
    });
  }

  function setLang(next) {
    if (!UI[next]) return;
    lang = next;
    writeStorage(LANG_KEY, lang);
    applyI18n();
    refreshAll();
    if (openId) openDrawer(openId);
  }

  function refreshAll() {
    renderFilters();
    renderGrid();
    renderOpportunities();
    renderLabs();
    renderSandbox();
    renderLibrary();
  }

  // ---------- Wiring ----------
  document.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn && (tabBtn.classList.contains("nav-tab") || tabBtn.classList.contains("nav-tab-m"))) {
      showTab(tabBtn.dataset.tab);
      return;
    }
    const tabLink = e.target.closest("[data-tab-link]");
    if (tabLink) {
      e.preventDefault();
      showTab(tabLink.dataset.tabLink);
      return;
    }
    const langBtn = e.target.closest(".lang-btn");
    if (langBtn) return setLang(langBtn.dataset.lang);

    const filterBtn = e.target.closest(".filter-btn");
    if (filterBtn) {
      filter = filterBtn.dataset.filter;
      renderFilters();
      renderGrid();
      return;
    }
    const openBtn = e.target.closest(".open-btn");
    if (openBtn) return openDrawer(openBtn.dataset.id);

    const saveBtn = e.target.closest(".save-btn");
    if (saveBtn) return toggleSave(saveBtn.dataset.id);

    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) return copyCommand(Number(copyBtn.dataset.index), copyBtn);

    if (e.target.closest("#dossierBtn")) return showTab("library");
  });

  byId("drawerClose").addEventListener("click", closeDrawer);
  byId("modalBackdrop").addEventListener("click", closeDrawer);
  byId("drawerSave").addEventListener("click", () => openId && toggleSave(openId));
  byId("clearLibrary").addEventListener("click", () => {
    library = [];
    writeStorage(LIBRARY_KEY, library);
    toast(t("toast_cleared"));
    refreshAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Initial render
  const initialTab = (location.hash || "#discover").slice(1);
  applyI18n();
  refreshAll();
  showTab(initialTab);
})();
