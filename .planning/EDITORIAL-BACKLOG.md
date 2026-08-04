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
| AUD-01 | USA: `legal_refs`/`fix_hint`/`config_key` en `usa-federal.json` | Alta | 🆕 Abierto 2026-07-28 |
| AUD-02 | USA: bendecir o sustituir la llave `us_state_laws_mapped` | Media | 🆕 Abierto 2026-07-28 |
| AUD-03 | Ecuador: ratificar `strict_regimes` (→ VIG-06) | Alta | 🔗 Enlazado a VIG-06 |
| AUD-04 | Brasil: `assumption` al suprimir por adecuación BR→UE | Media | 🆕 Abierto 2026-07-28 |
| AUD-05 | Motor: step/cap del escalado USA a campos estructurados | Baja | 🆕 Abierto 2026-07-28 |

> Los **AUD-\*** provienen de la auditoría del motor (Fase 3) y se detallan al final del documento. A diferencia de los VIG-\*, no nacen de una ronda de vigilancia normativa sino de campos que el motor necesita y el contenido aún no declara.

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

# Insumos de la auditoría del motor (Fase 3, 2026-07-28)

**Origen:** auditoría adversarial de cierre de la Fase 3 (`.planning/AUDITORIA-FASE-3-2026-07-28.md`), PRs #18 y #19.

> Estos cinco items son **decisiones del editor**, no tareas de código. Aparecen aquí porque el motor ya está cableado y funcionando, y en cada caso topó con un campo que el JSON no declara o con un criterio que solo el editor puede fijar. **La sesión de código tiene prohibido resolverlos escribiendo en `cli/rules/**`**: mientras no haya decisión editorial, el motor se comporta como está descrito abajo, que es el default seguro.

## AUD-01 — Poblar `legal_refs`, `fix_hint` y `config_key` en `usa-federal.json`

**Archivo:** `cli/rules/us/usa-federal.json` → empezando por el penalizador `us_multistate_exposure`.

MOTOR-03 cableó el penalizador y funciona: se activa con 2+ estados sin mapear y no con 1. Pero el JSON declara solo `id`, `description`, `score`, `applies_when` y `pillar` — **no declara `legal_refs`, `fix_hint` ni `config_key`**. El motor hace passthrough fiel y tiene **prohibido inventarlos**, así que hoy el finding llega al usuario con puntos y descripción pero **sin fundamento normativo citado y sin llave de corrección**. Hay un test que blinda la ausencia actual precisamente para que nadie la "resuelva" desde código.

**Criterios de aceptación:**
- El penalizador declara `legal_refs` con norma, artículo y URL oficial, en el mismo formato que usan los penalizadores de los JSON LATAM ya poblados.
- Declara un `fix_hint` accionable (qué debe hacer el equipo, no qué dice la ley) y un `config_key` que el motor pueda leer.
- Se revisa el resto de penalizadores de `usa-federal.json` con el mismo criterio: el ticket no se cierra dejando otros con el mismo vacío sin al menos inventariarlos.
- Tras poblarlos, el test que hoy blinda la ausencia debe **actualizarse** (es señal esperada de que el vacío se cerró, no una regresión).

## AUD-02 — Bendecir o sustituir la llave `us_state_laws_mapped`

**Archivo:** `cli/rules/us/usa-federal.json`.

La condición de activación de `us_multistate_exposure` depende hoy de una llave llamada `us_state_laws_mapped` que **es wiring del motor, no vocabulario editorial**: el JSON no declara `config_key` para ese penalizador, así que el nombre lo puso el código por necesidad. Es la única llave del sistema en esa situación.

**Criterios de aceptación:**
- El editor confirma el nombre (y entonces se declara explícitamente como `config_key` en el JSON, de modo que la fuente de verdad pase del código al contenido) **o** lo sustituye por el término que prefiera.
- La semántica queda escrita sin ambigüedad: qué significa exactamente que un equipo tenga "mapeadas" las leyes estatales, ya que de eso depende que el penalizador se apague.
- Cualquiera de las dos salidas queda reflejada en la documentación de llaves de configuración que consumirá CONTRATO-04.

## AUD-03 — Ratificar la decisión sobre Ecuador en `strict_regimes`

**Ya trackeado en VIG-06** (ver arriba, con el insumo `knowledge/insumos/ecuador-spdp-2026.md` y la recomendación razonada del Arquitecto). Se enlaza desde aquí en vez de duplicarlo: la auditoría no aporta evidencia jurídica nueva, solo confirma que la decisión sigue abierta y que el motor la está esperando.

**Conducta correcta mientras tanto:** el default seguro implementado por MOTOR-05 —Ecuador queda estricto **y** el output emite un `assumptions[]` visible que nombra la decisión pendiente y su fuente— es lo que debe seguir haciendo el motor. No se debilita el rigor en silencio, y el usuario ve que hay un supuesto en juego. **El ticket se cierra con la decisión de VIG-06**, no con un cambio de código.

## AUD-04 — Evaluar una `assumption` al suprimir el penalizador de transferencia por adecuación BR→UE

**Archivo:** `cli/rules/latam/brasil.json` → `international_transfer`.

VIG-01 hizo lo correcto: una transferencia BR→UE con adecuación vigente ya no se marca en rojo. Pero el registro editorial de esa misma adecuación deja constancia de **exclusiones** (seguridad pública, defensa nacional, seguridad del Estado e investigación penal) que **el motor no modela**: no tiene cómo saber si el tratamiento del usuario cae en alguna de ellas. Hoy, por tanto, **suprime el penalizador sin dejar rastro** de que la supresión descansa en un supuesto.

**Criterios de aceptación:**
- El editor decide si conviene emitir una `assumption` visible al suprimir por adecuación, del tipo "se asume que la transferencia no cae en las exclusiones registradas para esta decisión de adecuación", y redacta su texto con las citas que correspondan.
- Queda explícito que **esto no cambia el score** — solo añade trazabilidad sobre por qué el penalizador no aparece.
- Se evalúa si el mismo criterio aplica a futuras decisiones de adecuación de otras jurisdicciones, para no resolverlo caso por caso.
- **El mecanismo ya existe y no requiere trabajo de código nuevo:** es el mismo `assumptions[]` que MOTOR-05 usa para Ecuador, alimentado desde el JSON.

## AUD-05 — Decidir si el step y el cap del escalado USA pasan a campos estructurados

**Archivo:** `cli/rules/risk-engine/region-factors.json` → hoy la información vive en prosa, en `blocks.us.scaling_note`.

El escalado multi-estatal de MOTOR-02 (**+0.02 por estado adicional con ley integral, tope 1.20**) es **el único parámetro numérico del motor sin un campo JSON que lo respalde**: el JSON lo describe en una nota de texto y el código lo implementa como dos constantes. Todos los demás factores se leen del JSON, de modo que cambiar la política no exige tocar código — este no.

**Criterios de aceptación:**
- El editor decide si el step y el cap se promueven a campos estructurados (p. ej. junto al bloque `us`) o si se mantienen como nota en prosa por ser política del motor y no contenido normativo.
- Si se promueven: los valores nuevos deben ser **idénticos a los actuales** (0.02 y 1.20) — es una migración de forma, no una recalibración; cualquier cambio de valor es una decisión aparte, con su propio análisis de impacto en scores.
- La `scaling_note` en prosa se conserva o se reescribe para no contradecir los campos nuevos.
- Queda anotado como insumo de QA-11 (derivar los valores esperados de los tests desde el JSON) y de QA-09 (schema de `risk-engine/`).

---

*Guía operativa. No constituye asesoría jurídica. Ver `DISCLAIMER.md`.*
