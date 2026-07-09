# Checklist Backend — Ciclo de Vida de Datos: Retención, Purga y Backups
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **Privacy Compliance Skills** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Validación: Abogado de data governance  
> Cadencia de revisión: Trimestral

El ciclo de vida de datos define **cuánto tiempo se conserva cada dato, cómo se elimina y cómo se protege hasta su disposición**. Una mala gestión del ciclo de vida genera incumplimientos activos incluso en sistemas bien diseñados.

---

## Bloque 1: Inventario y Clasificación de Datos

- [ ] Existe un **mapa de datos** documentado: qué datos, en qué tabla/campo, qué nivel de sensibilidad, qué país de origen del usuario
- [ ] Cada campo en producción tiene asignado:
  - Categoría: público / personal / sensible / menores
  - Período de retención (en días o criterio de vencimiento)
  - Responsable de purga
- [ ] El mapa de datos se actualiza cuando se agregan nuevos campos o tablas

---

## Bloque 2: Política de Retención por Categoría

Plazos de referencia (verificar con abogado según el sector y jurisdicción específica):

| Tipo de dato | Colombia | México | Brasil (LGPD) | GDPR (UE) |
|---|---|---|---|---|
| Datos de sesión/logs | 6–12 meses | 6–12 meses | Mínimo necesario | Mínimo necesario |
| Datos personales de cuenta activa | Duración del servicio + 6 meses | Duración del servicio | Duración del servicio | Duración del servicio |
| Datos personales post-cancelación | 2 años (ref.) | 1–2 años (ref.) | Hasta extinción del consentimiento o finalidad | No especificado — mínimo necesario |
| Datos financieros | 5–10 años (contables) | 5–10 años | 5–10 años | 5–10 años |
| Datos de salud | Regulación sectorial | Regulación NOM | Regulación sectorial | 10+ años (regulación médica) |
| Datos de menores | Hasta mayoría de edad + 1 año | Hasta mayoría de edad | Hasta mayoría de edad | Hasta mayoría de edad |

- [ ] Existe una política interna que define el período de retención para cada categoría de dato en el sistema
- [ ] La política está documentada y es conocida por el equipo de ingeniería
- [ ] La política está reflejada en la política de privacidad visible al usuario

---

## Bloque 3: Purga Automática

- [ ] Los datos se eliminan **automáticamente** al vencer su período de retención — no depende de proceso manual
- [ ] Existe un **job o cron** documentado y monitoreado que ejecuta la purga periódica
- [ ] El job de purga tiene **logging** de qué registros eliminó, cuándo y por qué criterio
- [ ] El job de purga tiene **alertas de fallo** — si no corre, el equipo es notificado
- [ ] Se hacen **pruebas periódicas** del job de purga en un entorno de staging antes de producción
- [ ] El job de purga respeta las **excepciones legales**: datos que no se pueden borrar por obligación legal son marcados explícitamente con la razón y el plazo legal que los protege

---

## Bloque 4: Anonimización

- [ ] Existe un proceso de anonimización para datos que deben conservarse para análisis (sin identificación del titular)
- [ ] La anonimización es **irreversible** — no es simplemente enmascarar el campo con asteriscos
  - Técnicas válidas: eliminación de campos identificadores, generalización, perturbación estadística, k-anonymity
  - Técnicas insuficientes: solo ocultar el email pero dejar IP + timestamp + device_id (re-identificable)
- [ ] Los datos anónimos no contienen combinaciones de campos que permitan re-identificar al titular
- [ ] El proceso de anonimización está documentado y es auditable

---

## Bloque 5: Backups

- [ ] Los backups están configurados con frecuencia definida (diario para datos críticos, semanal mínimo)
- [ ] Los backups están **cifrados** con la misma política de cifrado que los datos en producción
- [ ] Los backups están en una ubicación **diferente al servidor principal** (otra región, otro proveedor)
- [ ] Existe un proceso documentado y probado de **restauración** — se hace recovery drill al menos una vez por año
- [ ] Los backups tienen un **SLA de retención** definido (cuánto tiempo se conserva cada backup)
- [ ] Los backups también están sujetos a la **política de retención de datos** — un backup no puede conservar datos más tiempo del que la política permite en producción
- [ ] Si hay usuarios de Brasil o UE: el país de almacenamiento del backup está evaluado para transferencias internacionales

---

## Bloque 6: Respuesta a Incidentes — Ciclo de Vida

- [ ] Existe un plan de respuesta a brechas de seguridad con roles y plazos definidos
- [ ] Documentados los plazos de notificación por jurisdicción:
  - Brasil (LGPD): **3 días hábiles** a ANPD y titulares (Resolução CD/ANPD nº 15/2024)
  - GDPR: 72h obligatorias a la Autoridad de Control
  - Colombia: "tan pronto como sea posible" a SIC
  - México: "a la brevedad posible" a la SABG (ex-INAI)
  - Perú: 48 horas (Reglamento D.S. 016-2024-JUS)
- [ ] El plan incluye el proceso para identificar **qué datos y qué usuarios** se vieron afectados
- [ ] Existe capacidad técnica para **revocar accesos** en cuestión de minutos ante un incidente
- [ ] Logs de acceso a datos sensibles conservados por mínimo **12 meses** para investigación post-incidente

---

## Autodiagnóstico

| Bloques completados | Estado | Acción |
|---|---|---|
| 6/6 ✅ | 🟢 Ciclo de vida controlado | Revisar trimestralmente |
| 4–5/6 ✅ | 🟡 En progreso | Completar purga automática (bloque 3) como prioridad |
| 2–3/6 ✅ | 🔴 Riesgo | Implementar inventario (bloque 1) y política de retención (bloque 2) antes de continuar |
| < 2/6 ✅ | 🚨 Crítico | Consultar con abogado — retención indefinida de datos es incumplimiento activo |

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
