/**
 * Test de integración para el fix O-1 (validación Opus del PR 3B): `audit --config`
 * con un legalskills.config.json LEGACY (pre-3B, sin las 9 llaves nuevas) no debe
 * disparar prompts interactivos. Bajo CI (stdin cerrado/no-tty) un prompt
 * interactivo crashea con ExitPromptError y el proceso salía con código 0 SIN
 * emitir JSON — un pipeline con --fail-on quedaba verde sobre una auditoría que
 * nunca corrió. Este test corre el binario real como subproceso (node:child_process)
 * con stdin "ignore" para reproducir exactamente ese escenario.
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ENTRY = join(__dirname, "../dist/index.js");

function runAuditConfigJson(configFile) {
  const tmpDir = mkdtempSync(join(tmpdir(), "lls-"));
  writeFileSync(join(tmpDir, "legalskills.config.json"), JSON.stringify(configFile, null, 2));

  const stdout = execFileSync(process.execPath, [CLI_ENTRY, "audit", "--config", "--json"], {
    cwd: tmpDir,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });

  // Desde el fix de contrato-máquina, stdout en modo --config --json es SOLO
  // el JSON (ver test dedicado más abajo). Igual arrancamos desde el primer
  // "{" por robustez ante quien reintroduzca ruido por delante.
  return JSON.parse(stdout.slice(stdout.indexOf("{")));
}

// Variante que NO asume éxito: captura status/stdout/stderr incluso cuando el
// proceso sale con código distinto de 0 (execFileSync lanza en ese caso).
function runAuditConfigRaw(configFile) {
  const tmpDir = mkdtempSync(join(tmpdir(), "lls-"));
  writeFileSync(join(tmpDir, "legalskills.config.json"), JSON.stringify(configFile, null, 2));

  try {
    const stdout = execFileSync(process.execPath, [CLI_ENTRY, "audit", "--config", "--json"], {
      cwd: tmpDir,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
    return { status: 0, stdout, stderr: "" };
  } catch (e) {
    return { status: e.status, stdout: e.stdout ?? "", stderr: e.stderr ?? "" };
  }
}

test("O-1: config LEGACY (solo llaves clásicas, sin las 9 nuevas de 3B) → audit --config --json no crashea y emite JSON válido", () => {
  const legacyConfig = {
    project_name: "Legacy Co",
    countries: ["CO"],
    data_types: ["email"],
    has_minors: false,
    server_region: "GCP sa-east-1",
    third_parties: [],
    has_granular_consent: true,
    has_privacy_policy: true,
    has_arco_procedure: true,
  };

  const json = runAuditConfigJson(legacyConfig);
  assert.equal(typeof json.finalScore, "number");
});

test("O-1: config LEGACY con countries=['US'] (sin us_states/us_state_laws_mapped) → corre sin prompts, us_multistate_exposure presente pero inactivo", () => {
  const legacyUsConfig = {
    project_name: "Legacy US Co",
    countries: ["US"],
    data_types: ["email"],
    has_minors: false,
    server_region: "AWS us-east-1",
    third_parties: [],
    has_granular_consent: true,
    has_privacy_policy: true,
    has_arco_procedure: true,
  };

  const json = runAuditConfigJson(legacyUsConfig);
  assert.equal(typeof json.finalScore, "number");

  const penalizer = json.penalizers.find((p) => p.id === "us_multistate_exposure");
  assert.ok(penalizer, "us_multistate_exposure debe aparecer en la lista (countries incluye US)");
  assert.equal(penalizer.active, false);
});

test("--config --json emite SOLO JSON en stdout (contrato máquina)", () => {
  const config = {
    project_name: "Contrato Co",
    countries: ["CO"],
    data_types: ["email"],
    has_minors: false,
    server_region: "GCP sa-east-1",
    third_parties: [],
    has_granular_consent: true,
    has_privacy_policy: true,
    has_arco_procedure: true,
  };

  const tmpDir = mkdtempSync(join(tmpdir(), "lls-"));
  writeFileSync(join(tmpDir, "legalskills.config.json"), JSON.stringify(config, null, 2));

  const stdout = execFileSync(process.execPath, [CLI_ENTRY, "audit", "--config", "--json"], {
    cwd: tmpDir,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });

  assert.ok(stdout.trimStart().startsWith("{"), "stdout debe empezar por '{' sin texto humano por delante");
  assert.doesNotThrow(() => JSON.parse(stdout), "stdout completo debe ser JSON parseable");
  assert.ok(!stdout.includes("Leyendo configuración"), "el aviso humano no debe filtrarse a stdout en modo --json");

  // Modo humano (sin --json): el mismo aviso SÍ debe seguir apareciendo — no
  // perdimos la ayuda al humano al arreglar el contrato máquina.
  const humanStdout = execFileSync(process.execPath, [CLI_ENTRY, "audit", "--config"], {
    cwd: tmpDir,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
  assert.ok(humanStdout.includes("Leyendo configuración"), "en modo humano el aviso debe seguir imprimiéndose");
});

// ─── Fix (cierre de Fase 3): --config nunca pregunta; llaves estrictas ──────
// faltantes salen con exit 2 (en vez de disparar un prompt interactivo que
// revienta bajo CI y sale con exit 0 sin emitir JSON).

test("defecto vivo: config de BR SIN has_dpo + --config --json → exit 2, stderr menciona has_dpo, stdout sin JSON parseable", () => {
  const brConfigSinHasDpo = {
    project_name: "BR sin has_dpo",
    countries: ["BR"],
    data_types: ["email"],
    has_minors: false,
    server_region: "sa-east-1",
    third_parties: [],
    has_granular_consent: true,
    has_privacy_policy: true,
    has_arco_procedure: true,
    has_legal_basis_per_purpose: true,
    has_breach_response_plan: true,
    // has_dpo AUSENTE a propósito.
  };

  const { status, stdout, stderr } = runAuditConfigRaw(brConfigSinHasDpo);

  assert.notEqual(status, 0, "debe salir con código distinto de 0");
  assert.equal(status, 2, "debe salir específicamente con código 2 (configuración inválida)");
  assert.ok(stderr.includes("has_dpo"), `stderr debe mencionar has_dpo, recibido: ${stderr}`);
  assert.throws(() => JSON.parse(stdout), "stdout no debe contener JSON parseable");
});

test("camino feliz: config de BR con las 3 llaves estrictas presentes → exit 0 y JSON válido", () => {
  const brConfigCompleto = {
    project_name: "BR completo",
    countries: ["BR"],
    data_types: ["email"],
    has_minors: false,
    server_region: "sa-east-1",
    third_parties: [],
    has_granular_consent: true,
    has_privacy_policy: true,
    has_arco_procedure: true,
    has_dpo: true,
    has_legal_basis_per_purpose: true,
    has_breach_response_plan: true,
  };

  const json = runAuditConfigJson(brConfigCompleto);
  assert.equal(typeof json.finalScore, "number");
  assert.equal(json.isStrictRegime, true);
});

test("CO (no estricto) SIN las 3 llaves estrictas → exit 0 y JSON válido (el gate solo aplica a régimen estricto)", () => {
  const coConfigSinLlavesEstrictas = {
    project_name: "CO sin llaves estrictas",
    countries: ["CO"],
    data_types: ["email"],
    has_minors: false,
    server_region: "GCP sa-east-1",
    third_parties: [],
    has_granular_consent: true,
    has_privacy_policy: true,
    has_arco_procedure: true,
    // Sin has_dpo / has_legal_basis_per_purpose / has_breach_response_plan.
  };

  const { status, stdout } = runAuditConfigRaw(coConfigSinLlavesEstrictas);
  assert.equal(status, 0);
  const json = JSON.parse(stdout.slice(stdout.indexOf("{")));
  assert.equal(typeof json.finalScore, "number");
  assert.equal(json.isStrictRegime, false);
});

test("cobertura e2e del wiring DevOps con aserción de score exacto (segundo hueco: mutar la rama --config de hasStagingEnv a undefined dejaba los tests verdes con el score real cayendo de 60 a 45)", () => {
  const configDevopsWiring = {
    project_name: "DevOps Wiring Co",
    countries: ["CO"],
    data_types: ["email"],
    has_minors: false,
    server_region: "GCP sa-east-1",
    third_parties: [],
    has_granular_consent: true,
    has_privacy_policy: true,
    has_arco_procedure: true,
    // 7 llaves DevOps: exactamente 2 penalizadores activos —
    // do_no_staging_env (+15, has_staging_env=false) y
    // do_no_ci_risk_gate (+5, has_ci_risk_gate=false). El resto compliant.
    has_staging_env: false,
    uses_prod_data_outside_prod: false,
    has_secrets_manager: true,
    logs_contain_pii: false,
    has_dependency_scanning: true,
    has_tested_backups: true,
    has_ci_risk_gate: false,
  };

  const json = runAuditConfigJson(configDevopsWiring);

  // Cálculo esperado a mano (devops-penalizers.json, score-formula.json):
  //   C_base = 40 (personal_general, "email")
  //   penalizersSum = 0 (CO no estricto; resto de controles compliant)
  //   devopsRaw = 15 (do_no_staging_env) + 5 (do_no_ci_risk_gate) = 20
  //   devopsSubtotal = min(20, 30) = 20 (no llega al cap del JSON)
  //   F_rigor(CO) = 1.00
  //   finalScore = round((40 + 0 + 20) * 1.00) = 60
  assert.equal(json.devopsRaw, 20);
  assert.equal(json.devopsSubtotal, 20);
  assert.equal(json.finalScore, 60);

  const active = json.devopsPenalizers.filter((p) => p.active).map((p) => p.id).sort();
  assert.deepEqual(active, ["do_no_ci_risk_gate", "do_no_staging_env"]);
});
