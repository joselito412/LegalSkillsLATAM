# Diseño del contrato v1.1 — decisiones de semántica antes de implementar

**Privacy Compliance Skills · Fase 4 del milestone v0.4.0**

> Elaborado: 2026-08-02 · Sesión de arquitectura (Fable 5), conforme a la *Model policy* de la Fase 4 en `.planning/ROADMAP.md`: «la semántica del contrato se decide en sesión Fable 5 **antes** de implementar».
> Estado: 📐 Diseño propuesto. **No modifica `architecture/AGENT-CONTRACT.md`** — esa consolidación es CONTRATO-03 y ocurre al cierre de la fase.
> Base empírica: medición multi-agente del 2026-08-02 (4 lentes + verificación adversarial), sobre el motor ya mergeado de la Fase 3.

---

## 0. Por qué este documento existe

La Fase 4 congela la interfaz que van a consumir `doctor` (Fase 5), la skill `/audit` S0–S7 (Fase 6) y los golden tests (Fase 5). Congelarla mal cuesta más que congelarla tarde. Antes de escribir código se midió el terreno, y el resultado cambia el tamaño de la fase respecto de lo que suponía el ticket.

**Los cuatro hechos que redefinen el alcance:**

1. **El motor puede emitir 21 penalizadores, no 13.** Solo **7** (el sub-panel DevOps) están alimentados desde un JSON con metadata rica. Los otros 14 están hardcodeados en TypeScript: id, score y label incluidos.
2. **Existen catálogos JSON ricos y completamente muertos.** `fe-penalizers.json`, `be-penalizers.json`, el bloque `penalizers` de `score-formula.json` y los bloques `penalizers` de cada país (`latam/`, `eu/`, `us/`) declaran conceptos y `legal_refs` — y **ninguno tiene un solo call-site en `cli/src`**. La doble fuente de verdad (B5) es mucho mayor de lo que documentaba el repo.
3. **El output actual no se parece al contrato.** No hay `schema_version`, ni `findings[]`, ni `topic`, ni `severity`, ni `escalation_required`, ni `pillars`. Los nombres son camelCase; las tres fuentes documentales dicen snake_case. CONTRATO-01 no es "añadir campos": es construir un serializador nuevo.
4. **`skills/audit/SKILL.md` ya está roto hoy**, no es un riesgo futuro. Espera `final_score`, `pillars`, `findings[]`, `escalation_required` y `doctor --baseline`. De todo eso, solo `level` y `assumptions` existen. Un contrato "puramente aditivo" **no** lo arregla: el problema es de nombres y estructura, no de campos faltantes.

---

## 1. Decisiones

### D1 — El contrato emite `snake_case`; el motor conserva `camelCase` internamente

**Decisión.** El JSON del contrato usa `snake_case` en todos sus campos. La conversión ocurre en un **serializador dedicado** (`cli/src/contract/`), no cambiando los tipos internos del motor.

**Por qué.** Las tres fuentes documentales y `SKILL.md` coinciden en `snake_case`; solo el motor emite `camelCase`, y su forma nunca fue un contrato deliberado — es el `JSON.stringify` de una estructura interna. Cambiar los tipos internos tocaría los 77 tests sin beneficio; un serializador aísla la interfaz pública de la representación interna, que es lo que permite evolucionar una sin romper la otra.

**Compatibilidad.** El criterio de CONTRATO-01 dice que los consumidores del v0.2 no se rompen. Medido: el **único consumidor con enforcement** son los tests de `cli/tests/`, y **no tienen ninguna aserción de forma cerrada** (cero `deepEqual` o snapshot sobre el objeto completo). Aun así, durante toda la serie `v0.4.x` el output conserva las claves camelCase actuales como **alias deprecados**, documentados y con fecha de retiro en v0.5. Nada se elimina en esta fase.

### D2 — `findings[]` es la lista canónica, y contiene solo hallazgos activos

**Decisión.** Un único array `findings[]`, con un campo `pillar` (`frontend` | `backend` | `both` | `devops`) por elemento. Los cuatro arrays actuales (`penalizers`, `fePenalizers`, `bePenalizers`, `devopsPenalizers`) se conservan como alias deprecados en `v0.4.x`.

