# Prompts para sesiones de Claude Code — desarrollo & código

> Complemento de `PLAN-REBRAND-Y-WEB-2026-07.md`. Esta sesión de Cowork dejó listo el **contenido** (logo, README bilingüe, `usa-federal.json`, `state-matrix.json` + schema, `region-factors.json`, `chile.json`, `plugin.json`). Lo que sigue es **código, wiring, tests, reorganización de archivos y deploy** — eso va en Claude Code (tiene el toolchain y auth de GitHub que Cowork no tiene).
>
> Cada bloque de abajo es un prompt listo para pegar. Ejecútalos **en orden** (A→F); A es prerequisito de B y C. Antes de empezar, en cada sesión: `git checkout -b <rama>` y al final `git commit` + `git push`.

---

## Sesión 0 — Terminar los commits pendientes (correr en TU terminal)

El entorno de Cowork logró crear el **commit 1** (`feat(brand): rebrand…` = README ES/EN, plan, logo, plugin.json) pero su `.git` montado no permite borrar archivos, así que git dejó un lock atascado y no pudo cerrar los 3 commits restantes. Los cambios están todos en disco. Corre esto en tu terminal (filesystem real, sin restricción) desde la raíz del repo:

```bash
# 1) limpiar locks que dejó el entorno sandbox
rm -f .git/HEAD.lock .git/index.lock .git/objects/maintenance.lock
git status

# 2) commit del scaffold web (ya quedó staged; el add es idempotente)
git add web
git commit -m "feat(web): scaffold Astro bilingue (ES/EN)"

# 3) commit del bloque de reglas USA + Chile + region-factors
git add cli/rules/us cli/rules/countries/chile.json \
        cli/rules/risk-engine/region-factors.json \
        cli/rules/schema/us-state-matrix.schema.json
git commit -m "feat(rules): bloque USA primer nivel + Chile + region-factors (pending_legal_validation)"

# 4) commit del doc de prompts
git add PROMPTS-CLAUDE-CODE-2026-07.md
git commit -m "docs: prompts para sesiones de Claude Code (dev handoff)"

# 5) push de los 4 commits
git push origin main

# (opcional) limpiar objetos temporales que dejó el sandbox
git gc --prune=now
```

Con eso el repo queda con los 4 commits antes de arrancar la Sesión A.

---

## Estado de partida (lo que ya existe en el repo)

- `cli/rules/eu/` → **no existe aún**; GDPR está en `cli/rules/international/gdpr.json` (calidad producción).
- `cli/rules/us/usa-federal.json` ✅ nuevo (CCPA/CPRA + sectoriales).
- `cli/rules/us/state-matrix.json` ✅ nuevo (19 leyes estatales) + `cli/rules/schema/us-state-matrix.schema.json` ✅.
- `cli/rules/countries/` → colombia, mexico, brasil, argentina, peru, ecuador, **chile ✅ nuevo**.
- `cli/rules/risk-engine/region-factors.json` ✅ nuevo (F_rigor por bloque; aún NO leído por el scorer).
- `web/` → scaffold Astro bilingüe (build OK) con datos hardcodeados; falta content collections + rutas.

> ⚠️ Todo el contenido legal nuevo tiene `review_status: pending_legal_validation`. No promoverlo a `validated` sin revisión de pares.

---

## Sesión A — Reorganizar `cli/rules/` a bloques + actualizar el código

```
Contexto: el repo migró su naming a "Privacy Compliance Skills (UE·USA·LATAM)" y eleva UE y USA a
primer nivel. Hoy las reglas están en cli/rules/countries/ (LATAM) y cli/rules/international/
(gdpr.json). Quiero reorganizar a tres bloques SIN romper la CLI.

Tarea:
1. Crear cli/rules/eu/ y mover international/gdpr.json → eu/gdpr.json.
2. Crear cli/rules/latam/ y mover countries/*.json → latam/ (colombia, mexico, brasil, argentina,
   peru, ecuador, chile, _template).
3. Mantener cli/rules/us/ (ya existe: usa-federal.json, state-matrix.json).
4. Buscar en cli/src/ TODAS las referencias a las rutas antiguas ("countries", "international",
   "gdpr") y actualizarlas al nuevo layout. Buscar también globs/loaders de reglas.
5. Ajustar los $schema/paths relativos dentro de los JSON movidos si cambió la profundidad.
6. Actualizar cualquier índice o README que liste las rutas (cli/README.md).
7. Correr el build de la CLI (npm run build en cli/) y los tests; arreglar lo que rompa.

Criterio de aceptación: `npm run build` y `npm test` en cli/ pasan; `lls`/CLI carga reglas de eu/,
us/ y latam/ sin errores; no quedan referencias a las rutas viejas (grep limpio).
```

