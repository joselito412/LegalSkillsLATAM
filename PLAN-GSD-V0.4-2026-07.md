# PLAN GSD — Milestone v0.4.0 (loop accionable estilo react-doctor)
**Privacy Compliance Skills — UE · USA · LATAM**

> Elaborado: 2026-07-23 · Estado: 📋 Listo para ejecutar (`/gsd-plan-phase 1`)
> **Supersede como documento de ejecución a:** `PROMPTS-CLAUDE-CODE-2026-07.md` (sesiones 0/A–G + addendum H0–H4), la secuenciación de `PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md` (fases 1.3, 2.1–2.4) y la secuencia integrada §5 de `PLAN-INVESTIGACION-JURIDICA-Y-ANTIPATRONES-2026-07.md`. Esos documentos siguen siendo la fuente de los hallazgos (T1–T5, B1–B5, H0–H4); la ejecución vive aquí y en `.planning/`.

---

## 1. Qué cambió respecto al plan anterior (y por qué)

El plan de sesiones A–G era correcto en sustancia pero tenía cuatro problemas que este plan corrige:

1. **Obsolescencia**: la Sesión 0 instruía push directo a main y manipulación de `.git` sobre un estado del repo que ya no existe. → Reemplazada por GOB-01/GOB-02 (rama + PR, diff editorial real de 8 archivos, en commit separado de los artefactos de planeación).
2. **Decisiones tardías**: el renombre (G) y el cap DevOps llegaban DESPUÉS de congelar golden tests (E), forzando regeneración. → La Fase 1 concentra todas las decisiones que congelan interfaces; los golden tests (Fase 5) llegan al primer momento seguro.
3. **README sobrevendido**: afirmaba reglas propias para AR/PE/EC que no existen. → Truth-pass GOB-03 en la Fase 1; la creación de esos JSON queda explícitamente en Cowork (Fase IJ Ola 3).
4. **QA al final**: toda la red de seguridad vivía en la sesión E. → El QA se distribuye junto a la capa que verifica: candado de schemas en Fase 2, regresión T1 en Fase 3, snapshot del contrato en Fase 4, goldens/gates en Fase 5, evals de skill en Fase 6.

## 2. Artefactos del plan (dónde vive cada cosa)

| Artefacto | Contenido |
|---|---|
| `.planning/PROJECT.md` | Contexto, valor central, restricciones, decisiones clave |
| `.planning/REQUIREMENTS.md` | **50 tickets** por tema (GOB, ESTR, MOTOR, CONTRATO, DOCTOR, SKILL, KNOW, QA, WEB, REL) con criterios de aceptación observables + trazabilidad + backlog v0.5 |
| `.planning/ROADMAP.md` | **8 fases** con objetivos, dependencias, criterios de éxito y política de modelos por fase |
| `.planning/STATE.md` | Posición actual y contexto acumulado |
| `architecture/SKILL-AUDIT-V4-DESIGN.md` | Diseño completo de la skill `/audit` v4: frontmatter, progressive disclosure, máquina S0–S7, UX de ambos clientes, 12 patrones react-doctor, 4 evals + eval de evidencia, 8 triggers negativos |
| `CLAUDE.md` / `AGENTS.md` | Política de optimización de tokens (Fable 5 / Opus / Sonnet) y restricciones permanentes |

## 3. Las 8 fases en una vista

```
F1 Higiene+decisiones+renombre ──► F2 Layout tri-bloque+schemas ──► F3 Motor (T1, USA, DevOps)
                                            │                              │
                                            └────► F7 Web (paralelizable) ─┼─────────────┐
                                                                           ▼             │
                                   F4 Contrato v1.1 ──► F5 Doctor+goldens ──► F6 Skills  │
                                                                              │          │
                                                                              ▼          ▼
                                                                        F8 Release v0.4.0
```

