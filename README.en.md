<p align="center">
  <img src="assets/logo.svg" alt="Privacy Compliance Skills — EU · US · LATAM" width="760">
</p>

<p align="center"><strong>Open standard for privacy compliance for developers — Compliance-as-Code</strong></p>

<p align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![SkillSpector: LOW · SAFE](https://img.shields.io/badge/SkillSpector-LOW%20%C2%B7%208.3%2F100-brightgreen)](docs/SECURITY.md)
[![Version](https://img.shields.io/badge/version-0.4.0--dev-blue)](docs/ROADMAP.md)
[![Regions](https://img.shields.io/badge/regions-EU%20%C2%B7%20US%20%C2%B7%20LATAM-58A6FF)](#-regulatory-coverage)

</p>

<p align="center">
    <img src="assets/architecture.svg" alt="Privacy Compliance Skills repository architecture" width="48%">
    <img src="assets/risk-score-demo.svg" alt="Legal Risk Score visual demo" width="48%">
</p>

> ⚠️ This project is a methodological and operational guide. **It does not constitute or replace professional legal advice.** Always consult a qualified lawyer for specific legal questions.

> 🌐 **Léelo en español → [`README.md`](README.md)**

> 📛 **Formerly `LegalSkillsLATAM`.** The project was renamed to **Privacy Compliance Skills (EU · US · LATAM)** when the European Union and the United States were elevated to first-class jurisdictions. See [`PLAN-REBRAND-Y-WEB-2026-07.md`](PLAN-REBRAND-Y-WEB-2026-07.md).

---

## What is it?

**Privacy Compliance Skills** is a privacy-compliance toolkit (*Compliance-as-Code*) that helps software developers and startups build technology that complies with data-protection law across the **three regulatory blocks that matter most today**: the **European Union** (GDPR), the **United States** (CCPA/CPRA + state laws), and **Latin America** (Ley 1581, LFPDPPP, LGPD, and the rest).

It started as a LATAM-first resource and is now a **tri-regional standard**: it compares local regulations against each other and against the world's strictest frameworks, so a product can scale from LATAM to Europe or the US without re-architecting its privacy posture.

The project ships in **three simultaneous formats**:

| Format | For whom? | Where it lives |
|---|---|---|
| 📄 **Humans** | Lawyers, devs, CTOs | Matrices and checklists in `knowledge/` |
| 🤖 **AI** | Claude and other LLMs | Installable skills in `skills/` |
| ⚙️ **Machines** | APIs, CI/CD | JSON rules in `cli/rules/` |

---

## Current status

> 🔨 **What already works well**
>
> The technical engine is consolidated: the Claude skills, the CLI with visual output, the Legal Risk Score algorithm (0–100), the per-jurisdiction JSON rules, the two Frontend/Backend pillars, and the repository architecture. The **LATAM block is mature** and the **EU block (GDPR) is production-grade**.
>
> 🚧 **What's under construction: the US block**
>
> With the rebrand, **the United States moves from "contrast" to first-class**: `usa-federal.json` (CCPA/CPRA + sectoral laws) and the matrix of ~20 state privacy laws in effect in 2026 are being built. See [`PLAN-REBRAND-Y-WEB-2026-07.md`](PLAN-REBRAND-Y-WEB-2026-07.md).
>
> 📌 **What's still pending: peer review**
>
> The legal content was drafted with technical-legal rigor but **has not yet passed formal peer review** (data-protection lawyers, academics, or legal-tech professionals). The tool works; its normative authority is still being built — and with EU/US in the title, that call is more urgent than ever.
>
> If you're a data-protection lawyer, a digital-law academic, or a legal-tech professional, [this is your place →](#-were-looking-for-legal-collaborators)

---

## Two Pillars: Frontend and Backend

The project's knowledge is organized into **two explicit pillars**:

| Pillar | Scope | Owner | Risk |
|---|---|---|---|
| **Frontend** — UX / Consent / Transparency | What the user sees, touches, or decides | PM + UX + Privacy lawyer | 0–50 pts |
| **Backend** — Technical Security / Architecture | Internal data protection | CTO + Security Lead + Data-governance lawyer | 0–50 pts |

> Quick rule: **If the user sees it → Frontend. If the system does it internally → Backend.**

- Pillar docs: [`architecture/PILLAR-SEPARATION.md`](architecture/PILLAR-SEPARATION.md)
- Skill index by use case: [`skills/_SKILLS-INDEX.md`](skills/_SKILLS-INDEX.md)
- Skill decision tree: [`skills/_routing.md`](skills/_routing.md)

---

## The Legal Risk Score

The heart of the project is an algorithm that scores the legal risk of any system on a 0–100 scale:

```
Risk Score = min(100, (C_base + Σ Penalties) × F_rigor)
```

`F_rigor` is calibrated per **regulatory block**: the EU (GDPR) is the ceiling, the US scales with the number of applicable states, and LATAM is the baseline (with Brazil as the regional ceiling).

| Level | Range | Meaning |
|---|---|---|
| 🟢 Low | 0 – 30 pts | Public or basic data. Self-service possible with Privacy Compliance Skills. |
| 🟡 Medium | 31 – 70 pts | Personal data. Strict technical measures required. |
| 🔴 High | 71 – 100 pts | Sensitive data or regulated markets. **Human legal audit mandatory.** |

### `/risk-score` skill output

![Risk Score demo](assets/risk-score-demo.svg)

---

## Available Skills

| Skill | Command | Description |
|---|---|---|
| 🔍 **Audit (entry point)** | `/audit` | Full iterative audit: Evaluate → Fix → Re-evaluate loop with a 0–100 score and FE/BE/DevOps panels |
| 🗂️ Classify Data | `/clasificar-datos` | Classifies any field or table by its legal sensitivity level per jurisdiction |
| 🖥️ Consent (FE) | `/frontend-privacy/consentimiento` | Audits the granular consent flow and its record |
| 🖥️ Transparency (FE) | `/frontend-privacy/transparencia` | Checks privacy policy, cookies, and notices |
| 🖥️ User Controls (FE) | `/frontend-privacy/user-controls` | UX flow of the user rights portal (ARCO / DSAR) |
| ⚙️ Data Protection (BE) | `/backend-security/data-protection` | Encryption, hashing, retention, and DPA |
| ⚙️ Access Control (BE) | `/backend-security/access-control` | RBAC and audit logging |
| ⚙️ Data Lifecycle (BE) | `/backend-security/data-lifecycle` | Retention and purge policy by data type |
| 🌎 Regulatory Matrix | `/matriz-normativa` | Compares EU vs US vs LATAM law on any dimension |
| 📋 User Rights | `/derechos-usuario` | Generates the response protocol for ARCO / DSAR requests |
| 🔍 Privacy Check | `/privacy-check` | Audits a feature, endpoint, or schema *(to be deprecated in v0.4 — use `/audit`)* |
| ⚖️ Risk Score | `/risk-score` | Score only, 0–100 *(to be deprecated in v0.4 — use `/audit`)* |

> Canonical status of each skill: [`skills/_routing.md`](skills/_routing.md)

---

## Regulatory Coverage

Three blocks. The **Level** column is honest about each jurisdiction's real depth today.

### 🇪🇺 European Union

| Jurisdiction | Main Law | Level |
|---|---|---|
| 🇪🇺 EU | **GDPR** — Regulation (EU) 2016/679 (in force 2018) · fines up to €20M or 4% of global turnover · 72h breach notice | ✅ **Own rules** (production) |

### 🇺🇸 United States

| Jurisdiction | Main Law | Level |
|---|---|---|
| 🇺🇸 California | **CCPA / CPRA** — CPPA regulator (US de-facto standard) | 🚧 **Own rules** (in progress) |
| 🇺🇸 State-level | **~20 comprehensive laws in effect in 2026** (VA, CO, CT, TX, UT, OR, etc.) | 🚧 **Comparative matrix** (in progress) |
| 🇺🇸 Federal sectoral | HIPAA (health) · COPPA (minors) · GLBA (financial) · FERPA (education) | 🚧 **Sectoral penalties** |

### 🌎 Latin America

| Country | Main Law | Level |
|---|---|---|
| 🇨🇴 Colombia | Ley 1581 of 2012 (Habeas Data) + Decrees 1377/2013 and 1074/2015 | ✅ Own rules |
| 🇲🇽 Mexico | **New LFPDPPP (DOF 2025-03-20)** — repeals the 2010 law; SABG authority (ex-INAI); fines in UMA | ✅ Own rules *(updated Jul-2026)* |
| 🇧🇷 Brazil | LGPD 2018 + ANPD Resolutions *(regional ceiling; incidents: 3 business days, Res. 15/2024)* | ✅ Own rules *(updated Jul-2026)* |
| 🇨🇱 Chile | Ley 19.628 → **Ley 21.719 in force 2026-12-01** (APDP, fines up to 20,000 UTM) | ✅ Own rules ⏳ *(in force Dec-2026)* |
| 🇦🇷 Argentina | Ley 25.326 *(reform bills under legislative debate 2025-2026)* | ✅ Own rules |
| 🇵🇪 Peru | Ley 29733 + **Regulation D.S. 016-2024-JUS** (in force Mar-2025; breaches: 48h) | ✅ Own rules *(updated Jul-2026)* |
| 🇪🇨 Ecuador | LOPDP 2021 + Regulation DE-904/2023 (Superintendency operational) | ✅ Own rules |

> Currency-of-sources check: [`docs/SOURCES-VALIDATION.md`](docs/SOURCES-VALIDATION.md) — round 2026-07-08.

---

## Architecture

![Repository architecture](assets/architecture.svg)

```
privacy-compliance-skills/
│
├── assets/                  # Diagrams and visual assets
├── .claude-plugin/          # Claude plugin metadata
├── skills/                  # Installable Claude skills
├── cli/rules/               # JSON rules engine (bundled with the npm package)
│   ├── schema/              # Validation JSON Schemas
│   ├── eu/                  # GDPR
│   ├── us/                  # CCPA/CPRA + state-law matrix
│   ├── latam/               # Per-country rules (colombia.json, etc.)
│   └── risk-engine/         # Legal Risk Score formula + per-block factors
├── knowledge/               # Reference legal content (read-only)
├── prompts/                 # System prompts for AI auditors
├── web/                     # Astro site (landing + docs, bilingual ES/EN)
└── docs/                    # Governance, roadmap, security, contribution
```

---

## Security

Privacy Compliance Skills is evaluated with [**SkillSpector v2.1.1**](https://github.com/NVIDIA/skillspector) (NVIDIA) — the reference scanner for AI-agent skills. Coverage: 64 patterns / 16 categories. Reproducible offline static analysis.

| Skill | Score | Severity | Recommendation |
|---|---|---|---|
| `audit` | 25 / 100 | MEDIUM | CAUTION (1 P1 false positive) |
| `clasificar-datos` | 0 / 100 | LOW | **SAFE** |
| `derechos-usuario` | 0 / 100 | LOW | **SAFE** |
| `matriz-normativa` | 0 / 100 | LOW | **SAFE** |
| `privacy-check` | 25 / 100 | MEDIUM | CAUTION (1 P1 false positive) |
| `risk-score` | 0 / 100 | LOW | **SAFE** |

**Average: 8.3/100 — LOW · SAFE.** 4/6 skills with no findings; the 2 MEDIUM are false positives on adversarial phrases inside `TEST-CASES.md`, expected as evidence that content isolation works.

> Full analysis and commands to reproduce the scan in [`docs/SECURITY.md`](docs/SECURITY.md).

---

## Install as a Claude Plugin

```bash
# From Claude Desktop > Settings > Plugins
# Point to the root directory of this cloned repository
git clone https://github.com/joselito412/Privacy_Compliance_Skills-UE-USA-LATAM.git
```

Once installed, the skills activate from any Claude conversation:

```
/audit "telemedicine app with video, prescriptions and payments in California, Spain and Colombia"
/risk-score "My health app capturing medical diagnoses, operating in the EU"
/clasificar-datos "table: users(id, email, fingerprint, date_of_birth)"
/matriz-normativa opt_out_vs_opt_in
/derechos-usuario "user requests deletion of all their data" --pais BR
```

---

## Governance

The legal content is **curated, drafted, and maintained by an editorial team with legal expertise** in data law. No AI generates legal rules autonomously — the AI only applies the rules the editorial team defines.

```
Expert Lawyer → JSON/MD Rules → AI applies the rules → Dev gets guidance
   (Author)      (Source of truth)    (Executor)          (Beneficiary)
```

See [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md) for the full editorial-control flow.

---

## Roadmap

```
[GitHub repo] → [Claude Plugin] → [Public web] → [CLI Tool] → [API / SaaS]
   Phase 1 ✅      Phase 1 ✅        Phase 2 🔜     Phase 2 🔜    Phase 3 🔮
```

In progress: **EU to production + first-class US block + bilingual Astro site.** See [`PLAN-REBRAND-Y-WEB-2026-07.md`](PLAN-REBRAND-Y-WEB-2026-07.md) and [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Who is it for?

| Profile | Main use |
|---|---|
| 👨‍💻 Independent developer | Classify their app's data and understand their legal obligations |
| 🚀 Startup / CTO | Self-assess legal risk before launching or expanding to the EU/US |
| 🤖 AI agent (LLM) | Audit code and architectures using the project's JSON rules |
| ⚖️ Lawyer / Consultant | Review, correct, and enrich the repository's normative content |
| 🎓 Academic / Researcher | Comparative reference of EU vs US vs LATAM regulations |

---

## 🤝 We're looking for legal collaborators

This is an open call to:

🔹 **Data-protection lawyers** in LATAM, the EU, or the US

🔹 **Digital-law academics** or tech-regulation scholars

🔹 **Legal-tech professionals** who want to build open standards

**You don't need to know how to code.** The legal content is in readable Markdown and JSON. You just need to know the law and want an open, comparative compliance-as-code tool across the three blocks.

📌 **Current status:** pending peer review — and that's where you come in. With the US block under construction, we especially need **CCPA/CPRA and state-law** specialists alongside LATAM and GDPR experts.

You can start by opening an Issue with your observations, correcting a matrix, or reviewing a JSON rule for your jurisdiction. See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

---

## License

MIT — See [`LICENSE`](LICENSE).

---

*Privacy Compliance Skills — EU · US · LATAM. Closing the gap between code and privacy compliance.*