---

## Sesión B — Integrar `region-factors.json` al scorer

```
Contexto: la fórmula es Risk Score = min(100, (C_base + Σ Penalizadores) × F_rigor). Hasta ahora
F_rigor venía por país. Se agregó cli/rules/risk-engine/region-factors.json que define F_rigor por
BLOQUE (eu 1.25, us 1.10 con escalado multi-estatal, latam 1.00 con overrides BR 1.15, CL 1.10).

Tarea:
1. Hacer que el scorer lea region-factors.json como fuente de F_rigor.
2. Regla de resolución: si aplican varios bloques/jurisdicciones, usar el F_rigor MÁS ALTO (peor caso).
3. Implementar el escalado USA multi-estatal: +0.02 por estado adicional con ley integral aplicable,
   cap 1.20 (ver "scaling_note" en el JSON), y activar el penalizador us_multistate_exposure cuando
   haya >1 estado aplicable sin mapear.
4. Mantener la CLI como única fuente de verdad del score (arquitectura híbrida); la skill LLM solo
   interpreta. NO duplicar la fórmula en SKILL.md salvo fallback etiquetado.
5. Tests unitarios del cálculo de F_rigor por bloque y del escalado multi-estatal.

Criterio de aceptación: dado un input multi-bloque, el score usa el F_rigor correcto; golden tests
del escalado USA pasan.
```

---

## Sesión C — Wire del bloque USA en skills + nuevas dimensiones de `/matriz-normativa`

```
Contexto: se añadió el bloque USA (us/usa-federal.json = CCPA/CPRA + HIPAA/COPPA/GLBA/FERPA) y
us/state-matrix.json (19 leyes estatales por dimensión). Falta que las skills lo usen.

Tarea:
1. Hacer que /audit y /risk-score reconozcan jurisdicción USA (California y otros estados) y apliquen
   los penalizadores de usa-federal.json (us_no_optout_link, us_no_spi_limit, us_ignores_gpc,
   us_minors_optin, us_no_reasonable_security, us_no_risk_assessment_admt, us_multistate_exposure).
2. Ampliar /matriz-normativa con las dimensiones nuevas del plan (§3.5):
   private_right_of_action, opt_out_vs_opt_in, adequacy_transfers, ai_automated_decisions.
   La dimensión USA debe leer state-matrix.json y tabular por estado.
3. Actualizar skills/_routing.md y skills/_SKILLS-INDEX.md con la cobertura tri-bloque.
4. Validar us/*.json contra sus schemas (usa-federal contra country-rules.schema.json; state-matrix
   contra us-state-matrix.schema.json).

Criterio de aceptación: `/matriz-normativa opt_out_vs_opt_in` devuelve tabla UE/USA/LATAM;
`/audit "...California..."` aplica penalizadores USA; validación de schema OK.
```

---

## Sesión D — Web: content collections + rutas + deploy

```
Contexto: web/ tiene un scaffold Astro bilingüe (ES/EN) con datos hardcodeados en los componentes.
Quiero que la web lea el repo como fuente única y añadir rutas.

Tarea:
1. Definir content collections tipadas (src/content/config.ts):
   - skills  → derivada de skills/_routing.md (nombre, comando, pilar, estado, score).
   - regions → derivada de cli/rules/** (bloque, jurisdicción, ley, regulador, review_status, nivel).
   - docs    → MDX desde knowledge/ (matrices y checklists).
2. Reescribir Regions.astro y Formats.astro para consumir las colecciones en vez de arrays inline.
3. Añadir rutas: /docs, /docs/[skill], /regiones, /risk-score (fórmula con KaTeX), /contribuir —
   y sus espejos en /en/.
4. Configurar deploy (Vercel o Netlify o GitHub Pages con Action) con preview por PR.
5. Poner el logo definitivo (assets/logo.svg) en el hero; favicon = assets/logo-mark.svg.

Criterio de aceptación: `npm run build` en web/ pasa; /regiones refleja el estado real de cli/rules/;
cambiar una regla en el repo se refleja en la web tras rebuild; deploy con URL de preview.
```

