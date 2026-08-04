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
import { calculateDualScore } from "../dist/engine/scorer.js";

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

test("CONTRATO-01 (paso 2): candado de fuente única — los 7 ids compartidos son deep-equal (id/label/score/pillar) entre la lista combinada y el scorer de su pilar", () => {
  const result = calculateDualScore(testInput());

  for (const [id, pillar] of Object.entries(SHARED_IDS_BY_PILLAR)) {
    const combined = result.penalizers.find((p) => p.id === id);
    const pillarList = pillar === "fe" ? result.fePenalizers : result.bePenalizers;
    const fromPillar = pillarList.find((p) => p.id === id);

    assert.ok(combined, `${id}: ausente en la lista combinada (result.penalizers)`);
    assert.ok(fromPillar, `${id}: ausente en la lista de pilar (${pillar === "fe" ? "fePenalizers" : "bePenalizers"})`);

    assert.deepEqual(
      { id: combined.id, label: combined.label, score: combined.score, pillar: combined.pillar },
      { id: fromPillar.id, label: fromPillar.label, score: fromPillar.score, pillar: fromPillar.pillar },
      `${id}: diverge entre la lista combinada y la de pilar (id/label/score/pillar deben ser deep-equal)`
    );
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
