# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-23)

**Core value:** La skill `/audit` + CLI no solo diagnostica: actúa — loop accionable con la CLI como única implementación del score, sirviendo al humano y al LLM a la vez.
**Current focus:** Phase 1 — Higiene, decisiones y renombre

## Current Position

Phase: 1 of 8 (Higiene, decisiones y renombre)
Plan: 0 of TBD in current phase
Status: Ready to plan (`/gsd-plan-phase 1`)
Last activity: 2026-07-23 — Roadmap GSD creado (50 tickets, 8 fases) vía workflow multi-agente; CLAUDE.md con política de modelos incrustada

Progress: [░░░░░░░░░░] 0%

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

### Fuera de las sesiones de código (corre en Cowork)

Fase IJ Ola 3 (argentina/peru/ecuador/panama.json), Fase AP (anti-patrones + /fix), columnas USA en knowledge/, decisión editorial F_rigor Ecuador, promoción de review_status.

---
*State updated: 2026-07-23*
