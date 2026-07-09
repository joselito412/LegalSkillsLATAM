# Matriz SDLC — Acciones de Cumplimiento por Capa
**Privacy Compliance Skills — De la ley a la acción concreta en el ciclo de vida del desarrollo**

> Elaborado: 2026-07-08
> Versión: 1.0
> Estado: Borrador editorial — pendiente validación de pares
> Pilares: Frontend · Backend · **DevOps (nuevo)** · Gobernanza de Datos

Esta matriz traduce las obligaciones legales de LATAM (con contraste GDPR/EE.UU.) en acciones concretas de diseño y desarrollo, organizadas por capa técnica y por categoría de dato. Cada acción cita su base legal (`legal_ref`) y su estándar de industria (`standards_ref`).

**Cómo usarla:** identifica la categoría más sensible de dato que procesa tu sistema (`/clasificar-datos`), y ejecuta las acciones de esa columna en las cuatro capas. Las acciones de "dato personal" son siempre prerequisito de las de "dato sensible".

---

## 1. Front-end — UX / Consentimiento / Transparencia

| # | Acción | Dato personal | Dato sensible / menores | legal_ref | standards_ref |
|---|---|---|---|---|---|
| FE-1 | Consentimiento granular por finalidad (toggles independientes, nunca un solo "Acepto todo") | ✅ Requerido | ✅ + consentimiento explícito reforzado (por escrito/firma electrónica en MX) | CO: Art. 9, Ley 1581/2012 · BR: Art. 8 §4, LGPD · MX: LFPDPPP 2025 · EU: Art. 7, GDPR | ISO 27701 §7.2.3-7.2.4 |
| FE-2 | Aviso de privacidad visible en el punto de captura del dato (no solo en el footer) | ✅ | ✅ | MX: aviso de privacidad (LFPDPPP 2025) · BR: Art. 9, LGPD · EU: Arts. 12-13, GDPR | ISO 29184 (avisos en línea) |
| FE-3 | Minimización en formularios: solo campos estrictamente necesarios para la finalidad | ✅ | ✅ + justificación documentada por campo | BR: Art. 6, III, LGPD · EU: Art. 5(1)(c), GDPR · CO: Decreto 1377/2013 | NIST Privacy Framework CT.DM |
| FE-4 | Banner de cookies con rechazo tan fácil como la aceptación (simetría de clics) | ✅ si hay tracking | ✅ | EU: Art. 7(3), GDPR + ePrivacy · BR: guía ANPD sobre cookies | OWASP ASVS V8 |
| FE-5 | Cero dark patterns: sin casillas pre-marcadas, sin ocultar la opción de rechazo, sin lenguaje engañoso | ✅ | ✅ | EU: Art. 4(11) y 7(4), GDPR · US: FTC Act §5 (prácticas engañosas) | Guías EDPB 03/2022 |
| FE-6 | Revocación de consentimiento accesible desde la UI en ≤ los mismos pasos que otorgarlo | ✅ | ✅ | MX: mecanismos sencillos y gratuitos (LFPDPPP) · BR: Art. 8 §5, LGPD · EU: Art. 7(3), GDPR | ISO 27701 §7.3.4 |
| FE-7 | Flujo de verificación de edad y consentimiento parental cuando el servicio pueda alcanzar menores | — | ✅ Obligatorio | BR: Art. 14, LGPD · CO: Art. 7, Ley 1581/2012 · US: COPPA | — |
| FE-8 | Portal/sección de derechos del usuario (ARCO/ARSOP): solicitar acceso, corrección, borrado desde la app | ✅ | ✅ + canal prioritario | MX: Arts. 22-36, LFPDPPP 2010 (verificar num. 2025) · BR: Art. 18, LGPD · EU: Arts. 15-22, GDPR | ISO 27701 §7.3 |

## 2. Back-end — Seguridad Técnica / Arquitectura

