# EVALUACIÓN + PLAN — Investigación Jurídica y Skill de Anti-Patrones
**Privacy Compliance Skills (UE · USA · LATAM) — Continuación del desarrollo**

> Elaborado: 2026-07-09
> Estado: 📋 Propuesto
> Complementa: `PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md` (loop híbrido) · `PLAN-REBRAND-Y-WEB-2026-07.md` (tri-bloque) · `PROMPTS-CLAUDE-CODE-2026-07.md` (sesiones A–F) · `PLAN-VALIDACION-FUENTES-2026-06.md`
> Alcance LATAM declarado: Colombia, México, Brasil, Chile, Argentina, Perú, Ecuador y **Panamá** (nuevo).

---

## §1 Evaluación técnica y lógica

| # | Hallazgo | Severidad | Detalle y corrección |
|---|---|---|---|
| T1 | **Dos modelos de F_rigor coexisten y se contradicen.** `region-factors.json` define EU 1.25 / US 1.10 / BR 1.15 / CL 1.10 / EC 1.00; el fallback de `skills/audit/SKILL.md` y `QUESTIONS.md` mantienen el modelo binario viejo (BR/EC/UE = 1.25). **Bug lógico derivado:** tres penalizadores BE (DPO +15, base legal +20, brechas +15) se activan "solo si F_rigor = 1.25" — con Brasil a 1.15 dejarían de activarse para la LGPD, que es exactamente donde más aplican. | 🔴 | Sustituir la condición numérica por una lista `strict_regimes` (UE, BR, CL desde 01-12-2026, EC por decidir) en `region-factors.json`, y condicionar penalizadores a pertenencia a esa lista. Decidir el estatus de Ecuador (era 1.25 por LOPDP; el nuevo modelo lo baja a 1.00 sin justificación registrada). Sincronizar SKILL.md/QUESTIONS.md al cerrar la Sesión B. **Añadir este fix al prompt de la Sesión B.** |
| T2 | El árbol de `PLAN-REBRAND` §3.1 lista `argentina.json`, `peru.json`, `ecuador.json` como existentes en `latam/` — **no existen** (solo brasil, chile, colombia, mexico + template). | 🟡 | Corregir el plan o crear los 3 JSONs (Fase IJ, Ola 3). |
| T3 | `AGENT-CONTRACT` v1.0 no modela jurisdicción por finding. Para USA multiestatal se necesita `jurisdictions[]` en el finding y el penalizador `us_multistate_exposure` referenciado en `region-factors.json` no existe en ningún catálogo de penalizadores. | 🟡 | Extender el contrato a v1.1 (campo aditivo `jurisdictions`) y crear el penalizador en `usa-federal.json` o en el risk-engine. |
| T4 | Fallback de `/audit` penaliza "no mencionado" igual que "ausente" (eval E2: e-commerce simple → 100/100 por supuestos). Declarado correctamente como supuestos, pero distorsiona el semáforo. | 🟢 | Iteración 2 del eval: distinguir `unknown` de `absent` y reportar rango (ej. 40–100) o score con intervalo de confianza. |
| T5 | Fortalezas confirmadas: `chile.json` modela bien la transición 19.628→21.719; `state-matrix.json` usa 6 dimensiones correctas (incl. universal opt-out/GPC); prompts A–F bien secuenciados con Sesión 0 de commits; la web valida build. | ✅ | — |

## §2 Evaluación jurídica — calidad del contexto por jurisdicción

Criterios: reglas JSON propias · tabla de fuentes primarias en `SOURCES-VALIDATION.md` · práctica regulatoria integrada (resoluciones/reglamentos) · estado de revisión.

