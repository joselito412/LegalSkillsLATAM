/**
 * Test de integridad de reglas (fix motor-06, cierre de Fase 3): si
 * scoring_rules.max_total falta o no es un número finito en
 * cli/rules/risk-engine/devops-penalizers.json, el motor debe fallar
 * ruidosamente (fail-loud) en vez de emitir un score degradado.
 *
 * Antes del fix: Math.min(devopsRaw, undefined) === NaN, sin lanzar. El NaN
 * viajaba hasta finalScore ("finalScore": null en el JSON, level "low") y el
 * gate `audit --config --json --fail-on 71` salía con exit 0 (NaN >= 71 es
 * false) — verde falso en CI sobre un motor de riesgo legal roto.
 *
 * Este test corre el BINARIO COMPILADO como subproceso contra una copia
 * corrompida de las reglas. RULES_ROOT se resuelve en rules.ts relativo a
 * dist/engine/ (resolve(__dirname, "../../rules")), así que para reproducir
 * la ruta real de resolución copiamos el árbol cli/dist + cli/rules completo
 * a un directorio temporal, corrompemos solo la copia de devops-penalizers.json,
 * y ejecutamos `node <tmp>/dist/index.js audit --config --json` con ese mismo
 * directorio como cwd (para que también resuelva legalskills.config.json).
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = join(__dirname, "..");
const CLI_SRC_DIST = join(CLI_ROOT, "dist");
const CLI_SRC_RULES = join(CLI_ROOT, "rules");

const VALID_CONFIG = {
  project_name: "Integridad Reglas Co",
  countries: ["CO"],
  data_types: ["email"],
  has_minors: false,
  server_region: "GCP sa-east-1",
  third_parties: [],
  has_granular_consent: true,
  has_privacy_policy: true,
  has_arco_procedure: true,
};

test("motor-06: devops-penalizers.json sin scoring_rules.max_total numérico → el CLI compilado falla ruidosamente (exit != 0, stderr accionable, sin finalScore:null en stdout)", () => {
  const tmpDir = mkdtempSync(join(tmpdir(), "lls-integridad-"));

  // Copia el árbol dist/ + rules/ completo al temporal (RULES_ROOT depende de
  // la posición relativa de dist/engine/ respecto a rules/).
  cpSync(CLI_SRC_DIST, join(tmpDir, "dist"), { recursive: true });
  cpSync(CLI_SRC_RULES, join(tmpDir, "rules"), { recursive: true });
  // El binario compilado importa sus dependencias (commander, chalk, @inquirer/
  // prompts) por resolución ESM normal — sin un node_modules cerca no las
  // encuentra. Symlink (no copia) al node_modules real del paquete cli/.
  symlinkSync(join(CLI_ROOT, "node_modules"), join(tmpDir, "node_modules"), "dir");
  // dist/index.js lee la versión con require("../package.json") — necesita el
  // archivo presente junto a dist/ en el temporal.
  cpSync(join(CLI_ROOT, "package.json"), join(tmpDir, "package.json"));

  // Corrompe SOLO la copia: borra scoring_rules.max_total.
  const devopsPath = join(tmpDir, "rules/risk-engine/devops-penalizers.json");
  const devopsJson = JSON.parse(readFileSync(devopsPath, "utf8"));
  delete devopsJson.scoring_rules.max_total;
  writeFileSync(devopsPath, JSON.stringify(devopsJson, null, 2));

  writeFileSync(join(tmpDir, "legalskills.config.json"), JSON.stringify(VALID_CONFIG, null, 2));

  let threw = false;
  let result;
  try {
    result = execFileSync(process.execPath, [join(tmpDir, "dist/index.js"), "audit", "--config", "--json"], {
      cwd: tmpDir,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
    // Si no lanza, el proceso salió con 0 — eso es exactamente el defecto reproducido.
  } catch (e) {
    threw = true;
    result = e;
  }

  assert.ok(threw, "el proceso debe salir con código distinto de 0 (no debe completar exitosamente)");
  assert.notEqual(result.status, 0, "exit code debe ser distinto de 0");
  assert.ok(
    result.stderr.includes("Integridad de reglas comprometida"),
    `stderr debe mencionar "Integridad de reglas comprometida", recibido: ${result.stderr}`
  );
  assert.ok(
    !(result.stdout ?? "").includes('"finalScore": null'),
    "stdout NO debe contener un finalScore: null degradado silenciosamente"
  );
});
