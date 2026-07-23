# Cómo Contribuir a Privacy Compliance Skills

Privacy Compliance Skills se construye con dos manos: **abogados** que aportan normativa, jurisprudencia y criterio editorial, y **personas técnicas** que mantienen las skills, las reglas en JSON y la CLI. Ambos perfiles son indispensables — y este documento tiene una ruta clara para cada uno.

> **¿Eres abogado/a o trabajas en cumplimiento?** Salta a [Ruta para perfiles legales](#ruta-para-perfiles-legales-abogados-cumplimiento-dpo). No necesitas saber programar ni usar Git.
>
> **¿Eres dev, SRE, security o data?** Salta a [Ruta para perfiles técnicos](#ruta-para-perfiles-técnicos-devs-security-data).

---

## Qué tipo de aporte buscamos

| Necesidad | Quién aporta mejor | Ejemplo concreto |
|---|---|---|
| Citar una **ley, artículo o resolución** que falta o está desactualizada | Legal | "El art. 9 de la Ley 1581/2012 (Colombia) sobre datos sensibles cambió con el Decreto 1377/2013, no aparece en `colombia.json`." |
| Corregir una **interpretación normativa** | Legal | "El plazo ARCO en México es 20 días hábiles, no 15." |
| Sumar un **país nuevo** o una dimensión legal nueva | Legal + Técnico | Argentina, Perú, Ecuador, Costa Rica, etc. |
| Ajustar una **skill** (texto que el agente de IA lee) | Legal (contenido) + Técnico (estructura) | "La skill `derechos-usuario` debería distinguir titular vs representante." |
| Mejorar la **CLI**, scripts, validación de schemas | Técnico | Tests, refactors, mensajes de error más claros |
| Traducir contenido al inglés o portugués | Cualquiera con dominio del idioma | Glosario legal bilingüe |

---

## Ruta para perfiles legales (abogados, cumplimiento, DPO)

**No necesitas instalar nada ni saber Git.** Puedes contribuir 100% desde el navegador.

### Opción A — Reportar o proponer un cambio (recomendado para empezar)

1. Entra al repositorio en GitHub: <https://github.com/joselito412/Privacy_Compliance_Skills-UE-USA-LATAM>
2. Click en la pestaña **Issues** → **New issue**.
3. Describe tu aporte usando esta estructura:

   ```
   **País / Jurisdicción:** Colombia
   **Tipo de aporte:** [ ] Norma faltante  [ ] Corrección  [ ] Actualización  [ ] Nueva interpretación
   **Archivo afectado (si lo identificas):** cli/rules/countries/colombia.json
   **Fuente normativa exacta:** Ley 1581 de 2012, art. 9 + Decreto 1377 de 2013, art. 3
   **Texto relevante de la fuente:** "[cita literal]"
   **Cambio propuesto:** [descripción en lenguaje natural — no necesitas escribir código]
   **Por qué importa:** [riesgo, vacío, error que se evita]
   ```

4. Envía. El equipo editorial te responderá en 7–14 días hábiles. Si la propuesta es válida, **alguien del equipo técnico la implementará** y te acreditará como autor/a en el PR.

> 🔍 **¿Quieres verificar una regla ya publicada contra su fuente primaria?** Ese es un flujo distinto y más formal: el **flujo de validación de pares** (`pending_legal_validation → verified_editorial → under_review → validated`), con su propio [issue template](../.github/ISSUE_TEMPLATE/revision-legal.md). Está documentado completo en [`GOVERNANCE.md` § "Flujo de validación de pares"](GOVERNANCE.md#flujo-de-validación-de-pares) — no lo repetimos aquí.

### Opción B — Editar texto directamente desde el navegador

Para correcciones de redacción en archivos Markdown (las **skills**, **checklists** y **matrices** del directorio `knowledge/`):

1. Navega al archivo en GitHub (ej. `knowledge/pillar-backend/matrices/medidas-seguridad-minimas.md`).
2. Click en el ícono de **lápiz** ("Edit this file") arriba a la derecha.
3. Edita en la web. GitHub crea automáticamente una rama y un Pull Request por ti.
4. En el campo "Propose changes" escribe un título claro y, en la descripción, **cita la fuente normativa**.
5. Click en **Propose changes** → **Create pull request**.

Eso es todo. No tocas la terminal, no instalas nada.

### Qué archivos puedes editar sin riesgo

| Archivo | Qué contiene | Editable desde navegador |
|---|---|---|
| `knowledge/pillar-frontend/matrices/*.md` | Tablas comparativas de privacidad UX | ✅ Sí |
| `knowledge/pillar-backend/matrices/*.md` | Medidas de seguridad mínimas, retención, transferencias | ✅ Sí |
| `knowledge/pillar-frontend/checklists/*.md` | Listas de verificación legales | ✅ Sí |
| `knowledge/pillar-backend/checklists/*.md` | Listas de verificación de seguridad | ✅ Sí |
| `skills/**/SKILL.md` | Instrucciones que recibe el agente de IA | ⚠️ Edición sugerida vía Issue (impacto alto) |
| `cli/rules/countries/*.json` | Reglas legales en formato máquina | ❌ Mejor vía Issue — requiere validación de schema |

### Estándar editorial mínimo

Todo aporte legal debe incluir:

1. **Fuente exacta:** ley o resolución, número, año, artículo. Ej: *"Ley 1581 de 2012, art. 9, lit. b — Colombia"*.
2. **Texto literal de la norma** cuando sea posible (entre comillas).
3. **Fecha de la última verificación** (porque las leyes cambian).
4. **Tu nombre o seudónimo** y, si aplica, tu rol (abogado/a, DPO, asesor/a).

Si tu aporte es interpretativo (no literal de la ley), márcalo claramente como **"Interpretación editorial"** y explica el razonamiento.

---

## Ruta para perfiles técnicos (devs, security, data)

### Tipos de contribución

**Sin revisión editorial:**
- Mejoras a la CLI (`cli/`) o scripts (`scripts/`)
- Tests, validación de JSON schemas
- Correcciones de formato Markdown
- Ejemplos en `examples/`
- Traducciones técnicas (inglés, portugués)

**Con revisión editorial obligatoria** (porque el contenido es normativo):
- `cli/rules/countries/*.json` y `cli/rules/international/*.json`
- `knowledge/pillar-*/matrices/`, `knowledge/pillar-*/checklists/`, `knowledge/pillar-*/patterns/`, `knowledge/pillar-backend/architecture/`
- `skills/**/SKILL.md`
- `cli/rules/risk-engine/score-formula*.json`

### Dónde vive cada cosa (v0.3+)

| Tipo | Pilar | Ruta |
|---|---|---|
| Consentimiento, UI, cookies, menores (UX) | Frontend | `knowledge/pillar-frontend/` |
| Cifrado, RBAC, retención, DPA, transferencias | Backend | `knowledge/pillar-backend/` |
| Skills de auditoría FE | Frontend | `skills/frontend-privacy/` |
| Skills de auditoría BE | Backend | `skills/backend-security/` |
| Reglas JSON por país | Ambos | `cli/rules/countries/` (campo `pillar` por penalizador) |

### Proceso

1. Abre un **Issue** describiendo qué cambiar y por qué (o reclama uno existente).
2. Espera confirmación del equipo antes de escribir código o contenido legal.
3. Rama: `feature/nombre-descriptivo` o `fix/descripcion-del-fix`.
4. Si tocas JSON de reglas: corre `npm run validate` antes del commit.
5. PR con descripción clara, referencia al Issue, y **fuente normativa exacta** si el cambio es legal.
6. Revisión del equipo editorial: 7–14 días hábiles.

### Estándares técnicos

- Los archivos JSON deben validar contra el schema en `cli/rules/schema/`.
- Mantén determinístico el orden de claves en JSON (alfabético dentro de cada objeto).
- No introduzcas dependencias npm sin justificación + scan con SkillSpector y `npm audit` (ver [SECURITY.md](SECURITY.md)).
- Las skills (`SKILL.md`) deben mantener su sección **Reglas de Aislamiento de Contenido** intacta.

---

## Estándares comunes (legal y técnico)

- **Idioma primario:** español (castellano).
- **Citas:** toda afirmación normativa requiere fuente verificable.
- **DISCLAIMER:** ningún PR puede eliminar el DISCLAIMER de ningún archivo.
- **Atribución:** los aportes se acreditan en el commit y, para contenido editorial, en `reviewed_by` del JSON correspondiente.

---

## Código de conducta

Este es un proyecto técnico-legal serio. Se rechazan:

- Contenido especulativo o sin fuente normativa verificable.
- Material de marketing o promoción de servicios.
- Afirmaciones legales sin sustento (ley, artículo, jurisprudencia).
- Conducta irrespetuosa hacia colaboradores legales o técnicos.

El respeto entre disciplinas es la regla principal: los abogados confían en que el equipo técnico no distorsione la norma; los técnicos confían en que el equipo legal explique el "por qué" de cada cambio.

---

## ¿Tienes dudas antes de contribuir?

Abre un Issue con la etiqueta `question` y describe tu duda. Es válido preguntar **antes** de invertir tiempo en un PR.
