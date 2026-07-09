# Patrón: Consent Banner (Banner de Consentimiento de Cookies)
**Pilar: Frontend (UX / UI / Consentimiento)**

> **Privacy Compliance Skills** — Guía de diseño. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04

---

## Qué es y por qué es obligatorio

El consent banner es el elemento de UI que solicita al usuario su autorización para usar cookies no esenciales (analytics, marketing, seguimiento). Es obligatorio en sistemas con usuarios en la UE (GDPR ePrivacy Directive) y Brasil (LGPD), y es una buena práctica en toda LATAM.

**Requisito legal que cumple:**
- GDPR + ePrivacy: Art. 6.1.a (consentimiento) + Directiva 2002/58/CE (privacidad en comunicaciones)
- LGPD Brasil: Art. 7.I (consentimiento como base legal para tracking)
- LFPDPPP México: Art. 15-18 (aviso de privacidad debe mencionar cookies)

---

## Estructura mínima del banner

```
┌─────────────────────────────────────────────────────────────┐
│  Usamos cookies para mejorar tu experiencia.                │
│                                                             │
│  ● Necesarias (siempre activas)                            │
│  ○ Analytics — entender cómo usas el producto              │
│  ○ Marketing — personalizar anuncios                        │
│                                                             │
│  [Aceptar seleccionadas]  [Solo necesarias]  [Configurar] │
│                                                             │
│  [Ver política de cookies completa →]                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Reglas de diseño

### Visibilidad y posición
- Aparece en la **primera visita** antes de que el usuario pueda interactuar con el contenido
- Posición: footer fijo o modal centrado — no oculto en la esquina inferior derecha con letra pequeña
- Tiene suficiente **contraste** para ser legible (WCAG 2.1 AA mínimo)

### Opciones de acción
- El botón "Solo necesarias" o "Rechazar todo" es **igual de visible** que "Aceptar todo"
  - ✅ Mismo tamaño, mismo contraste, misma posición visual
  - ❌ "Aceptar" en verde brillante grande, "Rechazar" como texto gris sin estilo
- Existe una opción "Configurar" o "Ver opciones" para selección granular
- El usuario puede continuar usando el sitio con solo cookies necesarias activas

### Categorías de cookies
- **Necesarias**: sin consentimiento (sesión, seguridad, funcionalidad básica)
- **Funcionales**: memoria de preferencias (idioma, región) — requiere consentimiento
- **Analytics**: Mixpanel, GA, Amplitude — requiere consentimiento
- **Marketing/Publicidad**: Meta Pixel, Google Ads, etc. — requiere consentimiento

### Comportamiento post-selección
- Las cookies de analytics/marketing **no se cargan** hasta que el usuario acepte
  - Implementar: cargar el script de GA solo si `consent.analytics === true`
- El consentimiento se guarda en una **cookie first-party** o localStorage
- El banner no reaparece en visitas siguientes (a menos que el usuario limpie cookies)
- El usuario puede **cambiar sus preferencias** desde cualquier página posterior (link en el footer)

---

## Implementación de referencia (pseudocódigo)

```javascript
// consent-manager.js
const ConsentManager = {
  load() {
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) {
      this.showBanner();
      return;
    }
    this.applyConsent(JSON.parse(saved));
  },

  showBanner() {
    document.getElementById('cookie-banner').classList.remove('hidden');
  },

  save(choices) {
    // choices = { analytics: true/false, marketing: true/false }
    localStorage.setItem('cookie_consent', JSON.stringify({
      version: '1.0',  // versión de la política de cookies
      timestamp: new Date().toISOString(),
      choices
    }));
    this.applyConsent(choices);
    document.getElementById('cookie-banner').classList.add('hidden');
  },

  applyConsent(choices) {
    // Solo cargar scripts de terceros si el usuario consintió
    if (choices.analytics) this.loadAnalytics();
    if (choices.marketing) this.loadMarketing();
  },

  loadAnalytics() {
    // Cargar GA, Mixpanel, etc. aquí
    // NUNCA en el <head> sin verificar consentimiento antes
  }
};

// En el <head>: no cargar ningún script de terceros aquí
// En el body, al final: ConsentManager.load();
```

---

## Anti-patrones (evitar)

| Anti-patrón | Por qué es ilegal/problemático |
|---|---|
| Pre-marcar todas las categorías como activas | Viola GDPR Art. 7 — consentimiento no puede ser por default activo |
| Botón "Rechazar" mucho más pequeño que "Aceptar" | Manipulación del consentimiento — invalidado por reguladores (CNIL, APD) |
| Banner con solo opción "Aceptar todo" sin granularidad | Consentimiento no granular es inválido bajo GDPR |
| Cargar GA en el `<head>` y mostrar banner después | El tracking ya ocurrió antes del consentimiento |
| Banner que desaparece si el usuario scrollea | No es un consentimiento válido (acción implícita) |

---

## Coordinación con Backend

Cuando el usuario selecciona sus preferencias de cookies, el Backend debe:
1. Recibir la selección y guardarla en la tabla `user_consents` para usuarios autenticados
2. El servidor NO debe emitir cookies de analytics/tracking en las respuestas HTTP antes del consentimiento
3. Ver [checklist-seguridad-datos.md](../checklists/checklist-seguridad-datos.md) — Bloque 2

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
