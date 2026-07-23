# Metodología de Vigilancia Normativa
**Privacy Compliance Skills (UE · USA · LATAM)**

> Elaborado: 2026-07-09 · Estado: Metodología v1.0 — operativa
> Ejecutor: tarea programada `vigilancia-normativa-mensual-pcs` (día 1 de cada mes) + roles humanos de esta metodología
> Registro de resultados: `docs/SOURCES-VALIDATION.md` (secciones "Ronda de vigilancia YYYY-MM")

## 1. El problema que esta metodología resuelve

La búsqueda web abierta tiene tres fallas conocidas para vigilancia legal: **recall** (no encontrar lo que sí pasó — una resolución publicada en gaceta que ningún medio cubrió), **precisión** (confundir un proyecto de ley con ley vigente, o un blog especulativo con doctrina), y **asimetría de cobertura** (México genera 50 notas por reforma; Panamá, dos). La solución no es buscar más, sino **invertir la pirámide: fuentes ancla oficiales primero, búsqueda abierta solo para descubrir lo desconocido**.

## 2. Arquitectura de fuentes en 3 niveles

### Nivel 0 — Fuentes ancla oficiales (consulta DIRECTA, no búsqueda)

Cada jurisdicción tiene fuentes oficiales fijas que se visitan directamente cada ronda. Si una no es legible por fetch (ej. leginfo de California es JS), se documenta su alternativa oficial (aprendido: usar el PDF del estatuto de la CPPA).

| Jurisdicción | Fuentes ancla (consulta directa) |
|---|---|
| 🇲🇽 México | DOF (dof.gob.mx — búsqueda "datos personales" del mes) · Leyes vigentes Diputados (LFPDPPP.pdf — campo "Última Reforma") · gob.mx/buengobierno (SABG) |
| 🇧🇷 Brasil | gov.br/anpd → Atos Normativos y Notícias · Planalto (texto LGPD consolidado) |
| 🇨🇴 Colombia | sic.gov.co → normativa/circulares · Función Pública (normograma) |
| 🇨🇱 Chile | BCN LeyChile (Ley 21.719 — modificaciones) · sitio de la APDP (instrucciones generales; crítico jun-nov 2026) |
| 🇦🇷 Argentina | argentina.gob.ar/aaip → normativa · HCDN/Senado (estado de proyectos de reforma) |
| 🇵🇪 Perú | El Peruano (busquedas.elperuano.pe) · gob.pe/minjus (ANPD) |
| 🇪🇨 Ecuador | Registro Oficial · Superintendencia de Protección de Datos |
| 🇵🇦 Panamá | Gaceta Oficial digital · antai.gob.pa |
| 🇺🇸 USA | cppa.ca.gov/regulations (regs + estatuto) · IAPP US State Privacy Legislation Tracker (agregador de referencia para las 19+ leyes) |
| 🇪🇺 UE | EUR-Lex (búsqueda del mes) · edpb.europa.eu (guidelines/decisiones) · curia.europa.eu (caso C-703/25 P — DPF) |

### Nivel 1 — Agregadores especializados (verificación cruzada)

IAPP (news + trackers), Legal Data Hunter MCP (ley primaria multi-jurisdiccional; cobertura verificada para las 11 jurisdicciones incl. PA), Descrybe MCP (ley primaria USA, cuando autentique), alertas de firmas reconocidas (Garrigues, DLA "Data Protection Laws of the World", Baker McKenzie, IAPP member firms). **Rol:** confirmar hallazgos del Nivel 0 y detectar lo que el Nivel 0 no mostró.

### Nivel 2 — Búsqueda web abierta (solo descubrimiento)

Plantillas de consulta por jurisdicción ("[país] ley protección datos reforma [mes año]", "[regulador] nueva resolución"). **Nada del Nivel 2 es accionable por sí solo** — solo genera candidatos que deben subir de nivel.

## 3. Regla de triangulación y clasificación de hallazgos

Todo hallazgo se clasifica antes de registrarse, y su clase determina qué se puede hacer con él:

| Clase | Requisito de evidencia | Qué permite |
|---|---|---|
| ✅ **CONFIRMADO** | Texto oficial visto (gaceta/regulador/EUR-Lex) con URL y fecha de consulta | Registrar en SOURCES-VALIDATION + abrir ticket editorial para actualizar `cli/rules/` |
| 🟡 **PROBABLE** | 2+ fuentes secundarias independientes y reputadas, con referencia a la norma exacta, pero texto oficial aún no localizado | Registrar como pendiente + tarea de localizar el texto oficial en ≤7 días |
| ⚪ **MONITOREO** | 1 sola fuente, o se trata de proyecto de ley/consulta pública | Solo anotar en el log de la ronda; prohibido tocar reglas o docs de cobertura |

