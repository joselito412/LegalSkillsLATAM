# Handoff Cowork → Claude Code · 2026-07-28

**De:** Arquitecto (Cowork) · **Para:** sesión de código · **Milestone:** v0.4.0, Fase 3 (motor)
**Contexto de estado:** `.planning/reviews/2026-07-28.md` · **Catálogo de tickets:** `.planning/REQUIREMENTS.md`

---

## 0. Antes de tocar código: commit del working tree

Hay **11 rutas sin commitear** (5º día sin respaldo). Van en **dos commits separados por naturaleza**, con staging explícito por ruta (prohibido `git add -A`), sobre la rama de trabajo y con PR hacia `main`:

**Commit A — editorial/legal** (Olas de vigilancia + tickets VIG):
```
cli/rules/latam/brasil.json
cli/rules/latam/colombia.json
cli/rules/us/state-matrix.json
docs/NORMAS-CITADAS.md
docs/SOURCES-VALIDATION.md
docs/VIGILANCIA-NORMATIVA.md
knowledge/pillar-backend/matrices/sanciones-por-incidente.md
knowledge/insumos/
```
Mensaje sugerido: `content(vigilancia): VIG-01..07 — adecuación UE en LGPD, Ley 2573/2026 CO, RD 100-2025 PE, gaps de state-matrix, insumo Ecuador`

**Commit B — planeación:**
```
.planning/EDITORIAL-BACKLOG.md
.planning/reviews/2026-07-24.md
.planning/reviews/2026-07-27.md
.planning/reviews/2026-07-28.md
.planning/HANDOFF-CODE-2026-07-28.md
```

---

## 1. Qué cambió en las reglas hoy y cómo afecta al código

Tres cambios editoriales entraron a `cli/rules/` y **el código debe tolerarlos y respetarlos**. No son opcionales: uno de ellos corrige un falso positivo real del motor.

| Cambio | Archivo | Implicación para el código |
|---|---|---|
| **Bloque nuevo `international_transfer.adequacy_decisions`** con la adecuación UE (Res. CD/ANPD 32/2026) | `cli/rules/latam/brasil.json` | El `applies_when` de `lgpd_uncontrolled_transfer` ahora excluye destinos con adecuación vigente. **Caso de test obligatorio:** proyecto BR con transferencia a la UE y sin SCCs **no** debe activar el penalizador. Antes lo activaba — era un falso positivo. |
| **Bloque nuevo `adjacent_regimes`** (Ley 2573/2026, identidad digital) | `cli/rules/latam/colombia.json` | Trae `scoring_treatment.generates_penalizer: false`. El motor **no** debe derivar penalizadores de este bloque. Es contexto informativo, con alcance sectorial (telco, financiero/crediticio, comercio con crédito) y `enforcement_date: 2026-11-19`. |
| **Bloque nuevo `pending_verification`** con 4 gaps | `cli/rules/us/state-matrix.json` | Metadato editorial: el loader debe ignorarlo sin romper. El `count` sigue en **19** a propósito — no lo "corrijas" a 20 en código. |

`node scripts/validate.js` pasa 14/14 con estos cambios (sin errores de schema).

---

## 2. PR 3A — F_rigor correcto (bloqueante)

**Tickets:** MOTOR-01 · **MOTOR-04 (fix T1, bloqueante)** · MOTOR-05 · regresión LGPD.

**El bug que se está corrigiendo (T1):** hoy conviven dos modelos de rigor. `region-factors.json` da a Brasil 1.15 y a Ecuador 1.00; el fallback de `skills/audit/SKILL.md` les da 1.25 a ambos. Y tres penalizadores BE (DPO +15, base legal +20, brechas +15) están condicionados a `F_rigor == 1.25`. Si se cablea `region-factors.json` sin el fix, **Brasil deja de activar sus penalizadores LGPD** — exactamente donde más aplican. Por eso MOTOR-01 no se mergea sin MOTOR-04.

