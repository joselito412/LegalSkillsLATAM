/**
 * Tests para MOTOR-02: escalado F_rigor USA multi-estatal.
 * +0.02 por estado adicional con ley integral (state-matrix.json), cap 1.20.
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateScore } from "../dist/engine/scorer.js";
import { loadStateMatrix } from "../dist/engine/rules.js";

function baseCompliantInput(overrides) {
  return {
    projectName: "US scaling test",
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
    ...overrides,
  };
}

test("US + 1 estado (CA) → F_rigor 1.10 (base, sin escalado)", () => {
  const result = calculateScore(baseCompliantInput({ countries: ["US"], usStates: ["CA"] }));
  assert.equal(result.fRigor, 1.10);
});

test("US + 3 estados (CA, VA, CO) → F_rigor 1.14", () => {
  const result = calculateScore(
    baseCompliantInput({ countries: ["US"], usStates: ["CA", "VA", "CO"] })
  );
  assert.equal(result.fRigor, 1.14);
});

test("US + 6 estados de la matriz → F_rigor 1.20 (cap)", () => {
  const result = calculateScore(
    baseCompliantInput({ countries: ["US"], usStates: ["CA", "VA", "CO", "CT", "UT", "TX"] })
  );
  assert.equal(result.fRigor, 1.20);
});

test("US + 8 estados → F_rigor 1.20 (sigue capeado)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["US"],
      usStates: ["CA", "VA", "CO", "CT", "UT", "TX", "OR", "MT"],
    })
  );
  assert.equal(result.fRigor, 1.20);
});

test("estados fuera de la matriz no incrementan: US + [CA, FL] → 1.10", () => {
  const result = calculateScore(baseCompliantInput({ countries: ["US"], usStates: ["CA", "FL"] }));
  assert.equal(result.fRigor, 1.10);
});

test("estados fuera de la matriz no incrementan: US + [CA, VA, FL] → 1.12", () => {
  const result = calculateScore(
    baseCompliantInput({ countries: ["US"], usStates: ["CA", "VA", "FL"] })
  );
  assert.equal(result.fRigor, 1.12);
});

test("normalización: minúsculas ['ca','va'] → 1.12", () => {
  const result = calculateScore(baseCompliantInput({ countries: ["US"], usStates: ["ca", "va"] }));
  assert.equal(result.fRigor, 1.12);
});

test("US sin usStates → 1.10", () => {
  const result = calculateScore(baseCompliantInput({ countries: ["US"] }));
  assert.equal(result.fRigor, 1.10);
});

test("US+BR con 6 estados → 1.20 (peor caso sobre 1.15 de BR)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["US", "BR"],
      usStates: ["CA", "VA", "CO", "CT", "UT", "TX"],
      hasDpo: true,
      hasLegalBasisPerPurpose: true,
      hasBreachResponsePlan: true,
    })
  );
  assert.equal(result.fRigor, 1.20);
});

test("US+EU → 1.25 (peor caso, EU domina el escalado de US)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["US", "EU"],
      usStates: ["CA", "VA", "CO", "CT", "UT", "TX"],
      hasDpo: true,
      hasLegalBasisPerPurpose: true,
      hasBreachResponsePlan: true,
    })
  );
  assert.equal(result.fRigor, 1.25);
});

test("tolerancia: loadStateMatrix() no lanza, states.length === 19, y tolera pending_verification", () => {
  const matrix = loadStateMatrix();
  assert.doesNotThrow(() => loadStateMatrix());
  assert.equal(matrix.states.length, 19);
  // pending_verification es un bloque editorial (VIG-04) documentando estados
  // aún no incorporados a la matriz — el motor lo tolera como key extra, no lo lee.
  assert.ok("pending_verification" in matrix);
});
