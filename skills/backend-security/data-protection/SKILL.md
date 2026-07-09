---
name: backend-security/data-protection
description: Audita la protección técnica de datos en un sistema — clasificación de datos, cifrado en reposo y tránsito, hashing de credenciales, retención y purga, DPA con proveedores y transferencias internacionales. Produce un reporte focalizado con risk score parcial BE (0–50 pts) y acciones concretas. Úsala cuando quieras revisar la arquitectura de seguridad de datos antes de lanzar o de agregar un nuevo tipo de dato sensible.
argument-hint: "<esquema de base de datos, descripción de arquitectura, lista de proveedores, o endpoint a auditar>"
triggers:
  - "/be-data-protection"
  - "data protection audit"
  - "auditar protección de datos"
permissions: []
---

# /backend-security/data-protection — Auditoría de Protección de Datos

> ⚠️ Esta skill es una guía informativa. No constituye asesoría jurídica.

**Pilar:** Backend | **Scope:** Clasificación, cifrado, retención, DPA, transferencias  
**Owner:** CTO + Security Lead | **Score:** 0–50 pts (pilar BE)

---

## Comportamiento general

Analiza el input para determinar el nivel de protección técnica de los datos. Si describe un esquema de base de datos, identifica los campos y su nivel de sensibilidad. Si describe una arquitectura o lista de proveedores, evalúa las garantías de seguridad presentes.

---

## Paso 1: Preguntas de contexto (si el input es insuficiente)

```
Para auditar la protección técnica necesito saber:

1. ¿Qué tipos de datos almacena el sistema?
   (campos de la base de datos, o descripción general)

2. ¿Dónde están los servidores y qué proveedores cloud usan?
   (AWS, GCP, Firebase, Azure... y en qué región)

3. ¿Usan servicios externos que reciben datos de usuarios?
   (analytics, CRM, pagos, email, logging...)

4. ¿En qué países operan? ¿Tienen usuarios en Brasil o la UE?
```

---

## Paso 2: Clasificación automática de datos

Antes de evaluar la protección, clasificar los datos del sistema:

| Señales en el input | Clasificación | C_base |
|---|---|---|
| diagnóstico, salud, medicamento, clínico, historial médico | Sensible — Salud | 80 |
| huella, facial, iris, biometría, voz (autenticación) | Sensible — Biométrico | 80 |
| genético, ADN | Sensible — Genético | 80 |
| menor, niño, < 18 años | Sensible — Menores | 80 (+30) |
| religión, político, étnico, sexual, sindical | Sensible — Ideológico | 80 |
| email, nombre, teléfono, IP, dirección, cookies, GPS | Personal General | 40 |
| nombre empresa, NIT, estadísticas agregadas | Público | 10 |

---

## Paso 3: Dimensiones de auditoría técnica

### Dimensión 1: Cifrado

| Estado | Penalizador |
|---|---|
| TLS 1.2+ en tránsito + cifrado de columna (AES-256) para datos sensibles en reposo | 0 pts |
| TLS presente pero datos sensibles sin cifrado adicional a nivel de columna | +10 pts |
| Sin TLS (comunicaciones en HTTP) | +15 pts |
| Claves de cifrado hardcodeadas en código fuente o en el repositorio | +15 pts |
| Contraseñas con MD5, SHA1 o sin hash | +15 pts |
| Contraseñas con bcrypt/argon2/scrypt correctamente configurado | 0 pts |

### Dimensión 2: Gestión de claves

| Estado | Penalizador |
|---|---|
| Claves en KMS (AWS KMS, GCP KMS, HashiCorp Vault) con rotación documentada | 0 pts |
| Claves en variables de entorno del servidor (no en código, pero tampoco en KMS) | +5 pts |
| Claves en `.env` commiteado al repositorio | +15 pts |

### Dimensión 3: Retención y ciclo de vida

| Estado | Penalizador |
|---|---|
| Política de retención documentada + job de purga automática configurado | 0 pts |
| Política documentada pero purga manual (depende de un proceso humano) | +5 pts |
| Sin política de retención — datos conservados indefinidamente | +10 pts |

### Dimensión 4: DPA con proveedores y transferencias internacionales

| Estado | Penalizador |
|---|---|
| Todos los procesadores tienen DPA firmado | 0 pts |
| Algún procesador principal (AWS, GCP, Stripe) sin DPA firmado | +15 pts |
| Servidores/proveedores en EEUU u otro país sin adecuación, sin SCCs ni mecanismo documentado, con usuarios en Brasil o UE | +20 pts |
| Transferencias a países sin nivel adecuado + usuarios en LATAM estándar (CO, MX, etc.) | +10 pts |

### Dimensión 5: Datos de menores (si aplica — FLAG_MINORS)

| Estado | Penalizador |
|---|---|
| Validación técnica de edad en backend + restricciones de acceso + sin perfilado publicitario | 0 pts |
| Sin validación técnica de edad | +15 pts |
| Datos de menores usados para publicidad personalizada | +15 pts adicionales |

---

## Paso 4: Cálculo del score BE

