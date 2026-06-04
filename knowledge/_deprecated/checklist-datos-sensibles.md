# Checklist: Sistemas con Datos Sensibles

> 🚧 **ARCHIVO DEPRECADO (v0.3)** — Este checklist fue dividido en dos archivos especializados:
> - **Frontend (flujos UX, aviso previo, menores en UI):** [pillar-frontend/checklists/checklist-ux-flujos.md](../pillar-frontend/checklists/checklist-ux-flujos.md)
> - **Backend (cifrado, control de acceso, retención, transferencias):** [pillar-backend/checklists/checklist-datos-sensibles.md](../pillar-backend/checklists/checklist-datos-sensibles.md)
>
> Este archivo se mantiene por compatibilidad pero **no se actualiza**. Usar los nuevos archivos del pilar correspondiente.

---

> **LegalSkillsLATAM** — Guía operativa para devs. No constituye asesoría jurídica.
> Versión: 1.0.0 | Última actualización: 2026-06-02

**Usa este checklist si tu sistema trata alguno de estos tipos de datos:**
- 🏥 Datos de salud (diagnósticos, medicamentos, historial médico)
- 🧬 Datos biométricos (huella digital, reconhecimiento facial, iris, voz)
- 👶 Datos de menores de edad (cualquier usuario < 18 años)
- 🧬 Datos genéticos
- 🗳️ Opiniones políticas, afiliación sindical o religiosa
- 🌍 Origen racial o étnico

> ⚠️ **Regla de oro:** Si el Legal Risk Score de tu sistema es ≥ 71, este checklist es el mínimo. Consulta con un abogado especialista antes de lanzar.

---

## BLOQUE 1: Base Legal y Consentimiento

### 1.1 Base legal documentada

- [ ] Identificaste la base legal específica para tratar datos sensibles en **cada país** donde opera tu sistema
- [ ] La base legal está documentada internamente (no solo "porque el usuario lo aceptó")
- [ ] Si usas consentimiento: es **expreso, específico y destacado** — no está bundleado con los T&C generales
- [ ] Si usas otra base legal (ej: obligación legal, salud pública): está documentada y es verificable

**Por jurisdicción:**

| País | Base legal más común para datos de salud | Requiere consentimiento escrito |
|---|---|---|
| 🇧🇷 Brasil (LGPD) | Art. 9.2.h — tutela da saúde por profissional | Sí, para otros tratamientos |
| 🇨🇴 Colombia (Ley 1581) | Art. 6 — autorización explícita del titular | Sí |
| 🇲🇽 México (LFPDPPP) | Art. 9 — consentimiento expreso y por escrito | Sí, debe ser escrito |
| 🇪🇨 Ecuador (LOPDP) | Art. 26 — consentimiento explícito | Sí |
| 🇪🇺 GDPR | Art. 9.2.a — consentimiento explícito / Art. 9.2.h — asistencia sanitaria | Sí para .a |

### 1.2 Registro de consentimientos

- [ ] El sistema registra **quién** consintió, **cuándo**, **qué versión** del aviso estaba vigente y **qué finalidades** autorizó
- [ ] El registro es inmutable (append-only) — no se puede sobreescribir el historial
- [ ] El sistema permite revocar el consentimiento con tanta facilidad como otorgarlo
- [ ] La revocación queda registrada con timestamp
- [ ] El sistema puede exportar el historial de consentimiento de un usuario específico (para auditorías o solicitudes ARCO)

```sql
-- Esquema mínimo recomendado
CREATE TABLE user_consents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  purpose         VARCHAR(100) NOT NULL,   -- 'health_data_treatment', 'biometric_auth', etc.
  data_category   VARCHAR(50) NOT NULL,    -- 'sensitive_health', 'biometric', 'minors'
  country         CHAR(2) NOT NULL,
  granted         BOOLEAN NOT NULL,
  notice_version  VARCHAR(20) NOT NULL,    -- versión del aviso de privacidad vigente
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ,
  ip_address      INET,
  user_agent      TEXT,
  legal_basis     VARCHAR(100)             -- base legal aplicada
);

-- Nunca hacer DELETE en esta tabla — solo INSERT y UPDATE (revoked_at)
```

