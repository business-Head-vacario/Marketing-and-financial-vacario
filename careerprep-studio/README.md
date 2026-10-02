# CareerPrep Studio

Offline single-page app that takes a candidate in hospitality, tourism, facilities management,
events or aviation from resume to offer. Built from the *CareerPrep Studio* and *Job Hunt Tracker* PRDs.

**Use it right away:** double-click **`CareerPrep-Studio.html`**. It is one self-contained file
(libraries embedded), so you can email it, copy it to a USB stick or keep it on your desktop.
No install, no server, no internet. `index.html` + `lib/` is the same app split into files.

First open runs a one-minute setup: pick your field and role, add your name, upload your resume and
(optionally) paste a job ad. You land on your match score. Or choose *Explore with example data*.
Data lives in this browser under the `jobtracker:v1` localStorage key; export a backup from Settings.

**Edit:** `src/app.html` is the source; run `./build.sh` to regenerate `index.html`
(the build drops the Google Fonts link so the local copy stays fully offline) and
`CareerPrep-Studio.html` (the single-file edition).

| Screen | What it does |
|---|---|
| Dashboard | Departures-board "next action", KPIs, flight-path pipeline, today list, ATS vs outcome, weekly activity |
| Resume Check | PDF/DOCX/TXT upload, *Track this job* (saves JD + score, sets follow-up), 0–100 ATS-style score with 5-part breakdown, matched/missing keywords, industry gap map, rule-based fixes (Done/Ignore), AI prompt helper |
| Interview Prep | Industry + JD-derived question bank, STAR builder with quality checks, timed mock interview, assessment-day checklist, per-application readiness ring |
| Outreach | Cold outreach + application-flow + industry templates, hook/proof-point personalisation, personalisation meter, unfilled placeholder highlighting, copy / mailto / log to timeline, template editor |
| Applications | Drag-and-drop board and sortable table, ghosted flags, detail drawer with timeline and paste-a-reply status + date detection |
| Settings | Profile, reminder thresholds, theme, JSON export/import (merge or replace), reset |

Config (industry packs, keyword lists, rules, synonyms, templates, questions, checklists) sits at the
top of the script in `src/app.html`, separated from the logic.

Libraries in `lib/`: pdf.js 3.11.174 (worker loaded as a script so it runs under `file://`), mammoth 1.8.0.
