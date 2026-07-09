# PLAN — Rebrand a *Privacy Compliance Skills* + Expansión UE/USA + Web

> **Estado:** propuesta de trabajo · **Fecha:** 2026-07-08 · **Versión del plan:** 1.0
> **Reemplaza el naming de:** `LegalSkillsLATAM`
> **Nuevo nombre de producto:** **Privacy Compliance Skills — UE · USA · LATAM**

Este documento es el plan maestro para tres frentes decididos en sesión:

1. **Rebrand** de `LegalSkillsLATAM` → `Privacy Compliance Skills (UE · USA · LATAM)`.
2. **Expansión real** de UE y USA a jurisdicciones de **primer nivel** (con reglas JSON propias, no solo "contraste").
3. **Web** (landing + docs) en **Astro**, **bilingüe ES/EN**.

> ⚠️ Guía metodológica y operativa. No constituye ni sustituye asesoría jurídica. Todo el contenido normativo mantiene el pipeline de `review_status` del proyecto y debe pasar por verificación de pares antes de marcarse `validated`.

---

## 1. Por qué el rebrand no es cosmético

El nombre actual dice `LegalSkillsLATAM`: LATAM-first, "Legal" como paraguas amplio. El repo lo confirma — Colombia, México, Brasil, Chile, Argentina, Perú, Ecuador tienen reglas JSON propias en `cli/rules/countries/`, mientras UE y USA aparecen como "✅ Contraste".

El nombre nuevo, **Privacy Compliance Skills — UE · USA · LATAM**, hace tres movimientos:

| Cambio | De | A | Implicación |
|---|---|---|---|
| Dominio | "Legal" (amplio) | "Privacy Compliance" (preciso) | Más honesto y buscable: el proyecto es de privacidad/protección de datos, no derecho general. |
| Geografía | LATAM-first | UE · USA · LATAM (tri-regional) | UE y USA pasan al frente → deben tener profundidad real, no referencia. |
| Audiencia | Devs LATAM | Devs globales / LATAM que exportan | El README y la web deben ser bilingües y hablarle a los tres bloques. |

**Consecuencia asumida (decisión de sesión):** "Expansión real UE + USA". No basta reescribir el README; hay que subir GDPR a estándar de producción y construir el bloque USA desde cero.

---

## 2. Marca

### 2.1 Naming y wordmark

El nombre completo es largo para un H1 y para un logo. Se separa en **wordmark + descriptor**:

```
Privacy Compliance Skills
       UE · USA · LATAM
```

- **Wordmark:** `Privacy Compliance Skills` en sans geométrica (Space Grotesk / Inter, peso 600–700).
- **Descriptor:** `UE · USA · LATAM` en monospace (JetBrains Mono), mayúsculas, tracking amplio — evoca el entorno técnico.
- **Slug / paquete npm:** `privacy-compliance-skills` (repo puede seguir siendo `github.com/joselito412/Privacy_Compliance_Skills-UE-USA-LATAM` con un alias/redirect, o renombrarse — ver §7).
- **Codename corto interno (opcional):** `PCS`.

### 2.2 Concepto de logo

Balanza de la justicia estilizada donde los platos son corchetes de código `{ }`, o un prompt de terminal `>` fusionado con el mazo del juez. *The Cyber-Legal Bridge*: rigidez del derecho + flexibilidad del software.

### 2.3 Tono de voz

Preciso, técnico, directo, colaborativo. Le habla al CTO que quiere desplegar sin que lo demanden y al abogado legal-tech que odia los PDFs de 80 páginas.

### 2.4 Taglines candidatas

- ES: **"Compliance-as-Code: construye software conforme por diseño — UE, USA y LATAM."**
- EN: **"Compliance-as-Code: build privacy-compliant software by design — across the EU, US & LATAM."**

---

## 3. Expansión UE + USA a primer nivel (motor de reglas)

Esta es la parte con más trabajo de contenido. Se reorganiza `cli/rules/` de un modelo *countries + international* a un modelo **tri-bloque**.