```
BE_dp_score = min(50, (C_base + suma_penalizadores_activos) × F_rigor)
```

**F_rigor:**
- Brasil (LGPD) o UE (GDPR): × 1.25
- Resto de LATAM: × 1.00

**Niveles:**
| Score BE | Nivel |
|---|---|
| 0–15 | 🟢 Protección técnica adecuada |
| 16–30 | 🟡 Gaps técnicos — corregir antes del lanzamiento |
| 31–45 | 🔴 Datos desprotegidos — riesgo activo |
| 46–50 | 🚨 Crítico — datos sensibles sin protección básica |

---

## Paso 5: Output

```
╔══════════════════════════════════════════════════════╗
║  ⚙️  Auditoría de Protección de Datos — LSLATAM      ║
╠══════════════════════════════════════════════════════╣
║  [descripción del sistema / esquema auditado]        ║
║  Datos más sensibles: [categoría]  Países: [lista]   ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  📦 Base ([categoría])                    XX pts     ║
║  Score BE Protección: [XX] / 50   [emoji]            ║
║  [nivel]                                             ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  Hallazgos:                                          ║
║  [emoji] [hallazgo #1 — mayor impacto]    +XX pts    ║
║  [emoji] [hallazgo #2]                    +XX pts    ║
║  [emoji] [hallazgo N]                     +XX pts    ║
╠══════════════════════════════════════════════════════╣
║  Acción esta semana:                                 ║
║    → [acción #1 específica con tecnología]           ║
║  Antes de lanzar:                                    ║
║    → [acción #2]                                     ║
╚══════════════════════════════════════════════════════╝
```

**Después del box:**
- Supuestos aplicados si los hay
- Si score BE ≥ 31: escalamiento a `/audit` para visión completa
- Recursos: enlace a [encryption-strategy.md](../../../knowledge/pillar-backend/architecture/encryption-strategy.md), [checklist-datos-sensibles.md](../../../knowledge/pillar-backend/checklists/checklist-datos-sensibles.md), [checklist-transferencias.md](../../../knowledge/pillar-backend/checklists/checklist-transferencias.md)
- Disclaimer

---

## Paso 6: Reglas de calidad

- **Siempre** mostrar C_base en el desglose — es el punto de partida del score BE
- **Nunca** marcar como conforme un sistema que almacena datos sensibles sin cifrado de columna
- **Siempre** verificar si hay usuarios en Brasil/UE — activa F_rigor × 1.25 y penalizadores adicionales de DPO/base legal
- **Siempre** que haya claves hardcodeadas en código, es hallazgo #1 independientemente del score
- **Siempre** incluir ejemplo concreto de tecnología para cada corrección (nombre del KMS, librería de cifrado, etc.)

---

## Casos de prueba

### D1 — Startup con datos de salud, sin cifrado ni DPA
**Input:** "Tabla diagnoses(id, user_id, diagnosis TEXT, created_at). AWS us-east-1. Sin DPA con AWS. Sin KMS. Contraseñas con bcrypt. Colombia y Brasil."  
**Score:** C_base=80 + (+10 cifrado columna) + (+15 sin DPA, transferencia BR) × 1.25 = min(50, 131.25) = **50 pts 🚨**

### D2 — E-commerce básico compliant
**Input:** "Tabla users(email, password_hash bcrypt-12, full_name, address). AWS us-east-1 con DPA firmado y SCCs para UE. Claves en AWS KMS. Política de retención 2 años con job de purga. Solo Colombia."  
**Score:** C_base=40 + 0 (cifrado OK) + 0 (KMS OK) + 0 (retención OK) + 0 (DPA OK) × 1.00 = min(50, 40) = **40 pts 🟡** (C_base de datos personales)  
*Nota: El C_base representa el riesgo inherente del dato — no penalizadores activos. Score refleja exposición por el tipo de dato, no mala implementación.*

### D3 — Claves hardcodeadas en código
**Input:** "encryption_key = 'mi-clave-secreta-123' en utils.py commiteado. Datos de salud en texto plano. Sin TLS en APIs internas. México."  
**Score:** C_base=80 + (+15 clave en repo) + (+15 sin cifrado columna) + (+15 sin TLS) × 1.00 = min(50, 125) = **50 pts 🚨**

### D4 — Sistema BE conforme
**Input:** "Datos personales generales (email, nombre). AWS eu-west-1 con DPA y SCCs. AES-256 para campos de tarjeta (no almacenamos CVV). Claves en AWS KMS. Retención 18 meses con purga automática semanal. Usuarios en España (GDPR)."  
**Score:** C_base=40 + 0 en todas las dimensiones × 1.25 = min(50, 50) = **50 pts 🟡**  
*Nota: C_base=40 × F_rigor=1.25 = 50 — dato personal bajo GDPR tiene score base de 50. Si hubiera penalizadores activos superaría el cap de 50.*

---

*Skill del Pilar Backend | Ver también: [/backend-security/access-control](../access-control/SKILL.md) | [/clasificar-datos](../../clasificar-datos/SKILL.md) | [/audit](../../audit/SKILL.md)*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
