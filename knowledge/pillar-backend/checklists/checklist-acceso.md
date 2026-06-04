# Checklist Backend — Control de Acceso y Audit Logging
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **LegalSkillsLATAM** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Validación: Abogado de data governance  
> Cadencia de revisión: Trimestral

El control de acceso y el logging de auditoría son los dos pilares técnicos de la **accountability** — la obligación de demostrar que los datos se trataron conforme a la ley. Sin ellos, no hay forma de responder preguntas como "¿quién vio los datos de este usuario?" ante una autoridad regulatoria.

---

## Bloque 1: RBAC — Control de Acceso Basado en Roles

- [ ] Existe un sistema de roles definido para el acceso a datos de usuarios
  - Roles mínimos recomendados: `viewer` (solo lectura) / `editor` (lectura+escritura) / `admin` (gestión de usuarios) / `privacy_officer` (acceso a solicitudes ARCO)
- [ ] **Mínimo privilegio**: cada rol solo tiene acceso a los datos necesarios para su función
  - Ej: soporte al cliente puede ver email y nombre, pero NO ver contraseña hasheada, historial médico ni datos biométricos
- [ ] La app en producción NO usa el usuario `root` o `admin` de la base de datos
- [ ] Las credenciales de producción están en un gestor de secretos (no en `.env` del repositorio de código)
- [ ] **Segregación de responsabilidades**: quien puede crear datos no puede borrarlos sin aprobación de otro rol
- [ ] Existe un proceso documentado para **aprovisionar y desprovisionar** accesos cuando alguien entra o sale del equipo

---

## Bloque 2: Autenticación de Usuarios Internos

- [ ] El acceso al panel de administración o dashboards internos requiere **MFA** (multi-factor authentication)
- [ ] Las sesiones de administración tienen **timeout** automático por inactividad
- [ ] Los accesos fallidos generan alertas (brute force detection)
- [ ] Se usan **llaves SSH o certificados** para acceso a servidores — no contraseñas simples
- [ ] Existe un proceso de rotación periódica de contraseñas y tokens de servicio

---

## Bloque 3: Audit Logging — Qué Registrar

> El audit log responde a: ¿Quién hizo qué, sobre qué datos, cuándo y desde dónde?

**Eventos obligatorios a loguear:**
- [ ] Accesos a datos personales sensibles (lectura de historial médico, exportación de datos de usuario)
- [ ] Modificaciones a datos personales (quién cambió qué campo)
- [ ] Borrados de datos (quién borró, qué registro, cuándo)
- [ ] Exportaciones masivas de datos de usuarios
- [ ] Cambios en configuración de seguridad o roles
- [ ] Intentos de acceso no autorizado (403, 401)
- [ ] Respuestas a solicitudes ARCO (quién procesó, qué acción tomó)

**Campos mínimos de cada registro de log:**
```json
{
  "event_id": "uuid",
  "timestamp": "ISO 8601",
  "actor_id": "user_id o service_account",
  "actor_ip": "IP",
  "event_type": "data_access | data_modify | data_delete | export | role_change",
  "resource_type": "user_profile | health_record | consent_record",
  "resource_id": "uuid del registro afectado",
  "action": "read | update | delete | export",
  "result": "success | denied",
  "metadata": {}
}
```

**Eventos que NO deben aparecer en logs:**
- [ ] Contraseñas (ni hasheadas ni en texto plano)
- [ ] Tokens de autenticación o API keys
- [ ] Números completos de tarjeta de crédito
- [ ] Datos biométricos crudos
- [ ] Datos de salud en texto plano

---

## Bloque 4: Inmutabilidad y Retención de Logs

- [ ] Los logs de auditoría son **inmutables** — no pueden ser modificados ni eliminados por roles de usuario regulares
  - Implementar con: append-only storage, WORM (Write Once Read Many), o servicio dedicado (CloudTrail, Stackdriver)
- [ ] Los logs se conservan por **mínimo 12 meses** (recomendado 24 meses para datos sensibles)
- [ ] Los logs más antiguos se archivan (no eliminan) en almacenamiento de bajo costo
- [ ] Los logs de incidentes de seguridad se conservan por el tiempo del proceso de investigación + período legal aplicable
- [ ] El acceso a logs de auditoría está **restringido** a roles específicos (no todos los developers pueden ver todos los logs)

---

## Bloque 5: Monitoreo y Alertas

- [ ] Existen **alertas automáticas** para:
  - Acceso masivo o inusual a datos personales (ej: un usuario leyendo miles de registros en minutos)
  - Múltiples intentos fallidos de autenticación
  - Cambios en configuración de roles en producción fuera de horario laboral
  - Exportaciones de datos superiores a un umbral (ej: >1,000 registros)
- [ ] Las alertas van a un canal monitoreado (Slack, PagerDuty, email del Security Lead)
- [ ] Hay un proceso de respuesta definido para cada tipo de alerta crítica

---

## Bloque 6: Ejercicio de Derechos — Logging Específico

> Este bloque es crítico para demostrar compliance ante una autoridad regulatoria.

- [ ] Existe un registro específico de todas las **solicitudes ARCO recibidas**:
  - Tipo de solicitud (acceso, rectificación, cancelación, oposición, portabilidad)
  - Fecha de recepción
  - Identidad del solicitante (verificada)
  - Fecha de respuesta
  - Acción tomada
  - Usuario responsable de la respuesta
- [ ] El sistema puede generar un reporte de solicitudes ARCO por período para auditorías regulatorias

---

## Autodiagnóstico

| Bloques completados | Estado | Acción |
|---|---|---|
| 6/6 ✅ | 🟢 Accountability demostrable | Revisar trimestralmente |
| 4–5/6 ✅ | 🟡 En progreso | Completar audit logging (bloque 3) como prioridad — es el más auditable |
| 2–3/6 ✅ | 🔴 Riesgo | Sin audit logs, no hay forma de responder a una investigación regulatoria |
| < 2/6 ✅ | 🚨 Crítico | Implementar RBAC y logging básico antes de cualquier operación con datos reales |

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