### 3.1 Reorganización de directorios propuesta

```
cli/rules/
├── schema/
│   ├── country-rules.schema.json      # ya existe — sirve para los 3 bloques
│   └── us-state-matrix.schema.json    # NUEVO — para la tabla de leyes estatales
├── eu/
│   └── gdpr.json                      # MOVER desde international/ · subir a producción
├── us/
│   ├── usa-federal.json               # NUEVO — CCPA/CPRA baseline + sectoriales federales
│   └── state-matrix.json              # NUEVO — ~20 leyes estatales integrales (2026)
├── latam/
│   ├── colombia.json  mexico.json  brasil.json  chile.json (backlog)
│   ├── argentina.json  peru.json  ecuador.json
│   └── _template.json
└── risk-engine/
    ├── score-formula-v2.json
    ├── fe-penalizers.json  be-penalizers.json  devops-penalizers.json
    └── region-factors.json            # NUEVO — F_rigor por bloque (ver §3.4)
```

> El `country-rules.schema.json` ya acepta formato flat y anidado, y ya modela `penalizers`, `data_categories`, `sanctions`, `review_status`. Sirve tal cual para UE y USA — solo hace falta contenido.

### 3.2 UE — GDPR: de "contraste" a producción

El `gdpr.json` actual **ya es de alta calidad** (categorías Art. 9/10, derechos Cap. III, brechas 72h, sanciones de dos niveles 2%/4%, transferencias, DPO, DPIA, 8 penalizadores). Lo que falta:

- Subir `review_status` de `pending_legal_validation` a `under_review` con un revisor asignado.
- Actualizar la lista de países con decisión de adecuación y el estado del **EU–US Data Privacy Framework** (verificar vigencia 2026).
- Añadir referencia a **ePrivacy / cookies** y al **AI Act** como capa adyacente (nota, no regla de score todavía).
- Confirmar `rigor_factor` (hoy 1.25) contra la nueva escala tri-bloque (§3.4).

### 3.3 USA — construir el bloque desde cero

USA es el hueco real. El panorama 2026: **~20 estados** con leyes integrales de privacidad del consumidor (California, Colorado, Connecticut, Delaware, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, Virginia, Washington), **sin ley federal integral**, más leyes **sectoriales federales**.

**`usa-federal.json`** — baseline modelado sobre **CCPA/CPRA (California)** como el estándar de facto más estricto, más las sectoriales:

- **CCPA/CPRA** (California): derechos know/delete/correct/opt-out of sale-share, "sensitive personal information", requisitos para negocios ≥ umbral, CPPA como regulador.
- **HIPAA** (salud), **COPPA** (menores < 13), **GLBA** (financiero), **FERPA** (educación) como penalizadores sectoriales.
- Nota fuerte de **fragmentación**: a diferencia de GDPR, no hay régimen único → el score debe advertir "aplican N leyes estatales según dónde estén tus usuarios".

**`state-matrix.json`** — tabla comparativa de las ~20 leyes estatales por dimensión (umbral de aplicabilidad, derecho de opt-out, datos sensibles, private right of action, cure period). Alimenta `/matriz-normativa`.

**`us-state-matrix.schema.json`** — schema nuevo para validar esa tabla.

### 3.4 Motor de score tri-bloque

`region-factors.json` — factor de rigor por bloque, calibrado para que el semáforo tenga sentido cross-región:

| Bloque | `F_rigor` sugerido | Justificación |
|---|---|---|
| UE (GDPR) | 1.25 | Techo global de exigencia. |
| USA (CCPA/CPRA + estatal) | 1.10 | Alto pero fragmentado; el riesgo escala con nº de estados. |
| LATAM | 1.00 (BR ~1.15) | Base; Brasil como techo regional. |

La fórmula no cambia: `Risk Score = min(100, (C_base + Σ Penalizadores) × F_rigor)`. Solo se parametriza `F_rigor` por bloque en vez de por país suelto.