**El array contiene únicamente los activos.** Hoy los cuatro arrays traen también los inactivos con `active: false`, mientras los tres documentos asumen que `findings[]` ya viene filtrado. Un consumidor que itere sin mirar `active` reporta hallazgos que no existen — y la skill v4 en diseño hace exactamente eso.

**Contrapartida resuelta.** El render de DOCTOR-03 celebra el *happy path* y necesita saber qué se evaluó y pasó. Para eso el contrato añade `checks_evaluated` (entero) y `checks_passed[]` (solo los ids), que dan la información sin ensuciar `findings[]`.

**Agrupación por pilar.** Se deriva filtrando por `pillar`, no manteniendo arrays paralelos. Los subtotales visibles van en `pillars` (ver D6).

### D3 — El enum de `topic` se amplía de 9 a 12 valores

**Decisión.** Se conservan los nueve actuales (`consentimiento`, `transparencia`, `clasificacion`, `cifrado`, `acceso`, `retencion`, `transferencias`, `derechos`, `devops`) y se añaden tres: **`licitud`**, **`gobernanza`** e **`incidentes`**.

**Por qué.** El enum tiene huecos en las dos direcciones. Tres de los penalizadores hardcodeados no encajan con naturalidad en ninguno de los nueve: `no_legal_basis` (la licitud del tratamiento no es consentimiento — puede ser interés legítimo o contrato), `no_dpo` (es gobernanza y *accountability*) y `no_breach_plan` (es respuesta a incidentes, no cifrado). Forzarlos a un topic ajeno degrada el loop de `/audit`, que procesa **un topic por iteración** y agruparía cosas que no se corrigen juntas.

En sentido inverso, `clasificacion` y `cifrado` no tienen hoy ningún penalizador que los emita. Se conservan igualmente: sus candidatos existen en `be-penalizers.json` y entrarán cuando ese catálogo se cablee.

Ampliar un enum es aditivo. La única condición es que `SKILL.md` (Fase 6) conozca los tres valores nuevos.

### D4 — `legal_refs` ausentes se marcan, nunca se inventan ni se omiten en silencio

**Decisión.** Cada finding lleva `legal_refs[]` y un campo `refs_status` con tres valores posibles: `from_rules` (vienen textualmente de `cli/rules/`), `pending_editorial` (el penalizador no tiene refs en ningún JSON) y `not_applicable` (el penalizador es un control interno del proyecto, no una exigencia normativa — hoy solo `do_no_ci_risk_gate`, que ya declara `legal_refs: []` en su JSON).

**Por qué.** El repo prohíbe al código inventar sustancia legal, y la restricción es correcta. Pero omitir el campo en silencio es peor que declararlo vacío: un consumidor no distingue "esta obligación no tiene norma" de "nadie la ha escrito todavía". Marcarlo convierte un vacío invisible en un dato auditable, y le da a CONTRATO-05 (`review_status` en el output) un lugar natural donde apoyarse.

**Trabajo en dos pistas, con dueños distintos.** El caso `us_multistate_exposure` lo demuestra: está cableado (código, hecho) pero su JSON no declara refs (editorial, pendiente). CONTRATO-01 **no debe bloquearse** esperando contenido que no le corresponde escribir:
- *Pista código (esta fase):* cablear `scorer.ts` a `score-formula.json.penalizers` para los **6** penalizadores clásicos que ya tienen sus `legal_refs` ahí. Es estructura, no sustancia — permitido.
- *Pista editorial (Cowork, backlog AUD):* los penalizadores que no tienen refs en ningún JSON, empezando por los tres de régimen estricto (`no_dpo`, `no_legal_basis`, `no_breach_plan`) y `us_multistate_exposure`.

**D4.1 — Los 4 ids descompuestos heredan las `legal_refs` de su concepto padre.** `minors_data_fe` y `minors_data_be` heredan de `minors_data`; `no_arco_ui` y `no_arco_backend`, de `no_arco_procedure`. Ninguno de los cuatro está declarado en un JSON, así que la herencia se decide en código mediante un mapa explícito (`DECOMPOSED_LEGAL_REFS_PARENT` en `penalizer-catalog.ts`).

