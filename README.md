# VIBE//APEX

A static, editorial-style hub for AI enthusiasts, from first-time vibe coders to LLM researchers. It shows real arXiv papers sorted by skill level, verified open AI opportunities, setup commands for each tier, and a personal library.

Repository: https://github.com/walruto/VIBE-APEX

![Discover tab](docs/screenshot-discover.png)

![Opportunities tab](docs/screenshot-opportunities.png)

## Features

- **Four tabs:** 01 Discover (papers), 02 Opportunities (open AI calls), 03 Sandbox (setup commands), 04 My Library (saved papers).
- **Three languages:** English, Spanish and Hindi, switched with the toggle in the header. UI text, paper summaries and paper titles translate; author names and original abstracts stay in English.
- **Skill tiers:** every paper and opportunity is tagged Vibe Coder, Agent Coder or LLM Master.
- **Persona filter** on the Discover tab.
- **Saved library** kept in the browser's local storage. Nothing is sent to a server.

## Guardrails

- No paid APIs. The site is static HTML, CSS and JavaScript with no backend and no API keys.
- No invented opportunities. Every listed opportunity links to its official page, and closed calls are not shown as open.
- Real papers only. Every arXiv ID and date was checked against arxiv.org.

## Run it locally

```bash
git clone https://github.com/walruto/VIBE-APEX.git
cd VIBE-APEX
python3 -m http.server 8080
```

Then open http://localhost:8080/index.html. Opening `index.html` directly also works.

The page loads Tailwind CSS and Google Fonts from their CDNs, so it needs an internet connection the first time.

## Project structure

```
index.html   The whole site: page layout, Tailwind config, styles, the four tab
             sections, the papers/opportunities/sandbox/strings data, and the
             rendering script
docs/        Screenshots and the code-change log used in this README
```

The site is one self-contained HTML file. All content is in the inline data block at the top of the script, near the start of the `<script>` tag before the rendering code. To add a paper or opportunity, add an entry there. Opportunities need an official source URL and a checked deadline or "rolling" status.

## How it was built

### Prompt log

Every prompt that went into this project, in order, with what it produced. Typos are kept as typed.

**Part A: prompts pasted into the design chat (before the repo existed).** These were sent to a search-based AI assistant, and the transcript was pasted into the first message of the coding session.

| # | Prompt (verbatim) | What it did | Code generated |
|---|---|---|---|
| A1 | `ypgrade this prompt` | Returned a generic meta-prompt template for upgrading raw prompts. | None (text reply) |
| A2 | `USe this image as inspo to start building UI/UX fpr a platform taht will allow people to find opptunitnueis in AI and also allow them to dsiver resarcg apper` | Asked for the inspiration image, which was not attached, then described a UI direction in general terms. | None (text reply) |
| A3 | `so finl prompt` | Produced a finalized markdown design prompt: role, context, visual constraints, deliverables. | None (text reply) |
| A4 | `it is for google stitch` | Rewrote the prompt for the Google Stitch tool, with component tags such as `stitch-nav` and `stitch-opp-card`. | None (text reply) |
| A5 | `give me. Nme for it as well Eveny finder for AI enthusiast whether they be a beginner or  A ADVANCED  builder/ enthauthist. Have a dashboard / action where people can see research paperps Guardrail No real events But real ai apper Give date, status of opening, time and important info for each as well as an attached level ( vibe coder, agent coder, LLM master)` | Named the platform "VIBE & APEX", wrote a Stitch meta-prompt, and built a mock feed of three paper cards with date, status, time and level. | None (text reply) |
| A6 | `english and spanish with a toggle button and hini aswell` | Renamed the platform to "VIBE//APEX" and described localized strings. No toggle code was produced. | None (text reply) |
| A7 | `okay sitch gave me a cool result but i qnt lie more tam the home page and for it genrte te rest of the tab give the necsaryy tabs for this prjetc  aswlll as it to kee[ yje ui and deisgn the same throguh` | Designed four tabs (DISCOVER, THE LABS, SANDBOX, MY LIBRARY) with EN/ES/HI copy and a locale token JSON. | None (text reply) |
| A8 | `ptomp for goggle stuthc` | Produced the final multi-tab Stitch meta-prompt. This is the prompt in the collapsible block below. | None (prompt text only) |
| A9 | `tell it genrate the other pages` | Produced a Stitch technical design spec for all four tabs, plus a three-paper multilingual data set. | None (spec text) |
| A10 | `okay now let us integrte the deisgn ggolg teicth made for us using cluade eh sules are no paid apis ,fake opptunitee, reals rearac papers` | Produced a single HTML file with Tailwind, the four tabs and a language dictionary. The output was cut off mid-file, and it contained invented grants and prices. | Full single-file HTML, in the transcript only (cut off mid-file; not in the repo) |
| A11 | `prmpr for claude` | No response was available. | None (no response) |
| A12 | `make teh prompt for claude code` | Said it had produced a template prompt for Claude's Artifact sandbox, but no text appeared in the transcript. | None (no response) |
| A13 | `give me the prmpt` | No response was available. | None (no response) |
| A14 | `give me the prompt` | No response was available. | None (no response) |

