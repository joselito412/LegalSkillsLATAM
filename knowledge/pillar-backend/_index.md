# Pilar Backend — Índice de Navegación
**Seguridad Técnica / Arquitectura de Datos**

> **Privacy Compliance Skills** | Versión: 1.0.0 | Elaborado: 2026-06-04  
> Owner: CTO + Security Lead | Validación: Abogado de data governance

---

## ¿Qué es el Pilar Backend?

Todo lo que sucede **dentro del sistema** para proteger, clasificar y gestionar los datos de forma técnica.

→ Ver definición completa: [PILLAR-SEPARATION.md](../../architecture/PILLAR-SEPARATION.md)

---

## Contenido de este pilar

### Checklists

| Archivo | Cuándo usarlo |
|---|---|
| [checklist-seguridad-datos.md](checklists/checklist-seguridad-datos.md) | Antes de lanzar: hashing, TLS, variables de entorno, backups, roles, derechos de usuario |
| [checklist-datos-sensibles.md](checklists/checklist-datos-sensibles.md) | Cuando el sistema trata salud, biometría, menores — protección técnica completa |
| [checklist-ciclo-vida.md](checklists/checklist-ciclo-vida.md) | Implementar retención, purga automática, anonimización, backups |
| [checklist-acceso.md](checklists/checklist-acceso.md) | Configurar RBAC, audit logging, monitoreo, acceso de emergencia |
| [checklist-transferencias.md](checklists/checklist-transferencias.md) | Firmar DPAs, base legal para transferencias internacionales, evaluar nuevos proveedores |

### Arquitecturas de referencia

| Archivo | Qué contiene |
|---|---|
| [encryption-strategy.md](architecture/encryption-strategy.md) | Cifrado en tránsito (TLS), en reposo (AES-256), hashing de contraseñas, gestión de claves (KMS) |
| [audit-logging.md](architecture/audit-logging.md) | Qué loguear, esquema de tabla, implementación con middleware, inmutabilidad, retención |
| [data-classification.md](architecture/data-classification.md) | Taxonomía de datos (público/personal/sensible/menores), mapa de campos, impacto en risk score |
| [access-control.md](architecture/access-control.md) | Modelo de roles, RBAC con código de referencia, acceso de emergencia, offboarding |

### Matrices de referencia

| Archivo | Qué contiene |
|---|---|
| [sanciones-por-incidente.md](matrices/sanciones-por-incidente.md) | Montos de multas por jurisdicción y tipo de infracción, casos reales |
| [medidas-seguridad-minimas.md](matrices/medidas-seguridad-minimas.md) | Estándar técnico mínimo por jurisdicción, checklist de auditoría rápida |

---

## Árbol de decisión rápida

```
¿Qué necesitas implementar?
│
├── Protección básica antes del lanzamiento
│   └── checklist-seguridad-datos.md
│
├── Sistema que trata datos sensibles (salud, biometría, menores)
│   └── checklist-datos-sensibles.md + encryption-strategy.md
│
├── Cuánto tiempo conservar los datos y cómo eliminarlos
│   └── checklist-ciclo-vida.md
│
├── Control de acceso y quién puede ver qué
│   └── checklist-acceso.md + access-control.md
│
├── Contratos con AWS, Google, terceros
│   └── checklist-transferencias.md
│
├── Implementar cifrado / hashing de contraseñas
│   └── encryption-strategy.md
│
├── Implementar audit logs
│   └── audit-logging.md
│
├── Clasificar un campo de la base de datos
│   └── data-classification.md + /clasificar-datos skill
│
└── Ver qué pasa si hay una brecha
    └── sanciones-por-incidente.md
```

---

## Propietarios y validación

| Rol | Responsabilidad |
|---|---|
| **CTO** | Owner — aprueba decisiones arquitectónicas sobre protección de datos |
| **Security Lead** | Owner técnico — define e implementa controles de seguridad |
| **Abogado de data governance** | Valida transferencias, ciclo de vida, DPA |
| **Compliance Officer** | Reviewer — verifica alineación con ISO 27001, SOC 2 |

**Cadencia de revisión:** Trimestral (estándares de cifrado, vulnerabilidades) + Ad-hoc al agregar proveedores

---

## Integración con Pilar Frontend

Cambios en este pilar que requieren coordinación con [Pilar Frontend](../pillar-frontend/_index.md):

- Nuevo proveedor/tercero → Frontend actualiza política de privacidad
- Cambio de retención → Frontend actualiza texto visible al usuario
- Brecha de datos → Frontend diseña comunicación al usuario afectado
- Cambio de cifrado → Frontend actualiza referencias en política (si las hay)

Ver [INTEGRATION-POINTS.md](../../architecture/INTEGRATION-POINTS.md) para todos los puntos de sincronización.

---

*Privacy Compliance Skills — [DISCLAIMER.md](../../DISCLAIMER.md)*
