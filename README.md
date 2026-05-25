# LegalSkillsLATAM

**Estándar Abierto de Cumplimiento Legal para Desarrolladores en Latinoamérica**

> ⚠️ Este proyecto es una guía metodológica y operativa. No constituye ni suplanta asesoría jurídica profesional. Consulta siempre con un abogado experto ante dudas legales específicas.

---

## ¿Qué es?

LegalSkillsLATAM es un paquete de herramientas de cumplimiento normativo (*Compliance-as-Code*) diseñado para que desarrolladores de software y startups de Latinoamérica construyan tecnologías conformes a las leyes de privacidad y protección de datos, con proyección hacia los mercados más regulados del mundo (Brasil, Europa y Estados Unidos).

El proyecto opera en tres formatos simultáneos:

- **Para humanos**: Matrices comparativas, checklists y guías en Markdown, legibles directamente en GitHub.
- **Para IA**: Skills instalables en Claude que actúan como auditores autónomos de privacidad.
- **Para máquinas**: Reglas en JSON semántico, listas para ser consumidas por APIs o pipelines de CI/CD.

---

## ¿Para quién?

| Perfil | Uso principal |
|---|---|
| Desarrollador independiente | Clasificar los datos de su app y conocer sus obligaciones |
| Startup / CTO | Auto-evaluar el riesgo legal antes de lanzar o internacionalizar |
| Agente de IA (LLM) | Auditar código y arquitecturas usando las reglas JSON del proyecto |
| Abogado / Consultor | Referencia comparativa de normativas LATAM vs GDPR |

---

## Cobertura Regulatoria

| País | Ley Principal | Estado |
|---|---|---|
| 🇨🇴 Colombia | Ley 1581 de 2012 (Hábeas Data) | ✅ Incluido |
| 🇲🇽 México | LFPDPPP 2010 | ✅ Incluido |
| 🇧🇷 Brasil | LGPD 2020 *(techo regulatorio regional)* | ✅ Incluido |
| 🇨🇱 Chile | Ley 19.628 / Nueva Ley en tramitación | ✅ Incluido |
| 🇦🇷 Argentina | Ley 25.326 PDPA | ✅ Incluido |
| 🇵🇪 Perú | Ley 29733 | ✅ Incluido |
| 🇪🇨 Ecuador | Ley Orgánica de PDP 2021 | ✅ Incluido |
| 🇪🇺 Unión Europea | GDPR 2018 *(referente global)* | ✅ Contraste |
| 🇺🇸 Estados Unidos | CCPA / NIST | ✅ Contraste |

---

## Estructura del Repositorio

```
LegalSkillsLATAM/
│
├── .claude-plugin/          # Metadata del plugin de Claude
│   └── plugin.json
│
├── skills/                  # Skills instalables en Claude
│   ├── clasificar-datos/    # Clasifica tipo de dato por jurisdicción
│   ├── privacy-check/       # Audita un feature o producto
│   ├── risk-score/          # Calcula el Legal Risk Score (0–100)
│   ├── matriz-normativa/    # Compara leyes LATAM vs GDPR/CCPA
│   └── derechos-usuario/    # Guía de respuesta ARCO/ARSOP
│
├── rules/                   # Motor de reglas (RAG-Ready, API-Ready)
│   ├── schema/              # JSON Schemas de validación
│   ├── countries/           # Reglas por país (colombia.json, etc.)
│   ├── international/       # GDPR, CCPA
│   └── risk-engine/         # Fórmula del Legal Risk Score
│
├── matrices/                # Comparativas normativas en Markdown
├── checklists/              # Listas de verificación para devs
├── prompts/                 # System prompts para auditores IA
├── docs/                    # Gobernanza, roadmap, contribución
└── examples/                # Casos de uso con código de ejemplo
```

---

## El Legal Risk Score

El núcleo del proyecto es un algoritmo de evaluación de riesgo que calcula un puntaje de 0 a 100 puntos:

```
Risk Score = (C_base + Σ Penalizadores) × F_rigor
```

| Nivel | Rango | Significado |
|---|---|---|
| 🟢 Bajo | 0 – 30 pts | Datos públicos o básicos. Autogestión posible con este repositorio. |
| 🟡 Medio | 31 – 70 pts | Datos personales. Requiere medidas técnicas estrictas. |
| 🔴 Alto | 71 – 100 pts | Datos sensibles o mercados regulados. Auditoría legal humana obligatoria. |

Ver detalles completos en [`rules/risk-engine/score-formula.json`](rules/risk-engine/score-formula.json).

---

## Instalación como Plugin de Claude

```bash
# Desde Claude Desktop > Settings > Plugins
# Apunta al directorio raíz de este repositorio
```

Una vez instalado, las skills se activan con comandos como:
- `/risk-score` — Calcula el riesgo de tu proyecto
- `/clasificar-datos` — Clasifica un campo o base de datos
- `/privacy-check` — Audita un feature completo
- `/matriz-normativa` — Compara leyes por dimensión
- `/derechos-usuario` — Genera respuesta a solicitud ARCO

---

## Gobernanza

El contenido legal de este proyecto es curado, redactado y actualizado directamente por un equipo editorial con expertizia jurídica en derecho de datos de Colombia. Ninguna IA genera reglas legales de forma autónoma — la IA solo aplica las reglas que el equipo editorial define.

Ver [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md) para el flujo completo de control editorial.

---

## Contribuir

Ver [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

---

## Licencia

MIT — Ver [`LICENSE`](LICENSE).
