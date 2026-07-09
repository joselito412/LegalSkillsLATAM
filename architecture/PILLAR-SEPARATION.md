# Separación de Pilares: Frontend vs Backend
**Privacy Compliance Skills — Documento Arquitectónico**

> Elaborado: 2026-06-04  
> Versión: 1.0  
> Estado: Activo — base conceptual del proyecto v0.2+

---

## Por qué separar en dos pilares

Hoy, un developer que pregunta "¿qué debo implementar para cumplir con la LGPD?" recibe una respuesta que mezcla:
- `"Crea un banner de cookies"` (decisión de UX/UI)  
- `"Cifra datos en reposo con AES-256"` (decisión de arquitectura)

Son decisiones diferentes, las toman personas diferentes, con plazos y validaciones diferentes. Mezclarlas en un solo output genera confusión sobre quién hace qué.

**El principio:** Si la decisión la toma el PM/UX, es Frontend. Si la decisión la toma el CTO/Security, es Backend. Si la ley exige ambas, se coordinan — pero no se mezclan.

---

## PILAR FRONTEND — UX / UI / Consentimiento / Transparencia

### Definición

Todo lo que el usuario **ve, lee, toca o decide** en relación con sus datos personales.

El Pilar Frontend responde a la pregunta: **¿Cómo se comunica el sistema con el usuario sobre sus datos?**

### Qué incluye

**1. Consentimiento**
- Mecanismo por el cual el usuario autoriza el tratamiento de sus datos
- Granularidad: ¿un checkbox genérico o toggles por finalidad (analytics, marketing, terceros)?
- Revocación: ¿puede el usuario retirar su consentimiento desde la UI? ¿Dónde?
- Registro: ¿se guarda fecha, versión de política y qué autorizó el usuario?
- Flujo de re-consentimiento cuando cambia la política de privacidad

**2. Transparencia**
- Política de privacidad publicada y accesible (footer, onboarding, formularios)
- Qué debe decir la política: propósito del tratamiento, terceros, plazos, derechos
- Aviso de cookies: qué tipos de cookies usa el sistema, base legal de cada una
- Datos de contacto del responsable del tratamiento visible en la política
- Mención de transferencias internacionales si aplica

**3. Formularios seguros (patrón de captura)**
- Checkboxes no pre-marcados por defecto (`checked=false`)
- Lenguaje claro y accesible — sin jerga legal incomprensible
- Validación de edad en el flujo de registro
- Sin dark patterns: no se puede hacer más difícil rechazar que aceptar

**4. Portal de datos del usuario (derechos ARCO en UI)**
- ¿Desde dónde solicita el usuario ver sus datos? ¿Descargarlos? ¿Borrarlos?
- ¿Qué ve el usuario después de hacer la solicitud? ¿Cuánto tarda?
- Comunicación del estado de la solicitud (email, notificación in-app)

**5. Diseño seguro para menores**
- Si la plataforma admite menores: flujo diferenciado con consentimiento parental
- Sin dark patterns orientados a menores
- Configuraciones de privacidad más restrictivas por default para menores

### Propietario del pilar

| Rol | Responsabilidad |
|---|---|
| **PM de Producto** | Owner — define qué se implementa y cuándo |
| **UX Designer** | Diseña los flujos, valida que sean comprensibles |
| **Abogado de privacidad** | Valida que el diseño cumpla requisitos legales de consentimiento |
| **Security Lead** | Reviewer — revisa implicaciones de acceso a datos |

### Riesgo asignado

**0–50 puntos** en el Legal Risk Score total (0–100).  
El pilar Frontend no puede generar más de 50 puntos de penalización solo. Los 50 restantes los aporta el Pilar Backend. El riesgo combinado puede llegar a 100.

### Cadencia de actualización

- **Ad-hoc:** cuando hay cambios en producto, nuevas funcionalidades o requisitos regulatorios de consentimiento
- **Mínimo anual:** revisión por abogado especialista en privacidad

---

## PILAR BACKEND — Seguridad Técnica / Arquitectura de Datos

### Definición

Todo lo que sucede **dentro del sistema** para proteger, clasificar y gestionar los datos de forma técnica.