| Fase | Entrega | Tickets | Gate de cierre |
|---|---|---|---|
| 1. Higiene, decisiones y renombre | Repo limpio, ADR cap DevOps ratificado, marca nueva, README veraz, flujo de pares documentado | 8 | PR mergeado + check de versiones + grep de marca |
| 2. Layout tri-bloque + schemas | `eu/ us/ latam/` + `npm run validate` en CI | 4 | Smoke run + CI falla ante JSON inválido |
| 3. Motor completo | F_rigor desde JSON, **fix T1 strict_regimes**, escalado USA, DevOps cableado | 7 | Regresión T1 (LGPD activa los 3 BE) en verde |
| 4. Contrato v1.1 | `audit --json` completo; AGENT-CONTRACT.md fuente única | 6 | Snapshot del ejemplo = output real |
| 5. Doctor + fixtures + goldens | `doctor --topic/--baseline`, render react-doctor, 4 fixtures, goldens con reloj inyectado | 8 | Goldens byte-a-byte + gates anti-alucinación/anti-autoritativo |
| 6. Skills S0–S7 tri-bloque | `/audit` v4 accionable, barrido de escala vieja, deprecaciones, matrices etiquetadas | 10 | Evals de adherencia/evidencia + 17 casos de inyección |
| 7. Web espejo del repo | Collections + 10 rutas + deploy con preview | 5 | "Cambiar un JSON cambia la web" verificado |
| 8. Release v0.4.0 | Tag + release notes honestas + tarball/plugin verificados | 2 | CI completo verde; npm publish con gate humano |

**Paralelización**: la Fase 7 solo depende de la 2 — puede correrla un agente separado (worktree) mientras avanzan 3–6; su merge final ocurre después de la 6. Dentro de cada fase, `/gsd-execute-phase` paraleliza planes por olas.

## 4. Cómo ejecutar (comandos GSD)

```bash
# Por cada fase N = 1..8:
/gsd-discuss-phase N        # opcional: aterrizar gray areas (usa --auto para defaults)
/gsd-plan-phase N           # Opus (gsd-planner) produce PLAN.md con verificación
/gsd-execute-phase N        # Sonnet (gsd-executor) ejecuta con commits atómicos
/gsd-verify-work            # UAT conversacional del resultado de la fase
# Al terminar la 8:
/gsd-audit-milestone && /gsd-complete-milestone
```

Reglas de proceso (de `CLAUDE.md` y `PROJECT.md`):
- **Política de modelos**: Fable 5 = decisiones de arquitectura y bloqueos lógicos (ADRs de F1, semántica del contrato en F4, protocolo S0–S7 en F6); Opus = planear fases y validar resultados; Sonnet = editar código, correr builds y diseñar tests. Pasar `model` explícito al spawnear (los tier-opus de GSD resuelven a `inherit`).
- Commits atómicos por ticket/plan; build + tests verdes antes de cada commit; PR al cierre de cada fase; nunca push directo a main.
- La CLI es la única implementación del score. Cero sustancia legal nueva en sesiones de código. `docs/SOURCES-VALIDATION.md` y `docs/NORMAS-CITADAS.md` intocables. Docs en español, disclaimers intactos.

## 5. Riesgos del roadmap (con mitigación de diseño)

1. **MOTOR-01 se mergea sin MOTOR-04 y Brasil pierde los penalizadores estrictos** → mismo PR o PRs encadenados (regla en el criterio de MOTOR-04) + regresión LGPD en QA-04 dentro de la misma fase.
2. **Goldens congelados sobre marca vieja / rangos provisionales / contrato inestable** → por construcción: REL-01 y MOTOR-07 en F1, CONTRATO-03 en F4, todos antes de F5; grep de marca en CI sobre los golden files convierte la precondición en gate automático.
3. **Dependencias intra-fase ejecutadas en desorden** → cada fase declara su orden de PRs en el objetivo (F3: MOTOR-01→04; F4: CONTRATO-01 primero, 03 cierra; F5: QA-02 antes de QA-03).
4. **La web paralela se construye contra semántica no final** → WEB-01 lee `review_status` directo de los JSON (no del contrato CLI); merge final tras F6 con re-verificación del criterio de espejo.
5. **La reescritura S0–S7 degrada el Content Isolation** → QA-07 vive en la MISMA fase que SKILL-01 como gate: 17 casos de inyección + evals de adherencia antes de cerrar.
6. **El default de Ecuador debilita el rigor en silencio** → MOTOR-05 impone default seguro con test que falla si EC queda no-estricto y sin assumption; release notes declaran el estado.

