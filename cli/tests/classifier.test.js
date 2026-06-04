import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyText } from "../dist/engine/classifier.js";

test("diagnóstico médico → sensible", () => {
  const r = classifyText("diagnóstico médico historial clínico");
  assert.equal(r.category, "sensitive");
  assert.equal(r.baseScore, 80);
});

test("email + nombre → personal_general", () => {
  const r = classifyText("email nombre completo teléfono");
  assert.equal(r.category, "personal_general");
  assert.equal(r.baseScore, 40);
});

test("estadísticas agregadas → público", () => {
  const r = classifyText("estadísticas agregadas NIT razón social registro mercantil");
  assert.equal(r.category, "public");
  assert.equal(r.baseScore, 10);
});

test("biometría → sensible aunque haya email también", () => {
  const r = classifyText("email y huella dactilar biométrica");
  assert.equal(r.category, "sensitive");
});

test("datos de menores → sensible", () => {
  const r = classifyText("datos de menores de edad, guardaría, niños");
  assert.equal(r.category, "sensitive");
});
