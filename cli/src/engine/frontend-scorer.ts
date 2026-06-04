import type { AuditInput, PenalizerResult } from "./scorer.js";

/**
 * Returns the Frontend penalizers (pillar: "frontend" | "both") for an audit input.
 * Score range: 0–50 pts (pilar FE).
 */
export function getFrontendPenalizers(input: AuditInput): PenalizerResult[] {
  return [
    {
      id: "no_granular_consent",
      label: "Sin consentimiento granular por finalidad",
      score: 15,
      active: !input.hasGranularConsent,
      pillar: "frontend",
    },
    {
      id: "no_privacy_policy",
      label: "Sin política de privacidad publicada",
      score: 10,
      active: !input.hasPrivacyPolicy,
      pillar: "frontend",
    },
    {
      id: "minors_data_fe",
      label: "Menores — sin flujo de consentimiento parental en UI",
      score: 15,
      active: input.hasMinors,
      pillar: "both",
    },
    {
      id: "no_arco_ui",
      label: "Sin canal ARCO visible para el usuario",
      score: 5,
      active: !input.hasArcoProcedure,
      pillar: "both",
    },
  ];
}

export function calculateFrontendScore(input: AuditInput, fRigor: number): number {
  const penalizers = getFrontendPenalizers(input);
  const sum = penalizers.filter((p) => p.active).reduce((acc, p) => acc + p.score, 0);
  return Math.min(50, Math.round(sum * fRigor));
}
