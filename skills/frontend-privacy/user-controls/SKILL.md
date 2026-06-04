---
name: frontend-privacy/user-controls
description: Audita el portal de datos del usuario en un sistema — acceso y descarga de datos, flujo de eliminación de cuenta, revocación de consentimiento desde la UI y comunicación de plazos ARCO. Produce un reporte focalizado con risk score parcial FE (0–40 pts) y acciones concretas. Úsala cuando quieras revisar si tu app permite que los usuarios ejerzan sus derechos de forma autónoma sin necesidad de contactar soporte.
argument-hint: "<descripción del portal de privacidad, pantallas de configuración de cuenta, o flujos de eliminación de datos>"
---

# /frontend-privacy/user-controls — Auditoría del Portal de Datos del Usuario

> ⚠️ Esta skill es una guía informativa. No constituye asesoría jurídica.

**Pilar:** Frontend | **Scope:** Portal ARCO, descarga de datos, eliminación de cuenta, revocación  
**Owner:** PM de Producto + UX Designer | **Score:** 0–40 pts (pilar FE)

---

## Comportamiento general

Analiza el input para determinar si el sistema ofrece a los usuarios una forma autónoma de ejercer sus derechos sobre sus datos. Si el input describe pantallas, flujos o una URL del portal de privacidad, extrae la información. Si es breve, haz hasta 3 preguntas.

---

## Paso 1: Preguntas de contexto (si el input es insuficiente)

```
Para auditar el portal de datos del usuario necesito saber:

1. ¿Puede el usuario ver qué datos tiene el sistema sobre él?
   ¿Desde dónde? ¿Con cuántos clics?

2. ¿Puede el usuario descargar sus datos? ¿En qué formato?

3. ¿Puede el usuario eliminar su cuenta de forma autónoma?
   ¿Qué pasa con sus datos al eliminar?

4. ¿En qué países opera el sistema?
```

---

## Paso 2: Dimensiones de auditoría

### Dimensión 1: Acceso a sus propios datos

| Estado | Penalizador |
|---|---|
| El usuario puede ver un resumen de sus datos desde el perfil/configuración en ≤ 2 clics | 0 pts |
| El usuario debe enviar email o formulario para solicitar ver sus datos | +5 pts |
| No existe ningún mecanismo para que el usuario vea sus datos | +10 pts |

### Dimensión 2: Portabilidad (descarga de datos)

| Estado | Penalizador |
|---|---|
| El usuario puede descargar todos sus datos en formato estructurado (JSON, CSV) de forma autónoma | 0 pts |
| Descarga disponible pero requiere proceso manual del equipo (SLA > 5 días hábiles) | +5 pts |
| Sin capacidad de descarga de datos | +10 pts |

**Nota:** La portabilidad es obligatoria bajo GDPR (Art. 20) y LGPD (Art. 18.V). En LATAM estándar (CO, MX) es una buena práctica pero no siempre obligatoria.

### Dimensión 3: Eliminación de cuenta

| Estado | Penalizador |
|---|---|
| El usuario puede iniciar la eliminación de su cuenta de forma autónoma, con confirmación clara de qué se borra y qué se conserva (con razón legal) | 0 pts |
| Eliminación posible pero requiere contactar soporte | +5 pts |
| No existe proceso de eliminación — el usuario no puede darse de baja | +10 pts |
| El "borrado" es solo `is_active = false` (sin eliminación real de datos) | +5 pts adicionales |

### Dimensión 4: Revocación de consentimiento desde la UI

| Estado | Penalizador |
|---|---|
| El usuario puede revocar cada finalidad de consentimiento desde su perfil de forma autónoma, con confirmación de las consecuencias | 0 pts |
| Revocación solo por email o contactando soporte | +5 pts |
| Sin mecanismo de revocación visible | +10 pts |

### Dimensión 5: Comunicación de plazos y estado

| Estado | Penalizador |
|---|---|
| Los plazos de respuesta ARCO están visibles (en la política o en el portal) y el usuario puede hacer seguimiento del estado de su solicitud | 0 pts |
| Plazos no comunicados — el usuario no sabe cuándo esperar respuesta | +5 pts |

---

## Paso 3: Cálculo del score FE

```
FE_controls_score = min(40, suma_penalizadores_activos × F_rigor)
```

**F_rigor:**
- Brasil (LGPD) o UE (GDPR): × 1.25
- Resto de LATAM: × 1.00

**Niveles:**

| Score FE | Nivel |
|---|---|
| 0–8 | 🟢 Portal de datos adecuado |
| 9–20 | 🟡 Gaps — el usuario no puede ejercer derechos de forma autónoma |
| 21–32 | 🔴 Derechos bloqueados — riesgo de solicitudes ARCO no atendidas |
| 33–40 | 🚨 Crítico — sin portal de datos en mercados regulados |

---

## Paso 4: Output

