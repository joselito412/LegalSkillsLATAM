# Matriz: Cookies y Avisos por Jurisdicción
**Pilar: Frontend (UX / UI / Consentimiento)**

> **LegalSkillsLATAM** — Guía de referencia. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04

---

## Tipos de cookies y base legal

| Tipo | Ejemplos | Base legal | Consentimiento previo |
|---|---|---|---|
| **Estrictamente necesarias** | Session cookie, CSRF token, cookie de autenticación | Interés legítimo / necesidad técnica | ❌ No requerido |
| **Funcionales** | Idioma preferido, región, modo oscuro | Interés legítimo / consentimiento | ⚠️ Recomendado |
| **Analytics (no perfilado)** | Google Analytics (con IP anónima), Plausible | Consentimiento | ✅ Obligatorio (UE y Brasil) |
| **Analytics (perfilado)** | Hotjar con grabación, Mixpanel con user ID | Consentimiento | ✅ Obligatorio |
| **Marketing / Publicidad** | Meta Pixel, Google Ads, TikTok Pixel | Consentimiento | ✅ Obligatorio |
| **Redes sociales / terceros** | Botones "Compartir", widgets de YouTube | Consentimiento | ✅ Obligatorio |

---

## Requisitos por jurisdicción

| Requisito | 🇪🇺 GDPR (UE) | 🇧🇷 LGPD (Brasil) | 🇨🇴 Colombia | 🇲🇽 México | 🇨🇱 Chile |
|---|---|---|---|---|---|
| **Banner de cookies** | ✅ Obligatorio para cookies no necesarias | ✅ Recomendado (consentimiento como base legal) | ⚠️ Buena práctica (principio de transparencia) | ⚠️ El aviso de privacidad debe mencionar cookies | ⚠️ Buena práctica |
| **Granularidad por categoría** | ✅ Obligatorio | ✅ Para consentimiento granular | ⚠️ Recomendado | ⚠️ Recomendado | ⚠️ Recomendado |
| **Bloquear antes del consentimiento** | ✅ Obligatorio (no cargar GA antes de aceptar) | ✅ Si el consentimiento es la base legal | ⚠️ Sin regulación explícita | ⚠️ Sin regulación explícita | ⚠️ Sin regulación explícita |
| **"Rechazar" igual de fácil que "Aceptar"** | ✅ Principio de libertad del consentimiento | ✅ Mismo principio | ⚠️ Buena práctica | ⚠️ Buena práctica | ⚠️ Buena práctica |
| **Retiro del consentimiento** | ✅ Facilitar siempre | ✅ Facilitar siempre | ✅ Facilitar siempre | ✅ Facilitar siempre | ✅ Facilitar siempre |
| **Período de validez del consentimiento** | 12-24 meses (buena práctica) | Sin plazo explícito | Sin plazo explícito | Sin plazo explícito | Sin plazo explícito |

---

## Cookies de analytics más comunes — configuración recomendada

### Google Analytics 4 (GA4)

| Configuración | Sin usuarios UE/Brasil | Con usuarios UE o Brasil |
|---|---|---|
| Carga del script | Al cargar la página | Solo si el usuario aceptó analytics |
| Anonimización de IP | Recomendado | ✅ Obligatorio |
| User ID | Opcional | Solo con consentimiento explícito |
| Retención de datos | 14 meses (default) | 14 meses (revisar) |
| DPA con Google | Recomendado | ✅ Obligatorio |

```javascript
// Carga condicional de GA4 — solo si hay consentimiento
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// En lugar de cargar GA en el <head>, esperar el consentimiento:
ConsentManager.onConsent((consent) => {
  if (consent.analytics) {
    // Cargar el script de GA dinamicamente
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX';
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXX', { anonymize_ip: true });
  }
});
```

### Meta Pixel / Facebook Pixel

- Cargar solo si el usuario aceptó cookies de marketing
- La transferencia a Meta (EEUU) requiere base legal para Brasil y UE
- Para UE: DPA con Meta + verificar que Meta cumple EU-US Data Privacy Framework
- Para Brasil: DPA con Meta + cláusulas contractuales

### Hotjar (Session Recording)

- Hotjar graba pantallas e interacciones — es especialmente invasivo
- Cargar solo si el usuario aceptó analytics/funcional
- Implementar: excluir páginas con datos sensibles de la grabación
- Implementar: "suprimir" campos sensibles en la configuración de Hotjar (no grabar el contenido de ciertos campos)

---

## Contenido del aviso de cookies

El aviso de cookies debe explicar:

```markdown
## Política de Cookies — [Nombre de la empresa]

### ¿Qué son las cookies?
Pequeños archivos que se guardan en tu dispositivo cuando visitas nuestro sitio...

### Cookies que usamos

| Cookie | Proveedor | Propósito | Duración |
|---|---|---|---|
| `_session` | Propio | Mantener tu sesión activa | Sesión |
| `csrf_token` | Propio | Seguridad del formulario | Sesión |
| `_ga` | Google Analytics | Analizar cómo usas el sitio | 2 años |
| `_fbp` | Meta | Medir eficacia de anuncios | 3 meses |

### Gestionar tus preferencias
Puedes cambiar tus preferencias de cookies en cualquier momento desde 
[Configuración de Cookies →].

### Más información
Para más detalles, ver nuestra [Política de Privacidad →].
```

---

## Lista de verificación del aviso de cookies

- [ ] El banner de cookies aparece en la primera visita antes de cargar cookies no necesarias
- [ ] El banner ofrece granularidad (al menos: necesarias / analytics / marketing)
- [ ] "Rechazar" es igual de visible y accesible que "Aceptar"
- [ ] El usuario puede cambiar preferencias después de la primera visita (link en footer)
- [ ] La política de cookies lista todas las cookies usadas con propósito y duración
- [ ] Los scripts de terceros (GA, Meta, Hotjar) solo se cargan después del consentimiento
- [ ] El consentimiento de cookies se registra con timestamp y versión

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*Ver patrón: [consent-banner.md](../patterns/consent-banner.md)*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
