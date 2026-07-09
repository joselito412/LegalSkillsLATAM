# Checklist Frontend — Transparencia: Política, Cookies y Avisos
**Pilar: Frontend (UX / UI / Consentimiento)**

> **Privacy Compliance Skills** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: PM de Producto + UX Designer | Validación: Abogado de privacidad

Transparencia es el derecho del usuario a entender **qué pasa con sus datos**. Este checklist cubre todos los elementos de UI que materializan ese derecho.

---

## Bloque 1: Política de Privacidad

### Contenido mínimo

- [ ] La política incluye: identidad del responsable, finalidades del tratamiento, base legal, destinatarios, plazos de retención, derechos del usuario, contacto del DPO/responsable
- [ ] Para operaciones en Brasil (LGPD): incluir información del Encarregado (DPO) y referencias a los artículos de la LGPD
- [ ] Para operaciones con usuarios de la UE (GDPR): incluir base legal de cada finalidad, DPO si aplica, transferencias internacionales y mecanismos usados
- [ ] Para Colombia (Ley 1581): incluir datos de registro ante la SIC y canal ARCO designado
- [ ] Para México (LFPDPPP): incluir aviso integral o simplificado con referencia a aviso completo, mecanismos de ejercicio de derechos ARCO

### Formato y accesibilidad

- [ ] La política es **accesible con máximo 2 clics** desde cualquier página de la app (footer, menú de cuenta, formularios de registro)
- [ ] La política tiene un **índice navegable** con secciones claramente identificadas
- [ ] El lenguaje es **claro y comprensible** — verificar con alguien sin formación legal
- [ ] La política muestra la **fecha de última actualización** visible en la parte superior
- [ ] Existe una versión **resumida** o "plain language" para usuarios que no quieran leer el texto completo

### Gestión de cambios

- [ ] Cuando la política cambia, los usuarios son **notificados proactivamente** (email, notificación in-app)
- [ ] La notificación explica **qué cambió específicamente** — no solo "actualizamos nuestra política"
- [ ] Si los cambios amplían el tratamiento de datos, se pide **re-consentimiento activo** — no se asume por silencio
- [ ] Existe un **historial de versiones** accesible (al menos las últimas 2 versiones)

---

## Bloque 2: Aviso de Cookies

- [ ] Si el sistema usa cookies de analytics, marketing o tracking, hay un **banner de cookies** visible en la primera visita
- [ ] El banner identifica las **categorías de cookies**: necesarias, funcionales, analytics, publicidad
- [ ] El usuario puede **aceptar individualmente** cada categoría sin verse obligado a aceptar todo
- [ ] El botón de "Rechazar" es **igual de visible** que el de "Aceptar" — sin oscurecer el rechazo
- [ ] Las cookies estrictamente necesarias (sesión, seguridad) no necesitan consentimiento pero deben estar informadas
- [ ] Existe un enlace en el banner a la **política de cookies completa**
- [ ] El usuario puede **cambiar sus preferencias de cookies** desde cualquier página después de la primera visita (ícono en el footer, "Configurar cookies")

### Requisitos adicionales por jurisdicción

| Jurisdicción | Requisito de cookies |
|---|---|
| 🇪🇺 GDPR (UE) | Consentimiento previo obligatorio para cookies no necesarias. No vale el consentimiento implícito. |
| 🇧🇷 LGPD (Brasil) | Cookies de tracking requieren base legal; consentimiento es la más común para analytics/marketing |
| 🇨🇴 Ley 1581 (Colombia) | No regula cookies específicamente, pero aplica el principio de transparencia de la ley |
| 🇲🇽 LFPDPPP (México) | El aviso de privacidad debe mencionar el uso de cookies y la finalidad |

---

## Bloque 3: Datos de Contacto y Responsable del Tratamiento

- [ ] El **nombre y datos de contacto del responsable del tratamiento** están en la política de privacidad y accesibles desde la UI
  - Mínimo: nombre de la empresa, dirección (o país), email de privacidad
- [ ] Si hay un **DPO/Encarregado designado**: sus datos de contacto son públicos (en la política, en el footer, o en sección de privacidad)
- [ ] El email para solicitudes de privacidad (ej: `privacidad@empresa.com`) existe y **alguien lo atiende activamente**
- [ ] Los plazos de respuesta a solicitudes de usuarios están **documentados visiblemente** (en el portal de derechos o en la política)

---

## Bloque 4: Transferencias Internacionales (Requisito de Transparencia)

> ⚠️ La base legal de transferencias internacionales es responsabilidad de Backend. Este bloque cubre solo la comunicación al usuario.

- [ ] La política de privacidad **menciona explícitamente** cuando datos se transfieren a terceros países
- [ ] Para cada transferencia internacional mencionada en la política, se indica: el país receptor, la empresa receptora (o categoría) y el mecanismo legal usado (adecuación, SCCs, consentimiento)
- [ ] Si la transferencia es a EEUU desde la UE o Brasil: el mecanismo específico está identificado (ej: "Standard Contractual Clauses aprobadas por la Comisión Europea")
- [ ] Si se agregan nuevos terceros internacionales, la política se **actualiza antes** de enviar datos

---

## Bloque 5: Comunicación Post-Incidente (si aplica)

> Para el manejo técnico de incidentes, ver [checklist-ciclo-vida.md](../../pillar-backend/checklists/checklist-ciclo-vida.md) sección de respuesta a incidentes.

- [ ] Existe una **plantilla de comunicación al usuario** preparada para el caso de una brecha de datos
  - Incluye: qué datos se vieron afectados, qué puede hacer el usuario, qué hizo la empresa
- [ ] La plantilla no genera pánico innecesario pero es **honesta y específica**
- [ ] Hay un proceso definido para decidir **a qué usuarios notificar** (los afectados, no todos)
- [ ] El canal de comunicación (email, in-app) está preparado para envíos masivos de emergencia

---

## Autodiagnóstico

| Ítems sin marcar | Estado | Acción |
|---|---|---|
| 0–2 | ✅ Transparente | Revisar anualmente con abogado |
| 3–6 | ⚠️ Trabajo pendiente | Completar política y aviso de cookies — son incumplimientos activos |
| 7+ | 🔴 Riesgo alto | Publicar política de privacidad es obligatorio por ley en todos los países de LATAM y UE |

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*Ver contraparte backend: [checklist-transferencias.md](../../pillar-backend/checklists/checklist-transferencias.md)*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
