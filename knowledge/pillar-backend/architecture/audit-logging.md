# Arquitectura: Audit Logging
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **Privacy Compliance Skills** — Guía de arquitectura. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Revisión: Trimestral

---

## Por qué el audit log es un requisito legal

Los reguladores de protección de datos exigen **accountability** — la capacidad de demostrar que los datos se trataron conforme a la ley. Sin audit logs, es imposible responder:

- "¿Quién accedió a los datos de este usuario el mes pasado?"
- "¿Se procesó correctamente la solicitud de borrado de este titular?"
- "¿Cuándo y quién exportó estos registros antes de la brecha?"

- LGPD Brasil: Art. 6.X (responsabilização e prestação de contas)
- GDPR: Art. 5.2 (principio de responsabilidad proactiva) + Art. 30 (registro de actividades)
- LFPDPPP México: Art. 19 (medidas de seguridad técnicas) + Art. 30 (departamento de datos)

---

## Diseño del sistema de audit log

### Qué loguear (eventos obligatorios)

```
CATEGORÍA: ACCESO A DATOS
├── Lectura de datos personales de un usuario (por otro usuario o admin)
├── Lectura masiva / exportación de datos de múltiples usuarios
└── Acceso a datos sensibles (salud, biometría, menores)

CATEGORÍA: MODIFICACIÓN DE DATOS
├── Actualización de campos personales
├── Cambio de email, teléfono, dirección
├── Modificación de datos sensibles
└── Respuesta a solicitud de rectificación (ARCO)

CATEGORÍA: ELIMINACIÓN DE DATOS
├── Borrado de cuenta de usuario
├── Borrado de datos específicos (solicitud ARCO)
├── Purga automática por retención
└── Anonimización

CATEGORÍA: GESTIÓN DE ACCESOS
├── Cambio de rol de un usuario
├── Creación de nuevas cuentas de administrador
├── Revocación de accesos
└── Intentos de acceso no autorizado (401, 403)

CATEGORÍA: CONSENTIMIENTO
├── Otorgamiento de consentimiento
├── Revocación de consentimiento
└── Cambio de preferencias de privacidad

CATEGORÍA: SOLICITUDES ARCO
├── Recepción de solicitud
├── Verificación de identidad del solicitante
├── Procesamiento de la solicitud
└── Respuesta enviada al usuario
```

### Qué NO incluir en logs

```
❌ Contraseñas (ni hasheadas)
❌ Tokens de autenticación (JWT, session tokens, API keys)
❌ Números completos de tarjeta de crédito
❌ CVV de tarjetas
❌ Datos biométricos crudos
❌ Datos de salud en texto plano
❌ Claves de cifrado
```

---

## Esquema del registro de log

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Quién realizó la acción
    actor_type      VARCHAR(50) NOT NULL,  -- 'user', 'admin', 'service', 'system'
    actor_id        UUID,                  -- NULL si es acción del sistema
    actor_email     VARCHAR(255),          -- para auditoría legible
    actor_ip        INET,
    actor_country   CHAR(2),               -- jurisdicción del actor
    
    -- Qué acción se realizó
    event_type      VARCHAR(100) NOT NULL, -- 'data_read', 'data_modify', 'data_delete', etc.
    action          VARCHAR(50) NOT NULL,  -- 'read', 'create', 'update', 'delete', 'export'
    result          VARCHAR(20) NOT NULL,  -- 'success', 'denied', 'error'
    
    -- Sobre qué objeto
    resource_type   VARCHAR(100) NOT NULL, -- 'user_profile', 'health_record', 'consent_record'
    resource_id     UUID,                  -- ID del registro afectado
    resource_owner  UUID,                  -- ID del usuario dueño del dato
    
    -- Detalles adicionales
    details         JSONB,                 -- campos específicos modificados, etc.
    request_id      UUID,                  -- para correlacionar con logs de aplicación
    session_id      VARCHAR(255)
);

-- Índices para búsquedas frecuentes en auditorías
CREATE INDEX idx_audit_resource_owner ON audit_logs(resource_owner, created_at DESC);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_event_type ON audit_logs(event_type, created_at DESC);
```

---

## Implementación — Middleware de auditoría

```python
# audit_middleware.py
import uuid
from datetime import datetime, timezone
from functools import wraps
from typing import Optional

def audit_action(event_type: str, resource_type: str):
    """Decorador para loguear acciones automáticamente."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            actor = get_current_user()
            resource_id = kwargs.get('user_id') or kwargs.get('id')
            
            try:
                result = func(*args, **kwargs)
                _write_audit_log(
                    event_type=event_type,
                    action=func.__name__,
                    result='success',
                    actor_id=actor.id if actor else None,
                    actor_ip=get_request_ip(),
                    resource_type=resource_type,
                    resource_id=resource_id,
                    resource_owner=resource_id
                )
                return result
            except PermissionError as e:
                _write_audit_log(
                    event_type=event_type,
                    action=func.__name__,
                    result='denied',
                    actor_id=actor.id if actor else None,
                    actor_ip=get_request_ip(),
                    resource_type=resource_type,
                    resource_id=resource_id
                )
                raise
        return wrapper
    return decorator

# Uso:
@audit_action(event_type='data_read', resource_type='health_record')
def get_health_record(user_id: str):
    return HealthRecord.query.filter_by(user_id=user_id).all()
```

---

## Inmutabilidad de logs

Los logs de auditoría deben ser inmutables — nadie puede modificarlos o eliminarlos.

**Opciones de implementación:**

1. **Tabla append-only en PostgreSQL:**
```sql
-- Revocar permisos de UPDATE y DELETE en la tabla de audit logs
REVOKE UPDATE, DELETE ON audit_logs FROM app_user;
-- Solo INSERT está permitido para el usuario de la aplicación
```

2. **CloudTrail (AWS) / Cloud Audit Logs (GCP):** Logs a nivel de infraestructura que no pueden ser borrados por usuarios del servicio.

3. **Log aggregation service:** Enviar logs a Datadog, Splunk, o Elastic con permisos de solo escritura desde la aplicación.

4. **Blockchain / hash chaining** (para alta seguridad): Cada log incluye el hash del log anterior.

---

## Retención y archivo

| Categoría de log | Retención activa | Archivo | Total |
|---|---|---|---|
| Accesos a datos sensibles | 12 meses | 24 meses adicionales | 36 meses |
| Modificaciones de datos | 12 meses | 12 meses adicionales | 24 meses |
| Solicitudes ARCO | 24 meses | 36 meses adicionales | 60 meses |
| Accesos fallidos (401/403) | 6 meses | 6 meses adicionales | 12 meses |
| Logs de incidente de seguridad | Duración del proceso + período legal |

Los logs archivados pasan a almacenamiento S3/GCS de bajo costo (Glacier, Coldline) — cifrados, pero accesibles en 24-48h si es necesario.

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Security audit interno*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
