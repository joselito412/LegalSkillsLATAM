# Integration Points — Sincronización entre Pilares
**Privacy Compliance Skills — Documento Arquitectónico**

> Elaborado: 2026-06-04  
> Versión: 1.0  
> Estado: Activo

Los pilares Frontend y Backend son independientes en responsabilidades, pero no en contenido. Hay puntos de sincronización obligatorios: cuando uno cambia, el otro debe revisarse. Este documento los define.

---

## Por qué es necesaria la sincronización

Un sistema legalmente compliant no se logra con un pilar solo. La transparencia (Frontend) sin protección técnica (Backend) genera exposición por incumplimiento de seguridad. La seguridad técnica sin transparencia al usuario genera incumplimiento de requisitos de consentimiento.

**Ejemplo real:** Una empresa cifra todos sus datos con AES-256 (Backend ✅) pero su política de privacidad no menciona el tratamiento de datos (Frontend ❌). En Brasil bajo la LGPD, esto es una infracción: el usuario tiene derecho a saber *cómo* se protegen sus datos, aunque el sistema sea técnicamente seguro.

---

## Mapa de integración por evento

### 1. Se agrega un nuevo tercero (proveedor externo)

**Detonante:** Se integra un nuevo SDK o servicio que recibe datos de usuarios.  
**Ejemplos:** Segment, Mixpanel, HubSpot, Stripe, Intercom, Google Analytics, Hotjar.

| Acción Backend | Acción Frontend |
|---|---|
| Evaluar qué datos envía el SDK al tercero | Agregar el tercero a la política de privacidad |
| Verificar nivel de protección del país del proveedor | Si hay transferencia internacional: mencionarlo en la política |
| Firmar o solicitar DPA al proveedor | Si es cookie de analytics/marketing: actualizar aviso de cookies |
| Documentar base legal de la transferencia | Si es nuevo propósito de tratamiento: pedir re-consentimiento |
| Configurar qué campos se envían (minimización) | Actualizar lista de categorías de cookies si aplica |

**Responsable de coordinación:** CTO (BE) + PM (FE) en mismo sprint.

---

### 2. Se cambia el mecanismo de consentimiento

**Detonante:** Se modifica cómo el usuario da, revoca o gestiona su consentimiento.  
**Ejemplos:** Se pasa de un "Acepto todo" a toggles granulares. Se agrega opt-out. Se cambia la versión de política.

| Acción Frontend | Acción Backend |
|---|---|
| Rediseñar el flujo de consentimiento en UI | Actualizar esquema de `consent_records` si cambia la estructura |
| Actualizar texto de checkboxes y tooltips | Verificar que la lógica de tratamiento respeta la nueva granularidad |
| Actualizar versión de política en el formulario | Si hay opt-out de analytics: bloquear técnicamente el envío de datos a Segment/GA |
| Definir flujo de re-consentimiento (si hay cambio material) | Notificar a usuarios existentes con consentimiento "viejo" si la ley lo exige |
| Implementar UI de revocación en perfil | Asegurar que al revocar consentimiento se procesa la solicitud técnicamente |

**Responsable de coordinación:** PM (FE) + CTO (BE) + Abogado de privacidad (valida).

---

### 3. Se cambia la edad mínima de usuarios

**Detonante:** La plataforma sube o baja la edad mínima permitida. O se detecta que menores usan el sistema sin restricciones.  
**Ejemplos:** Se descubre que hay usuarios menores. Se decide dar acceso a mayores de 13 años con consentimiento parental.

| Acción Frontend | Acción Backend |
|---|---|
| Actualizar flujo de validación de edad en registro | Actualizar validación técnica de edad en el backend |
| Si hay menores: implementar flujo de consentimiento parental en UI | Auditar registros existentes: identificar usuarios que podrían ser menores |
| Actualizar política de privacidad con sección de menores | Clasificar los datos de menores con `minors_flag = true` en la base de datos |
| Revisar dark patterns: sin presión indebida en la UX de menores | Aplicar acceso más restrictivo a datos de usuarios menores |
| Agregar aviso visible en formularios cuando aplican restricciones | Bloquear tratamiento de datos de menores para finalidades no permitidas (ej: publicidad) |

**Responsable de coordinación:** PM + UX (FE) + CTO (BE) + Abogado especialista en menores.

---

### 4. Se cambia el nivel o algoritmo de cifrado

**Detonante:** Se actualiza el estándar de cifrado (ej: migrar de SHA-256 a bcrypt), se agrega cifrado a un nuevo campo, o un proveedor cambia sus garantías.

| Acción Backend | Acción Frontend |
|---|---|
| Implementar nuevo algoritmo de cifrado | Si la política menciona "datos protegidos con X": actualizar texto |
| Migrar datos existentes al nuevo estándar | Si el cambio implica pedir contraseña al usuario (migración): diseñar el flujo en UI |
| Actualizar documentación técnica de seguridad | Si hay certificaciones (SOC 2, ISO 27001): actualizar referencias en política |

**Responsable de coordinación:** CTO/Security Lead (BE) + PM (FE) si hay cambios visibles al usuario.

---

### 5. Se cambia el período de retención de datos

**Detonante:** Se actualiza la ley, se recibe una observación regulatoria, o se cambia la política interna de retención.  
**Ejemplos:** La ANPD emite guía que establece 2 años para datos de usuarios inactivos. El equipo legal decide purgar datos de usuarios sin actividad por 12 meses.