<details>
<summary>Full Stitch meta-prompt (A8, as used)</summary>

```markdown
# Role & Persona
You are a Principal Product Designer and Lead UI/UX Engineer specialized in building highly modular, performant micro-frontends using the Google Stitch layout and component engine. You excel at taking bold, contemporary, editorial lifestyle print layouts and translating them into robust, responsive code structures, reusable slots, and precise data schemas.

# Project Context: VIBE//APEX
We are architecting the complete multi-tab layout for "VIBE//APEX"—a cutting-edge dashboard ecosystem designed for AI enthusiasts spanning three explicit technical tiers:
1. **Vibe Coder:** Beginners focusing on prompt-driven development, rapid no-code logic, and natural language app deployment.
2. **Agent Coder:** Intermediate builders handling multi-agent orchestration platforms, local runtime scripting, and API routing.
3. **LLM Master:** Advanced engineers building fine-tuning pipelines, token optimization matrixes, and low-level attention mechanisms.

# Core Guardrails & System Rules
- **No Real Physical Events:** All entries must capture virtual ecosystem milestones (e.g., repository releases, benchmark evaluations, token grant windows, weight drops).
- **Factual Grounding:** All research paper objects referenced in mock data structures must be real, high-impact AI papers.
- **Multilingual Localization UI:** The design must feature a unified language toggle component (`stitch-language-toggle`) handling English (EN), Spanish (ES), and Hindi (HI). The layout must use fluid scaling tokens to prevent textual text-expansion breaking across different locales.
- **Visual Design Continuity:** Every tab must retain the inspiration aesthetic: massive structural typography section breaks, deep color-blocked backdrops (terracotta, dark slate, obsidian), sharp minimalist borders, asymmetrical card distributions, and zero generic enterprise data tables.

# Task Breakdown & Stitch Components to Generate

## 1. Global Layout Frame & Router (`stitch-navigation-hub`)
- Design a high-impact global navigation bar defining the strict typography, alignment, and hover states for four core tabs: `DISCOVER`, `THE LABS`, `SANDBOX`, and `MY LIBRARY`.
- Integrate the high-contrast `stitch-language-toggle` as an outlined segmented pill button in the top right header space.

## 2. Tab 1 Component Model: `DISCOVER` (`stitch-paper-action-grid`)
- Formulate an asymmetrical grid rendering real AI research papers into custom visual cards.
- Each paper element must map explicit properties (`props`): `paper_title`, `date_published`, `opening_status` (e.g., "Weights Available", "Benchmark Live"), `time_stamp`, `important_info` (1-sentence architectural impact), and `target_level` (Vibe Coder, Agent Coder, or LLM Master).

## 3. Tab 2 Component Model: `THE LABS` (`stitch-lab-showroom`)
- Design a high-contrast container mapping active global AI compute tokens, residency applications, or benchmark submissions hosted by elite labs (e.g., Anthropic, DeepMind).
- Style this view like a premium brand showroom, using vertical text alignments and luxury-tier metadata blocks.

## 4. Tab 3 Component Model: `SANDBOX` (`stitch-sandbox-provisioner`)
- Design a layout handling environment templates tailored to the papers. Ensure distinct rows or groupings for each skill tier, utilizing minimalist frames mimicking premium product specifications.

## 5. Tab 4 Component Model: `MY LIBRARY` (`stitch-user-ledger`)
- Design a personal tracking portfolio modeled like a raw, stark data invoice/ledger tracking saved papers and user progression milestones.

# Output Format
Present your entire response as a highly detailed Stitch Technical Design Specification. For each tab component, provide:
1. **Component Architecture & APIs:** The Google Stitch custom tag syntax, expected input configuration schemas, and slot architectures.
2. **Visual Hierarchy Specs:** Layout styles, positioning mechanics (absolute overlay vs flex-asymmetric), typography weights, and color tokens.
3. **Multilingual Mock Data Suite:** Provide a comprehensive JSON or code array mapping three distinct real-world paper entries across all three languages (EN, ES, HI) to prove the localization engine's data-handling integrity.
```

