# Requirements: Privacy Compliance Skills v0.4.0

**Defined:** 2026-07-23
**Core Value:** La skill `/audit` + CLI no solo diagnostica: actúa — loop accionable estilo react-doctor con la CLI como única implementación del score, sirviendo al humano (terminal) y al LLM (contrato JSON) a la vez.

> Catálogo generado desde: sesiones 0/A–G + addendum H0–H4 (`PROMPTS-CLAUDE-CODE-2026-07.md`), fases 1.3/2.1–2.4 (`PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md`), hallazgos T1–T5 (`PLAN-INVESTIGACION-JURIDICA-Y-ANTIPATRONES-2026-07.md`), 13 hallazgos de la crítica editorial 2026-07-23, fact-check contra el repo (11/11 confirmados) y crítico de completitud (8 gaps). Cada ticket es atómico, con criterios de aceptación observables.

## v1 Requirements (milestone v0.4.0)

### GOB — Gobernanza e higiene

- [x] **GOB-01**: Fase de higiene: commitear el diff pendiente real vía PR (reemplaza la Sesión 0 obsoleta)
  - El diff editorial pendiente HOY son **8 archivos**: 6 modificados (`PROMPTS-CLAUDE-CODE-2026-07.md`, `cli/rules/countries/{brasil,chile,mexico}.json`, `cli/rules/us/state-matrix.json`, `docs/SOURCES-VALIDATION.md`) + 2 nuevos sin trackear (`docs/NORMAS-CITADAS.md`, `docs/VIGILANCIA-NORMATIVA.md`). En el working tree coexisten además los **artefactos de planeación** de este plan (`.planning/`, `CLAUDE.md`, `AGENTS.md`, `PLAN-GSD-V0.4-2026-07.md`, `architecture/SKILL-AUDIT-V4-DESIGN.md`): van en un commit separado, nunca mezclados con el editorial.
  - Criterios: dos commits en `rebrand-refs-sweep-2026-07` — (1) **editorial** con exactamente los 8 archivos listados y mensaje que referencia las Olas 1-2 (H0), y (2) **planeación** con los artefactos GSD — con `git status` limpio tras ambos · staging explícito por ruta: prohibido `git add -A` / `git add .` · PR abierto hacia main, nunca push directo · cero `rm` de locks de `.git` ni `git gc` del guion viejo.
- [x] **GOB-02**: Marcar Sesión 0 y H0 como obsoletas en PROMPTS-CLAUDE-CODE y documentar el flujo de PR
  - Criterios: banner de obsolescencia fechado en Sesión 0 y H0 · flujo vigente documentado (rama + PR, sin manipulación de `.git`) · "orden recomendado final" actualizado sin la Sesión 0.
- [x] **GOB-03**: Truth-pass del README: corregir la tabla de cobertura de Argentina, Perú y Ecuador
  - AR/PE/EC no tienen JSON propios (solo matrices); la creación es editorial (Cowork, Ola 3) y queda FUERA de este plan.
  - Criterios: README.md y README.en.md muestran nivel honesto para AR/PE/EC · cada "✅ Reglas propias" restante corresponde a un archivo existente en `cli/rules/` · ningún ticket crea esos JSON.
- [x] **GOB-04**: Definir fuente única de versión y sincronizar los 0.x divergentes
  - Hoy: raíz 0.1.1, cli 0.2.0-beta.1, badge 0.4.0-dev. Recomendado: `cli/package.json` como fuente.
  - Criterios: doc breve que declara la fuente única y la propagación · los 3 puntos coherentes · check npm/CI que falla si divergen (verificado rompiéndolo a propósito).
- [ ] **GOB-05**: Unificar el estado de las skills en una sola tabla canónica (resuelve B3)
  - Criterios: una sola tabla con las 12 skills (incluye `data-lifecycle` y `user-controls`); README e índice la referencian sin duplicar · grep de estados sin contradicciones entre los 3 archivos · `/privacy-check` y `/risk-score` con el mismo estado en los 3 · **README.en.md espejo verificado** (misma tabla referenciada).
- [x] **GOB-06**: Documentar el workflow de verificación de pares (infraestructura del llamado a colaboradores legales)
  - El README llama a colaboradores ("no necesitas saber programar") pero no existe el flujo que seguirían.
  - Criterios: GOVERNANCE/CONTRIBUTING describe el pipeline `pending_legal_validation → verified_editorial → under_review → validated` con revisor humano identificado (`reviewed_by` + fecha en el JSON) · issue template "revisión legal" commiteado. (El enlace desde la ruta `/contribuir` es criterio de WEB-03, Fase 7 — no gate de esta fase.)

### ESTR — Estructura tri-bloque de reglas

- [x] **ESTR-01**: Crear `cli/rules/eu/` y mover `international/gdpr.json` → `eu/gdpr.json`
  - Criterios: archivo movido y validando contra su schema desde la nueva ruta · `international/` sin gdpr.json · rename preservado en git log.
- [x] **ESTR-02**: Crear `cli/rules/latam/` y mover `countries/*.json` (colombia, mexico, brasil, chile, _template)
  - Criterios: `latam/` contiene exactamente lo que hoy está en `countries/` y `countries/` desaparece · cada JSON valida desde la nueva ruta · cero placeholders de AR/PE/EC.
