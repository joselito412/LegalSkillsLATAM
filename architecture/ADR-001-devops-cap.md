# ADR-001: El sub-panel DevOps es interno al Pilar Backend, con cap propio de 30 pts sumado antes del min(50)

**Privacy Compliance Skills — Architecture Decision Record**

> Elaborado: 2026-07-23
> Estado: ✅ Aceptado — **ratifica** un contrato numérico ya versionado en `cli/rules/risk-engine/devops-penalizers.json` v1.0.0; no introduce una decisión jurídica ni de producto nueva.
> Relacionado: MOTOR-06 (wiring al scorer, Fase 3 — pendiente), MOTOR-07 (este ADR, Fase 1), QA-03 (golden tests que congelan esta semántica, Fase 5)

---

## Contexto

El Legal Risk Score separa el riesgo en dos pilares explícitos, **Frontend** y **Backend**, cada uno con rango **0–50 pts**, que se suman en un combinado **0–100** (`combined = min(100, fe_score + be_score)`). Esto está documentado en el README (§ "Dos Pilares") y en `architecture/PILLAR-SEPARATION.md`, y es parte del contrato `--json` ya estable (`architecture/AGENT-CONTRACT.md` § "Reglas de compatibilidad": *"el output `--json` actual (v0.2) sigue siendo válido... la escala 0-100 no cambia"*).

Se identificó un tercer eje de riesgo — **DevOps/SDLC** (entornos de staging, datos de producción fuera de producción, gestor de secretos, PII en logs, escaneo de dependencias, backups probados, gate de riesgo en CI) — que no encaja como Frontend (no es algo que el usuario ve o decide) pero tampoco es exactamente la clasificación/cifrado/RBAC clásicos de Backend. Aun así, comparte el mismo owner (CTO + Security/DevOps Lead) y las mismas normas de base (GDPR Art. 25 y 32, LGPD Art. 46) que el resto de Backend — ver `knowledge/matrices/matriz-sdlc-cumplimiento.md`.

`cli/rules/risk-engine/devops-penalizers.json` v1.0.0 (generado 2026-07-08, `review_status: pending_legal_validation`) ya fija 7 penalizadores DevOps (5–20 pts cada uno) y, en su bloque `scoring_rules`, el contrato numérico de cómo se integran:

```json
"pillar": "devops",
"rolls_up_to": "backend",
"max_score": 30,
"scoring_rules": {
  "max_total": 30,
  "cap_behavior": "min(sum_active_devops_penalizers, 30) → se agrega a be_raw antes de min(50)"
}
```

Ese JSON es contenido editorial válido, pero **todavía no está wireado al scorer** (`cli/src/` no tiene referencias a `devops` al momento de este ADR — el wiring es MOTOR-06, Fase 3) y el README / `PILLAR-SEPARATION.md` no mencionan DevOps en su tabla de rangos. Sin un documento que fije esto, dos lecturas del repo pueden divergir: ¿DevOps es un tercer pilar independiente? ¿Extiende Backend a un rango mayor? ¿Se trunca en silencio sin que se note de dónde vino el riesgo?

Este ADR cierra esa ambigüedad **ratificando** la semántica que el JSON ya declara — no decide nada nuevo. Si el equipo editorial quisiera un modelo distinto (otro cap, otro rollup), eso es un cambio al JSON en Cowork, no una revisión de este documento (ver "Nota final" abajo).

## Decisión

1. **DevOps no es un tercer pilar.** Es un **sub-panel interno del Pilar Backend**. `devops-penalizers.json` lo declara explícitamente: `"rolls_up_to": "backend"`.
2. **Backend se mantiene 0–50.** No se amplía su rango para "darle espacio" a DevOps.
3. **El sub-panel DevOps tiene su propio cap de 30 pts**, aplicado a la suma de sus penalizadores activos ANTES de tocar a Backend.
4. **El subtotal DevOps ya capeado (≤30) se suma a `be_raw`** — es decir, entra en el cálculo de Backend *antes* del `min(50)` general de ese pilar, no por fuera ni después.
5. El score combinado 0–100 **no cambia de fórmula**: `combined = min(100, fe_score + be_score)`.
6. El output (CLI y skill) sigue **mostrando DevOps como panel visual propio "⚙️ DevOps"** con su subtotal — eso es presentación, no altera el número que ya quedó sumado dentro de `be_score`. `architecture/AGENT-CONTRACT.md` ya prototipa esto: `"pillars": { "fe": 25, "be": 37, "devops_sub": 15 }` — `devops_sub` es informativo, `be` ya lo incluye.

Formalmente, esto extiende la fórmula de Backend de `cli/rules/risk-engine/score-formula-v2.json` así:

```
devops_raw     = sum(active_devops_penalizers.score)
devops_capped  = min(devops_raw, 30)                          # cap interno del sub-panel
be_raw         = c_base + sum(active_be_penalizers.score) + devops_capped
be_score       = min(50, be_raw × F_rigor)                    # cap del pilar Backend
```

## Ejemplo numérico completo

Los tres casos usan `F_rigor = 1` por claridad (el multiplicador de `region-factors.json` se aplicaría igual que a cualquier otro componente de `be_raw`).

| Caso | BE clásico (`c_base` + penalizadores BE) | DevOps activo (suma real) | DevOps capeado (`min(·,30)`) | `be_raw` total | `BE_score = min(be_raw, 50)` | ¿Qué cap actuó? |
|---|---|---|---|---|---|---|
| 1 — el del ticket | 35 | 25 | 25 (no llega a 30) | 60 | **50** | Solo el cap externo de BE (60→50); el sub-panel DevOps no truncó nada |
| 2 — sin truncar | 10 | 12 | 12 (no llega a 30) | 22 | **22** | Ninguno — puramente aditivo |
| 3 — cap DevOps aislado | 5 | 90 (los 7 penalizadores activos: 15+20+20+10+10+10+5) | 30 | 35 | **35** | Solo el cap interno de DevOps (90→30); el cap de BE (50) no se activó |