El Pilar Backend responde a la pregunta: **¿Cómo protege el sistema los datos de manera técnica?**

### Qué incluye

**1. Clasificación de datos**
- Nivel de sensibilidad de cada campo: público, personal, sensible, menores
- Qué campos tienen base legal requerida
- Qué campos activan penalizadores especiales (biometría, salud, menores)
- Mapeo de campos a jurisdicciones donde aplican restricciones

**2. Cifrado y protección técnica**
- En reposo: AES-256 para datos sensibles almacenados en base de datos
- En tránsito: TLS 1.2+ obligatorio, TLS 1.3 recomendado
- En memoria: no persistir datos sensibles en caché sin TTL apropiado
- Hashing de credenciales: bcrypt (cost ≥12), argon2id, o scrypt — nunca MD5, SHA1, SHA256 sin salt
- Llaves de cifrado: gestionadas con KMS, rotadas periódicamente, no en código fuente

**3. Control de acceso (RBAC)**
- Roles mínimos: la aplicación no usa usuario `root` o `admin` en producción
- Principio de mínimo privilegio: cada rol accede solo a lo que necesita
- Segregación de responsabilidades: quien crea datos no puede borrarlos sin aprobación
- Auditoría de accesos: quién accedió a qué, cuándo

**4. Logging de auditoría**
- Qué loguear: accesos a datos personales, modificaciones, borrados, exportaciones
- Qué NO loguear: passwords, tokens, números de tarjeta, datos sensibles en texto plano
- Retención de logs: según jurisdicción (Brasil: referencia 72h para brechas; GDPR: proporcional al riesgo)
- Inmutabilidad: los logs de auditoría no deben ser modificables por usuarios regulares

**5. Ciclo de vida de datos**
- Retención: ¿cuánto tiempo se conservan los datos según la ley?
- Purga automática: mecanismo que borra datos después del período de retención
- Anonimización: alternativa a borrado cuando la ley permite retener datos anonimizados
- Backups: cifrados, testados (recovery drill), con SLA de recuperación documentado

**6. Transferencias internacionales**
- Base legal para enviar datos fuera del país de origen
- DPA (Data Processing Agreement) con cada tercero receptor
- Verificación del nivel de protección del país receptor
- Cláusulas contractuales tipo (SCCs) cuando no hay adecuación

**7. Respuesta a incidentes**
- Plan documentado: detección → contención → notificación → remediación
- Plazos de notificación: 72 horas a autoridad (LGPD referencia, GDPR exige), variable en LATAM
- A quién notificar: ANPD (Brasil), SIC (Colombia), INAI (México), AEPD (España/GDPR)
- Registro del incidente: qué pasó, cuántos afectados, qué datos, cómo se resolvió

### Propietario del pilar

| Rol | Responsabilidad |
|---|---|
| **CTO** | Owner — aprueba decisiones arquitectónicas sobre protección de datos |
| **Security Lead** | Owner técnico — define e implementa controles de seguridad |
| **Abogado de data governance** | Valida transferencias internacionales, ciclo de vida, DPA |
| **Compliance Officer** | Reviewer — verifica alineación con estándares (ISO 27001, SOC 2) |

### Riesgo asignado

**0–50 puntos** en el Legal Risk Score total (0–100).  
El pilar Backend no puede generar más de 50 puntos de penalización solo. El riesgo combinado Frontend + Backend puede llegar a 100 (usando la fórmula de combinación ponderada).

### Cadencia de actualización

- **Trimestral:** revisión de estándares de cifrado, vulnerabilidades nuevas
- **Ad-hoc:** cuando se agregan nuevos proveedores, nuevas transferencias internacionales, o cambia la infraestructura

---

## Comparativa rápida por dimensión