### 3.5 Nuevas dimensiones de `/matriz-normativa`

Añadir a las existentes (consentimiento, derechos, sanciones, DPO, menores, transferencias, breach_notification, cifrado):

- `private_right_of_action` (clave en USA estatal).
- `opt_out_vs_opt_in` (USA opt-out vs UE/LATAM opt-in).
- `adequacy_transfers` (adecuación UE, DPF, SCCs).
- `ai_automated_decisions` (Art. 22 GDPR, CPRA ADMT, borradores estatales).

---

## 4. README — cambios concretos

Se mantiene la estructura actual (está sólida) y se ajusta:

1. **Cabecera / wordmark:** título `Privacy Compliance Skills` + badge mono `UE · USA · LATAM`. Badges de licencia, SkillSpector (LOW · 8.3/100) y versión.
2. **Bilingüe:** `README.md` (ES, canónico) + `README.en.md` (EN), con cross-link arriba.
3. **"¿Qué es?"** reencuadrado a estándar **tri-regional** de compliance-as-code, honesto sobre profundidad (UE producción, USA en construcción, LATAM consolidado).
4. **Tabla de cobertura reordenada** a UE / USA / LATAM, con columna de **nivel** (reglas propias vs. matriz vs. contraste) para no sobreprometer.
5. **Corrección de dato:** el badge de seguridad es **SkillSpector v2.1.1 (NVIDIA), 8.3/100** — no Snyk/Socket (error del insumo de branding).
6. Conservar intactos: los **3 formatos** (Humanos/IA/Máquinas), los **dos pilares** FE/BE, el **Legal Risk Score** con fórmula, **seguridad**, **gobernanza** (Abogado → JSON → IA → Dev) y el **llamado a colaboradores legales** (el mejor gancho del proyecto).
7. **Roadmap** actualizado: fase de expansión UE/USA + web pública.

---

## 5. Web en Astro

### 5.1 Por qué Astro

Cero JS por defecto (carga instantánea), Markdown/MDX nativo, **content collections** tipadas, i18n de primera clase. Ideal para un sitio docs-driven que debe reflejar el repo.

### 5.2 Arquitectura de información

```
/                      Landing (hero terminal, 3 formatos, Risk Score, pilares, regiones, peer-review)
/docs                  Skills y matrices (auto desde content collections)
/docs/[skill]          Ficha de cada skill (/audit, /risk-score, /matriz-normativa, …)
/risk-score            Explicador del algoritmo (fórmula KaTeX + semáforo interactivo)
/regiones              Cobertura por bloque UE / USA / LATAM con fichas por jurisdicción
/contribuir            Llamado a colaboradores legales + cómo abrir un PR/Issue
/en/*                  Espejo completo en inglés
```

### 5.3 i18n

- Rutas `es` (default, sin prefijo) y `en` (`/en/…`).
- Estrategia de Astro i18n (`defaultLocale: "es"`, `locales: ["es","en"]`).
- Selector ES/EN en el header. Disclaimer legal traducido en ambos.

### 5.4 Content collections (sincronía con el repo)

En vez de **parsear el README.md** en build (frágil, como sugería el insumo), se definen colecciones tipadas que son la **única fuente** y de las que README y web beben:

- `skills` — una entrada por skill (nombre, comando, pilar, estado, score, descripción). Deriva de `skills/_routing.md`.
- `regions` — una entrada por jurisdicción/bloque (bandera, ley, regulador, estado, nivel). Deriva de `cli/rules/**`.
- `docs` — matrices y checklists en MDX (desde `knowledge/`).

Al actualizar el repo y re-desplegar, la web se actualiza sola.

### 5.5 Componentes clave

