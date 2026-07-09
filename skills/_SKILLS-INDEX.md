# Skills Index — Mapa de Casos de Uso
**Privacy Compliance Skills — Directorio de Skills**

> Elaborado: 2026-06-04 · Actualizado: 2026-07-08
> Versión: 1.1
> Estado: Activo

> 📌 **Tabla canónica de estados:** la única fuente de verdad del estado de cada skill es la tabla "Skills actualmente disponibles" de [`_routing.md`](./_routing.md). Este índice describe casos de uso; si hay discrepancia de estados, manda `_routing.md`.

Usa esta guía para encontrar la skill correcta según tu caso de uso. Cada entrada indica qué skill invocar, qué output recibirás, y si la skill es actual (✅), en transición (🔄) o planificada (🔮).

---

## Árbol de decisión

```
¿Qué necesitas?
│
├── Auditoría completa de un proyecto
│   └── /audit ✅
│
├── Revisar solo aspectos de UX / Consentimiento / Transparencia
│   ├── ¿Consentimiento granular, checkboxes, revocación?
│   │   └── /frontend-privacy/consentimiento ✅
│   ├── ¿Política de privacidad, cookies, avisos, DPO visible?
│   │   └── /frontend-privacy/transparencia ✅
│   └── ¿Portal ARCO, solicitudes de derechos en UI?
│       └── /frontend-privacy/user-controls ✅
│       └── (protocolo de respuesta) /derechos-usuario ✅
│
├── Revisar solo aspectos técnicos / Arquitectura / Seguridad
│   ├── ¿Qué tipo de dato es? ¿Cómo clasificarlo?
│   │   └── /clasificar-datos ✅
│   ├── ¿Cifrado, hashing, retención, acceso?
│   │   └── /backend-security/data-protection ✅
│   ├── ¿Retención, purga, ciclo de vida del dato?
│   │   └── /backend-security/data-lifecycle ✅
│   └── ¿RBAC, logs de auditoría, segregación?
│       └── /backend-security/access-control ✅
│
├── Calcular el riesgo legal de un proyecto
│   └── /risk-score ✅ → (futuro) parte de /audit
│
├── Comparar leyes de LATAM por dimensión
│   └── /matriz-normativa ✅
│
└── Responder una solicitud de derechos de usuario (ARCO)
    └── /derechos-usuario ✅
```

---

## Tabla de skills por caso de uso

### Skills disponibles hoy (v0.2)

| Caso de uso | Skill | Pilar | Output |
|---|---|---|---|
| "Auditoría legal completa de mi proyecto" | `/audit` | BOTH | Legal Risk Score 0–100, hallazgos críticos, acciones priorizadas |
| "¿Qué riesgo legal tiene este sistema?" | `/risk-score` | BOTH | Score 0–100 con semáforo, desglose de penalizadores |
| "¿Es este dato personal, sensible o público?" | `/clasificar-datos` | BE | Clasificación del dato por nivel de sensibilidad y jurisdicción |
| "¿Este endpoint/feature/schema cumple con privacidad?" | `/privacy-check` | BOTH | Reporte con hallazgos, severidad, acciones correctivas |
| "¿Cómo respondo esta solicitud ARCO?" | `/derechos-usuario` | BOTH | Protocolo de respuesta técnica y plazos por jurisdicción |
| "¿Cuáles son las diferencias entre LATAM y GDPR?" | `/matriz-normativa` | BOTH | Comparativa normativa por dimensión específica |

### Skills especializadas por pilar (disponibles — v0.3 Fase C completada)