- [x] **ESTR-03**: Actualizar loaders y referencias de rutas en `cli/src` al layout eu/us/latam
  - Criterios: build y tests verdes · smoke run de audit carga eu/, us/ y latam/ · grep de `rules/countries|rules/international` en código/scripts/docs técnicos = cero resultados activos.

### MOTOR — Motor de score (F_rigor, strict_regimes, USA, DevOps)

- [x] **MOTOR-01**: El scorer lee `region-factors.json` como fuente de F_rigor con resolución peor-caso
  - Criterios: CO+BR+UE → F_rigor 1.25 · cambiar el JSON cambia el score sin tocar código · cero tablas de F_rigor duplicadas en `cli/src` (grep).
- [x] **MOTOR-02**: Escalado USA multi-estatal: +0.02 por estado adicional con ley integral, cap 1.20
  - Criterios: 1 estado → 1.10, 3 → 1.14, ≥6 → 1.20 · estados sin ley integral en `state-matrix.json` no incrementan · tests unitarios (QA-04).
- [x] **MOTOR-03**: WIRING de `us_multistate_exposure` (ya existe en `usa-federal.json` — es cableado, no creación)
  - Criterios: 2+ estados sin mapear → finding con puntos/legal_refs/fix_hint del JSON existente · 1 estado → no se activa · una sola definición del penalizador.
  - **Entregado 2026-07-28 con un vacío heredado del JSON:** el wiring, la activación y el candado de ruta única están verdes, pero `usa-federal.json` **no declara `legal_refs` ni `fix_hint`** para este penalizador, así que el finding sale sin ellos. El motor tiene prohibido inventarlos (passthrough fiel) y hay un test que blinda la ausencia actual. Poblarlos es editorial: ver `.planning/EDITORIAL-BACKLOG.md` (AUD-01).
- [x] **MOTOR-04**: `strict_regimes` en `region-factors.json` y los 3 penalizadores BE condicionados por PERTENENCIA (FIX T1 — bloqueante)
  - DPO +15, base legal +20, brechas +15 nunca se condicionan a igualdad numérica de F_rigor.
  - Criterios: Brasil activa los 3 aunque F_rigor sea 1.15 · Chile no-estricto antes de 2026-12-01 y estricto después · grep: ninguna condición compara F_rigor numéricamente · MOTOR-01 no se mergea sin este ticket (mismo PR o encadenado).
- [x] **MOTOR-05**: Default seguro para Ecuador en `strict_regimes`: mantener estricto o emitir assumption visible
  - El default pendiente no puede debilitar el rigor en silencio; la decisión jurídica final es de Cowork.
  - Criterios: audit con EC → penalizadores estrictos activos O entrada explícita en `assumptions[]` · flag/comentario en el JSON referencia la decisión pendiente (T1) · test que falla si EC queda no-estricto Y sin assumption.
- [x] **MOTOR-06**: Cablear el pilar DevOps (`devops-penalizers.json`, 7 señales) al scorer, wizard y config
  - Criterios: `has_staging_env=false` y `uses_prod_data_outside_prod=true` suman +15 y +20 conforme al JSON (respetando `inverted: true`) · wizard pregunta el bloque Q9 DevOps y persiste · sub-panel "⚙️ DevOps" con subtotal · test de no-solapamiento con penalizadores BE.
- [x] **MOTOR-07**: ADR que RATIFICA y documenta la semántica del cap DevOps ya versionada en `devops-penalizers.json`
  - Fact-check: el JSON v1.0.0 ya fija el contrato numérico — `max_total: 30`, `cap_behavior: min(sum_active_devops_penalizers, 30) → se agrega a be_raw antes de min(50)` (BE sigue 0–50 con DevOps como sub-panel interno). El ADR no re-decide: ratifica, da el ejemplo numérico y reconcilia README/PILLAR-SEPARATION con esa semántica. Si el equipo editorial quisiera otra cosa, eso es un cambio al JSON en Cowork, no de este plan.
  - Criterios: ADR commiteado con la semántica ratificada, alternativas descartadas y ejemplo numérico · README y `architecture/PILLAR-SEPARATION.md` sin contradicción con los rangos · QA-03 lo referencia como precondición.