```
╔══════════════════════════════════════════════════════╗
║  🖥️  Auditoría de Controles de Usuario — LSLATAM     ║
╠══════════════════════════════════════════════════════╣
║  [descripción del portal auditado]                   ║
║  Países: [lista]   |   Ley más exigente: [ley]       ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  Score FE Controles Usuario: [XX] / 40   [emoji]     ║
║  [nivel]                                             ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  Hallazgos:                                          ║
║  [emoji] [hallazgo #1]                    +XX pts    ║
║  [emoji] [hallazgo #2]                    +XX pts    ║
╠══════════════════════════════════════════════════════╣
║  Acción esta semana:                                 ║
║    → [acción #1 específica]                          ║
║  Antes de lanzar:                                    ║
║    → [acción #2]                                     ║
╚══════════════════════════════════════════════════════╝
```

**Después del box:**
- Supuestos aplicados si los hay
- Si score FE ≥ 21: escalamiento a `/audit`
- Recursos: [user-controls.md](../../../knowledge/pillar-frontend/patterns/user-controls.md), [derechos-usuario skill](../../derechos-usuario/SKILL.md)
- Plazos ARCO por país: Brasil 15 días hábiles, Colombia 10 días hábiles, México 20 días hábiles, GDPR 30 días calendario
- Disclaimer

---

## Paso 5: Reglas de calidad

- **Siempre** distinguir entre "el usuario puede hacer X desde la UI sin soporte" vs "el usuario puede solicitarlo por email" — son severidades distintas
- **Nunca** reportar como conforme un portal que hace `is_active = false` como "borrado" — es hallazgo obligatorio
- **Siempre** indicar los plazos legales de respuesta del país más exigente que opera el sistema
- **Siempre** mencionar que la contraparte técnica (backend) de estos flujos debe ser auditada con `/backend-security/access-control` y `/backend-security/data-lifecycle`

---

## Casos de prueba

### U1 — Sin portal de datos, solo email para todo
**Input:** "El usuario puede escribir a privacidad@empresa.com para pedir su información o eliminar su cuenta. No hay sección de privacidad en la app. Brasil."  
**Score:** +5 (ver datos por email) + +5 (descarga manual) + +5 (eliminar por soporte) + +5 (revocar por email) × 1.25 = min(40, 25) = **25 pts 🔴**

### U2 — Portal parcial (ve datos, no puede descargar ni borrar autónomamente)
**Input:** "En Configuración > Mi cuenta hay una sección 'Mis datos' que muestra el email, nombre y fecha de registro. Sin opción de descarga. Para eliminar la cuenta hay que escribir a soporte. Hay toggles de consentimiento en el mismo panel. Plazos no visibles. Colombia."  
**Score:** 0 (ver datos OK) + +10 (sin descarga) + +5 (eliminar por soporte) + 0 (revocación OK) + +5 (plazos no visibles) × 1.00 = min(40, 20) = **20 pts 🟡**

### U3 — Borrado lógico solamente
**Input:** "El usuario puede ir a Configuración > Eliminar cuenta. Al hacerlo, se ejecuta UPDATE users SET is_active = false. Los datos siguen en la base de datos. México."  
**Score:** 0 (ver datos asumido) + 0 (descarga asumida) + +5 (eliminación → is_active=false) + 0 (revocación asumida) × 1.00 = min(40, 5) = **5 pts 🟡** (+ nota de advertencia sobre el borrado real requerido)

### U4 — Portal conforme (GDPR)
**Input:** "En Cuenta > Privacidad: sección 'Mis datos' con resumen, botón 'Descargar todo (JSON)' con link válido 48h, botón 'Eliminar cuenta' con confirmación de qué se borra y qué se conserva (5 años por obligación fiscal), toggles por consentimiento revocables. Plazos visibles: 30 días para GDPR. Se genera link por email y se puede rastrear el estado. Usuarios en Alemania."  
**Score:** 0 en todas × 1.25 = **0 pts 🟢**

### U5 — Sin opción de eliminar cuenta
**Input:** "App fintech LATAM. El usuario puede ver sus datos de perfil. Hay descarga en CSV disponible. No existe opción de eliminar cuenta — la empresa argumenta que necesita conservar datos por obligación regulatoria financiera. Sin explicación visible al usuario. Colombia y Chile."  
**Score:** 0 (ver datos OK) + 0 (descarga OK) + +10 (sin eliminación, sin explicación visible de por qué) × 1.00 = min(40, 10) = **10 pts 🟡** (+ nota: la excepción regulatoria debe comunicarse al usuario, no simplemente no ofrecer el flujo)

---

*Skill del Pilar Frontend | Ver también: [/frontend-privacy/consentimiento](../consentimiento/SKILL.md) | [/derechos-usuario](../../derechos-usuario/SKILL.md) | [/audit](../../audit/SKILL.md)*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
