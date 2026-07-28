/**
 * Tests para los endurecimientos post-validación Opus del PR 3A (Commit 5, PR 3B):
 * matcher estricto de destinos UE/EEE, y normalizeCountries() para la ruta --config.
 * Uses native Node.js test runner (node --test) — no extra dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { transferDestinationsCovered, normalizeCountries } from "../dist/engine/rules.js";

// ─── Matcher estricto de destinos UE/EEE ────────────────────────────────────

test("destino compuesto 'Europe, US' NO cuenta como bloque UE/EEE (falla hacia el lado inseguro)", () => {
  assert.equal(transferDestinationsCovered(["BR"], ["Europe, US"]), false);
});

test("destino compuesto 'US via European DC' NO cuenta como bloque UE/EEE", () => {
  assert.equal(transferDestinationsCovered(["BR"], ["US via European DC"]), false);
});

test("destino exacto 'Europa' SÍ cuenta como bloque UE/EEE", () => {
  assert.equal(transferDestinationsCovered(["BR"], ["Europa"]), true);
});

// ─── normalizeCountries() ───────────────────────────────────────────────────

test("normalizeCountries: minúsculas se normalizan a mayúsculas", () => {
  assert.deepEqual(normalizeCountries(["br"]), ["BR"]);
});

test("normalizeCountries: código inválido (3 letras) lanza", () => {
  assert.throws(() => normalizeCountries(["BRA"]));
});

test("normalizeCountries: espacios se recortan", () => {
  assert.deepEqual(normalizeCountries([" co ", "mx"]), ["CO", "MX"]);
});