---

## Sesión E — Validación, golden tests y fixtures

```
Contexto: se agregó contenido legal nuevo (USA, Chile) y config de scoring (region-factors).

Tarea:
1. Añadir validación automática (script npm) que corra TODOS los JSON de cli/rules/ contra sus
   schemas en CI (.github/workflows).
2. Fixtures de casos representativos: app SaaS en California (opt-out + SPI), health app en la UE
   (Art. 9 + 72h), fintech multi-estatal USA, app LATAM CO+BR+CL.
3. Golden tests del score esperado por fixture (incluye F_rigor por bloque y escalado USA).
4. Test de que ninguna regla con review_status != validated se marque como autoritativa en el output
   (debe salir el disclaimer / etiqueta "pendiente de verificación").

Criterio de aceptación: CI verde; golden tests estables; validación de schema en cada push.
```

---

## Sesión F — Naming del repo y release

```
Tarea:
1. Decidir: renombrar el repo GitHub a privacy-compliance-skills o mantener LegalSkillsLATAM con
   alias/redirect. Actualizar URLs en README.md, README.en.md, web/src/config.ts y plugin.json si se
   renombra.
2. Actualizar badge de versión a 0.4.0 cuando A–E estén integrados.
3. Actualizar docs/ROADMAP.md marcando "expansión UE/USA + web" como fase entregada.
4. Tag + release notes.

Criterio de aceptación: enlaces consistentes; release 0.4.0 publicada.
```

---

## Checklist de contenido pendiente de verificación de pares (no es código)

- `us/usa-federal.json` — validar CCPA/CPRA (umbrales, SPI incl. neural data, ADMT 2026) con abogado US.
- `us/state-matrix.json` — verificar fecha de vigencia, umbral y cure period de las 19 leyes.
- `chile.json` — verificar contra el texto de la Ley 21.719 y su reglamento antes de la vigencia 01-12-2026.
- `region-factors.json` — validar que los F_rigor reflejan el criterio jurídico deseado.
- Reclutar especialistas CCPA/CPRA + estatal para el llamado de colaboradores (README §Buscamos colaboradores).

---

## Sesión G — Renombre global en código, lockfiles y assets (correr en Claude Code)

```
Contexto: el repo se renombró a Privacy_Compliance_Skills-UE-USA-LATAM y la marca a
"Privacy Compliance Skills". La sesión de Cowork ya actualizó docs, reglas JSON, skills,
plugin.json y web/src/config.ts. Quedaron SIN tocar las referencias en codigo/lockfiles/SVG
para no romper build/tests. Complétalas aquí (con build + test):

Pendiente:
- package.json y cli/package.json: campo "name" (legalskills-latam -> privacy-compliance-skills)
  y "repository.url" -> https://github.com/joselito412/Privacy_Compliance_Skills-UE-USA-LATAM.git
- package-lock.json y cli/package-lock.json: regenerar con npm install tras cambiar el name.
- cli/src/index.ts, cli/src/ui/box.ts, cli/src/commands/audit.ts: strings de banner y la URL vieja
  ("LegalSkillsLATAM" / "legalskills-latam" / github.com/.../LegalSkillsLATAM) -> nuevos valores.
- scripts/validate.js: mensajes.
- assets/architecture.svg, assets/risk-score-demo.svg, assets/security-audits.svg: texto visible
  "LegalSkillsLATAM" -> "Privacy Compliance Skills" (verificar que no desborde; regenerar si hace falta).
- git remote set-url origin https://github.com/joselito412/Privacy_Compliance_Skills-UE-USA-LATAM.git

Tarea: aplicar cambios, `npm run build` + `npm test` en cli/, confirmar que el banner/CLI muestra el
nuevo nombre, y commitear. Conservar "formerly/antes se llamaba LegalSkillsLATAM" solo como nota historica.

Criterio: `grep -rn "LegalSkillsLATAM\|legalskills-latam"` solo aparece en notas historicas; build y tests verdes.
```

