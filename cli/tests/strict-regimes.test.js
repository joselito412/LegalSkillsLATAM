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

test("MOTOR-05: Ecuador sin DPO activa no_dpo y emite exactamente un assumption con Ecuador y T1", () => {
  const result = calculateScore({
    projectName: "EC sin DPO",
    countries: ["EC"],
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
    hasDpo: false,
    hasLegalBasisPerPurpose: true,
    hasBreachResponsePlan: true,
  });

  const noDpo = result.penalizers.find((p) => p.id === "no_dpo");
  assert.equal(noDpo?.active, true);
  assert.equal(result.assumptions.length, 1);
  assert.ok(result.assumptions[0].includes("Ecuador"));
  assert.ok(result.assumptions[0].includes("T1"));
});

test("MOTOR-05 guard: EC nunca puede quedar no-estricto y sin assumption", () => {
  const r = calculateScore({
    projectName: "EC guard",
    countries: ["EC"],
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
    hasDpo: true,
    hasLegalBasisPerPurpose: true,
    hasBreachResponsePlan: true,
  });

  assert.ok(
    r.isStrictRegime || r.assumptions.length > 0,
    "EC no puede quedar no-estricto y sin assumption (MOTOR-05)"
  );
  assert.equal(r.isStrictRegime, true);
  assert.ok(r.assumptions.length > 0);
});

test("CO solo → sin assumptions", () => {
  const result = calculateScore({
    projectName: "CO solo",
    countries: ["CO"],
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
  });

  assert.equal(result.assumptions.length, 0);
});
