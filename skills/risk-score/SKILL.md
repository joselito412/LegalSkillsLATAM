---
name: risk-score
description: Calcula el Legal Risk Score (0–100 pts) de un proyecto de software o feature que maneje datos. Produce un puntaje con semáforo de riesgo (🟢🟡🔴), desglose de penalizadores activos y recomendaciones priorizadas. Úsala cuando un dev o startup quiera saber el nivel de riesgo legal de su sistema antes de lanzarlo o internacionalizarlo.
argument-hint: "<descripción del proyecto o feature>"
---

# /risk-score — Legal Risk Score

> ⚠️ Esta skill es una guía informativa. No constituye asesoría jurídica. Ante dudas legales específicas, consulta con un abogado experto.

Evalúa el riesgo legal de un sistema o feature y produce un puntaje de 0 a 100 puntos con su clasificación de semáforo.

## Uso

```
/risk-score $ARGUMENTS
```

**Ejemplos:**
- `/risk-score "App de telemedicina con historia clínica, opera en Colombia y México"`
- `/risk-score "E-commerce con login social y tracking de comportamiento, mercado Chile"`
- `/risk-score "SaaS B2B de nómina que procesa datos de empleados, expansión a Europa"`

## Proceso de Evaluación

Si el usuario no especificó suficiente información, recopílala en orden:

1. **¿Qué tipos de datos almacena o procesa el sistema?** (campo por campo si es posible)
2. **¿En qué países opera actualmente o planea operar?**
3. **¿El sistema trata datos de menores de edad?** (sí / no)
4. **¿Los servidores o proveedores cloud están certificados bajo un régimen adecuado?** (ej: AWS/GCP en regiones EU, SOC2, etc.)
5. **¿El sistema transfiere datos a terceros países o terceras empresas?** (sí / no / sin estructurar)
6. **¿Existe un mecanismo de consentimiento granular?** (toggle por finalidad, no solo "Acepto todo")

---

## Fórmula del Risk Score

### A. Puntaje Base por Categoría de Dato (C_base)

Tomar el puntaje del dato de **mayor sensibilidad** presente en el sistema:

| Categoría | Puntaje |
|---|---|
| Solo datos públicos | 10 pts |
| Datos personales generales (email, teléfono, IP, nombre) | 40 pts |
| Datos sensibles (salud, biometría, menores, ideología) | 80 pts |

### B. Penalizadores de Contexto (sumar al C_base)

| Condición | Penalización |
|---|---|
| Falta de consentimiento inequívoco y granular | +15 pts |
| Tratamiento de datos de menores de edad | +30 pts |
| Servidores fuera de jurisdicción adecuada | +20 pts |
| Transferencia internacional de datos sin estructurar | +15 pts |
| Sin política de privacidad publicada | +10 pts |
| Sin procedimiento documentado de derechos ARCO | +10 pts |

### C. Factor de Rigor Normativo (F_rigor)

| Mercado objetivo | Multiplicador |
|---|---|
| Solo régimen estándar LATAM (CO, MX, CL, AR, PE, EC) | × 1.00 |
| Incluye Brasil (LGPD) o Europa (GDPR) | × 1.25 |

### D. Fórmula Final

```
Risk Score = min(100, (C_base + Σ Penalizadores) × F_rigor)
```

---

## Output Requerido

Genera el resultado en este formato exacto:

```
╔══════════════════════════════════════════════════════╗
║          🔍 LegalSkillsLATAM — Risk Score            ║
╠══════════════════════════════════════════════════════╣
║  Proyecto : [nombre o descripción breve]             ║
║  País(es) : [lista de países]                        ║
║  Dato más sensible: [categoría]                      ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║                    [SCORE] / 100                     ║
║                                                      ║
║                  [EMOJI DE CARA]                     ║
║              [🟢 BAJO / 🟡 MEDIO / 🔴 ALTO]          ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  DESGLOSE                                            ║
║  C_base           : [valor] pts ([categoría])        ║
║  + Penalizadores  : [valor] pts                      ║
║  × F_rigor        : [1.00 / 1.25]                   ║
╠══════════════════════════════════════════════════════╣
║  PENALIZADORES ACTIVOS                               ║
║  [⚠️  descripción]  +XX pts                          ║
║  [⚠️  descripción]  +XX pts                          ║
╠══════════════════════════════════════════════════════╣
║  ACCIONES PRIORITARIAS                               ║
║  1. [acción más urgente]                             ║
║  2. [segunda acción]                                 ║
║  3. [tercera acción]                                 ║
╚══════════════════════════════════════════════════════╝
```

### Emojis de cara según score

| Score | Emoji | Expresión |
|---|---|---|
| 0 – 20 | 😎 | Todo en orden |
| 21 – 30 | 🙂 | Bien, pequeños ajustes |
| 31 – 50 | 😐 | Atención requerida |
| 51 – 70 | 😬 | Riesgo real, actúa pronto |
| 71 – 85 | 😰 | Riesgo alto |
| 86 – 100 | 🚨 | Detente y busca un abogado |

---

## Reglas de Escalamiento

- Si el score final es **≥ 71**, incluir al final:
  > 🔴 **Auditoría legal humana obligatoria.** Este nivel de riesgo supera lo que una guía automatizada puede gestionar de forma segura. Contacta un abogado especialista en protección de datos antes de continuar.

- Si el score es **🟡 Medio (31–70)**, incluir:
  > 🟡 **Implementa las acciones prioritarias antes de lanzar.** Puedes autogestionar este nivel con los checklists de LegalSkillsLATAM, pero documenta cada decisión técnica y su base legal.

- Si el score es **🟢 Bajo (0–30)**, incluir:
  > 🟢 **Proyecto de bajo riesgo.** Sigue los checklists de LegalSkillsLATAM para mantener este nivel. Recuerda que el riesgo puede subir si agregas nuevos tipos de datos o mercados.

---

## Nota sobre el Disclaimer

Siempre cerrar con una línea en cursiva:

> *Este puntaje es una estimación orientativa generada por LegalSkillsLATAM. No constituye asesoría jurídica. Ver [DISCLAIMER.md](../../DISCLAIMER.md).*