---

## BLOQUE 2: Cifrado y Seguridad

### 2.1 Cifrado en tránsito

- [ ] Toda comunicación usa **TLS 1.2 mínimo** (recomendado TLS 1.3)
- [ ] Certificados SSL/TLS válidos y con renovación automática
- [ ] HSTS habilitado (HTTP Strict Transport Security)
- [ ] No hay fallback a HTTP para endpoints que manejan datos sensibles
- [ ] APIs internas entre servicios también usan TLS (no solo las APIs públicas)

### 2.2 Cifrado en reposo

- [ ] Datos sensibles cifrados en la base de datos a nivel de columna o usando cifrado de disco
- [ ] Las claves de cifrado no están hardcodeadas en el código fuente
- [ ] Las claves se gestionan con un KMS (AWS KMS, GCP Cloud KMS, Azure Key Vault, HashiCorp Vault)
- [ ] Existe un proceso de rotación de claves documentado
- [ ] Los backups también están cifrados

```python
# ✅ Correcto: cifrado a nivel de campo para datos de salud
from cryptography.fernet import Fernet

# La clave viene de variables de entorno / KMS — NUNCA hardcodeada
encryption_key = os.getenv('HEALTH_DATA_ENCRYPTION_KEY')
cipher = Fernet(encryption_key)

diagnosis_encrypted = cipher.encrypt(b"Diabetes tipo 2")
db.save(user_id=user_id, diagnosis=diagnosis_encrypted)

# ❌ Incorrecto: datos sensibles en texto plano
db.save(user_id=user_id, diagnosis="Diabetes tipo 2")
```

### 2.3 Datos biométricos — requisitos adicionales

- [ ] Las plantillas biométricas **nunca se almacenan en texto plano** — siempre como hash irreversible o plantilla cifrada
- [ ] No se puede reconstruir el biométrico original desde lo almacenado
- [ ] Existe una política de retención: ¿cuánto tiempo se guardan las plantillas?
- [ ] El usuario puede solicitar la eliminación de su biométrico y hay un proceso para hacerlo efectivo

### 2.4 Control de acceso

- [ ] Principio de mínimo privilegio: cada servicio/rol accede solo a los datos que necesita
- [ ] Los datos de salud/biométricos NO son accesibles por todos los desarrolladores en producción
- [ ] Acceso a datos sensibles en producción requiere aprobación y queda registrado en logs de auditoría
- [ ] Las credenciales de base de datos de producción están en un gestor de secretos (no en `.env` del repo)
- [ ] Hay separación de ambientes: producción con datos reales no es accesible desde local/dev

---

## BLOQUE 3: Datos de Menores de Edad

*(Aplica si tu plataforma puede tener usuarios menores de 18 años)*

### 3.1 Verificación de edad

- [ ] Existe un mecanismo de verificación o declaración de edad en el registro
- [ ] Si el usuario declara ser menor, el flujo requiere autorización del tutor legal
- [ ] El consentimiento del tutor queda registrado (nombre, relación, timestamp, método de verificación)
- [ ] Hay un proceso para actualizar el estatus cuando un usuario menor llega a la mayoría de edad

### 3.2 Restricciones de tratamiento para menores

- [ ] Los datos de menores **NO se usan para publicidad personalizada**
- [ ] Los datos de menores **NO se comparten** con terceros para marketing o perfilado
- [ ] La política de privacidad tiene una sección específica y comprensible para padres/tutores
- [ ] El sistema tiene capacidad para eliminar todos los datos de un menor a petición del tutor

### 3.3 Diseño seguro para menores

- [ ] La interfaz no está diseñada para manipular a menores a dar más datos de los necesarios
- [ ] No hay dark patterns que lleven a menores a aceptar más permisos de los necesarios
- [ ] Las configuraciones de privacidad por defecto son las más restrictivas posibles para menores

---

## BLOQUE 4: Minimización y Retención

