---
name: backend-security/data-lifecycle
description: Audita el ciclo de vida de datos en un sistema — política de retención, purga automática, anonimización, backups y respuesta a incidentes. Produce un reporte focalizado con risk score parcial BE (0–40 pts) y acciones concretas. Úsala cuando quieras verificar cuánto tiempo conservas los datos de tus usuarios, si los eliminas correctamente y si tus backups están protegidos.
argument-hint: "<descripción de la política de retención, estructura de la DB, o configuración de backups del sistema>"
---

# /backend-security/data-lifecycle — Auditoría de Ciclo de Vida de Datos

> ⚠️ Esta skill es una guía informativa. No constituye asesoría jurídica.

**Pilar:** Backend | **Scope:** Retención, purga, anonimización, backups, respuesta a incidentes  
**Owner:** CTO + Security Lead | **Score:** 0–40 pts (pilar BE)

---

## Comportamiento general

Analiza el input para determinar si el sistema tiene una política de retención documentada, procesos de purga automática y backups seguros. Si el input describe el esquema de base de datos o la infraestructura, extrae toda la información posible. Si es muy breve, haz hasta 3 preguntas enfocadas.

---

## Paso 1: Preguntas de contexto (si el input es insuficiente)

```
Para auditar el ciclo de vida de tus datos necesito saber:

1. ¿Tienes una política de retención documentada?
   ¿Cuánto tiempo conservas los datos de usuarios activos? ¿E inactivos?

2. ¿Existe un proceso automático que borre o anonimice datos vencidos?
   ¿O es manual?

3. ¿Tienes backups? ¿Están cifrados? ¿Cuándo fue el último recovery drill?

4. ¿En qué países operan? ¿Tienen usuarios en Brasil, UE o Ecuador?
```

---

## Paso 2: Dimensiones de auditoría

### Dimensión 1: Política de retención documentada

| Estado | Penalizador |
|---|---|
| Política documentada con plazos por categoría de dato (personales, sensibles, logs, financieros) | 0 pts |
| Política existe pero es genérica ("conservamos lo necesario") — sin plazos específicos | +5 pts |
| Sin política de retención — datos conservados indefinidamente | +10 pts |

**Referencia de plazos mínimos (verificar con abogado por sector y jurisdicción):**

| Tipo de dato | Referencia orientativa |
|---|---|
| Datos de cuenta activa | Duración del servicio |
| Datos post-cancelación | 1–2 años (LATAM) / mínimo necesario (GDPR) |
| Logs de acceso | 6–12 meses activos, archive 12+ meses |
| Datos financieros | 5–10 años (obligación contable/fiscal) |
| Datos de salud | Regulación sectorial — generalmente 5–10 años |
| Datos de menores | Hasta mayoría de edad |

### Dimensión 2: Purga automática

| Estado | Penalizador |
|---|---|
| Job/cron automático configurado, monitoreado y con alertas de fallo | 0 pts |
| Purga manual (depende de que alguien la ejecute) | +5 pts |
| Sin proceso de purga — datos acumulados indefinidamente | +10 pts |
| El job de purga existe pero no ha sido probado ni tiene logs de ejecución | +5 pts |

### Dimensión 3: Anonimización

| Estado | Penalizador |
|---|---|
| Proceso de anonimización documentado e irreversible (no solo enmascarar email) | 0 pts |
| Solo seudonimización o enmascaramiento reversible | +5 pts |
| Sin capacidad de anonimizar — solo borrado total o nada | +3 pts |

### Dimensión 4: Backups

| Estado | Penalizador |
|---|---|
| Backups cifrados + región separada + recovery drill documentado y ejecutado | 0 pts |
| Backups configurados pero sin cifrado | +5 pts |
| Backups sin recovery drill en los últimos 12 meses | +5 pts |
| Sin backups | +10 pts |
| Backups con datos sensibles accesibles sin autenticación adicional | +5 pts adicionales |

### Dimensión 5: Respuesta a incidentes (si F_rigor = 1.25)

Solo se activa para Brasil (LGPD), Ecuador (LOPDP) o UE (GDPR):

| Estado | Penalizador |
|---|---|
| Plan documentado con roles, árbol de decisión de notificación y plantillas | 0 pts |
| Plan existe pero no ha sido probado ni comunicado al equipo | +5 pts |
| Sin plan de respuesta a incidentes | +10 pts |

---

## Paso 3: Cálculo del score BE

```
BE_lifecycle_score = min(40, suma_penalizadores_activos × F_rigor)
```

**F_rigor:**
- Brasil (LGPD), Ecuador (LOPDP) o UE (GDPR): × 1.25
- Resto de LATAM (CO, MX, CL, AR, PE): × 1.00

