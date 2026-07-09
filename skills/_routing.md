# Skills Routing — Árbol de Decisión
**Privacy Compliance Skills v0.3**

> Elaborado: 2026-06-04  
> Versión: 1.0

Usa este árbol para llegar a la skill correcta en 3 pasos o menos.

---

## Árbol principal

```
¿Cuál es tu objetivo?
│
├── 1. AUDITORÍA COMPLETA (primer análisis del proyecto — o loop de corrección)
│   └── /audit
│       Output: Risk Score 0–100 + paneles FE + BE (sub-panel DevOps) + 2 acciones
│       v3: loop Evaluar → Corregir → Re-evaluar hasta score aceptable (AGENT-CONTRACT.md)
│
├── 2. AUDITORÍA DE UN PILAR ESPECÍFICO
│   │
│   ├── 2A. FRONTEND — ¿Cómo pide/gestiona el consentimiento?
│   │   └── /frontend-privacy/consentimiento
│   │       Output: Score FE 0–50 + hallazgos de formularios y revocación
│   │
│   ├── 2B. FRONTEND — ¿Está publicada y completa la política?
│   │   └── /frontend-privacy/transparencia
│   │       Output: Score FE 0–40 + hallazgos de política y cookies
│   │
│   ├── 2C. BACKEND — ¿Están los datos técnicamente protegidos?
│   │   └── /backend-security/data-protection
│   │       Output: Score BE 0–50 + hallazgos de cifrado, DPA, retención
│   │
│   └── 2D. BACKEND — ¿Quién puede acceder a los datos y queda registrado?
│       └── /backend-security/access-control
│           Output: Score BE 0–40 + hallazgos de RBAC y audit logging
│
├── 3. CLASIFICAR UN CAMPO DE DATOS
│   └── /clasificar-datos [campo]
│       Output: Nivel de sensibilidad (público/personal/sensible/menores) + jurisdicción
│
├── 4. RESPONDER UNA SOLICITUD ARCO DE UN USUARIO
│   └── /derechos-usuario --pais [XX]
│       Output: Protocolo de respuesta + plazos legales por jurisdicción
│
├── 5. COMPARAR LEYES ENTRE PAÍSES
│   └── /matriz-normativa [dimensión]
│       Dimensiones disponibles: consentimiento, derechos, sanciones, DPO, menores,
│       transferencias, breach_notification, cifrado
│       Output: Tabla comparativa CO/MX/BR/CL/AR/PE/EC/GDPR/CCPA
│
└── 6. SOLO EL NÚMERO DE RIESGO (sin análisis completo)
    └── /risk-score
        Output: Score 0–100 + semáforo + penalizadores activos
```

---

## Routing por pregunta frecuente

| Pregunta del developer | Skill | Tiempo estimado |
|---|---|---|
| "¿Qué riesgo legal tiene este sistema?" | `/audit` | 2 min |
| "¿Mi checkbox de registro es válido?" | `/frontend-privacy/consentimiento` | 1 min |
| "¿Mi política de privacidad cumple la LGPD?" | `/frontend-privacy/transparencia` | 1 min |
| "¿Este campo de DB necesita cifrado?" | `/clasificar-datos [campo]` | 30 seg |
| "¿Mis datos en AWS us-east-1 cumplen para Brasil?" | `/backend-security/data-protection` | 1 min |
| "¿Cómo estructuro mi audit log?" | `/backend-security/access-control` | 1 min |
| "Llegó una solicitud de borrado — ¿qué hago?" | `/derechos-usuario --pais CO` | 1 min |
| "¿Qué exige Colombia vs Brasil en consentimiento?" | `/matriz-normativa consentimiento` | 1 min |
| "¿Cuánto me arriesgo a pagar de multa?" | `/matriz-normativa sanciones` | 1 min |
| "¿Mis menores de edad están cubiertos?" | `/audit` → verificar FLAG_MINORS | 2 min |

---

## Cuándo usar `/audit` vs skills especializadas

| Situación | Recomendación |
|---|---|
| Primera vez evaluando el proyecto | `/audit` — da el panorama completo |
| Ya tienes el panorama, quieres profundizar en FE | `/frontend-privacy/consentimiento` o `/transparencia` |
| Ya tienes el panorama, quieres profundizar en BE | `/backend-security/data-protection` o `/access-control` |
| Quieres verificar un campo específico antes de diseñar la DB | `/clasificar-datos` |
| Un usuario te pidió sus datos | `/derechos-usuario` |
| Vas a expandir a un nuevo país | `/matriz-normativa` + `/audit` con ese país |
| CI/CD — verificar score en cada PR | `/risk-score` vía CLI con `--fail-on 71` |

---

## Skills actualmente disponibles

> 📌 Esta tabla es la **fuente canónica** del estado de las skills. README y `_SKILLS-INDEX.md` la referencian.

| Skill | Estado | Pilar | Score |
|---|---|---|---|
| `/audit` | ✅ v3 (loop iterativo CLI+LLM) | Ambos + DevOps | 0–100 |
| `/frontend-privacy/consentimiento` | ✅ v1 | Frontend | 0–50 |
| `/frontend-privacy/transparencia` | ✅ v1 | Frontend | 0–40 |
| `/frontend-privacy/user-controls` | ✅ v1 | Frontend | Flujo ARCO |
| `/backend-security/data-protection` | ✅ v1 | Backend | 0–50 |
| `/backend-security/access-control` | ✅ v1 | Backend | 0–40 |
| `/backend-security/data-lifecycle` | ✅ v1 | Backend | Retención |
| `/clasificar-datos` | ✅ v1 | Backend | Clasificación |
| `/privacy-check` | 🔄 Mantener (deprecar en v0.4) | Ambos | Hallazgos |
| `/risk-score` | 🔄 Mantener (deprecar en v0.4) | Ambos | 0–100 |
| `/derechos-usuario` | ✅ v1 | Ambos | Protocolo |
| `/matriz-normativa` | ✅ v1 | Ambos | Comparativa |

---

*Privacy Compliance Skills — [DISCLAIMER.md](../DISCLAIMER.md)*  
*Ver índice completo: [_SKILLS-INDEX.md](./_SKILLS-INDEX.md)*
