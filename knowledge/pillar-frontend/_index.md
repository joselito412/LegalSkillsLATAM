# Pilar Frontend — Índice de Navegación
**UX / UI / Consentimiento / Transparencia**

> **Privacy Compliance Skills** | Versión: 1.0.0 | Elaborado: 2026-06-04  
> Owner: PM de Producto + UX Designer | Validación: Abogado de privacidad

---

## ¿Qué es el Pilar Frontend?

Todo lo que el usuario **ve, lee, toca o decide** en relación con sus datos personales.

→ Ver definición completa: [PILLAR-SEPARATION.md](../../architecture/PILLAR-SEPARATION.md)

---

## Contenido de este pilar

### Checklists

| Archivo | Cuándo usarlo |
|---|---|
| [checklist-consentimiento.md](checklists/checklist-consentimiento.md) | Antes de lanzar: verificar formularios de registro, checkboxes, revocación, menores |
| [checklist-ux-flujos.md](checklists/checklist-ux-flujos.md) | Cuando el sistema trata datos sensibles: flujos UX de aviso, biometría, menores |
| [checklist-transparencia-ui.md](checklists/checklist-transparencia-ui.md) | Verificar política de privacidad, cookies, aviso, datos de contacto del responsable |

### Patrones reutilizables

| Archivo | Qué implementa |
|---|---|
| [consent-banner.md](patterns/consent-banner.md) | Banner de consentimiento de cookies — estructura, reglas, anti-patrones |
| [consent-form.md](patterns/consent-form.md) | Formulario de consentimiento granular en el registro |
| [user-controls.md](patterns/user-controls.md) | Portal de datos del usuario: ver, descargar, eliminar, revocar |
| [privacy-policy-widget.md](patterns/privacy-policy-widget.md) | Puntos de acceso a la política, micro-copy, notificación de cambios |

### Matrices de referencia

| Archivo | Qué contiene |
|---|---|
| [consentimiento-por-jurisdiccion.md](matrices/consentimiento-por-jurisdiccion.md) | Tabla comparativa de requisitos de consentimiento en Brasil, Colombia, México, GDPR, Chile |
| [cookies-avisos.md](matrices/cookies-avisos.md) | Tipos de cookies, base legal por jurisdicción, configuración de GA / Meta / Hotjar |

---

## Árbol de decisión rápida

```
¿Qué necesitas implementar?
│
├── Consentimiento en el registro
│   └── checklist-consentimiento.md + consent-form.md
│
├── Banner de cookies
│   └── consent-banner.md + cookies-avisos.md
│
├── Política de privacidad accesible
│   └── privacy-policy-widget.md + checklist-transparencia-ui.md
│
├── Portal de derechos del usuario (ARCO)
│   └── user-controls.md
│
├── Flujos para datos sensibles (salud, biometría)
│   └── checklist-ux-flujos.md
│
└── Comparar requisitos entre países
    └── consentimiento-por-jurisdiccion.md
```

---

## Propietarios y validación

| Rol | Responsabilidad |
|---|---|
| **PM de Producto** | Owner — define qué se implementa y cuándo |
| **UX Designer** | Diseña los flujos, verifica que sean comprensibles |
| **Abogado de privacidad** | Valida que el diseño cumple requisitos legales |
| **Security Lead** | Reviewer — revisa implicaciones de acceso a datos |

**Cadencia de revisión:** Ad-hoc con cambios de producto + mínimo anual con abogado

---

## Integración con Pilar Backend

Cambios en este pilar que requieren coordinación con [Pilar Backend](../pillar-backend/_index.md):

- Cambio en consentimiento → actualizar lógica de tratamiento en Backend
- Nuevo tercero → actualizar política + Backend firma DPA
- Cambio en menores → Backend actualiza validación técnica de edad

Ver [INTEGRATION-POINTS.md](../../architecture/INTEGRATION-POINTS.md) para todos los puntos de sincronización.

---

*Privacy Compliance Skills — [DISCLAIMER.md](../../DISCLAIMER.md)*
