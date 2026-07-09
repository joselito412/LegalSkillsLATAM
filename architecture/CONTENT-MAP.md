# Content Map — Inventario y Destino de Archivos
**Privacy Compliance Skills — Documento Arquitectónico**

> Elaborado: 2026-06-04  
> Versión: 1.0  
> Estado: Activo — guía de migración v0.2→v0.4

Este documento mapea cada archivo del proyecto a su pilar (Frontend/Backend/Ambos), su ubicación actual, su ubicación destino y el refactoring necesario. Es la fuente de verdad para ejecutar Fase B y Fase C del plan de separación.

---

## Leyenda

| Campo | Descripción |
|---|---|
| **Pilar** | FE = Frontend, BE = Backend, BOTH = ambos, COMMON = sin pilar (infraestructura) |
| **Estado** | MANTENER / DIVIDIR / MOVER / REFACTORIZAR / NUEVO |
| **Prioridad** | Alta / Media / Baja |

---

## Checklists (`/knowledge/checklists/`)

| Archivo | Pilar | Estado actual | Acción (Fase B) | Destino | Prioridad |
|---|---|---|---|---|---|
| `checklist-startup.md` (88 líneas) | BOTH | Mezcla UX y seguridad técnica en bloques 1–7 | DIVIDIR | Bloques 1–2 y 7 → `pillar-frontend/checklists/checklist-consentimiento.md` (~50 líneas) | Alta |
| `checklist-startup.md` | BOTH | (continúa) | DIVIDIR | Bloques 3–6 → `pillar-backend/checklists/checklist-seguridad-datos.md` (~40 líneas) | Alta |
| `checklist-datos-sensibles.md` (305 líneas) | BOTH | Items de menores, avisos especiales, almacenamiento, auditoría mezclados | DIVIDIR | Sección UI/Consentimiento → `pillar-frontend/checklists/checklist-ux-flujos.md` (~80 líneas) | Alta |
| `checklist-datos-sensibles.md` | BOTH | (continúa) | DIVIDIR | Sección técnica → `pillar-backend/checklists/checklist-datos-sensibles.md` (~225 líneas) | Alta |

**Archivos nuevos a crear en Fase B:**
- `pillar-backend/checklists/checklist-ciclo-vida.md` — retención, purga, backups (~120 líneas)
- `pillar-backend/checklists/checklist-acceso.md` — RBAC, logs, segregación (~100 líneas)
- `pillar-backend/checklists/checklist-transferencias.md` — DPA, SCCs, terceros (~80 líneas)
- `pillar-frontend/checklists/checklist-transparencia-ui.md` — política, cookies, avisos (~90 líneas)

---

## Matrices (`/knowledge/matrices/`)

| Archivo | Pilar | Contenido actual | Acción (Fase B) | Destino | Prioridad |
|---|---|---|---|---|---|
| `comparativa-consentimiento.md` | FE | Comparativa de requisitos de consentimiento por jurisdicción | MOVER | `pillar-frontend/matrices/consentimiento-por-jurisdiccion.md` | Media |
| `comparativa-derechos.md` | BOTH | Derechos ARCO por jurisdicción — mezcla UI y backend | DIVIDIR | Sección ejercicio de derechos (UX) → FE; Sección implementación técnica → BE | Media |

**Archivos nuevos a crear en Fase B:**
- `pillar-frontend/matrices/cookies-avisos.md` — tipos de cookies por jurisdicción, base legal de cada una
- `pillar-backend/matrices/sanciones-por-incidente.md` — monto de sanciones por tipo de brecha
- `pillar-backend/matrices/medidas-seguridad-minimas.md` — estándar técnico mínimo por jurisdicción

---

## Skills (`/skills/`)

