import {
  loadFormula,
  resolveStrictRegime,
  resolveRigorFactor,
  transferDestinationsCovered,
  getUsaFederalPenalizer,
  countIntegralStates,
  loadDevopsPenalizers,
} from "./rules.js";
import { getFrontendPenalizers } from "./frontend-scorer.js";
import { getBackendPenalizers } from "./backend-scorer.js";
import { getDevopsPenalizers } from "./devops-scorer.js";

export type DataCategory = "public" | "personal_general" | "sensitive";

export interface AuditInput {
  projectName: string;
  countries: string[];
  dataCategory: DataCategory;
  hasMinors: boolean;
  hasGranularConsent: boolean;
  serverRegion: "adequate" | "inadequate" | "unknown";
  thirdPartyTransfers: boolean;
  hasPrivacyPolicy: boolean;
  hasArcoProcedure: boolean;
  hasDpo?: boolean;
  hasLegalBasisPerPurpose?: boolean;
  hasBreachResponsePlan?: boolean;
  transferDestinations?: string[];
  usStates?: string[];
  usStateLawsMapped?: boolean;
  // MOTOR-06 — sub-pilar DevOps (7 señales, ver risk-engine/devops-penalizers.json).
  // undefined = "no respondido" y NUNCA activa un penalizador (distinguir
  // unknown/absent es CONTRATO-04, Fase 4).
  hasStagingEnv?: boolean;
  usesProdDataOutsideProd?: boolean;
  hasSecretsManager?: boolean;
  logsContainPii?: boolean;
  hasDependencyScanning?: boolean;
  hasTestedBackups?: boolean;
  hasCiRiskGate?: boolean;
}

export interface PenalizerResult {
  id: string;
  label: string;
  score: number;
  active: boolean;
  pillar?: "frontend" | "backend" | "both" | "devops";
  /** Los siguientes campos solo se pueblan desde JSON cuando el penalizador es
   *  JSON-sourced (MOTOR-03/MOTOR-08) — passthrough fiel, nunca inventado. */
  description?: string;
  legalRefs?: string[];
  fixHint?: string;
  configKey?: string;
  standardsRefs?: string[];
}

export interface DualScoreResult extends ScoreResult {
  fePenalizers: PenalizerResult[];
  bePenalizers: PenalizerResult[];
}

export interface ScoreResult {
  projectName: string;
  countries: string[];
  dataCategory: DataCategory;
  cBase: number;
  penalizers: PenalizerResult[];
  penalizersSum: number;
  fRigor: number;
  rawScore: number;
  finalScore: number;
  level: "low" | "medium" | "high";
  levelLabel: string;
  emoji: string;
  action: string;
  isStrictRegime: boolean;
  assumptions: string[];
  devopsPenalizers: PenalizerResult[];
  devopsRaw: number;
  devopsSubtotal: number;
}

/**
 * Calculates the Legal Risk Score for a project.
 *
 * Formula: min(100, (C_base + ΣPenalizers + DevOps_subtotal) × F_rigor)
 * - C_base: base score from data category (public=10, personal=40, sensitive=80)
 * - Penalizers: additive points for each missing compliance control
 * - DevOps_subtotal: min(Σ penalizadores DevOps activos, max_total del JSON) —
 *   cap propio del sub-panel, sumado ANTES del min(100) final (MOTOR-06/ADR-001)
 * - F_rigor: viene de cli/rules/risk-engine/region-factors.json (peor caso / máximo
 *   entre los bloques regulatorios aplicables a los países seleccionados)
 * - Los penalizadores reforzados (no_dpo, no_legal_basis, no_breach_plan) se activan
 *   por pertenencia a strict_regimes (fix T1, MOTOR-04), no por el valor de F_rigor
 */
