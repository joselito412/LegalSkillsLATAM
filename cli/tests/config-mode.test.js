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
