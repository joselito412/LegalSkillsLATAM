# Patrón: Privacy Policy Widget (Política de Privacidad en UI)
**Pilar: Frontend (UX / UI / Consentimiento)**

> **LegalSkillsLATAM** — Guía de diseño. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04

---

## Qué es y por qué es obligatorio

El privacy policy widget no es un componente único, sino un conjunto de **puntos de acceso** y **elementos de presentación** que hacen la política de privacidad accesible en toda la interfaz. La ley no exige un formato específico, pero sí que la política sea **clara, accesible y en lenguaje comprensible**.

**Requisito legal que cumple:**
- LGPD Brasil: Art. 9 — información de forma "clara, adequada e ostensiva"
- GDPR: Arts. 12-14 — información "concisa, transparente, inteligible y de fácil acceso"
- LFPDPPP México: Arts. 15-18 — aviso de privacidad con formato adecuado según contexto
- Ley 1581 Colombia: Art. 15 — aviso de privacidad con información mínima

---

## Puntos de acceso obligatorios en la UI

```
Página principal (footer)
├── Política de Privacidad
├── Términos de Uso
├── Aviso de Cookies [Configurar →]
└── Contacto: privacidad@empresa.com

Formulario de registro
├── Enlace directo a Política antes del checkbox
└── "He leído y acepto la Política de Privacidad [leer →]"

Menú de cuenta del usuario
└── Privacidad y datos [→]

Formulario de datos sensibles
└── Aviso específico ANTES de ingresar el dato: "¿Por qué pedimos esto? [ver →]"

Email de bienvenida
└── "Mira nuestra política de privacidad: [enlace]"
```

---

## Estructura recomendada de la política de privacidad

Una política legible tiene índice navegable, no es un bloque de texto:

```
Política de Privacidad de [Empresa]
Última actualización: YYYY-MM-DD | Versión: X.X

RESUMEN RÁPIDO (plain language, 200 palabras)
→ Qué datos recopilamos
→ Para qué los usamos
→ Con quién los compartimos
→ Cómo protegemos tus datos
→ Tus derechos

TABLA DE CONTENIDO
1. Responsable del tratamiento
2. Datos que recopilamos y base legal
3. Finalidades del tratamiento
4. Destinatarios y transferencias internacionales
5. Período de conservación
6. Tus derechos y cómo ejercerlos
7. Cookies y tecnologías de seguimiento
8. Menores de edad
9. Modificaciones a esta política
10. Contacto
```

---

## Aviso inline en formularios (micro-copy)

Para campos que recopilan datos específicos, agregar micro-copy junto al campo:

```html
<!-- Campo email -->
<label>Email *</label>
<input type="email" name="email" />
<small>Tu email se usa para enviarte notificaciones del servicio.
       No lo compartimos con terceros para marketing.
       <a href="/privacidad#email">¿Por qué lo pedimos?</a>
</small>

<!-- Campo de ubicación -->
<label>Ciudad</label>
<input type="text" name="city" />
<small>Opcional. Si lo proporcionas, personalizamos tu experiencia.
       <a href="/privacidad#ubicacion">Ver cómo usamos tu ubicación</a>
</small>

<!-- Campo de datos de salud -->
<label>Diagnóstico principal</label>
<input type="text" name="diagnosis" />
<small>⚠️ Dato de salud — tratado con protección especial.
       <a href="/privacidad#salud">Ver aviso completo de datos de salud</a>
</small>
```

---

## Notificación de cambios en la política

Cuando se actualiza la política, el sistema debe notificar proactivamente:

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Actualizamos nuestra política de privacidad             │
│  Vigente a partir del: 2026-07-01                           │
│                                                             │
│  Cambios principales:                                       │
│  • Nuevo proveedor de analytics: Amplitude (antes Mixpanel) │
│  • Período de retención de logs: 12 meses (antes: indefinido)│
│  • DPO designado: privacidad@empresa.com                    │
│                                                             │
│  [Ver política completa →]   [Qué cambió específicamente →] │
│                                                             │
│  Si no realizas ninguna acción antes del 2026-07-01,        │
│  entendemos que aceptas los cambios que NO amplían el       │
│  tratamiento de tus datos.                                  │
│                                                             │
│  Los cambios que SÍ amplían el tratamiento requieren        │
│  tu aceptación activa:                                      │
│  [ ] Acepto que Amplitude analice mi comportamiento          │
│                                                             │
│  [Aceptar cambios marcados]           [Rechazar y ver opciones]│
└─────────────────────────────────────────────────────────────┘
```

---

## Historial de versiones de la política

Accesible desde el footer o desde el portal de datos del usuario:

```
Historial de versiones:
v3.0 — 2026-07-01 [actual] — Agregado Amplitude, DPO designado
v2.1 — 2026-03-15 — Actualizado período de retención de logs
v2.0 — 2025-11-01 — Adaptación a LGPD Brasil y expansión a Colombia
v1.0 — 2025-06-01 — Política inicial
```

---

## Validación del widget

Antes de lanzar o de hacer cambios a la política, verificar:

- [ ] La política es accesible desde el footer de todas las páginas
- [ ] La política tiene fecha de última actualización visible
- [ ] Existe un resumen en lenguaje simple (no solo el texto legal completo)
- [ ] Los formularios con datos personales tienen micro-copy o enlace a la sección relevante
- [ ] El proceso de notificación de cambios está probado (envío de email + notificación in-app)
- [ ] El historial de versiones está disponible
- [ ] La política está en el idioma del usuario objetivo

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
