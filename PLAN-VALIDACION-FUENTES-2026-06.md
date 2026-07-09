# Plan de Validación de Fuentes Legales y Recomendaciones de Arquitectura
## Privacy Compliance Skills — Trabajo de Calidad de Contenido

**Preparado por:** Claude (asistente IA)  
**Fecha:** 2026-06-18  
**Responsabilidad editorial:** Jose Guillermo Vasquez  
**Estado:** 📋 En planificación (pendiente aprobación)

---

## 1. Resumen Ejecutivo

Este plan estructura el trabajo de **validación legal exhaustiva** del proyecto Privacy Compliance Skills en tres ejes:

1. **Eje Normativo**: Validar que cada "claim" (afirmación legal) en el proyecto está respaldado por ley primaria
2. **Eje de Reglas**: Revisar que las reglas JSON codifican correctamente los requisitos legales
3. **Eje de Arquitectura**: Asegurar que las recomendaciones de desarrollo son factibles y completas

**Entregables esperados:**
- Matriz de validación normativa por país (✅/⚠️/❌ por claim)
- Reporte de brechas en reglas JSON
- Documento de recomendaciones arquitectónicas verificadas
- Plan de remediación (si aplica)

**Timeline estimado:** 3–4 semanas (con revisión legal externa)

---

## 2. Alcance: Marcos Normativos Incluidos

El proyecto actualmente cubre **10 jurisdicciones** en dos categorías:

### 🌎 LATAM (Regulación Regional)

| País | Ley Principal | Año | Alcance del Proyecto | Prioridad |
|---|---|---|---|---|
| 🇧🇷 Brasil | Lei Geral de Proteção de Dados (LGPD) | 2018 | Completo | 🔴 Alta |
| 🇨🇴 Colombia | Ley 1581 / Ley 1652 (Decreto 1377) | 2012 | Completo | 🔴 Alta |
| 🇲🇽 México | Ley Federal de Protección de Datos Personales en Posesión de Sujetos Obligados (LFPDPPP) | 2010 | Completo | 🔴 Alta |
| 🇨🇱 Chile | Ley 19.628 (modificada por Ley 21.096) | 1999 | Parcial — pendiente validación de enmiendas 2023+ | 🟡 Media |
| 🇦🇷 Argentina | Ley 25.326 (Ley de Protección de Datos Personales) | 2000 | Parcial — en revisión | 🟡 Media |
| 🇵🇪 Perú | Ley 29733 | 2011 | Parcial | 🟡 Media |
| 🇪🇨 Ecuador | Ley Orgánica de Protección de Datos Personales (LOPDP) | 2021 | Parcial | 🟡 Media |

### 🌐 Referentes Internacionales (Contraste/Benchmarking)

| Jurisdicción | Ley Principal | Alcance del Proyecto | Uso |
|---|---|---|---|
| 🇪🇺 Unión Europea | Reglamento General de Protección de Datos (GDPR 2016/679) | Completo | Referencia de exigencia máxima |
| 🇺🇸 Estados Unidos | California Consumer Privacy Act (CCPA) / CPRA | Parcial | Referencia de estándar estadounidense |
| 🇬🇧 Reino Unido | UK GDPR / Data Protection Act 2018 | No incluido actualmente | Posible expansión futura |

**Total: 7 países LATAM + 2 referentes internacionales = 9 marcos en alcance actual**

---

## 3. Estructura del Análisis: Tres Ejes de Validación

### 3.1 EJE 1: VALIDACIÓN DE FUENTES PRIMARIAS (Semanas 1–2)

**Objetivo:** Confirmar que cada claim legal está respaldado por texto de ley.

**Método:** 
- Revisar `docs/SOURCES-VALIDATION.md` (tabla existente)
- Para cada row: localizar artículo en ley oficial, confirmar o corregir
- Registrar hallazgos: ✅ Confirmado / ⚠️ Matiz / ❌ Incorrecto

**Documentos primarios a revisar (en orden de prioridad):**

