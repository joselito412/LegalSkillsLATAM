import type { AuditInput, PenalizerResult } from "./scorer.js";
import { resolveCatalogPenalizers } from "./penalizer-catalog.js";

/**
 * Returns the Frontend penalizers (pillar: "frontend" | "both") for an audit input.
 * Score range: 0–50 pts (pilar FE).
 *
 * Seleccionados de penalizer-catalog.ts (D8). `isStrict: false` es un
 * placeholder inerte: ninguno de estos 4 predicados de activación lo lee
 * (los penalizadores de régimen estricto son exclusivos del panel backend).
 */
export function getFrontendPenalizers(input: AuditInput): PenalizerResult[] {
  return resolveCatalogPenalizers(
    ["no_granular_consent", "no_privacy_policy", "minors_data_fe", "no_arco_ui"],
    { input, isStrict: false }
  );
}

export function calculateFrontendScore(input: AuditInput, fRigor: number): number {
  const penalizers = getFrontendPenalizers(input);
  const sum = penalizers.filter((p) => p.active).reduce((acc, p) => acc + p.score, 0);
  return Math.min(50, Math.round(sum * fRigor));
}
