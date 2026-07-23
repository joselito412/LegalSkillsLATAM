#!/usr/bin/env node

/**
 * Privacy Compliance Skills — JSON Schema Validator
 * Valida TODOS los JSON de cli/rules/ contra su schema correspondiente:
 *   - cli/rules/eu/*.json, cli/rules/us/usa-federal.json, cli/rules/latam/*.json
 *       → cli/rules/schema/country-rules.schema.json
 *   - cli/rules/us/state-matrix.json
 *       → cli/rules/schema/us-state-matrix.schema.json
 *   - cli/rules/risk-engine/*.json
 *       → sin schema propio (backlog): solo se verifica que sea JSON parseable
 *   - archivos con prefijo "_" (ej. _template.json) son plantillas de autor:
 *       se listan mas no se validan contra schema (contienen placeholders nulos
 *       a propósito, ej. "YYYY-MM-DD", que no cumplirían tipos reales).
 * Cobertura completa: todo archivo recorrido aparece en el output con su resultado.
 * Run: npm run validate
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, join, relative } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { default: Ajv2020 } = await import("ajv/dist/2020.js");
const addFormats = require("ajv-formats");

const ROOT = resolve(process.cwd());
const COUNTRY_SCHEMA_PATH = join(ROOT, "cli/rules/schema/country-rules.schema.json");
const STATE_MATRIX_SCHEMA_PATH = join(ROOT, "cli/rules/schema/us-state-matrix.schema.json");

// --- Setup AJV (draft 2020-12) ---
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const countrySchema = JSON.parse(readFileSync(COUNTRY_SCHEMA_PATH, "utf8"));
const validateCountry = ajv.compile(countrySchema);

const stateMatrixSchema = JSON.parse(readFileSync(STATE_MATRIX_SCHEMA_PATH, "utf8"));
const validateStateMatrix = ajv.compile(stateMatrixSchema);

// --- Integrity checks (beyond schema; only meaningful for country-rules docs) ---
function integrityChecks(data) {
  const warnings = [];
  if (!data.version) warnings.push("falta campo 'version'");
  if (!data.last_reviewed) warnings.push("falta campo 'last_reviewed'");
  if (!data.review_status) warnings.push("falta campo 'review_status'");
  if (data.reviewed_by === undefined) warnings.push("falta campo 'reviewed_by'");
  if (!data.editorial_note) warnings.push("falta campo 'editorial_note'");

  if (data.review_status === "validated" && !data.reviewed_by) {
    warnings.push("review_status es 'validated' pero reviewed_by está vacío");
  }

  return warnings;
}

function listJsonFiles(dirPath) {
  try {
    return readdirSync(dirPath)
      .filter((f) => f.endsWith(".json"))
      .sort();
  } catch {
    return []; // el directorio no existe (aún) — no rompe la corrida
  }
}

// --- Build the full task list: cada archivo recorrido + cómo se valida ---
// kind: "country" | "state-matrix" | "no-schema" | "template"
const tasks = [];

for (const f of listJsonFiles(join(ROOT, "cli/rules/eu"))) {
  tasks.push({ path: join(ROOT, "cli/rules/eu", f), kind: f.startsWith("_") ? "template" : "country" });
}

for (const f of listJsonFiles(join(ROOT, "cli/rules/us"))) {
  if (f === "state-matrix.json") {
    tasks.push({ path: join(ROOT, "cli/rules/us", f), kind: "state-matrix" });
  } else {
    tasks.push({ path: join(ROOT, "cli/rules/us", f), kind: f.startsWith("_") ? "template" : "country" });
  }
}

for (const f of listJsonFiles(join(ROOT, "cli/rules/latam"))) {
  tasks.push({ path: join(ROOT, "cli/rules/latam", f), kind: f.startsWith("_") ? "template" : "country" });
}

for (const f of listJsonFiles(join(ROOT, "cli/rules/risk-engine"))) {
  tasks.push({ path: join(ROOT, "cli/rules/risk-engine", f), kind: "no-schema" });
}

if (tasks.length === 0) {
  console.log("⚠️  No se encontraron archivos JSON en cli/rules/");
  process.exit(0);
}

const results = [];

for (const { path: filePath, kind } of tasks) {
  const rel = relative(ROOT, filePath);
  let data;

  try {
    data = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (e) {
    results.push({ file: rel, status: "ERROR", errors: [`JSON inválido: ${e.message}`], warnings: [] });
    continue;
  }

  if (kind === "template") {
    results.push({
      file: rel,
      status: "SKIP",
      errors: [],
      warnings: ["plantilla de autor (prefijo '_') — JSON válido, no se valida contra schema"],
    });
    continue;
  }

  if (kind === "no-schema") {
    results.push({
      file: rel,
      status: "OK",
      errors: [],
      warnings: ["sin schema (backlog) — solo se verificó que sea JSON parseable"],
    });
    continue;
  }

  const validator = kind === "state-matrix" ? validateStateMatrix : validateCountry;
  const valid = validator(data);
  const schemaErrors = valid ? [] : validator.errors.map((e) => `${e.instancePath || "(raíz)"} ${e.message}`);
  const warnings = kind === "country" ? integrityChecks(data) : [];

  results.push({
    file: rel,
    status: schemaErrors.length === 0 ? "OK" : "FAIL",
    errors: schemaErrors,
    warnings,
  });
}

// Totales derivados directamente de `results` — cada entrada (ERROR/SKIP/no-schema
// incluidas) ya trae sus propios errors/warnings, así el conteo nunca diverge de lo impreso.
const totalErrors = results.reduce((acc, r) => acc + r.errors.length, 0);
const totalWarnings = results.reduce((acc, r) => acc + r.warnings.length, 0);

// --- Output ---
console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║    Privacy Compliance Skills — JSON Schema Validator  ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

const ICONS = { OK: "✅", FAIL: "❌", ERROR: "❌", SKIP: "⏭️ " };

for (const r of results) {
  const icon = ICONS[r.status] ?? "❔";
  console.log(`${icon} [${r.status}]  ${r.file}`);

  for (const err of r.errors) {
    console.log(`     🔴 ERROR: ${err}`);
  }
  for (const warn of r.warnings) {
    console.log(`     🟡 WARN:  ${warn}`);
  }
}

console.log("\n─────────────────────────────────────────────────────");
const allOk = totalErrors === 0;
console.log(`Archivos recorridos : ${results.length}`);
console.log(`Errores de schema    : ${totalErrors}`);
console.log(`Advertencias         : ${totalWarnings}`);
console.log(allOk
  ? "\n✅  Todos los archivos pasan la validación de schema.\n"
  : "\n❌  Hay errores de schema. Corrige antes de hacer merge.\n"
);

process.exit(allOk ? 0 : 1);
