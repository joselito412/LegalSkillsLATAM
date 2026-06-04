# Arquitectura: Clasificación de Datos
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **LegalSkillsLATAM** — Guía de arquitectura. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead

La clasificación de datos es el paso previo a cualquier decisión de seguridad: no se puede cifrar, retener o controlar el acceso a algo que no se sabe qué es.

---

## Taxonomía de clasificación

### Nivel 1: Público

Datos que no identifican a una persona o que son de acceso público por ley.

| Ejemplos | Protección requerida | Base legal obligatoria |
|---|---|---|
| Nombre de empresa, NIT/RUC/CNPJ | Ninguna especial | No |
| Datos en registros públicos | Ninguna especial | No |
| Estadísticas agregadas y anónimas | Ninguna especial | No |
| Precios, catálogos públicos | Ninguna especial | No |

**Score de riesgo:** 10 puntos base (LegalSkillsLATAM)

### Nivel 2: Personal General

Cualquier información que identifique directa o indirectamente a una persona natural.

| Ejemplos | Protección mínima | Base legal |
|---|---|---|
| Nombre completo + email | Cifrado en tránsito (TLS) | Consentimiento o contrato |
| Número de teléfono | Cifrado en tránsito | Consentimiento o contrato |
| Dirección IP, cookie ID | Cifrado en tránsito | Consentimiento o interés legítimo |
| Fecha de nacimiento | Cifrado en tránsito | Consentimiento o contrato |
| Dirección postal | Cifrado en tránsito | Consentimiento o contrato |
| Historial de navegación en la app | Cifrado en tránsito + acceso restringido | Consentimiento o interés legítimo |
| Geolocalización | Cifrado en tránsito + acceso restringido | Consentimiento explícito |

**Score de riesgo:** 40 puntos base (LegalSkillsLATAM)

### Nivel 3: Sensible

Datos que por su naturaleza pueden generar discriminación, daño grave o riesgo especial al titular.

| Subcategoría | Ejemplos | Protección adicional |
|---|---|---|
| **Salud** | Diagnósticos, medicamentos, historial médico, peso, condiciones crónicas | Cifrado a nivel de columna (AES-256) + acceso muy restringido |
| **Biométrico** | Huella digital, reconocimiento facial, iris, voz (autenticación) | Hash irreversible o cifrado + no reconocible desde lo almacenado |
| **Genético** | ADN, genoma, datos de laboratorio genéticos | Máximo nivel de cifrado + acceso solo por personal autorizado |
| **Racial/Étnico** | Origen étnico o racial autoreportado | Cifrado + nunca en texto plano |
| **Político/Religioso** | Afiliación sindical, partido, religión, orientación filosófica | Cifrado + acceso muy restringido |
| **Sexual** | Orientación sexual, vida sexual | Máximo nivel de cifrado + acceso solo cuando es necesario para el servicio |
| **Penal/Judicial** | Antecedentes penales, procesos judiciales | Solo si hay base legal específica + acceso restringido |
| **Financiero** | Cuentas bancarias, ingresos, deudas (fuera de pagos) | Cifrado + acceso restringido |

**Score de riesgo:** 80 puntos base (LegalSkillsLATAM)

### Nivel 4: Menores

Cualquier dato de persona menor de 18 años (16 años bajo GDPR).

**Penalizador adicional:** +30 puntos sobre la categoría del dato.

| Requisito adicional | Descripción |
|---|---|
| Verificación de edad | El sistema debe verificar o declarar la edad antes de capturar datos |
| Consentimiento parental | Para menores que requieren tratamiento de datos, el consentimiento lo da el tutor |
| Sin perfilado publicitario | Los datos de menores no se usan para publicidad personalizada |
| Restricción de acceso | Datos de menores tienen acceso aún más restringido que datos sensibles de adultos |

---

## Mapa de clasificación por campo (ejemplo)

Estructura recomendada para documentar el mapa de datos del sistema:

```yaml
# data-map.yaml — Inventario de clasificación de datos
tables:
  users:
    fields:
      id:            { classification: personal, required_basis: true, encrypted: false }
      email:         { classification: personal, required_basis: true, encrypted: transit }
      password_hash: { classification: personal, required_basis: true, encrypted: hash_bcrypt }
      full_name:     { classification: personal, required_basis: true, encrypted: transit }
      phone:         { classification: personal, required_basis: true, encrypted: transit }
      birth_date:    { classification: personal, required_basis: true, encrypted: transit }
      country:       { classification: personal, required_basis: true, encrypted: transit }
      created_at:    { classification: personal, required_basis: false, encrypted: false }

  health_records:
    fields:
      id:            { classification: sensitive_health, required_basis: true, encrypted: column_aes256 }
      user_id:       { classification: sensitive_health, required_basis: true, encrypted: false }
      diagnosis:     { classification: sensitive_health, required_basis: true, encrypted: column_aes256 }
      medication:    { classification: sensitive_health, required_basis: true, encrypted: column_aes256 }
      recorded_by:   { classification: personal, required_basis: true, encrypted: false }
      created_at:    { classification: personal, required_basis: false, encrypted: false }

  biometric_templates:
    fields:
      id:            { classification: sensitive_biometric, required_basis: true, encrypted: hash_irreversible }
      user_id:       { classification: sensitive_biometric, required_basis: true, encrypted: false }
      template_hash: { classification: sensitive_biometric, required_basis: true, encrypted: hash_irreversible }
      template_type: { classification: sensitive_biometric, required_basis: true, encrypted: column_aes256 }
```

---

## Reglas de protección por clasificación

| Clasificación | Cifrado en tránsito | Cifrado en reposo | Acceso | Retención |
|---|---|---|---|---|
| Público | Recomendado | No necesario | Todos | Sin límite |
| Personal general | ✅ Obligatorio (TLS) | Disco | Roles con necesidad | Según ley + finalidad |
| Sensible | ✅ TLS 1.2+ | Columna (AES-256) | Roles muy restringidos | Mínimo necesario |
| Menores | ✅ TLS 1.2+ | Columna (AES-256) | Acceso especialmente restringido | Hasta mayoría de edad |

---

## Impacto en penalizadores del Legal Risk Score

| Si el sistema trata... | Score base | Penalizadores adicionales probables |
|---|---|---|
| Solo datos públicos | 10 | Ninguno |
| Datos personales generales | 40 | Sin consentimiento (+15), sin política (+10) |
| Datos sensibles de salud/biometría | 80 | Sin cifrado (+15), sin DPA (+15), sin base legal (+20) |
| Datos de menores | 80+30=110 → cap 100 | Prácticamente garantiza riesgo alto |

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance*  
*Ver skill: [/clasificar-datos](../../../skills/clasificar-datos/SKILL.md)*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
