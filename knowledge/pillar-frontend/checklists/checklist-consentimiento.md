# Checklist Frontend — Consentimiento y Documentos Legales
**Pilar: Frontend (UX / UI / Consentimiento)**

> **Privacy Compliance Skills** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: PM de Producto + UX Designer | Validación: Abogado de privacidad

Usa este checklist para verificar todo lo que el usuario **ve, toca o decide** en relación con sus datos personales: formularios, consentimiento, documentos legales y mecanismos de revocación.

Para la contraparte técnica de estos ítems, ver [checklist-seguridad-datos.md](../../pillar-backend/checklists/checklist-seguridad-datos.md).

---

## Bloque 1: Documentos Legales Visibles

- [ ] **Política de Privacidad** publicada y accesible desde la página principal (footer, onboarding, formulario de registro)
  - Debe incluir: qué datos se recopilan, para qué, con quién se comparten, cómo ejercer derechos, datos de contacto del responsable
  - Debe estar en el idioma del usuario objetivo
- [ ] **Aviso de Cookies** visible si el sistema usa cookies de analytics, marketing o seguimiento
  - Categorías de cookies identificadas (necesarias, funcionales, analytics, publicidad)
  - El usuario puede aceptar solo las necesarias y rechazar las demás
- [ ] **Términos y Condiciones** del servicio publicados
- [ ] **Descargo de responsabilidad** visible si el servicio da información sensible (salud, finanzas, legal)
- [ ] Los documentos legales tienen **fecha de última actualización** visible
- [ ] Hay un proceso notificado al usuario cuando los documentos legales cambian (email, notificación in-app)

---

## Bloque 2: Formulario de Consentimiento

- [ ] El formulario de registro **no tiene checkbox de política pre-marcado** (`checked=false` por default)
- [ ] El usuario debe hacer **clic activo** para aceptar la política de privacidad — no vale el silencio
- [ ] Si hay múltiples finalidades (analytics, marketing, terceros), hay **toggles separados** por finalidad con explicación clara de cada una
  - Ejemplo: `[  ] Acepto recibir emails de marketing` / `[  ] Acepto analítica de comportamiento`
- [ ] El lenguaje de los checkboxes es **claro y comprensible** — sin jerga legal
  - ✅ "Acepto que Acme use mis datos para enviarte ofertas personalizadas"
  - ❌ "Autorizo el tratamiento de datos con finalidades de marketing directo según el Art. 9"
- [ ] Se muestra un **enlace directo** a la política completa antes de que el usuario acepte
- [ ] Los botones "Aceptar todo" y "Rechazar" tienen el mismo tamaño y visibilidad — sin dark patterns
- [ ] Si hay re-consentimiento al actualizar la política, el formulario muestra **qué cambió específicamente**

---

## Bloque 3: Registro de Consentimiento (Requisito Backend Coordinado)

> ⚠️ Este bloque lo implementa Backend, pero PM/UX define qué se registra. Coordinar con [checklist-seguridad-datos.md](../../pillar-backend/checklists/checklist-seguridad-datos.md) sección "Registro de consentimiento".

- [ ] El sistema registra: **quién** consintió, **cuándo**, **qué versión** de política estaba vigente y **qué finalidades** autorizó
- [ ] El usuario puede consultar su historial de consentimiento desde su perfil
- [ ] El sistema puede exportar el historial de consentimiento si el usuario lo solicita

---

## Bloque 4: Revocación de Consentimiento

- [ ] Existe un mecanismo **visible y accesible** para revocar el consentimiento (perfil, configuración de privacidad, email a privacidad@empresa.com)
- [ ] Revocar es **tan fácil como aceptar** — mismo número de clics, sin fricciones artificiales
- [ ] Si el usuario revoca un propósito específico (ej: marketing), el sistema muestra claramente qué consecuencias tiene
  - Ejemplo: "Si desactivas analytics, no recibirás recomendaciones personalizadas"
- [ ] Tras la revocación, el usuario recibe confirmación visible (mensaje en pantalla o email)
- [ ] El flujo de revocación **no requiere contactar al soporte** — debe ser autónomo

---

## Bloque 5: Menores de Edad

*(Aplica si la plataforma puede tener usuarios menores de 18 años)*

- [ ] Existe un **mecanismo de verificación o declaración de edad** en el flujo de registro
- [ ] Si el usuario declara ser menor, el flujo requiere **autorización del tutor legal** antes de continuar
- [ ] La interfaz para menores **no contiene dark patterns** que los lleven a dar más datos de los necesarios
- [ ] Las opciones de privacidad para menores son **más restrictivas por defecto** (no se puede optar por menos privacidad sin confirmación del tutor)
- [ ] La política de privacidad tiene una sección específica y comprensible para padres/tutores
- [ ] El texto del formulario para menores usa **lenguaje apropiado para la edad**

---

## Autodiagnóstico

| Ítems sin marcar | Estado | Acción |
|---|---|---|
| 0–2 | ✅ Listo para lanzar | Validar con abogado antes del go-live |
| 3–5 | ⚠️ Trabajo pendiente | Completar antes de lanzar, especialmente bloques 2 y 4 |
| 6+ | 🔴 Riesgo alto | Pausar lanzamiento — consentimiento inválido es una infracción activa |

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*Ver contraparte backend: [checklist-seguridad-datos.md](../../pillar-backend/checklists/checklist-seguridad-datos.md)*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
