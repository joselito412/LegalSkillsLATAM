# Inventario de Marcos Normativos — Privacy Compliance Skills
## Alcance Actual y Estado de Validación

**Fecha:** 2026-06-18  
**Preparado por:** Claude  
**Responsable:** Jose Guillermo Vasquez

---

## 1. Tabla Resumen

| # | Región | País | Ley Principal | Código | Año | Vigencia | Prioridad | Estado Actual |
|---|---|---|---|---|---|---|---|---|
| 1 | 🌎 LATAM | Brasil | Lei Geral de Proteção de Dados (LGPD) | Lei 13.709/2018 | 2018 | ✅ Vigente (2020+) | 🔴 **ALTA** | ⏳ Parcialmente validado |
| 2 | 🌎 LATAM | Colombia | Ley de Protección de Datos Personales | Ley 1581/2012 | 2012 | ✅ Vigente | 🔴 **ALTA** | ⏳ Parcialmente validado |
| 3 | 🌎 LATAM | México | Ley Federal de Protección de Datos Personales en Posesión de Sujetos Obligados | LFPDPPP 2010 | 2010 | ✅ Vigente | 🔴 **ALTA** | ⏳ Parcialmente validado |
| 4 | 🌎 LATAM | Chile | Ley de Protección de Datos Personales | Ley 19.628 | 1999 | ✅ Vigente (Ley 21.096 enmienda 2023) | 🟡 **MEDIA** | ❌ No validado — Pendiente enmiendas |
| 5 | 🌎 LATAM | Argentina | Ley de Protección de Datos Personales | Ley 25.326 | 2000 | ✅ Vigente (Proyecto de reforma 2023+) | 🟡 **MEDIA** | ❌ No validado |
| 6 | 🌎 LATAM | Perú | Ley de Protección de Datos Personales | Ley 29.733 | 2011 | ✅ Vigente | 🟡 **MEDIA** | ❌ No validado |
| 7 | 🌎 LATAM | Ecuador | Ley Orgánica de Protección de Datos Personales | LOPDP | 2021 | ✅ Vigente (implementación en progreso) | 🟡 **MEDIA** | ❌ No validado |
| 8 | 🌐 EU | Unión Europea | Reglamento General de Protección de Datos | GDPR 2016/679 | 2016 | ✅ Vigente (2018+) | 🟡 **MEDIA** | ✅ Referencia (no validación profunda) |
| 9 | 🌐 US | Estados Unidos | California Consumer Privacy Act / Consumer Privacy Rights Act | CCPA/CPRA | 2018/2020 | ✅ Vigente | 🟡 **MEDIA** | ❌ No incluido (Parcial en roadmap) |

**Total en alcance:** 9 marcos  
**Validados:** 0 (solo tabla editorial)  
**En proceso:** 3 (BR, CO, MX)  
**Pendientes:** 4 (CL, AR, PE, EC)  
**Referentes:** 1 (GDPR)  

---

## 2. Desglose por Región

### 🔴 GRUPO A: PRIORIDAD ALTA — Validación Inmediata

#### Brasil — LGPD (Lei 13.709/2018)

| Dimensión | Detalle |
|---|---|
| **Ley** | Lei Geral de Proteção de Dados Pessoais (LGPD) |
| **Número** | Lei 13.709/2018 |
| **Vigencia** | Desde 2020-09-18 (tecnología); desde 2021-08-01 (sanciones) |
| **Texto oficial** | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm |
| **Autoridad** | Autoridade Nacional de Proteção de Dados (ANPD) — https://www.gov.br/anpd |
| **Rigor** | 🔥 **Muy alto** — Alineada con GDPR, "techo regulatorio" de LATAM |
| **Alcance en proyecto** | ✅ Completo — Incluido en `brasil.json`, skills, checklists |
| **Claims editorizales** | ~25 claims en `SOURCES-VALIDATION.md` |
| **Estado de validación** | ⏳ **Pendiente** — Tabla editorial sin confirmar por abogado |
| **Próximos pasos** | Validar Art. 5° (datos sensibles), Art. 11 (consentimiento), Art. 18 (plazos), Art. 41 (DPO), Art. 52 (sanciones) |
| **Resoluciones clave** | CD/ANPD nº 2/2022 (plazos de respuesta a derechos) |
| **Notas** | ANPD fue reconocida como autoridad independiente en 2022. En 2023 Brasil solicitó reconocimiento de adecuación ante UE. |

