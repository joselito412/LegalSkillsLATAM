# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-23)

**Core value:** La skill `/audit` + CLI no solo diagnostica: actúa — loop accionable con la CLI como única implementación del score, sirviendo al humano y al LLM a la vez.
**Current focus:** Phase 1 — Higiene, decisiones y renombre

## Current Position

Phase: 1 of 8 — ✅ COMPLETADA (Higiene, decisiones y renombre)
Plan: 8/8 tickets ejecutados (GOB-01..04, GOB-06, MOTOR-07, REL-01, REL-02)
Status: Ready to plan Phase 2 (`/gsd-plan-phase 2`)
Last activity: 2026-07-23 — Fase 1 ejecutada (10 commits en `rebrand-refs-sweep-2026-07`); gates verificados: build+tests verdes (11/11), grep de marca limpio, check:versions probado, ADR-001/ADR-002 commiteados; PR abierto hacia `develop`

Progress: [█▓░░░░░░░░] 16% (8/50 tickets)

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

## Accumulated Context

### Decisiones vigentes (ver PROJECT.md → Key Decisions)

- CLI = única implementación del score (loop híbrido estilo react-doctor).
- strict_regimes por pertenencia, nunca igualdad numérica de F_rigor (fix T1).
- `doctor` = wrapper delgado del mismo engine que audit (no recrear B5).
- Renombre de marca (REL-01) y ADR de cap DevOps (MOTOR-07) ANTES de congelar golden tests (QA-03).
- Fuente única de versión: `cli/package.json`.
- Política de modelos: Fable 5 arquitecto / Opus PM-validador / Sonnet ejecutor (CLAUDE.md).

### Trabajo editorial pendiente en el working tree (entra en Phase 1 / GOB-01)

8 archivos: PROMPTS-CLAUDE-CODE-2026-07.md, cli/rules/countries/{brasil,chile,mexico}.json, cli/rules/us/state-matrix.json, docs/SOURCES-VALIDATION.md (modificados) + docs/NORMAS-CITADAS.md y docs/VIGILANCIA-NORMATIVA.md (nuevos). Los artefactos de planeación (.planning/, CLAUDE.md, AGENTS.md, PLAN-GSD-V0.4-2026-07.md, architecture/SKILL-AUDIT-V4-DESIGN.md) van en commit separado — staging explícito, nunca `git add -A`.

### Hallazgos de la Fase 1 para fases siguientes

- **Schema vs datos (afecta QA-01, Fase 2):** el enum de `review_status` en `country-rules.schema.json` declara solo `[pending_legal_validation, under_review, validated]`, pero `mexico.json` ya usa `verified_editorial` (estado documentado en GOVERNANCE). QA-01 debe añadir `verified_editorial` al enum del schema (cambio técnico, no editorial) o la validación fallará.
- **Repo GitHub ya renombrado** a `Privacy_Compliance_Skills-UE-USA-LATAM` (redirect activo desde el nombre viejo) — ver ADR-002. Remote local actualizado.
- **`--version` del CLI** ahora lee `cli/package.json` vía createRequire (fix del hardcode 0.2.0-beta.1).
- **Rama de integración:** el usuario definió `develop` como target de los PRs del milestone (override del "hacia main" de los tickets); `main` recibe el merge al cierre del release.

### Fuera de las sesiones de código (corre en Cowork)

Fase IJ Ola 3 (argentina/peru/ecuador/panama.json), Fase AP (anti-patrones + /fix), columnas USA en knowledge/, decisión editorial F_rigor Ecuador, promoción de review_status.

---
*State updated: 2026-07-23*
