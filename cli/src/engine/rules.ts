import { readFileSync, readdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// cli/dist/engine/ → cli/dist/ → cli/ → cli/rules/
const RULES_ROOT = resolve(__dirname, "../../rules");

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScoreFormula {
  data_categories: Record<string, { label: string; base_score: number; examples: string[] }>;
  penalizers: Array<{ id: string; label: string; description: string; score: number; legal_refs: string[] }>;
  rigor_factors: Record<string, { label: string; multiplier: number; trigger: string }>;
  risk_levels: Record<string, { range: [number, number]; label: string; emoji_face: string; action: string }>;
  emoji_face_scale: Array<{ range: [number, number]; face: string; label: string }>;
}

/** Un miembro de la lista strict_regimes en region-factors.json (fix T1, MOTOR-04). */
export interface StrictRegimeMember {
  code: string;
  strict_from?: string;
  status?: string;
  engine_default?: string;
  basis?: string;
}

/**
 * Matriz de leyes estatales integrales de EE.UU. (us/state-matrix.json).
 * `count` es un metadato editorial (hoy 19, ver `pending_verification` en el JSON)
 * — el motor NUNCA lee `count`, solo el array `states`. El tipo es tolerante a
 * `pending_verification` y a cualquier otra key adicional del documento.
 */
export interface StateMatrix {
  states: Array<{ code: string; name?: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

/** Factores de rigor (F_rigor) por bloque regulatorio, desde risk-engine/region-factors.json. */
export interface RegionFactors {
  strict_regimes?: { members: StrictRegimeMember[] };
  blocks: {
    eu: { f_rigor: number; [key: string]: unknown };
    us: { f_rigor: number; [key: string]: unknown };
    latam: {
      f_rigor: number;
      per_country_overrides?: Record<string, { f_rigor?: number; [key: string]: unknown }>;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

/** Una decisión de adecuación declarada en international_transfer.adequacy_decisions. */
export interface AdequacyDecision {
  destination: string;
  scope_detail?: string;
  instrument?: string;
  exclusions?: string;
  [key: string]: unknown;
}

/**
 * Un penalizador declarado en el bloque `penalizers` de un JSON de reglas
 * (country-rules o devops-penalizers). Los campos opcionales solo existen si
 * el JSON los declara — el motor hace passthrough fiel, nunca inventa valores
 * (MOTOR-03/MOTOR-08).
 */
export interface RulePenalizer {
  id: string;
  description?: string;
  score: number;
  applies_when?: string;
  pillar?: string;
  legal_refs?: string[];
  fix_hint?: string;
  config_key?: string;
  standards_ref?: string;
  standards_refs?: string[];
  [key: string]: unknown;
}

/**
 * Catálogo de penalizadores del sub-pilar DevOps (risk-engine/devops-penalizers.json),
 * MOTOR-06. `scoring_rules.max_total` es el cap del sub-panel (ver ADR-001).
 */
export interface DevopsPenalizers {
  penalizers: RulePenalizer[];
  scoring_rules: { max_total: number; [key: string]: unknown };
  [key: string]: unknown;
}

export interface CountryRules {
  country: string | { code: string; name: string; flag?: string; rigor_level?: string; rigor_factor?: number };
  iso_code?: string;
  rigor_level?: string;
  primary_law?: { name: string; regulator?: { name: string; acronym?: string } };
  sanctions?: { max_fine?: string; approximate_usd?: number; authority?: string };
  data_subject_rights?: Record<string, { available?: boolean; deadline_days?: number; deadline_type?: string }>;
  penalizers?: RulePenalizer[];
  international_transfer?: {
    adequacy_decisions?: AdequacyDecision[];
    [key: string]: unknown;
  };
}

/** Single source of truth for all supported jurisdictions. */
export interface CountryMeta {
  code: string;
  name: string;
  flag: string;
  /** Full display label used in CLI prompts. */
  label: string;
}

// ─── Country Catalogue ───────────────────────────────────────────────────────

export const COUNTRIES: CountryMeta[] = [
  { code: "CO", name: "Colombia",    flag: "🇨🇴", label: "🇨🇴 Colombia" },
  { code: "MX", name: "México",      flag: "🇲🇽", label: "🇲🇽 México" },
  { code: "BR", name: "Brasil",      flag: "🇧🇷", label: "🇧🇷 Brasil (LGPD — régimen estricto)" },
  { code: "CL", name: "Chile",       flag: "🇨🇱", label: "🇨🇱 Chile" },
  { code: "AR", name: "Argentina",   flag: "🇦🇷", label: "🇦🇷 Argentina" },
  { code: "PE", name: "Perú",        flag: "🇵🇪", label: "🇵🇪 Perú" },
  { code: "EC", name: "Ecuador",     flag: "🇪🇨", label: "🇪🇨 Ecuador (LOPDP — régimen estricto)" },
  { code: "EU", name: "Europa",      flag: "🇪🇺", label: "🇪🇺 Europa / GDPR (régimen estricto)" },
  { code: "US", name: "EE.UU.",      flag: "🇺🇸", label: "🇺🇸 EE.UU. / CCPA" },
];

// ─── Loaders ─────────────────────────────────────────────────────────────────

let _formula: ScoreFormula | null = null;

/** Loads (and caches) the risk-score formula from cli/rules/risk-engine/. */
export function loadFormula(): ScoreFormula {
  if (_formula) return _formula;
  const path = join(RULES_ROOT, "risk-engine/score-formula.json");
  _formula = JSON.parse(readFileSync(path, "utf8")) as ScoreFormula;
  return _formula;
}

let _regionFactors: RegionFactors | null = null;

/** Loads (and caches) el catálogo de F_rigor por bloque desde cli/rules/risk-engine/region-factors.json. */
export function loadRegionFactors(): RegionFactors {
  if (_regionFactors) return _regionFactors;
  const path = join(RULES_ROOT, "risk-engine/region-factors.json");
  _regionFactors = JSON.parse(readFileSync(path, "utf8")) as RegionFactors;
  return _regionFactors;
}

let _stateMatrix: StateMatrix | null = null;

/**
 * Loads (and caches) la matriz de leyes estatales integrales de EE.UU. desde
 * cli/rules/us/state-matrix.json (MOTOR-02). El `count` del JSON es metadato
 * editorial (se queda en 19 a propósito, ver bloque `pending_verification`);
 * el motor solo consume el array `states`.
 */
export function loadStateMatrix(): StateMatrix {
  if (_stateMatrix) return _stateMatrix;
  const path = join(RULES_ROOT, "us/state-matrix.json");
  _stateMatrix = JSON.parse(readFileSync(path, "utf8")) as StateMatrix;
  return _stateMatrix;
}

let _devopsPenalizers: DevopsPenalizers | null = null;

/**
 * Loads (and caches) el catálogo de penalizadores DevOps desde
 * cli/rules/risk-engine/devops-penalizers.json (MOTOR-06, ADR-001).
 */
export function loadDevopsPenalizers(): DevopsPenalizers {
  if (_devopsPenalizers) return _devopsPenalizers;
  const path = join(RULES_ROOT, "risk-engine/devops-penalizers.json");
  _devopsPenalizers = JSON.parse(readFileSync(path, "utf8")) as DevopsPenalizers;
  return _devopsPenalizers;
}

/**
 * Normaliza (mayúsculas/trim), deduplica, e intersecta una lista de códigos de
 * estado de EE.UU. contra los `code` presentes en us/state-matrix.json.
 * Estados fuera de la matriz (sin ley integral modelada) NO cuentan (MOTOR-02).
 */
export function countIntegralStates(usStates: string[] | undefined): number {
  if (!usStates || usStates.length === 0) return 0;
  const matrixCodes = new Set(loadStateMatrix().states.map((s) => s.code));
  const normalized = new Set(
    usStates.map((s) => s.trim().toUpperCase()).filter((s) => matrixCodes.has(s))
  );
  return normalized.size;
}

/**
 * Reloj inyectable del motor: usa LLS_FAKE_NOW si está definida y es una fecha
 * válida, si no devuelve la fecha real. Base para QA-03 (golden tests, Fase 5).
 */
export function currentDate(): Date {
  const fake = process.env.LLS_FAKE_NOW;
  if (fake) {
    const parsed = new Date(fake);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

/**
 * Finds and returns the rule set for a given ISO country code.
 * Dynamically discovers all JSON files in the three top-level blocks
 * (eu/, us/, latam/) so adding a new country file requires no code change.
 *
 * us/ also contains state-matrix.json, which is NOT a country-rules document
 * (it validates against us-state-matrix.schema.json — no `country`/`iso_code`
 * field) and is excluded explicitly so it can never be mismatched against an
 * ISO code. usa-federal.json (US, CCPA/CPRA baseline) DOES load normally here
 * — this function is pure data access (readdirSync + JSON.parse), not called
 * by the CLI wizard/scorer today (reserved for the Phase 3 REST API layer),
 * so returning it does not wire any USA-specific scoring logic.
 * El escalado multi-estatal y us_multistate_exposure quedaron cableados en la
 * Fase 3 (MOTOR-02/03) — ver resolveRigorFactor() y getUsaFederalPenalizer().
 */
export function loadCountry(isoCode: string): CountryRules | null {
  const dirs = ["eu", "us", "latam"];
  for (const dir of dirs) {
    const dirPath = join(RULES_ROOT, dir);
    let files: string[];
    try {
      files = readdirSync(dirPath).filter(
        (f) => f.endsWith(".json") && !f.startsWith("_") && f !== "state-matrix.json"
      );
    } catch {
      continue;
    }
    for (const file of files) {
      try {
        const data = JSON.parse(readFileSync(join(dirPath, file), "utf8")) as CountryRules;
        const code = typeof data.country === "object" ? data.country.code : data.iso_code;
        if (code === isoCode) return data;
      } catch {
        continue;
      }
    }
  }
  return null;
}

/**
 * Busca un penalizador por id en el bloque `penalizers` de usa-federal.json
 * (MOTOR-03). La definición vive SOLO ahí — el motor no la duplica, solo la
 * cablea. Devuelve null si loadCountry("US") no encuentra el archivo (código
 * "US" ausente) o si el id no está en su lista de penalizadores.
 */
export function getUsaFederalPenalizer(id: string): RulePenalizer | null {
  const us = loadCountry("US");
  return us?.penalizers?.find((p) => p.id === id) ?? null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the full display label for a country code (e.g. "🇧🇷 Brasil"). */
export function getCountryName(isoCode: string): string {
  return COUNTRIES.find((c) => c.code === isoCode)?.label ?? isoCode;
}

/**
 * Resuelve la pertenencia a régimen estricto consultando strict_regimes.members
 * de region-factors.json (fix T1, MOTOR-04) — nunca por comparación numérica de F_rigor.
 *
 * Reglas por miembro:
 * - sin `strict_from` ni `status` → estricto siempre (ej. EU, BR).
 * - con `strict_from` → estricto solo si `now >= strict_from` (ej. CL desde 2026-12-01).
 * - con `status === "pending_editorial_decision"` → estricto solo si
 *   `engine_default === "strict"` (default seguro del motor; hoy EC).
 *
 * También devuelve `assumptions`: entradas legibles para el usuario cuando el
 * motor aplicó un default seguro por una decisión editorial pendiente (MOTOR-05).
 */
export function resolveStrictRegime(
  countries: string[],
  now: Date = currentDate()
): { strict: boolean; assumptions: string[] } {
  const members = loadRegionFactors().strict_regimes?.members ?? [];
  let strict = false;
  const assumptions: string[] = [];

  for (const code of countries) {
    const member = members.find((m) => m.code === code);
    if (!member) continue;

    if (member.status === "pending_editorial_decision") {
      if (member.engine_default === "strict") {
        strict = true;
        if (code === "EC") {
          assumptions.push(
            "Ecuador se trata como régimen estricto por defecto seguro del motor (decisión editorial T1 pendiente — ver knowledge/insumos/ecuador-spdp-2026.md §4): los penalizadores reforzados LOPDP se activan y el F_rigor aplicado es el de region-factors.json."
          );
        }
      }
      continue;
    }

    if (member.strict_from) {
      if (now >= new Date(member.strict_from)) strict = true;
      continue;
    }

    // Sin strict_from ni status → estricto siempre.
    strict = true;
  }

  return { strict, assumptions };
}

/** Returns true if any of the selected countries applies the strict-regime multiplier. */
export function isStrictRegime(countries: string[], now: Date = currentDate()): boolean {
  return resolveStrictRegime(countries, now).strict;
}

/**
 * Resuelve F_rigor (peor caso / máximo) entre los bloques regulatorios aplicables
 * a los países seleccionados, leyendo cli/rules/risk-engine/region-factors.json.
 * - "EU" → blocks.eu.f_rigor
 * - "US" → blocks.us.f_rigor escalado por MOTOR-02 (ver más abajo)
 * - cualquier otro código → blocks.latam.per_country_overrides[code]?.f_rigor ?? blocks.latam.f_rigor
 * - lista vacía → 1.0
 */
export function resolveRigorFactor(countries: string[], opts?: { usStates?: string[] }): number {
  if (countries.length === 0) return 1.0;

  const { blocks } = loadRegionFactors();
  const applicable = countries.map((code) => {
    if (code === "EU") return blocks.eu.f_rigor;
    if (code === "US") {
      const base = blocks.us.f_rigor;
      const n = countIntegralStates(opts?.usStates);
      // MOTOR-02: +0.02 por estado adicional con ley integral, cap 1.20
      // (region-factors.json blocks.us.scaling_note pide implementarlo en el scorer)
      const US_STATE_STEP = 0.02;
      const US_SCALING_CAP = 1.2;
      const factor = n >= 1 ? Math.min(US_SCALING_CAP, base + US_STATE_STEP * (n - 1)) : base;
      // Redondeo a 2 decimales para evitar flotantes tipo 1.1400000000000001
      return Math.round(factor * 100) / 100;
    }
    return blocks.latam.per_country_overrides?.[code]?.f_rigor ?? blocks.latam.f_rigor;
  });

  // Peor caso: el F_rigor más alto entre los bloques/países aplicables.
  return Math.max(1.0, ...applicable);
}

/** Devuelve las decisiones de adecuación declaradas para un país (o [] si no hay). */
export function getAdequacyDecisions(isoCode: string): AdequacyDecision[] {
  return loadCountry(isoCode)?.international_transfer?.adequacy_decisions ?? [];
}

// Un destino declarado cuenta como bloque UE/EEE si (normalizado, sin espacios,
// case-insensitive) es exactamente uno de estos códigos cortos, o si contiene
// "europ" (cubre "Unión Europea", "União Europeia", "European Union", "Europa").
const EU_DESTINATION_SHORT_CODES = /^(eu|ue|eea|eee)$/i;

function isEuDestination(destination: string): boolean {
  const normalized = destination.trim();
  if (EU_DESTINATION_SHORT_CODES.test(normalized)) return true;
  return /europ/i.test(normalized);
}

// Matcher conservador: reconoce menciones del bloque UE/EEE en destination/scope_detail
// de una decisión de adecuación. Se amplía cuando el equipo editorial declare más destinos.
const EU_ADEQUACY_MENTION = /uni[aã]o europeia|uni[oó]n europea|european union|europ|EEE|EEA|\bUE\b|\bEU\b/i;

function adequacyDecisionCoversEu(decision: AdequacyDecision): boolean {
  const text = `${decision.destination} ${decision.scope_detail ?? ""}`;
  return EU_ADEQUACY_MENTION.test(text);
}

/**
 * Determina si TODOS los destinos declarados de transferencia internacional están
 * cubiertos por decisiones de adecuación de TODOS los países del proyecto
 * (resolución peor-caso: un país sin adequacy_decisions — p. ej. CO — hace que
 * devuelva false). Sin destinos declarados → false (peor caso: no hay base para
 * suprimir el penalizador).
 *
 * La fuente son international_transfer.adequacy_decisions de los JSON de reglas
 * (hoy solo brasil.json, Res. CD/ANPD 32/2026): el motor no afirma adecuaciones
 * que los JSON no declaren. Por ahora el matcher solo reconoce destinos del
 * bloque UE/EEE — destinos fuera de ese bloque no se consideran cubiertos hasta
 * que el equipo editorial añada más decisiones. Las `exclusions` del bloque
 * (seguridad pública, defensa, etc.) no se modelan aún: el `applies_when` del
 * JSON de reglas las documenta.
 */
export function transferDestinationsCovered(
  countries: string[],
  destinations: string[] | undefined
): boolean {
  if (!destinations || destinations.length === 0) return false;

  return countries.every((code) => {
    const decisions = getAdequacyDecisions(code);
    if (decisions.length === 0) return false;

    return destinations.every((dest) => {
      if (!isEuDestination(dest)) return false;
      return decisions.some((d) => adequacyDecisionCoversEu(d));
    });
  });
}
