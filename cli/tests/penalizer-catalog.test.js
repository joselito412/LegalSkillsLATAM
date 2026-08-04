/**
 * Candado de fuente única para penalizer-catalog.ts (CONTRATO-01, paso 2 —
 * architecture/AGENT-CONTRACT-V1.1-DESIGN.md §D8).
 *
 * Antes de este archivo, 7 ids estaban definidos DOS VECES — una en
 * scorer.ts (lista combinada) y otra en frontend-scorer.ts/backend-scorer.ts
 * (lista de pilar) — y dos labels ya habían divergido en silencio (mismo
 * patrón que el bug T1). Este test verifica programáticamente que ya no
 * puedan divergir: compara los objetos que devuelve cada lista, no a mano.
 *
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { calculateDualScore } from "../dist/engine/scorer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const formulaJson = JSON.parse(
  readFileSync(join(__dirname, "../rules/risk-engine/score-formula.json"), "utf8")
);
const formulaPenalizersById = new Map(formulaJson.penalizers.map((p) => [p.id, p]));

function testInput(overrides) {
  return {
    projectName: "Catalog test",
    countries: ["BR"], // régimen estricto: ejercita no_dpo/no_legal_basis/no_breach_plan
    dataCategory: "sensitive",
    hasMinors: true,
    hasGranularConsent: false,
    serverRegion: "inadequate",
    thirdPartyTransfers: true,
    hasPrivacyPolicy: false,
    hasArcoProcedure: false,
    hasDpo: false,
    hasLegalBasisPerPurpose: false,
    hasBreachResponsePlan: false,
    ...overrides,
  };
}

// Los 7 ids compartidos entre la lista combinada (scorer.ts) y el scorer de
// su pilar (frontend-scorer.ts o backend-scorer.ts), con el pilar donde
// deben aparecer duplicados.
const SHARED_IDS_BY_PILLAR = {
  no_granular_consent: "fe",
  no_privacy_policy: "fe",
  non_adequate_servers: "be",
  unstructured_international_transfer: "be",
  no_dpo: "be",
  no_legal_basis: "be",
  no_breach_plan: "be",
};

// Segundo input, CONTRASTANTE con testInput() (verificación adversarial, O1):
// país NO estricto (CO) con los 4 controles compartidos "cumplidos" y los 3
// campos de régimen reforzado en `false` pese al país no ser estricto. Esto
// ejercita el guard `isStrict &&` en el sentido CONTRARIO a testInput() (BR,
// estricto, mismos 3 campos en `false` → activo): aquí el campo por sí solo
// diría "no cumple", pero el guard debe mantenerlo inactivo porque el país no
// es de régimen estricto. Sin este segundo input con `active` en la
// comparación, un predicado `active: () => true` constante pasaría igual
// (con testInput() los 7 ya salen activos) y el guard `isStrict` no quedaría
// ejercitado en ninguna dirección.
function guardContrastInput(overrides) {
  return {
    projectName: "Catalog test (contraste)",
    countries: ["CO"], // régimen NO estricto
    dataCategory: "public",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
    hasDpo: false,
    hasLegalBasisPerPurpose: false,
    hasBreachResponsePlan: false,
    ...overrides,
  };
}

test("CONTRATO-01 (paso 2, endurecido por O1): candado de fuente única — los 7 ids compartidos son deep-equal (id/label/score/pillar/active) entre la lista combinada y el scorer de su pilar, en dos inputs contrastantes", () => {
  for (const input of [testInput(), guardContrastInput()]) {
    const result = calculateDualScore(input);

    for (const [id, pillar] of Object.entries(SHARED_IDS_BY_PILLAR)) {
      const combined = result.penalizers.find((p) => p.id === id);
      const pillarList = pillar === "fe" ? result.fePenalizers : result.bePenalizers;
      const fromPillar = pillarList.find((p) => p.id === id);

      assert.ok(combined, `${id}: ausente en la lista combinada (result.penalizers), input=${input.projectName}`);
      assert.ok(
        fromPillar,
        `${id}: ausente en la lista de pilar (${pillar === "fe" ? "fePenalizers" : "bePenalizers"}), input=${input.projectName}`
      );

      assert.deepEqual(
        { id: combined.id, label: combined.label, score: combined.score, pillar: combined.pillar, active: combined.active },
        { id: fromPillar.id, label: fromPillar.label, score: fromPillar.score, pillar: fromPillar.pillar, active: fromPillar.active },
        `${id}: diverge entre la lista combinada y la de pilar (id/label/score/pillar/active deben ser deep-equal), input=${input.projectName}`
      );
    }
  }

  // Candado anti-gaming: los dos inputs deben producir `active` distinto para
  // los 7 ids — si no, la comparación de arriba no distinguiría un predicado
  // constante (`active: () => true`) de uno real.
  const activeInA = calculateDualScore(testInput()).penalizers;
  const activeInB = calculateDualScore(guardContrastInput()).penalizers;
  for (const id of Object.keys(SHARED_IDS_BY_PILLAR)) {
    const a = activeInA.find((p) => p.id === id)?.active;
    const b = activeInB.find((p) => p.id === id)?.active;
    assert.notEqual(a, b, `${id}: los dos inputs contrastantes deben producir \`active\` distinto`);
  }
});

test("CONTRATO-01 (paso 2): minors_data y no_arco_procedure son EXCLUSIVOS de la lista combinada — no aparecen en fePenalizers ni bePenalizers", () => {
  const result = calculateDualScore(testInput());

  assert.ok(result.penalizers.find((p) => p.id === "minors_data"), "minors_data debe estar en la lista combinada");
  assert.ok(result.penalizers.find((p) => p.id === "no_arco_procedure"), "no_arco_procedure debe estar en la lista combinada");

  for (const list of [result.fePenalizers, result.bePenalizers]) {
    assert.equal(list.find((p) => p.id === "minors_data"), undefined, "minors_data no debe aparecer en una lista de pilar");
    assert.equal(list.find((p) => p.id === "no_arco_procedure"), undefined, "no_arco_procedure no debe aparecer en una lista de pilar");
  }
});

test("CONTRATO-01 (paso 2): las 4 variantes descompuestas son EXCLUSIVAS de las listas de pilar — no aparecen en la lista combinada", () => {
  const result = calculateDualScore(testInput());

  assert.ok(result.fePenalizers.find((p) => p.id === "minors_data_fe"), "minors_data_fe debe estar en fePenalizers");
  assert.ok(result.fePenalizers.find((p) => p.id === "no_arco_ui"), "no_arco_ui debe estar en fePenalizers");
  assert.ok(result.bePenalizers.find((p) => p.id === "minors_data_be"), "minors_data_be debe estar en bePenalizers");
  assert.ok(result.bePenalizers.find((p) => p.id === "no_arco_backend"), "no_arco_backend debe estar en bePenalizers");

  for (const id of ["minors_data_fe", "minors_data_be", "no_arco_ui", "no_arco_backend"]) {
    assert.equal(
      result.penalizers.find((p) => p.id === id),
      undefined,
      `${id}: no debería estar en la lista combinada (result.penalizers)`
    );
  }
});

// ─── CONTRATO-01, paso 3 (§D4, pista código): legal_refs heredadas de ──────
// score-formula.json.penalizers ──────────────────────────────────────────

// Los 6 ids que score-formula.json.penalizers declara con legal_refs.
const FORMULA_SOURCED_IDS = [
  "no_granular_consent",
  "minors_data",
  "non_adequate_servers",
  "unstructured_international_transfer",
  "no_privacy_policy",
  "no_arco_procedure",
];

test("CONTRATO-01 (paso 3): candado de passthrough fiel — legalRefs de los 6 ids clásicos es deep-equal a score-formula.json.penalizers[].legal_refs (leído directo con readFileSync, mismo patrón que MOTOR-08)", () => {
  const result = calculateDualScore(testInput());

  for (const id of FORMULA_SOURCED_IDS) {
    const penalizer = result.penalizers.find((p) => p.id === id);
    assert.ok(penalizer, `${id}: ausente en result.penalizers`);

    const expected = formulaPenalizersById.get(id)?.legal_refs;
    assert.ok(expected, `${id}: score-formula.json no declara legal_refs — fixture del test desactualizado`);

    assert.deepEqual(penalizer.legalRefs, expected, `${id}: legalRefs no es deep-equal a score-formula.json`);
  }
});

test("CONTRATO-01 (paso 3): los 4 ids descompuestos heredan legalRefs de su concepto padre (mapeo explícito: minors_data_fe/be ← minors_data, no_arco_ui/backend ← no_arco_procedure)", () => {
  const result = calculateDualScore(testInput());

  const minorsData = result.penalizers.find((p) => p.id === "minors_data");
  const noArcoProcedure = result.penalizers.find((p) => p.id === "no_arco_procedure");
  const minorsDataFe = result.fePenalizers.find((p) => p.id === "minors_data_fe");
  const minorsDataBe = result.bePenalizers.find((p) => p.id === "minors_data_be");
  const noArcoUi = result.fePenalizers.find((p) => p.id === "no_arco_ui");
  const noArcoBackend = result.bePenalizers.find((p) => p.id === "no_arco_backend");

  assert.ok(minorsData?.legalRefs, "minors_data debe traer legalRefs (es el padre)");
  assert.ok(noArcoProcedure?.legalRefs, "no_arco_procedure debe traer legalRefs (es el padre)");

  assert.deepEqual(minorsDataFe.legalRefs, minorsData.legalRefs, "minors_data_fe debe heredar legalRefs de minors_data");
  assert.deepEqual(minorsDataBe.legalRefs, minorsData.legalRefs, "minors_data_be debe heredar legalRefs de minors_data");
  assert.deepEqual(noArcoUi.legalRefs, noArcoProcedure.legalRefs, "no_arco_ui debe heredar legalRefs de no_arco_procedure");
  assert.deepEqual(
    noArcoBackend.legalRefs,
    noArcoProcedure.legalRefs,
    "no_arco_backend debe heredar legalRefs de no_arco_procedure"
  );
});

test("CONTRATO-01 (paso 3): candado anti-invención — no_dpo, no_legal_basis y no_breach_plan no existen en ningún JSON de reglas, así que legalRefs es undefined (nunca fabricado)", () => {
  const result = calculateDualScore(testInput());

  for (const id of ["no_dpo", "no_legal_basis", "no_breach_plan"]) {
    const combined = result.penalizers.find((p) => p.id === id);
    const backend = result.bePenalizers.find((p) => p.id === id);

    assert.ok(combined, `${id}: ausente en result.penalizers`);
    assert.ok(backend, `${id}: ausente en result.bePenalizers`);

    assert.equal(combined.legalRefs, undefined, `${id}: legalRefs debe ser undefined en la lista combinada`);
    assert.equal(backend.legalRefs, undefined, `${id}: legalRefs debe ser undefined en bePenalizers`);
  }
});

// ─── O2 (verificación adversarial): candado score vs. score-formula.json ───
// Editar score-formula.json (ej. no_privacy_policy.score 10→25) cambiaba el
// Legal Risk Score en silencio, y editar minors_data.score (30→99) no cambiaba
// NADA — porque solo no_privacy_policy lee su score del JSON en tiempo de
// ejecución; los otros 5 lo tienen pineado en penalizer-catalog.ts. Este
// candado NO cambia esa arquitectura (el ticket prohíbe tocar código para
// esto) — solo asserta que, HOY, los valores pineados coinciden con los del
// JSON. Si algún día divergen (alguien edita uno de los dos sin el otro), el
// test lo dice explícitamente en vez de dejar que el score se mueva en
// silencio.

test("O2: candado score — para los 6 ids declarados en score-formula.json, el score que emite el motor es igual al declarado en el JSON (leído directo con readFileSync)", () => {
  const result = calculateDualScore(testInput());

  for (const id of FORMULA_SOURCED_IDS) {
    const penalizer = result.penalizers.find((p) => p.id === id);
    assert.ok(penalizer, `${id}: ausente en result.penalizers`);

    const expectedScore = formulaPenalizersById.get(id)?.score;
    assert.equal(
      typeof expectedScore,
      "number",
      `${id}: score-formula.json no declara un score numérico — fixture del test desactualizado`
    );

    assert.equal(
      penalizer.score,
      expectedScore,
      `${id}: score del motor (${penalizer.score}) diverge de score-formula.json (${expectedScore})`
    );
  }
});

// ─── O6 (verificación adversarial): legalRefs/standardsRefs no comparten ───
// referencia con la caché de reglas del proceso ─────────────────────────────
// Antes de este fix, PenalizerResult.legalRefs era literalmente el array
// loadFormula().penalizers[i].legal_refs — compartido, además, entre un
// concepto padre (ej. minors_data) y sus variantes descompuestas heredadas
// (minors_data_fe/be). Un `push` desde cualquier consumidor habría
// contaminado la caché para todo el proceso: cualquier llamada posterior a
// calculateDualScore() vería la referencia fabricada.

test("O6: mutar el array legalRefs devuelto por una llamada a calculateDualScore() NO afecta el resultado de una llamada posterior (candado anti-contaminación de caché)", () => {
  const first = calculateDualScore(testInput());
  const firstNoGranular = first.penalizers.find((p) => p.id === "no_granular_consent");
  assert.ok(firstNoGranular?.legalRefs?.length, "fixture inválido: no_granular_consent debe traer legalRefs");

  // Simula un consumidor que muta el array devuelto (nunca lo hace hoy, pero
  // nada en el tipo lo impide) — inyecta una referencia legal fabricada.
  firstNoGranular.legalRefs.push("REFERENCIA FABRICADA — NO DEBE PROPAGARSE");

  const second = calculateDualScore(testInput());
  const secondNoGranular = second.penalizers.find((p) => p.id === "no_granular_consent");

  assert.ok(
    !secondNoGranular.legalRefs.includes("REFERENCIA FABRICADA — NO DEBE PROPAGARSE"),
    "la mutación de la primera llamada contaminó una llamada posterior — legalRefs comparte referencia con la caché"
  );
  assert.notEqual(
    firstNoGranular.legalRefs,
    secondNoGranular.legalRefs,
    "legalRefs de dos llamadas distintas no debe ser el mismo array (===) — debe ser una copia defensiva"
  );
});

test("O6: legalRefs NO se comparte por identidad entre un concepto padre (minors_data) y sus variantes descompuestas heredadas (minors_data_fe/be)", () => {
  const result = calculateDualScore(testInput());

  const minorsData = result.penalizers.find((p) => p.id === "minors_data");
  const minorsDataFe = result.fePenalizers.find((p) => p.id === "minors_data_fe");
  const minorsDataBe = result.bePenalizers.find((p) => p.id === "minors_data_be");

  // Deben seguir siendo iguales en CONTENIDO (candado del paso 3, arriba)...
  assert.deepEqual(minorsDataFe.legalRefs, minorsData.legalRefs);
  assert.deepEqual(minorsDataBe.legalRefs, minorsData.legalRefs);

  // ...pero NO deben ser el mismo array: mutar el del hijo no puede contaminar
  // al padre (ni a la caché que ambos heredan).
  assert.notEqual(minorsDataFe.legalRefs, minorsData.legalRefs, "minors_data_fe no debe compartir referencia (===) con minors_data");
  assert.notEqual(minorsDataBe.legalRefs, minorsData.legalRefs, "minors_data_be no debe compartir referencia (===) con minors_data");
  assert.notEqual(minorsDataFe.legalRefs, minorsDataBe.legalRefs, "minors_data_fe y minors_data_be no deben compartir referencia (===) entre sí");

  minorsDataFe.legalRefs.push("REFERENCIA FABRICADA — NO DEBE PROPAGARSE");
  assert.ok(
    !minorsData.legalRefs.includes("REFERENCIA FABRICADA — NO DEBE PROPAGARSE"),
    "mutar legalRefs del hijo (minors_data_fe) contaminó al padre (minors_data)"
  );
});