*Por qué no es inventar sustancia, que es la pregunta legítima:* la descomposición 30 → 15 + 15 y 10 → 5 + 5 es **estructural, no sustantiva**. Son la misma obligación legal vista desde dos ángulos de implementación — el consentimiento parental en la UI y las restricciones técnicas en el backend responden ambos al mismo artículo. Atribuir a cada mitad las referencias de su obligación no añade una norma que el equipo editorial no haya escrito; omitirlas dejaría dos hallazgos sin fundamento jurídico visible pese a existir en el JSON. Es distinto del caso de `no_dpo`, donde **ninguna** norma está declarada en parte alguna y por eso queda vacío.

*Constancia:* esta es una decisión de arquitectura, no del implementador. Si el equipo editorial prefiere declarar los cuatro ids por separado en un JSON con sus propias referencias, el mapa desaparece y la herencia se vuelve innecesaria.

**D4.2 — Estado interino hasta el paso 4.** Hoy los penalizadores sin refs emiten `legalRefs: undefined`, lo que hace que **el campo desaparezca del JSON** — exactamente el vacío invisible que esta decisión prohíbe. Es un interino aceptable solo porque `refs_status` llega en el paso 4 del orden de ejecución; cuando llegue, el candado anti-invención que hoy asserta `undefined` debe reescribirse para asertar `refs_status: "pending_editorial"`. Queda anotado aquí para que no se descubra entonces.

### D5 — `escalation_required` se computa en el motor, con sus insumos expuestos

**Decisión.** El motor computa `escalation_required` y `escalation_reason`, y expone además `data_category` y `has_minors` en el contrato.

**Por qué.** La regla es «score ≥ 71 **o** datos sensibles + menores». Hoy `has_minors` no aparece en el output, así que un consumidor no puede verificar la segunda condición ni reproducirla. Y el cálculo no puede delegarse al LLM: sería una segunda implementación de una regla de corte de seguridad, exactamente lo que el principio rector del repo prohíbe.

**Caso borde que el diseño debe cubrir:** sensible + menores con score entre 31 y 70. Hoy `minors_data` ya está mezclado dentro del score en lugar de ser una señal independiente, así que ese caso puede no llegar a 71 y aun así requerir escalamiento. Con `has_minors` y `data_category` expuestos y el cómputo en el motor, la condición se evalúa completa.

### D6 — `pillars` reporta subtotales del pool vivo, no los scores capados del ADR

**Decisión.** `pillars: { fe, be, devops_sub }` contiene los **subtotales del pool plano que el motor ya calcula** (suma de penalizadores activos por pilar, más `c_base` en `be`), no los `fe_score`/`be_score` capados a 50 de `ADR-001`. El contrato lo documenta explícitamente para que no queden dos lecturas.

**Por qué.** La llave `pillars` está prototipada en `AGENT-CONTRACT.md` desde v1.0 y **no tiene wiring en ninguna dirección**. Las dos lecturas posibles del documento actual producen JSON Schemas incompatibles entre sí, y una de ellas implicaría cablear la fórmula del ADR — que es justo lo que D7 desaconseja. Emitir subtotales del pool vivo mantiene el contrato coherente con el número que el motor realmente produce.

### D7 — CONTRATO-03: alinear el ADR al motor, no el motor al ADR

**Recomendación con evidencia.** La medición ejecutó ambas fórmulas sobre 15 escenarios nombrados y **217.728 combinaciones**:

