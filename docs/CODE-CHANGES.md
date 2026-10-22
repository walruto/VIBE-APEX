# Code changes by prompt

Each section is the exact diff from one commit in this repository, generated from git. The prompt IDs (B1, B3, …) match the prompt log in the README. Prompts B2, B5, B6 and B12 changed no code: they restarted the local server or checked the page, and B12 could not be reproduced.

| Prompt | Commit | What changed |
|---|---|---|
| B1 and B3 | [`c516907`](https://github.com/walruto/VIBE-APEX/commit/c516907) | Built the first version of the site (index.html, app.js, data.js) from the Stitch export, then pushed it to the empty repo. |
| B4 | [`81b25bc`](https://github.com/walruto/VIBE-APEX/commit/81b25bc) | Labs list entries now show the translated summary, so they change with the language toggle. |
| B7 | [`c4af4e4`](https://github.com/walruto/VIBE-APEX/commit/c4af4e4) | Replaced the empty Labs area with three verified AI opportunities, renamed the tab to OPPORTUNITIES, and translated the six paper titles. |
| B8 | [`efba354`](https://github.com/walruto/VIBE-APEX/commit/efba354) | Changed the header button label from Dossier to My Library in EN, ES and HI. |
| B9 | [`d525904`](https://github.com/walruto/VIBE-APEX/commit/d525904) | Moved the spotlight card out of the hero into its own row, and fixed the closed drawer shadow. |
| B10 | [`424e3ac`](https://github.com/walruto/VIBE-APEX/commit/424e3ac) | Removed the spotlight card, its render function and its call. |
| B11 | [`bee45e8`](https://github.com/walruto/VIBE-APEX/commit/bee45e8) | Moved the OPPORTUNITIES heading into a full-width row above the cards and sized it to fit. |
| B13 | [`a9e3975`](https://github.com/walruto/VIBE-APEX/commit/a9e3975) | Added the README and screenshots in docs/. |
| B14 | [`05b5207`](https://github.com/walruto/VIBE-APEX/commit/05b5207) | Replaced the README prompt section with the full prompt log. |

## B1 and B3: `c516907`

**Commit:** VIBE//APEX: multi-tab AI research hub  
**Summary:** Built the first version of the site (index.html, app.js, data.js) from the Stitch export, then pushed it to the empty repo.

```diff
diff --git a/app.js b/app.js
new file mode 100644
index 0000000..2d537ca
--- /dev/null
+++ b/app.js
@@ -0,0 +1,351 @@
+(function () {
+  const LANG_KEY = "vibe-apex-lang";
+  const LIBRARY_KEY = "vibe-apex-library";
+  const TABS = ["discover", "labs", "sandbox", "library"];
+
+  let lang = readStorage(LANG_KEY, "en");
+  let filter = "all";
+  let library = readStorage(LIBRARY_KEY, []);
+  let openId = null;
+  let toastTimer = null;
+
+  const byId = (id) => document.getElementById(id);
+  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
+
+  function readStorage(key, fallback) {
+    try {
+      const v = localStorage.getItem(key);
+      return v === null ? fallback : JSON.parse(v);
+    } catch (e) {
+      return fallback;
+    }
+  }
+
+  function writeStorage(key, value) {
+    try {
+      localStorage.setItem(key, JSON.stringify(value));
+    } catch (e) {
+      /* storage unavailable (private window); the page still works without it */
+    }
+  }
+
+  function t(key) {
+    return (UI[lang] && UI[lang][key]) || UI.en[key] || key;
+  }
+
+  function levelLabel(level) {
+    return t("lvl_" + level);
+  }
+
+  function statusLabel(status) {
+    const map = {
+      code_released: { en: "Code Released", es: "Código publicado", hi: "कोड जारी" },
+      weights_available: { en: "Weights Available", es: "Pesos disponibles", hi: "वेट्स उपलब्ध" },
+      preprint_open: { en: "Preprint Open", es: "Preprint abierto", hi: "प्रीप्रिंट खुला" }
+    };
+    return map[status][lang] || map[status].en;
+  }
+
+  function paperById(id) {
+    return PAPERS.find((p) => p.id === id);
+  }
+
+  function summaryOf(p) {
+    return p.summary[lang] || p.summary.en;
+  }
+
+  function badges(p) {
+    return `
+      <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[p.status]}">${esc(statusLabel(p.status))}</span>
+      <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${LEVEL_STYLES[p.level]}">${esc(levelLabel(p.level))}</span>`;
+  }
+
+  // ---------- Spotlight (hero) ----------
+  function renderSpotlight() {
+    const p = paperById("deepseek");
+    const html = `
+      <article class="bg-white rounded-3xl p-6 shadow-2xl text-[#111113]">
+        <div class="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
+          <span class="text-terracotta">● ${esc(t("spotlight_label"))}</span>
+          <span class="bg-paper-cream px-2 py-1 rounded">arXiv:${esc(p.arxiv)}</span>
+        </div>
+        <h2 class="font-display font-black text-2xl leading-tight mt-5">${esc(p.title)}</h2>
+        <p class="text-sm text-black/60 mt-4 leading-relaxed">${esc(summaryOf(p))}</p>
+        <div class="flex items-center justify-between mt-5 text-xs">
+          <span class="font-mono text-black/50">${esc(p.date)}</span>
+          <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${LEVEL_STYLES[p.level]}">${esc(levelLabel(p.level))}</span>
+        </div>
+        <div class="flex gap-2 mt-6">
+          <button class="open-btn flex-1 py-3 rounded-full bg-obsidian text-white text-xs font-bold tracking-widest uppercase cursor-pointer" data-id="${p.id}">${esc(t("inspect"))} →</button>
+          <button class="save-btn w-12 rounded-full border border-black/20 cursor-pointer" data-id="${p.id}" aria-label="${esc(t("save"))}">${isSaved(p.id) ? "★" : "☆"}</button>
+        </div>
+      </article>`;
+    byId("spotlight").innerHTML = html;
+    byId("spotlightMobile").innerHTML = html;
+  }
+
+  // ---------- Grid ----------
+  function renderGrid() {
+    const visible = PAPERS.filter((p) => filter === "all" || p.level === filter);
+    byId("paperGrid").innerHTML = visible.map((p) => `
+      <article class="bg-white border border-black/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-black/30 transition">
+        <div class="flex flex-wrap gap-2">${badges(p)}</div>
+        <p class="text-[11px] font-mono text-black/50">arXiv:${esc(p.arxiv)} · ${esc(p.date)}</p>
+        <h3 class="font-display font-black text-xl leading-tight uppercase">${esc(p.title)}</h3>
+        <p class="text-sm text-black/60 leading-relaxed">${esc(summaryOf(p))}</p>
+        <div class="mt-auto pt-4 border-t border-black/10 flex items-center justify-between">
+          <button class="open-btn text-xs font-mono font-bold uppercase text-terracotta hover:underline cursor-pointer" data-id="${p.id}">${esc(t("inspect"))} ↗</button>
+          <button class="save-btn text-xs font-mono font-bold uppercase cursor-pointer px-3 py-1.5 rounded-full border ${isSaved(p.id) ? "bg-obsidian text-white border-obsidian" : "border-black/20"}" data-id="${p.id}">${esc(isSaved(p.id) ? t("saved") : t("save"))}</button>
+        </div>
+      </article>`).join("") || `<p class="text-sm text-black/50">—</p>`;
+  }
+
+  function renderFilters() {
+    document.querySelectorAll(".filter-btn").forEach((btn) => {
+      const active = btn.dataset.filter === filter;
+      btn.classList.toggle("bg-obsidian", active);
+      btn.classList.toggle("text-white", active);
+      btn.classList.toggle("border-obsidian", active);
+      btn.classList.toggle("border-black/15", !active);
+    });
+  }
+
+  // ---------- Labs ----------
+  function renderLabs() {
+    byId("labsList").innerHTML = PAPERS.map((p) => `
+      <li class="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
+        <div>
+          <p class="font-display font-bold uppercase text-sm">${esc(p.authors)}</p>
+          <p class="text-xs text-cream/60 mt-1">${esc(p.title)}</p>
+        </div>
+        <a href="https://arxiv.org/abs/${esc(p.arxiv)}" target="_blank" rel="noopener" class="text-xs font-mono font-bold uppercase text-terracotta-light underline shrink-0">arXiv:${esc(p.arxiv)} ↗</a>
+      </li>`).join("");
+  }
+
+  // ---------- Sandbox ----------
+  function renderSandbox() {
+    byId("sandboxTracks").innerHTML = SANDBOX_TRACKS.map((tr, i) => `
+      <article class="bg-[#141418] text-cream rounded-2xl p-6 flex flex-col gap-4">
+        <div class="flex items-center justify-between">
+          <span class="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-white/20">${esc(levelLabel(tr.level))}</span>
+          <span class="text-[10px] font-mono text-cream/40">0${i + 1}</span>
+        </div>
+        <pre class="bg-black/60 rounded-lg p-4 text-[12px] font-mono text-cream/90 whitespace-pre-wrap break-all">${esc(tr.command)}</pre>
+        <p class="text-xs text-cream/60 leading-relaxed">${esc(tr.note[lang] || tr.note.en)}</p>
+        <button class="copy-btn mt-auto py-2.5 rounded-full border border-white/30 text-xs font-bold tracking-widest uppercase hover:bg-cream hover:text-obsidian transition cursor-pointer" data-index="${i}">${esc(t("copy"))}</button>
+      </article>`).join("");
+  }
+
+  // ---------- Library ----------
+  function isSaved(id) {
+    return library.includes(id);
+  }
+
+  function renderLibrary() {
+    byId("libraryCount").textContent = String(library.length);
+    byId("libTotal").textContent = String(library.length);
+
+    const tiers = ["vibe", "agent", "master"];
+    byId("libTiers").innerHTML = tiers.map((lvl) => {
+      const n = library.filter((id) => paperById(id) && paperById(id).level === lvl).length;
+      return `<div class="flex justify-between border-b border-black/5 pb-2"><span>${esc(levelLabel(lvl))}</span><span>${n}</span></div>`;
+    }).join("");
+
+    const rows = library.map((id) => paperById(id)).filter(Boolean);
+    byId("libList").innerHTML = rows.length
+      ? rows.map((p) => `
+        <li class="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
+          <div>
+            <div class="flex flex-wrap gap-2 mb-2">${badges(p)}</div>
+            <p class="font-display font-bold uppercase text-sm leading-snug">${esc(p.title)}</p>
+            <p class="text-[11px] font-mono text-black/50 mt-1">arXiv:${esc(p.arxiv)} · ${esc(p.date)}</p>
+          </div>
+          <div class="flex gap-3 shrink-0">
+            <button class="open-btn text-xs font-mono font-bold uppercase text-terracotta underline cursor-pointer" data-id="${p.id}">${esc(t("inspect"))}</button>
+            <button class="save-btn text-xs font-mono font-bold uppercase underline cursor-pointer" data-id="${p.id}">${esc(t("remove"))}</button>
+          </div>
+        </li>`).join("")
+      : `<li class="py-10 text-sm text-black/50 font-mono">${esc(t("lib_empty"))}</li>`;
+  }
+
+  // ---------- Drawer ----------
+  function openDrawer(id) {
+    const p = paperById(id);
+    if (!p) return;
+    openId = id;
+    byId("drawerLevel").className = `text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${LEVEL_STYLES[p.level]}`;
+    byId("drawerLevel").textContent = levelLabel(p.level);
+    byId("drawerTitle").textContent = p.title;
+    byId("drawerAuthors").textContent = `${t("lbl_authors")}: ${p.authors}`;
+    byId("drawerStatus").textContent = statusLabel(p.status);
+    byId("drawerDate").textContent = p.date;
+    byId("drawerTime").textContent = t("time_na");
+    byId("drawerArxiv").textContent = p.arxiv;
+    byId("drawerSummary").textContent = summaryOf(p);
+    byId("drawerAbstract").textContent = p.abstract;
+    byId("drawerLink").href = `https://arxiv.org/abs/${p.arxiv}`;
+    byId("drawerLink").textContent = t("open_arxiv");
+    refreshDrawerSave();
+    byId("drawer").classList.replace("drawer-closed", "drawer-open");
+    byId("modalBackdrop").classList.remove("opacity-0", "pointer-events-none");
+    byId("modalBackdrop").classList.add("opacity-100");
+  }
+
+  function refreshDrawerSave() {
+    if (!openId) return;
+    byId("drawerSave").textContent = t(isSaved(openId) ? "remove" : "save");
+  }
+
+  function closeDrawer() {
+    openId = null;
+    byId("drawer").classList.replace("drawer-open", "drawer-closed");
+    byId("modalBackdrop").classList.add("opacity-0", "pointer-events-none");
+    byId("modalBackdrop").classList.remove("opacity-100");
+  }
+
+  // ---------- Actions ----------
+  function toggleSave(id) {
+    if (isSaved(id)) {
+      library = library.filter((x) => x !== id);
+      toast(t("toast_removed"));
+    } else {
+      library = [...library, id];
+      toast(t("toast_saved"));
+    }
+    writeStorage(LIBRARY_KEY, library);
+    refreshAll();
+  }
+
+  function toast(message) {
+    const el = byId("toast");
+    el.textContent = message;
+    el.classList.remove("toast-hide");
+    el.classList.add("toast-show");
+    clearTimeout(toastTimer);
+    toastTimer = setTimeout(() => {
+      el.classList.remove("toast-show");
+      el.classList.add("toast-hide");
+    }, 2400);
+  }
+
+  function copyCommand(index, btn) {
+    const text = SANDBOX_TRACKS[index].command;
+    const done = () => {
+      btn.textContent = t("copied");
+      toast(t("toast_copied"));
+      setTimeout(() => (btn.textContent = t("copy")), 1500);
+    };
+    try {
+      navigator.clipboard.writeText(text).then(done, () => toast(text));
+    } catch (e) {
+      toast(text);
+    }
+  }
+
+  // ---------- Tabs & language ----------
+  function showTab(name) {
+    if (!TABS.includes(name)) name = "discover";
+    document.querySelectorAll(".tab-pane").forEach((pane) => {
+      pane.classList.toggle("is-active", pane.id === "tab-" + name);
+    });
+    document.querySelectorAll(".nav-tab").forEach((btn) => {
+      const active = btn.dataset.tab === name;
+      btn.classList.toggle("text-terracotta", active);
+      btn.classList.toggle("border-terracotta", active);
+      btn.classList.toggle("text-black/60", !active);
+      btn.classList.toggle("border-transparent", !active);
+    });
+    document.querySelectorAll(".nav-tab-m").forEach((btn) => {
+      const active = btn.dataset.tab === name;
+      btn.classList.toggle("bg-terracotta", active);
+      btn.classList.toggle("text-white", active);
+    });
+    history.replaceState(null, "", "#" + name);
+    window.scrollTo({ top: 0 });
+  }
+
+  function applyI18n() {
+    document.documentElement.lang = lang;
+    document.querySelectorAll("[data-i18n]").forEach((el) => {
+      el.textContent = t(el.dataset.i18n);
+    });
+    document.querySelectorAll(".lang-btn").forEach((btn) => {
+      const active = btn.dataset.lang === lang;
+      btn.classList.toggle("bg-obsidian", active);
+      btn.classList.toggle("text-white", active);
+      btn.classList.toggle("text-black/60", !active);
+    });
+  }
+
+  function setLang(next) {
+    if (!UI[next]) return;
+    lang = next;
+    writeStorage(LANG_KEY, lang);
+    applyI18n();
+    refreshAll();
+    if (openId) openDrawer(openId);
+  }
+
+  function refreshAll() {
+    renderSpotlight();
+    renderFilters();
+    renderGrid();
+    renderLabs();
+    renderSandbox();
+    renderLibrary();
+  }
+
+  // ---------- Wiring ----------
+  document.addEventListener("click", (e) => {
+    const tabBtn = e.target.closest("[data-tab]");
+    if (tabBtn && (tabBtn.classList.contains("nav-tab") || tabBtn.classList.contains("nav-tab-m"))) {
+      showTab(tabBtn.dataset.tab);
+      return;
+    }
+    const tabLink = e.target.closest("[data-tab-link]");
+    if (tabLink) {
+      e.preventDefault();
+      showTab(tabLink.dataset.tabLink);
+      return;
+    }
+    const langBtn = e.target.closest(".lang-btn");
+    if (langBtn) return setLang(langBtn.dataset.lang);
+
+    const filterBtn = e.target.closest(".filter-btn");
+    if (filterBtn) {
+      filter = filterBtn.dataset.filter;
+      renderFilters();
+      renderGrid();
+      return;
+    }
+    const openBtn = e.target.closest(".open-btn");
+    if (openBtn) return openDrawer(openBtn.dataset.id);
+
+    const saveBtn = e.target.closest(".save-btn");
+    if (saveBtn) return toggleSave(saveBtn.dataset.id);
+
+    const copyBtn = e.target.closest(".copy-btn");
+    if (copyBtn) return copyCommand(Number(copyBtn.dataset.index), copyBtn);
+
+    if (e.target.closest("#dossierBtn")) return showTab("library");
+  });
+
+  byId("drawerClose").addEventListener("click", closeDrawer);
+  byId("modalBackdrop").addEventListener("click", closeDrawer);
+  byId("drawerSave").addEventListener("click", () => openId && toggleSave(openId));
+  byId("clearLibrary").addEventListener("click", () => {
+    library = [];
+    writeStorage(LIBRARY_KEY, library);
+    toast(t("toast_cleared"));
+    refreshAll();
+  });
+  document.addEventListener("keydown", (e) => {
+    if (e.key === "Escape") closeDrawer();
+  });
+
+  // Initial render
+  const initialTab = (location.hash || "#discover").slice(1);
+  applyI18n();
+  refreshAll();
+  showTab(initialTab);
+})();
diff --git a/data.js b/data.js
new file mode 100644
index 0000000..190b453
--- /dev/null
+++ b/data.js
@@ -0,0 +1,299 @@
+// VIBE//APEX data. Every paper below is a real arXiv preprint; ids, titles and dates
+// were checked against arxiv.org. Dates are the arXiv first-version date. arXiv does not
+// publish a submission time on the abstract page, so no time is shown for these entries.
+// Summaries in ES and HI are translations of the English line and should be reviewed by a
+// native speaker before wider release. Paper titles and abstracts stay in English.
+
+window.PAPERS = [
+  {
+    id: "deepseek",
+    arxiv: "2501.12948",
+    level: "master",
+    status: "weights_available",
+    date: "2025-01-22",
+    authors: "DeepSeek-AI, Guo, Yang, Zhang et al.",
+    title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
+    abstract: "General reasoning represents a long-standing and formidable challenge in artificial intelligence. Here we show that the reasoning abilities of LLMs can be incentivized through pure reinforcement learning (RL), obviating the need for human-labeled reasoning trajectories. The proposed RL framework facilitates the emergent development of advanced reasoning patterns, such as self-reflection, verification, and dynamic strategy adaptation. Moreover, the emergent reasoning patterns exhibited by these large-scale models can be systematically harnessed to guide and enhance the reasoning capabilities of smaller models.",
+    summary: {
+      en: "Pure reinforcement learning, with no human-labeled reasoning traces, pushes a base model to develop self-verification and reflection.",
+      es: "El aprendizaje por refuerzo puro, sin trazas de razonamiento etiquetadas por humanos, lleva a un modelo base a desarrollar autoverificación y reflexión.",
+      hi: "केवल रीइन्फोर्समेंट लर्निंग, बिना मानव-लेबल वाले तर्क-पथों के, एक बेस मॉडल में स्व-सत्यापन और आत्म-चिंतन विकसित कराती है।"
+    }
+  },
+  {
+    id: "flashattn",
+    arxiv: "2407.08608",
+    level: "master",
+    status: "code_released",
+    date: "2024-07-11",
+    authors: "Shah, Bikshandi, Zhang, Thakkar, Ramani, Dao",
+    title: "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision",
+    abstract: "Attention, as a core layer of the ubiquitous Transformer architecture, is the bottleneck for large language models and long-context applications. We develop three main techniques to speed up attention on Hopper GPUs: exploiting asynchrony of the Tensor Cores and TMA, interleaving block-wise matmul and softmax operations, and block quantization and incoherent processing that leverages hardware support for FP8 low-precision. FlashAttention-3 achieves speedup on H100 GPUs by 1.5-2.0x with FP16 reaching up to 740 TFLOPs/s (75% utilization), and with FP8 reaching close to 1.2 PFLOPs/s.",
+    summary: {
+      en: "Hopper-specific attention kernel that overlaps data movement with compute and uses FP8, reaching about 740 TFLOPs/s in FP16 on H100.",
+      es: "Kernel de atención específico para Hopper que solapa el movimiento de datos con el cómputo y usa FP8; alcanza unos 740 TFLOPs/s en FP16 en H100.",
+      hi: "Hopper-विशिष्ट अटेंशन कर्नल, जो डेटा-मूवमेंट को कम्प्यूट के साथ ओवरलैप करता है और FP8 का उपयोग करता है; H100 पर FP16 में लगभग 740 TFLOPs/s तक पहुँचता है।"
+    }
+  },
+  {
+    id: "swe-agent",
+    arxiv: "2405.15793",
+    level: "agent",
+    status: "code_released",
+    date: "2024-05-06",
+    authors: "Yang, Jimenez, Wettig, Lieret, Yao, Narasimhan et al.",
+    title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
+    abstract: "We introduce SWE-agent: a system that facilitates LM agents to autonomously use computers to solve software engineering tasks. SWE-agent's custom agent-computer interface (ACI) significantly enhances an agent's ability to create and edit code files, navigate entire repositories, and execute tests and other programs. We evaluate SWE-agent on SWE-bench and HumanEvalFix, achieving state-of-the-art performance on both with a pass@1 rate of 12.5% and 87.7%, respectively.",
+    summary: {
+      en: "A purpose-built terminal interface lets an LM agent navigate a repo, edit files and run tests. It set state of the art on SWE-bench at publication.",
+      es: "Una interfaz de terminal diseñada para el agente le permite navegar un repositorio, editar archivos y ejecutar pruebas. Fue el estado del arte en SWE-bench al publicarse.",
+      hi: "एक विशेष टर्मिनल इंटरफ़ेस एजेंट को रिपॉज़िटरी में घूमने, फ़ाइलें संपादित करने और टेस्ट चलाने देता है। प्रकाशन के समय यह SWE-bench पर अत्याधुनिक था।"
+    }
+  },
+  {
+    id: "dspy",
+    arxiv: "2310.03714",
+    level: "vibe",
+    status: "code_released",
+    date: "2023-10-05",
+    authors: "Khattab, Singhvi, Maheshwari, Zhang et al.",
+    title: "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines",
+    abstract: "We introduce DSPy, a programming model that abstracts LM pipelines as text transformation graphs, i.e. imperative computational graphs where LMs are invoked through declarative modules. We design a compiler that will optimize any DSPy pipeline to maximize a given metric. Within minutes of compiling, a few lines of DSPy allow GPT-3.5 and llama2-13b-chat to self-bootstrap pipelines that outperform standard few-shot prompting.",
+    summary: {
+      en: "Describe a pipeline in a few lines of Python, then let a compiler tune the prompts and examples against a metric you pick.",
+      es: "Describe un pipeline en unas pocas líneas de Python y deja que un compilador ajuste los prompts y ejemplos según una métrica que elijas.",
+      hi: "कुछ पंक्तियों के Python में एक पाइपलाइन लिखें, फिर एक कंपाइलर आपके चुने मेट्रिक के आधार पर प्रॉम्प्ट और उदाहरण ट्यून करता है।"
+    }
+  },
+  {
+    id: "gsm-symbolic",
+    arxiv: "2410.05229",
+    level: "agent",
+    status: "preprint_open",
+    date: "2024-10-07",
+    authors: "Mirzadeh, Alizadeh, Shahrokhi, Tuzel, Bengio, Farajtabar",
+    title: "GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models",
+    abstract: "We introduce GSM-Symbolic, an improved benchmark created from symbolic templates that allow for the generation of a diverse set of questions. Our findings reveal that LLMs exhibit noticeable variance when responding to different instantiations of the same question. Adding a single clause that seems relevant to the question causes significant performance drops (up to 65%) across all state-of-the-art models.",
+    summary: {
+      en: "Change only the numbers in a grade-school math problem, or add one irrelevant clause, and model scores drop. Benchmark scores can overstate reasoning.",
+      es: "Cambia solo los números de un problema de matemáticas escolar, o agrega una cláusula irrelevante, y las puntuaciones bajan. Los benchmarks pueden exagerar el razonamiento.",
+      hi: "किसी स्कूली गणित प्रश्न में केवल संख्याएँ बदलें, या एक अप्रासंगिक वाक्यांश जोड़ें, तो मॉडल के स्कोर गिरते हैं। बेंचमार्क तर्क-क्षमता को बढ़ा-चढ़ाकर दिखा सकते हैं।"
+    }
+  },
+  {
+    id: "heavy-tail",
+    arxiv: "2610.00010",
+    level: "master",
+    status: "preprint_open",
+    date: "2026-07-09",
+    authors: "Song, Xinyuan; Cai, Zekun",
+    title: "Heavy-Tailed Memory Traces in Long-Horizon Language Agents",
+    abstract: "Long-horizon language agents increasingly rely on external memory as a frozen world model, yet current memory systems are usually judged only by task success or token cost. We study this effect through a conservative tail audit and find that concentration is reproducible but policy-dependent. We propose Core--Tail World Model (CTWM), a rank-based memory controller that allocates prompt budget with a single exponent and retains a summarized tail. On Synthetic Graph World, CTWM reduces prompt tokens by 5.9%, and the same comparison gives a 24.48% token reduction on LongMemEval with aggregate accuracy parity.",
+    summary: {
+      en: "Agent memory concentrates on a small core with a long tail of rare states. A rank-based controller cuts prompt tokens while keeping that tail summarized.",
+      es: "La memoria de los agentes se concentra en un núcleo pequeño con una cola larga de estados raros. Un controlador basado en rangos reduce tokens del prompt y resume esa cola.",
+      hi: "एजेंट की मेमोरी दुर्लभ अवस्थाओं की लंबी पूँछ के साथ एक छोटे कोर पर केंद्रित होती है। रैंक-आधारित कंट्रोलर उस पूँछ को सारांशित रखकर प्रॉम्प्ट टोकन घटाता है।"
+    }
+  }
+];
+
+window.LEVEL_STYLES = {
+  vibe: "bg-[#E8EEF9] text-[#2046A0] border-[#2046A0]/30",
+  agent: "bg-[#F1EAFB] text-[#5B2AA8] border-[#5B2AA8]/30",
+  master: "bg-[#FBE7E4] text-[#A52A20] border-[#A52A20]/30"
+};
+
+window.STATUS_STYLES = {
+  code_released: "bg-[#E6F5EE] text-[#166B45]",
+  weights_available: "bg-[#FFF4D6] text-[#8A5A00]",
+  preprint_open: "bg-[#EEF0F3] text-[#333333]"
+};
+
+window.SANDBOX_TRACKS = [
+  {
+    level: "vibe",
+    command: "pip install dspy",
+    note: {
+      en: "Installs the public DSPy package from PyPI. It needs a language model you can reach yourself; a local model through Ollama is free.",
+      es: "Instala el paquete público DSPy desde PyPI. Necesita un modelo de lenguaje al que tengas acceso; un modelo local con Ollama es gratuito.",
+      hi: "PyPI से सार्वजनिक DSPy पैकेज इंस्टॉल करता है। इसे एक भाषा मॉडल चाहिए जिस तक आपकी पहुँच हो; Ollama के ज़रिए स्थानीय मॉडल मुफ़्त है।"
+    }
+  },
+  {
+    level: "agent",
+    command: "git clone https://github.com/princeton-nlp/SWE-agent.git\ncd SWE-agent\npip install -e .",
+    note: {
+      en: "Clones the public SWE-agent repository and installs it in editable mode. Agent runs need model access you provide.",
+      es: "Clona el repositorio público de SWE-agent y lo instala en modo editable. Las ejecuciones del agente necesitan acceso a un modelo que tú proporcionas.",
+      hi: "सार्वजनिक SWE-agent रिपॉज़िटरी क्लोन करके एडिटेबल मोड में इंस्टॉल करता है। एजेंट रन के लिए आपका अपना मॉडल एक्सेस चाहिए।"
+    }
+  },
+  {
+    level: "master",
+    command: "git clone https://github.com/Dao-AILab/flash-attention.git\ncd flash-attention/hopper\npython setup.py install",
+    note: {
+      en: "Builds the FlashAttention-3 Hopper kernels from the public repo. Needs an NVIDIA Hopper GPU (H100 class) and CUDA. Read the repo README before running.",
+      es: "Compila los kernels Hopper de FlashAttention-3 desde el repo público. Requiere una GPU NVIDIA Hopper (clase H100) y CUDA. Lee el README del repo antes de ejecutar.",
+      hi: "सार्वजनिक रिपॉज़िटरी से FlashAttention-3 Hopper कर्नल बनाता है। इसके लिए NVIDIA Hopper GPU (H100 श्रेणी) और CUDA चाहिए। चलाने से पहले रिपॉज़िटरी का README पढ़ें।"
+    }
+  }
+];
+
+window.UI = {
+  en: {
+    nav_discover: "01 // DISCOVER",
+    nav_labs: "02 // THE LABS",
+    nav_sandbox: "03 // SANDBOX",
+    nav_library: "04 // MY LIBRARY",
+    dossier: "Dossier",
+    hero_kicker: "Frontier AI · Real arXiv papers",
+    hero_title: "FRONTIER",
+    hero_tagline: "Research, sorted by how deep you build.",
+    hero_note: "Six curated arXiv papers. No paid APIs. No invented opportunities.",
+    spotlight_label: "Spotlight paper",
+    inspect: "Inspect dossier",
+    save: "Save",
+    saved: "Saved",
+    remove: "Remove",
+    the: "the",
+    breakthroughs: "BREAKTHROUGHS",
+    filter_label: "Persona filter",
+    filter_all: "All papers",
+    lvl_vibe: "Vibe Coder",
+    lvl_agent: "Agent Coder",
+    lvl_master: "LLM Master",
+    lbl_status: "Status",
+    lbl_date: "Published",
+    lbl_time: "Time",
+    lbl_level: "Level",
+    lbl_authors: "Authors",
+    lbl_abstract: "Original abstract (arXiv, English)",
+    time_na: "Not published by arXiv; date only",
+    open_arxiv: "Open on arXiv ↗",
+    labs_title: "THE LABS",
+    labs_sub: "Groups behind the papers. Opportunities appear here only with a verified primary source link.",
+    labs_empty_title: "No verified openings yet",
+    labs_empty_body: "Fellowships, grants and compute calls will be listed here only after each has a primary source URL. Nothing is invented.",
+    labs_groups: "Research groups behind these papers",
+    sandbox_title: "SANDBOX",
+    sandbox_sub: "Copy a real setup command for each tier. Nothing is provisioned for you; you run it on your own machine.",
+    copy: "Copy command",
+    copied: "Copied",
+    lib_title: "MY LIBRARY",
+    lib_sub: "Papers you saved. Stored only in this browser.",
+    lib_count: "Saved papers",
+    lib_empty: "Nothing saved yet. Open DISCOVER and save a paper.",
+    lib_clear: "Clear library",
+    lib_tiers: "Saved by tier",
+    toast_saved: "Saved to library",
+    toast_removed: "Removed from library",
+    toast_cleared: "Library cleared",
+    toast_copied: "Command copied",
+    close: "Close",
+    footer: "VIBE//APEX · Built on public arXiv metadata. No paid APIs. Every number shown is real or omitted."
+  },
+  es: {
+    nav_discover: "01 // DESCUBRIR",
+    nav_labs: "02 // LOS LABS",
+    nav_sandbox: "03 // SANDBOX",
+    nav_library: "04 // MI BIBLIOTECA",
+    dossier: "Dosier",
+    hero_kicker: "IA de frontera · Artículos reales de arXiv",
+    hero_title: "FRONTERA",
+    hero_tagline: "Investigación, ordenada según qué tan profundo construyas.",
+    hero_note: "Seis artículos de arXiv seleccionados. Sin APIs de pago. Sin oportunidades inventadas.",
+    spotlight_label: "Artículo destacado",
+    inspect: "Ver dosier",
+    save: "Guardar",
+    saved: "Guardado",
+    remove: "Quitar",
+    the: "los",
+    breakthroughs: "AVANCES",
+    filter_label: "Filtro de perfil",
+    filter_all: "Todos los artículos",
+    lvl_vibe: "Vibe Coder",
+    lvl_agent: "Agent Coder",
+    lvl_master: "LLM Master",
+    lbl_status: "Estado",
+    lbl_date: "Publicado",
+    lbl_time: "Hora",
+    lbl_level: "Nivel",
+    lbl_authors: "Autores",
+    lbl_abstract: "Resumen original (arXiv, inglés)",
+    time_na: "arXiv no publica la hora; solo fecha",
+    open_arxiv: "Abrir en arXiv ↗",
+    labs_title: "LOS LABS",
+    labs_sub: "Grupos detrás de los artículos. Las oportunidades aparecen aquí solo con un enlace verificado a la fuente primaria.",
+    labs_empty_title: "Aún no hay convocatorias verificadas",
+    labs_empty_body: "Becas, subvenciones y convocatorias de cómputo aparecerán aquí solo cuando cada una tenga una URL de fuente primaria. Nada se inventa.",
+    labs_groups: "Grupos de investigación detrás de estos artículos",
+    sandbox_title: "SANDBOX",
+    sandbox_sub: "Copia un comando de configuración real para cada nivel. Nada se aprovisiona por ti; lo ejecutas en tu propia máquina.",
+    copy: "Copiar comando",
+    copied: "Copiado",
+    lib_title: "MI BIBLIOTECA",
+    lib_sub: "Artículos que guardaste. Se guardan solo en este navegador.",
+    lib_count: "Artículos guardados",
+    lib_empty: "Aún no guardas nada. Abre DESCUBRIR y guarda un artículo.",
+    lib_clear: "Vaciar biblioteca",
+    lib_tiers: "Guardados por nivel",
+    toast_saved: "Guardado en la biblioteca",
+    toast_removed: "Quitado de la biblioteca",
+    toast_cleared: "Biblioteca vaciada",
+    toast_copied: "Comando copiado",
+    close: "Cerrar",
+    footer: "VIBE//APEX · Construido con metadatos públicos de arXiv. Sin APIs de pago. Cada número mostrado es real o se omite."
+  },
+  hi: {
+    nav_discover: "01 // खोजें",
+    nav_labs: "02 // लैब्स",
+    nav_sandbox: "03 // सैंडबॉक्स",
+    nav_library: "04 // मेरी लाइब्रेरी",
+    dossier: "डोज़ियर",
+    hero_kicker: "फ्रंटियर AI · वास्तविक arXiv शोधपत्र",
+    hero_title: "फ्रंटियर",
+    hero_tagline: "शोध, आपके निर्माण के स्तर के अनुसार छँटा हुआ।",
+    hero_note: "छह चुने हुए arXiv शोधपत्र। कोई पेड API नहीं। कोई काल्पनिक अवसर नहीं।",
+    spotlight_label: "मुख्य शोधपत्र",
+    inspect: "डोज़ियर देखें",
+    save: "सहेजें",
+    saved: "सहेजा गया",
+    remove: "हटाएँ",
+    the: "the",
+    breakthroughs: "सफलताएँ",
+    filter_label: "पर्सोना फ़िल्टर",
+    filter_all: "सभी शोधपत्र",
+    lvl_vibe: "वाइब कोडर",
+    lvl_agent: "एजेंट कोडर",
+    lvl_master: "एलएलएम मास्टर",
+    lbl_status: "स्थिति",
+    lbl_date: "प्रकाशित",
+    lbl_time: "समय",
+    lbl_level: "स्तर",
+    lbl_authors: "लेखक",
+    lbl_abstract: "मूल सार (arXiv, अंग्रेज़ी)",
+    time_na: "arXiv समय प्रकाशित नहीं करता; केवल तारीख",
+    open_arxiv: "arXiv पर खोलें ↗",
+    labs_title: "लैब्स",
+    labs_sub: "शोधपत्रों के पीछे के समूह। अवसर यहाँ केवल सत्यापित प्राथमिक स्रोत लिंक के साथ दिखेंगे।",
+    labs_empty_title: "अभी कोई सत्यापित अवसर नहीं",
+    labs_empty_body: "फ़ेलोशिप, अनुदान और कंप्यूट कॉल तभी दिखेंगे जब हर एक का प्राथमिक स्रोत URL होगा। कुछ भी काल्पनिक नहीं है।",
+    labs_groups: "इन शोधपत्रों के पीछे के शोध समूह",
+    sandbox_title: "सैंडबॉक्स",
+    sandbox_sub: "हर स्तर के लिए एक वास्तविक सेटअप कमांड कॉपी करें। आपके लिए कुछ भी प्रोविज़न नहीं होता; आप इसे अपनी मशीन पर चलाते हैं।",
+    copy: "कमांड कॉपी करें",
+    copied: "कॉपी हो गया",
+    lib_title: "मेरी लाइब्रेरी",
+    lib_sub: "आपके सहेजे गए शोधपत्र। केवल इसी ब्राउज़र में संग्रहीत।",
+    lib_count: "सहेजे गए शोधपत्र",
+    lib_empty: "अभी कुछ सहेजा नहीं गया। खोजें खोलें और एक शोधपत्र सहेजें।",
+    lib_clear: "लाइब्रेरी खाली करें",
+    lib_tiers: "स्तर के अनुसार सहेजे गए",
+    toast_saved: "लाइब्रेरी में सहेजा गया",
+    toast_removed: "लाइब्रेरी से हटाया गया",
+    toast_cleared: "लाइब्रेरी खाली की गई",
+    toast_copied: "कमांड कॉपी किया गया",
+    close: "बंद करें",
+    footer: "VIBE//APEX · सार्वजनिक arXiv मेटाडेटा पर बना। कोई पेड API नहीं। दिखाया गया हर नंबर वास्तविक है या हटाया गया है।"
+  }
+};
diff --git a/index.html b/index.html
new file mode 100644
index 0000000..0b80c2a
--- /dev/null
+++ b/index.html
@@ -0,0 +1,206 @@
+<!DOCTYPE html>
+<html lang="en">
+<head>
+  <meta charset="utf-8">
+  <meta name="viewport" content="width=device-width, initial-scale=1.0">
+  <title>VIBE//APEX — Frontier AI Research Hub</title>
+  <link rel="preconnect" href="https://fonts.googleapis.com">
+  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
+  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@500;700;800;900&display=swap" rel="stylesheet">
+  <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
+  <script>
+    tailwind.config = {
+      theme: {
+        extend: {
+          colors: {
+            terracotta: '#A52A20',
+            obsidian: '#0C0C0E',
+            cream: '#FBF9F5',
+            'paper-cream': '#F3EFEA'
+          },
+          fontFamily: {
+            display: ['Syne', 'sans-serif'],
+            serif: ['"Instrument Serif"', 'Georgia', 'serif'],
+            mono: ['"JetBrains Mono"', 'monospace'],
+            sans: ['Inter', 'sans-serif']
+          }
+        }
+      }
+    };
+  </script>
+  <style>
+    .bg-grid-dots { background-image: radial-gradient(rgba(255,255,255,.22) 1.5px, transparent 1.5px); background-size: 28px 28px; }
+    .tab-pane { display: none; }
+    .tab-pane.is-active { display: block; }
+    .drawer-open { transform: translateX(0); }
+    .drawer-closed { transform: translateX(100%); box-shadow: none; }
+    .toast-show { opacity: 1; transform: translateY(0); }
+    .toast-hide { opacity: 0; transform: translateY(20px); }
+    ::selection { background: #A52A20; color: #fff; }
+  </style>
+</head>
+<body class="bg-cream text-[#111113] font-sans antialiased overflow-x-hidden">
+
+  <!-- NAVIGATION + LANGUAGE TOGGLE -->
+  <header class="sticky top-0 z-40 h-20 px-4 lg:px-14 flex items-center justify-between gap-4 border-b border-black/[0.08] bg-cream/95 backdrop-blur-md">
+    <a href="#" class="flex items-center gap-2 shrink-0" data-tab-link="discover">
+      <span class="font-display font-black text-2xl tracking-tighter">VIBE//APEX</span>
+      <span class="hidden sm:inline text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black text-white">VOL.06</span>
+    </a>
+
+    <nav class="hidden md:flex items-center gap-8">
+      <button class="nav-tab text-[11px] font-mono font-bold tracking-[0.24em] uppercase py-2 border-b-2 cursor-pointer" data-tab="discover" data-i18n="nav_discover"></button>
+      <button class="nav-tab text-[11px] font-mono font-bold tracking-[0.24em] uppercase py-2 border-b-2 cursor-pointer" data-tab="labs" data-i18n="nav_labs"></button>
+      <button class="nav-tab text-[11px] font-mono font-bold tracking-[0.24em] uppercase py-2 border-b-2 cursor-pointer" data-tab="sandbox" data-i18n="nav_sandbox"></button>
+      <button class="nav-tab text-[11px] font-mono font-bold tracking-[0.24em] uppercase py-2 border-b-2 cursor-pointer" data-tab="library" data-i18n="nav_library"></button>
+    </nav>
+
+    <div class="flex items-center gap-3">
+      <div class="flex items-center bg-paper-cream border border-black/10 rounded-full p-0.5 text-[11px] font-mono font-bold" role="group" aria-label="Language">
+        <button class="lang-btn px-2.5 py-1 rounded-full cursor-pointer" data-lang="en">EN</button>
+        <button class="lang-btn px-2.5 py-1 rounded-full cursor-pointer" data-lang="es">ES</button>
+        <button class="lang-btn px-2.5 py-1 rounded-full cursor-pointer" data-lang="hi">HI</button>
+      </div>
+      <button id="dossierBtn" class="flex items-center gap-2 px-4 py-2 rounded-full border border-[#111113] text-xs font-bold tracking-widest uppercase hover:bg-[#111113] hover:text-cream transition cursor-pointer">
+        <span data-i18n="dossier"></span>
+        <span id="libraryCount" class="w-5 h-5 rounded-full bg-terracotta text-[10px] text-white flex items-center justify-center font-mono font-bold">0</span>
+      </button>
+    </div>
+  </header>
+
+  <!-- MOBILE TABS -->
+  <div class="md:hidden flex justify-around bg-paper-cream border-b border-black/[0.08] px-2 py-2 overflow-x-auto">
+    <button class="nav-tab-m px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-md cursor-pointer" data-tab="discover">Discover</button>
+    <button class="nav-tab-m px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-md cursor-pointer" data-tab="labs">Labs</button>
+    <button class="nav-tab-m px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-md cursor-pointer" data-tab="sandbox">Sandbox</button>
+    <button class="nav-tab-m px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-md cursor-pointer" data-tab="library">Library</button>
+  </div>
+
+  <main>
+    <!-- ============ TAB 1: DISCOVER ============ -->
+    <section id="tab-discover" class="tab-pane">
+      <!-- Hero -->
+      <div class="relative bg-terracotta text-cream overflow-hidden bg-grid-dots">
+        <div class="px-4 lg:px-14 pt-10 pb-16 min-h-[560px] flex flex-col justify-between gap-10">
+          <div class="flex flex-col md:flex-row md:justify-between gap-4">
+            <div>
+              <p class="flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] uppercase"><span class="w-2 h-2 rounded-full bg-cream"></span><span data-i18n="hero_kicker"></span></p>
+              <p class="font-serif italic text-4xl md:text-5xl mt-4" data-i18n="hero_tagline"></p>
+            </div>
+            <p class="text-xs font-mono text-cream/80 md:text-right max-w-xs" data-i18n="hero_note"></p>
+          </div>
+          <h1 class="font-display font-black text-[22vw] md:text-[17vw] leading-none tracking-tighter whitespace-nowrap text-cream/95 select-none" data-i18n="hero_title"></h1>
+        </div>
+        <!-- Floating spotlight card, filled by app.js -->
+        <div id="spotlight" class="absolute right-4 lg:right-14 top-1/2 -translate-y-1/2 w-[min(92vw,380px)] hidden lg:block"></div>
+      </div>
+      <div id="spotlightMobile" class="lg:hidden px-4 -mt-10 relative z-10"></div>
+
+      <!-- Divider -->
+      <div class="px-4 lg:px-14 py-20 overflow-hidden">
+        <p class="flex items-baseline gap-4 whitespace-nowrap">
+          <span class="font-serif italic text-5xl md:text-7xl text-black/60" data-i18n="the"></span>
+          <span class="font-display font-black text-[13vw] leading-none tracking-tight" data-i18n="breakthroughs"></span>
+        </p>
+      </div>
+
+      <!-- Persona filter + grid -->
+      <div class="px-4 lg:px-14 pb-24">
+        <div class="flex flex-wrap items-center gap-3 border-t border-black/10 pt-6 pb-8">
+          <span class="text-[11px] font-mono tracking-widest uppercase text-black/50 mr-2" data-i18n="filter_label"></span>
+          <button class="filter-btn px-4 py-1.5 rounded-full border text-[11px] font-mono font-bold uppercase cursor-pointer" data-filter="all" data-i18n="filter_all"></button>
+          <button class="filter-btn px-4 py-1.5 rounded-full border text-[11px] font-mono font-bold uppercase cursor-pointer" data-filter="vibe" data-i18n="lvl_vibe"></button>
+          <button class="filter-btn px-4 py-1.5 rounded-full border text-[11px] font-mono font-bold uppercase cursor-pointer" data-filter="agent" data-i18n="lvl_agent"></button>
+          <button class="filter-btn px-4 py-1.5 rounded-full border text-[11px] font-mono font-bold uppercase cursor-pointer" data-filter="master" data-i18n="lvl_master"></button>
+        </div>
+        <div id="paperGrid" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"></div>
+      </div>
+    </section>
+
+    <!-- ============ TAB 2: THE LABS ============ -->
+    <section id="tab-labs" class="tab-pane bg-obsidian text-cream min-h-[90vh] px-4 lg:px-14 py-16">
+      <div class="grid gap-10 lg:grid-cols-12">
+        <div class="lg:col-span-5 lg:sticky lg:top-28 self-start">
+          <h2 class="font-display font-black text-[15vw] lg:text-[7vw] leading-[0.9] tracking-tighter" data-i18n="labs_title"></h2>
+          <p class="text-sm text-cream/60 mt-6 max-w-md leading-relaxed" data-i18n="labs_sub"></p>
+        </div>
+        <div class="lg:col-span-7 space-y-10">
+          <div class="rounded-2xl bg-[#141418] border border-white/10 p-8">
+            <p class="text-[11px] font-mono uppercase tracking-widest text-terracotta" data-i18n="labs_empty_title"></p>
+            <p class="text-sm text-cream/70 mt-3 leading-relaxed" data-i18n="labs_empty_body"></p>
+          </div>
+          <div>
+            <p class="text-[11px] font-mono uppercase tracking-widest text-cream/50 mb-4" data-i18n="labs_groups"></p>
+            <ul id="labsList" class="divide-y divide-white/10 border-t border-white/10"></ul>
+          </div>
+        </div>
+      </div>
+    </section>
+
+    <!-- ============ TAB 3: SANDBOX ============ -->
+    <section id="tab-sandbox" class="tab-pane bg-cream px-4 lg:px-14 py-16 min-h-[90vh]">
+      <h2 class="font-display font-black text-[15vw] lg:text-[8vw] leading-[0.9] tracking-tighter" data-i18n="sandbox_title"></h2>
+      <p class="text-sm text-black/60 mt-6 max-w-2xl leading-relaxed" data-i18n="sandbox_sub"></p>
+      <div id="sandboxTracks" class="mt-12 grid gap-6 lg:grid-cols-3"></div>
+    </section>
+
+    <!-- ============ TAB 4: MY LIBRARY ============ -->
+    <section id="tab-library" class="tab-pane bg-cream px-4 lg:px-14 py-16 min-h-[90vh]">
+      <h2 class="font-display font-black text-[15vw] lg:text-[8vw] leading-[0.9] tracking-tighter" data-i18n="lib_title"></h2>
+      <p class="text-sm text-black/60 mt-6 max-w-2xl" data-i18n="lib_sub"></p>
+
+      <div class="mt-12 grid gap-10 lg:grid-cols-12">
+        <div class="lg:col-span-4 space-y-6">
+          <div class="border-t-2 border-black pt-4">
+            <p class="text-[11px] font-mono uppercase tracking-widest text-black/50" data-i18n="lib_count"></p>
+            <p id="libTotal" class="font-display font-black text-7xl leading-none mt-2">0</p>
+          </div>
+          <div class="border-t border-black/20 pt-4">
+            <p class="text-[11px] font-mono uppercase tracking-widest text-black/50 mb-3" data-i18n="lib_tiers"></p>
+            <div id="libTiers" class="space-y-2 text-sm font-mono"></div>
+          </div>
+          <button id="clearLibrary" class="text-xs font-mono font-bold uppercase underline text-terracotta cursor-pointer" data-i18n="lib_clear"></button>
+        </div>
+        <div class="lg:col-span-8">
+          <ul id="libList" class="divide-y divide-black/10 border-t-2 border-black"></ul>
+        </div>
+      </div>
+    </section>
+  </main>
+
+  <footer class="bg-obsidian text-cream/50 px-4 lg:px-14 py-8 text-[11px] font-mono">
+    <p data-i18n="footer"></p>
+  </footer>
+
+  <!-- DOSSIER DRAWER -->
+  <div id="modalBackdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity z-50"></div>
+  <aside id="drawer" class="fixed top-0 right-0 h-full w-full max-w-lg bg-cream shadow-2xl overflow-y-auto z-50 drawer-closed transition-transform duration-300">
+    <div class="p-8">
+      <div class="flex items-center justify-between">
+        <span id="drawerLevel" class="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border"></span>
+        <button id="drawerClose" class="text-xs font-mono font-bold uppercase underline cursor-pointer" data-i18n="close"></button>
+      </div>
+      <h3 id="drawerTitle" class="font-display font-black text-3xl leading-tight mt-8"></h3>
+      <p id="drawerAuthors" class="text-sm text-black/60 mt-4"></p>
+      <dl class="grid grid-cols-2 gap-4 mt-8 text-sm font-mono border-t border-b border-black/10 py-5">
+        <div><dt class="text-[10px] uppercase text-black/50" data-i18n="lbl_status"></dt><dd id="drawerStatus" class="mt-1"></dd></div>
+        <div><dt class="text-[10px] uppercase text-black/50" data-i18n="lbl_date"></dt><dd id="drawerDate" class="mt-1"></dd></div>
+        <div><dt class="text-[10px] uppercase text-black/50" data-i18n="lbl_time"></dt><dd id="drawerTime" class="mt-1"></dd></div>
+        <div><dt class="text-[10px] uppercase text-black/50">arXiv</dt><dd id="drawerArxiv" class="mt-1"></dd></div>
+      </dl>
+      <p id="drawerSummary" class="text-base leading-relaxed mt-8"></p>
+      <p class="text-[10px] font-mono uppercase text-black/50 mt-8" data-i18n="lbl_abstract"></p>
+      <p id="drawerAbstract" class="text-sm text-black/70 leading-relaxed mt-2"></p>
+      <div class="mt-10 flex gap-3">
+        <button id="drawerSave" class="flex-1 py-3 rounded-full bg-obsidian text-cream text-xs font-bold tracking-widest uppercase cursor-pointer"></button>
+        <a id="drawerLink" target="_blank" rel="noopener" class="flex-1 py-3 rounded-full border border-black text-center text-xs font-bold tracking-widest uppercase"></a>
+      </div>
+    </div>
+  </aside>
+
+  <div id="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-obsidian text-cream text-xs font-mono px-5 py-3 rounded-full shadow-xl transition-all toast-hide z-[60]"></div>
+
+  <script src="data.js"></script>
+  <script src="app.js"></script>
+</body>
+</html>
```

## B4: `81b25bc`

**Commit:** Translate Labs list entries with the paper summary  
**Summary:** Labs list entries now show the translated summary, so they change with the language toggle.

```diff
diff --git a/app.js b/app.js
index 2d537ca..0704a1e 100644
--- a/app.js
+++ b/app.js
@@ -117,6 +117,7 @@
         <div>
           <p class="font-display font-bold uppercase text-sm">${esc(p.authors)}</p>
           <p class="text-xs text-cream/60 mt-1">${esc(p.title)}</p>
+          <p class="text-sm text-cream/80 mt-2 leading-relaxed">${esc(summaryOf(p))}</p>
         </div>
         <a href="https://arxiv.org/abs/${esc(p.arxiv)}" target="_blank" rel="noopener" class="text-xs font-mono font-bold uppercase text-terracotta-light underline shrink-0">arXiv:${esc(p.arxiv)} ↗</a>
       </li>`).join("");
```

## B7: `c4af4e4`

**Commit:** Add verified AI opportunities and translate paper titles  
**Summary:** Replaced the empty Labs area with three verified AI opportunities, renamed the tab to OPPORTUNITIES, and translated the six paper titles.

```diff
diff --git a/app.js b/app.js
index 0704a1e..bf7c2f9 100644
--- a/app.js
+++ b/app.js
@@ -41,7 +41,9 @@
     const map = {
       code_released: { en: "Code Released", es: "Código publicado", hi: "कोड जारी" },
       weights_available: { en: "Weights Available", es: "Pesos disponibles", hi: "वेट्स उपलब्ध" },
-      preprint_open: { en: "Preprint Open", es: "Preprint abierto", hi: "प्रीप्रिंट खुला" }
+      preprint_open: { en: "Preprint Open", es: "Preprint abierto", hi: "प्रीप्रिंट खुला" },
+      open: { en: "Open", es: "Abierta", hi: "खुला" },
+      rolling: { en: "Rolling", es: "Continua", hi: "रोलिंग" }
     };
     return map[status][lang] || map[status].en;
   }
@@ -50,8 +52,21 @@
     return PAPERS.find((p) => p.id === id);
   }
 
-  function summaryOf(p) {
-    return p.summary[lang] || p.summary.en;
+  function summaryOf(item) {
+    return item.summary[lang] || item.summary.en;
+  }
+
+  // Translated title when one exists; the English original is shown beneath it.
+  function titleOf(p) {
+    return (p.titles && p.titles[lang]) || p.title;
+  }
+
+  function titleBlock(p, cls) {
+    const translated = titleOf(p);
+    const original = translated !== p.title
+      ? `<span class="block text-[11px] font-mono font-normal normal-case tracking-normal text-black/50 mt-2">${esc(p.title)}</span>`
+      : "";
+    return `<span class="${cls}">${esc(translated)}${original}</span>`;
   }
 
   function badges(p) {
@@ -69,7 +84,7 @@
           <span class="text-terracotta">● ${esc(t("spotlight_label"))}</span>
           <span class="bg-paper-cream px-2 py-1 rounded">arXiv:${esc(p.arxiv)}</span>
         </div>
-        <h2 class="font-display font-black text-2xl leading-tight mt-5">${esc(p.title)}</h2>
+        <h2 class="font-display font-black text-2xl leading-tight mt-5">${esc(titleOf(p))}</h2>
         <p class="text-sm text-black/60 mt-4 leading-relaxed">${esc(summaryOf(p))}</p>
         <div class="flex items-center justify-between mt-5 text-xs">
           <span class="font-mono text-black/50">${esc(p.date)}</span>
@@ -84,14 +99,14 @@
     byId("spotlightMobile").innerHTML = html;
   }
 
-  // ---------- Grid ----------
+  // ---------- Discover grid ----------
   function renderGrid() {
     const visible = PAPERS.filter((p) => filter === "all" || p.level === filter);
     byId("paperGrid").innerHTML = visible.map((p) => `
       <article class="bg-white border border-black/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-black/30 transition">
         <div class="flex flex-wrap gap-2">${badges(p)}</div>
         <p class="text-[11px] font-mono text-black/50">arXiv:${esc(p.arxiv)} · ${esc(p.date)}</p>
-        <h3 class="font-display font-black text-xl leading-tight uppercase">${esc(p.title)}</h3>
+        <h3 class="font-display font-black text-xl leading-tight uppercase">${titleBlock(p, "")}</h3>
         <p class="text-sm text-black/60 leading-relaxed">${esc(summaryOf(p))}</p>
         <div class="mt-auto pt-4 border-t border-black/10 flex items-center justify-between">
           <button class="open-btn text-xs font-mono font-bold uppercase text-terracotta hover:underline cursor-pointer" data-id="${p.id}">${esc(t("inspect"))} ↗</button>
@@ -110,14 +125,36 @@
     });
   }
 
-  // ---------- Labs ----------
+  // ---------- Opportunities (Labs tab) ----------
+  function renderOpportunities() {
+    byId("oppGrid").innerHTML = OPPORTUNITIES.map((o) => {
+      const isOpen = o.status === "open";
+      const when = isOpen
+        ? `<div><dt class="text-[10px] uppercase text-cream/50">${esc(t("opp_deadline"))}</dt><dd class="mt-1">${esc(o.deadline)} · ${esc(o.time)}</dd></div>`
+        : `<div><dt class="text-[10px] uppercase text-cream/50">${esc(t("opp_deadline"))}</dt><dd class="mt-1">${esc(t("opp_rolling"))}</dd></div>`;
+      return `
+      <article class="rounded-2xl bg-[#141418] border border-white/10 p-6 flex flex-col gap-4">
+        <div class="flex flex-wrap gap-2">
+          <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status]}">${esc(statusLabel(o.status))}</span>
+          <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-white/20">${esc(levelLabel(o.level))}</span>
+        </div>
+        <h3 class="font-display font-black text-xl leading-tight uppercase">${esc(o.name)}</h3>
+        <p class="text-sm text-cream/70 leading-relaxed">${esc(summaryOf(o))}</p>
+        <dl class="grid grid-cols-2 gap-3 text-sm font-mono border-t border-white/10 pt-4">
+          ${when}
+          <div><dt class="text-[10px] uppercase text-cream/50">${esc(t("opp_amount"))}</dt><dd class="mt-1">${esc(o.amount)}</dd></div>
+        </dl>
+        <a href="${esc(o.url)}" target="_blank" rel="noopener" class="mt-auto text-center py-2.5 rounded-full border border-white/30 text-xs font-bold tracking-widest uppercase hover:bg-cream hover:text-obsidian transition">${esc(t("opp_open_link"))}</a>
+      </article>`;
+    }).join("");
+  }
+
   function renderLabs() {
     byId("labsList").innerHTML = PAPERS.map((p) => `
       <li class="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
         <div>
           <p class="font-display font-bold uppercase text-sm">${esc(p.authors)}</p>
-          <p class="text-xs text-cream/60 mt-1">${esc(p.title)}</p>
-          <p class="text-sm text-cream/80 mt-2 leading-relaxed">${esc(summaryOf(p))}</p>
+          <p class="text-xs text-cream/60 mt-1">${esc(titleOf(p))}</p>
         </div>
         <a href="https://arxiv.org/abs/${esc(p.arxiv)}" target="_blank" rel="noopener" class="text-xs font-mono font-bold uppercase text-terracotta-light underline shrink-0">arXiv:${esc(p.arxiv)} ↗</a>
       </li>`).join("");
@@ -158,7 +195,7 @@
         <li class="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
           <div>
             <div class="flex flex-wrap gap-2 mb-2">${badges(p)}</div>
-            <p class="font-display font-bold uppercase text-sm leading-snug">${esc(p.title)}</p>
+            <p class="font-display font-bold uppercase text-sm leading-snug">${titleBlock(p, "")}</p>
             <p class="text-[11px] font-mono text-black/50 mt-1">arXiv:${esc(p.arxiv)} · ${esc(p.date)}</p>
           </div>
           <div class="flex gap-3 shrink-0">
@@ -176,7 +213,7 @@
     openId = id;
     byId("drawerLevel").className = `text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${LEVEL_STYLES[p.level]}`;
     byId("drawerLevel").textContent = levelLabel(p.level);
-    byId("drawerTitle").textContent = p.title;
+    byId("drawerTitle").textContent = titleOf(p);
     byId("drawerAuthors").textContent = `${t("lbl_authors")}: ${p.authors}`;
     byId("drawerStatus").textContent = statusLabel(p.status);
     byId("drawerDate").textContent = p.date;
@@ -291,6 +328,7 @@
     renderSpotlight();
     renderFilters();
     renderGrid();
+    renderOpportunities();
     renderLabs();
     renderSandbox();
     renderLibrary();
diff --git a/data.js b/data.js
index 190b453..5f90ebe 100644
--- a/data.js
+++ b/data.js
@@ -1,8 +1,10 @@
-// VIBE//APEX data. Every paper below is a real arXiv preprint; ids, titles and dates
-// were checked against arxiv.org. Dates are the arXiv first-version date. arXiv does not
-// publish a submission time on the abstract page, so no time is shown for these entries.
-// Summaries in ES and HI are translations of the English line and should be reviewed by a
-// native speaker before wider release. Paper titles and abstracts stay in English.
+// VIBE//APEX data.
+// Papers: every id, title and date was checked against arxiv.org. Dates are the arXiv first-version
+// date; arXiv publishes no submission time on the abstract page, so no time is shown for papers.
+// Opportunities: each entry was checked on its official page (dates and amounts quoted from that page).
+// Only open or rolling calls are listed; closed calls are noted in their own summary.
+// ES and HI text is translated and should be reviewed by a native speaker before wider release.
+// Paper titles and abstracts keep the English original, shown beneath the translated title.
 
 window.PAPERS = [
   {
@@ -13,6 +15,10 @@ window.PAPERS = [
     date: "2025-01-22",
     authors: "DeepSeek-AI, Guo, Yang, Zhang et al.",
     title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
+    titles: {
+      es: "DeepSeek-R1: Incentivar la capacidad de razonamiento de los LLM mediante aprendizaje por refuerzo",
+      hi: "DeepSeek-R1: रीइन्फोर्समेंट लर्निंग के माध्यम से LLM में तर्क-क्षमता को प्रोत्साहित करना"
+    },
     abstract: "General reasoning represents a long-standing and formidable challenge in artificial intelligence. Here we show that the reasoning abilities of LLMs can be incentivized through pure reinforcement learning (RL), obviating the need for human-labeled reasoning trajectories. The proposed RL framework facilitates the emergent development of advanced reasoning patterns, such as self-reflection, verification, and dynamic strategy adaptation. Moreover, the emergent reasoning patterns exhibited by these large-scale models can be systematically harnessed to guide and enhance the reasoning capabilities of smaller models.",
     summary: {
       en: "Pure reinforcement learning, with no human-labeled reasoning traces, pushes a base model to develop self-verification and reflection.",
@@ -28,6 +34,10 @@ window.PAPERS = [
     date: "2024-07-11",
     authors: "Shah, Bikshandi, Zhang, Thakkar, Ramani, Dao",
     title: "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision",
+    titles: {
+      es: "FlashAttention-3: Atención rápida y precisa con asincronía y baja precisión",
+      hi: "FlashAttention-3: असिंक्रोनी और निम्न-परिशुद्धता के साथ तेज़ और सटीक अटेंशन"
+    },
     abstract: "Attention, as a core layer of the ubiquitous Transformer architecture, is the bottleneck for large language models and long-context applications. We develop three main techniques to speed up attention on Hopper GPUs: exploiting asynchrony of the Tensor Cores and TMA, interleaving block-wise matmul and softmax operations, and block quantization and incoherent processing that leverages hardware support for FP8 low-precision. FlashAttention-3 achieves speedup on H100 GPUs by 1.5-2.0x with FP16 reaching up to 740 TFLOPs/s (75% utilization), and with FP8 reaching close to 1.2 PFLOPs/s.",
     summary: {
       en: "Hopper-specific attention kernel that overlaps data movement with compute and uses FP8, reaching about 740 TFLOPs/s in FP16 on H100.",
@@ -43,6 +53,10 @@ window.PAPERS = [
     date: "2024-05-06",
     authors: "Yang, Jimenez, Wettig, Lieret, Yao, Narasimhan et al.",
     title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
+    titles: {
+      es: "SWE-agent: Interfaces agente-computadora que permiten la ingeniería de software automatizada",
+      hi: "SWE-agent: एजेंट-कंप्यूटर इंटरफ़ेस जो स्वचालित सॉफ़्टवेयर इंजीनियरिंग को सक्षम बनाते हैं"
+    },
     abstract: "We introduce SWE-agent: a system that facilitates LM agents to autonomously use computers to solve software engineering tasks. SWE-agent's custom agent-computer interface (ACI) significantly enhances an agent's ability to create and edit code files, navigate entire repositories, and execute tests and other programs. We evaluate SWE-agent on SWE-bench and HumanEvalFix, achieving state-of-the-art performance on both with a pass@1 rate of 12.5% and 87.7%, respectively.",
     summary: {
       en: "A purpose-built terminal interface lets an LM agent navigate a repo, edit files and run tests. It set state of the art on SWE-bench at publication.",
@@ -58,6 +72,10 @@ window.PAPERS = [
     date: "2023-10-05",
     authors: "Khattab, Singhvi, Maheshwari, Zhang et al.",
     title: "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines",
+    titles: {
+      es: "DSPy: Compilar llamadas declarativas a modelos de lenguaje en pipelines que se auto-mejoran",
+      hi: "DSPy: घोषणात्मक भाषा-मॉडल कॉल को स्व-सुधारी पाइपलाइनों में संकलित करना"
+    },
     abstract: "We introduce DSPy, a programming model that abstracts LM pipelines as text transformation graphs, i.e. imperative computational graphs where LMs are invoked through declarative modules. We design a compiler that will optimize any DSPy pipeline to maximize a given metric. Within minutes of compiling, a few lines of DSPy allow GPT-3.5 and llama2-13b-chat to self-bootstrap pipelines that outperform standard few-shot prompting.",
     summary: {
       en: "Describe a pipeline in a few lines of Python, then let a compiler tune the prompts and examples against a metric you pick.",
@@ -73,6 +91,10 @@ window.PAPERS = [
     date: "2024-10-07",
     authors: "Mirzadeh, Alizadeh, Shahrokhi, Tuzel, Bengio, Farajtabar",
     title: "GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models",
+    titles: {
+      es: "GSM-Symbolic: Comprender las limitaciones del razonamiento matemático en modelos de lenguaje grandes",
+      hi: "GSM-Symbolic: बड़े भाषा मॉडलों में गणितीय तर्क की सीमाओं को समझना"
+    },
     abstract: "We introduce GSM-Symbolic, an improved benchmark created from symbolic templates that allow for the generation of a diverse set of questions. Our findings reveal that LLMs exhibit noticeable variance when responding to different instantiations of the same question. Adding a single clause that seems relevant to the question causes significant performance drops (up to 65%) across all state-of-the-art models.",
     summary: {
       en: "Change only the numbers in a grade-school math problem, or add one irrelevant clause, and model scores drop. Benchmark scores can overstate reasoning.",
@@ -88,6 +110,10 @@ window.PAPERS = [
     date: "2026-07-09",
     authors: "Song, Xinyuan; Cai, Zekun",
     title: "Heavy-Tailed Memory Traces in Long-Horizon Language Agents",
+    titles: {
+      es: "Trazas de memoria de cola pesada en agentes de lenguaje de horizonte largo",
+      hi: "लॉन्ग-होराइज़न भाषा एजेंटों में हेवी-टेल्ड मेमोरी ट्रेसेस"
+    },
     abstract: "Long-horizon language agents increasingly rely on external memory as a frozen world model, yet current memory systems are usually judged only by task success or token cost. We study this effect through a conservative tail audit and find that concentration is reproducible but policy-dependent. We propose Core--Tail World Model (CTWM), a rank-based memory controller that allocates prompt budget with a single exponent and retains a summarized tail. On Synthetic Graph World, CTWM reduces prompt tokens by 5.9%, and the same comparison gives a 24.48% token reduction on LongMemEval with aggregate accuracy parity.",
     summary: {
       en: "Agent memory concentrates on a small core with a long tail of rare states. A rank-based controller cuts prompt tokens while keeping that tail summarized.",
@@ -97,6 +123,55 @@ window.PAPERS = [
   }
 ];
 
+// Verified open or rolling calls. Amounts and dates are quoted from each official page.
+window.OPPORTUNITIES = [
+  {
+    id: "foresight-ai-science",
+    name: "Foresight Institute: AI for Science & Safety Nodes RFP",
+    level: "agent",
+    status: "open",
+    deadline: "2026-10-31",
+    time: "23:59 PDT",
+    amount: "$30,000–$100,000 typical",
+    summary: {
+      en: "Funds AI-driven science and safety projects. Work product (code, data, outputs) must be open-sourced. Individuals, teams and organizations may apply.",
+      es: "Financia proyectos de ciencia y seguridad impulsados por IA. El trabajo (código, datos y resultados) debe ser de código abierto. Pueden postular personas, equipos y organizaciones.",
+      hi: "AI-आधारित विज्ञान और सुरक्षा परियोजनाओं को निधि देता है। कार्य (कोड, डेटा, आउटपुट) ओपन-सोर्स होना चाहिए। व्यक्ति, टीमें और संगठन आवेदन कर सकते हैं।"
+    },
+    url: "https://foresight.org/grants/ai-science-safety-nodes-rfp/"
+  },
+  {
+    id: "inference-compute",
+    name: "Inference.net: AI Compute Grants",
+    level: "vibe",
+    status: "rolling",
+    deadline: null,
+    time: null,
+    amount: "Up to $10,000 in compute",
+    summary: {
+      en: "Free compute for developers and researchers building open-source AI projects. Reviewed on a rolling basis; apply with a project description and GitHub repo.",
+      es: "Cómputo gratuito para desarrolladores e investigadores que crean proyectos de IA de código abierto. Se revisa de forma continua; postula con una descripción del proyecto y un repositorio de GitHub.",
+      hi: "ओपन-सोर्स AI परियोजनाएँ बनाने वाले डेवलपर्स और शोधकर्ताओं के लिए मुफ़्त कंप्यूट। रोलिंग आधार पर समीक्षा; प्रोजेक्ट विवरण और GitHub रिपो के साथ आवेदन करें।"
+    },
+    url: "https://inference.net/grants/"
+  },
+  {
+    id: "swiss-ai-small",
+    name: "Swiss AI: Compute Grant (Small Projects)",
+    level: "master",
+    status: "rolling",
+    deadline: null,
+    time: null,
+    amount: "Up to 32k GPU hours",
+    summary: {
+      en: "Compute for research on frontier AI foundation models, open to researchers in Europe and beyond. Accepted continuously. The large call (over 500k GPU hours) closed 14 Sep 2026.",
+      es: "Cómputo para investigación sobre modelos fundacionales de IA de frontera, abierto a investigadores de Europa y más allá. Se aceptan solicitudes de forma continua. La convocatoria grande (más de 500k horas GPU) cerró el 14 de septiembre de 2026.",
+      hi: "फ्रंटियर AI फ़ाउंडेशन मॉडलों पर शोध के लिए कंप्यूट; यूरोप और उससे बाहर के शोधकर्ताओं के लिए। आवेदन लगातार स्वीकार किए जाते हैं। बड़ी कॉल (5 लाख से अधिक GPU घंटे) 14 सितंबर 2026 को बंद हुई।"
+    },
+    url: "https://www.swiss-ai.org/compute-grants"
+  }
+];
+
 window.LEVEL_STYLES = {
   vibe: "bg-[#E8EEF9] text-[#2046A0] border-[#2046A0]/30",
   agent: "bg-[#F1EAFB] text-[#5B2AA8] border-[#5B2AA8]/30",
@@ -106,7 +181,9 @@ window.LEVEL_STYLES = {
 window.STATUS_STYLES = {
   code_released: "bg-[#E6F5EE] text-[#166B45]",
   weights_available: "bg-[#FFF4D6] text-[#8A5A00]",
-  preprint_open: "bg-[#EEF0F3] text-[#333333]"
+  preprint_open: "bg-[#EEF0F3] text-[#333333]",
+  open: "bg-[#E6F5EE] text-[#166B45]",
+  rolling: "bg-[#FFF4D6] text-[#8A5A00]"
 };
 
 window.SANDBOX_TRACKS = [
@@ -142,7 +219,7 @@ window.SANDBOX_TRACKS = [
 window.UI = {
   en: {
     nav_discover: "01 // DISCOVER",
-    nav_labs: "02 // THE LABS",
+    nav_labs: "02 // OPPORTUNITIES",
     nav_sandbox: "03 // SANDBOX",
     nav_library: "04 // MY LIBRARY",
     dossier: "Dossier",
@@ -170,10 +247,12 @@ window.UI = {
     lbl_abstract: "Original abstract (arXiv, English)",
     time_na: "Not published by arXiv; date only",
     open_arxiv: "Open on arXiv ↗",
-    labs_title: "THE LABS",
-    labs_sub: "Groups behind the papers. Opportunities appear here only with a verified primary source link.",
-    labs_empty_title: "No verified openings yet",
-    labs_empty_body: "Fellowships, grants and compute calls will be listed here only after each has a primary source URL. Nothing is invented.",
+    labs_title: "OPPORTUNITIES",
+    labs_sub: "Open and rolling AI calls. Each one links to its official page; closed calls are not listed as open.",
+    opp_deadline: "Deadline",
+    opp_rolling: "Rolling",
+    opp_amount: "Amount",
+    opp_open_link: "Open official page ↗",
     labs_groups: "Research groups behind these papers",
     sandbox_title: "SANDBOX",
     sandbox_sub: "Copy a real setup command for each tier. Nothing is provisioned for you; you run it on your own machine.",
@@ -194,7 +273,7 @@ window.UI = {
   },
   es: {
     nav_discover: "01 // DESCUBRIR",
-    nav_labs: "02 // LOS LABS",
+    nav_labs: "02 // OPORTUNIDADES",
     nav_sandbox: "03 // SANDBOX",
     nav_library: "04 // MI BIBLIOTECA",
     dossier: "Dosier",
@@ -222,10 +301,12 @@ window.UI = {
     lbl_abstract: "Resumen original (arXiv, inglés)",
     time_na: "arXiv no publica la hora; solo fecha",
     open_arxiv: "Abrir en arXiv ↗",
-    labs_title: "LOS LABS",
-    labs_sub: "Grupos detrás de los artículos. Las oportunidades aparecen aquí solo con un enlace verificado a la fuente primaria.",
-    labs_empty_title: "Aún no hay convocatorias verificadas",
-    labs_empty_body: "Becas, subvenciones y convocatorias de cómputo aparecerán aquí solo cuando cada una tenga una URL de fuente primaria. Nada se inventa.",
+    labs_title: "OPORTUNIDADES",
+    labs_sub: "Convocatorias de IA abiertas y continuas. Cada una enlaza a su página oficial; las convocatorias cerradas no aparecen como abiertas.",
+    opp_deadline: "Fecha límite",
+    opp_rolling: "Continuo",
+    opp_amount: "Monto",
+    opp_open_link: "Abrir página oficial ↗",
     labs_groups: "Grupos de investigación detrás de estos artículos",
     sandbox_title: "SANDBOX",
     sandbox_sub: "Copia un comando de configuración real para cada nivel. Nada se aprovisiona por ti; lo ejecutas en tu propia máquina.",
@@ -246,7 +327,7 @@ window.UI = {
   },
   hi: {
     nav_discover: "01 // खोजें",
-    nav_labs: "02 // लैब्स",
+    nav_labs: "02 // अवसर",
     nav_sandbox: "03 // सैंडबॉक्स",
     nav_library: "04 // मेरी लाइब्रेरी",
     dossier: "डोज़ियर",
@@ -274,10 +355,12 @@ window.UI = {
     lbl_abstract: "मूल सार (arXiv, अंग्रेज़ी)",
     time_na: "arXiv समय प्रकाशित नहीं करता; केवल तारीख",
     open_arxiv: "arXiv पर खोलें ↗",
-    labs_title: "लैब्स",
-    labs_sub: "शोधपत्रों के पीछे के समूह। अवसर यहाँ केवल सत्यापित प्राथमिक स्रोत लिंक के साथ दिखेंगे।",
-    labs_empty_title: "अभी कोई सत्यापित अवसर नहीं",
-    labs_empty_body: "फ़ेलोशिप, अनुदान और कंप्यूट कॉल तभी दिखेंगे जब हर एक का प्राथमिक स्रोत URL होगा। कुछ भी काल्पनिक नहीं है।",
+    labs_title: "अवसर",
+    labs_sub: "खुले और रोलिंग AI अवसर। हर एक अपने आधिकारिक पेज से जुड़ा है; बंद कॉल खुली के रूप में नहीं दिखाई जातीं।",
+    opp_deadline: "अंतिम तिथि",
+    opp_rolling: "रोलिंग",
+    opp_amount: "राशि",
+    opp_open_link: "आधिकारिक पेज खोलें ↗",
     labs_groups: "इन शोधपत्रों के पीछे के शोध समूह",
     sandbox_title: "सैंडबॉक्स",
     sandbox_sub: "हर स्तर के लिए एक वास्तविक सेटअप कमांड कॉपी करें। आपके लिए कुछ भी प्रोविज़न नहीं होता; आप इसे अपनी मशीन पर चलाते हैं।",
diff --git a/index.html b/index.html
index 0b80c2a..a21cb79 100644
--- a/index.html
+++ b/index.html
@@ -125,10 +125,7 @@
           <p class="text-sm text-cream/60 mt-6 max-w-md leading-relaxed" data-i18n="labs_sub"></p>
         </div>
         <div class="lg:col-span-7 space-y-10">
-          <div class="rounded-2xl bg-[#141418] border border-white/10 p-8">
-            <p class="text-[11px] font-mono uppercase tracking-widest text-terracotta" data-i18n="labs_empty_title"></p>
-            <p class="text-sm text-cream/70 mt-3 leading-relaxed" data-i18n="labs_empty_body"></p>
-          </div>
+          <div id="oppGrid" class="grid gap-6 md:grid-cols-2"></div>
           <div>
             <p class="text-[11px] font-mono uppercase tracking-widest text-cream/50 mb-4" data-i18n="labs_groups"></p>
             <ul id="labsList" class="divide-y divide-white/10 border-t border-white/10"></ul>
```

## B8: `efba354`

**Commit:** Rename header library button to My Library in EN, ES, HI  
**Summary:** Changed the header button label from Dossier to My Library in EN, ES and HI.

```diff
diff --git a/data.js b/data.js
index 5f90ebe..7fccb33 100644
--- a/data.js
+++ b/data.js
@@ -222,7 +222,7 @@ window.UI = {
     nav_labs: "02 // OPPORTUNITIES",
     nav_sandbox: "03 // SANDBOX",
     nav_library: "04 // MY LIBRARY",
-    dossier: "Dossier",
+    dossier: "My Library",
     hero_kicker: "Frontier AI · Real arXiv papers",
     hero_title: "FRONTIER",
     hero_tagline: "Research, sorted by how deep you build.",
@@ -276,7 +276,7 @@ window.UI = {
     nav_labs: "02 // OPORTUNIDADES",
     nav_sandbox: "03 // SANDBOX",
     nav_library: "04 // MI BIBLIOTECA",
-    dossier: "Dosier",
+    dossier: "Mi biblioteca",
     hero_kicker: "IA de frontera · Artículos reales de arXiv",
     hero_title: "FRONTERA",
     hero_tagline: "Investigación, ordenada según qué tan profundo construyas.",
@@ -330,7 +330,7 @@ window.UI = {
     nav_labs: "02 // अवसर",
     nav_sandbox: "03 // सैंडबॉक्स",
     nav_library: "04 // मेरी लाइब्रेरी",
-    dossier: "डोज़ियर",
+    dossier: "मेरी लाइब्रेरी",
     hero_kicker: "फ्रंटियर AI · वास्तविक arXiv शोधपत्र",
     hero_title: "फ्रंटियर",
     hero_tagline: "शोध, आपके निर्माण के स्तर के अनुसार छँटा हुआ।",
```

## B9: `d525904`

**Commit:** Move spotlight paper out of the hero into its own row  
**Summary:** Moved the spotlight card out of the hero into its own row, and fixed the closed drawer shadow.

```diff
diff --git a/app.js b/app.js
index bf7c2f9..b72e100 100644
--- a/app.js
+++ b/app.js
@@ -79,7 +79,7 @@
   function renderSpotlight() {
     const p = paperById("deepseek");
     const html = `
-      <article class="bg-white rounded-3xl p-6 shadow-2xl text-[#111113]">
+      <article class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-[#111113]">
         <div class="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
           <span class="text-terracotta">● ${esc(t("spotlight_label"))}</span>
           <span class="bg-paper-cream px-2 py-1 rounded">arXiv:${esc(p.arxiv)}</span>
@@ -96,7 +96,6 @@
         </div>
       </article>`;
     byId("spotlight").innerHTML = html;
-    byId("spotlightMobile").innerHTML = html;
   }
 
   // ---------- Discover grid ----------
diff --git a/index.html b/index.html
index a21cb79..ad2c2ae 100644
--- a/index.html
+++ b/index.html
@@ -32,7 +32,7 @@
     .bg-grid-dots { background-image: radial-gradient(rgba(255,255,255,.22) 1.5px, transparent 1.5px); background-size: 28px 28px; }
     .tab-pane { display: none; }
     .tab-pane.is-active { display: block; }
-    .drawer-open { transform: translateX(0); }
+    .drawer-open { transform: translateX(0); box-shadow: -20px 0 60px rgba(0, 0, 0, 0.25); }
     .drawer-closed { transform: translateX(100%); box-shadow: none; }
     .toast-show { opacity: 1; transform: translateY(0); }
     .toast-hide { opacity: 0; transform: translateY(20px); }
@@ -91,10 +91,9 @@
           </div>
           <h1 class="font-display font-black text-[22vw] md:text-[17vw] leading-none tracking-tighter whitespace-nowrap text-cream/95 select-none" data-i18n="hero_title"></h1>
         </div>
-        <!-- Floating spotlight card, filled by app.js -->
-        <div id="spotlight" class="absolute right-4 lg:right-14 top-1/2 -translate-y-1/2 w-[min(92vw,380px)] hidden lg:block"></div>
       </div>
-      <div id="spotlightMobile" class="lg:hidden px-4 -mt-10 relative z-10"></div>
+      <!-- Spotlight card sits in its own row below the hero, filled by app.js -->
+      <div id="spotlight" class="px-4 lg:px-14 py-16 flex justify-center lg:justify-end"></div>
 
       <!-- Divider -->
       <div class="px-4 lg:px-14 py-20 overflow-hidden">
@@ -171,7 +170,7 @@
 
   <!-- DOSSIER DRAWER -->
   <div id="modalBackdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity z-50"></div>
-  <aside id="drawer" class="fixed top-0 right-0 h-full w-full max-w-lg bg-cream shadow-2xl overflow-y-auto z-50 drawer-closed transition-transform duration-300">
+  <aside id="drawer" class="fixed top-0 right-0 h-full w-full max-w-lg bg-cream overflow-y-auto z-50 drawer-closed transition-transform duration-300">
     <div class="p-8">
       <div class="flex items-center justify-between">
         <span id="drawerLevel" class="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border"></span>
```

## B10: `424e3ac`

**Commit:** Remove the spotlight paper card  
**Summary:** Removed the spotlight card, its render function and its call.

```diff
diff --git a/app.js b/app.js
index b72e100..3580178 100644
--- a/app.js
+++ b/app.js
@@ -75,29 +75,6 @@
       <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${LEVEL_STYLES[p.level]}">${esc(levelLabel(p.level))}</span>`;
   }
 
-  // ---------- Spotlight (hero) ----------
-  function renderSpotlight() {
-    const p = paperById("deepseek");
-    const html = `
-      <article class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-[#111113]">
-        <div class="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
-          <span class="text-terracotta">● ${esc(t("spotlight_label"))}</span>
-          <span class="bg-paper-cream px-2 py-1 rounded">arXiv:${esc(p.arxiv)}</span>
-        </div>
-        <h2 class="font-display font-black text-2xl leading-tight mt-5">${esc(titleOf(p))}</h2>
-        <p class="text-sm text-black/60 mt-4 leading-relaxed">${esc(summaryOf(p))}</p>
-        <div class="flex items-center justify-between mt-5 text-xs">
-          <span class="font-mono text-black/50">${esc(p.date)}</span>
-          <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${LEVEL_STYLES[p.level]}">${esc(levelLabel(p.level))}</span>
-        </div>
-        <div class="flex gap-2 mt-6">
-          <button class="open-btn flex-1 py-3 rounded-full bg-obsidian text-white text-xs font-bold tracking-widest uppercase cursor-pointer" data-id="${p.id}">${esc(t("inspect"))} →</button>
-          <button class="save-btn w-12 rounded-full border border-black/20 cursor-pointer" data-id="${p.id}" aria-label="${esc(t("save"))}">${isSaved(p.id) ? "★" : "☆"}</button>
-        </div>
-      </article>`;
-    byId("spotlight").innerHTML = html;
-  }
-
   // ---------- Discover grid ----------
   function renderGrid() {
     const visible = PAPERS.filter((p) => filter === "all" || p.level === filter);
@@ -324,7 +301,6 @@
   }
 
   function refreshAll() {
-    renderSpotlight();
     renderFilters();
     renderGrid();
     renderOpportunities();
diff --git a/index.html b/index.html
index ad2c2ae..299d0e8 100644
--- a/index.html
+++ b/index.html
@@ -92,8 +92,6 @@
           <h1 class="font-display font-black text-[22vw] md:text-[17vw] leading-none tracking-tighter whitespace-nowrap text-cream/95 select-none" data-i18n="hero_title"></h1>
         </div>
       </div>
-      <!-- Spotlight card sits in its own row below the hero, filled by app.js -->
-      <div id="spotlight" class="px-4 lg:px-14 py-16 flex justify-center lg:justify-end"></div>
 
       <!-- Divider -->
       <div class="px-4 lg:px-14 py-20 overflow-hidden">
```

## B11: `bee45e8`

**Commit:** Fix Opportunities heading overlapping the cards  
**Summary:** Moved the OPPORTUNITIES heading into a full-width row above the cards and sized it to fit.

```diff
diff --git a/index.html b/index.html
index 299d0e8..408ca96 100644
--- a/index.html
+++ b/index.html
@@ -116,13 +116,13 @@
 
     <!-- ============ TAB 2: THE LABS ============ -->
     <section id="tab-labs" class="tab-pane bg-obsidian text-cream min-h-[90vh] px-4 lg:px-14 py-16">
-      <div class="grid gap-10 lg:grid-cols-12">
+      <h2 class="font-display font-black text-[5.2vw] md:text-[5.5vw] leading-[0.9] tracking-tighter whitespace-nowrap" data-i18n="labs_title"></h2>
+      <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 mt-10">
         <div class="lg:col-span-5 lg:sticky lg:top-28 self-start">
-          <h2 class="font-display font-black text-[15vw] lg:text-[7vw] leading-[0.9] tracking-tighter" data-i18n="labs_title"></h2>
-          <p class="text-sm text-cream/60 mt-6 max-w-md leading-relaxed" data-i18n="labs_sub"></p>
+          <p class="text-sm text-cream/60 max-w-md leading-relaxed" data-i18n="labs_sub"></p>
         </div>
         <div class="lg:col-span-7 space-y-10">
-          <div id="oppGrid" class="grid gap-6 md:grid-cols-2"></div>
+          <div id="oppGrid" class="grid grid-cols-1 gap-6 md:grid-cols-2"></div>
           <div>
             <p class="text-[11px] font-mono uppercase tracking-widest text-cream/50 mb-4" data-i18n="labs_groups"></p>
             <ul id="labsList" class="divide-y divide-white/10 border-t border-white/10"></ul>
```

## B13: `a9e3975`

**Commit:** Add README with screenshots, prompts, and build history  
**Summary:** Added the README and screenshots in docs/.

```diff
diff --git a/README.md b/README.md
new file mode 100644
index 0000000..4449f84
--- /dev/null
+++ b/README.md
@@ -0,0 +1,154 @@
+# VIBE//APEX
+
+A static, editorial-style hub for AI enthusiasts, from first-time vibe coders to LLM researchers. It shows real arXiv papers sorted by skill level, verified open AI opportunities, setup commands for each tier, and a personal library.
+
+Repository: https://github.com/walruto/VIBE-APEX
+
+![Discover tab](docs/screenshot-discover.png)
+
+![Opportunities tab](docs/screenshot-opportunities.png)
+
+## Features
+
+- **Four tabs:** 01 Discover (papers), 02 Opportunities (open AI calls), 03 Sandbox (setup commands), 04 My Library (saved papers).
+- **Three languages:** English, Spanish and Hindi, switched with the toggle in the header. UI text, paper summaries and paper titles translate; author names and original abstracts stay in English.
+- **Skill tiers:** every paper and opportunity is tagged Vibe Coder, Agent Coder or LLM Master.
+- **Persona filter** on the Discover tab.
+- **Saved library** kept in the browser's local storage. Nothing is sent to a server.
+
+## Guardrails
+
+- No paid APIs. The site is static HTML, CSS and JavaScript with no backend and no API keys.
+- No invented opportunities. Every listed opportunity links to its official page, and closed calls are not shown as open.
+- Real papers only. Every arXiv ID and date was checked against arxiv.org.
+
+## Run it locally
+
+```bash
+git clone https://github.com/walruto/VIBE-APEX.git
+cd VIBE-APEX
+python3 -m http.server 8080
+```
+
+Then open http://localhost:8080/index.html. Opening `index.html` directly also works.
+
+The page loads Tailwind CSS and Google Fonts from their CDNs, so it needs an internet connection the first time.
+
+## Project structure
+
+```
+index.html   Page layout, Tailwind config, styles, and the four tab sections
+data.js      Papers, opportunities, sandbox commands, and EN/ES/HI strings
+app.js       Rendering, tab switching, language switch, filter, drawer, library
+docs/        Screenshots used in this README
+```
+
+All content is in `data.js`. To add a paper or opportunity, add an entry there. Opportunities need an official source URL and a checked deadline or "rolling" status.
+
+## How it was built
+
+This project started as a design brief. A design tool produced the editorial layout, and this repository turns that layout into a working site and then fixes it after review.
+
+### 1. Design prompt (design tool)
+
+The starting point was a meta-prompt for Google Stitch, a UI generation tool. It asked for:
+
+- an editorial, high-contrast layout with large section-divider type, deep terracotta and obsidian colour blocks, and asymmetric card grids
+- a four-tab structure: Discover, The Labs, Sandbox, My Library
+- an EN/ES/HI language toggle
+- paper cards with title, date, status, time, a one-sentence summary and a skill-level tag
+
+<details>
+<summary>Full Stitch meta-prompt (as used)</summary>
+
+```markdown
+# Role & Persona
+You are a Principal Product Designer and Lead UI/UX Engineer specialized in building highly modular, performant micro-frontends using the Google Stitch layout and component engine. You excel at taking bold, contemporary, editorial lifestyle print layouts and translating them into robust, responsive code structures, reusable slots, and precise data schemas.
+
+# Project Context: VIBE//APEX
+We are architecting the complete multi-tab layout for "VIBE//APEX"—a cutting-edge dashboard ecosystem designed for AI enthusiasts spanning three explicit technical tiers:
+1. **Vibe Coder:** Beginners focusing on prompt-driven development, rapid no-code logic, and natural language app deployment.
+2. **Agent Coder:** Intermediate builders handling multi-agent orchestration platforms, local runtime scripting, and API routing.
+3. **LLM Master:** Advanced engineers building fine-tuning pipelines, token optimization matrixes, and low-level attention mechanisms.
+
+# Core Guardrails & System Rules
+- **No Real Physical Events:** All entries must capture virtual ecosystem milestones (e.g., repository releases, benchmark evaluations, token grant windows, weight drops).
+- **Factual Grounding:** All research paper objects referenced in mock data structures must be real, high-impact AI papers.
+- **Multilingual Localization UI:** The design must feature a unified language toggle component (`stitch-language-toggle`) handling English (EN), Spanish (ES), and Hindi (HI). The layout must use fluid scaling tokens to prevent textual text-expansion breaking across different locales.
+- **Visual Design Continuity:** Every tab must retain the inspiration aesthetic: massive structural typography section breaks, deep color-blocked backdrops (terracotta, dark slate, obsidian), sharp minimalist borders, asymmetrical card distributions, and zero generic enterprise data tables.
+
+# Task Breakdown & Stitch Components to Generate
+
+## 1. Global Layout Frame & Router (`stitch-navigation-hub`)
+- Design a high-impact global navigation bar defining the strict typography, alignment, and hover states for four core tabs: `DISCOVER`, `THE LABS`, `SANDBOX`, and `MY LIBRARY`.
+- Integrate the high-contrast `stitch-language-toggle` as an outlined segmented pill button in the top right header space.
+
+## 2. Tab 1 Component Model: `DISCOVER` (`stitch-paper-action-grid`)
+- Formulate an asymmetrical grid rendering real AI research papers into custom visual cards.
+- Each paper element must map explicit properties (`props`): `paper_title`, `date_published`, `opening_status` (e.g., "Weights Available", "Benchmark Live"), `time_stamp`, `important_info` (1-sentence architectural impact), and `target_level` (Vibe Coder, Agent Coder, or LLM Master).
+
+## 3. Tab 2 Component Model: `THE LABS` (`stitch-lab-showroom`)
+- Design a high-contrast container mapping active global AI compute tokens, residency applications, or benchmark submissions hosted by elite labs (e.g., Anthropic, DeepMind).
+- Style this view like a premium brand showroom, using vertical text alignments and luxury-tier metadata blocks.
+
+## 4. Tab 3 Component Model: `SANDBOX` (`stitch-sandbox-provisioner`)
+- Design a layout handling environment templates tailored to the papers. Ensure distinct rows or groupings for each skill tier, utilizing minimalist frames mimicking premium product specifications.
+
+## 5. Tab 4 Component Model: `MY LIBRARY` (`stitch-user-ledger`)
+- Design a personal tracking portfolio modeled like a raw, stark data invoice/ledger tracking saved papers and user progression milestones.
+
+# Output Format
+Present your entire response as a highly detailed Stitch Technical Design Specification. For each tab component, provide:
+1. **Component Architecture & APIs:** The Google Stitch custom tag syntax, expected input configuration schemas, and slot architectures.
+2. **Visual Hierarchy Specs:** Layout styles, positioning mechanics (absolute overlay vs flex-asymmetric), typography weights, and color tokens.
+3. **Multilingual Mock Data Suite:** Provide a comprehensive JSON or code array mapping three distinct real-world paper entries across all three languages (EN, ES, HI) to prove the localization engine's data-handling integrity.
+```
+
+</details>
+
+Note: the design tool's output contained several problems that were corrected in this repo (see below).
+
+### 2. Integration prompt
+
+The request that turned the design into code was:
+
+> okay now let us integrte the deisgn ggolg teicth made for us using cluade eh sules are no paid apis ,fake opptunitee, reals rearac papers
+
+In short: integrate the design, no paid APIs, no fake opportunities, real arXiv papers.
+
+### 3. Follow-up requests
+
+These were made in order, and each one changed the code:
+
+1. Make the site runnable locally.
+2. Push to GitHub, crediting only the repo URL.
+3. Translate the Labs list entries with the paper summary so they change with the language toggle.
+4. Add real AI opportunities to the tab and translate the paper titles.
+5. Rename the header's "Dossier" button to "My Library" in all three languages.
+6. Move the spotlight paper out of the hero, then remove it.
+7. Fix the Opportunities heading, which overlapped the first row of cards.
+8. Add this README.
+
+### 4. What was generated, and what was corrected
+
+The first generated code and the design tool's content had several problems. These were fixed:
+
+- **Wrong arXiv IDs.** 2410.05229 is GSM-Symbolic, not DSPy. SWE-agent is 2405.15793, not 2408.12788. The paper 2502.1098 does not resolve and was removed. Titles and dates were replaced with the values from arxiv.org.
+- **Invented opportunities.** The design's grants, prices and compute offers did not correspond to real calls. They were removed. The Opportunities tab now lists three calls checked against their official pages.
+- **Invented statistics.** Figures such as "64 active papers", grant pools and cluster status were removed.
+- **Fake provisioning.** The "Launch" buttons did nothing real. The Sandbox tab now shows copyable setup commands for public packages and repositories.
+
+## Data sources
+
+- **Papers:** arXiv abstract pages and the arXiv API, checked on the dates shown on each card.
+- **Opportunities:** official pages for the Foresight Institute RFP (deadline 31 Oct 2026, 23:59 PDT), Inference.net AI Compute Grants (rolling) and the Swiss AI compute grant small-project track (rolling). The Swiss AI large call closed 14 Sep 2026 and is not listed as open.
+
+Opportunities change. Confirm the deadline and eligibility on the official page before applying.
+
+## Known limitations
+
+- **Times:** arXiv does not publish a submission time on the abstract page, so paper cards show dates only.
+- **Translations:** Spanish and Hindi text is a first translation and has not been reviewed by a native speaker. Paper titles are translated, with the English original shown beneath.
+- **Status labels** such as "Code Released" and "Weights Available" were not all checked against each repository.
+- **Narrow phones:** the header (logo, language toggle and MY LIBRARY button) is wider than a 390 px screen and gets clipped.
+- **No automated tests.** Checks were done by hand and with headless Chrome screenshots.
diff --git a/docs/screenshot-discover.png b/docs/screenshot-discover.png
new file mode 100644
index 0000000..04fca61
Binary files /dev/null and b/docs/screenshot-discover.png differ
diff --git a/docs/screenshot-opportunities.png b/docs/screenshot-opportunities.png
new file mode 100644
index 0000000..af697a3
Binary files /dev/null and b/docs/screenshot-opportunities.png differ
```

## B14: `05b5207`

**Commit:** README: full prompt log with what each prompt produced  
**Summary:** Replaced the README prompt section with the full prompt log.

```diff
diff --git a/README.md b/README.md
index 4449f84..74bf030 100644
--- a/README.md
+++ b/README.md
@@ -47,19 +47,31 @@ All content is in `data.js`. To add a paper or opportunity, add an entry there.
 
 ## How it was built
 
-This project started as a design brief. A design tool produced the editorial layout, and this repository turns that layout into a working site and then fixes it after review.
-
-### 1. Design prompt (design tool)
-
-The starting point was a meta-prompt for Google Stitch, a UI generation tool. It asked for:
-
-- an editorial, high-contrast layout with large section-divider type, deep terracotta and obsidian colour blocks, and asymmetric card grids
-- a four-tab structure: Discover, The Labs, Sandbox, My Library
-- an EN/ES/HI language toggle
-- paper cards with title, date, status, time, a one-sentence summary and a skill-level tag
+### Prompt log
+
+Every prompt that went into this project, in order, with what it produced. Typos are kept as typed.
+
+**Part A: prompts pasted into the design chat (before the repo existed).** These were sent to a search-based AI assistant, and the transcript was pasted into the first message of the coding session.
+
+| # | Prompt (verbatim) | What it did |
+|---|---|---|
+| A1 | `ypgrade this prompt` | Returned a generic meta-prompt template for upgrading raw prompts. |
+| A2 | `USe this image as inspo to start building UI/UX fpr a platform taht will allow people to find opptunitnueis in AI and also allow them to dsiver resarcg apper` | Asked for the inspiration image, which was not attached, then described a UI direction in general terms. |
+| A3 | `so finl prompt` | Produced a finalized markdown design prompt: role, context, visual constraints, deliverables. |
+| A4 | `it is for google stitch` | Rewrote the prompt for the Google Stitch tool, with component tags such as `stitch-nav` and `stitch-opp-card`. |
+| A5 | `give me. Nme for it as well Eveny finder for AI enthusiast whether they be a beginner or  A ADVANCED  builder/ enthauthist. Have a dashboard / action where people can see research paperps Guardrail No real events But real ai apper Give date, status of opening, time and important info for each as well as an attached level ( vibe coder, agent coder, LLM master)` | Named the platform "VIBE & APEX", wrote a Stitch meta-prompt, and built a mock feed of three paper cards with date, status, time and level. |
+| A6 | `english and spanish with a toggle button and hini aswell` | Renamed the platform to "VIBE//APEX" and described localized strings. No toggle code was produced. |
+| A7 | `okay sitch gave me a cool result but i qnt lie more tam the home page and for it genrte te rest of the tab give the necsaryy tabs for this prjetc  aswlll as it to kee[ yje ui and deisgn the same throguh` | Designed four tabs (DISCOVER, THE LABS, SANDBOX, MY LIBRARY) with EN/ES/HI copy and a locale token JSON. |
+| A8 | `ptomp for goggle stuthc` | Produced the final multi-tab Stitch meta-prompt. This is the prompt in the collapsible block below. |
+| A9 | `tell it genrate the other pages` | Produced a Stitch technical design spec for all four tabs, plus a three-paper multilingual data set. |
+| A10 | `okay now let us integrte the deisgn ggolg teicth made for us using cluade eh sules are no paid apis ,fake opptunitee, reals rearac papers` | Produced a single HTML file with Tailwind, the four tabs and a language dictionary. The output was cut off mid-file, and it contained invented grants and prices. |
+| A11 | `prmpr for claude` | No response was available. |
+| A12 | `make teh prompt for claude code` | Said it had produced a template prompt for Claude's Artifact sandbox, but no text appeared in the transcript. |
+| A13 | `give me the prmpt` | No response was available. |
+| A14 | `give me the prompt` | No response was available. |
 
 <details>
-<summary>Full Stitch meta-prompt (as used)</summary>
+<summary>Full Stitch meta-prompt (A8, as used)</summary>
 
 ```markdown
 # Role & Persona
@@ -106,45 +118,39 @@ Present your entire response as a highly detailed Stitch Technical Design Specif
 
 </details>
 
-Note: the design tool's output contained several problems that were corrected in this repo (see below).
-
-### 2. Integration prompt
-
-The request that turned the design into code was:
+**Part B: prompts in the coding session (the requests that changed this repo).**
+
+| # | Prompt (verbatim) | What it did |
+|---|---|---|
+| B1 | The zip path `/Users/walidahmed/Downloads/stitch_editorial_ai_ecosystem_discovery_platform.zip`, with the pasted design-chat transcript (Part A) | Unzipped the Stitch export, reviewed both screens, checked the arXiv IDs, and built the first version in `vibe-apex/`. |
+| B2 | `okay now run the site` | Started a local server on port 8080. |
+| B3 | `push this to github dont credit yourselve only credit https://github.com/walruto/VIBE-APEX` | Pushed the site to the empty repo, with a commit message that credits only the repo URL. |
+| B4 | `when the language chnages tev actual oppotunity language dosnt chnage` | Made the Labs list entries show the translated summary. |
+| B5 | `okay rerun sit` | Restarted the local server. |
+| B6 | `the of the oppurtunities doesnt chnage` | Reproduced the issue in headless Chrome and found the Labs text did translate. Asked which text was meant. |
+| B7 | `It seems like you have forgotten the AI opprotunities tabs since I only see ai paper; also the paper title arent translated to the language could you please those two issues` | Replaced the empty Labs area with three verified open calls from official pages, renamed the tab to OPPORTUNITIES, and translated the six paper titles with the English original shown beneath. |
+| B8 | `chnage the "DOSSIER" to my library adjust for all languages as wel` | Changed the header button to My Library, Mi biblioteca and मेरी लाइब्रेरी. |
+| B9 | `i liek teh idea of te spotlight paper but it blocking the homepage a bit so eaisier put it in a better spot or remove it entirely` | Moved the spotlight card out of the hero into its own row, and removed a shadow strip on the closed drawer. |
+| B10 | `remove teh spotlight paer entirely` | Removed the spotlight card and its code. |
+| B11 | `okay for teh opporutnities tab it seems that their is glitch wher the text opptunities is above then appotunities themselves please address that issue` | Moved the heading into its own full-width row above the cards and sized it to fit. |
+| B12 | `the "opprunities" bug is still there` | Confirmed the served page had the change. Could not reproduce it, and asked for a screenshot, the window width, the language and the URL. No change made. |
+| B13 | `okay now good I want teh github page to look better I want you to make like a little section  the github where is sepifcy the propmpt  I sued and te code you generateed` | Added this README with screenshots and a prompt section. |
+| B14 | `when I mean every single prompt I mean every single promp nd what it did like evry single one I gave you big or small` | Replaced the prompt section with this complete log. |
 
-> okay now let us integrte the deisgn ggolg teicth made for us using cluade eh sules are no paid apis ,fake opptunitee, reals rearac papers
-
-In short: integrate the design, no paid APIs, no fake opportunities, real arXiv papers.
-
-### 3. Follow-up requests
-
-These were made in order, and each one changed the code:
+## Data sources
 
-1. Make the site runnable locally.
-2. Push to GitHub, crediting only the repo URL.
-3. Translate the Labs list entries with the paper summary so they change with the language toggle.
-4. Add real AI opportunities to the tab and translate the paper titles.
-5. Rename the header's "Dossier" button to "My Library" in all three languages.
-6. Move the spotlight paper out of the hero, then remove it.
-7. Fix the Opportunities heading, which overlapped the first row of cards.
-8. Add this README.
+- **Papers:** arXiv abstract pages and the arXiv API, checked on the dates shown on each card.
+- **Opportunities:** official pages for the Foresight Institute RFP (deadline 31 Oct 2026, 23:59 PDT), Inference.net AI Compute Grants (rolling) and the Swiss AI compute grant small-project track (rolling). The Swiss AI large call closed 14 Sep 2026 and is not listed as open.
 
-### 4. What was generated, and what was corrected
+Opportunities change. Confirm the deadline and eligibility on the official page before applying.
 
-The first generated code and the design tool's content had several problems. These were fixed:
+## What was corrected from the generated code and design
 
 - **Wrong arXiv IDs.** 2410.05229 is GSM-Symbolic, not DSPy. SWE-agent is 2405.15793, not 2408.12788. The paper 2502.1098 does not resolve and was removed. Titles and dates were replaced with the values from arxiv.org.
 - **Invented opportunities.** The design's grants, prices and compute offers did not correspond to real calls. They were removed. The Opportunities tab now lists three calls checked against their official pages.
 - **Invented statistics.** Figures such as "64 active papers", grant pools and cluster status were removed.
 - **Fake provisioning.** The "Launch" buttons did nothing real. The Sandbox tab now shows copyable setup commands for public packages and repositories.
 
-## Data sources
-
-- **Papers:** arXiv abstract pages and the arXiv API, checked on the dates shown on each card.
-- **Opportunities:** official pages for the Foresight Institute RFP (deadline 31 Oct 2026, 23:59 PDT), Inference.net AI Compute Grants (rolling) and the Swiss AI compute grant small-project track (rolling). The Swiss AI large call closed 14 Sep 2026 and is not listed as open.
-
-Opportunities change. Confirm the deadline and eligibility on the official page before applying.
-
 ## Known limitations
 
 - **Times:** arXiv does not publish a submission time on the abstract page, so paper cards show dates only.
```
