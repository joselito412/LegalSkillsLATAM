# Backlog Editorial — Contenido legal (corre en Cowork)

**Abierto:** 2026-07-28 · **Owner:** Editor técnico-jurídico (Jose) · **Ejecuta:** Cowork/Arquitecto
**Fuera del milestone de código v0.4.0** (`.planning/REQUIREMENTS.md`) — este backlog toca sustancia legal en `cli/rules/**`, `knowledge/` y `docs/`, que las sesiones de código tienen prohibido editar.

> Origen: rondas de vigilancia normativa (`docs/SOURCES-VALIDATION.md`, secciones 🔭) bajo la metodología `docs/VIGILANCIA-NORMATIVA.md`.
> Regla de gobernanza: un ticket solo puede ejecutarse si su hallazgo es ✅ CONFIRMADO. Los 🟡 PROBABLE primero pasan por su tarea de localización de texto oficial; los ⚪ MONITOREO **no generan ticket** — se re-verifican en la siguiente ronda.
> Ningún ticket promueve `review_status` a `validated`: eso exige revisor humano identificado (ver `GOB-06`).

## Estado

| ID | Ticket | Prioridad | Estado |
|---|---|---|---|
| VIG-01 | Brasil: adecuación UE (Res. ANPD 32/2026) en `brasil.json` | Alta | ✅ Hecho 2026-07-28 |
| VIG-02 | Colombia: Ley 2573/2026 (identidad digital) como régimen adyacente | Alta | ✅ Hecho 2026-07-28 |
| VIG-03 | Perú: RD 100-2025 (ODP + metodología de multas) en matrices | Media | ✅ Hecho 2026-07-28 |
| VIG-04 | USA: conteo de leyes estatales 19→20 en `state-matrix.json` | Media | 🔄 Parcial 2026-07-28 — gaps mapeados, conteo NO alterado |
| VIG-05 | Panamá: localizar texto oficial de ANTAI-DG-003-2026 (🟡→✅) | Media | 🔄 Intento fallido 2026-07-28 — sigue 🟡 |
| VIG-06 | Ecuador: consolidar la ola SPDP 2026 como insumo de `ecuador.json` | Media | ✅ Hecho 2026-07-28 |
| VIG-07 | Fuentes ancla §2: CL/EC/PA | Alta | ✅ Hecho 2026-07-28 |

---

## VIG-01 — Brasil: adecuación UE en transferencias internacionales

**Hallazgo (✅ CONFIRMADO, ronda 2026-07 2ª pasada):** Resolução CD/ANPD nº 32, de 26-01-2026 — la ANPD reconoce a la Unión Europea como organismo internacional con nivel de protección adecuado para efectos del Art. 33 LGPD. Vigente.

**Archivo:** `cli/rules/latam/brasil.json` → `international_transfer`.

**Criterios de aceptación:**
- Se añade la adecuación UE como mecanismo de transferencia, junto a las SCCs de la Res. 19/2024 ya registradas (no la reemplaza: son vías alternativas).
- Cita con norma, fecha y URL oficial (DOU / gov.br) en el campo correspondiente; `last_reviewed` y `editorial_note` actualizados; `review_status` permanece en `verified_editorial`.
- Se revisa si algún `fix_hint` del topic `transferencias` debe matizarse para proyectos BR→UE (hoy asume SCCs siempre necesarias).
- Fila correspondiente de `docs/NORMAS-CITADAS.md` (Brasil) refleja el mecanismo nuevo en la columna *La acción*.

## VIG-02 — Colombia: Ley Estatutaria 2573 de 2026 (suplantación de identidad digital)

**Hallazgo (✅ CONFIRMADO):** Ley 2573 de 2026 (promulgada 19-05-2026, D.O. 53496 del 20-05-2026) desarrolla habeas data, intimidad y buen nombre frente a la suplantación de identidad digital; impone obligaciones a operadores de telecomunicaciones, entidades financieras/crediticias y comercios de crédito. **Régimen general en vigor ~19-11-2026.**

