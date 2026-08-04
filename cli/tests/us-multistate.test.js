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
import { getBackendPenalizers } from "../dist/engine/backend-scorer.js";
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

test("MOTOR-08: us_multistate_exposure → sin standardsRefs/legalRefs/fixHint/configKey (el JSON no los declara)", () => {
  const result = calculateScore(
    baseCompliantInput({ countries: ["US"], usStates: ["CA", "VA"], usStateLawsMapped: false })
  );
  const p = result.penalizers.find((x) => x.id === "us_multistate_exposure");

  assert.ok(p);
  assert.equal(jsonDef.standards_ref, undefined);
  assert.equal(jsonDef.standards_refs, undefined);
  assert.equal(p.standardsRefs, undefined);
  assert.equal(p.legalRefs, undefined);
  assert.equal(p.fixHint, undefined);
  assert.equal(p.configKey, undefined);
});

test("CONTRATO-01 (paso 1): us_multistate_exposure → topic undefined (usa-federal.json no lo declara, el motor no lo inventa)", () => {
  const result = calculateScore(
    baseCompliantInput({ countries: ["US"], usStates: ["CA", "VA"], usStateLawsMapped: false })
  );
  const p = result.penalizers.find((x) => x.id === "us_multistate_exposure");

  assert.ok(p);
  assert.equal(jsonDef.topic, undefined);
  assert.equal(p.topic, undefined);
});

// O6 (verificación adversarial): us-scorer.ts ahora copia legalRefs/standardsRefs
// con spread antes de devolverlos (mismo fix que devops-scorer.ts y
// penalizer-catalog.ts) — un consumidor que mutara el array no debe poder
// contaminar la caché ni llamadas posteriores. NO hay un test de mutación
// (`.push`) contra datos reales en este archivo porque usa-federal.json HOY no
// declara legal_refs ni standards_refs para ningún penalizador (confirmado
// arriba, línea ~86-89: ambos son undefined) — no hay array vivo que mutar. El
// mismo patrón de copia SÍ se ejercita con datos reales en
// devops.test.js ("O6: mutar legalRefs/standardsRefs...") y en
// penalizer-catalog.test.js ("O6: mutar el array legalRefs...").
test("O-4: candado de ruta única — el objeto us_multistate_exposure de calculateScore() y de getBackendPenalizers() es deep-equal", () => {
  const input = baseCompliantInput({
    countries: ["US"],
    usStates: ["CA", "VA"],
    usStateLawsMapped: false,
  });

  const fromScorer = calculateScore(input).penalizers.find((x) => x.id === "us_multistate_exposure");
  const fromBackend = getBackendPenalizers(input, false).find((x) => x.id === "us_multistate_exposure");

  assert.ok(fromScorer);
  assert.ok(fromBackend);
  assert.deepEqual(fromScorer, fromBackend);
});
