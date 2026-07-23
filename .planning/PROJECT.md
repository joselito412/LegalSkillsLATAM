# Privacy Compliance Skills — UE · USA · LATAM (milestone v0.4.0)

## What This Is

Toolkit abierto de *Compliance-as-Code* para que desarrolladores y startups construyan software conforme a las leyes de protección de datos de los tres bloques regulatorios principales: UE (GDPR), USA (CCPA/CPRA + ~20 leyes estatales) y LATAM (Ley 1581, LFPDPPP, LGPD, etc.). Opera en tres formatos simultáneos: matrices/checklists para humanos (`knowledge/`), skills instalables para LLMs (`skills/`) y reglas JSON para máquinas/CI (`cli/rules/`).

Este milestone (v0.4.0) convierte el diagnóstico one-shot actual en un **loop accionable estilo react-doctor**: la CLI calcula el score determinista y emite un contrato JSON; la skill `/audit` lo consume, corrige el proyecto del usuario y re-evalúa hasta converger o escalar a abogado.

## Core Value

**La skill `/audit` + CLI no solo diagnostica: actúa** — dispara la planeación y ejecución real de las correcciones que mitigan riesgo legal, con un score reproducible cuya única implementación vive en `cli/src/engine`, y sirviendo a dos clientes a la vez: el humano (terminal legible) y el LLM (contrato JSON versionado).

## Requirements

### Validated

- Motor dual FE/BE con fórmula v2 y CLI con `--json` / `--fail-on` (v0.3.0, en producción).
- Gobernanza editorial: abogado → reglas JSON/MD → IA aplica (nunca genera reglas).
- Content isolation OWASP LLM01 en las skills (SkillSpector LOW/SAFE).

### Active

Ver `.planning/REQUIREMENTS.md` — catálogo de tickets del milestone v0.4.0 por tema (GOB, ESTR, MOTOR, CONTRATO, DOCTOR, SKILL, KNOW, QA, WEB, REL).

### Out of Scope

- **Contenido legal nuevo o modificado en sustancia** — el trabajo editorial/jurídico (Fase IJ: crear `argentina.json`, `peru.json`, `ecuador.json`, `panama.json`, tablas de fuentes, validación de pares) corre en Cowork con MCPs legales, no en las sesiones de código. Este plan solo hace código, wiring, tests, docs técnicos y web.
- **Catálogo de anti-patrones + skill `/fix`** (Fase AP) — v0.5; el contrato v1.1 deja el gancho (`recipe_ref`) listo.
- **API / SaaS** — Fase 3 del roadmap general.
- **Promover `review_status` a `validated`** — solo con revisor humano identificado; ninguna sesión de código toca ese campo.

## Context

- Repo: monorepo con `cli/` (TypeScript, npm), `skills/` (Markdown), `web/` (Astro bilingüe), `knowledge/`, `cli/rules/` (JSON).
- Rama activa: `rebrand-refs-sweep-2026-07`; flujo de trabajo por PR hacia `main` (PRs #12, #13 como precedente).
- Working tree con trabajo editorial SIN commit (8 archivos: 6 modificados + `docs/NORMAS-CITADAS.md` y `docs/VIGILANCIA-NORMATIVA.md` nuevos) — entra en la primera fase, en commit separado de los artefactos de planeación (`.planning/`, `CLAUDE.md`, `AGENTS.md`, plan GSD, diseño v4).
- Planes fuente que este milestone reorganiza: `PROMPTS-CLAUDE-CODE-2026-07.md` (sesiones 0, A–G + addendum H0–H4), `PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md` (fases 1.3, 2.1–2.4), `PLAN-INVESTIGACION-JURIDICA-Y-ANTIPATRONES-2026-07.md` (T1–T5), `architecture/AGENT-CONTRACT.md` (contrato v1.0 → v1.1).
- Bug bloqueante conocido (T1): tres penalizadores BE condicionados a `F_rigor == 1.25` dejarían de activarse para Brasil con la escala nueva — el fix es la lista `strict_regimes` (nunca igualdad numérica).

## Constraints

- **Arquitectura**: la CLI es la ÚNICA implementación de la fórmula del score; la skill interpreta y re-invoca, nunca recalcula (fallback sin Node.js siempre etiquetado "estimado, no verificado").
- **Contenido legal**: no tocar la sustancia de `cli/rules/**/*.json` (solo estructura/rutas); no modificar `docs/SOURCES-VALIDATION.md` ni `docs/NORMAS-CITADAS.md`.
- **Idioma**: docs en español; disclaimers intactos en todos los outputs.
- **Citas**: el LLM cita exclusivamente `legal_refs` provenientes de los JSON de reglas — nunca artículos de memoria.
- **Seguridad**: escalamiento obligatorio a auditoría legal humana con score ≥ 71 + datos sensibles (corta el loop); conservar content isolation.
- **Proceso**: commits atómicos por fase, build + tests verdes antes de cada commit, push/PR al cierre de cada fase.

## Key Decisions

- **Loop híbrido CLI + skill** (estilo react-doctor): CLI = score determinista y fuente de verdad; skill/LLM = interpretación, corrección y re-invocación. Decidido en `PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md`.
- **`strict_regimes` por pertenencia, no por valor de F_rigor** (fix T1). Ecuador: mantener el trato estricto hasta decisión editorial explícita — un default que debilita rigor en silencio es inaceptable en una herramienta de compliance.
- **`doctor` es wrapper delgado del mismo engine que `audit`** — prohibido un segundo camino de evaluación (evita recrear la brecha B5).
- **El renombre de marca en código ocurre antes de congelar golden tests** — los tests no deben congelar strings de la marca vieja.
- **Fuente única de versión**: `cli/package.json`; raíz y badge del README se sincronizan desde ahí.
- **Política de optimización de tokens** (canónica en `CLAUDE.md`, `model_profile: balanced` en `.planning/config.json`): Fable 5 = sesión/arquitectura/problemas centrales; Opus = planear y validar resultados de fase; Sonnet = edición, ejecución y validación de código y tests. Todo spawn de agente declara `model` conforme a esta política.
