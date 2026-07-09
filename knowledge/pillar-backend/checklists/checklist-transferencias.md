# Checklist Backend — Transferencias Internacionales y DPA con Terceros
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **Privacy Compliance Skills** — Guía operativa. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Validación: Abogado de data governance e internacional  
> Cadencia de revisión: Al agregar un nuevo proveedor o jurisdicción

Las transferencias internacionales son uno de los puntos de mayor riesgo para startups LATAM: casi todo sistema usa al menos AWS, GCP, Google Analytics o Stripe — todos en EEUU. Esto crea una transferencia internacional que necesita base legal cuando los usuarios están en Brasil, Colombia o la UE.

---

## Bloque 1: Inventario de Terceros

- [ ] Existe un **inventario documentado** de todos los proveedores/terceros que reciben datos de usuarios:

| Proveedor | Datos que recibe | País servidor | DPA firmado | Base legal transferencia |
|---|---|---|---|---|
| AWS us-east-1 | Todos los datos en la DB | EEUU | ✅ AWS DPA | SCCs / Data Privacy Framework |
| Google Analytics | Comportamiento, IP | EEUU | ✅ | Consentimiento (cookie) |
| Stripe | Datos de pago | EEUU | ✅ Stripe DPA | Ejecución de contrato |
| Segment | Comportamiento, email | EEUU | ✅ | Consentimiento o interés legítimo |
| _[agregar filas según el sistema]_ | | | | |

- [ ] El inventario se actualiza **antes** de integrar cualquier nuevo proveedor
- [ ] El equipo tiene un proceso de aprobación para nuevas integraciones con terceros

---

## Bloque 2: DPA (Data Processing Agreement) con Cada Proveedor

- [ ] Con cada proveedor que procesa datos de usuarios, existe un **DPA firmado** o aceptado digitalmente
  - La mayoría de proveedores grandes tienen DPA estándar disponible en su sitio: [AWS](https://aws.amazon.com/es/compliance/data-processing-addendum/), [GCP](https://cloud.google.com/terms/data-processing-addendum), [Stripe](https://stripe.com/es-419/legal/dpa), [Segment](https://segment.com/legal/dpa/)
- [ ] El DPA de cada proveedor especifica:
  - Qué datos trata el proveedor
  - Con qué finalidad
  - En qué país
  - Por cuánto tiempo
  - Cómo los elimina al terminar la relación
- [ ] Los DPA firmados están almacenados en un **repositorio interno accesible** al equipo legal

---

## Bloque 3: Transferencias Internacionales — Base Legal

### Para usuarios en Brasil (LGPD — Arts. 33-36)

- [ ] Para cada transferencia a EEUU u otro país sin adecuación LGPD:
  - **Opción A:** Cláusulas contractuales equivalentes a las SCCs (DPA del proveedor debe incluirlas)
  - **Opción B:** Consentimiento específico del usuario para la transferencia (difícil de mantener)
  - **Opción C:** Proveedor tiene certificación reconocida por la ANPD
- [ ] Brasil está en proceso de evaluación de adecuación ante la UE — verificar avances periódicamente

### Para usuarios en Colombia (Ley 1581 — Art. 26)

- [ ] Para cada transferencia a país sin nivel de protección adecuado:
  - **Requerido:** Autorización del titular + cláusulas contractuales que protejan sus datos
  - La SIC publica lista de países con nivel adecuado (verificar periodicidad)
- [ ] El titular fue informado de la transferencia en la política de privacidad

### Para usuarios en México (LFPDPPP — Arts. 36-37)

- [ ] Las transferencias están informadas en el aviso de privacidad del sistema
- [ ] Si la transferencia requiere consentimiento (datos sensibles, financieros): se obtuvo consentimiento expreso
- [ ] El tercero receptor asumió las mismas obligaciones que el responsable (mediante contrato)

### Para usuarios en la UE (GDPR — Arts. 44-49)

- [ ] Identificado el **mecanismo de transferencia** para cada país receptor:
  - Decisión de adecuación (lista de la Comisión Europea)
  - SCCs 2021 (Standard Contractual Clauses) — para EEUU y otros sin adecuación
  - BCRs (Binding Corporate Rules) — para transferencias intragrupo multinacional
- [ ] Para EEUU: verificar si el proveedor está certificado bajo el **EU-US Data Privacy Framework** (DPF, 2023)
- [ ] Las SCCs o el mecanismo usado están documentados en el DPA con cada proveedor

---

## Bloque 4: Localización de Datos (si aplica)

- [ ] Verificado si alguna jurisdicción exige **localización de datos** (que los datos se almacenen en el país):
  - Brasil: LGPD no exige localización, pero sectores específicos (salud, finanzas) pueden tener requisitos
  - Colombia, México: sin requisito de localización general
  - Rusia, China, Indonesia: tienen requisitos de localización — no cubiertos por este checklist
- [ ] Si hay requisitos de localización: la infraestructura de la región correspondiente está configurada en el proveedor cloud correcto

---

## Bloque 5: Revisión de Nuevos Proveedores

Antes de integrar cualquier nuevo SDK o servicio que reciba datos de usuarios:

- [ ] ¿Qué datos recibirá? ¿Son personales, sensibles o solo técnicos?
- [ ] ¿En qué país están sus servidores?
- [ ] ¿Tiene DPA disponible? ¿Lo he firmado/aceptado?
- [ ] ¿La transferencia tiene base legal para los usuarios de cada jurisdicción donde opero?
- [ ] ¿Está mencionado en la política de privacidad? (Si no, actualizar política antes de activar el SDK)
- [ ] ¿Es un SDK de analytics/advertising? → Requiere además: consentimiento de cookies en la UI

---

## Autodiagnóstico

| Bloques completados | Estado | Acción |
|---|---|---|
| 5/5 ✅ | 🟢 Transferencias bajo control | Actualizar al incorporar nuevos proveedores |
| 3–4/5 ✅ | 🟡 En progreso | Completar inventario (bloque 1) y DPAs (bloque 2) como prioridad |
| 1–2/5 ✅ | 🔴 Riesgo alto | Sin DPAs con AWS/GCP/proveedores principales es incumplimiento activo en Brasil y UE |
| 0/5 ✅ | 🚨 Crítico | Detener transferencias hasta obtener base legal — consultar abogado |

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance e internacional*  
*Ver contraparte frontend: [checklist-transparencia-ui.md](../../pillar-frontend/checklists/checklist-transparencia-ui.md) — Bloque 4*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
