/**
 * Tests for the scoring engine.
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateScore } from "../dist/engine/scorer.js";

test("salud + CO + sin cumplimiento → score 100", () => {
  const result = calculateScore({
    projectName: "Test",
    countries: ["CO"],
    dataCategory: "sensitive",
    hasMinors: false,
    hasGranularConsent: false,
    serverRegion: "inadequate",
    thirdPartyTransfers: true,
    hasPrivacyPolicy: false,
    hasArcoProcedure: false,
  });

  // C_base=80, penalizers: no_consent(15)+servers(20)+transfer(15)+no_policy(10)+no_arco(10)=70
  // F_rigor=1.0, raw=150 → capped at 100
  assert.equal(result.finalScore, 100);
  assert.equal(result.level, "high");
  assert.equal(result.cBase, 80);
  assert.equal(result.fRigor, 1.0);
});

test("datos personales + CO + cumplimiento total → score 40", () => {
  const result = calculateScore({
    projectName: "Blog",
    countries: ["CO"],
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
  });

  // C_base=40, no penalizers, F_rigor=1.0 → 40
  assert.equal(result.finalScore, 40);
  assert.equal(result.level, "medium");
  assert.equal(result.penalizersSum, 0);
});

test("Brasil usa F_rigor 1.15 desde region-factors.json y sigue siendo régimen estricto", () => {
  const result = calculateScore({
    projectName: "SaaS BR",
    countries: ["BR"],
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

  assert.equal(result.fRigor, 1.15);
  assert.equal(result.isStrictRegime, true);
  // C_base=40, sin penalizadores → 40 × 1.15 = 46
  assert.equal(result.finalScore, 46);
});

test("CO+BR+EU compliant total → F_rigor 1.25 (peor caso) y score 50", () => {
  const result = calculateScore({
    projectName: "Multi-bloque",
    countries: ["CO", "BR", "EU"],
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

  assert.equal(result.fRigor, 1.25);
  // C_base=40, sin penalizadores → 40 × 1.25 = 50
  assert.equal(result.finalScore, 50);
});

test("regresión T1 completa: BR sin DPO/base legal/plan de brechas → penalizadores activos y score 100", () => {
  const result = calculateScore({
    projectName: "BR sin controles",
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
  // penalizadores: no_dpo(15)+no_legal_basis(20)+no_breach_plan(15) = 50
  assert.equal(result.penalizersSum, 50);
  assert.equal(result.fRigor, 1.15);
  // (40+50) × 1.15 = 103.5 → round 104 → min(100, 104) = 100
  assert.equal(result.finalScore, 100);
});

test("US solo → F_rigor 1.10", () => {
  const result = calculateScore({
    projectName: "US only",
    countries: ["US"],
    dataCategory: "personal_general",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
  });

  assert.equal(result.fRigor, 1.10);
});

test("EC solo → F_rigor 1.00 pero isStrictRegime true (estrictitud y multiplicador desacoplados)", () => {
  const result = calculateScore({
    projectName: "EC only",
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

  assert.equal(result.fRigor, 1.0);
  assert.equal(result.isStrictRegime, true);
});

test("menores activa penalizador de 30 pts", () => {
  const result = calculateScore({
    projectName: "EdTech",
    countries: ["MX"],
    dataCategory: "personal_general",
    hasMinors: true,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
  });

  const minorsPenalizer = result.penalizers.find((p) => p.id === "minors_data");
  assert.ok(minorsPenalizer?.active);
  assert.equal(minorsPenalizer?.score, 30);
  // 40 + 30 = 70 → medium (borderline)
  assert.equal(result.finalScore, 70);
  assert.equal(result.level, "medium");
});

test("solo datos públicos (Chile) → cBase 10, F_rigor 1.10 desde region-factors.json → score 11", () => {
  // NOTA (MOTOR-01): antes de este PR, F_rigor para CL era 1.0 (no estaba en la
  // tabla strictRegime hardcodeada). Con el fix, F_rigor viene de
  // blocks.latam.per_country_overrides.CL en region-factors.json (1.10,
  // adelanto editorial de Ley 21.719), independiente de isStrictRegime (que sí
  // es sensible a fecha). Por eso el score pasa de 10 a 11 pts.
  const result = calculateScore({
    projectName: "Directorio",
    countries: ["CL"],
    dataCategory: "public",
    hasMinors: false,
    hasGranularConsent: true,
    serverRegion: "adequate",
    thirdPartyTransfers: false,
    hasPrivacyPolicy: true,
    hasArcoProcedure: true,
  });

  assert.equal(result.cBase, 10);
  assert.equal(result.fRigor, 1.10);
  assert.equal(result.finalScore, 11);
  assert.equal(result.level, "low");
});

test("score nunca supera 100", () => {
  const result = calculateScore({
    projectName: "Worst case",
    countries: ["BR", "EU"],
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
  });

  assert.ok(result.finalScore <= 100);
  assert.equal(result.finalScore, 100);
});
