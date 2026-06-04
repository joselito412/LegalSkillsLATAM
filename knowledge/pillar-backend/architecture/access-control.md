# Arquitectura: Control de Acceso (RBAC)
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **LegalSkillsLATAM** — Guía de arquitectura. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Revisión: Trimestral

---

## Por qué RBAC es un requisito legal

El control de acceso implementa el principio de **mínimo privilegio** exigido por todas las leyes de protección de datos de LATAM y el GDPR. Que un desarrollador pueda acceder a los datos de salud de todos los usuarios en producción es un incumplimiento del Art. 46 de la LGPD, Art. 32 del GDPR y Art. 19 de la LFPDPPP — incluso si nunca lo hace.

---

## Modelo de roles base (para sistemas SaaS con datos de usuarios)

```
ROLES INTERNOS (equipo de la empresa)
├── system            — procesos automáticos, backups, cron jobs
├── privacy_officer   — acceso a solicitudes ARCO y audit logs; NO a datos en texto plano
├── security          — acceso a logs, configuración de seguridad; NO a datos de usuarios
├── support_l1        — ver email, nombre y estado de cuenta; NO datos sensibles
├── support_l2        — todo lo de L1 + historial de actividad; NO datos sensibles
├── support_sensitive — acceso a datos sensibles solo con aprobación; auditado
├── developer         — acceso a datos de staging/dev anonimizados; NUNCA a producción real
├── developer_prod    — acceso de emergencia a producción; requiere aprobación + auditado
└── admin             — gestión de usuarios y configuración; NO acceso directo a datos de usuarios

ROLES DE USUARIOS (clientes del servicio)
├── user              — acceso solo a sus propios datos
├── user_minor        — permisos más restringidos; cambios requieren acción del tutor
└── parent_guardian   — gestión de cuenta del menor
```

---

## Implementación de RBAC

### Patrón: Middleware de autorización

```python
# authorization.py
from functools import wraps
from typing import List
from enum import Enum

class Permission(Enum):
    # Datos personales básicos
    READ_USER_PROFILE = "read:user_profile"
    WRITE_USER_PROFILE = "write:user_profile"
    
    # Datos sensibles
    READ_HEALTH_DATA = "read:health_data"
    WRITE_HEALTH_DATA = "write:health_data"
    READ_BIOMETRIC = "read:biometric"
    
    # Administración
    READ_AUDIT_LOGS = "read:audit_logs"
    PROCESS_ARCO_REQUEST = "process:arco_request"
    EXPORT_USER_DATA = "export:user_data"
    DELETE_USER_DATA = "delete:user_data"

ROLE_PERMISSIONS = {
    "support_l1": [
        Permission.READ_USER_PROFILE,
    ],
    "support_l2": [
        Permission.READ_USER_PROFILE,
        Permission.READ_AUDIT_LOGS,
    ],
    "privacy_officer": [
        Permission.READ_USER_PROFILE,
        Permission.READ_AUDIT_LOGS,
        Permission.PROCESS_ARCO_REQUEST,
        Permission.EXPORT_USER_DATA,
        Permission.DELETE_USER_DATA,
    ],
    "support_sensitive": [
        Permission.READ_USER_PROFILE,
        Permission.READ_HEALTH_DATA,
        Permission.READ_BIOMETRIC,
    ],
}

def requires_permission(*permissions: Permission):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = get_current_user()
            user_permissions = ROLE_PERMISSIONS.get(user.role, [])
            for perm in permissions:
                if perm not in user_permissions:
                    audit_log_access_denied(user, perm, kwargs.get('resource_id'))
                    raise PermissionError(f"Access denied: {perm.value}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Uso:
@requires_permission(Permission.READ_HEALTH_DATA)
def get_health_records(user_id: str):
    return HealthRecord.query.filter_by(user_id=user_id).all()
```

### Patrón: Row-level security en PostgreSQL

Para datos donde el usuario solo puede ver sus propios registros:

```sql
-- Habilitar RLS en tablas con datos personales
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Política: usuarios solo ven sus propios registros
CREATE POLICY user_isolation ON health_records
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Política: support_sensitive puede ver todos los registros (auditado)
CREATE POLICY support_access ON health_records
    FOR SELECT
    USING (current_setting('app.user_role') = 'support_sensitive');
```

---

## Acceso de emergencia a producción

Cuando un developer necesita acceso a datos de producción (para depurar un incidente):

1. **Solicitar acceso**: el developer abre un ticket indicando razón, tiempo estimado, qué datos necesita ver
2. **Aprobación dual**: CTO + Security Lead aprueban el acceso
3. **Provisión temporal**: se habilita el rol `developer_prod` por el tiempo aprobado (máximo 4 horas)
4. **Sesión auditada**: toda actividad durante la sesión es logueada con correlación al ticket de incidente
5. **Expiración automática**: el rol `developer_prod` expira automáticamente
6. **Revisión post-acceso**: el Security Lead revisa los logs del acceso

Este proceso es obligatorio — no hay acceso ad-hoc de developer a datos de producción.

---

## Segregación de responsabilidades

Para datos de alto riesgo (sensibles, menores), implementar segregación:

| Acción | Quién puede aprobar | Quién puede ejecutar |
|---|---|---|
| Exportar datos de usuario (ARCO) | Privacy Officer | Privacy Officer o sistema automático |
| Borrar cuenta de usuario | Privacy Officer (aprobación) | Sistema automático |
| Acceder a datos de salud en producción | Security Lead (aprobación) | support_sensitive (con ticket) |
| Cambiar configuración de roles | CTO | Admin |
| Ver audit logs de incidente | Security Lead | privacy_officer o security |

---

## Gestión del ciclo de vida de accesos

- [ ] Al **onboarding** de un empleado: aprovisionamiento de accesos mínimos según rol
- [ ] Al **cambio de rol** de un empleado: revocar accesos del rol anterior, aprovisionar del nuevo
- [ ] Al **offboarding** de un empleado: revocar todos los accesos el mismo día de la salida
- [ ] **Revisión trimestral**: verificar que los roles asignados siguen siendo correctos y necesarios
- [ ] Las cuentas de servicio (APIs, cron jobs) tienen roles propios — no usan credenciales de personas

```bash
# Ejemplo: desactivar accesos al hacer offboarding
./scripts/offboard-employee.sh --user john.doe@empresa.com --effective-date 2026-06-04
# Revoca: permisos de AWS IAM, acceso a DB, tokens de API, VPN, acceso a dashboards
# Genera: registro en audit log con motivo y fecha
# Notifica: CTO, Security Lead, HR
```

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Security audit interno*  
*Ver: [audit-logging.md](./audit-logging.md) — para logs de acceso*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