### 4.1 Minimización de datos

- [ ] Solo recopilas los datos sensibles **estrictamente necesarios** para la finalidad declarada
- [ ] No recopilas datos sensibles "por si acaso" o "para análisis futuros" sin finalidad específica actual
- [ ] Cada campo sensible tiene una justificación documentada de por qué es necesario

**Test de minimización:** Para cada campo de dato sensible, pregunta: ¿El servicio dejaría de funcionar si no tuviera este campo? Si la respuesta es "no", elimínalo.

### 4.2 Política de retención

- [ ] Existe una política de retención documentada para cada tipo de dato sensible
- [ ] Los datos se eliminan automáticamente al vencer el período de retención (no depende de proceso manual)
- [ ] Hay un proceso de anonimización para datos que deben conservarse para análisis (sin identificación)
- [ ] Los logs que contienen datos sensibles también tienen política de retención

```yaml
# Ejemplo: política de retención por categoría
retention_policy:
  health_records:
    active_users: "duration_of_service + 5 years"  # varía por país
    inactive_users: "1 year after last login"
    reason: "Obligación legal sector salud Colombia/México"
  biometric_templates:
    active_users: "duration_of_service"
    inactive_users: "90 days after account closure"
    reason: "Solo necesario para autenticación activa"
  minors_data:
    retention: "Until majority age + 1 year or account closure"
    reason: "Protección especial — eliminar en cuanto sea posible"
```

---

## BLOQUE 5: Aviso de Privacidad y Transparencia

### 5.1 Contenido específico para datos sensibles

- [ ] El aviso de privacidad **identifica explícitamente** que se tratan datos sensibles
- [ ] Se explica **por qué** se necesitan esos datos (finalidad específica)
- [ ] Se explica con quién se comparten (si aplica)
- [ ] Se indica el período de retención
- [ ] Se explica cómo el usuario puede ejercer sus derechos (ARCO/ARSOP)
- [ ] El aviso está en lenguaje comprensible (no solo en jerga legal)

### 5.2 Actualizaciones del aviso

- [ ] Existe un proceso para notificar a los usuarios cuando el aviso de privacidad cambia
- [ ] Los cambios que amplíen el tratamiento de datos sensibles requieren nuevo consentimiento
- [ ] El sistema guarda el historial de versiones del aviso y qué versión aceptó cada usuario

---

## BLOQUE 6: Derechos del Titular — Implementación Técnica

### 6.1 Canal de solicitudes

- [ ] Existe un canal claro para que el titular ejerza sus derechos (email dedicado, formulario, sección en la app)
- [ ] Hay un proceso documentado para recibir, validar y responder solicitudes
- [ ] Los plazos de respuesta están implementados con alertas internas (ver `comparativa-derechos.md`)
- [ ] El equipo sabe quién es responsable de atender solicitudes ARCO

### 6.2 Capacidad técnica de respuesta

- [ ] El sistema puede generar un **export completo de todos los datos** de un usuario específico (para solicitudes de acceso)
- [ ] El sistema puede **eliminar** todos los datos de un usuario, incluyendo backups y logs (con las excepciones legales documentadas)
- [ ] El sistema puede **anonimizar** datos de un usuario cuando la eliminación completa no es posible por ley
- [ ] El sistema puede **bloquear** el tratamiento de datos de un usuario sin eliminarlos (para solicitudes de limitación)

```python
# Función de eliminación completa (ejemplo conceptual)
def delete_user_sensitive_data(user_id: str, requester: str, reason: str):
    """
    Elimina todos los datos sensibles de un usuario.
    Registra la eliminación para auditoría.
    """
    # 1. Registrar la solicitud antes de actuar
    log_dsar_action(user_id, action='deletion_requested', by=requester, reason=reason)
    
    # 2. Eliminar datos sensibles de tablas principales
    db.execute("DELETE FROM health_records WHERE user_id = %s", [user_id])
    db.execute("DELETE FROM biometric_templates WHERE user_id = %s", [user_id])
    
    # 3. Anonimizar (no eliminar) datos necesarios para obligaciones legales
    db.execute("""
        UPDATE transactions 
        SET user_name = 'DELETED', user_email = 'deleted@anon.com'
        WHERE user_id = %s
    """, [user_id])
    
    # 4. Marcar usuario como eliminado (no reutilizar el ID)
    db.execute("UPDATE users SET status='deleted', deleted_at=NOW() WHERE id=%s", [user_id])
    
    # 5. Registrar la eliminación completada
    log_dsar_action(user_id, action='deletion_completed', by=requester)
    
    # 6. TODO: coordinar eliminación de backups (proceso separado con SLA de 30 días)
```

