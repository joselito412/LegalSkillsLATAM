# Auditoría adversarial de cierre — Fase 3 (motor) · 2026-07-28

**Alcance:** delta completo `develop..fase-3b-usa-devops` (milestone v0.4.0, PRs #18 y #19)
**Estado del código auditado:** `cd cli && npm run build && npm test` → 77/77 · `node scripts/validate.js` → 14 archivos, 0 errores de schema
**Tickets derivados:** MOTOR-09, QA-09, QA-10, QA-11 y 6 anotaciones sobre tickets existentes — ver `.planning/REQUIREMENTS.md`
**Insumos editoriales derivados:** sección "Insumos de la auditoría del motor" en `.planning/EDITORIAL-BACKLOG.md`

> Este documento existe para que el valor de la auditoría no se pierda: registra qué se corrigió, **qué se refutó y por qué** (para que no reaparezca como pendiente en revisiones futuras) y qué riesgo queda vivo.

---

## 1. Método y alcance

La auditoría corrió como un ejercicio **multi-agente adversarial** sobre el delta completo de la fase, no sobre commits sueltos. Se aplicaron **5 lentes independientes**, cada una sin acceso a las conclusiones de las otras:

1. **Corrección numérica** — la fórmula, el cap, el escalado y los redondeos.
2. **Fidelidad jurídica** — que el motor respete lo que dicen los JSON de reglas y no invente nada.
3. **Robustez y modos de fallo** — qué pasa cuando un JSON falta, está corrupto o trae un tipo equivocado.
4. **Contrato e interfaz** — qué ve un consumidor máquina: stdout, exit codes, forma del JSON.
5. **Cobertura de tests** — qué afirma la suite y, sobre todo, **qué dejaría pasar**.

La regla de oro fue que **ningún hallazgo se acepta por argumento**: cada uno pasó por una refutación adversarial que exigía **ejecutar código** — mutar la fuente y observar si la suite lo detectaba, o correr el CLI compilado y comparar la salida real contra la afirmación. Esa disciplina es la que descartó 13 de los 20 hallazgos brutos.

**Cifras:** 26 agentes · 20 hallazgos brutos · 13 refutados · **7 confirmados**.

---

## 2. Las correcciones aplicadas antes del merge

Cuatro defectos reales entraron a `develop` ya corregidos. Tres los encontró la auditoría; el cuarto salió de la verificación manual de cierre, previa a ella.

### `78ac9ac` — el cap DevOps no numérico producía un verde falso en CI

**Severidad: alta.** Si `scoring_rules.max_total` de `devops-penalizers.json` dejaba de ser un número (un string `"30"`, un `null`, una llave renombrada por una edición editorial), `Math.min(devopsRaw, undefined)` devolvía `NaN`, que se propagaba sin ruido a través de toda la fórmula hasta `finalScore`. El resultado no era un crash sino algo peor: el JSON emitía `"finalScore": null` acompañado de un nivel de riesgo bajo, y **`--fail-on 71` salía con exit 0**. Es decir, un pipeline de CI configurado justamente para bloquear despliegues riesgosos los habría dejado pasar en verde, en silencio, por un cambio de tipo en un archivo que el equipo editorial edita con normalidad.

**Corrección:** guard *fail-loud* en el loader — si el cap no es numérico, el CLI falla ruidosamente con stderr accionable y sin emitir un `finalScore` inválido. Cubierto por el test "motor-06: devops-penalizers.json sin scoring_rules.max_total numérico → el CLI compilado falla ruidosamente (exit != 0, stderr accionable, sin finalScore:null en stdout)".

### `399a1c6` — la invariante central del fix T1 no estaba blindada

**Severidad: alta (defecto de cobertura, no de comportamiento).** El fix T1 —lo bloqueante de toda la fase— consiste en que los tres penalizadores reforzados se activen **solo** en régimen estricto. La auditoría mutó el código eliminando el guard `strict &&` y **los 68 tests de entonces siguieron en verde**. La suite verificaba que los países estrictos activaran los penalizadores, pero nunca que los no estrictos **no** los activaran. El radio de esa laguna: **+50 puntos sobre todo país no estricto** (CO, MX, PE, AR…), un sobre-reporte masivo que ningún test habría detectado.

**Corrección:** tests de dirección negativa en los **dos** sitios que evalúan el trío ("MOTOR-04 dirección negativa…" sobre `calculateScore()` y sobre `getBackendPenalizers()`), más un candado de duplicación que exige que ambos caminos coincidan en id/score/active. Verificados **por mutación**: se rompió el guard a propósito y la suite ahora falla.

### `cd92c8c` — las 3 llaves de régimen estricto reventaban el modo no interactivo

**Severidad: alta.** Las nuevas llaves de la Fase 3B se habían incorporado al patrón no interactivo de `--config`, pero **las tres llaves de régimen estricto quedaron fuera**. Un `legalskills.config.json` de Brasil, la UE o Ecuador sin `has_dpo` lanzaba un prompt interactivo: bajo CI, sin TTY, el proceso reventaba **saliendo con exit 0 y sin emitir JSON** — otro verde falso, esta vez para el consumidor máquina.

**Corrección:** el gate ahora sale con **exit 2** nombrando en stderr las llaves faltantes, en vez de degradar el score en silencio o colgarse. Se acotó deliberadamente al régimen estricto: un proyecto de CO sin esas llaves sigue corriendo con exit 0. Cubierto por "defecto vivo: config de BR SIN has_dpo + --config --json → exit 2, stderr menciona has_dpo, stdout sin JSON parseable" y su camino feliz.

### `ee244ad` — `--json` no emitía JSON puro *(hallado en la verificación manual de cierre, previo a la auditoría)*

**Severidad: alta para el contrato.** `--json` escribía a **stdout** un aviso legible por humanos antes del JSON. Cualquier consumidor que hiciera `JSON.parse(stdout)` —es decir, el uso entero del modo máquina, incluidos la skill `/audit` y los futuros golden tests— fallaba en el primer carácter. **Corrección:** stdout queda reservado para el JSON; lo humano va a stderr. Cubierto por "--config --json emite SOLO JSON en stdout (contrato máquina)".

---

## 3. Hallazgos refutados

Estos 13 hallazgos se investigaron y **se descartaron con evidencia**. Se registran aquí con su razón para que una revisión futura no los reabra como pendientes.

| # | Hallazgo | Por qué se refutó |
|---|---|---|
| 1 | **Divergencia del cap por pilar** entre `ADR-001` (`min(100, fe+be)`, cap 50 por pilar) y el motor (pool plano) | Real, pero **preexistente a la Fase 3** y con dirección **conservadora**: el pool plano siempre da ≥ que `min(100, fe+be)`, así que nunca subreporta riesgo. No es defecto de esta fase → decisión editorial en **CONTRATO-03**. |
| 2 | **Caché de módulo en los loaders** de reglas | Correcto en el modelo de ejecución real: el CLI es *one-shot* (`program.parse()` → acción → exit). No hay proceso de larga vida donde el caché pueda servir un JSON obsoleto. |
| 3 | **`currentDate()` con `LLS_FAKE_NOW` inválido** cae a la fecha real | Contrato documentado y de dirección **fail-safe**: ante un reloj inyectado ilegible, el motor usa el tiempo real en vez de una fecha arbitraria. Intencional, no bug (queda documentado en QA-03). |
| 4 | **Ausencia de `legal_refs` en `us_multistate_exposure`** | No es defecto del motor: el JSON no los declara y el código tiene **prohibido** inventarlos. Vacío **editorial**, con un test que blinda la ausencia actual para que nadie la "arregle" desde código → backlog editorial (AUD-01). |
| 5 | **Exit 1 con archivo de config ausente** (en vez de 2) | Inconsistencia real pero **preexistente**, y la tabla de exit codes vive bajo `doctor` → anotado en **DOCTOR-01**, que es donde se congela. |
| 6 | **Normalización de `countries` dentro del motor** | El defecto existe (`"br"` → F_rigor 1.00), pero hoy es **inalcanzable**: los dos únicos puntos de entrada normalizan antes de llamar al motor. Se abre como **MOTOR-09** porque **DOCTOR-01 lo vuelve alcanzable** al añadir un tercer punto de entrada. |

Los siete restantes fueron variantes menores de los anteriores o afirmaciones que no sobrevivieron a la ejecución del código (típicamente: "este caso no está cubierto" desmentido al localizar el test que sí lo cubre).

---

## 4. Riesgos residuales

### 4.1 Chile entra a régimen estricto el 2026-12-01 **sin intervención humana**

Es el riesgo con fecha, y conviene decirlo sin rodeos. `region-factors.json` declara `strict_from: "2026-12-01"` para Chile y el motor lo evalúa contra el reloj del sistema con un `>=` inclusivo. **Ese día, sin que nadie despliegue nada ni cambie una línea**, todo proyecto con `countries: ["CL"]` empieza a:

- activar los tres penalizadores reforzados (DPO +15, base legal +20, brechas +15), con el salto de score que eso implica; y
- **exigir las tres llaves** `has_dpo` / `has_legal_basis` / `has_breach_plan` en `--config`, saliendo con **exit 2** si faltan (el gate de `cd92c8c`).

Dicho de otro modo: un pipeline de CI de un cliente chileno que hoy pasa en verde puede **empezar a fallar el 1 de diciembre** por un cambio de calendario, no de código. El comportamiento es **jurídicamente correcto y deliberado** —esa es la fecha de vigencia—, pero es un cambio de contrato con fecha diferida que debe comunicarse antes, no descubrirse. Recomendación: incluirlo en las release notes de v0.4.0 (REL-03) y considerar un aviso anticipado en el output para proyectos CL en la ventana previa.

Nota de cobertura asociada: los tests cubren 12 h antes y 12 h después del corte, pero **no la frontera exacta**; hoy mutar `>=` a `>` pasa en verde. El candado fino está anotado en **QA-03**.

### 4.2 Higiene de validación: `validate.js` da 0 errores, pero no valida lo que gobierna el motor

`node scripts/validate.js` reporta **14/14 y 0 errores**, y ese número es fácil de leer como "todo está validado". No lo está: los seis archivos de `cli/rules/risk-engine/` —`region-factors.json`, `devops-penalizers.json`, `be-penalizers.json`, `fe-penalizers.json` y las dos `score-formula`— salen catalogados **`no-schema`**, lo que significa que **solo se verificó que parseen como JSON**. Son precisamente los archivos que gobiernan el motor.

Su cobertura real hoy son **los tests**, no la validación. Eso funciona, pero deja la puerta abierta a que una edición estructuralmente válida y semánticamente destructiva (borrar un miembro de `strict_regimes`, cambiar el tipo de `max_total`) pase el validador sin una advertencia. El fail-loud de `78ac9ac` cubre el caso concreto del cap; **QA-09** generaliza la defensa con un schema propio.

### 4.3 Otros dos, ya trackeados

- **Subreporte silencioso por llave ausente** bajo `--config`: fuera de las tres llaves estrictas, una llave que falta desactiva su penalizador sin dejar rastro en el output. Mitigación real pendiente en **CONTRATO-04**.
- **Tabla `rigor_factors` huérfana** en `score-formula.json` y `score-formula-v2.json`, con valores que ya no reflejan la realidad (`strict_regime: 1.25` frente a BR 1.15, CL 1.10). Se verificó que **el motor no la lee** (cero referencias en `cli/src`), así que no afecta ningún score; queda como deuda de contenido que podría inducir a error si alguien reactivara el campo. Es sustancia de un JSON de reglas: su limpieza es editorial, no de código.

---

## 5. Lectura para quien retome la fase

1. `.planning/REQUIREMENTS.md` — MOTOR-09, QA-09/10/11 y las anotaciones en CONTRATO-03, CONTRATO-04, QA-03, DOCTOR-01 y SKILL-01.
2. `.planning/EDITORIAL-BACKLOG.md` — los insumos que dependen de una decisión del editor, no de código.
3. `.planning/ROADMAP.md` §Phase 3 → bloque **Resultado**, con el veredicto criterio por criterio.

---

*Documento de planeación. El contenido legal referido no constituye asesoría jurídica. Ver `DISCLAIMER.md`.*
