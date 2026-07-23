#!/usr/bin/env node

/**
 * Privacy Compliance Skills — JSON Schema Validator
 * Validates all rules/*.json files against country-rules.schema.json
 * Run: npm run validate
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, relative } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { default: Ajv2020 } = await import("ajv/dist/2020.js");
const addFormats = require("ajv-formats");

const ROOT = resolve(process.cwd());
const SCHEMA_PATH = join(ROOT, "cli/rules/schema/country-rules.schema.json");
const RULES_DIRS = [
  join(ROOT, "cli/rules/countries"),
  join(ROOT, "cli/rules/international"),
];
const SKIP_FILES = ["_template.json"];

// --- Setup AJV (draft 2020-12) ---
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
const validate = ajv.compile(schema);

// --- Collect files ---
function collectJsonFiles(dirs) {
  const files = [];
  for (const dir of dirs) {
    try {
      for (const file of readdirSync(dir)) {
        if (!file.endsWith(".json")) continue;
        if (SKIP_FILES.includes(file)) continue;
        files.push(join(dir, file));
      }
    } catch {
      // dir doesn't exist yet — skip
    }
  }
  return files;
}

// --- Integrity checks (beyond schema) ---
function integrityChecks(data, filePath) {
  const warnings = [];
  const rel = relative(ROOT, filePath);

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

// --- Run validation ---
const files = collectJsonFiles(RULES_DIRS);

if (files.length === 0) {
  console.log("⚠️  No se encontraron archivos JSON en cli/rules/");
  process.exit(0);
}

let totalErrors = 0;
let totalWarnings = 0;
const results = [];

for (const filePath of files) {
  const rel = relative(ROOT, filePath);
  let data;

  try {
    data = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (e) {
    results.push({ file: rel, status: "ERROR", errors: [`JSON inválido: ${e.message}`], warnings: [] });
    totalErrors++;
    continue;
  }

  const valid = validate(data);
  const schemaErrors = valid ? [] : validate.errors.map(
    (e) => `${e.instancePath || "(raíz)"} ${e.message}`
  );
  const warnings = integrityChecks(data, filePath);

  totalErrors += schemaErrors.length;
  totalWarnings += warnings.length;

  results.push({
    file: rel,
    status: schemaErrors.length === 0 ? "OK" : "FAIL",
    errors: schemaErrors,
    warnings,
  });
}

// --- Output ---
console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║    Privacy Compliance Skills — JSON Schema Validator  ║");
console.log("╚══════════════════════════════════════════════════════╝\n");

for (const r of results) {
  const icon = r.status === "OK" ? "✅" : "❌";
  console.log(`${icon}  ${r.file}`);

  for (const err of r.errors) {
    console.log(`     🔴 ERROR: ${err}`);
  }
  for (const warn of r.warnings) {
    console.log(`     🟡 WARN:  ${warn}`);
  }
}

console.log("\n─────────────────────────────────────────────────────");
const allOk = totalErrors === 0;
console.log(`Archivos validados : ${files.length}`);
console.log(`Errores de schema  : ${totalErrors}`);
console.log(`Advertencias       : ${totalWarnings}`);
console.log(allOk
  ? "\n✅  Todos los archivos pasan la validación de schema.\n"
  : "\n❌  Hay errores de schema. Corrige antes de hacer merge.\n"
);

process.exit(allOk ? 0 : 1);