**Archivo:** `cli/rules/latam/colombia.json` → sección nueva de régimen adyacente (no sustituye a la Ley 1581).

**Criterios de aceptación:**
- Se registra como **régimen adyacente con `enforcement_date: 2026-11-19`**, no como reforma de la 1581 — igual que se modeló la transición chilena.
- Se acota el alcance sectorial (telecom, financiero/crediticio, comercios de crédito): el motor no debe penalizar a proyectos fuera de ese ámbito.
- Se evalúa si amerita un penalizador o solo contexto informativo; si no amerita penalizador, se documenta el porqué (evita scope creep del motor).
- Entra en el calendario de vigencias del checklist ⑥ para las rondas de sept/oct/nov 2026.

**✅ Ejecutado 2026-07-28.** `brasil.json` v1.2.0 (`verified_editorial`): bloque nuevo `international_transfer.adequacy_decisions` con la Res. 32/2026 — alcance verificado más amplio de lo registrado en la ronda (**Estados miembros de la UE + EFTA/EEE: Islandia, Liechtenstein y Noruega + instituciones, órganos y agencias de la UE**), exclusiones (seguridad pública, defensa nacional, seguridad del Estado, investigación penal) y reevaluación a 4 años. El penalizador `lgpd_uncontrolled_transfer` se matizó para **no penalizar destinos con adecuación vigente** — antes marcaba en rojo transferencias BR→UE hoy legítimas. Fila de Brasil actualizada en `NORMAS-CITADAS.md`. Validación: `scripts/validate.js` 14/14 sin errores.

## VIG-03 — Perú: Resolución Directoral 100-2025-JUS/DGTAIPD

**Hallazgo (✅ CONFIRMADO):** RD 100-2025 (El Peruano 31-12-2025) — Directiva de designación, desempeño y funciones del Oficial de Datos Personales (ODP) + nueva metodología de cálculo de multas. Complementa el D.S. 016-2024-JUS.

**Archivos:** `knowledge/` (matrices de DPO y sanciones) y, cuando exista, `cli/rules/latam/peru.json` (V2-06).

**Criterios de aceptación:**
- Las matrices que citen el reglamento peruano de 2013 migran a D.S. 016-2024-JUS **+ RD 100-2025** (cierra el pendiente heredado de la Ola 1).
- La fila de Perú en `docs/NORMAS-CITADAS.md` incorpora el ODP con su cronograma escalonado y la metodología de multas.
- Queda anotado como insumo obligatorio del futuro `peru.json` (dependencia declarada hacia V2-06).

**✅ Ejecutado 2026-07-28.** `colombia.json` v1.1.0 (`verified_editorial`): bloque nuevo `adjacent_regimes` con la Ley 2573/2026 — modelada como régimen **adyacente y sectorial**, no como reforma de la 1581. Alcance verificado: telcos, entidades financieras/crediticias y comercios facultados para ofrecer productos con obligaciones crediticias; obligación de verificación efectiva de identidad (refuerza KYC), entrega de los documentos de aprobación al titular y **traslado de la carga de la prueba de la víctima a la empresa**. `scoring_treatment.generates_penalizer: false` con justificación explícita (alcance estrecho + aún no vigente) y criterio de reevaluación tras el 19-11-2026 si hay enforcement — así el motor no penaliza a proyectos fuera del sector. Validación: 14/14 sin errores.

## VIG-04 — USA: conteo de leyes estatales integrales 19 → ~20

**Hallazgo (🟡 PROBABLE):** el conteo pasó de 19 (ene-2026) a ~20 durante 2026; hay enmiendas vigentes desde 01-07-2026 (Connecticut, entre otras). No está identificada la ley que elevó el total.

**Archivo:** `cli/rules/us/state-matrix.json`.

