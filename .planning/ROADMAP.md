# Roadmap: Privacy Compliance Skills v0.4.0

## Overview

Ocho fases llevan el repo del diagnóstico one-shot actual al loop accionable estilo react-doctor: primero se toman de una sola vez todas las decisiones que congelan interfaces (higiene, ADR del cap DevOps, renombre de marca), luego se fija el layout tri-bloque con candado de schemas en CI, se corrige y completa el motor numérico (incluido el fix bloqueante T1), se congela el contrato JSON v1.1, se construye `doctor` + fixtures + golden tests, se entrega el producto central (`/audit` S0–S7 con cobertura tri-bloque), la web pasa a ser espejo del repo (paralelizable desde la Fase 2), y se cierra con el release v0.4.0. Principio rector en todas las fases: la CLI es la única implementación del score; cada fase cierra con build + tests verdes y PR.

**Política de modelos (ver `CLAUDE.md`):** planear cada fase con **Opus** (`gsd-planner`), ejecutar con **Sonnet** (`gsd-executor`), verificar resultados de fase con **Opus** (`gsd-verifier`/`gsd-plan-checker` con `model: "opus"` explícito). Los bloqueos lógicos centrales y las decisiones de arquitectura (ADRs, semántica del contrato, protocolo S0–S7) se resuelven en la sesión **Fable 5** antes de delegar.

## Phases

- [ ] **Phase 1: Higiene, decisiones y renombre** - Repo limpio, decisiones que congelan interfaces tomadas, marca nueva en código
- [ ] **Phase 2: Layout tri-bloque con candado de schemas** - Reglas en eu/us/latam y validación de schemas en CI
- [ ] **Phase 3: Motor completo** - F_rigor desde region-factors, fix T1 strict_regimes, escalado USA, pilar DevOps
- [ ] **Phase 4: Contrato JSON v1.1 canónico** - audit --json emite el contrato completo; AGENT-CONTRACT.md fuente única
- [ ] **Phase 5: Doctor, fixtures y golden tests congelados** - Loop no interactivo con UX react-doctor y red de seguridad en CI
- [ ] **Phase 6: Skills — /audit S0–S7 y cobertura tri-bloque** - El producto central, evaluado con evals de adherencia e inyección
- [ ] **Phase 7: Web como espejo del repo** - Content collections + rutas + deploy (paralelizable desde Fase 2)
- [ ] **Phase 8: Release v0.4.0** - Tag, release notes honestas y distribución verificada

## Phase Details

### Phase 1: Higiene, decisiones y renombre
**Goal**: Repo limpio y todas las decisiones que congelan interfaces tomadas de una sola vez: el diff editorial pendiente (8 archivos) entra vía PR en commit separado de los artefactos de planeación, la Sesión 0 obsoleta queda neutralizada, el README dice la verdad sobre AR/PE/EC, hay fuente única de versión con check automatizado, el ADR del cap DevOps ratifica la semántica ya versionada en `devops-penalizers.json`, el flujo de verificación de pares queda documentado, y el renombre a Privacy Compliance Skills se completa en código, lockfiles, SVG y URLs. Nada que otras capas congelen (marca, rangos de pilares, URLs) puede llegar después de esta fase.
**Depends on**: Nothing (first phase)
**Requirements**: GOB-01, GOB-02, GOB-03, GOB-04, GOB-06, MOTOR-07, REL-01, REL-02
**Success Criteria** (what must be TRUE):
  1. Los 8 archivos editoriales (6 modificados + `docs/NORMAS-CITADAS.md` y `docs/VIGILANCIA-NORMATIVA.md` nuevos) commiteados en `rebrand-refs-sweep-2026-07` en commit separado del de los artefactos de planeación (staging explícito por ruta, sin `git add -A`), con `git status` limpio tras ambos y PR abierto hacia main; ningún push directo a main ni manipulación de `.git`; Sesión 0/H0 con banner de obsolescencia fechado
  2. La CLI muestra el banner "Privacy Compliance Skills"; grep de la marca vieja solo aparece en notas históricas; lockfiles regenerados; build y tests verdes; todas las URLs apuntan a la canónica decidida y responden 200
  3. ADR commiteado que ratifica la semántica del cap DevOps del JSON (max 30, `min(sum,30)` sumado a `be_raw` antes de `min(50)`) con ejemplo numérico; README y PILLAR-SEPARATION.md sin contradicción de rangos
  4. El README ya no afirma reglas propias para AR/PE/EC; romper a propósito la coherencia de versiones hace fallar el check automatizado; GOVERNANCE/CONTRIBUTING documenta el pipeline de validación de pares con issue template
