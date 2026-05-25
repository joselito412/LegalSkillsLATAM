# ROADMAP — LegalSkillsLATAM

> Documento vivo. Actualizado por el Equipo Editorial.

---

## Visión a Largo Plazo

```
[Repositorio GitHub] → [Plugin de Claude] → [CLI Tool] → [API / SaaS]
      Fase 1               Fase 2            Fase 3        Fase 4
```

---

## Fase 1 — Fundación (Actual) ✅

**Objetivo:** Establecer la base de conocimiento y el plugin de Claude.

- [x] Arquitectura del repositorio definida
- [x] `score-formula.json` — motor de riesgo documentado
- [x] `colombia.json` — primer país completo (plantilla para los demás)
- [x] `country-rules.schema.json` — esquema de validación JSON
- [x] 5 Skills de Claude: `clasificar-datos`, `privacy-check`, `risk-score`, `matriz-normativa`, `derechos-usuario`
- [x] `checklist-startup.md` — primer checklist accionable
- [x] `comparativa-consentimiento.md` — primera matriz comparativa
- [ ] Completar `rules/countries/` para los 7 países LATAM
- [ ] Completar `rules/international/gdpr.json` y `ccpa.json`
- [ ] Completar matrices: `comparativa-derechos.md`, `comparativa-sanciones.md`, `comparativa-dpo.md`
- [ ] Completar checklists: `checklist-api-design.md`, `checklist-datos-sensibles.md`
- [ ] `prompts/auditor-privacidad.md` — system prompt para uso directo con cualquier LLM
- [ ] Publicar en GitHub con README completo

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

## Principios que guían el Roadmap

1. **Legal primero, tecnología después.** Nunca agregar un país o dimensión sin revisión editorial de un abogado experto.
2. **Open-source siempre.** Las reglas y el conocimiento son abiertos. Los servicios de valor agregado (API, dashboard) pueden tener modelo freemium.
3. **Legible por máquinas desde el día 1.** Todo conocimiento en JSON estructurado desde Fase 1 — nunca en prosa libre sin estructura.
4. **Disclaimer permanente.** Cada versión, endpoint y output incluye el descargo de responsabilidad.
