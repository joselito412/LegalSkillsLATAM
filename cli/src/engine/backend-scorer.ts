import type { AuditInput, PenalizerResult } from "./scorer.js";
import { transferDestinationsCovered } from "./rules.js";
import { buildUsMultistatePenalizer } from "./us-scorer.js";

/**
 * Returns the Backend penalizers (pillar: "backend" | "both") for an audit input.
 * Score range: 0–50 pts (pilar BE). C_base is added separately in the combined score.
 */
export function getBackendPenalizers(input: AuditInput, isStrict: boolean): PenalizerResult[] {
  const result: PenalizerResult[] = [
    {
      id: "non_adequate_servers",
      label: "Servidores fuera de jurisdicción sin garantías",
      score: 20,
      active: input.serverRegion !== "adequate",
      pillar: "backend",
    },
    {
      id: "unstructured_international_transfer",
      label: "Transferencia a terceros sin DPA / cláusulas contractuales",
      score: 15,
      active: input.thirdPartyTransfers && !transferDestinationsCovered(input.countries, input.transferDestinations),
      pillar: "backend",
    },
    {
      id: "no_dpo",
      label: "Sin DPO/Encarregado designado (LGPD/GDPR)",
      score: 15,
      active: isStrict && input.hasDpo === false,
      pillar: "backend",
    },
    {
      id: "no_legal_basis",
      label: "Sin base legal documentada por finalidad",
      score: 20,
      active: isStrict && input.hasLegalBasisPerPurpose === false,
      pillar: "backend",
    },
    {
      id: "no_breach_plan",
      label: "Sin plan de respuesta a brechas (LGPD/GDPR)",
      score: 15,
      active: isStrict && input.hasBreachResponsePlan === false,
      pillar: "backend",
    },
    {
      id: "minors_data_be",
      label: "Menores — sin restricciones técnicas en el sistema",
      score: 15,
      active: input.hasMinors,
      pillar: "both",
    },
    {
      id: "no_arco_backend",
      label: "Sin capacidad técnica de exportar/borrar datos de usuario",
      score: 5,
      active: !input.hasArcoProcedure,
      pillar: "both",
    },
  ];

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