export function calculateScore(input: AuditInput): ScoreResult {
  const formula = loadFormula();
  const { strict, assumptions } = resolveStrictRegime(input.countries);

  // C_base
  const cBase = formula.data_categories[input.dataCategory]?.base_score ?? 40;

  // Evaluate each penalizer
  const penalizerResults: PenalizerResult[] = [
    {
      id: "no_granular_consent",
      label: "Sin consentimiento granular por finalidad",
      score: 15,
      active: !input.hasGranularConsent,
      pillar: "frontend",
    },
    {
      id: "minors_data",
      label: "Datos de menores de edad sin proceso verificado",
      score: 30,
      active: input.hasMinors,
      pillar: "both",
    },
    {
      id: "non_adequate_servers",
      label: "Servidores fuera de jurisdicción sin garantías",
      score: 20,
      active: input.serverRegion !== "adequate",
      pillar: "backend",
    },
    {
      id: "unstructured_international_transfer",
      label: "Transferencia a terceros sin cláusulas contractuales",
      score: 15,
      active: input.thirdPartyTransfers && !transferDestinationsCovered(input.countries, input.transferDestinations),
      pillar: "backend",
    },
    {
      id: "no_privacy_policy",
      label: "Sin política de privacidad publicada",
      score: 10,
      active: !input.hasPrivacyPolicy,
      pillar: "frontend",
    },
    {
      id: "no_arco_procedure",
      label: "Sin canal ARCO/ARSOP documentado",
      score: 10,
      active: !input.hasArcoProcedure,
      pillar: "both",
    },
    {
      id: "no_dpo",
      label: "Sin DPO/Encarregado designado (LGPD/GDPR)",
      score: 15,
      active: strict && input.hasDpo === false,
      pillar: "backend",
    },
    {
      id: "no_legal_basis",
      label: "Sin base legal documentada por finalidad",
      score: 20,
      active: strict && input.hasLegalBasisPerPurpose === false,
      pillar: "backend",
    },
    {
      id: "no_breach_plan",
      label: "Sin plan de respuesta a brechas de seguridad",
      score: 15,
      active: strict && input.hasBreachResponsePlan === false,
      pillar: "backend",
    },
  ];

  // MOTOR-03 — cableado de us_multistate_exposure: la definición (score, description,
  // pillar) vive SOLO en usa-federal.json, el motor no la duplica. La llave
  // `us_state_laws_mapped` es wiring del motor (el JSON no declara config_key para
  // este penalizador), pendiente de bendición editorial.
  if (input.countries.includes("US")) {
    const def = getUsaFederalPenalizer("us_multistate_exposure");
    if (def) {
      // MOTOR-08 — passthrough fiel: usa-federal.json no declara standards_ref(s)
      // para este penalizador → standardsRefs queda undefined (nada inventado).
      const standardsRefs = def.standards_refs ?? (def.standards_ref ? [def.standards_ref] : undefined);
      penalizerResults.push({
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
      });
    }
  }

  const activePenalizers = penalizerResults.filter((p) => p.active);
  const penalizersSum = activePenalizers.reduce((sum, p) => sum + p.score, 0);
  const fRigor = resolveRigorFactor(input.countries, { usStates: input.usStates });

  // MOTOR-06/ADR-001 — sub-panel DevOps: cap propio leído del JSON
  // (scoring_rules.max_total), sumado a be_raw/rawScore ANTES del min(100).
  const devopsPenalizers = getDevopsPenalizers(input);
  const devopsRaw = devopsPenalizers.filter((p) => p.active).reduce((sum, p) => sum + p.score, 0);
  const devopsSubtotal = Math.min(devopsRaw, loadDevopsPenalizers().scoring_rules.max_total);

  const rawScore = (cBase + penalizersSum + devopsSubtotal) * fRigor;
  const finalScore = Math.min(100, Math.round(rawScore));

  // Level
  let level: "low" | "medium" | "high" = "low";
  let levelLabel = "🟢 BAJO";
  let action = formula.risk_levels.low.action;

  if (finalScore > 70) {
    level = "high";
    levelLabel = "🔴 ALTO";
    action = formula.risk_levels.high.action;
  } else if (finalScore > 30) {
    level = "medium";
    levelLabel = "🟡 MEDIO";
    action = formula.risk_levels.medium.action;
  }

  // Emoji face
  const emojiEntry = formula.emoji_face_scale.find(
    (e) => finalScore >= e.range[0] && finalScore <= e.range[1]
  );
  const emoji = emojiEntry?.face ?? "😐";

  return {
    projectName: input.projectName,
    countries: input.countries,
    dataCategory: input.dataCategory,
    cBase,
    penalizers: penalizerResults,
    penalizersSum,
    fRigor,
    rawScore,
    finalScore,
    level,
    levelLabel,
    emoji,
    action,
    isStrictRegime: strict,
    assumptions,
    devopsPenalizers,
    devopsRaw,
    devopsSubtotal,
  };
}

/**
 * Calculates the dual-pillar score, splitting findings into FE and BE panels.
 * Combined score is backward-compatible with calculateScore().
 */
export function calculateDualScore(input: AuditInput): DualScoreResult {
  const base = calculateScore(input);

  const fePenalizers = getFrontendPenalizers(input);
  const bePenalizers = getBackendPenalizers(input, base.isStrictRegime);

  return {
    ...base,
    fePenalizers,
    bePenalizers,
  };
}