**Niveles:**

| Score BE | Nivel |
|---|---|
| 0–8 | 🟢 Ciclo de vida controlado |
| 9–20 | 🟡 Gaps menores — corregir antes del lanzamiento |
| 21–32 | 🔴 Datos acumulados indefinidamente — incumplimiento activo |
| 33–40 | 🚨 Crítico — sin control del ciclo de vida de datos |

---

## Paso 4: Output

```
╔══════════════════════════════════════════════════════╗
║  ⚙️  Auditoría de Ciclo de Vida — LegalSkillsLATAM   ║
╠══════════════════════════════════════════════════════╣
║  [descripción del sistema / política auditada]       ║
║  Países: [lista]   |   Dato más sensible: [tipo]     ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Score BE Ciclo de Vida: [XX] / 40   [emoji]         ║
║  [nivel]                                             ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  Hallazgos:                                          ║
║  [emoji] [hallazgo #1]                    +XX pts    ║
║  [emoji] [hallazgo #2]                    +XX pts    ║
╠══════════════════════════════════════════════════════╣
║  Acción esta semana:                                 ║
║    → [acción #1 específica]                          ║
║  Antes de lanzar:                                    ║
║    → [acción #2]                                     ║
╚══════════════════════════════════════════════════════╝
```

**Después del box:**
- Supuestos aplicados si los hay
- Si score BE ≥ 21: escalamiento a `/audit` para visión completa
- Recursos: [checklist-ciclo-vida.md](../../../knowledge/pillar-backend/checklists/checklist-ciclo-vida.md)
- Disclaimer

---

## Paso 5: Reglas de calidad

- **Siempre** preguntar el período de retención actual antes de calificar como "sin política"
- **Nunca** reportar como conforme un sistema que conserva datos indefinidamente aunque cifre bien
- **Siempre** verificar si la purga respeta excepciones legales (obligación contable, fiscal, sectorial)
- **Siempre** que haya datos de salud: la retención puede tener plazos muy específicos por ley — señalarlo
- **Siempre** mencionar que este score es parcial y que `/audit` da visión completa FE+BE

---

## Casos de prueba

### L1 — Sin política, sin purga, sin backups
**Input:** "Startup SaaS. Guardamos datos de usuarios desde el lanzamiento (2022). No tenemos política de retención ni proceso de purga. Backups diarios pero sin cifrar. Colombia."  
**Score:** +10 (sin política) + +10 (sin purga) + +5 (backups sin cifrado) × 1.00 = min(40, 25) = **25 pts 🔴**

### L2 — Política parcial con purga manual
**Input:** "Tenemos una política que dice 'conservamos datos 2 años desde la última actividad'. La purga es manual — un dev la ejecuta trimestralmente. Backups cifrados en S3 con recovery drill anual. México."  
**Score:** +5 (política genérica) + +5 (purga manual) + 0 (backups OK) × 1.00 = min(40, 10) = **10 pts 🟡**

### L3 — Sistema de salud, LGPD, sin plan de incidentes
**Input:** "App de telemedicina. Política de retención por tipo de dato documentada. Job de purga automático semanal con monitoreo. Backups cifrados, recovery drill semestral. Sin plan de respuesta a incidentes. Brasil."  
**Score:** 0 (política OK) + 0 (purga OK) + 0 (backups OK) + +10 (sin plan incidentes, Brasil F_rigor 1.25) × 1.25 = min(40, 12.5) = **13 pts 🟡**

### L4 — Ciclo de vida conforme
**Input:** "SaaS B2B. Política de retención: datos activos = duración del servicio, datos inactivos = 18 meses, logs = 12 meses. Job de purga en Lambda cada lunes con alertas en PagerDuty. Anonimización con k-anonymity antes de análisis. Backups S3 cifrados, región separada, recovery drill trimestral. Plan de incidentes documentado y simulacro realizado. Colombia y Brasil."  
**Score:** 0 en todas × 1.25 (Brasil) = **0 pts 🟢**

### L5 — Backups accesibles sin auth adicional
**Input:** "Backups configurados en S3. Cifrados con KMS. Pero el bucket es accesible para cualquier developer con credenciales de AWS del equipo — sin autenticación adicional ni políticas de acceso restringido. Datos de salud. Ecuador."  
**Score:** 0 (retención asumida OK) + 0 (purga asumida) + +5 (backups accesibles sin auth adicional) × 1.25 = min(40, 6.25) = **7 pts 🟢-🟡**

---

*Skill del Pilar Backend | Ver también: [/backend-security/data-protection](../data-protection/SKILL.md) | [/backend-security/access-control](../access-control/SKILL.md) | [/audit](../../audit/SKILL.md)*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