El Caso 3 es el que justifica que DevOps tenga **su propio** cap de 30 y no dependa solo del cap general de 50: sin él, un proyecto con los 7 hallazgos DevOps activos a la vez (90 pts reales) opacaría o saturaría por completo cualquier otro penalizador clásico de Backend en el mismo `be_raw`.

## Alternativas descartadas

**(a) Ampliar Backend a 0–80 (o un rango mayor) para darle a DevOps espacio propio sin capearlo dentro de BE.**
Descartada: rompe la simetría **Frontend 0–50 / Backend 0–50** que documentan el README ("Dos Pilares") y `architecture/PILLAR-SEPARATION.md`, y rompe la compatibilidad hacia atrás del contrato `--json` v0.2 (`AGENT-CONTRACT.md` § "Reglas de compatibilidad": la escala 0–100 no cambia). Cambiar el rango de un pilar es un cambio incompatible de `schema_version`, no algo que un ADR de ratificación deba introducir por su cuenta.

**(b) Sumar DevOps directamente a `be_raw` sin cap propio ni sub-panel visible (se deja que el `min(50)` general de BE trunque todo junto, en silencio).**
Descartada: pierde la visibilidad del eje DevOps que el propio `devops-penalizers.json` pide explícitamente (*"el output los muestra en sub-panel propio '⚙️ DevOps'"*) y que `AGENT-CONTRACT.md` ya prototipa con la llave `devops_sub`. Sin cap ni subtotal propio, un equipo no podría distinguir si su Backend está en 50 por cifrado/RBAC deficientes o por higiene de pipeline deficiente — son remediaciones y owners distintos (Security Lead de datos vs. DevOps Lead de pipeline) aunque ambos caigan bajo el mismo pilar.

**(c) DevOps como tercer pilar totalmente independiente (p. ej. 0–33 / 0–33 / 0–34).**
Descartada: el propio JSON declara `"rolls_up_to": "backend"`, no un rollup directo al combinado. Además el owner (CTO + Security/DevOps Lead) y la norma aplicable (GDPR Art. 25/32, LGPD Art. 46) son los mismos que Backend — no hay un dominio nuevo con abogado validador propio que justifique un tercer pilar con su propia fila en la tabla de owners de `PILLAR-SEPARATION.md`.

## Consecuencias

- Los **golden tests de QA-03** (Fase 5) deben congelar esta semántica: fixtures con distintas combinaciones de penalizadores DevOps activos/inactivos tienen que producir el mismo `be_raw` / `be_score` / `devops_sub` byte-a-byte bajo reloj inyectado. QA-03 declara este ADR como precondición (ver `.planning/REQUIREMENTS.md`, ticket QA-03).
- **MOTOR-06** (Fase 3, aún no ejecutado al momento de este ADR) implementa el wiring real en `cli/src/` siguiendo esta fórmula; este ADR no lo hace — el JSON existe y su contrato queda ratificado, pero el scorer todavía no lo lee.
- Cualquier `finding` con `topic: "devops"` en el contrato JSON (ya declarado como topic válido en `AGENT-CONTRACT.md`) se comporta como cualquier otro finding del loop `/audit` S0–S7 — tiene `fix_hint`, `config_key`, `legal_refs` — solo cambia a qué subtotal contribuyen sus puntos (`devops_capped`, dentro de `be_raw`).
- El wizard/config de MOTOR-06 debe persistir las 7 llaves ya documentadas en `AGENT-CONTRACT.md` § "Nuevas llaves de `legalskills.config.json` (sub-pilar DevOps)".
- README (§ "Dos Pilares") y `architecture/PILLAR-SEPARATION.md` (§ "Riesgo asignado" de Backend) reciben una línea aclaratoria mínima que enlaza a este ADR, para que la tabla de rangos no quede en contradicción implícita con el JSON.

## Fuente del contrato numérico

El contrato numérico (`max_total: 30`, `cap_behavior`, los 7 penalizadores individuales y sus `score` / `config_key` / `inverted`) vive **exclusivamente** en [`cli/rules/risk-engine/devops-penalizers.json`](../cli/rules/risk-engine/devops-penalizers.json). Este ADR no duplica esos valores como si fueran una fuente independiente — los cita para explicar su encaje arquitectónico. Ante cualquier discrepancia futura entre este documento y el JSON, **el JSON es la fuente de verdad**, igual que para cualquier otro penalizador del repo (ver [`docs/GOVERNANCE.md`](../docs/GOVERNANCE.md)).

## Nota final

Cualquier cambio de fondo a estos números — el cap de 30, los scores individuales de cada penalizador, qué señales existen o cómo se agrupan — es un **cambio editorial al JSON**, hecho en Cowork por el equipo editorial siguiendo su flujo de revisión de pares (ver `docs/GOVERNANCE.md` § "Flujo de validación de pares"). No es un cambio de código, y no requiere reabrir este ADR. Este documento solo se revisaría si cambiara la **arquitectura de integración** en sí (p. ej., que DevOps dejara de sumar a Backend y pasara a ser un pilar independiente) — no por el ajuste puntual de un score.

---

*Privacy Compliance Skills — [DISCLAIMER.md](../DISCLAIMER.md)*
*Elaborado: 2026-07-23 | Estado: Activo*