**Principales cambios en revisión (2024–2026):**
- Enmiendas sobre consentimiento de menores (Art. 14)
- Nuevas orientaciones ANPD sobre transferencias internacionales (SCCs vigentes)
- Casos emblemáticos de sanciones (ej: WhatsApp, Google)

---

#### Colombia — Ley 1581/2012

| Dimensión | Detalle |
|---|---|
| **Ley** | Ley Estatutaria de Protección de Datos Personales |
| **Número** | Ley 1581/2012 + Decreto Reglamentario 1377/2013 |
| **Vigencia** | Desde 2013-01-18 |
| **Texto oficial** | https://www.normograma.gov.co/normograma/compiladolegislacion/2012_ley_1581.htm |
| **Autoridad** | Superintendencia de Industria y Comercio (SIC) — https://www.sic.gov.co |
| **Rigor** | 🟡 **Alto** — Menos exigente que LGPD; base de LATAM pre-LGPD |
| **Alcance en proyecto** | ✅ Completo — Incluido en `colombia.json`, skills, checklists |
| **Claims editorizales** | ~15 claims en `SOURCES-VALIDATION.md` |
| **Estado de validación** | ⏳ **Pendiente** — Tabla editorial sin confirmar |
| **Próximos pasos** | Validar Art. 5° (sensibles), Art. 14–15 (plazos ARCO), Art. 9° (consentimiento), Art. 25 (registro RNBD — verificar vigencia) |
| **Decretos complementarios** | Decreto 1377/2013 (habeas data; detalla derechos) |
| **Notas** | Ley más antigua pero sigue siendo referente regional. Debate en 2024–2025 sobre posible reforma para alineación con LGPD. |

**Puntos de atención:**
- ⚠️ Registro de bases de datos ante SIC (RNBD) — ¿sigue obligatorio? ¿multas vigentes?
- ⚠️ Diferencia entre "Responsable" y "Encargado" vs modelo GDPR
- ✅ Plazos de acceso (10 hábiles + prórroga 5) y reclamos (15 hábiles + prórroga 8) están bien definidos

---

#### México — LFPDPPP (2010)

| Dimensión | Detalle |
|---|---|
| **Ley** | Ley Federal de Protección de Datos Personales en Posesión de Sujetos Obligados |
| **Número** | LFPDPPP 2010 + Reglamento (2011) |
| **Vigencia** | Desde 2010-07-05 |
| **Texto oficial DOF** | https://www.dof.gob.mx/nota_detalle.php?codigo=5150631&fecha=05/07/2010 |
| **Reglamento DOF** | https://www.dof.gob.mx/nota_detalle.php?codigo=5280098&fecha=21/12/2011 |
| **Autoridad** | Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI) — https://home.inai.org.mx |
| **Rigor** | 🟡 **Medio-Alto** — Enfoque en "sujetos obligados" (gobierno, instituciones públicas) |
| **Alcance en proyecto** | ✅ Completo — Incluido en `mexico.json`, skills, checklists |
| **Claims editorizales** | ~13 claims en `SOURCES-VALIDATION.md` |
| **Estado de validación** | ⏳ **Pendiente** — Tabla editorial sin confirmar |
| **Próximos pasos** | Validar Art. 3 (datos sensibles), Art. 8–9 (consentimiento tácito vs expreso), Art. 32 (plazos ARCO: 20 + 15 días), Art. 63–67 (sanciones) |
| **Marco complementario** | Existe también la Ley de Protección de Datos Personales para el Sector Privado (LPDPSP 2018) — **NO incluida actualmente** |
| **Notas** | LFPDPPP es para sector público. Sector privado tiene ley separada (2018) — requiere cobertura por separado. INAI es autoridad unificada desde reforma 2018. |

**Puntos de atención:**
- ⚠️ Proyecto cubre solo LFPDPPP (sector público); se recomienda incluir LPDPSP (sector privado) en v0.3
- ⚠️ Sanciones: referencia a "SMG del Distrito Federal" — **desactualizada** (CDMX es ahora entidad con SMG variable)
- ⚠️ Sanciones penales (Art. 67): "3–6 años de prisión" — verificar condiciones (¿"con ánimo de lucro" obligatorio?)
- ✅ Plazos ARCO (20 días para respuesta, 15 para efectivizar) están bien definidos
- ✅ Distinción entre consentimiento tácito (datos no-sensibles) vs expreso (datos sensibles) es clara en Art. 8–9