| Archivo | Pilar | Contenido actual | Acción (Fase C) | Destino | Prioridad |
|---|---|---|---|---|---|
| `audit/SKILL.md` | BOTH | Auditoría completa 0–100 pts. Mezcla preguntas FE y BE en el mismo flujo | REFACTORIZAR | Bifurcar internamente: `frontend-scorer` + `backend-scorer`; output dual con paneles FE/BE separados | Alta |
| `audit/TEST-CASES.md` | BOTH | Test cases del flujo actual | ACTUALIZAR | Agregar test cases para escenarios FE-only, BE-only y combinados | Alta |
| `audit/QUESTIONS.md` | BOTH | Preguntas actuales | ACTUALIZAR | Etiquetar cada pregunta con su pilar | Media |
| `clasificar-datos/SKILL.md` | BE | Clasificación de sensibilidad de datos | MANTENER (v0.3) / DEPRECAR (v0.4) | Eventualmente absorbida por `backend-security/data-protection/SKILL.md` | Media |
| `privacy-check/SKILL.md` | BOTH | Auditoría de feature/endpoint — mezcla UX y seguridad técnica | MANTENER (v0.3) / DEPRECAR (v0.4) | Parte FE → `frontend-privacy/consentimiento/`; Parte BE → `backend-security/data-protection/` | Media |
| `privacy-check/TEST-CASES.md` | BOTH | Test cases actuales | MANTENER durante transición | — | Baja |
| `risk-score/SKILL.md` | BOTH | Motor de puntuación 0–100 | MANTENER (v0.3) / DEPRECAR (v0.4) | Absorbido por `audit` refactorizado con dos escores | Alta |
| `risk-score/TEST-CASES.md` | BOTH | Test cases de scoring | MANTENER durante transición | — | Baja |
| `derechos-usuario/SKILL.md` | BOTH | Guía ARCO — mezcla UX de solicitud y backend de procesamiento | MANTENER (v0.3) | Posible split futuro en v0.4 | Baja |
| `matriz-normativa/SKILL.md` | BOTH | Comparativa jurisdiccional | MANTENER | Sin cambios estructurales — proporciona contexto para ambos pilares | Baja |

**Archivos nuevos a crear en Fase C:**
- `frontend-privacy/consentimiento/SKILL.md` — consentimiento granular, revocación, registro
- `frontend-privacy/transparencia/SKILL.md` — política, cookies, avisos, DPO
- `frontend-privacy/user-controls/SKILL.md` — portal ARCO en UI
- `backend-security/data-protection/SKILL.md` — clasificación, cifrado, hashing, retención
- `backend-security/access-control/SKILL.md` — RBAC, logs de auditoría, segregación
- `backend-security/data-lifecycle/SKILL.md` — ciclo de vida, purga, transferencias

---

## Reglas JSON (`/cli/rules/`)

| Archivo | Pilar | Contenido actual | Acción (Fase B) | Cambio necesario | Prioridad |
|---|---|---|---|---|---|
| `countries/brasil.json` | BOTH | Penalizadores planos, sin campo `pillar` | REFACTORIZAR | Agregar campo `"pillar": "frontend"\|"backend"\|"both"` a cada penalizador | Alta |
| `countries/colombia.json` | BOTH | Penalizadores planos | REFACTORIZAR | Misma operación que brasil.json | Alta |
| `countries/mexico.json` | BOTH | Penalizadores planos | REFACTORIZAR | Misma operación que brasil.json | Alta |
| `international/gdpr.json` | BOTH | Penalizadores GDPR planos | REFACTORIZAR | Misma operación que brasil.json | Alta |
| `countries/_template.json` | COMMON | Template para nuevos países | ACTUALIZAR | Agregar campo `pillar` al template de penalizadores | Alta |
| `risk-engine/score-formula.json` | BOTH | Fórmula única 0–100 | REFACTORIZAR | Dividir en `frontend_score()` y `backend_score()` con fórmula de combinación | Alta |
| `schema/country-rules.schema.json` | COMMON | Esquema de validación v1.1 | ACTUALIZAR | Agregar campo opcional `"pillar"` en definición de penalizadores | Alta |

**Archivos nuevos a crear en Fase B:**
- `risk-engine/fe-penalizers.json` — catálogo de penalizadores Frontend (máx 50 pts)
- `risk-engine/be-penalizers.json` — catálogo de penalizadores Backend (máx 50 pts)
- `risk-engine/score-formula-v2.json` — fórmula dual con combinación ponderada