## 6. El producto central: la skill que actúa

El diseño completo está en `architecture/SKILL-AUDIT-V4-DESIGN.md`. Lo esencial:

- **Dos clientes**: el humano recibe el box con paneles FE/BE/DevOps, semáforo, "Modo: CLI verificado / FALLBACK estimado" y Δ por iteración; el LLM recibe el contrato JSON v1.1 con `fix_hint`, `config_key`, `evidence_needed` y `legal_refs` — y tiene prohibido recalcular, citar de memoria o voltear config_keys sin corrección material.
- **Actuar, no solo diagnosticar**: S3-PLANEAR traduce cada fix_hint a un plan concreto (archivos, código propuesto, acciones externas con evidencia) que el usuario aprueba; S4 lo ejecuta sobre el repo real; S5 re-evalúa con `doctor --baseline`; un finding solo cuenta como corregido si la CLI lo desactiva.
- **Paralelo react-doctor exacto**: react-doctor no auto-fixea — instala una skill en el coding agent para que el agente corrija con contexto. Esa es exactamente la arquitectura CLI-diagnostica / skill-cura de este proyecto.
- **Frenos**: escalamiento (≥71 o sensibles+menores) corta el loop incluso contra la instrucción del usuario; FLAG_MINORS nunca se auto-resuelve; disclaimer siempre.

## 7. Qué queda FUERA de este milestone (y dónde vive)

| Trabajo | Dónde |
|---|---|
| Crear `argentina.json`, `peru.json`, `ecuador.json`, `panama.json` + tablas de fuentes | Cowork — Fase IJ Ola 3 |
| Catálogo de anti-patrones + skill `/fix` (consume `recipe_ref`) | Cowork/código — Fase AP, v0.5 |
| Columnas USA con sustancia legal en matrices de `knowledge/` | Cowork (v0.4 solo etiqueta: KNOW-01) |
| Decisión editorial del F_rigor de Ecuador | Cowork (v0.4 impone default seguro: MOTOR-05) |
| `--diff main`, `--score`, `ci install`, supresiones auditables, `--deep` | Backlog V2-01..04 (REQUIREMENTS.md) |
| Promoción de `review_status` a `validated` | Solo revisor humano (flujo GOB-06) |

## 8. Verificación final del milestone

```bash
cd cli && npm run build && npm test          # verde
npm run validate                             # todos los JSON contra schema
npx . audit --config --json                  # contra un fixture → valida contra AGENT-CONTRACT v1.1
grep -rn "LegalSkillsLATAM\|legalskills-latam" --exclude-dir=node_modules .   # solo notas históricas
```

Más los gates de CI: goldens byte-a-byte, candado de `legal_refs`, gate anti-autoritativo (`review_status`), convergencia del loop ≤5 iteraciones, escalamiento del fixture alto.

---

### Génesis de este plan

Generado el 2026-07-23 con un workflow multi-agente (8 agentes): extracción de tickets desde los 4 planes fuente + 13 hallazgos de crítica editorial → diseño de la skill según skill-creator → investigación UX de react-doctor (fuentes verificadas) → 2 propuestas de roadmap (riesgo-primero vs dependencias-estrictas) → juez-árbitro → validación determinista de cobertura (50/50, 0 violaciones) → fact-check adversarial contra el repo (11/11 claims confirmados, 2 conflictos corregidos) → crítico de completitud (8 gaps → 6 tickets/criterios nuevos).

> ⚠️ Guía operativa del proyecto. El contenido legal resultante no constituye asesoría jurídica y requiere validación de pares (abogados de protección de datos). Ver `DISCLAIMER.md`.