Reglas duras: un proyecto de ley NUNCA se registra como norma vigente (Argentina es el caso de escuela); toda fecha de vigencia se transcribe del texto oficial, no de titulares; si dos fuentes discrepan, gana la oficial y la discrepancia se anota.

## 4. Checklist mensual por jurisdicción (qué preguntar, siempre igual)

Para cada una de las 11 jurisdicciones: ① ¿ley nueva o reforma publicada? ② ¿reglamento o norma secundaria nueva? ③ ¿resoluciones/instrucciones/guías del regulador? ④ ¿sanciones o enforcement relevante (multas emblemáticas, criterios)? ⑤ ¿jurisprudencia que cambie la interpretación (TJUE, cortes supremas)? ⑥ ¿fechas de vigencia próximas (≤90 días) que el repo deba avisar? ⑦ ¿cambió la autoridad competente?

## 5. Registro y trazabilidad (append-only)

Cada ronda escribe en `docs/SOURCES-VALIDATION.md` una sección "🔭 Ronda de vigilancia YYYY-MM" con una fila por hallazgo: jurisdicción · hallazgo · clase (✅/🟡/⚪) · fuente(s) con URL · fecha de consulta · archivos del repo impactados · acción propuesta. Si no hubo novedades en una jurisdicción, se registra "sin novedades" explícitamente (el silencio también es dato: prueba que se revisó). El agente de IA **nunca edita las reglas** — propone; la edición es del pipeline editorial (§7).

## 6. Métricas de calidad del sistema (revisión trimestral)

**Recall**: cada trimestre, contrastar los hallazgos de las 3 rondas contra el tracker de IAPP y un boletín de firma — cada evento que ellos reportaron y la ronda no detectó es un "miss" que obliga a añadir una fuente ancla. **Precisión**: % de hallazgos CONFIRMADOS que la revisión humana ratificó sin corrección (meta ≥95%). **Latencia**: días entre publicación oficial y detección (meta ≤35 días; para Chile hasta dic-2026, ≤7 días con ronda semanal extraordinaria si hace falta). **Cobertura**: 11/11 jurisdicciones con respuesta explícita (hallazgo o "sin novedades") en cada ronda.

## 7. Roles profesionales y pipeline de decisión

| Rol | Quién (hoy / objetivo) | Responsabilidad | Dedicación |
|---|---|---|---|
| **Agente de vigilancia (IA)** | Tarea programada + Arquitecto (Fable) | Ejecutar la ronda con esta metodología, clasificar, registrar, proponer. Nunca edita reglas ni promueve `review_status`. | Automática, día 1 |
| **Editor técnico-jurídico** | Jose (owner del repo) | Triage del reporte en ≤3 días: decide qué hallazgo CONFIRMADO pasa a edición de `cli/rules/`, abre el ticket, ejecuta o delega la edición (con `review_status: verified_editorial`). | 1-2 h/mes |
| **Abogado revisor por jurisdicción** | Red de colaboradores del llamado del README (abogados de protección de datos locales) | Validar los cambios de su jurisdicción contra el texto oficial: es el ÚNICO rol que promueve `review_status` a `validated` y firma en `reviewed_by`. SLA: 15 días; urgentes (vigencia ≤45 días), 48 h. | 2-4 h/mes por jurisdicción |
| **Coordinador editorial / data governance** | Jose (hasta delegar) | Dueño del pipeline `pending → verified_editorial → under_review → validated`, de la lista de fuentes ancla (§2) y de las métricas (§6). Resuelve conflictos entre fuentes. | 1 h/mes |
| **Asesor académico** (opcional) | Académico de derecho digital (del llamado) | Revisión semestral de la metodología misma: ¿las fuentes ancla siguen siendo las correctas? ¿los niveles de rigor (F_rigor/strict_regimes) reflejan la realidad regulatoria? | 2 h/semestre |

**Regla de oro del pipeline (ya es política del repo):** la IA vigila y propone → el editor humano decide y edita → el abogado revisor valida. Ningún contenido llega a `validated` sin un humano con expertise jurídico identificado en `reviewed_by`.

## 8. Escalamiento urgente (fuera de ciclo)

Si cualquier ronda (o cualquier sesión de trabajo) detecta: entrada en vigencia ≤45 días, caída de un mecanismo de transferencia (ej. anulación del DPF), o cambio de autoridad competente → no espera al ciclo mensual: se notifica de inmediato al editor, se marca 🔴 en la revisión diaria del Arquitecto, y el README/web deben reflejar el aviso en ≤7 días.

---

*Guía operativa del proyecto. No constituye asesoría jurídica. Ver `DISCLAIMER.md`.*