**Model policy**: ADRs y decisión de renombre → sesión Fable 5; ejecución mecánica (grep/renombres/lockfiles) → Sonnet; verificación de fase → Opus.
**Plans**: TBD

### Phase 2: Layout tri-bloque con candado de schemas
**Goal**: Las reglas viven en su forma final (`cli/rules/eu/`, `us/`, `latam/`) con historia git preservada y loaders actualizados, y el candado de validación de schemas entra a CI desde ya (QA-01 adelantado): nadie vuelve a mover un JSON de reglas y ningún JSON inválido puede entrar en las fases siguientes.
**Depends on**: Phase 1
**Requirements**: ESTR-01, ESTR-02, ESTR-03, QA-01
**Success Criteria** (what must be TRUE):
  1. Un smoke run de audit carga reglas desde eu/, us/ y latam/ sin errores; build y tests verdes; grep de rutas viejas devuelve cero resultados activos
  2. `npm run validate` recorre todos los JSON de `cli/rules/` contra sus schemas listando cobertura, y el workflow de CI falla ante un JSON inválido de prueba
  3. git log muestra los movimientos como renames y no existe ningún placeholder de argentina/peru/ecuador.json
**Model policy**: ejecución Sonnet; verificación Opus.
**Plans**: TBD

### Phase 3: Motor completo: F_rigor, strict_regimes, USA y DevOps
**Goal**: El corazón numérico queda correcto, completo y verificado en una sola pasada: el scorer lee `region-factors.json` con resolución peor-caso, el fix bloqueante T1 (strict_regimes por pertenencia, nunca igualdad numérica) viaja en el mismo tren que MOTOR-01, el escalado multi-estatal USA y el wiring de `us_multistate_exposure` funcionan, el default de Ecuador nunca es silencioso, y el pilar DevOps queda cableado conforme al ADR de la Fase 1. QA-04 cierra la fase con la regresión T1 cubierta.
**Depends on**: Phase 2
**Requirements**: MOTOR-01, MOTOR-02, MOTOR-03, MOTOR-04, MOTOR-05, MOTOR-06, QA-04
**Success Criteria** (what must be TRUE):
  1. Input multi-bloque CO+BR+UE puntúa con F_rigor 1.25; cambiar `region-factors.json` cambia el score sin tocar código; cero tablas duplicadas en `cli/src`
  2. Input Brasil activa los 3 penalizadores estrictos aunque F_rigor sea 1.15; Chile cambia de régimen en 2026-12-01; ninguna condición compara F_rigor numéricamente; MOTOR-01 no se mergea sin MOTOR-04
  3. 1/3/6+ estados USA → factor 1.10/1.14/1.20; 2+ estados sin mapear → `us_multistate_exposure` con datos del JSON; audit de Ecuador muestra penalizadores estrictos o assumption visible (test que falla si ninguna)
  4. Las 7 señales DevOps suman conforme al cap del ADR en su sub-panel, el wizard las pregunta, ninguna duplica un penalizador BE, y `npm test` verde incluye la regresión LGPD
**Model policy**: orden de PRs intra-fase (MOTOR-01+04 juntos) planeado con Opus; scorer/tests con Sonnet; bloqueos de semántica legal → Fable 5.
**Plans**: TBD

