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

test("Brasil activa F_rigor=1.25", () => {
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

  assert.equal(result.fRigor, 1.25);
  assert.equal(result.isStrictRegime, true);
  // C_base=40, sin penalizadores → 40 × 1.25 = 50
  assert.equal(result.finalScore, 50);
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

test("solo datos públicos → score 10", () => {
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
  assert.equal(result.finalScore, 10);
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