**Cambios esperados (2026+):**
- Reforma en discusión para alineación con GDPR/LGPD (más exigencias en seguridad)
- Mayores multas esperadas

---

### 🟡 GRUPO B: PRIORIDAD MEDIA — Validación en v0.3

#### Chile — Ley 19.628 (con enmienda Ley 21.096)

| Dimensión | Detalle |
|---|---|
| **Ley** | Ley de Protección de Datos Personales |
| **Número** | Ley 19.628 (1999) + Ley 21.096 (2023, enmienda) |
| **Vigencia (pre-enmienda)** | Desde 1999 |
| **Vigencia (post-enmienda)** | Ley 21.096 aprobada 2023 (implementación en progreso 2024–2026) |
| **Texto oficial** | https://bcn.cl/2f6k5 (Biblioteca del Congreso Nacional) |
| **Autoridad** | SEREMI (competencia territorial) + SUBTEL (para datos de telecomunicaciones) |
| **Rigor** | 🟡 **Medio** — Actualización importante con Ley 21.096 |
| **Alcance en proyecto** | ⚠️ **Parcial** — Incluido pero sin validación de Ley 21.096 |
| **Claims editorizales** | ~10 claims (SIN actualizar a 21.096) |
| **Estado de validación** | ❌ **No validado** — Hay riesgo de claims desactualizados |
| **Próximos pasos** | Revisar cambios de Ley 21.096: habeas data (ahora constitucional), consentimiento, derechos, sanciones |
| **Notas** | Enmienda fue ambiciosa. Chile ahora tiene derecho a protección de datos en Constitución (post-reforma 2022). Transposición aún en progreso. |

**Cambios Ley 21.096 (2023) a revisar:**
- ✅ Consentimiento: ahora más similar a GDPR (expreso, informado, revocable)
- ✅ Nuevos derechos: portabilidad, oposición (similar GDPR)
- ⚠️ Sanciones: aumentadas (multas en UF — Unidad de Fomento)
- ⚠️ DPO: requisitos nuevos (similar a GDPR)
- ⚠️ Transferencias internacionales: reguladas de forma más estricta

**Recomendación:** Diferir validación hasta que implementación de Ley 21.096 esté clara (finales 2026).

---

#### Argentina — Ley 25.326

| Dimensión | Detalle |
|---|---|
| **Ley** | Ley de Protección de Datos Personales |
| **Número** | Ley 25.326 (2000) |
| **Vigencia** | Desde 2001 |
| **Texto oficial** | http://servicios.infoleg.gob.ar/infolegInternet/anexos/60000/64790/texactley25326.htm |
| **Autoridad** | Autoridad de Control de Datos Personales (Órgano de Control, bajo Juzgado Nacional) |
| **Rigor** | 🟡 **Medio** — Ley antigua, en debate de reforma desde 2023 |
| **Alcance en proyecto** | ❌ **Parcial** — Mencionado pero no profundizado |
| **Claims editorizales** | ~5 claims |
| **Estado de validación** | ❌ **No validado** — Reforma en progreso, riesgo alto |
| **Próximos pasos** | Aguardar resolución de reforma legislativa (2025–2026); mientras tanto, usar como referencia secundaria |
| **Notas** | Proyecto de reforma en Congreso (2023–2026) propone alineación con GDPR. Hasta entonces, ley vigente de 2000 es referente, pero incierta. |

**Estado actual:**
- Reforma propone: consentimiento tipo GDPR, derechos nuevos (portabilidad), sanciones mayores
- Hasta entonces, ley actual es genérica

**Recomendación:** Priorizar Brasil/Colombia/México en v0.2; Argentina en v0.3 o cuando reforma sea clara.

---

#### Perú — Ley 29.733

| Dimensión | Detalle |
|---|---|
| **Ley** | Ley de Protección de Datos Personales |
| **Número** | Ley 29.733 (2011) |
| **Vigencia** | Desde 2011 |
| **Texto oficial** | http://www.leyes.congreso.gob.pe/Documentos/2011_2016/Leyes/29733.pdf |
| **Autoridad** | Dirección General de Protección de Datos Personales (DGPDP, dentro de MINJUS) |
| **Rigor** | 🟡 **Medio** — Similar a Colombia (pre-LGPD) |
| **Alcance en proyecto** | ❌ **Parcial** — Mención básica |
| **Claims editorizales** | ~5 claims |
| **Estado de validación** | ❌ **No validado** |
| **Próximos pasos** | Incluir en v0.3, validar Art. 2° (datos sensibles), derechos ARCO |
| **Notas** | Ley estable pero menos activa regulatoriamente que Brasil. Casos judiciales limitados. |

