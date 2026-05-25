---
name: derechos-usuario
description: Guía al desarrollador o equipo legal para responder correctamente una solicitud de derechos del titular de datos (ARCO, ARSOP, portabilidad, olvido). Genera el protocolo de respuesta técnica y los plazos aplicables según la jurisdicción. Úsala cuando un usuario solicite acceso, rectificación, borrado o portabilidad de sus datos.
argument-hint: "<tipo de solicitud> --pais <código>"
---

# /derechos-usuario — Protocolo de Respuesta a Derechos del Titular

> ⚠️ Esta skill es una guía informativa. No constituye asesoría jurídica. Ver DISCLAIMER.md.

Genera el protocolo técnico y operativo para responder una solicitud de derechos del titular de datos.

## Uso

```
/derechos-usuario $ARGUMENTS
```

**Ejemplos:**
- `/derechos-usuario "usuario pide borrar su cuenta y todos sus datos" --pais CO`
- `/derechos-usuario "usuario solicita exportar sus datos en formato descargable" --pais BR`
- `/derechos-usuario "usuario pide que corrijan su nombre en la base de datos" --pais MX`

## Tipos de solicitudes reconocidas

| Derecho | Nombre LATAM | Nombre GDPR/LGPD | Descripción |
|---|---|---|---|
| Acceso | Derecho de Acceso | Right of Access | El usuario quiere saber qué datos tienes de él |
| Rectificación | Rectificación | Rectification | El usuario quiere corregir un dato incorrecto |
| Cancelación/Supresión | Cancelación | Erasure / Derecho al Olvido | El usuario quiere que borres sus datos |
| Oposición | Oposición | Objection | El usuario se opone a un uso específico de sus datos |
| Portabilidad | *(no en todos los países)* | Portability | El usuario quiere llevarse sus datos a otro servicio |
| Limitación | *(no en todos los países)* | Restriction | El usuario pide suspender el tratamiento temporalmente |

## Proceso de Respuesta

### Paso 1: Identificar y Registrar

```
□ Fecha de recepción de la solicitud: ___________
□ Tipo de derecho solicitado: ___________
□ Jurisdicción aplicable (país del usuario): ___________
□ Canal de recepción: [email / formulario web / correo físico]
□ ¿El solicitante es el titular? → Verificar identidad
```

### Paso 2: Verificación de Identidad
Solicitar documento que acredite la identidad sin exigir información excesiva. No pedir más de lo razonablemente necesario.

### Paso 3: Plazos por Jurisdicción

| País | Plazo de Respuesta | Posible Prórroga | Autoridad |
|---|---|---|---|
| 🇨🇴 Colombia | 10 días hábiles para confirmar; 15 días hábiles para resolver | 8 días hábiles adicionales con aviso | SIC |
| 🇲🇽 México | 20 días hábiles | 20 días hábiles adicionales con justificación | INAI |
| 🇧🇷 Brasil | 15 días corridos | No especificada (buena fe) | ANPD |
| 🇨🇱 Chile | 2 días hábiles para confirmar; plazo razonable para resolver | — | CPLT / futuro Consejo |
| 🇦🇷 Argentina | 5 días hábiles | — | AAIP |
| 🇵🇪 Perú | 20 días hábiles | 20 días hábiles adicionales | ANPD Perú |
| 🇪🇨 Ecuador | 15 días | — | ANPD Ecuador |
| 🇪🇺 GDPR | 30 días corridos | +60 días con aviso motivado | DPA nacional |
| 🇺🇸 CCPA | 10 días hábiles para confirmar; 45 días corridos para resolver | +45 días con aviso | State AG |

### Paso 4: Acciones Técnicas Requeridas

**Para solicitud de ACCESO:**
```
□ Extraer todos los registros asociados al usuario en todas las tablas/colecciones
□ Incluir: datos directos, logs de actividad, datos inferidos, perfiles, historial de compras/uso
□ Formato: legible por humanos (PDF / email) o estructurado (JSON/CSV si pide portabilidad)
□ No incluir datos de terceros que puedan verse en el mismo registro
```

**Para solicitud de RECTIFICACIÓN:**
```
□ Actualizar el dato en la base de datos principal
□ Propagar la actualización a sistemas relacionados (CRM, analytics, backups activos)
□ Registrar el cambio en log de auditoría con fecha y referencia de la solicitud
□ Notificar a terceros que recibieron el dato incorrecto (si aplica)
```

**Para solicitud de BORRADO / OLVIDO:**
```
□ Identificar TODOS los sistemas donde existen datos del usuario
□ Evaluar si existe base legal para retener (ej: obligación fiscal de 5 años)
□ Borrado físico (DELETE real, no solo soft delete ni flag is_deleted=true)
□ Eliminar de backups activos o anonimizar en backups históricos
□ Eliminar de sistemas de terceros: notificar a cada sub-procesador
□ Documentar el borrado con evidencia
□ Responder al usuario confirmando la eliminación y qué datos se retienen por obligación legal
```

**Para solicitud de PORTABILIDAD (LGPD/GDPR):**
```
□ Exportar datos en formato estructurado, de uso común y lectura mecánica (JSON recomendado)
□ Incluir: datos proporcionados directamente por el usuario y datos generados por su uso
□ No incluir: datos puramente inferidos o analíticos propios de la empresa
□ Entregar vía descarga segura o transmisión directa a otro responsable si se solicita
```

## Formato de Output para el Equipo Técnico

```markdown
## 📋 Protocolo de Respuesta: [Tipo de Derecho]

**Solicitante:** [nombre / ID]
**Fecha de recepción:** [fecha]
**Jurisdicción:** [país]
**Plazo máximo de respuesta:** [fecha límite calculada]

### Checklist de Acciones Técnicas
[lista de tareas según el tipo de derecho]

### Sistemas a Intervenir
- Base de datos principal: [tabla/colección]
- Sistemas de terceros: [lista]
- Backups: [instrucción]

### Respuesta al Usuario
[Borrador de respuesta formal para enviar al titular]

### Excepciones Aplicables
[Si no se puede cumplir en todo o en parte, base legal para la negativa]
```

## Casos Especiales

- **Si el usuario es menor de edad:** La solicitud debe tramitarla su representante legal. Verificar tutela/custodia.
- **Si hay litigio activo:** Consultar con abogado antes de borrar datos que puedan ser prueba.
- **Si el dato está en backups cifrados de larga retención:** Documentar la imposibilidad técnica de borrado inmediato y establecer mecanismo para cuando el backup expire.
