# ROADMAP — LegalSkillsLATAM

> Documento vivo. Actualizado por el Equipo Editorial.

---

## Visión a Largo Plazo

```
[Repositorio GitHub] → [Plugin de Claude] → [CLI Tool] → [API / SaaS]
      Fase 1               Fase 2            Fase 3        Fase 4
```

---

## Fase 1 — Fundación ✅ MVP COMPLETO

**Objetivo:** Establecer la base de conocimiento y el plugin de Claude.

### Entregables MVP (v0.1.0) — Completados

- [x] Arquitectura del repositorio definida
- [x] `score-formula.json` — motor de riesgo documentado
- [x] `country-rules.schema.json` — esquema de validación JSON
- [x] 5 Skills de Claude: `clasificar-datos`, `privacy-check`, `risk-score`, `matriz-normativa`, `derechos-usuario`
- [x] `rules/countries/colombia.json` — plantilla base
- [x] `rules/countries/brasil.json` — techo regulatorio LATAM (LGPD)
- [x] `rules/countries/mexico.json` — segunda economía LATAM (LFPDPPP)
- [x] `rules/international/gdpr.json` — referente global
- [x] `comparativa-consentimiento.md` — primera matriz comparativa
- [x] `comparativa-derechos.md` — derechos del titular en 9 jurisdicciones
- [x] `checklist-startup.md` — checklist de lanzamiento
- [x] `checklist-datos-sensibles.md` — checklist para salud, biometría y menores
- [x] `prompts/auditor-privacidad.md` — system prompt para cualquier LLM
- [x] Assets visuales (architecture.svg, risk-score-demo.svg, security-audits.svg)
- [x] Publicado en GitHub con README completo y badges de seguridad

### Países en pausa — Backlog v0.2.0

Los siguientes países tienen cobertura referencial en las skills y matrices, pero aún no tienen su archivo `rules/countries/` completo. Están en pausa hasta la siguiente iteración editorial con revisión legal.

| País | Archivo | Estado | Prioridad |
|---|---|---|---|
| 🇨🇱 Chile | `rules/countries/chile.json` | ⏸️ En pausa | Alta — nueva Ley 21.719 (2026) en vigencia |
| 🇦🇷 Argentina | `rules/countries/argentina.json` | ⏸️ En pausa | Media — reconocimiento adecuación UE |
| 🇵🇪 Perú | `rules/countries/peru.json` | ⏸️ En pausa | Media |
| 🇪🇨 Ecuador | `rules/countries/ecuador.json` | ⏸️ En pausa | Alta — LOPDP muy alineada a GDPR |
| 🇺🇸 CCPA | `rules/international/ccpa.json` | ⏸️ En pausa | Media — para proyectos con usuarios en California |

> **Nota editorial:** Ningún archivo de país se publica sin revisión por un abogado experto en la jurisdicción correspondiente. La pausa es intencional para mantener el estándar de calidad del proyecto.

### Próximos pasos antes de v0.2.0

#### Paso A — Validación editorial de la base de conocimiento ⏳ En curso

Revisión por abogado experto de los archivos ya publicados para confirmar exactitud legal. Ver `docs/SOURCES-VALIDATION.md` para el instrumento de trabajo detallado.

| Archivo | Generado | Revisión legal | Validado |
|---|---|---|---|
| `rules/countries/colombia.json` | ✅ | ⏳ Pendiente | ❌ |
| `rules/countries/brasil.json` | ✅ | ⏳ Pendiente | ❌ |
| `rules/countries/mexico.json` | ✅ | ⏳ Pendiente | ❌ |
| `rules/international/gdpr.json` | ✅ | ⏳ Pendiente | ❌ |

Mientras ocurre la validación, el disclaimer "guía informativa — no asesoría jurídica" es la única barrera de riesgo activa. El proceso de validación convierte el proyecto de "útil" a "citable".

#### Paso B — Skill unificada: `/audit` 🔜 Próximo a implementar

**Problema identificado en producción:** La experiencia actual requiere ejecutar 5 skills separadas (`/risk-score`, `/clasificar-datos`, `/privacy-check`, `/matriz-normativa`, `/derechos-usuario`), lo que genera:
- Output masivo y difícil de consumir
- Consumo elevado de tokens por conversación
- Fricción alta para el usuario — flujo fragmentado

**Solución:** Una sola skill `/audit` que funciona como un wizard conversacional eficiente:

```
Usuario: /audit

Claude: Voy a hacer un análisis legal rápido de tu proyecto.
        Responde 5 preguntas:

        1. ¿Qué tipo de datos recopila? (email, salud, GPS, etc.)
        2. ¿En qué países opera?
        3. ¿Tiene política de privacidad publicada? (sí/no)
        4. ¿Dónde están los servidores? (país/proveedor)
        5. ¿Comparte datos con terceros? (analytics, CRM, etc.)

[Claude procesa internamente con toda la lógica de las 5 skills]

→ Output: Risk Score + top 3 hallazgos + acciones priorizadas
  (no 5 outputs separados — uno solo, conciso y accionable)
```