**Cómo se corrige:** lista `strict_regimes` en `region-factors.json`; los penalizadores se condicionan por **pertenencia a esa lista**, nunca por comparación numérica de F_rigor. Chile entra a la lista por fecha (no-estricto antes del 2026-12-01, estricto después).

**MOTOR-05 (Ecuador):** la decisión jurídica es de Cowork y sigue abierta. Implementa el **default seguro**: o Ecuador queda estricto, o el output emite un `assumptions[]` visible. Nunca debilitar el rigor en silencio. Insumo con evidencia y recomendación razonada: `knowledge/insumos/ecuador-spdp-2026.md` §4.

**Criterios de aceptación:** ver MOTOR-01/04/05 en `.planning/REQUIREMENTS.md`. Añadir a la batería el caso BR→UE del §1.

---

## 3. PR 3B — USA multi-estatal + DevOps

**Tickets:** MOTOR-02 (escalado +0.02/estado, cap 1.20) · MOTOR-03 · MOTOR-06 · MOTOR-08.

**Corrección importante para MOTOR-03:** el penalizador `us_multistate_exposure` **ya existe** en `cli/rules/us/usa-federal.json` (línea ~159, score 10, pillar `both`). Es **cableado, no creación** — no lo dupliques ni lo redefinas en código.

**MOTOR-06 (DevOps):** respeta `inverted: true` (esos penalizan cuando el config_key es `true`) y la semántica del cap ya ratificada en el ADR de MOTOR-07: `min(sum, 30)` sumado a `be_raw` **antes** del `min(50)` del pilar.

---

## 4. Restricciones de gobernanza (no negociables)

1. La fórmula del score vive **solo** en `cli/src/engine`. Nada de duplicarla.
2. **Prohibido editar sustancia legal** en `cli/rules/**/*.json`. Si el motor necesita un campo distinto o un dato que no está, se pide a Cowork — no se escribe allá.
3. **Prohibido tocar** `docs/SOURCES-VALIDATION.md`, `docs/NORMAS-CITADAS.md`, `docs/VIGILANCIA-NORMATIVA.md` y `knowledge/insumos/**`.
4. **Prohibido promover** `review_status` a `validated` (exige revisor humano identificado).
5. Docs en español; disclaimers intactos; commits atómicos por ticket; PR hacia `main`, sin push directo.

---

## 5. Verificación de cierre

`npm run build` + `npm test` en `cli/` · `node scripts/validate.js` sin errores · corrida manual `npx . audit --config --json` contra un fixture, validando el resultado contra `architecture/AGENT-CONTRACT.md` · grep que confirme **cero** comparaciones numéricas de F_rigor en `cli/src`.

---

## 6. Documentación de referencia (orden de lectura)

| # | Documento | Para qué |
|---|---|---|
| 1 | `.planning/REQUIREMENTS.md` | Catálogo de tickets con criterios de aceptación observables (sección MOTOR) |
| 2 | `.planning/reviews/2026-07-28.md` | Estado actual, avance y desviaciones |
| 3 | **Este handoff** | Qué cambió hoy en las reglas y cómo afecta al motor |
| 4 | `architecture/AGENT-CONTRACT.md` | Contrato JSON CLI↔LLM (findings, campos, exit codes) |
| 5 | `PLAN-INVESTIGACION-JURIDICA-Y-ANTIPATRONES-2026-07.md` | Hallazgos T1–T5 — el T1 es el bug que corrige MOTOR-04 |
| 6 | `PROMPTS-CLAUDE-CODE-2026-07.md` (Addendum H0–H4) | Contexto histórico de las sesiones A–G |
| 7 | `cli/rules/risk-engine/region-factors.json` + `devops-penalizers.json` | Los dos JSON que se cablean en esta fase |
| 8 | `knowledge/insumos/ecuador-spdp-2026.md` §4 | Evidencia y recomendación para el default de MOTOR-05 |
| 9 | `CLAUDE.md` | Política de modelos y restricciones permanentes del repo |

---

*Handoff del Arquitecto. El contenido legal referido no constituye asesoría jurídica.*
