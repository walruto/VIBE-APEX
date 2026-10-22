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
index.html   Page layout, Tailwind config, styles, and the four tab sections
data.js      Papers, opportunities, sandbox commands, and EN/ES/HI strings
app.js       Rendering, tab switching, language switch, filter, drawer, library
docs/        Screenshots used in this README
```

All content is in `data.js`. To add a paper or opportunity, add an entry there. Opportunities need an official source URL and a checked deadline or "rolling" status.

## How it was built

This project started as a design brief. A design tool produced the editorial layout, and this repository turns that layout into a working site and then fixes it after review.

### 1. Design prompt (design tool)

The starting point was a meta-prompt for Google Stitch, a UI generation tool. It asked for:

- an editorial, high-contrast layout with large section-divider type, deep terracotta and obsidian colour blocks, and asymmetric card grids
- a four-tab structure: Discover, The Labs, Sandbox, My Library
- an EN/ES/HI language toggle
- paper cards with title, date, status, time, a one-sentence summary and a skill-level tag

<details>
<summary>Full Stitch meta-prompt (as used)</summary>

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

Note: the design tool's output contained several problems that were corrected in this repo (see below).

### 2. Integration prompt

The request that turned the design into code was:

> okay now let us integrte the deisgn ggolg teicth made for us using cluade eh sules are no paid apis ,fake opptunitee, reals rearac papers

In short: integrate the design, no paid APIs, no fake opportunities, real arXiv papers.

### 3. Follow-up requests

These were made in order, and each one changed the code:

1. Make the site runnable locally.
2. Push to GitHub, crediting only the repo URL.
3. Translate the Labs list entries with the paper summary so they change with the language toggle.
4. Add real AI opportunities to the tab and translate the paper titles.
5. Rename the header's "Dossier" button to "My Library" in all three languages.
6. Move the spotlight paper out of the hero, then remove it.
7. Fix the Opportunities heading, which overlapped the first row of cards.
8. Add this README.

### 4. What was generated, and what was corrected

The first generated code and the design tool's content had several problems. These were fixed:

- **Wrong arXiv IDs.** 2410.05229 is GSM-Symbolic, not DSPy. SWE-agent is 2405.15793, not 2408.12788. The paper 2502.1098 does not resolve and was removed. Titles and dates were replaced with the values from arxiv.org.
- **Invented opportunities.** The design's grants, prices and compute offers did not correspond to real calls. They were removed. The Opportunities tab now lists three calls checked against their official pages.
- **Invented statistics.** Figures such as "64 active papers", grant pools and cluster status were removed.
- **Fake provisioning.** The "Launch" buttons did nothing real. The Sandbox tab now shows copyable setup commands for public packages and repositories.

## Data sources

- **Papers:** arXiv abstract pages and the arXiv API, checked on the dates shown on each card.
- **Opportunities:** official pages for the Foresight Institute RFP (deadline 31 Oct 2026, 23:59 PDT), Inference.net AI Compute Grants (rolling) and the Swiss AI compute grant small-project track (rolling). The Swiss AI large call closed 14 Sep 2026 and is not listed as open.

Opportunities change. Confirm the deadline and eligibility on the official page before applying.

## Known limitations

- **Times:** arXiv does not publish a submission time on the abstract page, so paper cards show dates only.
- **Translations:** Spanish and Hindi text is a first translation and has not been reviewed by a native speaker. Paper titles are translated, with the English original shown beneath.
- **Status labels** such as "Code Released" and "Weights Available" were not all checked against each repository.
- **Narrow phones:** the header (logo, language toggle and MY LIBRARY button) is wider than a 390 px screen and gets clipped.
- **No automated tests.** Checks were done by hand and with headless Chrome screenshots.