| # | Acción | Dato personal | Dato sensible / menores | legal_ref | standards_ref |
|---|---|---|---|---|---|
| BE-1 | Cifrado en tránsito TLS 1.2+ en todos los endpoints que muevan datos personales | ✅ | ✅ TLS 1.3 recomendado | Deber de seguridad: CO Art. 4(g), Ley 1581 · BR Arts. 6, VII y 46, LGPD · EU Art. 32, GDPR | ISO 27001 A.8.24 · OWASP ASVS V9 |
| BE-2 | Cifrado en reposo (AES-256) de bases y backups con datos personales | ✅ | ✅ + cifrado a nivel de campo/columna para el dato sensible | Ídem BE-1 | ISO 27001 A.8.24 · NIST SP 800-57 |
| BE-3 | Contraseñas con hash adaptativo (Argon2id / bcrypt) — nunca cifrado reversible ni hash simple | ✅ | ✅ | Deber de seguridad (ídem BE-1) | OWASP ASVS V2.4 · NIST SP 800-63B |
| BE-4 | RBAC con mínimo privilegio: nadie accede a datos que su rol no necesita | ✅ | ✅ + acceso con justificación registrada (break-glass) | EU: Art. 32, GDPR · BR: Art. 46, LGPD | ISO 27001 A.5.15/A.8.2 · SOC 2 CC6 |
| BE-5 | Audit logging inmutable de accesos y modificaciones a datos personales | ✅ | ✅ retención ≥ 12 meses para investigación | BR: Art. 37, LGPD (registro de operaciones) · EU: Art. 30, GDPR | ISO 27001 A.8.15 · SOC 2 CC7 |
| BE-6 | Retención definida por tipo de dato + borrado/anonimización automática al vencer la finalidad | ✅ | ✅ | BR: Arts. 15-16, LGPD · EU: Art. 5(1)(e), GDPR · CO: Sentencia C-748/2011 (finalidad) | ISO 27701 §7.4.7 |
| BE-7 | Borrado efectivo para solicitudes ARCO: propagación a réplicas, cachés y backups (o registro de excepción legal) | ✅ | ✅ | MX: derecho de Cancelación · BR: Art. 18, VI, LGPD · EU: Art. 17, GDPR | NIST SP 800-88 (sanitización) |
| BE-8 | DPA firmado con cada procesador/subprocesador (cloud, analytics, pagos) antes de enviar datos | ✅ | ✅ + verificación de subprocesadores | BR: Art. 39, LGPD · EU: Art. 28, GDPR · CO: Decreto 1377/2013 (encargados) | SOC 2 del proveedor como evidencia |
| BE-9 | Transferencias internacionales con garantías: región adecuada, SCCs o consentimiento específico | ✅ | ✅ | CO: Art. 26, Ley 1581 · BR: Arts. 33-36, LGPD · EU: Cap. V, GDPR | — |
| BE-10 | Pseudonimización/tokenización cuando la finalidad lo permita (analítica, testing, ML) | Recomendado | ✅ Requerido | BR: Art. 13, LGPD (estudios) · EU: Arts. 25 y 32, GDPR | ISO 27701 §7.4.5 |

## 3. DevOps — Entornos / Pipeline / Operación *(pilar nuevo)*