`Layout.astro` (shell oscuro + banner disclaimer), `Hero.astro` (terminal simulada ejecutando `/audit "…"`), `FormatCard.astro` (grid Humanos/IA/Máquinas), `RiskMeter.astro` (semáforo 0–100 con la fórmula), `PillarSplit.astro` (FE 50 / BE 50 con la regla "si el usuario lo ve → Frontend"), `RegionGrid.astro` (badges por bloque), `Callout.astro` (peer-review), `LangSwitch.astro`, `Footer.astro`.

### 5.6 Deploy

Vercel o Netlify (preview por PR) o GitHub Pages con Action. Dominio sugerido: `privacycomplianceskills.dev` o subruta en GitHub Pages.

---

## 6. Design system (formalizado)

Paleta **modo oscuro nativo (IDE-friendly)** con los colores del propio semáforo de riesgo del algoritmo:

| Token | Uso | Hex |
|---|---|---|
| `--bg` | Fondo principal (GitHub slate) | `#0D1117` |
| `--surface` | Tarjetas / paneles | `#161B22` |
| `--border` | Bordes sutiles | `#30363D` |
| `--text` | Texto principal | `#F0F6FC` |
| `--text-muted` | Texto secundario | `#8B949E` |
| `--risk-low` | Verde · 0–30 pts (aprobación) | `#2EA043` |
| `--risk-mid` | Ámbar · 31–70 pts (advertencia) | `#D29922` |
| `--risk-high` | Rojo · 71–100 pts (freno legal) | `#F85149` |
| `--accent` | Enlaces / foco (azul GitHub) | `#58A6FF` |

**Tipografía:** Space Grotesk / Inter (sans, títulos y cuerpo) + JetBrains Mono (código, comandos, descriptor de marca). Cargadas vía `@fontsource` o Google Fonts.

---

## 7. Backlog priorizado (para sesión de Claude Code)

**Contenido legal (requiere verificación de pares):**

1. Mover `gdpr.json` → `eu/`, subir a `under_review`, verificar Data Privacy Framework 2026.
2. Crear `us/usa-federal.json` (CCPA/CPRA + HIPAA/COPPA/GLBA).
3. Crear `us/state-matrix.json` (~20 estados) + `us-state-matrix.schema.json`.
4. Crear `latam/chile.json` (Ley 21.719, vigencia 01-12-2026) — backlog v0.5 pendiente.
5. Reubicar `countries/` → `latam/`; actualizar rutas en la CLI y tests.
6. Añadir `region-factors.json` y parametrizar `F_rigor` por bloque en el scorer.
7. Ampliar dimensiones de `/matriz-normativa` (§3.5).

**Marca / docs:**

8. Reescribir `README.md` (ES) + `README.en.md` (EN) — *entregado en esta sesión*.
9. Actualizar `plugin.json` (`name`, `description`, keywords `usa`, `ccpa`, `cpra`).
10. Diseñar logo (balanza + `{ }` / prompt) — assets SVG en `assets/`.

**Web:**

11. Scaffold Astro en `web/` — *entregado en esta sesión*.
12. Poblar content collections desde el repo; conectar `/docs` y `/regiones`.
13. Configurar deploy (Vercel/Netlify/Pages) + workflow de CI.

**Repo / naming:**

14. Decidir si renombrar el repositorio GitHub o mantener alias.

---

## 8. Riesgos y notas

- **Sobrepromesa legal:** el nombre "UE · USA" crea expectativa de profundidad. Mitigación: columna de "nivel" honesta en la tabla de cobertura + `review_status` visible.
- **Fragmentación USA:** modelar 20 leyes estatales es mantenimiento continuo; empezar por CCPA/CPRA + matriz y marcar el resto como "en expansión".
- **Verificación de pares sigue siendo el cuello de botella:** ninguna regla nueva se marca `validated` sin abogado. El llamado a colaboradores es más urgente que nunca con UE/USA en el título.
- **Todo el contenido mantiene el disclaimer:** guía informativa, no asesoría jurídica.

---

*Privacy Compliance Skills — UE · USA · LATAM. Cerrando la brecha entre el código y el cumplimiento de privacidad.*
