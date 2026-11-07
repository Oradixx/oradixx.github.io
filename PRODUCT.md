# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters** hiring for a 6-month internship or a VIE starting in February 2027, in data engineering, MLOps, machine learning, AI engineering or data science. They skim in under a minute: availability, role, school, a few measured results, a CV to download.
- **Engineers** on the hiring team. They open the projects, read the method and the numbers, and follow the links to the code.

Both read the same page; the first screen and the 60-second summary serve the recruiter, the project rows and repositories serve the engineer.

## Product Purpose

The personal portfolio of Clément Vurpillot, final-year data and AI engineering student at ESILV (Paris). It exists to get him interviews for the internship or VIE above. Success: a reader can tell in seconds that he is available from February 2027 and what he has built, and an engineer finds results they can check.

## Positioning

Every claim is tied to a source the reader can open: a repository, a results file, a live dashboard, or the CV. Results are reported against a baseline, including when the baseline wins (France Grid Forecast is behind RTE's own forecast, and the page says so). The site does not pin him to one role or to the IoT field of his internship.

## Operating Context

- Readers arrive from LinkedIn, the CV, or GitHub, on desktop and on phones.
- The page links out to each project's repository or live page, and to the one-page CV (`Clement_Vurpillot_CV.pdf`).
- Content is reviewed by Clément before it ships; changes go through pull requests on `main`, which GitHub Pages serves.

## Capabilities and Constraints

- One self-contained `index.html`, no build step and no framework, served by GitHub Pages from `main`. The CV PDF sits next to it.
- The site is in English.
- Every number, date, team size and link must come from a source (repository README or results files, the France Grid Forecast data branch, the CV) and be something Clément can defend for three minutes in an interview. Unsourced statements are flagged to him, not added.
- Skills he does not claim, and must not be presented as claimed: PyTorch, R, Power BI, Tableau, Snowflake, Databricks, Terraform, LangChain or agent frameworks, applied computer vision. Existing mentions are flagged, not removed without asking.
- No decorative element that carries no information; no "AI-written" tone (em dashes, rhetorical triads, "from X to Y", colon reveals, filler words).
- Quality floor at each change: lychee with no dead link, html-validate with no error, Lighthouse and axe-core scores at least equal to the version before.
- Project order: the CERTAM internship first, then Chip Advisor, then the NLP and CryptoIndexLab projects. LoL Ratings follows. France Grid Forecast is a secondary project and does not lead the page.
- Undecided: whether to show an email address on the page (it is in the CV); a target country or region for the VIE.

## Brand Commitments

- Name as written: Clément Vurpillot. GitHub: Oradixx. LinkedIn: clement-vurpillot.
- Voice: plain, specific English; facts and numbers over adjectives; first person where he did the work, "we" for team projects, with his own part stated.

## Evidence on Hand

- CV, October 2026 version: `Clement_Vurpillot_CV.pdf`.
- Repositories under github.com/Oradixx (France Grid Forecast, LoL Ratings, CryptoIndexLab, insurance-reviews-nlp, tripadvisor-recommender, movielens-nosql, data-pipeline-template, data-interview-prep, data-plumber, Car_Price_Prediction_Project, Packet_Sniffer_Rust, project templates) and github.com/alvaro-serero/nfl-chip-advisor (team hackathon repository).
- France Grid Forecast live data on the repository's `data` branch (`reports/live.json`, `forecasts/forecasts.parquet`); the page embeds a snapshot dated 1 November 2026.
- No photo, testimonials, press or employer endorsements are on hand; none may be invented.

## Product Principles

1. Availability and role first: a reader never has to scroll to learn what he is looking for and from when.
2. Show the measurement, with its baseline and its source.
3. Breadth across data engineering, ML, MLOps and AI, without overclaiming a skill.
4. Respect the reader's time: skimmable on the first screen, detailed further down.
5. Say what he built himself in team work.

## Accessibility & Inclusion

WCAG 2.2 AA as measured by axe-core: no violation in light and dark themes, at 375 px and 1440 px. Motion stops under `prefers-reduced-motion`; charts have a text or table equivalent and can be read with the keyboard.
