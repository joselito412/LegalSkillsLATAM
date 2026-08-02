import type { AuditInput, PenalizerResult } from "./scorer.js";
import { getUsaFederalPenalizer, countIntegralStates } from "./rules.js";

/**
 * Construye el PenalizerResult único de `us_multistate_exposure` (MOTOR-03).
 * Antes de este fix, la misma lógica de activación/passthrough estaba
 * duplicada en scorer.ts y backend-scorer.ts — dos sitios que podían divergir
 * silenciosamente. Ahora hay una sola ruta; ambos callers la reutilizan
 * (candado de ruta única, obs. O-4 de la validación Opus del PR 3B).
 *
 * Fail-loud (obs. O-2): si el proyecto declara "US" pero usa-federal.json no
 * está disponible o no declara este penalizador, el motor NO degrada el score
 * en silencio (fail-open) — lanza, porque un motor de riesgo legal que sigue
 * calculando sobre reglas rotas es peor que uno que se detiene.
 */
export function buildUsMultistatePenalizer(input: AuditInput): PenalizerResult | null {
  if (!input.countries.includes("US")) return null;

  const def = getUsaFederalPenalizer("us_multistate_exposure");
  if (!def) {
    throw new Error(
      "Integridad de reglas comprometida: cli/rules/us/usa-federal.json no disponible o sin us_multistate_exposure (el proyecto declara US). Reinstala el paquete o restaura el archivo."
    );
  }

  // MOTOR-08 — passthrough fiel: solo se puebla si el JSON lo declara.
  const standardsRefs = def.standards_refs ?? (def.standards_ref ? [def.standards_ref] : undefined);

  return {
    id: def.id,
    label: def.description ?? def.id, // el label sale del JSON, no se inventa
    score: def.score,
    active: countIntegralStates(input.usStates) >= 2 && input.usStateLawsMapped !== true,
    pillar: (def.pillar as PenalizerResult["pillar"]) ?? "both",
    description: def.description,
    legalRefs: def.legal_refs,
    fixHint: def.fix_hint,
    configKey: def.config_key,
    standardsRefs,
    // CONTRATO-01 (paso 1) — passthrough fiel: usa-federal.json no declara
    // topic para us_multistate_exposure, así que queda undefined. Es un vacío
    // editorial ya trackeado (AUD-01) — el motor no lo rellena.
    topic: def.topic,
  };
}