---

#### Ecuador — LOPDP (2021)

| Dimensión | Detalle |
|---|---|
| **Ley** | Ley Orgánica de Protección de Datos Personales |
| **Número** | LOPDP (2021) |
| **Vigencia** | Desde 2021 (implementación en transición 2021–2024) |
| **Texto oficial** | https://www.correosdelecuador.gob.ec/regulacion/ (portal oficial) |
| **Autoridad** | Autoridad de Protección de Datos Personales (APDP, en construcción) |
| **Rigor** | 🔥 **Muy alto** — Ley nueva, alineada con GDPR/LGPD |
| **Alcance en proyecto** | ❌ **Parcial** — Mención básica, sin profundidad |
| **Claims editorizales** | ~5 claims |
| **Estado de validación** | ❌ **No validado** — Autoridad aún se estructura (APDP no operativa hasta 2024) |
| **Próximos pasos** | Aguardar consolidación de APDP (2024–2025); luego validar como prioridad 🔴 Alta en v0.3 |
| **Notas** | LOPDP es muy reciente y ambiciosa (casi idéntica a GDPR). Pero implementación lenta: APDP aún se estructura, no hay resoluciones que clarifiquen algunos puntos. |

**Recomendación:** Diferir validación hasta 2026–2027 cuando APDP esté operativa y haya resoluciones de implementación.

---

### 🌐 GRUPO C: REFERENTES INTERNACIONALES

#### Unión Europea — GDPR (Reglamento 2016/679)

| Dimensión | Detalle |
|---|---|
| **Ley** | Reglamento General de Protección de Datos (GDPR) |
| **Número** | Reglamento (UE) 2016/679 |
| **Vigencia** | Desde 2016-04-27 (adopción); desde 2018-05-25 (entrada en vigor) |
| **Texto oficial** | https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679 |
| **Directrices EDPB** | https://edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_es |
| **Autoridad** | Autoridad de Control de cada Estado Miembro + EDPB (cooperación) |
| **Rigor** | 🔥 **Máximo** — Estándar regulatorio más exigente del mundo |
| **Alcance en proyecto** | ✅ **Completo** — Incluido en `gdpr.json`, usado como contraste en skills y matrices |
| **Claims editorizales** | ~15 claims |
| **Estado de validación** | ✅ **Referencia validada** — No requiere validación profunda (ya conocido, bien documentado) |
| **Rol en proyecto** | Benchmark de exigencia máxima; usado para comparación en `/matriz-normativa` |
| **Notas** | GDPR es el referente global. Muchas leyes de LATAM (LGPD, LOPDP) están diseñadas en alineación con GDPR. El proyecto lo usa como espejo, no como regulación aplicable. |

**Muestreo de validación sugerido (no exhaustivo):**
- ✅ Art. 6 (6 bases legales) vs Art. 9 (10 excepciones para datos especiales)
- ✅ Art. 12 (plazos: 30 días + 60 adicionales)
- ✅ Art. 33 (notificación de brechas: 72 horas)
- ✅ Art. 83 (sanciones: €20M o 4% facturación)

---

#### Estados Unidos — CCPA/CPRA (California)

| Dimensión | Detalle |
|---|---|
| **Ley** | California Consumer Privacy Act (CCPA) + California Privacy Rights Act (CPRA) |
| **Número** | CCPA (2018) + CPRA (2020) |
| **Vigencia** | CCPA desde 2020-01-01; CPRA desde 2023-01-01 |
| **Texto oficial** | https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201720180AB375 |
| **Autoridad** | California Attorney General + California Privacy Protection Agency (desde 2023) |
| **Rigor** | 🟡 **Medio-Alto** — Más permisivo que GDPR/LGPD, pero con sanciones civiles significativas |
| **Alcance en proyecto** | ❌ **No incluido actualmente** — Mencionado en roadmap como "v0.3+" |
| **Claims editorizales** | 0 (no incluido) |
| **Estado de validación** | ❌ **No aplicable aún** |
| **Rol esperado** | Contraste con estándar estadounidense (vs. europeo/LATAM) |
| **Notas** | CCPA/CPRA es importante para startups LATAM que expanden a EE.UU. Incluir en v0.3 es razonable. |