---

## CLI Source (`/cli/src/`)

| Archivo | Pilar | Contenido actual | Acción (Fase C) | Cambio | Prioridad |
|---|---|---|---|---|---|
| `engine/scorer.ts` | BOTH | Motor de puntuación monolítico | REFACTORIZAR | Extraer lógica FE y BE; mantener orquestación | Alta |
| `engine/classifier.ts` | BOTH | Clasificador de datos | ACTUALIZAR | Agregar campo `pillar` al output de clasificación | Alta |
| `engine/rules.ts` | COMMON | Cargador de reglas JSON | ACTUALIZAR | Soportar campo `pillar` en penalizadores | Media |
| `commands/audit.ts` | BOTH | Comando CLI de auditoría | ACTUALIZAR | Adaptar a output dual FE/BE | Alta |
| `ui/box.ts` | COMMON | Componente de caja visual | MANTENER | Sin cambios | Baja |
| `ui/colors.ts` | COMMON | Paleta de colores | MANTENER | Sin cambios | Baja |
| `ui/progress.ts` | COMMON | Barra de progreso | MANTENER | Sin cambios | Baja |

**Archivos nuevos a crear en Fase C:**
- `engine/frontend-scorer.ts` — calcula score 0–50 para pilar Frontend
- `engine/backend-scorer.ts` — calcula score 0–50 para pilar Backend
- `ui/frontend-report.ts` — formatea el panel de reporte Frontend
- `ui/backend-report.ts` — formatea el panel de reporte Backend

---

## Documentación (`/docs/` y raíz)

| Archivo | Acción | Cambio |
|---|---|---|
| `docs/ROADMAP.md` | ACTUALIZAR | Agregar Fases A/B/C de separación de pilares en el roadmap oficial |
| `docs/GOVERNANCE.md` | ACTUALIZAR | Agregar sección de gobernanza por pilar (owners, cadencias, validaciones) |
| `docs/CONTRIBUTING.md` | ACTUALIZAR | Agregar rutas nuevas en `knowledge/pillar-frontend/` y `knowledge/pillar-backend/` |
| `README.md` | ACTUALIZAR | Agregar sección de "Dos pilares" con enlace a `PILLAR-SEPARATION.md` |
| `PLAN-SEPARACION-PILARES.md` | MANTENER | Documento de planificación — no es contenido operativo |

---

## Dependencias entre archivos

Cambios que deben hacerse en conjunto (no se pueden hacer de forma aislada):

```
checklist-startup.md
  ↓ depende de
brasil.json, colombia.json, mexico.json  (si un penalizador cambia, el checklist debe reflejar el cambio)

brasil.json, colombia.json, mexico.json
  ↓ alimentan a
scorer.ts  (carga los penalizadores en runtime)

scorer.ts
  ↓ alimenta a
audit/SKILL.md  (el output de la skill usa los scores del motor)

audit/SKILL.md
  ↓ referencia a
checklist-startup.md, checklist-datos-sensibles.md  (como recursos de soporte)
```

**Regla:** Al refactorizar `brasil.json` para agregar campo `pillar`, hay que actualizar `scorer.ts` en el mismo PR. No separar.

---

## Estado de archivos en `_deprecated/` (plan)

Cuando se complete Fase B, estos archivos se moverán a `knowledge/_deprecated/`:
- `knowledge/checklists/checklist-startup.md` → reemplazado por FE + BE separados
- `knowledge/checklists/checklist-datos-sensibles.md` → reemplazado por FE + BE separados
- `knowledge/matrices/comparativa-consentimiento.md` → movida a `pillar-frontend/matrices/`
- `knowledge/matrices/comparativa-derechos.md` → dividida entre FE y BE

Los archivos en `_deprecated/` siguen siendo accesibles pero dejan de ser la referencia activa.

---

*Privacy Compliance Skills — [DISCLAIMER.md](../DISCLAIMER.md)*  
*Elaborado: 2026-06-04 | Estado: Activo*
