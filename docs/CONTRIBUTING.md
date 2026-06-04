# Cómo Contribuir a LegalSkillsLATAM

Gracias por tu interés en contribuir. Este proyecto une expertise legal y técnico — ambos son bienvenidos.

---

## Tipos de Contribución

### Contribuciones Técnicas (sin revisión editorial requerida)
- Mejoras a la CLI o scripts
- Tests de validación de JSON schemas
- Correcciones de formato en Markdown
- Nuevos ejemplos en `examples/`
- Traducciones al inglés o portugués

### Contribuciones de Contenido (requieren revisión editorial)
- Nuevas reglas o correcciones en `cli/rules/countries/` o `cli/rules/international/`
- Nuevas matrices en `knowledge/pillar-frontend/matrices/` o `knowledge/pillar-backend/matrices/`
- Nuevos checklists en `knowledge/pillar-frontend/checklists/` o `knowledge/pillar-backend/checklists/`
- Nuevos patrones en `knowledge/pillar-frontend/patterns/`
- Nuevas arquitecturas de referencia en `knowledge/pillar-backend/architecture/`
- Modificaciones a las skills en `skills/`
- Cambios en la fórmula del `cli/rules/risk-engine/score-formula.json` o `score-formula-v2.json`

### Dónde vive cada tipo de contenido (v0.3+)

| Tipo | Pilar | Ruta |
|---|---|---|
| Consentimiento, UI, cookies, menores (UX) | Frontend | `knowledge/pillar-frontend/` |
| Cifrado, RBAC, retención, DPA, transferencias | Backend | `knowledge/pillar-backend/` |
| Skills de auditoría FE | Frontend | `skills/frontend-privacy/` |
| Skills de auditoría BE | Backend | `skills/backend-security/` |
| Reglas JSON por país | Ambos | `cli/rules/countries/` (campo `pillar` en cada penalizador) |

---

## Proceso

1. **Abre un Issue** describiendo qué quieres cambiar y por qué
2. Espera confirmación antes de escribir código o contenido legal
3. Crea una rama: `feature/nombre-descriptivo` o `fix/descripcion-del-fix`
4. Haz tu PR con descripción clara, referencia al Issue y, si es contenido legal, la fuente normativa exacta
5. El equipo editorial revisará en un plazo de 7–14 días hábiles

---

## Estándares de Calidad

- Los archivos JSON deben validar contra el schema correspondiente en `rules/schema/`
- Todo contenido legal debe citar la fuente normativa exacta (ley, artículo, año)
- Ningún PR puede eliminar el DISCLAIMER de ningún archivo
- El lenguaje es en español (castellano) como idioma primario

---

## Código de Conducta

Este proyecto es un espacio técnico-legal serio. Contribuciones especulativas, contenido de marketing o afirmaciones sin base normativa serán rechazadas.
