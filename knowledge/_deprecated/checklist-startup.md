# Checklist para Startups — Cumplimiento Mínimo Viable

> 🚧 **ARCHIVO DEPRECADO (v0.3)** — Este checklist fue dividido en dos archivos especializados:
> - **Frontend (consentimiento, UI, menores):** [pillar-frontend/checklists/checklist-consentimiento.md](../pillar-frontend/checklists/checklist-consentimiento.md)
> - **Backend (seguridad técnica, proveedores, derechos):** [pillar-backend/checklists/checklist-seguridad-datos.md](../pillar-backend/checklists/checklist-seguridad-datos.md)
>
> Este archivo se mantiene por compatibilidad pero **no se actualiza**. Usar los nuevos archivos del pilar correspondiente.

---

> ⚠️ Guía informativa. No constituye asesoría jurídica. Aplica para proyectos de **riesgo bajo a medio (0–70 pts en el Legal Risk Score)**.  
> Si tu score es 🔴 Alto (>70 pts), necesitas asesoría legal profesional.

Usa este checklist antes de lanzar tu MVP o cuando comiences a capturar datos de usuarios reales.

---

## 📋 Bloque 1: Documentos Legales Mínimos

- [ ] **Política de Privacidad** publicada y accesible desde la página principal (footer)
  - Incluye: qué datos recopilas, para qué, con quién los compartes, cómo ejercer derechos, datos de contacto del responsable
- [ ] **Términos y Condiciones** de uso del servicio
- [ ] **Aviso de Cookies** (si usas cookies de analytics o marketing)
- [ ] **Descargo de responsabilidad** visible si el servicio da información sensible (salud, finanzas, legal)

---

## 📋 Bloque 2: Consentimiento y Registro

- [ ] El formulario de registro **no tiene el checkbox de política pre-marcado** (`checked=false` por default)
- [ ] El usuario debe **hacer clic activo** para aceptar la política de privacidad
- [ ] Se **registra en base de datos** la fecha y versión de política que el usuario aceptó
- [ ] Si usas múltiples finalidades (marketing + analytics + terceros), tienes **toggles separados** por finalidad
- [ ] Existe un mecanismo visible para que el usuario **revoque su consentimiento**

---

## 📋 Bloque 3: Seguridad Técnica Básica

- [ ] Contraseñas almacenadas con **hash robusto** (bcrypt, argon2, scrypt) — jamás en texto plano o MD5/SHA1
- [ ] Comunicaciones sobre **HTTPS/TLS** en producción
- [ ] Variables de entorno y secretos **fuera del código fuente** (no en el repo de Git)
- [ ] Datos personales **no expuestos en URLs** (ej: `/profile?email=user@example.com` es inseguro)
- [ ] Acceso a la base de datos restringido por **roles** — la app no usa el usuario `root` o `admin`
- [ ] **Backups** de datos configurados y probados

---

## 📋 Bloque 4: Proveedores y Terceros

- [ ] Lista documentada de **todos los terceros** que reciben datos de tus usuarios (analytics, CRM, pagos, etc.)
- [ ] Revisados los **términos de datos** de cada proveedor (que no vendan ni compartan los datos)
- [ ] Si operas con datos de usuarios de **Europa o Brasil**: cada tercero debe tener un DPA (Data Processing Agreement) firmado
- [ ] El proveedor de hosting/cloud tiene **certificaciones** reconocidas (SOC 2, ISO 27001, o régimen de protección adecuado)

---

## 📋 Bloque 5: Derechos de los Usuarios

- [ ] Existe un **canal documentado** para que los usuarios soliciten: ver sus datos, corregirlos, o borrarlos
  - Puede ser tan simple como un email designado: `privacidad@tuempresa.com`
- [ ] El equipo sabe **qué hacer y en qué plazo** cuando llega una solicitud (ver `/derechos-usuario`)
- [ ] El sistema puede **exportar los datos de un usuario** en caso de solicitud (aunque sea manual al principio)
- [ ] El sistema puede **borrar los datos de un usuario** si lo solicita (borrado real, no solo `is_active=false`)

---

## 📋 Bloque 6: Si manejas datos de pago

- [ ] **No almacenas** números de tarjeta de crédito en tu propia base de datos — usas un proveedor PCI-compliant (Stripe, PayU, etc.)
- [ ] El proveedor de pagos tiene **certificación PCI DSS**
- [ ] Los formularios de pago son del **proveedor** (iframe o redirect), no propios

---

## 📋 Bloque 7: Menores de Edad (si aplica)

- [ ] Si tu app puede ser usada por menores, tienes un **mecanismo de verificación de edad**
- [ ] Para usuarios menores de 18 años, el consentimiento lo da el **representante legal**
- [ ] **No recopilas más datos** de los necesarios para menores

---

## 🎯 Puntaje de Autodiagnóstico

Cuenta los ítems sin marcar:

| Sin marcar | Interpretación |
|---|---|
| 0–3 | ✅ Buena base. Revisa con `/privacy-check` antes de lanzar. |
| 4–8 | ⚠️ Riesgo moderado. Prioriza los bloques 1, 2 y 3 esta semana. |
| 9+ | 🔴 Riesgo alto. Pausa el lanzamiento y trabaja en cumplimiento primero. |

---

*LegalSkillsLATAM — [DISCLAIMER.md](../DISCLAIMER.md)*
