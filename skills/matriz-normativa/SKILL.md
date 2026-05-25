---
name: matriz-normativa
description: Compara leyes de protección de datos de LATAM (Colombia, México, Brasil, Chile, Argentina, Perú, Ecuador) contra el GDPR europeo y el CCPA californiano en una dimensión específica. Úsala cuando un dev o CTO necesite entender las diferencias normativas concretas antes de diseñar un sistema multi-país o expandirse a mercados internacionales.
argument-hint: "<dimensión a comparar> [--paises <lista>]"
---

# /matriz-normativa — Comparativa de Leyes LATAM vs GDPR/CCPA

> ⚠️ Esta skill es una guía informativa. No constituye asesoría jurídica. Ver DISCLAIMER.md.

Genera una tabla comparativa de legislaciones de protección de datos para una dimensión legal específica.

## Uso

```
/matriz-normativa $ARGUMENTS
```

**Ejemplos:**
- `/matriz-normativa consentimiento`
- `/matriz-normativa "derechos del titular"`
- `/matriz-normativa sanciones --paises CO,BR,EU`
- `/matriz-normativa "transferencia internacional de datos"`
- `/matriz-normativa DPO`

## Dimensiones disponibles

| Dimensión | Descripción |
|---|---|
| `consentimiento` | Requisitos para obtener autorización válida del titular |
| `derechos` | Derechos ARCO y equivalentes (portabilidad, olvido) |
| `sanciones` | Multas máximas y autoridades regulatorias |
| `dpo` | Requisito de Delegado de Protección de Datos |
| `transferencia` | Reglas para transferir datos fuera del país |
| `notificacion-brecha` | Plazos y obligaciones ante incidentes de seguridad |
| `bases-legales` | Bases legales válidas para el tratamiento |
| `menores` | Protección especial para datos de niños y adolescentes |

## Proceso

1. Identificar la dimensión solicitada.
2. Consultar las reglas en `rules/countries/` y `rules/international/` para cada jurisdicción.
3. Generar la tabla comparativa con impacto técnico para el desarrollador.

## Formato de Output

```markdown
## 🌎 Matriz Normativa: [Dimensión]

| Aspecto | CO 🇨🇴 | MX 🇲🇽 | BR 🇧🇷 | CL 🇨🇱 | AR 🇦🇷 | PE 🇵🇪 | EC 🇪🇨 | EU GDPR 🇪🇺 | US CCPA 🇺🇸 |
|---|---|---|---|---|---|---|---|---|---|
| [aspecto 1] | | | | | | | | | |
| [aspecto 2] | | | | | | | | | |

### 🔴 Discriminadores de Rigor (qué activa el multiplicador ×1.25)
[Listado de diferencias que hacen que Brasil o Europa sean más exigentes]

### 💡 Impacto Técnico para el Desarrollador
[Traducción práctica: qué cambios de código o arquitectura implica cada diferencia]

### Referencias Normativas
- [Ley] Art. [X] — [descripción]
```

## Datos curados por dimensión

### CONSENTIMIENTO
- **LATAM estándar (CO/MX/CL/AR/PE/EC):** Previo, expreso e informado. Generalmente aceptan un checkbox con enlace a política de privacidad.
- **Brasil (LGPD):** Debe ser específico para cada finalidad. Un solo "Acepto" no es suficiente si hay múltiples usos. Art. 8 LGPD.
- **GDPR:** Específico, informado, libre e inequívoco. Granular por finalidad. Tan fácil revocar como otorgar. Art. 7 GDPR.
- **Impacto técnico:** Requiere UI con toggles individuales por finalidad, no un único botón.

### DERECHOS DEL TITULAR
- **LATAM estándar:** Derechos ARCO (Acceso, Rectificación, Cancelación/Supresión, Oposición).
- **Brasil (LGPD):** ARCO + Portabilidad + Información sobre compartición con terceros + Revisión de decisiones automatizadas. Art. 18 LGPD.
- **GDPR:** ARCO + Portabilidad + Olvido (supresión definitiva) + Limitación del tratamiento + No ser objeto de decisiones automatizadas. Art. 15-22 GDPR.
- **Impacto técnico:** Requiere API de exportación en JSON estructurado y script de borrado físico de registros (no solo soft delete).

### SANCIONES
- **Colombia:** Hasta 2.000 SMLMV (~USD 600K). Autoridad: SIC.
- **México:** Hasta 32 millones MXN (~USD 1.6M). Autoridad: INAI.
- **Brasil:** Hasta 2% de la facturación en Brasil, límite 50M BRL (~USD 10M). Autoridad: ANPD.
- **GDPR:** Hasta 4% de la facturación global anual o 20M EUR (lo que sea mayor). Autoridad: DPA nacional.
- **Impacto técnico:** El GDPR y LGPD activan el multiplicador ×1.25 por el riesgo financiero corporativo.

### DPO / DELEGADO
- **LATAM estándar:** Generalmente recomendado, no siempre obligatorio (varía por sector).
- **Brasil (LGPD):** Obligatorio para responsables (art. 41 LGPD). Puede ser persona física o jurídica.
- **GDPR:** Obligatorio si: autoridad pública, monitoreo sistemático a gran escala, o tratamiento a gran escala de datos sensibles. Art. 37 GDPR.
- **Impacto técnico:** Requiere asignar rol en el sistema con permisos de auditoría y punto de contacto con autoridad regulatoria.