| Medición | Resultado |
|---|---|
| Combinaciones que cambian de nivel de riesgo | **~35 %** — 34,58 % en un barrido de 86.016 combinaciones y 36,14 % en otro de 217.728. La cifra exacta depende del espacio que se enumere; lo robusto es el orden de magnitud |
| Dirección de esos cambios | **100 % alto → medio** en ambos barridos; cero en sentido contrario |
| Delta máximo | **50 puntos** (coincide en ambos barridos) |
| Causa estructural del delta máximo | El pilar **BE carga `c_base` + sus penalizadores + *todo* el sub-panel DevOps**, así que satura en 50 mucho antes que FE, cuyos 4 penalizadores suman 45 como máximo. **No es exclusivo de `sensitive`:** se reprodujo con `personal_general` (CO, c_base 40 + 35 de penalizadores BE + 25 de DevOps → `be_raw` 100 → `be_score` 50, mientras el pool plano da 100). Con `sensitive` basta el propio `c_base` = 80 para saturar, pero es un caso particular, no la causa |
| Caso límite verificado | UE + dato sensible + **cumplimiento total** → vivo **100** (alto, escala a abogado) vs. ADR **50** (medio, no escala) |
| ¿El ADR siempre da ≤ que el pool plano? | **No.** En 0,3–1,2 % de los casos (según el espacio enumerado) da **+1** por redondeo independiente de `fe_raw` y `be_raw`; magnitud siempre exactamente 1, ningún cambio de nivel |

> **Nota de método.** Los dos barridos usan las funciones reales compiladas (`calculateScore` para la fórmula viva, `calculateFrontendScore`/`calculateBackendScore` para la del ADR), no reimplementaciones. Los porcentajes son estimaciones sobre enumeraciones arbitrarias del espacio de inputs y **no deben citarse con precisión de dos decimales** como si fueran una propiedad del motor: lo que sí es robusto y se reprodujo de forma independiente es la dirección (siempre alto → medio), el delta máximo (50) y la existencia del contraejemplo de +1.

Cablear la fórmula del ADR haría al motor **estrictamente menos sensible al riesgo**, y la pérdida recae de forma desproporcionada sobre `sensitive`, la categoría de mayor riesgo. Peor aún: esos casos son sensibles **sin** menores, así que pierden el gate por score sin activar el gate alterno — quedan sin ningún disparador de revisión humana.

Para una herramienta de riesgo legal, esa dirección es inaceptable sin una decisión editorial explícita que la asuma. **Se recomienda que CONTRATO-03 corrija `ADR-001` para que documente la fórmula viva**, dejando constancia de que la variante capada por pilar se evaluó y se descartó con estos números.

**Si el equipo decidiera lo contrario**, `escalation_required` debe rediseñarse en el mismo cambio con un gate explícito por categoría de dato. No es negociable: sin él, ese ~35 % de casos que dejan de escalar se queda sin ninguna vía de revisión humana.

**Destino de las funciones muertas.** `calculateFrontendScore` y `calculateBackendScore` están tipadas para recibir exactamente lo que necesitarían y no las llama nadie: son código «a punto de ser cableado por accidente» por cualquier PR futuro que note la pieza faltante. CONTRATO-03 debe fijar su destino — borrarlas, o marcarlas como solo-diagnóstico con un comentario que remita a este documento.

### D8 — Colapsar la duplicación antes de añadirle campos

**Decisión.** CONTRATO-01 colapsa la duplicación a una sola fuente **antes** de añadir los campos del contrato.

**El detalle importa, y la primera medición lo simplificó de más.** Verificado campo a campo entre `scorer.ts` y `frontend-scorer.ts`/`backend-scorer.ts`:

- **7 ids están duplicados literalmente** (mismo id, mismo score, en ambos sitios): `no_granular_consent`, `no_privacy_policy`, `non_adequate_servers`, `unstructured_international_transfer`, `no_dpo`, `no_legal_basis`, `no_breach_plan`.
- **De esos 7, dos ya tienen labels divergentes:** `no_breach_plan` («Sin plan de respuesta a brechas de seguridad» vs. «…a brechas (LGPD/GDPR)») y `unstructured_international_transfer` («…sin cláusulas contractuales» vs. «…sin DPA / cláusulas contractuales»).
- **2 ids NO están duplicados sino descompuestos:** `minors_data` (30) existe solo en `scorer.ts` y en los scorers de pilar aparece como `minors_data_fe` (15) + `minors_data_be` (15); igual `no_arco_procedure` (10) → `no_arco_ui` (5) + `no_arco_backend` (5).