| Caso de uso | Skill | Pilar | Output |
|---|---|---|---|
| "¿Cómo implemento consentimiento granular?" | `/frontend-privacy/consentimiento` ✅ | FE | Guía de UI + registro de consentimiento + risk score FE 0–50 |
| "¿Tengo la política de privacidad correcta?" | `/frontend-privacy/transparencia` ✅ | FE | Checklist de requisitos de transparencia + risk score FE 0–40 |
| "¿Cómo implemento el portal de datos del usuario?" | `/frontend-privacy/user-controls` ✅ | FE | Flujo UX de solicitudes ARCO + validación técnica |
| "¿Cómo protejo estos datos técnicamente?" | `/backend-security/data-protection` ✅ | BE | Guía de cifrado/hashing/retención + risk score BE 0–50 |
| "¿Está bien configurado mi RBAC y logging?" | `/backend-security/access-control` ✅ | BE | Auditoría de controles de acceso + risk score BE 0–40 |
| "¿Cuánto tiempo debo conservar estos datos?" | `/backend-security/data-lifecycle` ✅ | BE | Política de retención por tipo de dato y jurisdicción |

---

## Detalle de skills actuales

### `/audit` ✅ (v3 — loop iterativo)

**Cuándo usarla:** Punto de entrada para cualquier proyecto. Cuando necesitas un panorama completo del riesgo legal antes de lanzar o internacionalizar. Desde v3 ejecuta un loop Evaluar → Corregir → Re-evaluar (estilo react-doctor) usando la CLI como fuente de verdad del score; ver `architecture/AGENT-CONTRACT.md`.

**Input:** Descripción del proyecto (o skill hace preguntas si no se proporciona)

**Output:**
```
Legal Risk Score: 62/100 🟡 Medio
├─ Hallazgos críticos (Top 3)
│  1. Sin consentimiento granular (FE)
│  2. Datos sin cifrar en reposo (BE)
│  3. Sin DPA con terceros (BE)
└─ Acciones priorizadas
   1. Implementar toggles de consentimiento esta semana
   2. Cifrar campos sensibles antes de pasar a producción
   3. Firmar DPA con AWS/Google antes del lanzamiento
```

**Jurisdicciones:** Colombia, México, Brasil, GDPR

**Fuentes:** `brasil.json`, `colombia.json`, `mexico.json`, `gdpr.json`

**Ver también:** `checklist-startup.md`, `checklist-datos-sensibles.md`

---

### `/risk-score` ✅

**Cuándo usarla:** Cuando necesitas solo el score numérico de riesgo (sin las preguntas completas de `/audit`). Útil para comparar versiones del sistema o verificar mejoras.

**Input:** Descripción del proyecto o respuestas a dimensiones de riesgo

**Output:** Score 0–100 con semáforo (🟢 <30, 🟡 30–70, 🔴 >70), penalizadores activos, recomendaciones

**Nota de transición:** En v0.3, el output de `/risk-score` se integrará directamente en `/audit` como sub-módulo.

---

### `/clasificar-datos` ✅

**Cuándo usarla:** Antes de diseñar el esquema de base de datos o definir una arquitectura. Cuando necesitas saber qué categoría legal tiene un campo de datos.

**Input:** Nombre del campo, tabla o flujo de datos

**Output:** Clasificación por nivel (público / personal / sensible / menores) con base legal requerida y jurisdicciones donde aplica

**Pilar:** Backend — informa decisiones de cifrado, retención y acceso

---

### `/privacy-check` ✅

**Cuándo usarla:** Antes de hacer merge o deploy de código que involucre datos de usuarios. Auditoría de un endpoint, feature específico o schema de base de datos.

**Input:** Descripción del endpoint/feature/schema

**Output:** Reporte con hallazgos (base legal, minimización, transferencias, seguridad técnica, derechos, menores), severidad y acciones correctivas

**Nota de transición:** En v0.3, los hallazgos de UX/consentimiento migrarán a `/frontend-privacy/consentimiento` y los técnicos a `/backend-security/data-protection`.

---

### `/derechos-usuario` ✅

**Cuándo usarla:** Cuando llega una solicitud real de derechos de un usuario (acceso, rectificación, borrado, portabilidad). Genera el protocolo de respuesta técnica y los plazos.

**Input:** Tipo de solicitud + jurisdicción del usuario

**Output:** Protocolo de respuesta con pasos técnicos, plazos legales y acciones específicas

---

### `/matriz-normativa` ✅

**Cuándo usarla:** Cuando necesitas entender las diferencias entre las leyes de LATAM antes de diseñar un sistema multi-país. Útil para PMs y CTOs que van a internacionalizar.