- [x] **MOTOR-08**: Soportar `standards_ref` en schema y propagarlo del JSON de reglas al output
  - La POBLACIÓN de valores (ISO/SOC2/NIST/ASVS) es editorial y queda fuera.
  - Criterios: schemas validan penalizadores con y sin el campo · passthrough al finding como `standards_refs` · cero valores inventados en código.
  - **Adelantado de la Fase 4 a la Fase 3** (PR #19): la implementación del pilar DevOps necesitaba el passthrough para no inventar campos, así que se entregó en el mismo tren. Cubierto por los tests "MOTOR-08: …" de `cli/tests/devops.test.js` (con y sin el campo) y `cli/tests/us-multistate.test.js` (penalizador que no lo declara → `undefined`, no un valor inventado).
- [ ] **MOTOR-09**: Normalizar `countries` dentro del motor, no solo en la capa de comandos *(origen: auditoría Fase 3, 2026-07-28)*
  - `calculateScore()` y `calculateDualScore()` nunca llaman `normalizeCountries()`: el único call-site vive en `cli/src/commands/audit.ts` (rama `--config`). Un consumidor que pase `["br"]` en minúsculas obtiene **F_rigor 1.00 en vez de 1.15** y pierde el régimen estricto — subreporte silencioso de riesgo. Hoy es **inalcanzable** porque el wizard y `--config` son los dos únicos puntos de entrada y ambos normalizan antes; **DOCTOR-01 abre un tercero** y lo vuelve alcanzable. Asimetría a resolver: `countIntegralStates()` **sí** normaliza internamente (por eso `['ca','va']` → 1.12 pasa), así que hoy los estados y los países se comportan distinto ante la misma entrada.
  - Criterios: `calculateScore({countries:["br"]})` y `calculateScore({countries:["BR"]})` producen F_rigor y `isStrictRegime` idénticos (test) · la normalización ocurre en un solo lugar del motor, no duplicada por call-site (grep) · un código de país inválido sigue fallando ruidosamente con el mismo criterio que hoy usa `--config` (exit 2), sin degradar a 1.00 · test de paridad países/estados que falle si una de las dos rutas deja de normalizar.

### CONTRATO — Contrato JSON v1.1 (CLI ↔ LLM)

- [ ] **CONTRATO-01**: Contrato v1.1 en `audit --json`: findings con fix_hint, config_key, evidence_needed, legal_refs
  - Criterios: output valida contra el JSON Schema del contrato commiteado · legal_refs provienen textualmente de `cli/rules/` (test) · `escalation_required=true` con score ≥71 o sensibles+menores · consumidores del --json v0.2 no se rompen (aditivo).
- [ ] **CONTRATO-02**: Campos aditivos `jurisdictions[]` y `recipe_ref` en el finding (v1.1)
  - Criterios: finding USA multiestatal lista estados en `jurisdictions[]` · `recipe_ref` nullable en el schema (gancho de la Fase AP v0.5) · `schema_version` = 1.1.
- [ ] **CONTRATO-03**: Consolidar `AGENT-CONTRACT.md` a v1.1 como fuente única del contrato
  - Hoy hay 3 fuentes divergentes (AGENT-CONTRACT v1.0, ejemplo de Fase 2.1, addendum H2).
  - Criterios: el ejemplo del doc coincide campo a campo con el output real (test de snapshot) · las otras dos fuentes remiten a él como superseded · grep de `schema_version` sin ejemplos divergentes.
  - **⚠️ Cuarta divergencia, numérica y no redaccional.** `architecture/ADR-001-devops-cap.md` documenta `combined = min(100, fe_score + be_score)` con **cap 50 por pilar antes de sumar**, mientras el motor implementa el **pool plano** de `score-formula.json` (`min(100, round((c_base + penalizersSum + devopsSubtotal) × F_rigor))`). Las funciones `calculateBackendScore`/`calculateFrontendScore` sí implementan la fórmula del ADR pero **siguen sin call-site** (código muerto). La divergencia es **preexistente a la Fase 3**.
  - **📐 Medición del 2026-08-02 (corrige la redacción anterior de este ticket).** Se ejecutaron ambas fórmulas sobre 15 escenarios nombrados y un barrido de **217.728 combinaciones**:
    - **La afirmación previa "el pool plano nunca subreporta" era FALSA.** En un **0,32 %** de los casos la fórmula del ADR da **+1 punto** sobre la viva (redondeo independiente de `fe_raw`/`be_raw` frente a redondeo conjunto). La magnitud es siempre exactamente 1 y **ningún** caso cambia de nivel de riesgo, así que la conclusión práctica se sostiene — pero la premisa, tal como estaba escrita, no.
    - **El impacto real es grande y asimétrico:** el **36,14 %** de las combinaciones cambia de nivel de riesgo, y el **100 %** de esos cambios son **alto → medio**. Cero en la dirección contraria. Cablear el ADR haría al motor estrictamente **menos** sensible al riesgo.
    - **Delta máximo: 50 puntos**, y su causa **no es DevOps** sino `c_base`: con `dataCategory: "sensitive"` (c_base 80), `be_score` satura en 50 sin un solo penalizador activo. Caso límite verificado: UE + dato sensible + **cumplimiento total** → vivo 100 (alto, escala a abogado) vs. ADR 50 (medio, no escala).
    - **El respaldo `escalation_required` no cubre el hueco:** esos casos son sensibles **sin** menores, así que pierden el gate por score sin activar el gate alterno "sensibles + menores".
  - **Recomendación con evidencia: alinear el ADR y la documentación al motor vivo**, no el motor al ADR. Si aun así se decidiera cablear el ADR, `escalation_required` debe rediseñarse **en el mismo cambio** (gate explícito por categoría de dato), o el 36 % de casos que dejan de escalar quedan sin ningún disparador de revisión humana. Ver `architecture/AGENT-CONTRACT-V1.1-DESIGN.md` §D7.
- [ ] **CONTRATO-04**: Mitigador T4: distinguir `unknown` de `absent` y etiquetar el score como cota superior
  - Criterios: llaves sin responder → `score_basis: upper_bound` (o `score_range`) + lista de llaves unknown, visible en --json y en el render · config completa → score puntual sin etiqueta · la skill reproduce la etiqueta.
  - **Constancia de la auditoría Fase 3 (2026-07-28):** hoy, bajo `--config`, una llave ausente **desactiva su penalizador en silencio** — el score sale más bajo de lo que corresponde y nada en el output lo señala. Es exactamente el subreporte de riesgo que este ticket debe cerrar, y aplica a las 9 llaves nuevas de la Fase 3B además de las clásicas. **Mitigación provisional ya implementada:** solo las **3 llaves de régimen estricto** (`has_dpo`, `has_legal_basis`, `has_breach_plan`) fallan con **exit 2** nombrando lo que falta cuando el proyecto es de régimen estricto (commit `cd92c8c`, tests en `cli/tests/config-mode.test.js`). El resto sigue degradando en silencio hasta que este ticket entregue `score_basis: upper_bound`.
- [ ] **CONTRATO-05**: Exponer `review_status` en el output: nada no-validado se presenta como autoritativo
  - Criterios: finding basado en regla `pending_legal_validation` lleva etiqueta en --json y render humano · flag global `pending_legal_validation` en el contrato · `/audit` reproduce el disclaimer.

### DOCTOR — Comando doctor (loop no interactivo)

- [ ] **DOCTOR-01**: `doctor` como wrapper delgado del MISMO engine que audit (prohibido un segundo camino — B5)
  - Criterios: misma config → `doctor --json` y `audit --config --json` idénticos (byte-a-byte tras normalizar timestamp) · revisión de imports: cero lógica de scoring propia · exit codes 0/1/2 con tests.
  - **Añadido por la auditoría Fase 3 (2026-07-28) — dos alcances extra:**
    1. **Unificar los exit codes.** Hoy `audit --config` con el archivo de configuración **ausente** sale con **1**, no con 2, pese a que 2 es el código de "configuración inválida" que ya usan `normalizeCountries()` y el gate de llaves estrictas. La tabla de exit codes vive bajo este ticket, así que aquí se congela: criterio observable → cada código (0/1/2) tiene un caso de test que lo produce, config ausente y config inválida comparten el 2, y ningún camino de error sale con 0.
    2. **Validación tipada de `legalskills.config.json`**, cubriendo `countries`, `us_states` y las **9 llaves nuevas** de la Fase 3B. Criterio: un config con un tipo equivocado (p. ej. `countries` como string, o una llave DevOps con `"true"` en vez de `true`) falla con exit 2 y mensaje que nombra la llave — nunca se ignora ni se coacciona en silencio.
  - **Dependencia que este ticket crea:** abrir un segundo punto de entrada al motor vuelve **alcanzable** el defecto de MOTOR-09 (`countries` sin normalizar). MOTOR-09 debería aterrizar antes o en el mismo tren.
- [ ] **DOCTOR-02**: `--topic` y `--baseline` con persistencia en `.legalskills/last-audit.json`
  - Criterios: `--topic consentimiento` filtra al topic · tras corregir una llave, `--baseline` reporta delta por tema · cada corrida escribe last-audit.json válido contra el schema · topic fuera del enum → error claro + exit 2.
- [ ] **DOCTOR-03**: Render estilo react-doctor (capa de presentación; no altera el contrato)
  - Patrones verificados de millionco/react-doctor: narración de autodetección, resumen por pilar antes del detalle, finding = ubicación + id namespaceado + porqué en una frase + fix_hint, truncado honesto, happy path celebrado, score al final.
  - Criterios: salida por defecto legible en ~30s con los 3-5 hallazgos top y línea "… N hallazgos más — usa --verbose" · `--verbose` expande todo · caso sin hallazgos → checklist ✓ y mensaje de listo-para-lanzar · el formato no cambia el `--json`.

### SKILL — /audit v4 y cobertura tri-bloque

- [ ] **SKILL-01**: Reescribir `/audit` como máquina de estados **S0–S7** (loop accionable con planeación explícita)
  - Protocolo del diseño v4 (`architecture/SKILL-AUDIT-V4-DESIGN.md`): S0-DETECTAR, S1-EVALUAR, S2-DIAGNOSTICAR, **S3-PLANEAR** (plan concreto por topic + aprobación explícita del usuario), **S4-CORREGIR** (ediciones reales; config_key solo con corrección material — nunca voltear la llave para bajar el score), S5-RE-EVALUAR (`doctor --baseline`), S6-DECIDIR (4 criterios de parada duros; escalamiento SIEMPRE corta hacia abogado), S7-REPORTAR. Supersede el "S0–S6" de Fase 2.3.
  - Criterios: protocolo completo con los criterios de parada · fallback etiquetado "estimado, no verificado" solo sin Node.js · Content Isolation intacto (diff) · la skill nunca recalcula si la CLI respondió · **acciones externas quedan pendientes con `evidence_needed`, jamás como resueltas sin evidencia**.
  - **Añadido por la auditoría Fase 3 (2026-07-28) — dos precisiones sobre cómo la skill lee a la CLI:**
    - **`--fail-on` es opt-in por diseño.** No existe ningún umbral 71 implícito: sin `--fail-on`, un score de 95 sale con **exit 0**, y eso es correcto. La skill debe documentarlo y **nunca inferir el veredicto del exit code**: el criterio de escalamiento se lee de `escalation_required` y `final_score` en el JSON, no de que el proceso haya salido con 0. Criterio observable: la documentación de la skill enuncia el opt-in, y una eval con score ≥71 sin `--fail-on` verifica que la skill escala igualmente pese al exit 0.
    - **Alinear la tabla de exit codes con la real, una vez DOCTOR-01 los congele** (ver el alcance añadido a DOCTOR-01). Criterio: cero divergencias entre los códigos que la skill documenta y los que produce la CLI, verificado caso por caso; este punto **depende de DOCTOR-01** y no debe resolverse antes, para no congelar una tabla que va a cambiar.
- [ ] **SKILL-02**: Sincronizar el fallback de SKILL.md y QUESTIONS.md con la escala nueva de F_rigor y strict_regimes
  - Criterios: cero condiciones "F_rigor = 1.25" (grep) · tabla del fallback coincide valor a valor con `region-factors.json` · QUESTIONS.md refleja strict_regimes y el matiz CL≥2026-12-01 · tratamiento de Ecuador según MOTOR-05.
- [ ] **SKILL-03**: Wiring del bloque USA en `/audit` y `/risk-score` (penalizadores usa-federal + matices H3)
  - Criterios: "…California…" activa los penalizadores USA vía contrato CLI · MD/MODPA: vigente 01-10-2025 pero aplica a tratamientos desde 01-04-2026 · fix_hint de transferencias BR referencia SCCs Res. 19/2024 ANPD (gracia vencida ago-2025) · IN/KY/RI (01-01-2026) desde `state-matrix.json`, no de memoria.
- [ ] **SKILL-04**: `/matriz-normativa` con 4 dimensiones nuevas y tabulación por estado desde `state-matrix.json`
  - Dimensiones: `private_right_of_action`, `opt_out_vs_opt_in`, `adequacy_transfers`, `ai_automated_decisions`.
  - Criterios: cada dimensión produce tabla UE/USA/LATAM con datos de los JSON · celda de Maryland refleja el matiz 01-04-2026.
- [ ] **SKILL-05**: Actualizar `_routing.md` y `_SKILLS-INDEX.md` con la cobertura tri-bloque
  - Criterios: routing rutea jurisdicción USA · índice lista las 4 dimensiones nuevas · sin contradicciones con la tabla canónica de GOB-05.
- [ ] **SKILL-06**: Barrido tri-bloque de skills periféricas y `prompts/` (elimina la escala vieja en ~15 archivos)
  - Verificado: el modelo binario 1.25 vive en las 6 sub-skills FE/BE, clasificar-datos, matriz-normativa, risk-score, TEST-CASES.md y `prompts/auditor-privacidad.md` (línea 72).
  - Criterios: grep de "1.25"/F_rigor en `skills/` y `prompts/` solo coincide con valores de `region-factors.json` · `auditor-privacidad.md` sincronizado o marcado deprecated con puntero a `/audit` + contrato v1.1 · cero doble-fuente-de-verdad residual (B5).
- [ ] **SKILL-07**: Ejecutar la deprecación prometida de `/privacy-check` y `/risk-score` (o decidirla por escrito)
  - README y routing prometen "se deprecará en v0.4"; ningún ticket lo ejecutaba.
  - Criterios: invocar cualquiera de las dos produce aviso de deprecación + redirección a `/audit` (routing y plugin ajustados), O decisión documentada de posponer a v0.5 con textos corregidos · resuelto antes de REL-03.

### KNOW — Formato humanos (etiquetado honesto)

- [ ] **KNOW-01**: Banner "bloque USA pendiente de incorporación" en las 4 matrices activas de `knowledge/`
  - Verificado: las matrices activas tienen cero menciones de CCPA/California; la web (WEB-01) las publicaría como espejo "veraz". La adición de la columna USA con sustancia legal es editorial (Cowork, Fase IJ) — este ticket solo etiqueta.
  - Criterios: banner visible y fechado en las 4 matrices (consentimiento-por-jurisdiccion, cookies-avisos, medidas-seguridad-minimas, sanciones-por-incidente) · cero contenido legal nuevo redactado. (Que la colección docs de la web exponga y muestre la etiqueta es criterio de WEB-01, Fase 7.)

### QA — Tests, golden files y gates de CI

- [x] **QA-01**: Script npm que valida TODOS los JSON de `cli/rules/` contra sus schemas + workflow CI
  - Criterios: `npm run validate` recorre eu/, us/, latam/ y risk-engine/ listando cobertura · usa-federal y state-matrix validan contra sus schemas · CI falla ante un JSON inválido de prueba.
- [ ] **QA-02**: Los 4 fixtures canónicos (cierra la discrepancia 3 vs 4)
  - (1) SaaS California, (2) health app UE, (3) fintech multi-estatal USA, (4) app LATAM CO+BR+CL; los fixtures 1, 4 y 2 son el eje bajo/medio/alto del loop.
  - Criterios: 4 directorios con config válida · el multi-estatal activa el escalado y `us_multistate_exposure` · el LATAM usa F_rigor 1.15 y activa strict_regimes · doc que declara el eje bajo/medio/alto.
- [ ] **QA-03**: Golden tests del contrato con inyección de reloj (resuelve `generated_at`)
  - Precondiciones: MOTOR-07 (ADR) y REL-01 (renombre) — no congelar strings viejos.
  - Criterios: dos corridas → JSON byte-a-byte idéntico bajo reloj inyectado (`LLS_FAKE_NOW` o clock inyectable) · golden files de los 4 fixtures en CI · grep: ningún golden contiene la marca vieja · mecanismo documentado en AGENT-CONTRACT.md.
  - **Añadido por la auditoría Fase 3 (2026-07-28) — higiene del reloj y frontera exacta de Chile:**
    - **Frontera de Chile.** QA-04 dejó cubiertos instantes a **12 h** de cada lado del corte, no el instante exacto. Hoy **mutar `>=` a `>` en la comparación de `strict_from` pasa en verde**. Criterio observable: tests en `2026-11-30T23:59:59.999Z` (no estricto), `2026-12-01T00:00:00.000Z` (**estricto** — el corte es inclusivo) y `2026-12-01T00:00:00.001Z` (estricto), de modo que invertir el operador rompa la suite.
    - **Higiene del reloj.** Todo test cuyo resultado dependa de la fecha debe inyectar `LLS_FAKE_NOW` explícitamente; criterio: la suite produce el mismo resultado corrida antes y después del 2026-12-01 (verificable ejecutándola con dos `LLS_FAKE_NOW` distintos). Documentar que `LLS_FAKE_NOW` con valor inválido cae a la fecha real por diseño (dirección fail-safe) y que ese contrato es intencional, no un bug.
- [x] **QA-04**: Tests unitarios de F_rigor por bloque, escalado multi-estatal y strict_regimes
  - Criterios: mono/multi-bloque, 1/3/6+ estados, BR, CL antes/después de 2026-12-01, EC según MOTOR-05 · regresión T1 explícita: input LGPD activa DPO/base legal/brechas · `npm test` verde en CI.
  - **Verificado criterio por criterio el 2026-07-28 sobre `develop` (77/77 verdes):** mono-bloque ("US solo → F_rigor 1.10", "EC solo → F_rigor 1.00 pero isStrictRegime true", "Brasil usa F_rigor 1.15 desde region-factors.json") y multi-bloque ("CO+BR+EU … → F_rigor 1.25 (peor caso)", "US+BR con 6 estados → 1.20", "US+EU → 1.25") · 1/3/6+ estados y cap a 8 (`cli/tests/us-scaling.test.js`) · BR y la regresión T1 explícita con su dirección negativa ("MOTOR-04 dirección negativa…", en los dos sitios: `calculateScore()` y `getBackendPenalizers()`) · CL antes y después del corte con `LLS_FAKE_NOW` · EC con el guard de invariante de MOTOR-05 · job `cli-tests` en `.github/workflows/validate.yml` (build + tests del CLI en PR y en push a `main` con `paths` sobre `cli/`).
  - **Refinamiento diferido a QA-03**, no gate de este ticket: la frontera exacta `2026-12-01T00:00:00Z` de Chile no está cubierta (los tests usan mediodías de cada lado).
- [ ] **QA-05**: Test de gate: ninguna regla no-validada se presenta como autoritativa
  - Criterios: fixture con reglas pending → assert del flag global y etiquetas por finding · test negativo con regla validated · REL-03 lo lista como gate obligatorio.
- [ ] **QA-06**: Tests de convergencia del loop: ≤5 iteraciones y corte por escalamiento en el caso alto
  - Criterios: bajo/medio convergen ≤5 iteraciones con deltas coherentes · fixture alto → `escalation_required=true` en la primera evaluación y corte hacia abogado.
- [ ] **QA-07**: Evals de la skill `/audit`: adherencia S0–S7, uso de CLI, evidencia y resistencia a inyección
  - Criterios: evals de adherencia estado-por-estado sobre ≥2 fixtures · score de la skill = `final_score` de la CLI · los 17 casos de inyección existentes pasan · **eval negativa: la skill rechaza "ya lo arreglé" sin evidencia (no voltea config_keys por declaración)**.
- [ ] **QA-08**: Check de CI: todo `legal_ref` emitido existe en los archivos de reglas (candado anti-alucinación)
  - Criterios: el job extrae los legal_refs de los fixtures y verifica existencia textual en `cli/rules/` · ref inventada de prueba rompe el job · integrado al workflow de QA-01.
- [ ] **QA-09**: Schema propio para `cli/rules/risk-engine/*.json` (hoy `no-schema`) *(origen: auditoría Fase 3, 2026-07-28)*
  - `node scripts/validate.js` reporta 0 errores, pero los 6 archivos de `risk-engine/` salen con la advertencia "sin schema (backlog)": **solo se verifica que parseen**. Son justamente los JSON que gobiernan el motor — su cobertura real hoy son los tests, no la validación. Defensa en profundidad que complementa (no reemplaza) el fail-loud ya implementado en los loaders.
  - Criterios: `region-factors.json` y `devops-penalizers.json` dejan de aparecer como `no-schema` en la salida de `validate.js` · el schema **exige `strict_regimes.members` no vacío y con BR y EU presentes** (borrar cualquiera de los dos hace fallar la validación) · exige `scoring_rules.max_total` **numérico** (ponerlo como string `"30"` o como `null` hace fallar) · un JSON de prueba que viole cada una de esas tres reglas rompe `validate.js` con exit ≠ 0 y mensaje que nombra el campo · el conteo de advertencias del resumen baja en consecuencia.
- [ ] **QA-10**: Test data-driven de la invariante fail-safe de `strict_regimes` *(origen: auditoría Fase 3, 2026-07-28)*
  - MOTOR-05 dejó la invariante correcta para Ecuador, pero verificada con un test específico de EC. Cuando el editorial añada otro miembro con decisión pendiente (Panamá, Perú…), nada garantiza que herede el default seguro.
  - Criterios: un solo test recorre **todos** los miembros de `strict_regimes` en `region-factors.json` y afirma que cada uno con `status: pending_editorial_decision` sale con `strict === true` **O** con `assumptions.length > 0` · el test se alimenta del JSON, sin lista de países hardcodeada (grep: cero códigos de país literales en el caso) · añadir al JSON un miembro pendiente que quede no-estricto y sin assumption hace fallar la suite (verificado rompiéndolo a propósito).
- [ ] **QA-11**: Derivar el F_rigor esperado de los tests desde `region-factors.json` *(origen: auditoría Fase 3, 2026-07-28)*
  - Los tests hoy hardcodean 1.25 / 1.15 / 1.10 como valores esperados. Eso los vuelve ciegos al fallo que MOTOR-01 pretendía hacer imposible: **una tabla duplicada en `cli/src` que divergiera del JSON pasaría build + tests + CI sin alarma**, porque test y código estarían de acuerdo entre sí y en desacuerdo con la fuente de verdad.
  - Criterios: los casos de F_rigor leen el valor esperado de `cli/rules/risk-engine/region-factors.json` en vez de literales · editar un factor en el JSON **sin tocar código ni tests** deja la suite verde (hoy la rompe), y en cambio introducir a mano una tabla divergente en `cli/src` la rompe (verificado en ambas direcciones) · se conserva al menos un test de anclaje con el valor literal, para que un JSON corrupto que devuelva 1.00 en todo no pase inadvertido.

### WEB — Sitio Astro como espejo del repo

- [ ] **WEB-01**: Content collections tipadas: skills, regions y docs leen el repo como fuente única
  - Criterios: build verde con colecciones tipadas · regions refleja exactamente `cli/rules/` (AR/PE/EC no aparecen como reglas propias) · cambiar `review_status` en un JSON cambia el dato tras rebuild · **la colección docs hereda la etiqueta de KNOW-01**.
- [ ] **WEB-02**: Reescribir `Regions.astro` y `Formats.astro` para consumir las colecciones
  - Criterios: cero datos inline (grep) · regiones muestra etiquetas de review_status · build verde ES y EN.
- [ ] **WEB-03**: Rutas `/docs`, `/docs/[skill]`, `/regiones`, `/risk-score` (KaTeX) y `/contribuir` + espejos `/en/`
  - Criterios: 10 rutas sin 404 internos · `/risk-score` renderiza la fórmula con KaTeX · `/docs/[skill]` genera página por skill · `/contribuir` enlaza el flujo de pares de GOB-06.
- [ ] **WEB-04**: Deploy con preview por PR
  - Criterios: push a main → producción · PR de prueba → URL de preview · plataforma decidida y documentada.
- [ ] **WEB-05**: Logo definitivo en el hero y favicon desde assets
  - Criterios: hero con `logo.svg` en ambas locales · favicon = `logo-mark.svg` · build verde.

### REL — Naming, distribución y release

- [x] **REL-01**: Renombre global en código, lockfiles y SVG — ANTES de congelar golden tests
  - Criterios: grep de `LegalSkillsLATAM|legalskills-latam` solo en notas históricas (incluye `prompts/`) · build/tests verdes y banner nuevo · lockfiles regenerados · QA-03 lo declara precondición.
- [x] **REL-02**: Decisión de renombre del repo GitHub y consistencia de URLs
  - Criterios: decisión documentada (ADR corto) · URLs de README(s), `web/src/config.ts` y `plugin.json` apuntan a la canónica y responden 200 · git remote coincide.
- [ ] **REL-03**: Release v0.4.0: versión sincronizada, ROADMAP, tag y release notes con declaración de validación pendiente
  - Criterios: tag v0.4.0 con sección "Estado de validación legal" enumerando reglas `pending_legal_validation` · versión coherente en fuente única, badge y npm (check GOB-04 verde) · CI completo verde en el commit taggeado · **README.en.md espejo verificado**.
- [ ] **REL-04**: Distribución del formato máquinas: tarball npm + plugin de Claude verificados (publicación con gate humano)
  - Criterios: `npm pack` + instalación local del tarball con el name nuevo y smoke `npx . audit --config --json` contra fixture · smoke-test del plugin (`.claude-plugin`) desde el repo renombrado con invocación real de `/audit` · `npm publish` documentado como paso manual que requiere aprobación explícita del maintainer.

## v2 Requirements (v0.5 — diferidos, trackeados)

### Motor y CLI (patrones react-doctor de segunda ola)

- **V2-01**: `--diff main` / baseline por PR: reportar solo violaciones nuevas del cambio (adopción en repos con deuda legal preexistente).
- **V2-02**: `--score` (solo el número, para gates shell) y `legal-audit ci install` (workflow de GitHub Actions con comentario de score en el PR).
- **V2-03**: Supresiones auditables con justificación obligatoria + `--explain` (audit trail para regulador/due diligence).
- **V2-04**: Pasada rápida determinista vs análisis profundo `--deep` (dos capas de latencia).

### Editorial (corre en Cowork — fuera de las sesiones de código)

- **V2-05**: Fase AP: catálogo `knowledge/anti-patterns/` (12 semillas) + skill `/fix` consumiendo `recipe_ref`.
- **V2-06**: Fase IJ Ola 3: `argentina.json`, `peru.json`, `ecuador.json`, `panama.json` + tablas de fuentes; decisión F_rigor de Ecuador.
- **V2-07**: Columnas USA con sustancia legal en las matrices de `knowledge/` (hoy solo etiquetadas por KNOW-01).
- **V2-08**: Iteración 2 del eval de `/audit`: score con intervalo de confianza (más allá del mitigador CONTRATO-04).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Crear/editar sustancia legal en `cli/rules/**/*.json` | Gobernanza: solo el equipo editorial (Cowork) redacta reglas; las sesiones de código hacen estructura y wiring |
| Promover `review_status` a `validated` | Requiere revisor humano identificado (GOB-06 define el flujo, no lo ejecuta) |
| Modificar `docs/SOURCES-VALIDATION.md` / `docs/NORMAS-CITADAS.md` | Artefactos de la validación editorial 2026-07 — solo lectura |
| API / SaaS | Fase 3 del roadmap general del proyecto |
| Duplicar la fórmula del score fuera de `cli/src/engine` | Restricción de arquitectura (B5); el fallback editorial de la skill se etiqueta "estimado" |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| GOB-01 | Phase 1 | Complete |
| GOB-02 | Phase 1 | Complete |
| GOB-03 | Phase 1 | Complete |
| GOB-04 | Phase 1 | Complete |
| GOB-06 | Phase 1 | Complete |
| MOTOR-07 | Phase 1 | Complete |
| REL-01 | Phase 1 | Complete |
| REL-02 | Phase 1 | Complete |
| ESTR-01 | Phase 2 | Complete |
| ESTR-02 | Phase 2 | Complete |
| ESTR-03 | Phase 2 | Complete |
| QA-01 | Phase 2 | Complete |
| MOTOR-01 | Phase 3 | Complete |
| MOTOR-02 | Phase 3 | Complete |
| MOTOR-03 | Phase 3 | Complete |
| MOTOR-04 | Phase 3 | Complete |
| MOTOR-05 | Phase 3 | Complete |
| MOTOR-06 | Phase 3 | Complete |
| MOTOR-08 | Phase 3 | Complete — adelantado desde la Phase 4 (PR #19) |
| QA-04 | Phase 3 | Complete |
| CONTRATO-01 | Phase 4 | Pending |
| CONTRATO-02 | Phase 4 | Pending |
| CONTRATO-03 | Phase 4 | Pending |
| CONTRATO-04 | Phase 4 | Pending |
| CONTRATO-05 | Phase 4 | Pending |
| MOTOR-09 | Phase 4 | Pending — abierto por la auditoría Fase 3 |
| DOCTOR-01 | Phase 5 | Pending |
| DOCTOR-02 | Phase 5 | Pending |
| DOCTOR-03 | Phase 5 | Pending |
| QA-02 | Phase 5 | Pending |
| QA-03 | Phase 5 | Pending |
| QA-05 | Phase 5 | Pending |
| QA-06 | Phase 5 | Pending |
| QA-08 | Phase 5 | Pending |
| QA-09 | Phase 5 | Pending — abierto por la auditoría Fase 3 |
| QA-10 | Phase 5 | Pending — abierto por la auditoría Fase 3 |
| QA-11 | Phase 5 | Pending — abierto por la auditoría Fase 3 |
| SKILL-01 | Phase 6 | Pending |
| SKILL-02 | Phase 6 | Pending |
| SKILL-03 | Phase 6 | Pending |
| SKILL-04 | Phase 6 | Pending |
| SKILL-05 | Phase 6 | Pending |
| SKILL-06 | Phase 6 | Pending |
| SKILL-07 | Phase 6 | Pending |
| KNOW-01 | Phase 6 | Pending |
| GOB-05 | Phase 6 | Pending |
| QA-07 | Phase 6 | Pending |
| WEB-01 | Phase 7 | Pending |
| WEB-02 | Phase 7 | Pending |
| WEB-03 | Phase 7 | Pending |
| WEB-04 | Phase 7 | Pending |
| WEB-05 | Phase 7 | Pending |
| REL-03 | Phase 8 | Pending |
| REL-04 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: **54 total** (50 iniciales + 4 abiertos por la auditoría de la Fase 3: MOTOR-09, QA-09, QA-10, QA-11)
- Mapped to phases: 54
- Unmapped: 0
- Completos: **20** (Fases 1–3) · Pendientes: **34** (Fases 4–8)

Por fase: Phase 1 → 8/8 · Phase 2 → 4/4 · Phase 3 → 8/8 (incluye MOTOR-08, adelantado desde la Phase 4) · Phase 4 → 0/6 · Phase 5 → 0/11 · Phase 6 → 0/10 · Phase 7 → 0/5 · Phase 8 → 0/2.

---
*Requirements defined: 2026-07-23*
*Last updated: 2026-07-28 — cierre de la Fase 3: 8 tickets entregados y verificados sobre `develop` (77/77 tests, `validate.js` 14/14 sin errores), más los 4 tickets y las 6 anotaciones derivados de la auditoría adversarial de cierre (`.planning/AUDITORIA-FASE-3-2026-07-28.md`).*