---

## BLOQUE 7: Transferencias y Terceros

### 7.1 Proveedores que acceden a datos sensibles

- [ ] Tienes un inventario de todos los proveedores/terceros que tienen acceso a datos sensibles
- [ ] Con cada uno firmaste un **acuerdo de procesamiento de datos** (DPA/contrato de encargado del tratamiento)
- [ ] El contrato obliga al proveedor a tratar los datos con el mismo nivel de protección que tú
- [ ] Los contratos incluyen: qué datos, para qué finalidad, por cuánto tiempo, cómo eliminarlos al terminar

### 7.2 Servidores y servicios en la nube

- [ ] Sabes en qué país están los servidores que alojan datos sensibles
- [ ] Si los servidores están fuera del país del usuario, tienes la base legal para esa transferencia internacional
- [ ] Si usas AWS/GCP/Azure: configuraste la región correcta y tienes el DPA firmado con el proveedor
- [ ] Para Brasil (LGPD) y GDPR: los datos en servidores de EE.UU. requieren mecanismo adicional (SCCs, BCRs)

---

## BLOQUE 8: Respuesta a Incidentes

### 8.1 Plan de respuesta documentado

- [ ] Existe un plan de respuesta a brechas de seguridad que involucren datos sensibles
- [ ] El plan incluye: roles y responsabilidades, árbol de decisión de notificación, plantillas de comunicación
- [ ] El equipo conoce el plan (no solo existe en un documento)
- [ ] Se han realizado simulacros o tabletop exercises

### 8.2 Capacidad de detección y contención

- [ ] Hay alertas automáticas para acceso inusual a tablas con datos sensibles
- [ ] Los logs de acceso a datos sensibles se conservan por mínimo 12 meses
- [ ] Existe la capacidad de revocar tokens/accesos en minutos ante un incidente
- [ ] Hay un proceso para identificar qué usuarios se vieron afectados en una brecha

### 8.3 Obligaciones de notificación

| País | Notificar a autoridad | Plazo | Notificar a afectados |
|---|---|---|---|
| 🇧🇷 Brasil | ANPD | ~72 horas (referencia) | Sí, si hay riesgo |
| 🇨🇴 Colombia | SIC | No hay plazo explícito | Sí, sin dilación |
| 🇲🇽 México | INAI | A la brevedad | Sí, si hay riesgo patrimonial |
| 🇪🇨 Ecuador | DINARDAP/autoridad | 72 horas | Sí, si hay riesgo |
| 🇪🇺 GDPR | Autoridad nacional | 72 horas | Sí, si hay alto riesgo |

---

## Score del Checklist

Usa esta tabla para evaluar el estado de tu sistema:

| Bloques completados | Estado | Acción |
|---|---|---|
| 8/8 bloques ✅ | 🟢 Preparado | Mantener y revisar periódicamente |
| 6-7/8 bloques ✅ | 🟡 En progreso | Completar bloques faltantes antes del lanzamiento |
| 4-5/8 bloques ✅ | 🔴 Riesgo alto | No lanzar con datos sensibles hasta completar |
| < 4 bloques ✅ | 🚨 Crítico | Consultar abogado especialista inmediatamente |

---

*LegalSkillsLATAM — Cerrando la brecha entre el código y el cumplimiento legal en LATAM.*
*Este checklist es una guía operativa. No constituye ni suplanta asesoría jurídica profesional.*