**Input:** Dimensión a comparar (consentimiento, derechos, sanciones, DPO, menores...)

**Output:** Tabla comparativa de Colombia, México, Brasil, Chile, Argentina, Perú, Ecuador, GDPR, CCPA

---

## Cómo elegir la skill correcta en 10 segundos

**¿Primera vez evaluando el proyecto?**  
→ `/audit`

**¿Tienes un campo específico y no sabes si es "datos personales"?**  
→ `/clasificar-datos`

**¿Vas a hacer merge de un PR con datos de usuarios?**  
→ `/privacy-check`

**¿Llegó una solicitud de borrado de datos de un usuario?**  
→ `/derechos-usuario`

**¿Quieres saber qué dice la ley de Chile vs la LGPD de Brasil?**  
→ `/matriz-normativa`

**¿Quieres solo el número de riesgo (0–100)?**  
→ `/risk-score`

---

## Routing de preguntas frecuentes

| Pregunta | Skill | Pilar |
|---|---|---|
| "¿Qué consentimiento debo implementar en el formulario de registro?" | `/audit` o (futuro) `/frontend-privacy/consentimiento` | FE |
| "¿Cómo cifro las contraseñas de mis usuarios?" | `/clasificar-datos` + `/privacy-check` o (futuro) `/backend-security/data-protection` | BE |
| "¿Necesito un DPO?" | `/audit` o `/matriz-normativa` | BE/BOTH |
| "¿Qué aviso de cookies debo mostrar?" | `/audit` o (futuro) `/frontend-privacy/transparencia` | FE |
| "¿Puedo enviar datos a Google Analytics si opero en Brasil?" | `/privacy-check` o `/matriz-normativa` | BE |
| "¿Cuánto tiempo debo conservar los datos de mis usuarios?" | `/privacy-check` o (futuro) `/backend-security/data-lifecycle` | BE |
| "¿Cómo implemento el derecho de borrado de datos?" | `/derechos-usuario` | BOTH |
| "¿Mi sistema cumple la LGPD?" | `/audit` con país=Brasil | BOTH |
| "¿Cómo manejo datos de menores de edad?" | `/audit` + `checklist-datos-sensibles.md` | BOTH |
| "¿Qué pasa si sufro un data breach?" | `/privacy-check` — sección respuesta a incidentes | BE |

---

## Documentación de soporte

| Recurso | Propósito | Ubicación |
|---|---|---|
| Definición de pilares | Qué es FE vs BE, con ejemplos concretos | [architecture/PILLAR-SEPARATION.md](../architecture/PILLAR-SEPARATION.md) |
| Inventario de contenido | Dónde vive cada archivo, hacia dónde migra | [architecture/CONTENT-MAP.md](../architecture/CONTENT-MAP.md) |
| Puntos de integración | Cuándo FE y BE deben coordinarse | [architecture/INTEGRATION-POINTS.md](../architecture/INTEGRATION-POINTS.md) |
| Matriz SDLC de cumplimiento | Acciones por capa (FE/BE/DevOps/Datos) con refs legales y de estándares | [knowledge/matrices/matriz-sdlc-cumplimiento.md](../knowledge/matrices/matriz-sdlc-cumplimiento.md) |
| Consentimiento por jurisdicción | Comparativa de requisitos de consentimiento | [knowledge/pillar-frontend/matrices/consentimiento-por-jurisdiccion.md](../knowledge/pillar-frontend/matrices/consentimiento-por-jurisdiccion.md) |
| Checklists por pilar | Listas de verificación FE y BE | [knowledge/pillar-frontend/checklists/](../knowledge/pillar-frontend/checklists/) · [knowledge/pillar-backend/checklists/](../knowledge/pillar-backend/checklists/) |
| Contrato CLI↔LLM | Especificación del JSON de findings para agentes | [architecture/AGENT-CONTRACT.md](../architecture/AGENT-CONTRACT.md) |

---

*Privacy Compliance Skills — [DISCLAIMER.md](../DISCLAIMER.md)*  
*Elaborado: 2026-06-04 | Estado: Activo*