**Diferencias clave CCPA/CPRA vs GDPR:**
- Menos exigente en consentimiento (opt-out en lugar de opt-in para algunas finalidades)
- Derechos similares a GDPR (acceso, borrado, portabilidad, oposición)
- Sanciones civiles, no administrativas (diferente modelo)
- No requiere DPO (pero CPRA introduce "Chief Privacy Officer")

---

## 3. Matriz de Completitud por Tema

Para cada jurisdicción, estatus de cobertura:

| Tema | Brasil | Colombia | México | Chile | Argentina | Perú | Ecuador | GDPR | CCPA |
|---|---|---|---|---|---|---|---|---|---|
| **Datos sensibles** | ✅ | ✅ | ✅ | ⚠️ 21.096 | ⚠️ Reforma | ⚠️ | ✅ | ✅ | ⚠️ |
| **Consentimiento** | ✅ | ✅ | ✅ | ⚠️ 21.096 | ⚠️ Reforma | ⚠️ | ✅ | ✅ | ⚠️ |
| **Plazos ARCO** | ✅ | ✅ | ✅ | ⚠️ 21.096 | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |
| **Sanciones** | ✅ | ✅ | ⚠️ (SMG desactualizado) | ⚠️ 21.096 | ⚠️ | ⚠️ | ✅ | ✅ | ❌ |
| **DPO / Responsable** | ✅ | ✅ | ✅ | ⚠️ 21.096 | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |
| **Transferencias Intl.** | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ | ❌ |
| **Menores de edad** | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ | ⚠️ |
| **Brecha de datos** | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ | ❌ |

**Leyenda:**
- ✅ Cubierto y validado
- ⚠️ Cubierto pero requiere validación o aclaración
- ❌ No cubierto

---

## 4. Recomendaciones Inmediatas

### Para v0.2 (Próximas 4 semanas)

✅ **Hacer:**
1. Validar claims de Brasil (LGPD) — 25 claims
2. Validar claims de Colombia (Ley 1581) — 15 claims
3. Validar claims de México (LFPDPPP) — 13 claims
4. Muestreo GDPR (5 claims de contraste)
5. Actualizar `SOURCES-VALIDATION.md` con ✅/⚠️/❌

🚫 **NO hacer:**
- Validar Chile sin Ley 21.096 (esperar 2026)
- Validar Argentina sin reforma clara (esperar 2025–2026)
- Incluir CCPA aún (roadmap v0.3)

---

### Para v0.3 (Roadmap 4–8 meses)

📋 **Considerar:**
1. Chile: esperar SEREMI + jurisprudencia de Ley 21.096
2. Argentina: esperar reforma legislativa
3. Perú: validar Ley 29.733
4. Ecuador: validar LOPDP (cuando APDP sea operativa)
5. CCPA: incluir como contraste estadounidense
6. Actualizar México: incluir LPDPSP (sector privado, no solo público)

---

## 5. Contactos y Recursos Sugeridos

### Autoridades Regulatorias por País

| País | Autoridad | Web | Email de contacto |
|---|---|---|---|
| Brasil | ANPD | https://www.gov.br/anpd | consultas@anpd.gov.br |
| Colombia | SIC | https://www.sic.gov.co | (portal de contacto) |
| México | INAI | https://home.inai.org.mx | (portal de contacto) |
| Chile | SEREMI | Regional (por región) | (regional) |
| Argentina | ACDP | (estructura antigua; reforma esperada) | (en transición) |
| Perú | DGPDP | http://proteccion.minjus.gob.pe | (portal) |
| Ecuador | APDP | En construcción (2024–2026) | TBD |

---

## 6. Próximos Pasos

**Semana 1 (Jose + Claude):**
- [ ] Revisar y aprobar `PLAN-VALIDACION-FUENTES-2026-06.md`
- [ ] Crear `VALIDATION-INVENTORY.md` con lista completa de claims
- [ ] Asignar dueño a cada país (Brasil, Colombia, México)

**Semana 2 (Claude + abogado externo):**
- [ ] Iniciar validación Brasil (LGPD) — Fase 2 del plan
- [ ] Contactar red legal LATAM para revisión de pares

**Semanas 3–4:**
- [ ] Continuar validación Colombia + México
- [ ] Auditoría JSON en paralelo (Fase 3)

---

**Documento preparado por:** Claude  
**Para:** Jose Guillermo Vasquez  
**Fecha:** 2026-06-18  
**Estado:** 📋 Borrador — Pendiente aprobación

*Privacy Compliance Skills — Inventario de Marcos Normativos*
