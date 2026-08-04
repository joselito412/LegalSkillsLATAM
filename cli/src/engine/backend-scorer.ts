import type { AuditInput, PenalizerResult } from "./scorer.js";
import { buildUsMultistatePenalizer } from "./us-scorer.js";
import { resolveCatalogPenalizers } from "./penalizer-catalog.js";

/**
 * Returns the Backend penalizers (pillar: "backend" | "both") for an audit input.
 * Score range: 0–50 pts (pilar BE). C_base is added separately in the combined score.
 *
 * Los 7 primeros salen de penalizer-catalog.ts (D8). `isStrict` sigue siendo
 * un parámetro explícito de esta función — el catálogo lo recibe como
 * contexto, nunca lo recalcula (fix T1).
 */
export function getBackendPenalizers(input: AuditInput, isStrict: boolean): PenalizerResult[] {
  const result: PenalizerResult[] = resolveCatalogPenalizers(
    [
      "non_adequate_servers",
      "unstructured_international_transfer",
      "no_dpo",
      "no_legal_basis",
      "no_breach_plan",
      "minors_data_be",
      "no_arco_backend",
    ],
    { input, isStrict }
  );

  // MOTOR-03/O-4 — ruta única compartida con scorer.ts (ver us-scorer.ts). Pilar
  // "both" se muestra completo en el panel BE (consistente con no_arco_backend):
  // el split FE/BE no se inventa aquí — el mapeo normativo multi-estatal es
  // trabajo de backend/legal-ops.
  const usMultistatePenalizer = buildUsMultistatePenalizer(input);
  if (usMultistatePenalizer) result.push(usMultistatePenalizer);

  return result;
}

/**
 * ADR-001/MOTOR-07: `devopsSubtotal` (ya capeado a max_total en el llamador,
 * ver scorer.ts) entra en be_raw ANTES del min(50) propio de este pilar.
 */
export function calculateBackendScore(
  input: AuditInput,
  cBase: number,
  isStrict: boolean,
  fRigor: number,
  devopsSubtotal = 0
): number {
  const penalizers = getBackendPenalizers(input, isStrict);
  const sum = penalizers.filter((p) => p.active).reduce((acc, p) => acc + p.score, 0);
  return Math.min(50, Math.round((cBase + sum + devopsSubtotal) * fRigor));
}
