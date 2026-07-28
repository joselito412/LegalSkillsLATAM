/**
 * Tests para VIG-01/T1: transferencias internacionales con destino adecuado
 * no deben activar el penalizador unstructured_international_transfer.
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateScore } from "../dist/engine/scorer.js";
import { calculateDualScore } from "../dist/engine/scorer.js";
import { loadCountry } from "../dist/engine/rules.js";

function baseCompliantInput(overrides) {
  return {
    projectName: "Adequacy test",
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
    hasDpo: true,
    hasLegalBasisPerPurpose: true,
    hasBreachResponsePlan: true,
    ...overrides,
  };
}

test("regresión VIG-01/T1: BR→UE sin SCCs no activa transferencia no controlada (adecuación Res. CD/ANPD 32/2026)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["BR"],
      thirdPartyTransfers: true,
      transferDestinations: ["EU"],
    })
  );

  const penalizer = result.penalizers.find((p) => p.id === "unstructured_international_transfer");
  assert.equal(penalizer?.active, false);
});

test("BR + transferencias + destino US → penalizador activo (sin decisión de adecuación para US)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["BR"],
      thirdPartyTransfers: true,
      transferDestinations: ["US"],
    })
  );

  const penalizer = result.penalizers.find((p) => p.id === "unstructured_international_transfer");
  assert.equal(penalizer?.active, true);
});

test("BR + transferencias sin destinos declarados → penalizador activo (peor caso)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["BR"],
      thirdPartyTransfers: true,
    })
  );

  const penalizer = result.penalizers.find((p) => p.id === "unstructured_international_transfer");
  assert.equal(penalizer?.active, true);
});

test("CO+BR + transferencias + destino EU → penalizador activo (CO sin adequacy_decisions, peor caso)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["CO", "BR"],
      thirdPartyTransfers: true,
      transferDestinations: ["EU"],
    })
  );

  const penalizer = result.penalizers.find((p) => p.id === "unstructured_international_transfer");
  assert.equal(penalizer?.active, true);
});

test("variante 'Unión Europea' como nombre de destino → penalizador NO activo (matcher de nombres)", () => {
  const result = calculateScore(
    baseCompliantInput({
      countries: ["BR"],
      thirdPartyTransfers: true,
      transferDestinations: ["Unión Europea"],
    })
  );

  const penalizer = result.penalizers.find((p) => p.id === "unstructured_international_transfer");
  assert.equal(penalizer?.active, false);
});

test("tolerancia: loadCountry('BR').international_transfer.adequacy_decisions tiene al menos 1 entrada", () => {
  const br = loadCountry("BR");
  assert.ok(Array.isArray(br?.international_transfer?.adequacy_decisions));
  assert.ok(br.international_transfer.adequacy_decisions.length >= 1);
});

test("guard adjacent_regimes: loadCountry('CO') no lanza y CO no genera penalizadores de Ley 2573/adjacent_regimes", () => {
  assert.doesNotThrow(() => loadCountry("CO"));

  const result = calculateDualScore(
    baseCompliantInput({
      countries: ["CO"],
      thirdPartyTransfers: false,
    })
  );

  const allPenalizers = [...result.penalizers, ...result.fePenalizers, ...result.bePenalizers];
  for (const p of allPenalizers) {
    assert.ok(!p.id.includes("2573"), `penalizador inesperado derivado de Ley 2573: ${p.id}`);
    assert.ok(!p.id.includes("adjacent"), `penalizador inesperado derivado de adjacent_regimes: ${p.id}`);
  }
});
