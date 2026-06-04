# ROADMAP — LegalSkillsLATAM
**Documento vivo. Actualizado por el Equipo Editorial.**

---

## Visión a Largo Plazo

```
  v0.1            v0.2            v0.3            v0.4          v1.0
Fundación  →   CLI Tool   →   Pilares FE/BE  →  Expansión  →  API / SaaS
  ✅              ✅               ✅            En curso        🔮
```

---

## v0.1.0 — Fundación ✅ Completo

**Objetivo:** Establecer la base de conocimiento y el plugin de Claude.

### Entregables

- [x] 5 skills de Claude: `clasificar-datos`, `privacy-check`, `risk-score`, `matriz-normativa`, `derechos-usuario`
- [x] `cli/rules/countries/colombia.json`, `brasil.json`, `mexico.json`
- [x] `cli/rules/international/gdpr.json`
- [x] `cli/rules/risk-engine/score-formula.json` — motor de riesgo v1
- [x] `cli/rules/schema/country-rules.schema.json` — esquema de validación
- [x] `knowledge/checklists/checklist-startup.md` (movido a `_deprecated/` en v0.3)
- [x] `knowledge/checklists/checklist-datos-sensibles.md` (movido a `_deprecated/` en v0.3)
- [x] `knowledge/matrices/` — comparativas de consentimiento y derechos
- [x] `prompts/auditor-privacidad.md` — system prompt para cualquier LLM
- [x] README + DISCLAIMER + assets visuales

---

## v0.2.0 — CLI Tool ✅ Completo

**Objetivo:** Herramienta de línea de comandos con output visual en terminal.

### Entregables

- [x] `cli/src/` — engine TypeScript (scorer, classifier, rules)
- [x] `cli/src/commands/audit.ts` — wizard interactivo de 5 preguntas
- [x] `cli/src/ui/` — box renderer con chalk + progress bar
- [x] `skill /audit` unificada — reemplaza el flujo de 5 skills separadas
- [x] `legalskills.config.json` — configuración de proyecto para CI/CD
- [x] `npx legalskills-latam audit --config` — modo no-interactivo
- [x] `--fail-on <score>` — integración con pipelines CI/CD

**Output del CLI (v0.2):**

```
╔══════════════════════════════════════════════════════╗
║       🔍 LegalSkillsLATAM — Legal Risk Audit         ║
╠══════════════════════════════════════════════════════╣
║  Proyecto : Mi Startup App                           ║
║  País(es) : Colombia 🇨🇴, México 🇲🇽                  ║
╠══════════════════════════════════════════════════════╣
║              67 / 100    😬  RIESGO MEDIO            ║
║  ████████████████░░░░░░░  67%                        ║
╠══════════════════════════════════════════════════════╣
║  📦 Base (Personal General)          40 pts          ║
║  ⚠️  Sin consentimiento granular     +15 pts          ║
║  ⚠️  Servidor fuera de jurisdicción  +20 pts          ║
╚══════════════════════════════════════════════════════╝
```

---

## v0.3.0 — Separación de Pilares FE/BE ✅ Completo (2026-06-04)

**Objetivo:** Reducir complejidad cognitiva separando el conocimiento en dos pilares explícitos con propietarios, responsabilidades y scores diferenciados.

**Problema que resolvió:** Un dev que preguntaba "¿qué consentimiento debo implementar?" recibía 1,176 líneas mezclando UI y arquitectura sin jerarquía. Sin árbol de decisión. Sin claridad de quién decide qué.

### Los dos pilares

| Pilar | Scope | Owner | Score |
|---|---|---|---|
| **Frontend** — UX / Consentimiento / Transparencia | Lo que el usuario ve, toca o decide | PM + UX + Abogado de privacidad | 0–50 pts |
| **Backend** — Seguridad Técnica / Arquitectura | Protección interna de datos | CTO + Security Lead + Abogado de data governance | 0–50 pts |

### Fase A — Documentación conceptual ✅

- [x] `architecture/PILLAR-SEPARATION.md` — definición de cada pilar con ejemplos concretos
- [x] `architecture/CONTENT-MAP.md` — inventario de archivos y rutas de migración
- [x] `architecture/INTEGRATION-POINTS.md` — 7 eventos de sincronización obligatoria FE↔BE
- [x] `skills/_SKILLS-INDEX.md` — árbol de decisión y tabla de skills por caso de uso

### Fase B — Refactoring de contenido ✅

- [x] 8 checklists especializados en `knowledge/pillar-frontend/` y `knowledge/pillar-backend/`
- [x] 4 patrones reutilizables de UI en `knowledge/pillar-frontend/patterns/`
- [x] 4 arquitecturas de referencia en `knowledge/pillar-backend/architecture/`
- [x] 4 matrices + 2 índices de navegación (`_index.md` por pilar)
- [x] Campo `pillar` agregado a penalizadores de los 4 archivos de reglas JSON
- [x] `fe-penalizers.json`, `be-penalizers.json`, `score-formula-v2.json`
- [x] Archivos originales movidos a `knowledge/_deprecated/` con aviso de redirección