</details>

**Part B: prompts in the coding session (the requests that changed this repo).**

| # | Prompt (verbatim) | What it did | Code generated |
|---|---|---|---|
| B1 | The zip path `/Users/walidahmed/Downloads/stitch_editorial_ai_ecosystem_discovery_platform.zip`, with the pasted design-chat transcript (Part A) | Unzipped the Stitch export, reviewed both screens, checked the arXiv IDs, and built the first version in `vibe-apex/`. | `window.PAPERS = [`<br>`window.UI = {`<br>`function renderGrid() {` |
| B2 | `okay now run the site` | Started a local server on port 8080. | None (server only) |
| B3 | `push this to github dont credit yourselve only credit https://github.com/walruto/VIBE-APEX` | Pushed the site to the empty repo, with a commit message that credits only the repo URL. | Same commit as B1 (`c516907`) |
| B4 | `when the language chnages tev actual oppotunity language dosnt chnage` | Made the Labs list entries show the translated summary. | `<p class="text-sm text-cream/80 mt-2 leading-relaxed">${esc(summaryOf(p))}</p>` |
| B5 | `okay rerun sit` | Restarted the local server. | None (server restart) |
| B6 | `the of the oppurtunities doesnt chnage` | Reproduced the issue in headless Chrome and found the Labs text did translate. Asked which text was meant. | None (investigation only) |
| B7 | `It seems like you have forgotten the AI opprotunities tabs since I only see ai paper; also the paper title arent translated to the language could you please those two issues` | Replaced the empty Labs area with three verified open calls from official pages, renamed the tab to OPPORTUNITIES, and translated the six paper titles with the English original shown beneath. | `window.OPPORTUNITIES = [`<br>`function renderOpportunities() {`<br>`labs_title: "OPPORTUNITIES",` |
| B8 | `chnage the "DOSSIER" to my library adjust for all languages as wel` | Changed the header button to My Library, Mi biblioteca and मेरी लाइब्रेरी. | `dossier: "My Library",`<br>`dossier: "Mi biblioteca",`<br>`dossier: "मेरी लाइब्रेरी",` |
| B9 | `i liek teh idea of te spotlight paper but it blocking the homepage a bit so eaisier put it in a better spot or remove it entirely` | Moved the spotlight card out of the hero into its own row, and removed a shadow strip on the closed drawer. | `.drawer-open { transform: translateX(0); box-shadow: -20px 0 60px rgba(0, 0, 0, 0.25); }`<br>`<div id="spotlight" class="px-4 lg:px-14 py-16 flex justify-center lg:justify-end"></div>` |
| B10 | `remove teh spotlight paer entirely` | Removed the spotlight card and its code. | Removed: `function renderSpotlight() {` and the `#spotlight` container |
| B11 | `okay for teh opporutnities tab it seems that their is glitch wher the text opptunities is above then appotunities themselves please address that issue` | Moved the heading into its own full-width row above the cards and sized it to fit. | `<h2 class="font-display font-black text-[5.2vw] md:text-[5.5vw] leading-[0.9] tracking-tighter whitespace-nowrap" data-i18n="labs_title"></h2>` |
| B12 | `the "opprunities" bug is still there` | Confirmed the served page had the change. Could not reproduce it, and asked for a screenshot, the window width, the language and the URL. No change made. | None (could not reproduce) |
| B13 | `okay now good I want teh github page to look better I want you to make like a little section  the github where is sepifcy the propmpt  I sued and te code you generateed` | Added this README with screenshots and a prompt section. | `![Discover tab](docs/screenshot-discover.png)` |
| B14 | `when I mean every single prompt I mean every single promp nd what it did like evry single one I gave you big or small` | Replaced the prompt section with this complete log. | None (README text only) |
| B15 | `does it follow the one html file rule` | Answered: no. The site was three files. Asked before changing anything. | None (answer only) |
| B16 | `make it follow that rule` | Inlined `data.js` and `app.js` into `index.html`, removed the two files, and updated the README structure notes (`4ce6118`). | `<script>  (inlined data.js)`<br>`<script>  (inlined app.js)` |
| B17 | `put in like the most impactfull ai paper like teh was it 2017 one or like 2108 one the one made  by google in there` | Checked the paper on arXiv (1706.03762, 12 June 2017, "Attention Is All You Need") and added it as the first Discover card, tier LLM Master. Hero note now says seven papers (`be46ebd`). | `id: "transformer",`<br>`arxiv: "1706.03762",`<br>`title: "Attention Is All You Need",` |
| B18 | `for of the prompt I want teh github to feature teh code you generared in that same table` | Added the Code generated column to both prompt-log tables, with the key lines from each commit. | None (README table only) |