| Acción Backend | Acción Frontend |
|---|---|
| Actualizar política de retención en la base de datos | Actualizar política de privacidad con el nuevo plazo de retención |
| Configurar job de purga automática con el nuevo plazo | Si el usuario puede ver "tus datos se conservarán por X años": actualizar texto |
| Actualizar documentación en `checklist-ciclo-vida.md` | Si la UI mostraba alguna información de retención: actualizar |

**Responsable de coordinación:** CTO (BE) + Abogado (valida plazo legal) + PM (FE) para actualizar policy.

---

### 6. Se detecta o sufre un incidente de seguridad (breach)

**Detonante:** Exposición de datos de usuarios por cualquier causa (ataque, error de configuración, acceso no autorizado).

| Acción Backend | Acción Frontend |
|---|---|
| Activar plan de respuesta a incidentes | — |
| Contener la brecha (revocar accesos, aislar sistemas) | — |
| Notificar a la autoridad regulatoria (plazos: LGPD ~72h, GDPR 72h) | — |
| Documentar el incidente (qué datos, cuántos afectados, cómo) | — |
| Evaluar si se requiere notificación a usuarios | **Si hay notificación:** diseñar comunicación al usuario (email, notificación in-app) |
| — | **Si hay notificación:** definir qué información comunicar (sin crear pánico, con claridad) |
| — | **Post-incidente:** actualizar política si el incidente reveló un gap de transparencia |

**Responsable de coordinación:** CTO (BE) + Abogado (notificación legal) + PM (FE) para comunicación al usuario.

---

### 7. Se agrega una nueva jurisdicción de operación

**Detonante:** La plataforma comienza a operar en un nuevo país o recibe usuarios de una nueva región.

| Acción Backend | Acción Frontend |
|---|---|
| Revisar las reglas del nuevo país (ej: agregar archivo `chile.json`) | Actualizar política de privacidad para incluir la nueva ley y los derechos del usuario en ese país |
| Verificar si los proveedores tienen DPA o adecuación para esa jurisdicción | Si el nuevo país tiene idioma diferente: política debe estar disponible en ese idioma |
| Aplicar el nivel de rigor del nuevo país al scorer | Actualizar aviso de cookies si la nueva jurisdicción tiene requisitos específicos |
| Evaluar si la infraestructura de la región (servidores) cumple requisitos | Si hay requisitos de localización de datos: comunicarlo en política |

**Responsable de coordinación:** CTO (BE) + Abogado especialista en la nueva jurisdicción + PM (FE).

---

## Matriz de sincronización

Referencia rápida: cuando cambia X, siempre revisar Y.

| Cambio en | Revisar en FE | Revisar en BE |
|---|---|---|
| Nuevo tercero/SDK | Política de privacidad, aviso de cookies | DPA, transferencia internacional, minimización de datos |
| Cambio en consentimiento | UI de consentimiento, flujo de revocación | Lógica de tratamiento según nueva granularidad |
| Cambio de edad mínima | Flujo de validación de edad, UI de menores | Validación técnica, auditoría de registros existentes |
| Cambio de cifrado | Política (si mencionaba el estándar) | Algoritmo, migración, documentación técnica |
| Cambio de retención | Política (plazo visible al usuario) | Job de purga, configuración de retención en DB |
| Incidente de seguridad | Comunicación al usuario (si procede) | Contención, notificación regulatoria, remediación |
| Nueva jurisdicción | Política en nuevo idioma, UI localizada | Reglas JSON del país, DPA de proveedores en esa región |
| Nuevo propósito de tratamiento | Re-consentimiento UI, política actualizada | Base legal del nuevo propósito, registro en treatments |
| Cambio en derechos ARCO | Portal de solicitudes (UI), comunicación de plazos | Lógica de exportación, borrado, bloqueo de datos |

---

## Checklist de integración antes de merge

Usar antes de hacer merge de cualquier cambio que toque datos de usuarios:

```
□ ¿Este cambio está en el Pilar Frontend, Backend o ambos?
□ Si FE: ¿el abogado de privacidad validó el diseño de consentimiento/transparencia?
□ Si BE: ¿el Security Lead validó la implementación técnica?
□ Si FE: ¿hay algún elemento de este cambio que Backend deba reflejar? (ver tabla arriba)
□ Si BE: ¿hay algún elemento de este cambio que Frontend deba reflejar? (ver tabla arriba)
□ ¿Se actualizó la política de privacidad si el cambio es visible al usuario?
□ ¿Se documentó el cambio en CHANGELOG.md con el pilar correspondiente?
□ ¿Los TEST-CASES de las skills afectadas siguen pasando?
```

---

## Propietario de la sincronización

**Responsable:** Equipo Editorial (PM Legal + CTO)  
**Cadencia:** Con cada cambio en cualquier pilar  
**Herramienta:** Este documento + checklist de integración arriba

Cuando haya duda sobre si un cambio requiere sincronización, consultar la tabla de la sección anterior. Si el cambio no está en la tabla, revisar si afecta la visibilidad al usuario (FE) o la protección técnica de datos (BE). Si toca ambas, coordinar.

---

*Privacy Compliance Skills — [DISCLAIMER.md](../DISCLAIMER.md)*  
*Elaborado: 2026-06-04 | Estado: Activo*