| Jurisdicción | Reglas JSON | Tabla de fuentes | Práctica regulatoria | Calidad | Data crítica faltante |
|---|---|---|---|---|---|
| 🇪🇺 UE (GDPR) | ✅ Alta calidad (aún en `international/`) | ❌ | Parcial | 🟡 | Vigencia 2026 del EU-US Data Privacy Framework; ePrivacy/cookies; guidelines EDPB clave (consentimiento, transferencias); nota AI Act |
| 🇺🇸 USA federal | ✅ Nuevo (CCPA/CPRA + HIPAA/COPPA/GLBA/FERPA + ADMT) | ❌ | n/a | 🟡 | Citas estatutarias exactas (Cal. Civ. Code §1798.100 ss.), regulaciones CPPA vigentes, verificación del private right of action y umbrales 2026 |
| 🇺🇸 USA estados | ✅ Matriz 19 estados | ❌ | n/a | 🟡 | Verificación por fuente oficial de cada estado (fecha vigencia, umbrales, cure period); nota WA My Health My Data y FL |
| 🇨🇴 Colombia | ✅ | ✅ 9 claims | Parcial | 🟢− | Verificar RNBD (umbral UVT), circulares SIC recientes |
| 🇲🇽 México | ✅ v1.1 (ley 2025) | ⚠️ Tabla redactada bajo ley 2010 abrogada | Parcial | 🟡 | **Re-validar artículo por artículo contra el texto DOF 20-03-2025** (plazos ARCO, consentimiento tácito, aviso de privacidad); reglamento nuevo si se emite |
| 🇧🇷 Brasil | ✅ v1.1 + RCIS | ✅ 10 claims | ✅ Res. 15/2024 | 🟢− | Res. CD/ANPD 2/2022 (plazos de derechos), Res. 19/2024 (SCCs transferencias), guía cookies ANPD |
| 🇨🇱 Chile | ✅ Nuevo (21.719, transición modelada) | ❌ | ❌ | 🟡 | Reglamentos/normativa APDP pre-vigencia; reglas operativas del dual-régimen hasta 30-11-2026 |
| 🇦🇷 Argentina | ❌ (solo matrices) | ❌ | ❌ | 🔴 | `argentina.json` completo + monitoreo de la reforma en debate |
| 🇵🇪 Perú | ❌ (solo matrices) | ❌ | ❌ | 🔴 | `peru.json` con D.S. 016-2024-JUS (brechas 48h, ODP escalonado, portabilidad) |
| 🇪🇨 Ecuador | ❌ (solo matrices) | ❌ | ❌ | 🔴 | `ecuador.json` con LOPDP + DE-904/2023 + decisión de F_rigor (ver T1) |
| 🇵🇦 **Panamá** | ❌ **Cero presencia en el repo** | ❌ | ❌ | 🔴 | Todo: Ley 81 de 2019, Decreto Ejecutivo 285 de 2021, autoridad ANTAI, categorías, derechos, sanciones — construir desde cero y verificar contra fuente oficial |

## §3 Respuesta a las dos preguntas

### 3.1 ¿Existe un plan para la skill que corrige malas prácticas y anti-patrones?

**Parcialmente.** Lo que ya existe: el estado S3-CORREGIR del loop de `/audit`, y `fix_hint` + `evidence_needed` + `config_key` por finding en `AGENT-CONTRACT.md` — la IA ya sabe *qué* corregir. Lo que **no** existe: el conocimiento de *cómo* corregir a nivel de código. No hay catálogo de anti-patrones con señales de detección en código real, ni recetas de corrección por stack, ni skill dedicada. La única mención de anti-patrones en el repo es una columna del patrón `consent-banner.md`. **Se cubre con la Fase AP (§4).**

### 3.2 ¿Existe un plan para recolectar, citar y contrastar los estándares de riesgo por jurisdicción?

**Parcialmente y solo para LATAM-core.** Lo que ya existe: `SOURCES-VALIDATION.md` (tablas de claims para BR/CO/MX + ronda de vigencia jul-2026), `PLAN-VALIDACION-FUENTES-2026-06.md`, y el checklist de pares en `PROMPTS-CLAUDE-CODE`. Lo que **no** existe: tablas de fuentes para UE, USA (federal + 19 estados), CL, AR, PE, EC y PA; una metodología de citación uniforme; y el uso sistemático de herramientas de investigación legal asistida. **Se cubre con la Fase IJ (§4).**

## §4 Plan de continuación

### Fase AP — Catálogo de anti-patrones + skill `/fix` (2 semanas · editorial en Cowork, wiring en Claude Code)

1. **`knowledge/anti-patterns/`** — un archivo por anti-patrón con formato fijo:
   `nombre · señal de detección (patrón de código/config/query) · por qué viola la ley (legal_refs desde cli/rules/) · receta de corrección por stack (ejemplo antes/después) · evidencia de verificación · penalizer_id vinculado`.