| # | Acción | Dato personal | Dato sensible / menores | legal_ref | standards_ref |
|---|---|---|---|---|---|
| DO-1 | **Staging obligatorio antes de producción** — ningún cambio que toque datos personales se despliega sin pasar por un entorno de staging equivalente a prod | ✅ | ✅ + aprobación humana registrada del deploy | Privacidad por diseño: BR Art. 46 §2, LGPD · EU Art. 25, GDPR | SOC 2 CC8.1 (change management) · ISO 27001 A.8.31-A.8.32 |
| DO-2 | Datos sintéticos o enmascarados en dev/staging — **nunca dumps de producción** | ✅ | ✅ Prohibición absoluta | El tratamiento fuera de la finalidad original carece de base legal: EU Art. 5(1)(b), GDPR · BR Art. 6, I, LGPD | ISO 27001 A.8.33 (datos de prueba) |
| DO-3 | Secrets manager para credenciales y llaves (Vault, AWS SM, etc.) — nada en el repo ni en `.env` versionado | ✅ | ✅ + rotación programada | Deber de seguridad (Art. 32 GDPR y equivalentes LATAM) | OWASP ASVS V6 · ISO 27001 A.8.24 |
| DO-4 | Separación de entornos y de credenciales: prod aislada, sin cuentas compartidas entre entornos | ✅ | ✅ | Deber de seguridad | ISO 27001 A.8.31 · SOC 2 CC6.3 |
| DO-5 | SAST + escaneo de dependencias (SCA) en el pipeline de CI | ✅ | ✅ + escaneo de secretos (gitleaks o equivalente) | Deber de seguridad proactivo | OWASP ASVS V10 · NIST SSDF |
| DO-6 | Gate de riesgo legal en CI: `npx privacy-compliance-skills audit --config --fail-on 71` (51 para datos sensibles) | Recomendado | ✅ | — (control interno) | Compliance-as-Code |
| DO-7 | Logs de aplicación sin PII en claro (enmascarar email, tokens, documentos de identidad) | ✅ | ✅ | Minimización aplicada a telemetría: EU Art. 5(1)(c), GDPR | OWASP ASVS V7.1 |
| DO-8 | Backups cifrados con restauración probada (≥ 1 prueba/semestre documentada) | ✅ | ✅ | Disponibilidad e integridad: Art. 32(1)(c), GDPR y equivalentes | ISO 27001 A.8.13 · SOC 2 A1.2 |
| DO-9 | Runbook de respuesta a brechas con plazos por jurisdicción: BR 3 días hábiles (Res. ANPD 15/2024) · GDPR 72h · PE 48h (D.S. 016-2024-JUS) · MX "a la brevedad" (SABG) · CO "tan pronto como sea posible" (SIC) | ✅ | ✅ + simulacro anual | Ver refs por país en la celda | ISO 27001 A.5.24-A.5.28 · NIST SP 800-61 |

## 4. Gobernanza de Datos — por categoría

| Categoría (`/clasificar-datos`) | Acciones de gobernanza | legal_ref |
|---|---|---|
| **Público** (C_base 10) | Inventario de fuentes; verificar que el carácter "público" tiene base normativa (no basta que sea accesible) | CO: dato público, Ley 1581/2012 |
| **Personal** (C_base 40) | Base legal documentada por finalidad; RoPA ligero (registro de actividades de tratamiento); revisión anual de finalidades | BR: Arts. 7 y 37, LGPD · EU: Arts. 6 y 30, GDPR |
| **Sensible** (C_base 80) | DPIA/RIPD antes de desarrollar; acceso restringido con justificación; consentimiento reforzado; evaluación de proveedor por dato | BR: Arts. 5, X y 38, LGPD (RIPD) · EU: Art. 35, GDPR (DPIA) |
| **Menores** (+30) | Verificación de edad; consentimiento parental verificable; prohibición de perfilado publicitario; revisión legal humana obligatoria | BR: Art. 14, LGPD · US: COPPA · EU: Art. 8, GDPR |

---

## Regla de staging (estándar enterprise — resumen ejecutivo)

> **Ningún sistema que trate datos personales despliega a producción sin: (1) pasar por staging con datos no reales, (2) pipeline verde incluyendo el gate de riesgo legal, y (3) para datos sensibles, aprobación humana registrada.** Esta regla es la síntesis operativa de "privacidad desde el diseño y por defecto" (Art. 25 GDPR; Art. 46 §2 LGPD) aplicada al pipeline.

## Relación con el motor de riesgo

Las acciones DO-1 a DO-9 alimentan los penalizadores de `cli/rules/risk-engine/devops-penalizers.json`. Las acciones FE-* y BE-* corresponden a los penalizadores existentes en `fe-penalizers.json` y `be-penalizers.json`.

---

*Privacy Compliance Skills — Este documento es una guía informativa y no constituye asesoría jurídica. Ver [DISCLAIMER.md](../../DISCLAIMER.md).*
