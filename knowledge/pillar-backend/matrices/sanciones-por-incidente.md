# Matriz: Sanciones por Tipo de Incidente
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **LegalSkillsLATAM** — Guía de referencia. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Los montos son aproximados y varían según tipo de cambio y año. Verificar con abogado.

---

## Sanciones máximas por jurisdicción

| Jurisdicción | Ley | Organismo | Sanción máxima | Equivalente USD (aprox.) |
|---|---|---|---|---|
| 🇧🇷 Brasil | LGPD | ANPD | R$50.000.000 por infracción o 2% del facturamiento en Brasil (el mayor) | ~$9M USD |
| 🇨🇴 Colombia | Ley 1581 | SIC | 2,000 SMLMV | ~$600K USD (varía con SMLMV) |
| 🇲🇽 México | LFPDPPP | INAI | 320,000 días de SMG + 3-6 años de prisión para casos graves | ~$2M USD + penal |
| 🇪🇺 GDPR | GDPR | Autoridades nacionales | €20.000.000 o 4% facturación mundial anual | ~$22M USD |
| 🇨🇱 Chile | Ley 21.719 | APDP | Pendiente regulación secundaria (ley vigente 2026) | — |
| 🇪🇨 Ecuador | LOPDP | DINARDAP | $500K USD máximo | $500K USD |
| 🇦🇷 Argentina | Ley 25.326 | AAIP | ARS variable | ~$100K USD (regulación antigua) |
| 🇵🇪 Perú | Ley 29733 | ANPD | 100 UIT (~$120K USD) | ~$120K USD |

---

## Sanciones por tipo de infracción

### Consentimiento inválido o ausente

| Jurisdicción | Calificación | Sanción esperada |
|---|---|---|
| GDPR | Muy grave (Art. 83.5) | Hasta €20M o 4% facturación |
| LGPD | Grave | Multa hasta R$50M + advertencia |
| Colombia | Grave (Art. 23) | Multa hasta 2,000 SMLMV |
| México | Grave | Multa + posible arresto en casos de datos sensibles |

### Transferencia internacional sin base legal

| Jurisdicción | Calificación | Sanción esperada |
|---|---|---|
| GDPR | Muy grave (Art. 83.5) | Hasta €20M o 4% facturación — fue la infracción del caso Meta (€1.2B) |
| LGPD | Grave | Multa hasta R$50M |
| Colombia | Grave | Multa hasta 2,000 SMLMV |
| México | Grave | Multa |

### Brecha de seguridad (data breach) sin notificación oportuna

| Jurisdicción | Plazo de notificación | Consecuencia por incumplimiento |
|---|---|---|
| GDPR | 72 horas a autoridad | Multa adicional por no notificar a tiempo |
| LGPD | "Prazo razoável" (~72h referencia de mercado) | Multa + publicación de infracción |
| Colombia | "Tan pronto como sea posible" | Multa |
| México | "A la brevedad posible" | Multa |
| Ecuador | 72 horas | Multa |

### Tratamiento de datos de menores sin autorización

| Jurisdicción | Calificación | Sanción esperada |
|---|---|---|
| GDPR | Muy grave | Hasta €20M |
| LGPD | Grave + publicidad | Multa + publicación de infracción |
| Colombia | Muy grave | Multa máxima |
| México | Muy grave + posible penal | Multa máxima + 3-6 años de prisión |

---

## Casos reales de referencia (multas impuestas)

| Caso | Empresa | Monto | Infracción |
|---|---|---|---|
| Meta (Irlanda, 2023) | Meta Platforms | €1.2B | Transferencia ilegal a EEUU (sin SCCs válidas) |
| Amazon (Luxemburgo, 2021) | Amazon | €746M | Publicidad personalizada sin base legal |
| WhatsApp (Irlanda, 2021) | WhatsApp | €225M | Falta de transparencia |
| Google (Francia, 2021) | Google LLC | €150M | Cookies — rechazar más difícil que aceptar |
| H&M (Alemania, 2020) | H&M | €35.2M | Monitoreo excesivo de empleados |
| Mercado Libre (Argentina, 2021) | ML | ARS variable | Brecha de datos sin notificación oportuna |
| iFood (Brasil, 2023) | iFood | Advertencia + compromiso | Ausencia de DPO y medidas correctivas |

---

## Impacto reputacional post-brecha

Más allá de las multas, una brecha de datos genera:

1. **Pérdida de confianza de usuarios** — estudios muestran que 60-80% de usuarios dejan de usar un servicio tras una brecha significativa
2. **Cobertura mediática negativa** — especialmente en Brasil y Colombia donde los reguladores publican los casos
3. **Litigios civiles de usuarios afectados** — en adición a la sanción regulatoria
4. **Suspensión de operaciones** — el GDPR y la LGPD permiten al regulador ordenar la suspensión temporal del tratamiento de datos

**Ejemplo práctico:** Una startup que procesa datos de salud de usuarios brasileños y sufre una brecha puede enfrentar: multa de la ANPD + publicación de la infracción + demandas civiles de usuarios + cobertura de prensa negativa. El costo total puede superar ampliamente el límite de R$50M.

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Abogado de data governance*  
*LegalSkillsLATAM — [DISCLAIMER.md](../../../DISCLAIMER.md)*
