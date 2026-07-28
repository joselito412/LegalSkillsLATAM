/**
 * Tests para MOTOR-03: cableado de us_multistate_exposure desde usa-federal.json.
 * Candado de "una sola definición": el score/label del resultado deben coincidir
 * EXACTAMENTE con los del JSON (leído directamente, sin pasar por el motor).
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { calculateScore } from "../dist/engine/scorer.js";
import { loadCountry } from "../dist/engine/rules.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const usaFederal = JSON.parse(
  readFileSync(join(__dirname, "../rules/us/usa-federal.json"), "utf8")
);
const jsonDef = usaFederal.penalizers.find((p) => p.id === "us_multistate_exposure");

function baseCompliantInput(overrides) {
  return {
    projectName: "US multistate test",
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

test("US+[CA,VA] sin mapear → us_multistate_exposure activo, con score/description del JSON", () => {
  const result = calculateScore(
    baseCompliantInput({ countries: ["US"], usStates: ["CA", "VA"], usStateLawsMapped: false })
  );

  const p = result.penalizers.find((x) => x.id === "us_multistate_exposure");
  assert.ok(p, "el penalizador debe aparecer en la lista");
  assert.equal(p.active, true);
  assert.equal(p.score, jsonDef.score);
  assert.equal(p.label, jsonDef.description);
  assert.equal(p.description, jsonDef.description);
});

test("US+[CA] (1 estado integral) → NO activo", () => {
  const result = calculateScore(baseCompliantInput({ countries: ["US"], usStates: ["CA"] }));

  const p = result.penalizers.find((x) => x.id === "us_multistate_exposure");
  assert.ok(p);
  assert.equal(p.active, false);
});

test("US+2 estados con usStateLawsMapped: true → NO activo", () => {
  const result = calculateScore(
    baseCompliantInput({ countries: ["US"], usStates: ["CA", "VA"], usStateLawsMapped: true })
  );

  const p = result.penalizers.find((x) => x.id === "us_multistate_exposure");
  assert.ok(p);
  assert.equal(p.active, false);
});

test("proyecto sin US → el penalizador no aparece en la lista", () => {
  const result = calculateScore(baseCompliantInput({ countries: ["CO"] }));

  const p = result.penalizers.find((x) => x.id === "us_multistate_exposure");
  assert.equal(p, undefined);
});

test("loadCountry('US') !== null", () => {
  assert.notEqual(loadCountry("US"), null);
});
