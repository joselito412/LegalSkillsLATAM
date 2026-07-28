# Insumo editorial — Ecuador: ola normativa SPDP 2026

> **Qué es esto:** material verificado y consolidado para construir `cli/rules/latam/ecuador.json` (ticket V2-06, Ola 3). **No es una regla del motor todavía.**
> Ticket: VIG-06 · Elaborado: 2026-07-28 · Origen: ronda de vigilancia 2026-07 (2ª pasada), hallazgo ✅ CONFIRMADO
> Estado: `pending_legal_validation` — ningún dato de aquí entra al motor sin pasar por el pipeline editorial.

## 1. Marco vigente

| Instrumento | Fecha | Contenido |
|---|---|---|
| **LOPDP** — Ley Orgánica de Protección de Datos Personales | 2021 | Ley marco. Particularidad regional: la **situación migratoria** es dato sensible. |
| **Reglamento General** — Decreto Ejecutivo 904 | 06-11-2023 | Crea la Superintendencia de Protección de Datos Personales (SPDP); régimen sancionatorio vigente desde 26-05-2023 (multas de 0.7%–1% del volumen de negocio). |

## 2. Ola de resoluciones SPDP 2026 (✅ confirmadas)

| Resolución | Fecha | Materia | Relevancia para el motor |
|---|---|---|---|
| **0009-R** | 12-02-2026 | Norma general para la protección de datos personales **en el uso de inteligencia artificial** | Alta — es de las primeras normas de la región que regula explícitamente datos + IA. Candidata a alimentar una capa transversal de IA. |
| **0004-R** | 2026 | Transferencias nacionales e internacionales | Alta — define el mecanismo de transferencia que deberá modelar `ecuador.json`. |
| **0005-R** | 2026 | Tratamiento **a gran escala** | Media-alta — el umbral de "gran escala" suele disparar obligaciones reforzadas (DPO, evaluaciones de impacto). |
| **0003-R** | 2026 | Actividades domésticas y familiares | Media — delimita la exclusión de aplicación; útil para evitar falsos positivos del motor. |

**Fuente:** [SPDP — listado de resoluciones](https://spdp.gob.ec/resoluciones2/) · [Lexis EC — norma de IA](https://www.lexis.com.ec/noticias/superintendencia-de-proteccion-de-datos-personales-expide-norma-general-para-la-proteccion-de-datos-personales-en-el-uso-de-inteligencia-artificial) · consulta 2026-07-24 / 2026-07-28.

**En consulta (⚪ MONITOREO — no usar):** proyectos sobre datos biométricos y sobre vulneraciones de seguridad.

## 3. Enforcement activo

Sanción a **LIGAPRO** por la app FAN ID. Es el dato que cambia el análisis: Ecuador no es una jurisdicción de ley "en el papel" — la SPDP está sancionando.

## 4. Implicación para el motor: decisión pendiente del F_rigor (hallazgo T1)

`region-factors.json` asigna hoy a Ecuador `f_rigor: 1.00` (base LATAM), mientras el modelo anterior — que aún vive en el fallback de `skills/audit/SKILL.md` — le daba 1.25. **La contradicción sigue abierta y bloquea MOTOR-05.**

Evidencia disponible hoy para decidir, a favor de tratar a Ecuador como régimen estricto:

1. Autoridad de control **dedicada y operativa** (SPDP), no una superintendencia genérica.
2. **Enforcement real** (caso LIGAPRO), no solo potestad teórica.
3. Producción normativa secundaria abundante y moderna en 2026 (4 resoluciones, incluida IA).
4. Sanciones por **porcentaje de volumen de negocio** (0.7%–1%), modelo GDPR-like y no de multa fija.
5. Categoría sensible propia (situación migratoria) que amplía el alcance respecto de sus pares regionales.

Argumento en contra: el rigor efectivo aún tiene poco historial acumulado de sanciones frente a Brasil.

**Recomendación del Arquitecto:** incluir Ecuador en `strict_regimes` (con `f_rigor` alineado al de Brasil, no al de la UE) y documentar la razón en `region-factors.json`. **La decisión es del editor** — hasta que se tome, MOTOR-05 debe resolverse por *assumption* visible en el output, nunca por silencio.

## 5. Qué falta para construir `ecuador.json`

- Leer el texto íntegro de las 4 resoluciones (esta ficha se basa en el listado oficial y en reseñas de firmas; **falta lectura directa artículo por artículo**).
- Plazos de derechos (la ronda 1 registró 15 días hábiles — reverificar contra la LOPDP).
- Umbrales de DPO y de "gran escala" (Res. 0005-R).
- Mecanismos de transferencia concretos (Res. 0004-R).
- Tabla de fuentes primarias en `docs/SOURCES-VALIDATION.md` al estilo de Brasil/Colombia/México.

---

*Insumo editorial. No constituye asesoría jurídica. Ver `DISCLAIMER.md`.*