**Criterios de aceptación:**
- Se identifica **cuál** ley/estado elevó el conteo, contrastando contra el IAPP US State Privacy Legislation Tracker y la fuente oficial del estado — sin ese dato, el ticket no se cierra (prohibido actualizar el número "porque un artículo lo dice").
- Se añade la entrada nueva con las 6 dimensiones de la matriz y se registran las enmiendas de 01-07-2026 en los estados afectados.
- `count` y `editorial_note` coherentes; el criterio de exclusión de leyes sectoriales (WA MHMDA, FL) se mantiene explícito.
- Si la verificación no concluye, el ticket se reduce a nota de incertidumbre en la matriz — **nunca** un número sin respaldo.

**✅ Ejecutado 2026-07-28.** Migradas las referencias del reglamento peruano de 2013 → **D.S. 016-2024-JUS + RD 100-2025-JUS/DGTAIPD** en `knowledge/pillar-backend/matrices/sanciones-por-incidente.md` y en la fila de Perú de `NORMAS-CITADAS.md`, con la nueva metodología de cálculo de multas y el ODP regulado en cuanto a designación, funciones y desempeño (matiz relevante: **no basta nombrar a alguien** — la directiva fija cómo se ejerce el cargo). Cierra el pendiente heredado de la Ola 1. Queda como insumo obligatorio del futuro `peru.json` (V2-06).

**🔄 Parcial 2026-07-28 — el conteo NO se alteró, y esa es la decisión correcta.** La verificación no concluyó: el IAPP tracker sostiene 19 en vigor, mientras MultiState reporta 20; las fuentes discrepan además sobre Arkansas (APDPA vigente 01-07-2025 según unas, 01-07-2026 según otras) y Arkansas tiene una ley sectorial de menores vigente 01-07-2026 que contamina los conteos. Se añadió a `state-matrix.json` un bloque `pending_verification` que convierte un rumor de "~20" en un mapa preciso de 4 gaps: (1) **Arkansas** como candidata #20 con sus umbrales ya recogidos; (2) 🔴 **Connecticut** — enmiendas vigentes 01-07-2026 que habrían recortado el umbral ~65%, por lo que la fila actual de CT puede generar **falsos negativos** (proyectos pequeños cubiertos sin que la matriz lo advierta); (3) enmiendas de Utah; (4) ~24 leyes promulgadas incluyendo AL/LA/OK/VT aún sin vigencia. **Prioridad al reabrir: el gap de Connecticut, no el conteo.**

## VIG-05 — Panamá: texto oficial de la Resolución ANTAI-DG-003-2026

**Hallazgo (🟡 PROBABLE, heredado de dos rondas):** adopta las Cláusulas Contractuales Estándar de la RIPD para transferencias internacionales. Referida por tres firmas y por registros del Órgano Judicial (pub. 26-06-2026), pero **el texto oficial no ha sido visto**.

**Criterios de aceptación:**
- Se localiza el PDF/edición en la **Gaceta Oficial** (fuente ancla nueva) o en antai.gob.pa, y se registra URL + fecha de consulta → el hallazgo sube a ✅ CONFIRMADO en `SOURCES-VALIDATION.md`.
- Si tras la búsqueda no aparece, se mantiene 🟡 y se documenta el intento (fecha y fuentes revisadas) — la clase nunca sube sin texto oficial.
- Insumo declarado para `panama.json` (V2-06).

## VIG-06 — Ecuador: ola de resoluciones SPDP 2026

**Hallazgo (✅ CONFIRMADO):** Resoluciones SPDP **0009-R** (12-02-2026, datos personales en uso de IA), **0004-R** (transferencias), **0005-R** (tratamiento a gran escala), **0003-R** (actividades domésticas). Enforcement activo (caso LIGAPRO / FAN ID).

