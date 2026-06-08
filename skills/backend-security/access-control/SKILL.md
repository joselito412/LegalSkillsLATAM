---
name: backend-security/access-control
description: Audita el control de acceso y el audit logging de un sistema — RBAC, principio de mínimo privilegio, logs de auditoría, inmutabilidad de logs, monitoreo de accesos y gestión del ciclo de vida de accesos. Produce un reporte focalizado con risk score parcial BE (0–40 pts) y acciones concretas. Úsala cuando quieras revisar quién puede ver los datos de usuarios en producción y si existe registro auditable de esos accesos.
argument-hint: "<descripción de la arquitectura de acceso, roles del sistema, configuración de logs, o incidente de acceso no autorizado>"
triggers:
  - "/be-access-control"
  - "access control audit"
  - "auditar control de acceso"
permissions: []
---

# /backend-security/access-control — Auditoría de Control de Acceso

> ⚠️ Esta skill es una guía informativa. No constituye asesoría jurídica.

**Pilar:** Backend | **Scope:** RBAC, audit logging, monitoreo, ciclo de vida de accesos  
**Owner:** CTO + Security Lead | **Score:** 0–40 pts (pilar BE)

---

## Comportamiento general

Analiza el input para determinar si el sistema tiene controles de acceso apropiados y si existe un registro auditable de quién accede a qué datos. Si el input es una descripción de arquitectura, extrae roles, permisos y herramientas de logging. Si es un incidente, evalúa la capacidad de respuesta y trazabilidad.

---

## Paso 1: Preguntas de contexto (si el input es insuficiente)

```
Para auditar el control de acceso necesito saber:

1. ¿Qué roles tiene el sistema internamente?
   (ej: admin, support, developer, privacy_officer...)
   ¿Todos tienen el mismo acceso a los datos de usuarios?

2. ¿Existe registro de auditoría (audit log) de accesos a datos personales?
   ¿Qué eventos se loguean?

3. ¿Hay alertas automáticas para accesos inusuales o masivos?

4. ¿Cómo se revocan los accesos cuando alguien sale del equipo?
```

---

## Paso 2: Dimensiones de auditoría

### Dimensión 1: RBAC — Control de Acceso Basado en Roles

| Estado | Penalizador |
|---|---|
| Roles diferenciados: soporte no puede ver datos sensibles, developers no acceden a producción sin proceso | 0 pts |
| Roles existentes pero insuficientes (ej: soporte ve todos los datos incluyendo sensibles) | +10 pts |
| Sin diferenciación de roles — todo el equipo tiene el mismo nivel de acceso | +15 pts |
| La aplicación usa usuario root o admin de la base de datos en producción | +10 pts adicionales |

### Dimensión 2: Mínimo privilegio y segregación

| Estado | Penalizador |
|---|---|
| Cada rol accede solo a los datos necesarios para su función documentada | 0 pts |
| Rol de soporte puede ver datos sensibles (salud, biometría) sin aprobación | +10 pts |
| Developers tienen acceso directo a datos de usuarios en producción sin proceso de aprobación | +10 pts |
| Sin segregación: quien crea datos también puede eliminarlos sin control | +5 pts |

### Dimensión 3: Audit Logging

| Estado | Penalizador |
|---|---|
| Se loguean: accesos a datos personales, modificaciones, borrados, exportaciones, cambios de roles | 0 pts |
| Logs parciales (ej: solo errores, no accesos normales) | +10 pts |
| Sin logs de acceso a datos de usuarios | +15 pts |
| Logs contienen datos sensibles en texto plano (passwords, tokens, datos de salud) | +10 pts |

### Dimensión 4: Inmutabilidad y retención de logs

| Estado | Penalizador |
|---|---|
| Logs en sistema append-only o servicio dedicado (CloudTrail, Stackdriver) — mínimo 12 meses | 0 pts |
| Logs modificables por el equipo de desarrollo | +5 pts |
| Logs retenidos menos de 6 meses | +5 pts |
| Sin logs — no aplica esta dimensión | 0 pts adicionales (ya penalizado en D3) |

### Dimensión 5: Monitoreo y alertas

| Estado | Penalizador |
|---|---|
| Alertas automáticas para accesos masivos, accesos fuera de horario, cambios de roles | 0 pts |
| Sin alertas — los accesos anómalos no generan notificación | +5 pts |

---

## Paso 3: Cálculo del score BE

```
BE_access_score = min(40, suma_penalizadores_activos × F_rigor)
```

