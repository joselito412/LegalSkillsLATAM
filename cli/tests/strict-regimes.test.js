/**
 * Tests para el fix T1 (MOTOR-04): strict_regimes por PERTENENCIA a la lista
 * de region-factors.json, nunca por comparación numérica de F_rigor.
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { isStrictRegime } from "../dist/engine/rules.js";
import { calculateScore } from "../dist/engine/scorer.js";

test("isStrictRegime: BR y EU son estrictos, CO no", () => {
  assert.equal(isStrictRegime(["BR"]), true);
  assert.equal(isStrictRegime(["EU"]), true);
  assert.equal(isStrictRegime(["CO"]), false);
  assert.equal(isStrictRegime(["CO", "BR"]), true);
});

test("Chile entra a régimen estricto por fecha (strict_from 2026-12-01)", () => {
  assert.equal(isStrictRegime(["CL"], new Date("2026-11-30T12:00:00Z")), false);
  assert.equal(isStrictRegime(["CL"], new Date("2026-12-01T12:00:00Z")), true);
});

test("Ecuador queda estricto por default seguro del motor (decisión editorial T1 pendiente)", () => {
  assert.equal(isStrictRegime(["EC"]), true);
});

test("LLS_FAKE_NOW inyecta el reloj del motor", () => {
  process.env.LLS_FAKE_NOW = "2027-01-15";
  try {
    assert.equal(isStrictRegime(["CL"]), true);
  } finally {
    delete process.env.LLS_FAKE_NOW;
  }
});

test("guard T1: BR sin DPO/base legal/plan de brechas activa los 3 penalizadores reforzados", () => {
  const result = calculateScore({
    projectName: "Guard T1",
    countries: ["BR"],
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
    hasDpo: false,
    hasLegalBasisPerPurpose: false,
    hasBreachResponsePlan: false,
  });

  const noDpo = result.penalizers.find((p) => p.id === "no_dpo");
  const noLegalBasis = result.penalizers.find((p) => p.id === "no_legal_basis");
  const noBreachPlan = result.penalizers.find((p) => p.id === "no_breach_plan");

  assert.equal(noDpo?.active, true);
  assert.equal(noLegalBasis?.active, true);
  assert.equal(noBreachPlan?.active, true);
});
