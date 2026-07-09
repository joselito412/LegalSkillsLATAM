# Checklist Backend — Seguridad Técnica Básica
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **Privacy Compliance Skills** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Validación: Abogado de data governance

Usa este checklist para verificar los controles técnicos y organizativos mínimos antes de lanzar un sistema que procesa datos de usuarios. Para los aspectos de interfaz de usuario y consentimiento, ver [checklist-consentimiento.md](../../pillar-frontend/checklists/checklist-consentimiento.md).

---

## Bloque 1: Seguridad Técnica Básica

- [ ] Contraseñas almacenadas con **hash robusto**: bcrypt (cost ≥12), argon2id, o scrypt — **nunca** en texto plano, MD5 o SHA1 sin salt
- [ ] Todas las comunicaciones sobre **HTTPS/TLS 1.2+** en producción (recomendado TLS 1.3)
- [ ] **HSTS habilitado** en el servidor web
- [ ] Variables de entorno y secretos **fuera del código fuente** — no en el repositorio de Git
  - Usar: variables de entorno del sistema, AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault
- [ ] Datos personales **no expuestos en URLs** (ej: `/profile?email=user@example.com` es inseguro)
- [ ] Acceso a la base de datos restringido por **roles** — la app no usa el usuario `root` o `admin` en producción
- [ ] **Backups** configurados, cifrados y probados (recovery drill al menos una vez antes de lanzar)
- [ ] No hay datos de producción en entornos de desarrollo o staging sin anonimización previa

---

## Bloque 2: Registro de Consentimiento (Contraparte de Frontend)

> Este bloque implementa la base de datos para los consentimientos que Frontend recopila. Ver [checklist-consentimiento.md](../../pillar-frontend/checklists/checklist-consentimiento.md) para la UI.

- [ ] Existe una tabla de consentimientos con estructura mínima:
  - `user_id`, `purpose`, `data_category`, `country`, `granted` (bool), `notice_version`, `granted_at`, `revoked_at`
- [ ] La tabla es **append-only** — los registros históricos no se modifican ni eliminan
- [ ] Cuando el usuario revoca desde la UI, el sistema registra `revoked_at` en tiempo real
- [ ] El sistema bloquea el tratamiento de datos para propósitos cuyo consentimiento fue revocado
- [ ] Existe un endpoint o función para exportar el historial de consentimiento de un usuario específico

---

## Bloque 3: Proveedores y Terceros

- [ ] Documentado internamente: todos los **terceros que reciben datos de usuarios** (analytics, CRM, pagos, email, logging, etc.)
- [ ] Revisados los **términos de datos** de cada proveedor — verificar que no vendan ni compartan datos
- [ ] Si opera con usuarios de **Europa o Brasil**: cada tercero procesador tiene un **DPA firmado**
- [ ] El proveedor de hosting/cloud tiene certificaciones reconocidas: SOC 2, ISO 27001, o está en país con régimen de protección adecuado
- [ ] Existe un proceso para **evaluar nuevos proveedores** antes de integrarlos (no se conectan SDKs sin revisión)

---

## Bloque 4: Derechos de los Usuarios — Capacidad Técnica

- [ ] El sistema puede **exportar todos los datos de un usuario específico** en formato estructurado (JSON, CSV) — para solicitudes de acceso/portabilidad
- [ ] El sistema puede **borrar realmente** los datos de un usuario (borrado físico, no solo `is_active=false`)
  - Las excepciones legales al borrado están documentadas (ej: retención obligatoria por obligación legal)
- [ ] El sistema puede **anonimizar** datos de un usuario cuando no se puede borrar completamente
- [ ] El equipo sabe **qué tabla/campo** contiene qué datos de un usuario — existe un mapa de datos
- [ ] El equipo sabe **qué plazo** tiene para responder solicitudes ARCO por jurisdicción del usuario

---

## Bloque 5: Datos de Pago (si aplica)

- [ ] **No se almacenan** números de tarjeta de crédito completos en la base de datos propia — usar proveedor PCI-compliant
- [ ] El proveedor de pagos tiene **certificación PCI DSS** (Stripe, PayU, Mercado Pago, etc.)
- [ ] Los formularios de pago son del **proveedor** (iframe o redirect) — no son formularios propios que pasan por el servidor
- [ ] Datos de pago se tratan según las reglas del país del usuario (en Brasil, Colombia y México aplican regulaciones financieras adicionales)

---

## Autodiagnóstico

| Bloques completados | Estado | Acción |
|---|---|---|
| 5/5 ✅ | 🟢 Listo | Revisar trimestralmente |
| 4/5 ✅ | 🟡 Casi listo | Completar el bloque faltante antes del lanzamiento |
| 3/5 ✅ | 🔴 Riesgo alto | Detener lanzamiento hasta completar mínimo bloques 1, 3 y 4 |
| < 3 ✅ | 🚨 Crítico | Consultar con Security Lead y abogado antes de continuar |

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance*  
*Ver contraparte frontend: [checklist-consentimiento.md](../../pillar-frontend/checklists/checklist-consentimiento.md)*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