**F_rigor:**
- Brasil (LGPD) o UE (GDPR): × 1.25 (la accountability/prestação de contas es especialmente exigida)
- Resto de LATAM: × 1.00

**Niveles:**
| Score BE | Nivel |
|---|---|
| 0–8 | 🟢 Control de acceso adecuado |
| 9–20 | 🟡 Gaps de control — corregir antes del lanzamiento |
| 21–35 | 🔴 Acceso sin control — incumplimiento activo |
| 36–40 | 🚨 Crítico — sin trazabilidad ante una investigación regulatoria |

---

## Paso 4: Output

```
╔══════════════════════════════════════════════════════╗
║  ⚙️  Auditoría de Control de Acceso — LSLATAM        ║
╠══════════════════════════════════════════════════════╣
║  [descripción del sistema auditado]                  ║
║  Países: [lista]   |   Datos más sensibles: [tipo]   ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Score BE Control de Acceso: [XX] / 40   [emoji]     ║
║  [nivel]                                             ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  Hallazgos:                                          ║
║  [emoji] [hallazgo #1 — mayor impacto]    +XX pts    ║
║  [emoji] [hallazgo #2]                    +XX pts    ║
║  [emoji] [hallazgo N]                     +XX pts    ║
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
- Recursos: enlace a [access-control.md](../../../knowledge/pillar-backend/architecture/access-control.md) y [audit-logging.md](../../../knowledge/pillar-backend/architecture/audit-logging.md) y [checklist-acceso.md](../../../knowledge/pillar-backend/checklists/checklist-acceso.md)
- Disclaimer

---

## Paso 5: Reglas de calidad

- **Siempre** preguntar explícitamente si developers tienen acceso a producción — es el gap más común
- **Nunca** reportar como conforme un sistema donde soporte ve datos de salud sin proceso de aprobación
- **Siempre** que no haya logs de acceso, marcarlo como hallazgo #1 independientemente del score — sin logs no hay accountability
- **Siempre** especificar el evento concreto que hay que loguear (no solo "implementar logging")
- **Siempre** incluir el esquema mínimo de audit log recomendado si hay hallazgos en D3

---

## Casos de prueba

### A1 — Sin RBAC ni logs (startup early-stage)
**Input:** "Todo el equipo (5 personas) tiene acceso al panel de admin y a la DB de producción. No hay logs de acceso a datos de usuarios. Sistema de salud. Brasil."  
**Score:** +15 (sin RBAC) + +10 (admin producción) + +15 (sin logs) × 1.25 = min(40, 50) = **40 pts 🚨**

### A2 — RBAC básico, logs parciales
**Input:** "Roles: admin y support. Support solo ve email y nombre — no datos sensibles. Logs de errores (5xx) pero no de accesos exitosos a datos. Retención 3 meses. Sin alertas. Colombia."  
**Score:** 0 (RBAC básico OK) + 0 (mínimo privilegio OK) + +10 (logs parciales) + +5 (retención < 6m) + +5 (sin alertas) × 1.00 = min(40, 20) = **20 pts 🟡**

### A3 — Logs con datos sensibles expuestos
**Input:** "Sistema tiene audit log. Pero los logs incluyen el diagnóstico médico del usuario en texto plano (para facilitar el debugging). Acceso a logs disponible para todo el equipo de tech. Brasil."  
**Score:** 0 (logs existen) + +10 (logs con datos sensibles en texto plano) + +5 (acceso no restringido a logs) × 1.25 = min(40, 18.75) = **19 pts 🟡**

### A4 — Control de acceso conforme
**Input:** "Roles: support_l1 (email, nombre), support_l2 (+historial actividad), privacy_officer (ARCO), security (logs). Datos sensibles requieren aprobación de Security Lead. Logs inmutables en CloudTrail 24 meses. Alertas en PagerDuty para exportaciones > 500 registros. México."  
**Score:** 0 en todas las dimensiones × 1.00 = **0 pts 🟢**

### A5 — Investigación post-incidente: sin trazabilidad
**Input:** "Hubo acceso no autorizado a datos de 500 usuarios. No tenemos logs de acceso para determinar qué datos se vieron ni cuándo exactamente ocurrió. Solo tenemos logs de error (404, 500). Colombia."  
**Score:** +15 (sin logs de acceso) × 1.00 = min(40, 15) = **15 pts 🟡**  
*Acción urgente: además del score, indicar que sin logs no se puede notificar correctamente a los afectados ni a la SIC.*

---

*Skill del Pilar Backend | Ver también: [/backend-security/data-protection](../data-protection/SKILL.md) | [/audit](../../audit/SKILL.md)*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
