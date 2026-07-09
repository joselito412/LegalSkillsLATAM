# Matriz: Medidas de Seguridad Mínimas por Jurisdicción
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **Privacy Compliance Skills** — Guía de referencia. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Pendiente validación por abogado especialista por jurisdicción

---

## Resumen de obligaciones técnicas por ley

| Medida | 🇧🇷 LGPD | 🇨🇴 Ley 1581 | 🇲🇽 LFPDPPP | 🇪🇺 GDPR | Estándar ISO 27001 |
|---|---|---|---|---|---|
| **Cifrado en tránsito (TLS)** | Implícito (Art. 46) | Implícito (Art. 17) | Explícito (Art. 19 — medidas técnicas) | Explícito (Art. 32.1.a) | Control 8.24 |
| **Cifrado en reposo** | Implícito (Art. 46) | Implícito | Implícito | Recomendado (Art. 32) | Control 8.24 |
| **Control de acceso (RBAC)** | Implícito (Art. 6.VII) | Implícito | Explícito (Art. 19 — medidas administrativas) | Art. 32.1.b | Control 5.15 |
| **Audit logging** | Implícito (accountability — Art. 6.X) | Implícito | Implícito | Implícito (Art. 5.2 + Art. 30) | Control 8.15 |
| **Gestión de claves (KMS)** | Implícito | No especificado | No especificado | Implícito (Art. 32) | Control 8.24 |
| **Plan de incidentes** | Explícito (Art. 48) | Explícito (Circular SIC) | Explícito (Art. 20) | Explícito (Art. 33-34) | Control 5.24 |
| **Evaluación de impacto (DPIA)** | Implícito (RIPD — Art. 38) | No obligatorio | No obligatorio | Obligatorio para alto riesgo (Art. 35) | Control 5.7 |
| **Medidas para proveedores (DPA)** | Arts. 39-46 | Art. 26 | Arts. 36-37 | Arts. 28-29 | Control 5.19 |
| **Medidas para menores** | Art. 14 (más estricto) | Art. 7 | Implícito | Art. 8 (más estricto) | — |
| **Registro del tratamiento** | Arts. 37-38 | Registro ante SIC | Aviso de privacidad | Art. 30 (obligatorio) | Control 5.9 |

---

## Estándar mínimo técnico por categoría de dato

### Datos personales generales (email, nombre, teléfono, dirección)

| Control | Mínimo obligatorio | Recomendado |
|---|---|---|
| Tránsito | TLS 1.2 | TLS 1.3 |
| Reposo | Cifrado de disco | Cifrado de columna |
| Acceso | Roles diferenciados | RBAC completo |
| Logs | Logs de modificación | Logs de acceso + modificación |
| Backups | Sí, cifrados | Sí, cifrados + region secundaria |
| Hashing de contraseñas | bcrypt (cost 10+) | argon2id |

### Datos sensibles (salud, biometría, religión, sexual, penal)

| Control | Mínimo obligatorio | Recomendado |
|---|---|---|
| Tránsito | TLS 1.2 | TLS 1.3 + mTLS interno |
| Reposo | Cifrado de columna (AES-256) | Cifrado de columna + KMS |
| Acceso | Acceso muy restringido + auditable | RBAC granular + aprobación doble |
| Logs | Logs de cada acceso | Logs inmutables + alertas |
| Backups | Sí, cifrados, región separada | Sí + prueba de restauración trimestral |
| Gestión de claves | KMS obligatorio | KMS + rotación automática |

### Datos de menores

| Control | Mínimo obligatorio | Recomendado |
|---|---|---|
| Tratamiento | Solo datos estrictamente necesarios | Principio de minimización estricto |
| Acceso | Más restringido que datos sensibles adultos | Aprobación explícita para cada acceso |
| Publicidad | ❌ Prohibida la publicidad personalizada | ❌ Ningún perfilado publicitario |
| Retención | Hasta mayoría de edad | Eliminar antes si el servicio se cancela |

---

## Sanciones por tipo de incumplimiento técnico

| Tipo de brecha técnica | Brasil (LGPD) | Colombia (Ley 1581) | México (LFPDPPP) | GDPR |
|---|---|---|---|---|
| Sin cifrado, datos expuestos | Hasta R$50M por infracción (2% facturación BR) | Hasta 2,000 SMLMV (~$600K USD) | Hasta $34M MXN (~$2M USD) | Hasta €20M o 4% facturación global |
| Sin plan de respuesta a brechas | Multa + publicidad de infracción | Multa | Multa | Multa nivel 1 |
| Transferencia internacional sin base legal | Hasta R$50M | Multa | Multa | €20M o 4% facturación global |
| Sin DPO (cuando es obligatorio) | Multa | No aplica (no obligatorio) | No aplica | Multa nivel 1 |

---

## Checklist de auditoría técnica rápida

Para evaluar el nivel técnico de un sistema antes de lanzar:

```
□ ¿TLS 1.2+ en todos los endpoints?
□ ¿Cifrado de disco en servidor y base de datos?
□ ¿Datos sensibles con cifrado adicional a nivel de columna?
□ ¿Claves en KMS (no en código ni en .env)?
□ ¿Contraseñas con bcrypt/argon2 (no MD5/SHA1)?
□ ¿Roles de acceso diferenciados (no todo el equipo usa admin)?
□ ¿Logs de acceso a datos sensibles?
□ ¿Plan de respuesta a incidentes documentado?
□ ¿DPA con cada proveedor cloud y tercero?
□ ¿Backups cifrados y testados?
```

Puntaje: 8-10 ✅ = nivel técnico adecuado | 5-7 = trabajar antes del lanzamiento | <5 = alto riesgo

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