**Principios de diseño de la skill `/audit`:**
- Máximo 5 preguntas — no más
- Inferencia inteligente: si el usuario dice "usamos Firebase", Claude infiere servidores en EE.UU. sin preguntar
- Output único: el box de Risk Score + máximo 5 hallazgos priorizados por severidad
- Al final: rutas de profundización opcionales (`/privacy-check` o `/clasificar-datos` para análisis específico)
- Token-eficiente: sin repetición de contexto entre dimensiones

**Archivos a crear:**
- `skills/audit/SKILL.md` — la nueva skill unificada
- Actualizar `plugin.json` para incluir `audit` en la lista de skills

---

## Fase 2 — CLI Tool (Próxima) 🔜

**Objetivo:** Crear una herramienta de línea de comandos que replique la experiencia de herramientas como `react-doctor` o `npx audit` — con output visual en terminal.

### Concepto de UX (inspirado en React Doctor)

La herramienta debe correr con un solo comando y mostrar en la terminal:

```
$ npx legalskills-latam audit

╔══════════════════════════════════════════════════════╗
║       🔍 LegalSkillsLATAM — Legal Risk Audit         ║
╠══════════════════════════════════════════════════════╣
║  Proyecto : Mi Startup App                           ║
║  País(es) : Colombia 🇨🇴, México 🇲🇽                  ║
║  Datos    : Personal General (email, IP, nombre)     ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║                    67 / 100                          ║
║                                                      ║
║                      😬                             ║
║                   RIESGO MEDIO                      ║
║                                                      ║
║  ████████████████░░░░░░░  67%                       ║
╠══════════════════════════════════════════════════════╣
║  PENALIZADORES ACTIVOS                               ║
║  ⚠️  Sin consentimiento granular        +15 pts       ║
║  ⚠️  Servidor fuera de jurisdicción     +20 pts       ║
║  ✅  Política de privacidad presente    +0 pts        ║
╠══════════════════════════════════════════════════════╣
║  ACCIONES PRIORITARIAS                               ║
║  1. Implementar toggles de consentimiento por fin.   ║
║  2. Migrar servidor a región con nivel adecuado      ║
║  3. Publicar política de cookies                     ║
╚══════════════════════════════════════════════════════╝

  ℹ️  Ejecuta `legalskills-latam explain consentimiento` para más detalles.
  ℹ️  Guía completa: https://github.com/legalskills-latam
```

### Implementación técnica (Fase 2)

- **Runtime:** Node.js (npm package, ejecutable vía `npx`)
- **Input:** Archivo de configuración `legalskills.config.json` en el proyecto, o wizard interactivo en terminal
- **Librería de UI:** `ink` (React para terminal) o `blessed` para los boxes y colores
- **Colores:** `chalk` para el semáforo de colores (verde/amarillo/rojo)
- **Barra de progreso:** Calculada en ASCII con `█` y `░`
- **Cara dinámica:** Emoji desde el `score-formula.json` según rango de score

### Archivo de configuración del proyecto

```json
// legalskills.config.json (en el root del proyecto del usuario)
{
  "project_name": "Mi Startup App",
  "countries": ["CO", "MX"],
  "data_types": ["email", "phone", "ip_address"],
  "has_minors": false,
  "server_region": "us-east-1",
  "third_parties": ["google_analytics", "hubspot"],
  "has_granular_consent": false,
  "has_privacy_policy": true,
  "has_arco_procedure": false
}
```

---

## Fase 3 — API REST 🔮

**Objetivo:** Exponer el motor de riesgo como un servicio consumible por pipelines CI/CD y herramientas de desarrollo.

### Endpoints planeados

```
POST /api/v1/score
  Body: { countries, data_types, context_flags }
  Response: { score, level, penalizers, actions }

GET /api/v1/rules/countries/{iso_code}
  Response: country-rules JSON completo

GET /api/v1/matrices/{dimension}
  Response: tabla comparativa en JSON

POST /api/v1/audit/code
  Body: { code_snippet, language, countries }
  Response: { findings, severity, legal_refs }
```

### Integración en CI/CD (visión)

```yaml
# .github/workflows/legal-audit.yml
- name: LegalSkillsLATAM Audit
  uses: legalskills-latam/audit-action@v1
  with:
    config: legalskills.config.json
    fail_on_score: 71  # Falla el build si el score es Alto
```

---

## Fase 4 — SaaS / Dashboard 🔮