---

## ⚠️ ADDENDUM 2026-07-09 — Leer ANTES de correr las sesiones A/B

La sesión de evaluación + validación jurídica (Cowork, 2026-07-09) dejó trabajo nuevo en el working tree y **un fix bloqueante** para la Sesión B. Documentos de referencia: `PLAN-INVESTIGACION-JURIDICA-Y-ANTIPATRONES-2026-07.md` (hallazgos T1–T5), `docs/NORMAS-CITADAS.md`, `docs/SOURCES-VALIDATION.md` (Olas 1 y 2 con fuente primaria).

### H0 — Commit del trabajo editorial nuevo (extiende la Sesión 0)

Añadir al commit inicial (o commit aparte) todo lo de las Olas 1-2 y la evaluación:
`mexico.json` v1.2.0 (verificado contra texto oficial LFPDPPP 2025, reforma DOF 14-11-2025), `brasil.json` (Res. 19/2024 SCCs), `chile.json` (transición APDP + gracia PYME), `us/state-matrix.json` (nota de verificación), `docs/SOURCES-VALIDATION.md`, `docs/NORMAS-CITADAS.md`, `PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md`, `PLAN-INVESTIGACION-JURIDICA-Y-ANTIPATRONES-2026-07.md`, `knowledge/matrices/matriz-sdlc-cumplimiento.md`, `cli/rules/risk-engine/devops-penalizers.json`, `architecture/AGENT-CONTRACT.md`, `skills/audit/SKILL.md` v3, índices de skills.

### H1 — FIX T1 (🔴 BLOQUEANTE para la Sesión B)

`region-factors.json` (BR 1.15, EC 1.00) contradice el modelo viejo (BR/EC 1.25) que aún vive en `skills/audit/SKILL.md` y `skills/audit/QUESTIONS.md`. Peor: tres penalizadores BE (DPO +15, base legal +20, brechas +15) se activan "solo si F_rigor = 1.25" — con la escala nueva **dejarían de activarse para Brasil**.

Al implementar la Sesión B:
1. Añadir a `region-factors.json` una lista `strict_regimes` (p. ej. `["EU", "BR", "CL>=2026-12-01"]`; Ecuador: **decisión editorial pendiente** — dejar comentario y no incluirlo hasta decidir).
2. En el scorer, condicionar esos 3 penalizadores a `strict_regimes.includes(jurisdicción)` — NUNCA a igualdad numérica de F_rigor.
3. Sincronizar `SKILL.md` (sección B del fallback y tabla 2C) y `QUESTIONS.md` con la escala nueva.

### H2 — AGENT-CONTRACT v1.1 (aditivo, al implementar Fase 2.1)

Añadir al finding: `jurisdictions[]` (para USA multiestatal) y `recipe_ref` (enlace al anti-patrón de la futura Fase AP). Crear el penalizador `us_multistate_exposure` (referenciado por `region-factors.json` pero inexistente) en `usa-federal.json` o el risk-engine.

### H3 — Nota de contenido para la Sesión C

Al wirear el bloque USA: el `state-matrix.json` ya tiene verificadas las entradas IN/KY/RI (vigentes 01-01-2026) y MD (vigente 01-10-2025, aplica a tratamientos desde 01-04-2026 — respetar ese matiz en cualquier output de skill). Brasil: la gracia de las SCCs ANPD (Res. 19/2024) venció en ago-2025 — considerar endurecer el `fix_hint` del penalizador de transferencias BR con esa referencia.

### H4 — Backlog que NO es de la sesión de código (queda en Cowork)

Ola 3 de investigación (crear `argentina.json`, `peru.json`, `ecuador.json`, `panama.json` + tablas de fuentes); Fase AP editorial (catálogo `knowledge/anti-patterns/` + skill `/fix`); iteración 2 del eval de `/audit` (distinguir `unknown` de `absent` en el fallback); verificación estado-por-estado completa con Descrybe (`verify_quote`) cuando el conector autentique.

**Orden recomendado final:** 0 → H0 → A → B(+H1) → C(+H3) → D → E → F → G, con H2 dentro de la implementación del contrato (Fase 2.1 del plan de cumplimiento).