### Phase 4: Contrato JSON v1.1 canónico
**Goal**: `audit --json` emite el contrato v1.1 completo (findings con fix_hint, config_key, evidence_needed, legal_refs, jurisdictions[], standards_refs, recipe_ref), distingue unknown de absent (score como cota superior), propaga review_status para que nada no-validado se presente como autoritativo, y AGENT-CONTRACT.md queda como fuente única con las otras dos fuentes marcadas superseded. La interfaz que consumen doctor, la skill y los golden tests se congela aquí, ya sobre motor y marca definitivos. Orden interno: CONTRATO-01 primero; MOTOR-08 y CONTRATO-02/04/05 sobre él; CONTRATO-03 cierra.
**Depends on**: Phase 3
**Requirements**: CONTRATO-01, CONTRATO-02, CONTRATO-03, CONTRATO-04, CONTRATO-05, MOTOR-08
**Success Criteria** (what must be TRUE):
  1. `audit --json` valida contra el JSON Schema v1.1 commiteado, con legal_refs textuales de `cli/rules/`, jurisdictions[] por finding multiestatal, standards_refs como passthrough y compatibilidad intacta con consumidores v0.2
  2. Config con llaves sin responder → score etiquetado como cota superior con las llaves unknown enumeradas (en --json y render humano); config completa → sin etiqueta
  3. Findings sobre reglas no-validated llevan la etiqueta "pendiente de verificación de pares" + flag global; escalation_required=true con score ≥71 o sensibles+menores
  4. El ejemplo de AGENT-CONTRACT.md v1.1 coincide campo a campo con el output real (snapshot test verde); las otras fuentes remiten a él como superseded
**Model policy**: semántica del contrato revisada en sesión Fable 5 antes de implementar; implementación Sonnet; verificación Opus.
**Plans**: TBD

### Phase 5: Doctor, fixtures y golden tests congelados
**Goal**: `doctor` existe como wrapper delgado del MISMO engine que audit (cero lógica de scoring propia — no se recrea B5), con `--topic`, `--baseline`, persistencia en `.legalskills/last-audit.json` y render estilo react-doctor (narración de detección, resumen por pilar, truncado honesto, happy path celebrado, score al final); los 4 fixtures canónicos quedan creados y los golden tests se congelan con inyección de reloj — el primer momento seguro, porque marca y ADR (Fase 1) y contrato (Fase 4) ya son definitivos. Los gates anti-alucinación (legal_refs) y anti-autoritativo (review_status) y los tests de convergencia del loop entran a CI.
**Depends on**: Phase 4
**Requirements**: DOCTOR-01, DOCTOR-02, DOCTOR-03, QA-02, QA-03, QA-05, QA-06, QA-08
**Success Criteria** (what must be TRUE):
  1. Para la misma config, `doctor --json` y `audit --config --json` emiten findings y score idénticos (byte-a-byte tras normalizar timestamp), exit codes 0/1/2 verificados, doctor sin lógica de scoring propia, cada corrida persiste last-audit.json válido
  2. Existen los 4 fixtures con el doc del eje bajo/medio/alto; el loop converge ≤5 iteraciones en bajo/medio; el fixture alto produce escalation_required=true en la primera evaluación
  3. Golden files de los 4 fixtures byte-a-byte estables bajo reloj inyectado, verificados en CI, sin la marca vieja, con el mecanismo documentado en AGENT-CONTRACT.md
  4. CI falla ante un legal_ref inventado y ante output que presente reglas pending sin etiqueta; el render por defecto es legible en ~30s con truncado honesto y el caso sin hallazgos celebra el happy path
**Model policy**: implementación y tests Sonnet; diseño del render (UX) validado en sesión Fable 5 con los patrones de `architecture/SKILL-AUDIT-V4-DESIGN.md`; verificación Opus.
**Plans**: TBD

### Phase 6: Skills: /audit S0–S7 y cobertura tri-bloque
**Goal**: El producto central se entrega sobre una CLI ya congelada: `/audit` reescrita como máquina de estados S0–S7 (con S3-PLANEAR separado: plan concreto + aprobación explícita antes de editar el repo del usuario), fallback y QUESTIONS.md sincronizados con la escala nueva, barrido tri-bloque de las ~15 piezas periféricas con la escala vieja (incluido `prompts/auditor-privacidad.md`), wiring USA con matices H3, `/matriz-normativa` con 4 dimensiones nuevas, deprecación de `/privacy-check` y `/risk-score` ejecutada o decidida, matrices de `knowledge/` etiquetadas honestamente, tabla canónica de skills (cierra B3) y evals de adherencia/evidencia/inyección verdes en la misma fase. Las fases 6 y 7 no tocan `cli/src`, así que los golden files no se invalidan.
**Depends on**: Phase 5
**Requirements**: SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, SKILL-06, SKILL-07, KNOW-01, GOB-05, QA-07
**Success Criteria** (what must be TRUE):
  1. `/audit` sigue S0–S7: invoca la CLI cuando está disponible, reporta exactamente su final_score, planea y pide aprobación antes de editar (S3), solo cambia config_keys con corrección material o evidencia, etiqueta el fallback como estimado, corta hacia abogado ante escalation_required y conserva íntegro el Content Isolation
  2. Ningún documento de `skills/` ni `prompts/` condiciona penalizadores a "F_rigor = 1.25" ni contradice `region-factors.json` (grep global); fechas MD/IN/KY/RI y SCCs BR provienen de los JSON
  3. `/matriz-normativa` responde las 4 dimensiones nuevas desde los JSON; una sola tabla canónica deja README (ES y EN), índice y routing sin contradicciones; la deprecación prometida está ejecutada o re-fechada por decisión escrita; las 4 matrices de knowledge/ llevan el banner de bloque USA pendiente
  4. Las evals pasan: adherencia S0–S7 sobre ≥2 fixtures, score skill = score CLI, rechazo de "ya lo arreglé" sin evidencia, y los 17 casos de inyección existentes en verde