Dashboard web para:
- Tracking histórico del score del proyecto a lo largo del tiempo
- Alertas automáticas cuando cambia la legislación de un país
- Reportes de cumplimiento exportables (PDF) para due diligence
- Módulo de gestión de solicitudes ARCO

---

## Validación de Calidad y Fuentes

Este paso no está en una "fase" porque es transversal a todo el proyecto — debe ocurrir antes de avanzar de una fase a la siguiente y cada vez que se publique contenido nuevo.

### ¿Qué se valida?

| Dimensión | Qué revisar | Quién |
|---|---|---|
| **Exactitud legal** | ¿El artículo citado existe y dice lo que el archivo dice que dice? | Abogado experto por jurisdicción |
| **Vigencia** | ¿La ley citada sigue vigente? ¿Hubo reforma, reglamento nuevo o criterio de autoridad? | Equipo editorial + alertas legales |
| **Plazos** | ¿Los días hábiles/calendario son correctos según la ley y la doctrina local? | Abogado experto |
| **Sanciones** | ¿Las multas máximas están actualizadas al año en curso? (cambian con salario mínimo) | Equipo editorial |
| **Coherencia interna** | ¿Lo que dice `colombia.json` es consistente con lo que dice `comparativa-derechos.md`? | Revisión técnica cruzada |
| **Cobertura de casos edge** | ¿Los penalizadores cubren los escenarios reales que enfrentan los devs de LATAM? | Comunidad + devs usuarios |

### Proceso de validación editorial (pre-publicación)

```
1. Claude genera borrador del archivo (JSON o Markdown)
         ↓
2. Revisión técnica cruzada (coherencia interna del repositorio)
         ↓
3. Revisión por abogado experto en la jurisdicción
   — Verifica artículos, plazos, sanciones y doctrina local
   — Firma el archivo con su revisión en el frontmatter
         ↓
4. Merge a main con tag de versión
         ↓
5. Disclosure en README: "Revisado por [firma] — [fecha]"
```

### Estado actual de validación (v0.1.0)

| Archivo | Generado | Revisión legal | Validado |
|---|---|---|---|
| `rules/countries/colombia.json` | ✅ | ⏳ Pendiente | ❌ |
| `rules/countries/brasil.json` | ✅ | ⏳ Pendiente | ❌ |
| `rules/countries/mexico.json` | ✅ | ⏳ Pendiente | ❌ |
| `rules/international/gdpr.json` | ✅ | ⏳ Pendiente | ❌ |
| `comparativa-consentimiento.md` | ✅ | ⏳ Pendiente | ❌ |
| `comparativa-derechos.md` | ✅ | ⏳ Pendiente | ❌ |
| `checklist-startup.md` | ✅ | ⏳ Pendiente | ❌ |
| `checklist-datos-sensibles.md` | ✅ | ⏳ Pendiente | ❌ |

> **Hasta que los archivos estén validados, el disclaimer de "guía informativa — no asesoría jurídica" es la única barrera de riesgo.** La validación editorial convierte el proyecto de "útil pero no confiable" a "confiable y citable".

### Fuentes primarias de referencia

Para la validación, las fuentes autoritativas son:

| Jurisdicción | Fuente oficial |
|---|---|
| 🇧🇷 Brasil | [planalto.gov.br](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) — texto oficial LGPD |
| 🇨🇴 Colombia | [sic.gov.co](https://www.sic.gov.co) + [normograma.gov.co](https://www.normograma.gov.co) |
| 🇲🇽 México | [dof.gob.mx](https://www.dof.gob.mx) — DOF oficial + [inai.org.mx](https://home.inai.org.mx) |
| 🇨🇱 Chile | [bcn.cl](https://www.bcn.cl) — Biblioteca del Congreso Nacional |
| 🇦🇷 Argentina | [argentina.gob.ar/aaip](https://www.argentina.gob.ar/aaip) |
| 🇵🇪 Perú | [gacetajuridica.com.pe](https://www.gacetajuridica.com.pe) + ANPD |
| 🇪🇨 Ecuador | [registroficial.gob.ec](https://www.registroficial.gob.ec) |
| 🇪🇺 GDPR | [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679) |
| 🇺🇸 CCPA | [oag.ca.gov/privacy/ccpa](https://oag.ca.gov/privacy/ccpa) |

---

## Principios que guían el Roadmap

1. **Legal primero, tecnología después.** Nunca agregar un país o dimensión sin revisión editorial de un abogado experto.
2. **Open-source siempre.** Las reglas y el conocimiento son abiertos. Los servicios de valor agregado (API, dashboard) pueden tener modelo freemium.
3. **Legible por máquinas desde el día 1.** Todo conocimiento en JSON estructurado desde Fase 1 — nunca en prosa libre sin estructura.
4. **Disclaimer permanente.** Cada versión, endpoint y output incluye el descargo de responsabilidad.