### Fase C — Refactoring de Skills y CLI ✅

- [x] `skills/audit/SKILL.md` v2 — output dual con paneles FE y BE separados
- [x] `skills/frontend-privacy/consentimiento/` — nueva skill con 5 TEST-CASES
- [x] `skills/frontend-privacy/transparencia/` — nueva skill con 4 TEST-CASES
- [x] `skills/frontend-privacy/user-controls/` — nueva skill con 5 TEST-CASES
- [x] `skills/backend-security/data-protection/` — nueva skill con 6 TEST-CASES
- [x] `skills/backend-security/access-control/` — nueva skill con 5 TEST-CASES
- [x] `skills/backend-security/data-lifecycle/` — nueva skill con 5 TEST-CASES
- [x] `skills/_routing.md` — árbol de decisión de skills
- [x] CLI: `frontend-scorer.ts`, `backend-scorer.ts`, `frontend-report.ts`, `backend-report.ts`
- [x] `scorer.ts` + `classifier.ts` + `box.ts` + `audit.ts` — actualizados para output dual

**Output del CLI (v0.3):**

```
╔══════════════════════════════════════════════════════╗
║         🔍 LegalSkillsLATAM — Auditoría Dual FE/BE   ║
╠══════════════════════════════════════════════════════╣
║  ┌─ 🖥️  FRONTEND — UX / Consentimiento ─────────┐   ║
║  │ ⚠️  Sin consentimiento granular    +15 pts    │   ║
║  │ ⚠️  Sin política de privacidad     +10 pts    │   ║
║  └────────────────────────────────────────────┘   ║
║  ┌─ ⚙️  BACKEND — Seguridad Técnica ─────────────┐   ║
║  │ 📦 Base (Personal General)         40 pts     │   ║
║  │ ⚠️  Servidores sin garantías        +20 pts    │   ║
║  └────────────────────────────────────────────┘   ║
║             62 / 100    😬  RIESGO MEDIO            ║
║  🖥️  FE → Implementar toggles de consentimiento    ║
║  ⚙️  BE → Firmar DPA con AWS                       ║
╚══════════════════════════════════════════════════════╝
```

### Métricas de éxito de v0.3

| Métrica | Antes (v0.2) | Después (v0.3) |
|---|---|---|
| Líneas de output por auditoría | ~200 (todo mezclado) | ~40 (FE panel + BE panel) |
| Skills para auditar solo consentimiento | 1 skill de 1,176 líneas | 1 skill de 176 líneas |
| Claridad de responsabilidades | No definida | Matriz Owner/Reviewer/Validador |
| Directorios afectados por cambio en consentimiento | 6 | 1 (`pillar-frontend/`) |
| Test cases totales | 8 | 38 (por skill) |

### Gobernanza de pilares

**Pilar Frontend:**
- Owner: PM + UX Designer
- Validación legal: Abogado de privacidad (consentimiento, transparencia, menores)
- Cadencia: Ad-hoc con cambios de producto + revisión anual

**Pilar Backend:**
- Owner: CTO + Security Lead
- Validación legal: Abogado de data governance (cifrado, transferencias, ciclo de vida)
- Cadencia: Trimestral (estándares técnicos) + ad-hoc al agregar proveedores

**Sincronización:** Cuando un pilar cambia, revisar si el otro debe actualizarse. Ver [`architecture/INTEGRATION-POINTS.md`](../architecture/INTEGRATION-POINTS.md).

---

## v0.4.0 — Consolidación y Expansión 🔜 Próximo

**Objetivo:** Validar legalmente el contenido, expandir cobertura de países y formalizar la transición de skills legacy.

### Bloque 1 — Validación legal (prioridad máxima)

El contenido actual es generado y revisado editorialmente, pero no validado por abogados expertos en cada jurisdicción. La validación es lo que convierte el proyecto de "útil" a "citable".

| Archivo | Generado | Revisión legal | Validado |
|---|---|---|---|
| `cli/rules/countries/colombia.json` | ✅ | ⏳ Pendiente | ❌ |
| `cli/rules/countries/brasil.json` | ✅ | ⏳ Pendiente | ❌ |
| `cli/rules/countries/mexico.json` | ✅ | ⏳ Pendiente | ❌ |
| `cli/rules/international/gdpr.json` | ✅ | ⏳ Pendiente | ❌ |
| `knowledge/pillar-frontend/` (8 checklists) | ✅ | ⏳ Pendiente | ❌ |
| `knowledge/pillar-backend/` (9 checklists/arch) | ✅ | ⏳ Pendiente | ❌ |
| Skills v0.3 (6 skills nuevas) | ✅ | ⏳ Pendiente | ❌ |

### Bloque 2 — Países pendientes

