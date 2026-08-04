import type { AuditInput, PenalizerResult } from "./scorer.js";
import { loadDevopsPenalizers } from "./rules.js";

/**
 * Mapa config_key (snake_case del JSON) → campo de AuditInput (camelCase).
 * Los 7 penalizadores de devops-penalizers.json declaran su `config_key`; este
 * mapa es el único punto donde el motor traduce esa llave a la propiedad que
 * lee del input (MOTOR-06).
 */
const DEVOPS_CONFIG_KEY_MAP: Record<string, keyof AuditInput> = {
  has_staging_env: "hasStagingEnv",
  uses_prod_data_outside_prod: "usesProdDataOutsideProd",
  has_secrets_manager: "hasSecretsManager",
  logs_contain_pii: "logsContainPii",
  has_dependency_scanning: "hasDependencyScanning",
  has_tested_backups: "hasTestedBackups",
  has_ci_risk_gate: "hasCiRiskGate",
};

/**
 * Returns the DevOps sub-panel penalizers (pillar: "devops") for an audit input.
 * Fuente: cli/rules/risk-engine/devops-penalizers.json (MOTOR-06, ADR-001).
 *
 * `inverted: true` → penaliza cuando el valor es `true` (presencia del riesgo,
 * ej. usesProdDataOutsideProd). El resto penaliza cuando el valor es `false`
 * (ausencia del control, ej. hasStagingEnv). `undefined` (no respondido) NUNCA
 * activa el penalizador — distinguir "unknown" de "absent" es CONTRATO-04
 * (Fase 4); por ahora el motor asume el caso más conservador para no inventar
 * un hallazgo sobre una pregunta sin responder.
 */
export function getDevopsPenalizers(input: AuditInput): PenalizerResult[] {
  const { penalizers } = loadDevopsPenalizers();

  return penalizers.map((def) => {
    const field = def.config_key ? DEVOPS_CONFIG_KEY_MAP[def.config_key] : undefined;
    const value = field ? (input[field] as boolean | undefined) : undefined;
    const inverted = def.inverted === true;
    const active = value === undefined ? false : inverted ? value === true : value === false;

    // MOTOR-08 — passthrough fiel: solo se puebla si el JSON lo declara.
    // O6 (verificación adversarial): `def.legal_refs`/`def.standards_refs` son
    // la MISMA referencia que loadDevopsPenalizers() (cacheada en rules.ts)
    // devuelve a todo el proceso. Se copian con spread al salir de esta
    // función — el único punto donde el motor entrega el array a un
    // consumidor externo — porque un `push` de cualquier llamador sobre el
    // array devuelto contaminaría la caché para todas las auditorías
    // siguientes del proceso, inyectando una referencia legal fabricada
    // (el repo prohíbe fabricar sustancia legal, §D4).
    const legalRefs = def.legal_refs ? [...def.legal_refs] : undefined;
    const standardsRefs = def.standards_refs
      ? [...def.standards_refs]
      : def.standards_ref
        ? [def.standards_ref]
        : undefined;

    return {
      id: def.id,
      label: (def.label as string | undefined) ?? def.description ?? def.id,
      score: def.score,
      active,
      pillar: "devops",
      description: def.description,
      legalRefs,
      fixHint: def.fix_hint,
      configKey: def.config_key,
      standardsRefs,
      // CONTRATO-01 (paso 1) — passthrough fiel: solo se puebla si el JSON lo
      // declara. devops-penalizers.json declara topic: "devops" en sus 7
      // penalizadores; si algún día no lo declarara, queda undefined.
      topic: def.topic,
    };
  });
}
