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

Every prompt that shaped this project, in order, with what it produced. The prompts are shown in improved form, and some typos are kept on purpose. The original typed text is in this README's git history (commit `05b5207`).

**Part A: prompts from the design chat (before the repo existed).** These went to a search-based AI assistant, and the transcript was pasted into the first message of the coding session.

| # | Prompt (improved) | What it did | Code generated |
|---|---|---|---|
| A1 | Use this image as inspo to start building the UI/UX for a platform that lets people find AI opportunities and discover AI research papers. | Asked for the inspiration image, which was not attached, then described a UI direction in general terms. | None (text reply) |
| A2 | Design a platform for AI enthusiasts of every lvl, from beginner to advanced. Include a dashboard where people can browse research papers. Guardrail: no real-world events, only real AI papers. For each entry show the date, status of opening, time and important info, plus a level tag: Vibe Coder, Agent Coder or LLM Master. Name the platform too. | Named the platform "VIBE & APEX", wrote a Stitch meta-prompt, and built a mock feed of three paper cards with date, status, time and level. | None (text reply) |
| A3 | Add a language toggle for English and Spanish, and Hindi as well. | Renamed the platform to "VIBE//APEX" and described localized strings. No toggle code was produced. | None (text reply) |
| A4 | The Stitch design is great, but it only has the home page. Build the rest of the tabs for this project and keep the UI and design the same throughgout. | Designed four tabs (DISCOVER, THE LABS, SANDBOX, MY LIBRARY) with EN/ES/HI copy and a locale token JSON. | None (text reply) |
| A5 | Now generate the other pages in the same Stitch design, with the same tabs, theme and multilingual data. | Produced a Stitch technical design spec for all four tabs, plus a three-paper multilingual data set. | None (spec text) |
| A6 | Now integrate the design made in Google Stitch using Claude. Rules: no paid APIs, no fake opportunities, real arXiv papers only. | Produced a single HTML file with Tailwind, the four tabs and a language dictionary. The output was cut off mid-file, and it contained invented grants and prices. | Full single-file HTML, in the transcript only (cut off mid-file; not in the repo) |

**Part B: prompts in the coding session (the requests that changed this repo).**

| # | Prompt (improved) | What it did | Code generated |
|---|---|---|---|
| B1 | Here is the Stitch export (`/Users/walidahmed/Downloads/stitch_editorial_ai_ecosystem_discovery_platform.zip`) and the design-chat transcript (Part A). Unzip it, review the design, and build a working site from it. | Unzipped the Stitch export, reviewed both screens, checked the arXiv IDs, and built the first version in `vibe-apex/`. | `window.PAPERS = [`<br>`window.UI = {`<br>`function renderGrid() {` |
| B2 | Run the site. | Started a local server on port 8080. | None (server only) |
| B3 | Push this to GitHub. Do not credit yourself; credit only https://github.com/walruto/VIBE-APEX. | Pushed the site to the empty repo, with a commit message that credits only the repo URL. | Same commit as B1 (`c516907`) |
| B4 | When I change the language, the actual opportunity text doesn't change. Fix that. | Made the Labs list entries show the translated summary. | `<p class="text-sm text-cream/80 mt-2 leading-relaxed">${esc(summaryOf(p))}</p>` |
| B5 | Rerun the site. | Restarted the local server. | None (server restart) |
| B6 | The text of the opportunities still doesn't change with the language. | Reproduced the issue in headless Chrome and found the Labs text did translate. Asked which text was meant. | None (investigation only) |
| B7 | You forgot the AI opprotunities tab: I only see AI papers. Also the paper titles aren't translated into the selected language. Fix both issues. | Replaced the empty Labs area with three verified open calls from official pages, renamed the tab to OPPORTUNITIES, and translated the six paper titles with the English original shown beneath. | `window.OPPORTUNITIES = [`<br>`function renderOpportunities() {`<br>`labs_title: "OPPORTUNITIES",` |
| B8 | Change the DOSSIER button to My Library, and adjust it for all languages as well. | Changed the header button to My Library, Mi biblioteca and मेरी लाइब्रेरी. | `dossier: "My Library",`<br>`dossier: "Mi biblioteca",`<br>`dossier: "मेरी लाइब्रेरी",` |
| B9 | I like the idea of the spotlight paper, but it blocks the homepage a bit. Put it in a better spot, or remove it entirely. | Moved the spotlight card out of the hero into its own row, and removed a shadow strip on the closed drawer. | `.drawer-open { transform: translateX(0); box-shadow: -20px 0 60px rgba(0, 0, 0, 0.25); }`<br>`<div id="spotlight" class="px-4 lg:px-14 py-16 flex justify-center lg:justify-end"></div>` |
| B10 | Remove the spotlight paper entirely. | Removed the spotlight card and its code. | Removed: `function renderSpotlight() {` and the `#spotlight` container |
| B11 | On the Opportunities tab there is a glitch: the word OPPORTUNITIES sits above the opportunities themselves. Fix that issue. | Moved the heading into its own full-width row above the cards and sized it to fit. | `<h2 class="font-display font-black text-[5.2vw] md:text-[5.5vw] leading-[0.9] tracking-tighter whitespace-nowrap" data-i18n="labs_title"></h2>` |
| B12 | The OPPORTUNITIES bug is still there. | Confirmed the served page had the change. Could not reproduce it, and asked for a screenshot, the window width, the language and the URL. No change made. | None (could not reproduce) |
| B13 | Make the GitHub page look better: add a section that lists the exact prompts I used and the code you generated. | Added this README with screenshots and a prompt section. | `![Discover tab](docs/screenshot-discover.png)` |
| B14 | List every prompt I gave you, big or small, and what each one did. | Replaced the prompt section with this complete log. | None (README text only) |
| B15 | Does it follow the one-HTML-file rule? | Answered: no. The site was three files. Asked before changing anything. | None (answer only) |
| B16 | Make it follow that rule. | Inlined `data.js` and `app.js` into `index.html`, removed the two files, and updated the README structure notes (`4ce6118`). | `<script>  (inlined data.js)`<br>`<script>  (inlined app.js)` |
| B17 | Put in the most impactful AI paper, the 2017 one (or was it 2108?) made by Google. | Checked the paper on arXiv (1706.03762, 12 June 2017, "Attention Is All You Need") and added it as the first Discover card, tier LLM Master. Hero note now says seven papers (`be46ebd`). | `id: "transformer",`<br>`arxiv: "1706.03762",`<br>`title: "Attention Is All You Need",` |
| B18 | Feature the code you generated for each prompt in that same table. | Added the Code generated column to both prompt-log tables, with the key lines from each commit. | None (README table only) |

### Exact code for each prompt

The line-by-line code each prompt produced is in [`docs/CODE-CHANGES.md`](docs/CODE-CHANGES.md). It holds the git diff for each commit, with a link to the commit on GitHub.

The code from A6 (the first single-file HTML, generated in the design chat) is not in this repository. It exists only in the pasted transcript. It was cut off mid-file and was replaced by the `vibe-apex` files in B1.

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