**Consecuencia para la implementación.** No es un *dedupe* mecánico. Los 7 duplicados sí se colapsan a una definición única; los 2 descompuestos **deben conservar su descomposición**, porque el desglose por pilar es deliberado: el control de menores en la UI (flujo de consentimiento parental) y en el backend (restricciones técnicas) son remediaciones distintas con dueños distintos. Colapsarlos a uno solo perdería información que el render por pilar necesita.

**Por qué hacerlo antes.** Es el mismo patrón que produjo el bug T1: dos sitios que divergen en silencio, y aquí ya divergieron. Añadir `legal_refs`, `fix_hint` y `topic` a dos copias duplica el problema en vez de resolverlo.

### D9 — `config_key` no siempre existe, y el contrato debe admitirlo

**Decisión.** `config_key` es **nullable**. Cuando el finding no se desactiva con una sola llave booleana, el contrato lo declara `null` y usa `evidence_needed` para explicar qué corrige el hallazgo.

**Por qué.** La semántica «`config_key` es la llave que, al corregirse, desactiva el finding» no aplica 1:1 a tres casos reales: `non_adequate_servers` depende de un string de tres valores (`adequate`/`inadequate`/`unknown`), `unstructured_international_transfer` depende de una condición compuesta (`third_parties[]` + `transfer_destinations[]` + las decisiones de adecuación del país), y los tres de régimen estricto están gateados además por pertenencia a `strict_regimes`. Forzar una llave única en esos casos induciría al agente a voltear un booleano que no corresponde — justo la conducta que `SKILL-01` prohíbe («nunca voltear la llave para bajar el score»).

---

## 2. Orden de ejecución propuesto para la Fase 4

| # | Trabajo | Ticket | Depende de |
|---|---|---|---|
| 1 | Passthrough de `topic` en el sub-panel DevOps (el campo **ya existe** en `devops-penalizers.json` y el código no lo copia) | CONTRATO-01 | — |
| 2 | Colapsar la duplicación de los 9 penalizadores clásicos a una sola fuente (D8) | CONTRATO-01 | — |
| 3 | Cablear `scorer.ts` a `score-formula.json.penalizers` para heredar `legal_refs` de los 6 que ya las tienen (D4, pista código) | CONTRATO-01 | 2 |
| 4 | Serializador del contrato + `schema_version` + `findings[]` + JSON Schema **nuevo** (no existe ninguno hoy) | CONTRATO-01 | 1, 2, 3 |
| 5 | `jurisdictions[]` y `recipe_ref` | CONTRATO-02 | 4 |
| 6 | `unknown` vs `absent` y `score_basis` | CONTRATO-04 | 4 |
| 7 | `review_status` por finding + flag global | CONTRATO-05 | 4, D4 |
| 8 | Consolidar `AGENT-CONTRACT.md` y resolver la divergencia numérica | CONTRATO-03 | todo lo anterior |

El paso 1 es deliberadamente el primero: es el gap más barato del inventario y valida el patrón de passthrough sobre 7 penalizadores antes de aplicarlo a los otros 14.

---

## 3. Lo que este diseño **no** decide

- **La sustancia legal.** Qué `legal_refs`, `fix_hint` o `config_key` corresponden a cada penalizador sin respaldo es trabajo editorial (Cowork, backlog `AUD-*`). El diseño solo garantiza que el vacío sea **visible** (D4).
- **La dirección final de CONTRATO-03.** D7 es una recomendación con evidencia; la decisión de producto es del owner.
- **El permiso del plugin.** `.claude-plugin/plugin.json` declara `skill_permissions.audit.system_commands: false` y «No external calls», en contradicción directa con lo que `SKILL.md` instruye ejecutar (`npx privacy-compliance-skills audit --config --json`). Si ese manifiesto se aplica literalmente en el runtime del marketplace, **el canal de la CLI es inalcanzable para el agente empaquetado**, y ninguna forma del JSON lo arregla. Es un problema de permisos anterior al contrato, y merece decisión propia antes de la Fase 6.

---

*Privacy Compliance Skills — [DISCLAIMER.md](../DISCLAIMER.md)*
*Guía informativa. No constituye asesoría jurídica.*
