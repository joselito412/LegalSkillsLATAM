# LegalSkillsLATAM

**Estándar Abierto de Cumplimiento Legal para Desarrolladores en Latinoamérica**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Security: Trust Hub](https://img.shields.io/badge/Trust%20Hub-95%2F100-brightgreen)](docs/SECURITY.md)
[![Security: Socket](https://img.shields.io/badge/Socket-82%2F100-yellow)](docs/SECURITY.md)
[![Security: Snyk](https://img.shields.io/badge/Snyk%20W011-76%2F100-yellow)](docs/SECURITY.md)
[![Version](https://img.shields.io/badge/version-0.1.1-blue)](docs/ROADMAP.md)

<p align="center">
    <img src="assets/architecture.svg" alt="Arquitectura del repositorio LegalSkillsLATAM" width="48%">
    <img src="assets/risk-score-demo.svg" alt="Demo visual del Legal Risk Score" width="48%">
</p>

> ⚠️ Este proyecto es una guía metodológica y operativa. No constituye ni suplanta asesoría jurídica profesional. Consulta siempre con un abogado experto ante dudas legales específicas.

> 🇬🇧 **English:** Open standard for legal privacy compliance in LATAM — tools for devs, rules for AI, and an open call for legal collaborators (lawyers, academics, legal tech). [Jump to the call →](#-buscamos-colaboradores-legales)

---

## ¿Qué es?

LegalSkillsLATAM es un paquete de herramientas de cumplimiento normativo (*Compliance-as-Code*) diseñado para que desarrolladores de software y startups de Latinoamérica construyan tecnologías conformes a las leyes de privacidad y protección de datos, con proyección hacia los mercados más regulados del mundo.

El proyecto opera en **tres formatos simultáneos**:

| Formato | ¿Para quién? | ¿Dónde está? |
|---|---|---|
| 📄 **Humanos** | Abogados, devs, CTOs | Matrices y checklists en `knowledge/` |
| 🤖 **IA** | Claude y otros LLMs | Skills instalables en `skills/` |
| ⚙️ **Máquinas** | APIs, CI/CD | Reglas JSON en `cli/rules/` |

---

## Estado actual

> 🔨 **Lo que ya funciona bien**
>
> El motor técnico está consolidado: las 5 skills de Claude, la CLI con output visual, el algoritmo de Legal Risk Score (0–100), las reglas JSON por país, los dos pilares Frontend/Backend y la arquitectura del repositorio.
>
> 📌 **Lo que sigue pendiente: verificación de pares**
>
> El contenido legal — reglas, matrices, checklists y penalizadores — fue redactado con criterio técnico-jurídico, pero **aún no ha pasado por revisión formal de pares** (abogados de datos, académicos o profesionales de legal tech). La herramienta funciona; su autoridad normativa todavía se está construyendo.
>
> Si eres abogado/a de protección de datos, académico/a de derecho digital o profesional de legal tech, [este es tu lugar →](#-buscamos-colaboradores-legales)

---

## Dos Pilares: Frontend y Backend

A partir de v0.3, el conocimiento del proyecto está organizado en **dos pilares explícitos**:

| Pilar | Scope | Owner | Riesgo |
|---|---|---|---|
| **Frontend** — UX / Consentimiento / Transparencia | Lo que el usuario ve, toca o decide | PM + UX + Abogado privacidad | 0–50 pts |
| **Backend** — Seguridad Técnica / Arquitectura | Protección interna de datos | CTO + Security Lead + Abogado data governance | 0–50 pts |

> Regla rápida: **Si el usuario lo ve → Frontend. Si el sistema lo hace por dentro → Backend.**

- Documentación de pilares: [`architecture/PILLAR-SEPARATION.md`](architecture/PILLAR-SEPARATION.md)
- Índice de skills por caso de uso: [`skills/_SKILLS-INDEX.md`](skills/_SKILLS-INDEX.md)
- Árbol de decisión de skills: [`skills/_routing.md`](skills/_routing.md)

---

## Arquitectura

![Arquitectura del repositorio](assets/architecture.svg)

---

## El Legal Risk Score

El corazón del proyecto es un algoritmo que calcula el riesgo legal de cualquier sistema en una escala de 0 a 100:

```
Risk Score = min(100, (C_base + Σ Penalizadores) × F_rigor)
```

| Nivel | Rango | Significado |
|---|---|---|
| 🟢 Bajo | 0 – 30 pts | Datos públicos o básicos. Autogestión posible con LegalSkillsLATAM. |
| 🟡 Medio | 31 – 70 pts | Datos personales. Medidas técnicas estrictas requeridas. |
| 🔴 Alto | 71 – 100 pts | Datos sensibles o mercados regulados. **Auditoría legal humana obligatoria.** |

### Output de la skill `/risk-score`

![Risk Score demo](assets/risk-score-demo.svg)

---

## Skills Disponibles

| Skill | Comando | Descripción |
|---|---|---|
| 🗂️ Clasificar Datos | `/clasificar-datos` | Clasifica cualquier campo o tabla según su nivel de sensibilidad legal por jurisdicción |
| 🔍 Privacy Check | `/privacy-check` | Audita un feature, endpoint o esquema de base de datos |
| ⚖️ Risk Score | `/risk-score` | Calcula el Legal Risk Score (0–100) con semáforo y acciones |
| 🌎 Matriz Normativa | `/matriz-normativa` | Compara leyes LATAM vs GDPR vs CCPA en cualquier dimensión |
| 📋 Derechos Usuario | `/derechos-usuario` | Genera el protocolo de respuesta a solicitudes ARCO/ARSOP |

---

## Cobertura Regulatoria

| País | Ley Principal | Estado |
|---|---|---|
| 🇨🇴 Colombia | Ley 1581 de 2012 (Hábeas Data) | ✅ Incluido |
| 🇲🇽 México | LFPDPPP 2010 | ✅ Incluido |
| 🇧🇷 Brasil | LGPD 2020 *(techo regulatorio regional)* | ✅ Incluido |
| 🇨🇱 Chile | Ley 19.628 | ✅ Incluido |
| 🇦🇷 Argentina | Ley 25.326 | ✅ Incluido |
| 🇵🇪 Perú | Ley 29733 | ✅ Incluido |
| 🇪🇨 Ecuador | LOPDP 2021 | ✅ Incluido |
| 🇪🇺 Unión Europea | GDPR 2018 *(referente global)* | ✅ Contraste |
| 🇺🇸 Estados Unidos | CCPA / NIST | ✅ Contraste |

---

## Estructura del Repositorio

```
LegalSkillsLATAM/
│
├── assets/                  # Diagramas y recursos visuales
│   ├── architecture.svg     # Diagrama de arquitectura del proyecto
│   ├── risk-score-demo.svg  # Ejemplo de output del Risk Score
│   └── security-audits.svg  # Estado de compliance de audits
│
├── .claude-plugin/          # Metadata del plugin de Claude
│   └── plugin.json
│
├── skills/                  # Skills instalables en Claude
│   ├── clasificar-datos/    # Clasifica tipo de dato por jurisdicción
│   ├── privacy-check/       # Audita un feature o producto
│   ├── risk-score/          # Calcula el Legal Risk Score (0–100) ★
│   ├── matriz-normativa/    # Compara leyes LATAM vs GDPR/CCPA
│   └── derechos-usuario/    # Guía de respuesta ARCO/ARSOP
│
├── cli/rules/               # Motor de reglas JSON (bundled con el paquete npm)
│   ├── schema/              # JSON Schemas de validación
│   ├── countries/           # Reglas por país (colombia.json, etc.)
│   ├── international/       # GDPR, CCPA
│   └── risk-engine/         # Fórmula del Legal Risk Score
│
├── knowledge/               # Contenido jurídico de referencia (solo lectura)
│   ├── matrices/            # Comparativas normativas en Markdown
│   └── checklists/          # Listas de verificación para devs
├── prompts/                 # System prompts para auditores IA
└── docs/                    # Gobernanza, roadmap, seguridad, contribución
```

---

## Seguridad

![Security Audit Compliance](assets/security-audits.svg)

LegalSkillsLATAM se evalúa frente a los **tres audits de referencia** del ecosistema de skills para agentes de IA. La remediación de seguridad **v0.1.1** elevó el score combinado de **75 → 84/100**.

| Auditor | Score v0.1.0 → v0.1.1 | Estado |
|---|---|---|
| 🛡️ **Gen Agent Trust Hub** | 87 → **95/100** | ✅ Objetivo alcanzado (≥ 95) |
| 🔌 **Socket** | 79 → **82/100** | ⚠️ PASS parcial — cobertura npm completa en Fase 2 |
| 🐍 **Snyk W011** *(prompt injection)* | 58 → **76/100** | ⚠️ PASS parcial — mitigación conductual completa, enforcement técnico diferido |

**Qué se reforzó en v0.1.1:** principio de *Content Isolation* en las 6 skills, 17 test cases de inyección (español, inglés y código), reglas de detección estructural sin palabras clave, y *permission manifests* por skill.

> Los scores son estimaciones internas contra los criterios de cada auditor; aún no se ha ejecutado ningún scan externo. Análisis completo y gaps residuales documentados en [`docs/SECURITY.md`](docs/SECURITY.md).

---

## Instalación como Plugin de Claude

```bash
# Desde Claude Desktop > Settings > Plugins
# Apunta al directorio raíz de este repositorio clonado
git clone https://github.com/joselito412/LegalSkillsLATAM.git
```

Una vez instalado, las skills se activan desde cualquier conversación de Claude:

```
/risk-score "Mi app de salud que captura diagnósticos médicos, opera en Colombia"
/clasificar-datos "tabla: usuarios(id, email, huella_digital, fecha_nacimiento)"
/privacy-check "endpoint POST /registro que guarda IP y fingerprint del dispositivo"
/matriz-normativa consentimiento
/derechos-usuario "usuario pide borrar todos sus datos" --pais BR
```

---

## Gobernanza

El contenido legal de este proyecto es **curado, redactado y actualizado directamente por un equipo editorial con expertise jurídico** en derecho de datos. Ninguna IA genera reglas legales de forma autónoma — la IA solo aplica las reglas que el equipo editorial define.

```
Abogado Experto → Reglas JSON/MD → IA aplica las reglas → Dev recibe guidance
    (Autor)        (Fuente de verdad)    (Ejecutor)           (Beneficiario)
```

Ver [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md) para el flujo completo de control editorial.

---

## Roadmap

```
[Repositorio GitHub] → [Plugin de Claude] → [CLI Tool] → [API / SaaS]
      Fase 1 ✅           Fase 1 ✅          Fase 2 🔜     Fase 3 🔮
```

Ver [`docs/ROADMAP.md`](docs/ROADMAP.md) para el detalle completo, incluyendo el concepto de CLI estilo terminal con score visual inspirado en herramientas como `react-doctor`.

---

## ¿Para quién?

| Perfil | Uso principal |
|---|---|
| 👨‍💻 Desarrollador independiente | Clasificar los datos de su app y conocer sus obligaciones legales |
| 🚀 Startup / CTO | Auto-evaluar el riesgo legal antes de lanzar o internacionalizar |
| 🤖 Agente de IA (LLM) | Auditar código y arquitecturas usando las reglas JSON del proyecto |
| ⚖️ Abogado / Consultor | Revisar, corregir y enriquecer el contenido normativo del repositorio |
| 🎓 Académico / Investigador | Referencia comparativa de normativas LATAM vs GDPR vs CCPA |

---

## 🤝 Buscamos colaboradores legales

Este es un llamado abierto a:

🔹 **Abogados de protección de datos** en cualquier país de LATAM

🔹 **Académicos de derecho digital** o regulación tecnológica

🔹 **Profesionales de legal tech** que quieran construir estándares abiertos

**No necesitas saber programar.** El contenido legal está en Markdown y JSON legible. Solo necesitas saber de leyes y tener ganas de que LATAM tenga herramientas de compliance a la altura de las de Europa o EE.UU.

📌 **Estado actual:** por verificar con pares — y ahí es donde entras tú.

Puedes empezar abriendo un Issue con tus observaciones, corrigiendo una matriz, o revisando una regla JSON de tu país. Ver [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) para el proceso detallado.

---

## Contribuir

Ver [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).

---

## Licencia

MIT — Ver [`LICENSE`](LICENSE).

---

*LegalSkillsLATAM — Cerrando la brecha entre el código y el cumplimiento legal en LATAM.*