**BRASIL (LGPD — Lei 13.709/2018)**
- Texto oficial: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Autoridad: ANPD (https://www.gov.br/anpd)
- Resoluciones complementarias: CD/ANPD nº 2/2022 (plazos de respuesta a derechos)
- Claims clave a validar: 
  - Art. 5°, XIV: definición de datos sensibles
  - Art. 11: consentimiento específico y destacado
  - Art. 18: plazos de respuesta a derechos
  - Art. 41: obligatoriedad de DPO
  - Art. 48: notificación de brechas ("prazo razoável")
  - Art. 52, II: sanciones máximas (R$ 50M)

**COLOMBIA (Ley 1581/2012)**
- Texto oficial: https://www.normograma.gov.co/normograma/compiladolegislacion/2012_ley_1581.htm
- Autoridad: SIC (https://www.sic.gov.co)
- Decreto reglamentario: Decreto 1377/2013
- Claims clave:
  - Art. 5°: definición de datos sensibles
  - Art. 14–15: plazos de acceso y rectificación (10+5 días, 15+8 días)
  - Art. 9°: consentimiento previo, expreso e informado
  - Art. 25: registro ante SIC (RNBD) — verificar vigencia
  - Art. 26: transferencias internacionales

**MÉXICO (LFPDPPP 2010)**
- Texto oficial DOF: https://www.dof.gob.mx/nota_detalle.php?codigo=5150631&fecha=05/07/2010
- Reglamento: https://www.dof.gob.mx/nota_detalle.php?codigo=5280098&fecha=21/12/2011
- Autoridad INAI: https://home.inai.org.mx
- Claims clave:
  - Art. 3, fracción VI: definición de datos sensibles
  - Art. 8–9: consentimiento (tácito para no-sensibles, expreso para sensibles)
  - Art. 16: aviso de privacidad obligatorio
  - Art. 32: plazos ARCO (20 días para respuesta, 15 para efectivización)
  - Art. 63–67: sanciones civiles y penales

**CHILE (Ley 19.628 modificada)**
- Texto oficial: https://bcn.cl/2f6k5 (portal Biblioteca del Congreso)
- Ley 21.096 (enmienda 2023): verificar cambios a consentimiento y derechos
- Autoridad: SEREMI, SUBTEL
- Claims clave: verificar alineación con enmiendas recientes

**ARGENTINA, PERÚ, ECUADOR** — Revisión secundaria (Media prioridad)

**GDPR (Referente europeo)**
- Texto oficial EUR-Lex: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679
- EDPB Guidelines: https://edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_es
- No validar exhaustivamente (es referente conocido), sí cotejar claims de contraste

---

### 3.2 EJE 2: AUDITORÍA DE REGLAS JSON (Semana 2–3)

**Objetivo:** Verificar que los penalizadores, bases legales y categorías de datos en los archivos JSON son correctos y completos.

**Método:**
- Cargar cada archivo de reglas (`brasil.json`, `colombia.json`, `mexico.json`, `gdpr.json`)
- Mapear cada penalizador a su origen legal (artículo/ley)
- Validar que las consecuencias (puntos de penalización) son proporcionales
- Verificar que el campo `pillar` (FE/BE/BOTH) está bien etiquetado
- Detectar gaps: ¿hay requisitos legales sin regla JSON?

**Archivos a revisar:**

| Archivo | Tamaño | Prioridad | Estado |
|---|---|---|---|
| `cli/rules/countries/brasil.json` | ~1.2 KB | 🔴 Alta | ✅ Existe |
| `cli/rules/countries/colombia.json` | ~1.0 KB | 🔴 Alta | ✅ Existe |
| `cli/rules/countries/mexico.json` | ~1.1 KB | 🔴 Alta | ✅ Existe |
| `cli/rules/international/gdpr.json` | ~1.5 KB | 🟡 Media | ✅ Existe |
| `cli/rules/countries/_template.json` | ~0.8 KB | 🟡 Media | ✅ Existe |
| `cli/rules/risk-engine/score-formula.json` | Fórmula | 🔴 Alta | ✅ Existe |
| `cli/rules/risk-engine/score-formula-v2.json` | Fórmula v2 | 🔴 Alta | ✅ Existe (v0.3+) |

**Validaciones específicas:**

1. **Completitud de categorías de datos:**
   - ¿Cada categoría (público, personal, sensible, menores) está definida?
   - ¿Los ejemplos son suficientes y precisos?
   - ¿Se mencionan todos los tipos de datos sensibles de la ley?

2. **Base legal (legal_bases):**
   - ¿Brasil tiene 10 bases exactamente (Art. 7°)?
   - ¿Colombia tiene consentimiento + 9 excepciones?
   - ¿México tiene consentimiento (tácito o expreso según tipo)?
   - ¿El GDPR tiene 6 bases + 10 excepciones para datos especiales (Art. 6 + Art. 9)?

3. **Plazos:**
   - Brasil LGPD: "plazo razoável" — ¿la regla JSON lo refleja? ¿Está alineado con Resolução ANPD?
   - Colombia: 10 hábiles + prórroga 5 — ¿codificado correctamente?
   - México: 20 hábiles para respuesta, 15 para efectivización
   - GDPR: 30 días + prórroga 60 (2 meses adicionales)

4. **Sanciones:**
   - Brasil: máximo R$ 50M — ¿es el máximo correcto en JSON?
   - Colombia: 2,000 SMLMV — ¿fórmula o número fijo?
   - México: 100–320,000 días de SMG
   - GDPR: €20M o 4% de facturación global

5. **Penalizadores y puntos asignados:**
   - ¿Están bien balanceados entre Frontend (0–50) y Backend (0–50)?
   - ¿Hay penalizadores "sorpresas" sin base legal clara?
   - ¿Los penalizadores por menores son suficientemente severos?

**Output esperado:** Documento `AUDIT-REGLAS-JSON.md` con tabla de hallazgos

---

### 3.3 EJE 3: VALIDACIÓN DE RECOMENDACIONES ARQUITECTÓNICAS (Semana 3–4)

**Objetivo:** Confirmar que las recomendaciones técnicas en skills, checklists y matrices son correctas, factibles y completas según la ley.

**Método:**
- Revisar cada skill (`audit/`, `privacy-check/`, `clasificar-datos/`, etc.)
- Extraer "claims técnicos" (ej: "usa AES-256 para cifrado", "DPO es obligatorio para toda empresa")
- Validar contra ley y estándares de industria (NIST, ISO 27001)
- Verificar que los ejemplos/casos de uso son realistas

**Skills a revisar (en orden de complejidad):**

| Skill | Pilar | Claims técnicos clave | Estado |
|---|---|---|---|
| `/clasificar-datos` | BE | "Datos sensibles = [biometría, salud, religión, políticas...]" | Revisar contra Art. 5° de cada ley |
| `/privacy-check` | BOTH | "Verificar base legal, minimización, RBAC, TLS, consentimiento..." | Revisar exhaustivamente |
| `/audit` | BOTH | Fórmula: Risk Score = min(100, (C_base + Σ Penalizadores) × F_rigor) | Validar metodología |
| `/risk-score` | BOTH | Escala 0–30 bajo, 31–70 medio, 71–100 alto | ¿Alineada con realidad legal? |
| `/matriz-normativa` | BOTH | Comparativa por dimensión (consentimiento, derechos, DPO...) | Muestrear algunos rows |
| `/derechos-usuario` | BOTH | Plazos y protocolos ARCO/ARSOP por país | Validar contra `docs/SOURCES-VALIDATION.md` |

**Recomendaciones técnicas a validar en `knowledge/pillar-backend/`:**

| Documento | Claims | Validación |
|---|---|---|
| `architecture/encryption-strategy.md` | "AES-256 en reposo, TLS 1.2+, bcrypt cost ≥12" | ¿Son estos estándares correctos hoy (2026)? |
| `architecture/audit-logging.md` | "No loguear passwords, mantener inmutabilidad, retención 72h para brechas" | ¿Alinhado con LGPD y GDPR? |
| `architecture/data-classification.md` | Niveles (público, personal, sensible, menores) | Copiar validación del Eje 1 |
| `architecture/access-control.md` | "RBAC, segregación de responsabilidades, principio de mínimo privilegio" | Benchmark con NIST, ISO 27001 |
| `checklists/checklist-acceso.md` | Checklist de RBAC | Revisar exhaustivamente |
| `checklists/checklist-ciclo-vida.md` | Retención, purga, backups | Validar contra plazos legales |
| `checklists/checklist-transferencias.md` | DPA, SCCs, adecuación | Validar contra requisitos de cada país |

**Recomendaciones UX a validar en `knowledge/pillar-frontend/`:**

| Documento | Claims | Validación |
|---|---|---|
| `patterns/consent-banner.md` | "No pre-marcado, lenguaje claro, granular por finalidad" | ¿Cumple requisitos de Art. 7 LGPD, Art. 9 Colombia? |
| `patterns/consent-form.md` | Estructura de formulario de consentimiento | ¿Evita dark patterns? |
| `checklists/checklist-consentimiento.md` | Requisitos de consentimiento por jurisdicción | ¿Refleja diferencias LGPD vs Ley 1581 vs LFPDPPP? |
| `checklists/checklist-transparencia-ui.md` | Política, aviso de cookies, DPO visible | ¿Completo según Art. 16 México, Art. 12 LGPD? |

---

## 4. Matriz de Validación: Estructura

Cada claim será validado con esta estructura:

```markdown
| Claim | Archivo | Fuente Legal | Texto de la ley (extracto) | Hallazgo | Nota |
|---|---|---|---|---|---|
| "Datos sensibles en Brasil incluyen biometría" | brasil.json → data_categories.sensitive | Art. 5°, XIV LGPD | "dado biométrico, quando vinculado a uma pessoa natural" | ✅ Confirmado | Texto exacto, completo |
| "Plazo de respuesta LGPD: 15 días" | brasil.json → data_subject_rights | Art. 18 LGPD (base) | "Resolução CD/ANPD nº 2/2022 define estándar" | ⚠️ Matiz | LGPD no especifica días — es práctica. Verificar Resolução vigente |
| "Multa máxima México: 320,000 SMG" | mexico.json → sanctions | Art. 63–65 LFPDPPP | "...hasta por el equivalente de... 320,000 días de salario mínimo..." | ❌ Incorrecto | Artículos citan "días de SMG" pero referencia al Distrito Federal es desactualizada. Verificar IMSS. |
```

---

## 5. Fases Detalladas

### 📅 FASE 1: MAPEO E INVENTARIO (Días 1–3)

**Entregable:** Lista completa de todos los claims en el proyecto

**Tareas:**
- [ ] Listar todos los claims en `docs/SOURCES-VALIDATION.md` (ya existe tabla, completar)
- [ ] Extraer claims de `brasil.json`, `colombia.json`, `mexico.json` (penalizadores, bases legales, sanciones)
- [ ] Extraer claims de skills: qué dice `/audit`, `/privacy-check`, `/clasificar-datos` que es "verdad legal"
- [ ] Extraer claims de checklists: qué requisitos técnicos se citan
- [ ] Consolidar en **VALIDATION-INVENTORY.md** (nuevo archivo)

**Dueño:** Claude + Jose

---

### 📅 FASE 2: VALIDACIÓN NORMATIVA (Días 4–10)

**Entregable:** `SOURCES-VALIDATION.md` completo con ✅/⚠️/❌ por cada claim

**Tareas por país (prioridad: BR > CO > MX > Others):**

**Brasil:**
- [ ] Abrir https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- [ ] Validar cada row de `SOURCES-VALIDATION.md` (Brasil — LGPD)
- [ ] Para claims con ⚠️, buscar Resoluciones ANPD vigentes
- [ ] Documentar URL exacta de cada fuente

**Colombia:**
- [ ] Validar cada row de `SOURCES-VALIDATION.md` (Colombia — Ley 1581)
- [ ] Verificar Decreto 1377/2013 para detalles de implementación
- [ ] Verificar si el registro RNBD sigue siendo obligatorio

**México:**
- [ ] Validar cada row (México — LFPDPPP)
- [ ] Verificar si sigue vigente la referencia a "SMG del Distrito Federal"
- [ ] Confirmar sanciones penales (Art. 67)

**GDPR (contraste, muestreo):**
- [ ] Validar 5–10 claims de contraste
- [ ] No validación exhaustiva (ya conocido)

**Output:**
- Actualizar `docs/SOURCES-VALIDATION.md` con columna "Revisión" completa
- Crear `VALIDATION-GAPS.md` listando issues a resolver

---

### 📅 FASE 3: AUDITORÍA DE REGLAS JSON (Días 11–15)

**Entregable:** `AUDIT-REGLAS-JSON.md` con hallazgos por archivo

**Tareas:**
- [ ] Crear plantilla de auditoría JSON: verificar completitud, bases legales, penalizadores
- [ ] Auditar `brasil.json`: validar 10 bases legales, sanciones, categorías de datos
- [ ] Auditar `colombia.json`: validar plazos, consentimiento, datos sensibles
- [ ] Auditar `mexico.json`: validar consentimiento (tácito vs expreso), sanciones, bases legales
- [ ] Auditar `gdpr.json`: muestreo (5 claims)
- [ ] Revisar `score-formula.json` vs `score-formula-v2.json`: ¿cuál es definitiva?
- [ ] Detectar gaps: ¿hay requisitos legales sin regla JSON?

**Output:**
- Documento `AUDIT-REGLAS-JSON.md` con tabla de hallazgos
- Pull request o propuesta de correcciones (si aplica)

---

### 📅 FASE 4: VALIDACIÓN ARQUITECTÓNICA (Días 16–20)

**Entregable:** `ARCHITECTURE-VALIDATION.md` con recomendaciones técnicas verificadas

**Tareas:**
- [ ] Revisar `knowledge/pillar-backend/architecture/`: encryption-strategy, audit-logging, data-classification, access-control
  - ¿AES-256 es aún estándar en 2026?
  - ¿TLS 1.2+ sigue siendo suficiente? (tendencia a TLS 1.3 obligatorio)
  - ¿Bcrypt cost ≥12 es adecuado?
  - ¿Plazos de retención de logs son correctos?
- [ ] Revisar `knowledge/pillar-frontend/patterns/`: consent-banner, consent-form
  - ¿Evitan dark patterns según estándares?
  - ¿Lenguaje es claro y legal?
  - ¿Granularidad de consentimiento es suficiente?
- [ ] Muestrear checklists: validar que no hay sobrerequisitos ni subrequisitos
- [ ] Benchmark con estándares industriales: NIST, ISO 27001, OWASP

**Output:**
- Documento `ARCHITECTURE-VALIDATION.md`
- Posibles PRs de actualización a estándares

---

### 📅 FASE 5: SÍNTESIS Y REMEDIACIÓN (Días 21–28)

**Entregable:** Plan de remediación + documento de conclusiones

**Tareas:**
- [ ] Consolidar hallazgos de Fases 2–4
- [ ] Priorizar: bloqueadores (❌ ley violada) vs mejoras (⚠️ matices legales) vs optimizaciones (🟡 best practices)
- [ ] Crear plan de remediación con responsables y fechas
- [ ] Actualizar `docs/GOVERNANCE.md` con cadencia de validación futura (anual, trimestral)
- [ ] Preparar brief ejecutivo para Jose

**Output:**
- `REMEDIATION-PLAN.md` (tareas, propietario, plazo)
- Brief ejecutivo (1–2 páginas)

---

## 6. Recursos Requeridos

### 6.1 Acceso Legal

- ✅ Acceso a textos de leyes (URLs públicas)
- ✅ Acceso a resoluciones de autoridades (ANPD, SIC, INAI)
- ⚠️ Abogado experto (Brasil, Colombia, México) para revisar validación — **outsource recomendado**
- ⚠️ Abogado especialista en tech/privacidad para benchmark arquitectónico

### 6.2 Herramientas

- ✅ Editor de Markdown (ya disponible)
- ✅ Acceso a repositorio GitHub/local
- ✅ JSON validator (online o local)
- 🔮 Tool MCP para acceder a definiciones legales en tiempo real (mejora futura)

### 6.3 Tiempo

- **Claude:** 40–60 horas (Fases 1–4)
- **Jose:** 10–15 horas (supervisión, decisiones, brief a abogados)
- **Abogado externo (outsource):** 20–30 horas (Fase 2 profunda + Fase 5)

**Total:** 4 semanas con dedicación parcial

---

## 7. Criterios de Éxito

✅ **Project es considerado "validado" cuando:**

1. ✅ 100% de claims en `docs/SOURCES-VALIDATION.md` tienen status (✅/⚠️/❌)
2. ✅ Todos los ❌ (incorrectos) fueron corregidos
3. ✅ Todos los ⚠️ (matices) tienen nota de aclaración legal
4. ✅ Reglas JSON (`brasil.json`, `colombia.json`, `mexico.json`) auditadas y ajustadas
5. ✅ Recomendaciones arquitectónicas en checklists y patterns están alineadas con ley y best practices
6. ✅ Campo `review_status` en cada JSON fue actualizado a `"reviewed_and_validated"` con nombre/fecha de abogado revisor
7. ✅ Documento `docs/GOVERNANCE.md` incluye cadencia de validación futura

---

## 8. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Cambios legislativos entre ahora y revisión (ej: enmiendas a LGPD) | Alta | Medio | Validar contra "estado de la ley" al fecha de revisión; agregar nota de vigencia |
| Gaps en resoluciones/reglamentos complementarios (no solo ley base) | Alta | Medio | Incluir resoluciones ANPD, decretos reglamentarios, guías de autoridades |
| Desalineación entre claim legal y implementación técnica | Media | Alto | Fase 4 es específicamente para esto |
| Falta de acceso a abogado experto de país XYZ | Media | Medio | Priorizar BR/CO/MX; usar crowdsourcing en comunidad legal LATAM |
| Sobrealcance (intentar validar TODO en el proyecto) | Media | Medio | Scope está delimitado en Sección 2; usar prioridades para fases |

---

## 9. Roadmap Post-Validación

**Una vez completada esta validación:**

1. **v0.3 — "Validado por Pares"** (3–4 meses después)
   - Publicar resultados de validación legal
   - Actualizar README con "Legal Review Status: Completed (June 2026)"
   - Badges de verificación en README

2. **v0.4 — Pilares Separados** (6 meses)
   - Implementar separación FE/BE completa (per `PILLAR-SEPARATION.md`)
   - Nueva estructura de skills
   - Reglas JSON con campo `pillar`

3. **v1.0 — CLI Productivo** (9 meses)
   - CLI en npm estable
   - Auditoría del motor de scoring
   - SLA de response time en la herramienta

---

## 10. Próximos Pasos Inmediatos

**Si Jose aprueba este plan:**

1. **Semana 1 (José + Claude):**
   - [ ] Finalizar `VALIDATION-INVENTORY.md` (lista completa de claims)
   - [ ] Crear `SOURCES-VALIDATION.md` (versión mejorada con links)

2. **Semana 2 (Claude + abogado externo):**
   - [ ] Iniciar validación normativa Brasil
   - [ ] Solicitar revisión de pares a red legal LATAM (contactos)

3. **Semana 3–4:**
   - [ ] Continuar validación (CO, MX)
   - [ ] Auditoría JSON en paralelo

---

## 📎 Anexos

### Anexo A: URLs de Fuentes Primarias

**Brasil**
- Ley: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD: https://www.gov.br/anpd
- Resoluciones: https://www.gov.br/anpd/pt-br/assuntos/normatizacao

**Colombia**
- Ley 1581: https://www.normograma.gov.co/normograma/compiladolegislacion/2012_ley_1581.htm
- Decreto 1377: https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646
- SIC: https://www.sic.gov.co

**México**
- LFPDPPP DOF: https://www.dof.gob.mx/nota_detalle.php?codigo=5150631&fecha=05/07/2010
- Reglamento DOF: https://www.dof.gob.mx/nota_detalle.php?codigo=5280098&fecha=21/12/2011
- INAI: https://home.inai.org.mx

**GDPR**
- Texto EUR-Lex: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679
- EDPB: https://edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_es

### Anexo B: Contactos Sugeridos para Revisión de Pares

(A completar con red legal LATAM)

---

**Documento preparado por:** Claude  
**Para:** Jose Guillermo Vasquez  
**Estado:** 📋 Borrador — Pendiente aprobación  
**Última actualización:** 2026-06-18

*Privacy Compliance Skills — Cerrando la brecha entre código y cumplimiento legal en LATAM.*