### Exact code for each prompt

The line-by-line code each prompt produced is in [`docs/CODE-CHANGES.md`](docs/CODE-CHANGES.md). It holds the git diff for each commit, with a link to the commit on GitHub.

The code from A10 (the first single-file HTML, generated in the design chat) is not in this repository. It exists only in the pasted transcript. It was cut off mid-file and was replaced by the `vibe-apex` files in B1.

## Data sources

- **Papers:** arXiv abstract pages and the arXiv API, checked on the dates shown on each card.
- **Opportunities:** official pages for the Foresight Institute RFP (deadline 31 Oct 2026, 23:59 PDT), Inference.net AI Compute Grants (rolling) and the Swiss AI compute grant small-project track (rolling). The Swiss AI large call closed 14 Sep 2026 and is not listed as open.

Opportunities change. Confirm the deadline and eligibility on the official page before applying.

## What was corrected from the generated code and design

- **Wrong arXiv IDs.** 2410.05229 is GSM-Symbolic, not DSPy. SWE-agent is 2405.15793, not 2408.12788. The paper 2502.1098 does not resolve and was removed. Titles and dates were replaced with the values from arxiv.org.
- **Invented opportunities.** The design's grants, prices and compute offers did not correspond to real calls. They were removed. The Opportunities tab now lists three calls checked against their official pages.
- **Invented statistics.** Figures such as "64 active papers", grant pools and cluster status were removed.
- **Fake provisioning.** The "Launch" buttons did nothing real. The Sandbox tab now shows copyable setup commands for public packages and repositories.

## Known limitations

- **Times:** arXiv does not publish a submission time on the abstract page, so paper cards show dates only.
- **Translations:** Spanish and Hindi text is a first translation and has not been reviewed by a native speaker. Paper titles are translated, with the English original shown beneath.
- **Status labels** such as "Code Released" and "Weights Available" were not all checked against each repository.
- **Narrow phones:** the header (logo, language toggle and MY LIBRARY button) is wider than a 390 px screen and gets clipped.
- **No automated tests.** Checks were done by hand and with headless Chrome screenshots.