| Dimensión | Frontend | Backend |
|---|---|---|
| **Consentimiento granular** | ✅ (UI, checkboxes, toggles) | ✅ (registro en DB, lógica de tratamiento) |
| **Política de privacidad** | ✅ (texto visible, formato) | ❌ (no es función backend) |
| **Aviso de cookies** | ✅ (banner, categorías) | ✅ (qué cookies técnicamente) |
| **Cifrado** | ❌ (no es decisión de UI) | ✅ (AES-256, TLS, KMS) |
| **Hashing de passwords** | ❌ | ✅ (bcrypt, argon2) |
| **RBAC** | ❌ | ✅ (roles, permisos, segregación) |
| **Audit logging** | ❌ | ✅ (qué loguear, retención) |
| **Portal ARCO (derechos)** | ✅ (UI, flujo de solicitud) | ✅ (lógica de exportación/borrado) |
| **DPA con terceros** | ❌ | ✅ (contratos, verificación) |
| **Ciclo de vida de datos** | ❌ | ✅ (retención, purga) |
| **Diseño para menores** | ✅ (UI, flujo parental) | ✅ (validación técnica de edad, acceso) |
| **Transferencias intl.** | ❌ | ✅ (base legal, SCCs) |
| **Respuesta a incidentes** | ❌ | ✅ (plan, plazos, notificación) |

---

## Ejemplos concretos de clasificación

### Caso 1: "¿Cómo implemento el requisito de consentimiento de la LGPD?"

**Respuesta Frontend:** Crear formulario de registro con checkbox no pre-marcado para política de privacidad. Si hay múltiples finalidades (marketing, analytics, terceros), agregar toggles separados con explicación de cada uno. Incluir enlace visible a la política. Mostrar mecanismo de revocación en el perfil del usuario.

**Respuesta Backend:** Crear tabla `consent_records(user_id, policy_version, timestamp, purposes_accepted[], ip_address)`. Implementar lógica que bloquea el tratamiento de datos si `consent_records` no tiene registro válido para el usuario. Exponer endpoint para revocar consentimiento y actualizar estado en tiempo real.

### Caso 2: "¿Qué hago con los datos biométricos?"

**Respuesta Frontend:** Mostrar aviso explícito ANTES de capturar biometría. Explicar propósito, plazo de retención, cómo borrar. Confirmar comprensión con acción activa del usuario (no click-through).

**Respuesta Backend:** Clasificar campo como `sensible/biométrico`. Aplicar cifrado AES-256 en reposo con KMS. Acceso restringido a roles específicos. Logs inmutables de cada acceso. Retención no mayor a la necesaria para la finalidad declarada. Proceso de purga automática.

### Caso 3: "Vamos a usar Google Analytics — ¿qué necesitamos?"

**Respuesta Frontend:** Agregar cookie de analytics al aviso de cookies. Permitir que el usuario rechace analytics sin perder acceso al servicio. Si está en UE/Brasil: bloquear la carga del script hasta que el usuario acepte.

**Respuesta Backend:** Revisar los datos que envía GA (IP, user ID, comportamiento). Configurar anonimización de IP en GA. Firmar DPA con Google. Mencionar la transferencia internacional a EEUU en la política de privacidad. Verificar base legal para transferencia.

---

## Cuándo un cambio toca ambos pilares

Algunos requisitos legales generan obligaciones en ambos pilares simultáneamente. En esos casos, los owners de ambos pilares deben coordinarse:

| Requisito | Acción FE | Acción BE |
|---|---|---|
| Nuevo tercero (ej: Segment) | Actualizar política de privacidad con Segment mencionado | Firmar DPA con Segment, configurar qué datos envía |
| Cambio en edad mínima (ej: 14→16 años) | Actualizar flujo de validación en formulario | Actualizar lógica de validación en backend, auditar registros existentes |
| Breach notification | Notificar usuarios afectados por UI/email | Notificar autoridad regulatoria, contener brecha, documentar |
| Nueva finalidad de tratamiento | Pedir re-consentimiento específico al usuario | Actualizar base legal en registros de tratamiento |

Ver [INTEGRATION-POINTS.md](INTEGRATION-POINTS.md) para la matriz completa de sincronización.

---

## Resumen para developers

> **Regla simple:** Si el usuario lo ve → Frontend. Si el sistema lo hace por dentro → Backend. Si ambos → coordinación obligatoria.

Usa [_SKILLS-INDEX.md](../skills/_SKILLS-INDEX.md) para encontrar la skill correcta según tu contexto.

---

*Privacy Compliance Skills — [DISCLAIMER.md](../DISCLAIMER.md)*  
*Elaborado: 2026-06-04 | Estado: Activo*