| País | Archivo | Prioridad | Razón |
|---|---|---|---|
| 🇪🇨 Ecuador | `cli/rules/countries/ecuador.json` | Alta | LOPDP muy alineada a GDPR — régimen estricto |
| 🇨🇱 Chile | `cli/rules/countries/chile.json` | Alta | Ley 21.719 en vigencia desde 2026 |
| 🇦🇷 Argentina | `cli/rules/countries/argentina.json` | Media | Reconocimiento adecuación UE en proceso |
| 🇵🇪 Perú | `cli/rules/countries/peru.json` | Media | Ley 29733 + nueva reglamentación |
| 🇺🇸 CCPA | `cli/rules/international/ccpa.json` | Media | Para proyectos con usuarios en California |

### Bloque 3 — Deprecación formal de skills legacy

| Skill | Acción |
|---|---|
| `skills/privacy-check/` | Mover a `skills/_deprecated/`, aviso → `/frontend-privacy/consentimiento` + `/backend-security/data-protection` |
| `skills/risk-score/` | Mover a `skills/_deprecated/`, aviso → `/audit` |

### Bloque 4 — Formalización

- [ ] TEST-CASES.md en formato formal para todas las skills (actualmente inline en SKILL.md para skills v0.3)
- [ ] `plugin.json` actualizado con nuevas skills del namespace `frontend-privacy/` y `backend-security/`
- [ ] `cli/rules/countries/_template.json` — guía de autor para nuevos países

---

## v0.5+ — API REST y SaaS 🔮

### API REST

Exponer el motor de riesgo como servicio consumible por pipelines CI/CD:

```
POST /api/v1/score
  Body: { countries, data_types, context_flags }
  Response: { fe_score, be_score, combined_score, penalizers_fe, penalizers_be }

GET /api/v1/rules/countries/{iso_code}
POST /api/v1/audit/code  →  { findings, severity, pillar, legal_refs }
```

```yaml
# Integración CI/CD (visión)
- name: LegalSkillsLATAM Audit
  uses: legalskills-latam/audit-action@v1
  with:
    config: legalskills.config.json
    fail_on_score: 71
```

### SaaS / Dashboard

- Tracking histórico del score a lo largo del tiempo
- Alertas cuando cambia la legislación de un país
- Reportes de cumplimiento exportables (PDF) para due diligence
- Módulo de gestión de solicitudes ARCO

---

## Proceso de validación editorial

Transversal a todas las versiones — debe ocurrir antes de publicar contenido nuevo:

```
1. Borrador generado (Claude o equipo editorial)
         ↓
2. Revisión técnica cruzada (coherencia interna del repositorio)
         ↓
3. Revisión por abogado experto en la jurisdicción
   — Verifica artículos, plazos, sanciones y doctrina local
   — Firma en el frontmatter: reviewed_by + last_reviewed
         ↓
4. Merge a main con tag de versión semántica
         ↓
5. Actualizar tabla de validación en este ROADMAP
```

| Dimensión | Qué revisar | Quién |
|---|---|---|
| Exactitud legal | ¿El artículo citado dice lo que el archivo dice? | Abogado experto |
| Vigencia | ¿La ley sigue vigente? ¿Hubo reforma? | Equipo editorial + alertas |
| Plazos | ¿Los días hábiles/calendario son correctos? | Abogado experto |
| Sanciones | ¿Las multas están actualizadas al año? | Equipo editorial |
| Coherencia interna | ¿Lo que dice el JSON es consistente con los Markdown? | Revisión cruzada |

### Fuentes primarias de referencia

| Jurisdicción | Fuente oficial |
|---|---|
| 🇧🇷 Brasil | [planalto.gov.br](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) — LGPD |
| 🇨🇴 Colombia | [sic.gov.co](https://www.sic.gov.co) + [normograma.gov.co](https://www.normograma.gov.co) |
| 🇲🇽 México | [dof.gob.mx](https://www.dof.gob.mx) + [inai.org.mx](https://home.inai.org.mx) |
| 🇨🇱 Chile | [bcn.cl](https://www.bcn.cl) — Biblioteca del Congreso |
| 🇦🇷 Argentina | [argentina.gob.ar/aaip](https://www.argentina.gob.ar/aaip) |
| 🇵🇪 Perú | [gacetajuridica.com.pe](https://www.gacetajuridica.com.pe) + ANPD |
| 🇪🇨 Ecuador | [registroficial.gob.ec](https://www.registroficial.gob.ec) |
| 🇪🇺 GDPR | [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679) |
| 🇺🇸 CCPA | [oag.ca.gov/privacy/ccpa](https://oag.ca.gov/privacy/ccpa) |

---

## Principios del proyecto

1. **Legal primero, tecnología después.** Nunca agregar un país o dimensión sin revisión editorial de un abogado experto.
2. **Open-source siempre.** Las reglas y el conocimiento son abiertos. Los servicios de valor agregado pueden tener modelo freemium.
3. **Legible por máquinas desde el día 1.** Todo conocimiento en JSON estructurado — nunca en prosa libre sin estructura.
4. **Dos pilares explícitos.** Cada pieza de contenido pertenece a Frontend (UX/consentimiento) o Backend (seguridad técnica). Nada es "de todos".
5. **Disclaimer permanente.** Cada versión, endpoint y output incluye el descargo de responsabilidad.