**Criterios de aceptación:**
- Se consolida un resumen citado (norma, fecha, URL, alcance) como insumo del futuro `ecuador.json`.
- La 0009-R queda marcada como **candidata a capa transversal de IA** junto con las Guidelines EDPB 02/03-2026 y la Nota Técnica ANPD 1/2026 — es la señal regional de que "datos + IA" necesita tratamiento propio en el motor.
- Alimenta la **decisión pendiente del F_rigor de Ecuador** (hallazgo T1): con enforcement activo y normativa secundaria abundante, el editor decide si EC entra en `strict_regimes`. **Esta decisión desbloquea MOTOR-05.**

**🔄 Intento fallido documentado 2026-07-28 — se mantiene 🟡 (la clase no sube sin texto oficial).** Se localizó y **descargó** la Gaceta Oficial Digital **N° 30491-C del 26-03-2026** (misma fecha de la resolución): su contenido son actos de Cultura, Desarrollo Agropecuario, Economía y Finanzas, Salud, ARAP, Corte Suprema, Ministerio Público y el Consejo Municipal de Colón — **ninguna resolución de ANTAI**. Conclusión: la fecha 26-03-2026 es la de emisión, no la de publicación; la referencia de publicación apuntaba al **26-06-2026**, así que la próxima búsqueda debe ir a las Gacetas de finales de junio de 2026, no a las de marzo. Fuentes revisadas: gacetaoficial.gob.pa (Gaceta 30491-C), antai.gob.pa/legislacion, vLex Panamá, y tres firmas (Morgan & Morgan, Beccar Varela, EY). Tercera ronda consecutiva sin cerrar → si la ronda 2026-08 tampoco lo localiza, escalar al colaborador legal panameño del llamado a pares.

## VIG-07 — Fuentes ancla: Chile, Ecuador y Panamá ✅

Ejecutado 2026-07-28 en `docs/VIGILANCIA-NORMATIVA.md` §2: Ecuador ahora apunta al listado de resoluciones de la SPDP; Panamá suma la Gaceta Oficial como fuente imprescindible (ANTAI no publica todo en su web — causa raíz de que VIG-05 lleve dos rondas sin cerrar); Chile documenta que **la APDP aún no tiene sitio oficial** (inicia operaciones en el 2º semestre de 2026) y se vigila vía gob.cl / Ministerio de Economía.

---

**✅ Ejecutado 2026-07-28.** Creado `knowledge/insumos/ecuador-spdp-2026.md`: marco vigente (LOPDP + D.E. 904), las 4 resoluciones SPDP 2026 con fecha, materia y relevancia para el motor (0009-R IA · 0004-R transferencias · 0005-R gran escala · 0003-R actividades domésticas), enforcement activo (LIGAPRO) y lo que falta para construir `ecuador.json`. **Incluye la recomendación razonada del Arquitecto sobre el F_rigor de Ecuador** (5 argumentos a favor de `strict_regimes`, 1 en contra) — la decisión sigue siendo del editor, pero ya no está bloqueada por falta de evidencia. Los proyectos en consulta (biométricos, vulneraciones) quedan como ⚪ MONITOREO, sin entrar al insumo.

## Backlog de fondo (sin ticket aún — se abre cuando haya decisión)

- **Capa transversal de IA en el motor:** EDPB Guidelines 02/2026 (anonimización) y 03/2026 (web scraping para IA generativa) en consulta; NT ANPD 1/2026 (output de IA puede ser dato personal); SPDP EC 0009-R vigente. Cuando dos de las tres consoliden, amerita diseño de topic/penalizadores propios.
- **México:** publicación del Reglamento de la LFPDPPP 2025 — afecta el plazo de notificación de vulneraciones a la autoridad (hoy documentado como no exigido por la ley).
- **Chile:** primeras instrucciones generales de la APDP (ventana jun-nov 2026, prioridad máxima).

---

*Guía operativa. No constituye asesoría jurídica. Ver `DISCLAIMER.md`.*
