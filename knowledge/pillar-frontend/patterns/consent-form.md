# Patrón: Consent Form (Formulario de Consentimiento Granular)
**Pilar: Frontend (UX / UI / Consentimiento)**

> **Privacy Compliance Skills** — Guía de diseño. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04

---

## Qué es y por qué es obligatorio

El consent form es el formulario donde el usuario **otorga autorización** para el tratamiento de sus datos personales. Es el punto más crítico del flujo de registro: un mal diseño aquí puede invalidar todo el consentimiento y hacer que la base legal del tratamiento sea inexistente.

**Requisito legal que cumple:**
- LGPD Brasil: Art. 8 — consentimiento debe ser inequívoco, granular por finalidad
- GDPR: Arts. 7 y 4(11) — consentimiento libre, específico, informado e inequívoco
- Ley 1581 Colombia: Art. 9 — autorización previa, expresa e informada
- LFPDPPP México: Arts. 8-9 — expreso para datos sensibles, no pre-marcado

---

## Estructura del formulario de registro

```
┌─────────────────────────────────────────────────────────────┐
│  Crea tu cuenta                                             │
│                                                             │
│  Nombre: [_________________________]                        │
│  Email:  [_________________________]                        │
│  Contraseña: [____________________]                        │
│                                                             │
│  ─────────────────────────────────────────────────────     │
│  Términos de uso y privacidad                               │
│                                                             │
│  [ ] He leído y acepto los Términos de Uso                  │
│      [Ver Términos de Uso →]                               │
│                                                             │
│  [ ] He leído y acepto la Política de Privacidad           │
│      [Ver Política de Privacidad →]                        │
│                                                             │
│  ─────────────────────────────────────────────────────     │
│  Preferencias de comunicación (opcionales)                  │
│                                                             │
│  [ ] Quiero recibir emails con novedades del producto       │
│  [ ] Quiero recibir ofertas y promociones de socios        │
│  [ ] Acepto que se analice mi comportamiento para           │
│      personalizar mi experiencia [¿Qué significa esto? →]  │
│                                                             │
│  ─────────────────────────────────────────────────────     │
│                    [Crear cuenta →]                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Reglas de diseño

### Checkboxes y estado inicial

- Todos los checkboxes comienzan en estado **no marcado** (`checked=false` en el HTML)
- Los checkboxes obligatorios (Términos + Política) se marcan activamente — no existe "aceptación implícita"
- Los checkboxes opcionales (marketing, analytics) son completamente voluntarios: aceptar o no no afecta la posibilidad de crear la cuenta

### Separación de consentimientos

- **Obligatorio** (para poder usar el servicio):
  - Política de privacidad ✓
  - Términos de uso ✓
- **Opcional** (el usuario puede rechazar sin perder el servicio):
  - Marketing / comunicaciones comerciales
  - Analytics de comportamiento
  - Compartir datos con socios o terceros

- Nunca combinar consentimiento obligatorio y opcional en un solo checkbox:
  - ❌ "Acepto la política de privacidad y recibir emails de marketing" (un solo checkbox)
  - ✅ Dos checkboxes separados

### Lenguaje claro

Cada opción debe tener una descripción en lenguaje simple:

| ❌ Mal | ✅ Bien |
|---|---|
| "Acepto el tratamiento de datos con fines de marketing directo" | "Quiero recibir emails con ofertas y novedades del producto" |
| "Autorizo la elaboración de perfiles con base en criterios de comportamiento" | "Acepto que se analice mi uso del producto para mostrarme contenido personalizado" |
| "Consentimiento para transferencias internacionales Art. 33 LGPD" | "Mis datos pueden ser procesados por nuestros proveedores en otros países (ver política)" |

### Enlace accesible a los documentos

- Cada checkbox tiene un enlace directo al documento correspondiente
- El enlace abre en una **nueva pestaña** — el usuario no pierde el formulario parcialmente completado
- Los documentos son **navegables** — no un PDF sin índice

---

## Flujo de re-consentimiento

Cuando la política de privacidad cambia y afecta finalidades ya autorizadas:

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Actualizamos nuestra política de privacidad             │
│                                                             │
│  Lo que cambió:                                             │
│  • Antes: solo usábamos Mixpanel para analytics             │
│  • Ahora: también usamos Amplitude para análisis de retención│
│                                                             │
│  Amplitude recibirá: comportamiento de navegación, eventos │
│  País del proveedor: EEUU (con DPA y SCCs firmadas)        │
│                                                             │
│  [ ] Acepto la nueva política de privacidad actualizada     │
│      [Ver los cambios completos →]                         │
│                                                             │
│  [Continuar con la nueva política] [Solo necesarias] [Más info]│
└─────────────────────────────────────────────────────────────┘
```

- El re-consentimiento es **obligatorio** antes de continuar si el cambio expande el tratamiento
- El usuario puede rechazar el cambio y usar el servicio con las condiciones anteriores (si es posible) o darse de baja

---

## Datos sensibles — Requisitos adicionales

Para tratar datos de salud, biométricos, menores, origen étnico, religión, orientación sexual:

- El consentimiento se solicita en un **paso separado y posterior** al registro general — no dentro del formulario genérico
- El aviso previo al consentimiento sensible explica:
  - Qué dato específico se va a tratar
  - Por qué es necesario
  - Por cuánto tiempo
  - Si se comparte con terceros
- La UI hace visualmente claro que este consentimiento es **diferente y más importante** (modal, color destacado, explicación expandida)

---

## Anti-patrones

| Anti-patrón | Por qué es ilegal |
|---|---|
| Pre-marcar el checkbox de marketing | No es consentimiento libre — lo exigen GDPR, LGPD y LFPDPPP |
| Requerir aceptar marketing para acceder al servicio | Consentimiento no puede ser condición de acceso cuando no es necesario para el servicio |
| Texto del checkbox con enlace que no va al documento completo | El consentimiento no es informado si no se puede leer la política |
| Un solo checkbox para política + marketing + analytics | No es granular — inválido bajo GDPR y LGPD |

---

## Coordinación con Backend

Cuando el usuario envía el formulario, el Backend debe guardar:
```json
{
  "user_id": "uuid",
  "consents": [
    { "purpose": "terms_of_use",      "granted": true,  "version": "v2.1" },
    { "purpose": "privacy_policy",    "granted": true,  "version": "v3.0" },
    { "purpose": "marketing_email",   "granted": false, "version": "v3.0" },
    { "purpose": "analytics_behavior","granted": true,  "version": "v3.0" }
  ],
  "timestamp": "2026-06-04T10:00:00Z",
  "ip_address": "192.168.1.1",
  "country": "BR"
}
```

Ver [checklist-seguridad-datos.md](../checklists/checklist-seguridad-datos.md) — Bloque 2.

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
