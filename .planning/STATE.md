# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-23)

**Core value:** La skill `/audit` + CLI no solo diagnostica: actúa — loop accionable con la CLI como única implementación del score, sirviendo al humano y al LLM a la vez.
**Current focus:** Phase 4 — Contrato JSON v1.1 canónico

## Current Position

Phase: 3 of 8 — ✅ COMPLETADA (Motor: F_rigor, fix T1, USA multi-estatal, pilar DevOps)
Plan: Fases 1–3 ejecutadas — 20/54 tickets (F1: GOB-01..04, GOB-06, MOTOR-07, REL-01, REL-02 · F2: ESTR-01..03, QA-01 · F3: MOTOR-01..06, MOTOR-08 adelantado de la F4, QA-04)
Status: Ready to plan Phase 4 (`/gsd-plan-phase 4` — contrato JSON v1.1). Alcance restante: CONTRATO-01..05 + MOTOR-09. **Prerrequisito fijado por el propio roadmap: la semántica del contrato se decide en sesión Fable 5 ANTES de delegar la implementación.**
Last activity: 2026-08-02 — commiteada la ronda mensual de vigilancia 2026-08 y las revisiones #5–#7 del Arquitecto. Antes (2026-07-28): Fase 3 mergeada a `develop` vía PRs #18 (F_rigor + fix T1 + default seguro EC) y #19 (USA multi-estatal + DevOps + endurecimientos + CI), con auditoría adversarial de cierre que produjo 3 correcciones pre-merge. 77/77 tests, `validate.js` 14/14 sin errores, job `cli-tests` en CI.

Progress: [████░░░░░░] 37% (20/54 tickets)

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

### Hallazgos de la Fase 3 para la Fase 4 (ver `.planning/AUDITORIA-FASE-3-2026-07-28.md`)

- **7 de los 13 penalizadores del motor no existen en ningún JSON de reglas** (`no_dpo`, `no_legal_basis`, `no_breach_plan`, `minors_data_fe/be`, `no_arco_ui/backend`): no tienen `legal_refs` que citar. Otros 6 sí están en `score-formula.json` **con** sus `legal_refs`, pero el motor los tiene hardcodeados en TypeScript en vez de leerlos — doble fuente de verdad (B5). CONTRATO-01 exige `legal_refs` textuales de `cli/rules/`, así que este inventario dimensiona la fase y crea una dependencia editorial.
- **CONTRATO-03 encierra una decisión de producto, no un fix:** el ADR-001 documenta `min(100, fe+be)` con cap 50/pilar y el motor usa pool plano. Cablear el ADR **bajaría scores** (fixture "salud+CO sin cumplimiento": 100 → 80) y exige bump de `schema_version`.
- **MOTOR-09** (normalizar `countries` en el motor) debe aterrizar antes o junto a DOCTOR-01, que es lo que vuelve alcanzable el defecto.
- El contrato **no tiene JSON Schema commiteado** todavía: CONTRATO-01 lo crea desde cero (`cli/rules/schema/` solo tiene country-rules y us-state-matrix).

### Hallazgos de la Fase 1 para fases siguientes

- **Schema vs datos (afecta QA-01, Fase 2):** el enum de `review_status` en `country-rules.schema.json` declara solo `[pending_legal_validation, under_review, validated]`, pero `mexico.json` ya usa `verified_editorial` (estado documentado en GOVERNANCE). QA-01 debe añadir `verified_editorial` al enum del schema (cambio técnico, no editorial) o la validación fallará.
- **Repo GitHub ya renombrado** a `Privacy_Compliance_Skills-UE-USA-LATAM` (redirect activo desde el nombre viejo) — ver ADR-002. Remote local actualizado.
- **`--version` del CLI** ahora lee `cli/package.json` vía createRequire (fix del hardcode 0.2.0-beta.1).
- **Rama de integración:** el usuario definió `develop` como target de los PRs del milestone (override del "hacia main" de los tickets); `main` recibe el merge al cierre del release.

### Fuera de las sesiones de código (corre en Cowork)

Fase IJ Ola 3 (argentina/peru/ecuador/panama.json), Fase AP (anti-patrones + /fix), columnas USA en knowledge/, decisión editorial F_rigor Ecuador, promoción de review_status. Añadido tras la Fase 3: **AUD-01..AUD-05** (`.planning/EDITORIAL-BACKLOG.md`) y el vacío de `legal_refs` de los 7 penalizadores anteriores.

### Tensión abierta: cuándo mergear `develop` → `main`

Este documento registra (ver arriba, "Rama de integración") que **`main` recibe el merge al cierre del release** — decisión del usuario del 2026-07-23. Las revisiones del Arquitecto #5, #6 y #7 (29–31 de julio) recomiendan en cambio mergear **ya**, poniéndolo como acción #1 tres días seguidos, con el argumento del atraso público (44 commits, 22 días) y de que el repo público muestra un proyecto sin motor. **Ambas posiciones son defendibles y no se han reconciliado.** El PR #17 está abierto, con checks verdes y merge limpio (0 commits divergentes); mergearlo NO produce un release (no hay tag ni publicación npm; la versión sigue en `0.4.0-dev`), que es lo que gobierna REL-03. La reconciliación de la rama **local** `main` (ahead 4 / behind 2) **no es prerrequisito**: sus 4 commits son las versiones pre-squash de los PRs #13/#14 ya presentes en `origin/main`, y `develop` contiene todo su contenido (verificado con `git diff main develop --diff-filter=D`, vacío). Decisión pendiente del owner.

---
*State updated: 2026-08-02 — cierre de la Fase 3 y arranque de la Fase 4*