**Model policy**: protocolo S0–S7 y reglas de la skill son decisión de arquitectura → sesión Fable 5 con el diseño de `architecture/SKILL-AUDIT-V4-DESIGN.md`; redacción/edición de SKILL.md y evals → Sonnet; validación de resultados → Opus.
**Plans**: TBD

### Phase 7: Web como espejo del repo
**Goal**: La web deja de poder mentir por construcción: content collections tipadas leen skills y reglas del repo como fuente única, Regions/Formats pierden sus arrays hardcodeados, entran las 5 rutas nuevas con espejos EN (incluida /risk-score con KaTeX y /contribuir enlazando el flujo de pares), el deploy con preview por PR queda operativo y el branding definitivo en su lugar. Solo depende de las Fases 1–2, así que puede ejecutarse en paralelo con las Fases 3–6 por un agente separado; su merge final ocurre después de la Fase 6 y antes del release.
**Depends on**: Phase 2
**Requirements**: WEB-01, WEB-02, WEB-03, WEB-04, WEB-05
**Success Criteria** (what must be TRUE):
  1. La página de regiones muestra exactamente las jurisdicciones presentes en `cli/rules/` con sus review_status visibles; AR/PE/EC no aparecen como reglas propias; cambiar un review_status cambia lo mostrado tras rebuild sin editar componentes
  2. Las 10 rutas (5 ES + 5 EN) generan sin 404 internos; /risk-score renderiza la fórmula con KaTeX; los docs desde knowledge/ heredan la etiqueta de KNOW-01
  3. Push a main despliega a producción y un PR genera URL de preview; plataforma documentada
  4. Hero con logo definitivo en ambas locales y favicon logo-mark.svg; build verde
**Model policy**: ejecución Sonnet (worktree/rama paralela); verificación Opus antes del merge final.
**Plans**: TBD

### Phase 8: Release v0.4.0
**Goal**: Cierre del milestone: versión 0.4.0 propagada desde la fuente única, ROADMAP del proyecto actualizado, tag y release notes con la declaración explícita de qué reglas siguen en pending_legal_validation, distribución del formato máquinas verificada (tarball npm + plugin de Claude; publicación solo con aprobación del maintainer), sobre un commit con CI completo verde.
**Depends on**: Phase 6, Phase 7
**Requirements**: REL-03, REL-04
**Success Criteria** (what must be TRUE):
  1. Tag v0.4.0 publicado con la sección "Estado de validación legal" enumerando las reglas pending_legal_validation; README.en.md espejo verificado
  2. Versión 0.4.0 coherente entre fuente única, badge y npm, con el check de GOB-04 verde; CI completo verde en el commit taggeado
  3. El tarball npm instala y `npx . audit --config --json` corre contra un fixture; el plugin de Claude instala desde el repo renombrado y `/audit` responde; `npm publish` queda como paso manual aprobado por el maintainer
**Model policy**: checklist de release planeado y verificado con Opus; pasos mecánicos Sonnet; la publicación externa (npm/GitHub release) la aprueba el humano.
**Plans**: TBD

---
*Roadmap created: 2026-07-23 — síntesis juez-árbitro sobre dos propuestas (riesgo-primero vs dependencias-estrictas); columna vertebral A con injertos de B (MOTOR-06 a Fase 3, orden interno declarado en Fase 4). Cobertura verificada por código: 50/50 tickets mapeados, 0 dependencias violadas.*
