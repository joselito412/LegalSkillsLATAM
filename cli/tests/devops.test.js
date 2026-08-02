/**
 * Tests para MOTOR-06 (sub-pilar DevOps) y ADR-001 (cap propio de 30 pts,
 * sumado a be_raw/rawScore ANTES del min(100)/min(50)).
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { calculateScore, calculateDualScore } from "../dist/engine/scorer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const devopsJson = JSON.parse(
  readFileSync(join(__dirname, "../rules/risk-engine/devops-penalizers.json"), "utf8")
);

function baseCompliantInput(overrides) {
  return {
    projectName: "DevOps test",
    countries: ["CO"],
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

test("hasStagingEnv: false → do_no_staging_env activo +15", () => {
  const result = calculateScore(baseCompliantInput({ hasStagingEnv: false }));
  const p = result.devopsPenalizers.find((x) => x.id === "do_no_staging_env");
  assert.ok(p);
  assert.equal(p.active, true);
  assert.equal(p.score, 15);
});

test("usesProdDataOutsideProd: true → do_prod_data_outside_prod activo +20 (inverted)", () => {
  const result = calculateScore(baseCompliantInput({ usesProdDataOutsideProd: true }));
  const p = result.devopsPenalizers.find((x) => x.id === "do_prod_data_outside_prod");
  assert.ok(p);
  assert.equal(p.active, true);
  assert.equal(p.score, 20);
});

test("usesProdDataOutsideProd: false → inactivo", () => {
  const result = calculateScore(baseCompliantInput({ usesProdDataOutsideProd: false }));
  const p = result.devopsPenalizers.find((x) => x.id === "do_prod_data_outside_prod");
  assert.ok(p);
  assert.equal(p.active, false);
});

test("todo undefined → 0 activos, devopsSubtotal 0, finalScore idéntico a un input sin campos devops", () => {
  const result = calculateScore(baseCompliantInput());

  const active = result.devopsPenalizers.filter((p) => p.active);
  assert.equal(active.length, 0);
  assert.equal(result.devopsRaw, 0);
  assert.equal(result.devopsSubtotal, 0);
  // C_base=40, sin penalizadores FE/BE, F_rigor=1.0 (CO) → 40 (igual que el
  // caso "datos personales + CO + cumplimiento total → score 40" de scorer.test.js)
  assert.equal(result.finalScore, 40);
});

test("peor caso 7/7 activos → devopsRaw 90, devopsSubtotal 30 (cap del JSON)", () => {
  const result = calculateScore(
    baseCompliantInput({
      hasStagingEnv: false,
      usesProdDataOutsideProd: true,
      hasSecretsManager: false,
      logsContainPii: true,
      hasDependencyScanning: false,
      hasTestedBackups: false,
      hasCiRiskGate: false,
    })
  );

  const active = result.devopsPenalizers.filter((p) => p.active);
  assert.equal(active.length, 7);
  assert.equal(result.devopsRaw, 90);
  assert.equal(result.devopsSubtotal, Math.min(90, devopsJson.scoring_rules.max_total));
  assert.equal(result.devopsSubtotal, 30);
  assert.equal(
    result.finalScore,
    Math.min(100, Math.round((result.cBase + result.penalizersSum + 30) * result.fRigor))
  );
});

test("ADR-001 caso #2 (aditivo puro): un solo penalizador devops activo (+15) → finalScore 40+15=55", () => {
  const result = calculateScore(
    baseCompliantInput({
      hasStagingEnv: false, // único inactivo → activa do_no_staging_env (+15)
      usesProdDataOutsideProd: false,
      hasSecretsManager: true,
      logsContainPii: false,
      hasDependencyScanning: true,
      hasTestedBackups: true,
      hasCiRiskGate: true,
    })
  );

  const active = result.devopsPenalizers.filter((p) => p.active);
  assert.equal(active.length, 1);
  assert.equal(active[0].id, "do_no_staging_env");
  assert.equal(result.devopsSubtotal, 15);
  assert.equal(result.finalScore, 55);
});

test("no-solapamiento: los ids devops (prefijo do_) son disjuntos de los ids FE/BE/calculateScore", () => {
  const result = calculateDualScore(
    baseCompliantInput({
      hasMinors: true,
      hasGranularConsent: false,
      hasPrivacyPolicy: false,
      hasArcoProcedure: false,
      thirdPartyTransfers: true,
      hasStagingEnv: false,
      usesProdDataOutsideProd: true,
      hasSecretsManager: false,
      logsContainPii: true,
      hasDependencyScanning: false,
      hasTestedBackups: false,
      hasCiRiskGate: false,
    })
  );

  const nonDevopsIds = [
    ...result.penalizers.map((p) => p.id),
    ...result.fePenalizers.map((p) => p.id),
    ...result.bePenalizers.map((p) => p.id),
  ];

  for (const id of nonDevopsIds) {
    assert.ok(!id.startsWith("do_"), `id no-devops inesperado con prefijo do_: ${id}`);
  }

  const devopsIds = new Set(result.devopsPenalizers.map((p) => p.id));
  for (const id of devopsIds) {
    assert.ok(!nonDevopsIds.includes(id), `id devops duplicado fuera del panel DevOps: ${id}`);
  }
});

test("no-solapamiento: los 7 config_keys de devops-penalizers.json son disjuntos de las llaves previas de ConfigFile", () => {
  const previousConfigKeys = [
    "project_name",
    "countries",
    "data_types",
    "has_minors",
    "server_region",
    "third_parties",
    "has_granular_consent",
    "has_privacy_policy",
    "has_arco_procedure",
    "has_dpo",
    "has_legal_basis_per_purpose",
    "has_breach_response_plan",
    "transfer_destinations",
    "us_states",
    "us_state_laws_mapped",
  ];

  const devopsConfigKeys = devopsJson.penalizers.map((p) => p.config_key);
  assert.equal(devopsConfigKeys.length, 7);

  for (const key of devopsConfigKeys) {
    assert.ok(!previousConfigKeys.includes(key), `config_key devops colisiona con llave previa: ${key}`);
  }
});

test("candado de no-invención: scores y labels del resultado coinciden con devops-penalizers.json", () => {
  const result = calculateScore(
    baseCompliantInput({
      hasStagingEnv: false,
      usesProdDataOutsideProd: true,
      hasSecretsManager: false,
      logsContainPii: true,
      hasDependencyScanning: false,
      hasTestedBackups: false,
      hasCiRiskGate: false,
    })
  );

  for (const jsonDef of devopsJson.penalizers) {
    const p = result.devopsPenalizers.find((x) => x.id === jsonDef.id);
    assert.ok(p, `falta el penalizador ${jsonDef.id} en el resultado`);
    assert.equal(p.score, jsonDef.score);
    assert.equal(p.label, jsonDef.label);
  }
});

test("MOTOR-08: do_no_staging_env → standardsRefs/fixHint/configKey/legalRefs coinciden con el JSON", () => {
  const result = calculateScore(baseCompliantInput({ hasStagingEnv: false }));
  const p = result.devopsPenalizers.find((x) => x.id === "do_no_staging_env");
  const jsonDef = devopsJson.penalizers.find((x) => x.id === "do_no_staging_env");

  assert.ok(p);
  assert.deepEqual(p.standardsRefs, jsonDef.standards_refs);
  assert.equal(p.fixHint, jsonDef.fix_hint);
  assert.equal(p.configKey, jsonDef.config_key);
  assert.deepEqual(p.legalRefs, jsonDef.legal_refs);
});

test("MOTOR-08: do_no_ci_risk_gate → legalRefs === [] (passthrough fiel, el JSON declara legal_refs: [])", () => {
  const result = calculateScore(baseCompliantInput({ hasCiRiskGate: false }));
  const p = result.devopsPenalizers.find((x) => x.id === "do_no_ci_risk_gate");
  const jsonDef = devopsJson.penalizers.find((x) => x.id === "do_no_ci_risk_gate");

  assert.ok(p);
  assert.deepEqual(jsonDef.legal_refs, []);
  assert.deepEqual(p.legalRefs, []);
});

test("CONTRATO-01 (paso 1): los 7 penalizadores DevOps traen topic === 'devops', igual que el JSON", () => {
  const result = calculateScore(
    baseCompliantInput({
      hasStagingEnv: false,
      usesProdDataOutsideProd: true,
      hasSecretsManager: false,
      logsContainPii: true,
      hasDependencyScanning: false,
      hasTestedBackups: false,
      hasCiRiskGate: false,
    })
  );

  assert.equal(devopsJson.penalizers.length, 7);
  for (const jsonDef of devopsJson.penalizers) {
    const p = result.devopsPenalizers.find((x) => x.id === jsonDef.id);
    assert.ok(p, `falta el penalizador ${jsonDef.id} en el resultado`);
    assert.equal(p.topic, jsonDef.topic, `topic no coincide para ${jsonDef.id}`);
    assert.equal(p.topic, "devops");
  }
});
