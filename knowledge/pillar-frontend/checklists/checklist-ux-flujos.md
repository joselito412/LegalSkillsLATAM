# Checklist Frontend — Flujos UX para Datos Sensibles
**Pilar: Frontend (UX / UI / Consentimiento)**

> **Privacy Compliance Skills** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: PM de Producto + UX Designer | Validación: Abogado de privacidad

Usa este checklist cuando tu sistema trata **datos sensibles** (salud, biometría, menores, religión, origen étnico, orientación sexual). Cubre solo los aspectos de interfaz y flujo de usuario — para la protección técnica de estos datos, ver [checklist-datos-sensibles.md](../../pillar-backend/checklists/checklist-datos-sensibles.md).

---

## Bloque 1: Aviso Previo al Tratamiento de Datos Sensibles

- [ ] Antes de capturar cualquier dato sensible, el usuario ve un **aviso explícito y destacado** — no dentro de los T&C generales
- [ ] El aviso explica en lenguaje claro:
  - Qué dato sensible se va a tratar (ej: "vamos a guardar tu historial de diagnósticos")
  - Para qué se usará ese dato específicamente (finalidad concreta, no genérica)
  - Con quién se compartirá
  - Cuánto tiempo se conservará
  - Cómo puede ejercer sus derechos (acceso, borrado)
- [ ] El usuario debe hacer una **acción activa explícita** para autorizar el tratamiento de datos sensibles — no un checkbox genérico
- [ ] El consentimiento para datos sensibles está **separado visualmente** del resto del formulario o flujo
- [ ] El aviso usa **lenguaje comprensible**, no solo artículos legales

---

## Bloque 2: Flujos Específicos por Tipo de Dato Sensible

### Datos de Salud

- [ ] El usuario entiende que está ingresando datos de salud antes de hacerlo (no descubre después)
- [ ] Existe una opción para ingresar datos mínimos y expandir después (no forzar a dar todo de una vez)
- [ ] Si hay integración con otro sistema de salud (lab, farmacia, wearable), el usuario autoriza explícitamente cada integración
- [ ] La UI no pre-llena diagnósticos ni condiciones — solo el usuario los ingresa

### Datos Biométricos

- [ ] Antes de capturar biometría (foto, huella, voz), hay un **aviso previo en pantalla completa o modal prominente**
- [ ] El aviso explica: qué biométrico se captura, para qué se usa (autenticación, identificación), si se procesa localmente o en servidor
- [ ] Existe una **alternativa no biométrica** para usuarios que no quieran usar datos biométricos
- [ ] El usuario puede solicitar la eliminación de su biométrico desde la UI (sin tener que contactar soporte)

### Datos de Menores

- [ ] Si la plataforma puede ser usada por menores, el flujo de registro tiene una **ruta diferenciada** para menores
- [ ] La ruta de menores requiere datos del tutor legal (nombre, email, relación) para enviar la solicitud de autorización
- [ ] La UI confirma al tutor qué datos del menor se van a tratar
- [ ] El menor NO puede autorizar su propio tratamiento de datos sensibles (la UI lo bloquea)
- [ ] El diseño no tiene **dark patterns orientados a menores**: sin recompensas por dar más datos, sin presión social, sin urgencia artificial
- [ ] Las configuraciones de privacidad para cuentas de menores son **las más restrictivas por defecto** y requieren acción activa del tutor para reducir privacidad

---

## Bloque 3: Aviso de Privacidad — Sección de Datos Sensibles

- [ ] La política de privacidad **identifica explícitamente** que se tratan datos sensibles
- [ ] Para cada categoría de dato sensible, la política explica:
  - La categoría específica (ej: "datos de salud")
  - La finalidad específica del tratamiento
  - La base legal (consentimiento explícito, obligación legal, etc.)
  - Los destinatarios (si se comparten)
  - El período de retención
- [ ] La política está disponible en el **idioma principal** de los usuarios objetivo
- [ ] La política tiene un **índice navegable** — no solo un bloque de texto de 5,000 palabras
- [ ] Existe un proceso visible para que el usuario sea **notificado cuando la política cambia** en la sección de datos sensibles
- [ ] Los cambios que amplíen el tratamiento de datos sensibles requieren nuevo consentimiento visible al usuario

---

## Bloque 4: Portal de Derechos del Usuario (ARCO)

- [ ] El usuario puede encontrar fácilmente **desde la UI** cómo ejercer sus derechos sobre datos sensibles
  - Desde el perfil, la configuración de privacidad o el pie de página
- [ ] El portal muestra claramente los plazos de respuesta por tipo de solicitud y jurisdicción
- [ ] El usuario puede hacer seguimiento del estado de su solicitud desde la UI
- [ ] El portal explica qué datos sensibles tiene el sistema del usuario (o da un enlace para solicitarlos)

---

## Autodiagnóstico

| Ítems sin marcar | Estado | Acción |
|---|---|---|
| 0–3 | ✅ Buena base | Validar con abogado antes de tratar datos sensibles en producción |
| 4–7 | ⚠️ Trabajo pendiente | Completar bloques 1 y 2 antes de lanzar |
| 8+ | 🔴 Riesgo crítico | No lanzar con datos sensibles — riesgo de multas y sanciones activas |

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*Ver contraparte backend: [checklist-datos-sensibles.md](../../pillar-backend/checklists/checklist-datos-sensibles.md)*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
