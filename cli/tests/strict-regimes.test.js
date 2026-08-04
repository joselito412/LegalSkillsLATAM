/**
 * Tests para el fix T1 (MOTOR-04): strict_regimes por PERTENENCIA a la lista
 * de region-factors.json, nunca por comparación numérica de F_rigor.
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { isStrictRegime } from "../dist/engine/rules.js";
import { calculateScore } from "../dist/engine/scorer.js";
import { getBackendPenalizers } from "../dist/engine/backend-scorer.js";

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

test("MOTOR-05/fix post-validación: Ecuador sin DPO activa no_dpo y emite un assumption GENÉRICO (deriva de member.basis, no un hardcode 'if EC') con Ecuador, T1 y la fuente ecuador-spdp-2026.md", () => {
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
  assert.ok(result.assumptions[0].includes("ecuador-spdp-2026.md"));
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

// ─── QA-04: candado de la dirección negativa del fix T1 ────────────────────
// Los tests anteriores en este archivo solo prueban que países de régimen
// ESTRICTO (BR/EC/CL post-vigencia) activan los 3 penalizadores reforzados.
// Ninguno prueba la dirección contraria: un país NO estricto con los 3
// controles en false NO debe activarlos. Eliminar el guard `strict &&` en
// scorer.ts (o `isStrict &&` en backend-scorer.ts) deja los 68 tests previos
// en verde, con un radio de reintroducción de +50 pts sobre CUALQUIER país no
// estricto (CO/MX/PE/AR pasarían de 40 a 90, invisible para CI).

function nonStrictCompliantInput(code) {
  return {
    projectName: `Dirección negativa ${code}`,
    countries: [code],
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
  };
}

test("MOTOR-04 dirección negativa: país no estricto con los 3 controles en false no activa los penalizadores reforzados", () => {
  for (const code of ["CO", "MX", "PE", "AR"]) {
    const result = calculateScore(nonStrictCompliantInput(code));

    const noDpo = result.penalizers.find((p) => p.id === "no_dpo");
    const noLegalBasis = result.penalizers.find((p) => p.id === "no_legal_basis");
    const noBreachPlan = result.penalizers.find((p) => p.id === "no_breach_plan");

    assert.equal(noDpo?.active, false, `${code}: no_dpo no debe activarse fuera de régimen estricto`);
    assert.equal(noLegalBasis?.active, false, `${code}: no_legal_basis no debe activarse fuera de régimen estricto`);
    assert.equal(noBreachPlan?.active, false, `${code}: no_breach_plan no debe activarse fuera de régimen estricto`);
    assert.equal(result.penalizersSum, 0, `${code}: penalizersSum debe ser 0 (proyecto compliant salvo las 3 llaves estrictas)`);
    assert.equal(result.finalScore, 40, `${code}: finalScore debe ser 40 (C_base=40, F_rigor=1.0, sin penalizadores activos)`);
  }
});

test("MOTOR-04 dirección negativa (segundo sitio — backend-scorer.ts): mismo caso contra getBackendPenalizers(input, false)", () => {
  for (const code of ["CO", "MX", "PE", "AR"]) {
    const penalizers = getBackendPenalizers(nonStrictCompliantInput(code), false);

    const noDpo = penalizers.find((p) => p.id === "no_dpo");
    const noLegalBasis = penalizers.find((p) => p.id === "no_legal_basis");
    const noBreachPlan = penalizers.find((p) => p.id === "no_breach_plan");

    assert.equal(noDpo?.active, false, `${code}: no_dpo (BE) no debe activarse fuera de régimen estricto`);
    assert.equal(noLegalBasis?.active, false, `${code}: no_legal_basis (BE) no debe activarse fuera de régimen estricto`);
    assert.equal(noBreachPlan?.active, false, `${code}: no_breach_plan (BE) no debe activarse fuera de régimen estricto`);
  }
});

test("MOTOR-04: Chile antes del 2026-12-01 tampoco activa los reforzados", () => {
  process.env.LLS_FAKE_NOW = "2026-11-30T12:00:00Z";
  try {
    const result = calculateScore(nonStrictCompliantInput("CL"));

    const noDpo = result.penalizers.find((p) => p.id === "no_dpo");
    const noLegalBasis = result.penalizers.find((p) => p.id === "no_legal_basis");
    const noBreachPlan = result.penalizers.find((p) => p.id === "no_breach_plan");

    assert.equal(noDpo?.active, false);
    assert.equal(noLegalBasis?.active, false);
    assert.equal(noBreachPlan?.active, false);
  } finally {
    delete process.env.LLS_FAKE_NOW;
  }
});

test("MOTOR-04 candado de duplicación: para BR (estricto) el trío reforzado de calculateScore() y de getBackendPenalizers(input, true) coincide en id/score/active", () => {
  const input = nonStrictCompliantInput("BR");

  const scorerResult = calculateScore(input);
  const backendResult = getBackendPenalizers(input, true);

  const reinforcedIds = ["no_dpo", "no_legal_basis", "no_breach_plan"];

  const fromScorer = reinforcedIds
    .map((id) => scorerResult.penalizers.find((p) => p.id === id))
    .map(({ id, score, active }) => ({ id, score, active }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const fromBackend = reinforcedIds
    .map((id) => backendResult.find((p) => p.id === id))
    .map(({ id, score, active }) => ({ id, score, active }))
    .sort((a, b) => a.id.localeCompare(b.id));

  // NOTA (actualizada tras 45f6ee3, CONTRATO-01 paso 2): los `label` YA están
  // unificados — scorer.ts y backend-scorer.ts seleccionan ambos su definición
  // de no_dpo/no_legal_basis/no_breach_plan desde la misma fuente única
  // (penalizer-catalog.ts), así que ya no pueden divergir en silencio. El
  // candado sigue comparando solo id/score/active (label excluido) porque esa
  // garantía específica —que label sea deep-equal entre la lista combinada y
  // la de pilar— ya la cubre el candado de fuente única dedicado en
  // penalizer-catalog.test.js; no porque siga siendo deuda pendiente.
  assert.deepEqual(fromScorer, fromBackend);

  // Sanity check: en este caso estricto los 3 SÍ deben estar activos (evita
  // que el candado compare dos listas vacías y pase por accidente).
  for (const p of fromScorer) {
    assert.equal(p.active, true, `${p.id} debe estar activo en BR (régimen estricto)`);
  }
});