2. **Semilla v1 (12 anti-patrones):** checkbox único/pre-marcado; consent-wall (acceso condicionado a aceptar todo); PII en logs; export de tablas con sensibles hacia analytics; hash débil de contraseñas (MD5/SHA1); dump de producción en dev/staging; secreto hardcodeado en el repo; retención infinita (sin TTL ni job de purga); soft-delete presentado como borrado ARCO; IDs secuenciales que exponen datos (IDOR); email marketing sin opt-out funcional; fingerprinting/tracking sin aviso.
3. **Skill `/fix [finding_id | anti-patrón]`:** recibe el finding del contrato JSON (o el nombre), carga la receta, propone el diff concreto y ejecuta la verificación del `evidence_needed`. Implementa el S3 del loop con conocimiento real de código.
4. **`AGENT-CONTRACT` v1.1:** campo aditivo `recipe_ref` en el finding → conecta CLI → skill → receta.
5. **Evals con skill-creator** (mismo método ya validado con `/audit`: casos con/sin skill, assertions, viewer).

### Fase IJ — Investigación jurídica para validación (4 semanas · por olas)

**Metodología de citación uniforme (antes de investigar):** toda cita registra `jurisdicción · norma · artículo · extracto ≤25 palabras · URL de fuente oficial · fecha de consulta · review_status`. Pipeline de estados: `pending_legal_validation → verified_editorial → under_review → validated` (este último solo con revisor humano identificado en `reviewed_by`).

**Tooling (capacidades de modelo + MCPs disponibles en Cowork):**

| Herramienta | Uso |
|---|---|
| Legal Data Hunter (MCP multi-jurisdiccional, 230+ jurisdicciones) | Fuentes primarias UE y LATAM; comparativas cross-border; enforcement GDPR |
| Descrybe (MCP de ley primaria USA) | Estatutos y jurisprudencia por estado; verificación de citas CCPA/CPRA y las 19 leyes estatales |
| WebSearch dirigido a reguladores | DOF, BCN, Planalto/ANPD, El Peruano, SIC, ANTAI, EDPB, CPPA |
| Tarea programada mensual (vigilancia normativa) | Reformas AR, reglamentos APDP Chile (countdown 01-12-2026), regs CPPA, DPF |

**Ola 1 — crítica (semanas 1–2):** México texto 2025 completo (rehacer la tabla de fuentes abrogada); USA federal con citas estatutarias exactas + regs CPPA; UE (DPF 2026, ePrivacy, EDPB). Resuelve las jurisdicciones 🟡 con mayor exposición.

**Ola 2 (semana 3):** verificación estado-por-estado de `state-matrix.json` contra fuentes oficiales; Chile pre-vigencia (normativa APDP); Brasil Res. 2/2022 y 19/2024 + guía cookies.

**Ola 3 (semana 4):** crear `argentina.json`, `peru.json`, `ecuador.json` y **`panama.json` (Ley 81/2019 + D.E. 285/2021 + ANTAI)** con sus tablas de fuentes; añadir Panamá a README, region-factors, matrices y web. Cierra T2 y la deuda 🔴.

**Criterios de aceptación Fase IJ:** 11 jurisdicciones con tabla de fuentes primarias; cero claims sin `review_status`; metodología de cita aplicada al 100% de claims nuevos; decisión documentada del F_rigor de Ecuador (T1); Panamá operativo en el motor.

## §5 Secuencia integrada

```
Sesión 0 (commits) → Sesión A (reorg bloques) → Sesión B (region-factors al scorer + FIX T1)
→ Fase IJ Ola 1 (Cowork, investigación) → Sesión C (skills USA) → IJ Ola 2 → Fase AP (catálogo + /fix)
→ Sesión D (web) → IJ Ola 3 (AR/PE/EC/PA) → Sesión E (golden tests) → Sesión F (release)
```

Las fases IJ corren en Cowork (investigación con MCPs legales, edición de JSON/MD); las sesiones A–F en Claude Code (código). El fix de T1 es **bloqueante** para la Sesión B — sin él, el scorer nuevo desactivaría penalizadores de la LGPD.

---

> ⚠️ Guía operativa del proyecto. El contenido legal resultante no constituye asesoría jurídica y requiere validación de pares. Ver `DISCLAIMER.md`.
