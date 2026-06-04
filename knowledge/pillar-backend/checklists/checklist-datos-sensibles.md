# Checklist Backend — Protección Técnica de Datos Sensibles
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **LegalSkillsLATAM** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Validación: Abogado de data governance

Usa este checklist si tu sistema trata datos sensibles (salud, biometría, menores, religión, origen étnico, orientación sexual). Cubre la protección técnica y arquitectónica. Para los flujos de interfaz, ver [checklist-ux-flujos.md](../../pillar-frontend/checklists/checklist-ux-flujos.md).

---

## Bloque 1: Base Legal y Registro de Consentimiento Sensible

- [ ] Identificada la **base legal específica** para tratar datos sensibles en cada país donde opera el sistema
  - Brasil (LGPD): Art. 11 — consentimiento específico o base especial documentada
  - Colombia (Ley 1581): Art. 6 — autorización expresa del titular
  - México (LFPDPPP): Art. 9 — consentimiento expreso y por escrito
  - GDPR: Art. 9.2 — consentimiento explícito u otra base del Art. 9.2
- [ ] La base legal está **documentada internamente** con fecha, responsable y referencia legal
- [ ] El registro de consentimientos para datos sensibles tiene campo `data_category` = sensible y `legal_basis` específica
- [ ] El registro es **append-only** — no se puede sobrescribir el historial de consentimiento sensible

```sql
-- Esquema mínimo para consentimiento de datos sensibles
CREATE TABLE user_consents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  purpose         VARCHAR(100) NOT NULL,
  data_category   VARCHAR(50) NOT NULL,   -- 'sensitive_health', 'biometric', 'minors'
  country         CHAR(2) NOT NULL,
  granted         BOOLEAN NOT NULL,
  notice_version  VARCHAR(20) NOT NULL,
  legal_basis     VARCHAR(100) NOT NULL,  -- base legal aplicada
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ,
  ip_address      INET
);
-- NUNCA DELETE en esta tabla — solo INSERT y UPDATE (revoked_at)
```

---

## Bloque 2: Cifrado de Datos Sensibles

### Cifrado en tránsito

- [ ] TLS 1.2 mínimo (recomendado TLS 1.3) para todas las comunicaciones
- [ ] Certificados SSL/TLS con renovación automática
- [ ] APIs internas entre microservicios también usan TLS (mTLS recomendado)
- [ ] HSTS habilitado

### Cifrado en reposo

- [ ] Datos sensibles cifrados en la base de datos a **nivel de columna** o con cifrado de disco completo
- [ ] Las claves de cifrado gestionadas con KMS (AWS KMS, GCP Cloud KMS, Azure Key Vault, HashiCorp Vault)
- [ ] Las claves **nunca están hardcodeadas** en el código fuente o en el repositorio
- [ ] Existe un proceso documentado de **rotación de claves**
- [ ] Los backups de datos sensibles también están cifrados

```python
# ✅ Correcto: cifrado a nivel de campo con KMS
encryption_key = get_secret_from_kms('HEALTH_DATA_KEY')  # nunca hardcodeada
cipher = Fernet(encryption_key)
diagnosis_encrypted = cipher.encrypt(diagnosis.encode())

# ❌ Incorrecto: dato sensible en texto plano
db.save(user_id=uid, diagnosis="Diabetes tipo 2")

# ❌ Incorrecto: clave hardcodeada
HEALTH_KEY = b'my-secret-key-123'  # NUNCA en el código
```

### Datos biométricos — requisitos adicionales

- [ ] Las plantillas biométricas **nunca se almacenan en texto plano** — siempre como hash irreversible o plantilla cifrada
- [ ] No se puede reconstruir el biométrico original desde lo almacenado
- [ ] Existe política de retención documentada para plantillas biométricas
- [ ] El proceso de borrado de biométrico es verificable y auditado

---

## Bloque 3: Control de Acceso a Datos Sensibles

- [ ] **Mínimo privilegio**: cada rol solo accede a los datos sensibles que necesita para su función
- [ ] Los datos de salud y biométricos **NO son accesibles** por todos los desarrolladores en producción
- [ ] Acceso a datos sensibles en producción requiere **aprobación explícita** y queda registrado en logs de auditoría
- [ ] Las credenciales de producción están en un **gestor de secretos** — no en `.env` del repositorio
- [ ] Separación de ambientes: producción con datos sensibles reales **no es accesible** desde entornos de desarrollo

---

## Bloque 4: Minimización y Ciclo de Vida

- [ ] Solo se recopilan los datos sensibles **estrictamente necesarios** para la finalidad declarada
- [ ] Cada campo sensible tiene una **justificación documentada** de por qué es necesario (test: ¿el servicio funciona sin este campo?)
- [ ] Existe una **política de retención** documentada para cada tipo de dato sensible
- [ ] Los datos se eliminan o anonimizan **automáticamente** al vencer el período de retención (no depende de proceso manual)
- [ ] Los logs que contienen datos sensibles también tienen política de retención configurada

---

## Bloque 5: Capacidad Técnica de Respuesta a Derechos

- [ ] El sistema puede generar un **export completo de todos los datos sensibles** de un usuario específico
- [ ] El sistema puede **eliminar** datos sensibles de un usuario (con excepciones legales documentadas)
- [ ] El sistema puede **anonimizar** datos sensibles cuando la eliminación completa no es posible por ley
- [ ] El sistema puede **bloquear** el tratamiento de datos sensibles de un usuario sin eliminarlos

---

## Bloque 6: Transferencias y Terceros con Acceso a Datos Sensibles

- [ ] Inventario documentado de todos los **proveedores con acceso a datos sensibles**
- [ ] Con cada proveedor: **DPA firmado** que obliga a tratar los datos con el mismo nivel de protección
- [ ] El DPA incluye: qué datos, para qué finalidad, por cuánto tiempo, cómo eliminarlos al terminar la relación
- [ ] Si los proveedores están en EEUU y hay usuarios en UE/Brasil: mecanismo de transferencia documentado (SCCs, adecuación)

---

## Bloque 7: Respuesta a Incidentes con Datos Sensibles

- [ ] Existe un plan documentado de respuesta a brechas que involucren datos sensibles
- [ ] El plan incluye: roles y responsabilidades, árbol de decisión de notificación, plantillas de comunicación
- [ ] El equipo conoce el plan (no solo existe en un documento) y hay simulacros realizados
- [ ] Hay alertas automáticas para acceso inusual a tablas con datos sensibles
- [ ] Los logs de acceso a datos sensibles se conservan por mínimo 12 meses
- [ ] Documentados los plazos de notificación por jurisdicción (LGPD: ~72h, GDPR: 72h, Colombia: "tan pronto como sea posible")

---

## Autodiagnóstico

| Bloques completados | Estado | Acción |
|---|---|---|
| 7/7 ✅ | 🟢 Preparado | Revisar trimestralmente |
| 5–6/7 ✅ | 🟡 En progreso | Completar antes de tratar datos sensibles en producción |
| 3–4/7 ✅ | 🔴 Riesgo alto | No lanzar con datos sensibles hasta completar |
| < 3/7 ✅ | 🚨 Crítico | Consultar abogado especialista inmediatamente |

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance*  
*Ver contraparte frontend: [checklist-ux-flujos.md](../../pillar-frontend/checklists/checklist-ux-flujos.md)*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
