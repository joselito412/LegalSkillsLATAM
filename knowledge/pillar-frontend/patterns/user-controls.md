# Patrón: User Controls (Portal de Datos del Usuario)
**Pilar: Frontend (UX / UI / Consentimiento)**

> **LegalSkillsLATAM** — Guía de diseño. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04

---

## Qué es y por qué es obligatorio

El portal de datos del usuario es la sección de la app donde el titular puede **ejercer sus derechos sobre sus datos personales**: ver qué datos tiene el sistema, corregirlos, descargarlos, pedir que se borren o revocar su consentimiento.

**Requisito legal que cumple:**
- LGPD Brasil: Arts. 18-20 (derechos del titular: acceso, corrección, eliminación, portabilidad, revocación)
- GDPR: Arts. 15-22 (acceso, rectificación, supresión, portabilidad, oposición, no automatización)
- Ley 1581 Colombia: Arts. 14-16 (derechos ARCO: Acceso, Rectificación, Cancelación, Oposición)
- LFPDPPP México: Arts. 22-36 (derechos ARCO + limitación de uso)

---

## Estructura del portal de datos

```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ Mi cuenta > Privacidad y datos                          │
│                                                             │
│  📋 MIS DATOS                                              │
│  ├── Ver qué información tenemos sobre ti [→]              │
│  └── Descargar todos tus datos (JSON/CSV) [→]              │
│                                                             │
│  ✏️ MODIFICAR MIS DATOS                                     │
│  └── Solicitar corrección de datos incorrectos [→]         │
│                                                             │
│  🗑️ ELIMINAR MIS DATOS                                      │
│  ├── Eliminar mi cuenta y todos mis datos [→]              │
│  └── Eliminar solo datos específicos [→]                   │
│                                                             │
│  🔔 MIS PREFERENCIAS DE COMUNICACIÓN                        │
│  ├── Marketing: [ACTIVADO ●] [Desactivar]                  │
│  ├── Analytics: [DESACTIVADO ○] [Activar]                  │
│  └── Notificaciones: [ACTIVADO ●] [Configurar]             │
│                                                             │
│  🍪 GESTIÓN DE COOKIES                                      │
│  └── Configurar mis preferencias de cookies [→]            │
│                                                             │
│  📬 CONTACTAR AL EQUIPO DE PRIVACIDAD                      │
│  └── privacidad@empresa.com | SLA: respuesta en X días    │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujos específicos

### Flujo: Ver mis datos

1. Usuario hace clic en "Ver qué información tenemos sobre ti"
2. El sistema muestra una lista de las categorías de datos almacenadas (no todos los valores crudos en este momento — puede requerir verificación de identidad)
3. El usuario puede solicitar el detalle completo
4. El sistema confirma la solicitud y da un plazo de respuesta
5. El usuario recibe email con sus datos en un formato legible (JSON, PDF o CSV)

**Plazo de respuesta por jurisdicción:**
| País | Plazo | Tipo |
|---|---|---|
| Brasil (LGPD) | 15 días hábiles | Solicitud simple |
| Colombia (Ley 1581) | 10 días hábiles | Consulta |
| México (LFPDPPP) | 20 días hábiles | Respuesta + 15 días cumplimiento |
| GDPR (UE) | 30 días calendario | Prorrogable 60 días más |

### Flujo: Descargar mis datos (portabilidad)

1. Usuario solicita descarga
2. El sistema genera un archivo (JSON o CSV) con todos los datos del usuario en formato legible por máquina
3. El usuario recibe un link seguro para descargar (expira en 24-48 horas)
4. El link requiere re-autenticación antes de la descarga

### Flujo: Eliminar mi cuenta y datos

1. Usuario hace clic en "Eliminar mi cuenta"
2. La UI muestra claramente qué pasará: "Se eliminarán X datos. Se conservarán Y datos por obligación legal durante Z años"
3. Se requiere confirmación explícita (escribir el email o un texto de confirmación)
4. Se requiere verificación de identidad (contraseña o código por email)
5. El sistema procesa la eliminación y envía confirmación
6. El usuario queda con acceso bloqueado inmediatamente

```
┌───────────────────────────────────────────────────────┐
│  ⚠️ Confirmar eliminación de cuenta                   │
│                                                       │
│  Lo que se eliminará:                                 │
│  ✓ Tu perfil y datos personales                      │
│  ✓ Historial de actividad                            │
│  ✓ Preferencias y configuraciones                    │
│                                                       │
│  Lo que se conservará (obligación legal):            │
│  → Registros de transacciones: 5 años (Ley fiscal)   │
│  → Registro de consentimiento: 3 años (referencia)   │
│                                                       │
│  Para confirmar, escribe tu email:                    │
│  [_________________________]                          │
│                                                       │
│  [Cancelar]           [Eliminar mi cuenta →]         │
└───────────────────────────────────────────────────────┘
```

### Flujo: Revocar consentimiento de marketing/analytics

1. El usuario desactiva un toggle en "Mis preferencias"
2. La UI muestra consecuencias: "Desactivar analytics: ya no recibirás recomendaciones personalizadas"
3. El usuario confirma
4. El cambio es **inmediato** — no hay período de gracia
5. El sistema registra la revocación con timestamp y la comunica al Backend en tiempo real

---

## Diseño del portal de derechos

- Accesible desde el **menú de cuenta** con máximo 2 clics
- Ícono reconocible (candado, escudo, o similar) en la navegación principal
- El portal es **auto-servicio** para las acciones más comunes: descargar datos, revocar consentimiento, cambiar preferencias
- Para acciones irreversibles (borrar cuenta): requiere confirmación extra y verificación de identidad
- El portal muestra el **estado de solicitudes anteriores** (pendientes, completadas)

---

## Coordinación con Backend

Las acciones del portal de datos requieren implementación técnica específica:

| Acción en UI | Requisito Backend |
|---|---|
| Ver mis datos | Endpoint que agrega todos los datos del usuario por ID |
| Descargar datos | Job que genera export completo + link seguro temporal |
| Eliminar cuenta | Función de borrado real (no solo `is_active = false`) |
| Revocar consentimiento | Actualizar `user_consents.revoked_at` en tiempo real y bloquear el tratamiento |
| Corregir datos | Endpoint de actualización con log de auditoría |

Ver [checklist-acceso.md](../../pillar-backend/checklists/checklist-acceso.md) — Bloque 6 (logging de solicitudes ARCO).

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
