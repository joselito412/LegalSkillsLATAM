#!/usr/bin/env node

/**
 * check-versions.js — Verifica consistencia de versión en todo el repo.
 *
 * Fuente única de verdad: cli/package.json (ver docs/VERSIONING.md).
 * Puntos que deben coincidir con ella:
 *   - package.json (raíz) → campo "version"
 *   - README.md          → badge de versión (shields.io)
 *   - README.en.md        → badge de versión (shields.io)
 *
 * Exit 0 si todos coinciden. Exit 1 con mensaje claro si alguno diverge.
 * Sin dependencias externas — solo módulos nativos de Node.
 *
 * Run: npm run check:versions
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(process.cwd());

function readJson(relPath) {
  const full = resolve(ROOT, relPath);
  let raw;
  try {
    raw = readFileSync(full, "utf8");
  } catch (e) {
    console.error(`❌ No se pudo leer ${relPath}: ${e.message}`);
    process.exit(1);
  }
  return JSON.parse(raw);
}

function readText(relPath) {
  const full = resolve(ROOT, relPath);
  try {
    return readFileSync(full, "utf8");
  } catch (e) {
    console.error(`❌ No se pudo leer ${relPath}: ${e.message}`);
    process.exit(1);
  }
}

/**
 * Extrae la versión del badge de shields.io con patrón version-X.Y.Z...-blue.
 * shields.io escapa los guiones literales del valor como "--", por lo que
 * "0.4.0-dev" aparece codificado en la URL como "0.4.0--dev".
 */
function extractBadgeVersion(markdown, relPath) {
  const match = markdown.match(/badge\/version-([\w.-]+)-blue/);
  if (!match) {
    console.error(
      `❌ No se encontró un badge de versión (patrón version-X.Y.Z...-blue) en ${relPath}`
    );
    process.exit(1);
  }
  return match[1].replace(/--/g, "-");
}

// --- Fuente única ---
const cliPkg = readJson("cli/package.json");
const source = cliPkg.version;

if (!source) {
  console.error("❌ cli/package.json no tiene campo 'version'. No hay fuente única que verificar.");
  process.exit(1);
}

// --- Puntos que deben propagar la fuente única ---
const rootPkg = readJson("package.json");
const readmeEs = readText("README.md");
const readmeEn = readText("README.en.md");

const checks = [
  { label: "package.json (raíz) → version", value: rootPkg.version },
  { label: "README.md → badge de versión", value: extractBadgeVersion(readmeEs, "README.md") },
  { label: "README.en.md → badge de versión", value: extractBadgeVersion(readmeEn, "README.en.md") },
];

const mismatches = checks.filter((c) => c.value !== source);

if (mismatches.length > 0) {
  console.error("\n❌ Inconsistencia de versión detectada.\n");
  console.error(`Fuente única (cli/package.json): ${source}\n`);
  for (const m of mismatches) {
    console.error(`   ✗ ${m.label}: ${m.value ?? "(no encontrado)"}  (esperado: ${source})`);
  }
  console.error(
    "\nActualiza los valores divergentes para que coincidan con cli/package.json. Ver docs/VERSIONING.md.\n"
  );
  process.exit(1);
}

console.log(`✅ Versión consistente en todo el repo: ${source}`);
for (const c of checks) {
  console.log(`   ✓ ${c.label}: ${c.value}`);
}
process.exit(0);
