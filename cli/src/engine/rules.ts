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

export interface CountryRules {
  country: string | { code: string; name: string; flag?: string; rigor_level?: string; rigor_factor?: number };
  iso_code?: string;
  rigor_level?: string;
  primary_law?: { name: string; regulator?: { name: string; acronym?: string } };
  sanctions?: { max_fine?: string; approximate_usd?: number; authority?: string };
  data_subject_rights?: Record<string, { available?: boolean; deadline_days?: number; deadline_type?: string }>;
  penalizers?: Array<{ id: string; description: string; score: number }>;
}

/** Single source of truth for all supported jurisdictions. */
export interface CountryMeta {
  code: string;
  name: string;
  flag: string;
  /** True for LGPD/GDPR/LOPDP regimes that apply the 1.25× rigor multiplier. */
  strictRegime?: boolean;
  /** Full display label used in CLI prompts. */
  label: string;
}

// ─── Country Catalogue ───────────────────────────────────────────────────────

export const COUNTRIES: CountryMeta[] = [
  { code: "CO", name: "Colombia",    flag: "🇨🇴", label: "🇨🇴 Colombia" },
  { code: "MX", name: "México",      flag: "🇲🇽", label: "🇲🇽 México" },
  { code: "BR", name: "Brasil",      flag: "🇧🇷", strictRegime: true, label: "🇧🇷 Brasil (LGPD — régimen estricto)" },
  { code: "CL", name: "Chile",       flag: "🇨🇱", label: "🇨🇱 Chile" },
  { code: "AR", name: "Argentina",   flag: "🇦🇷", label: "🇦🇷 Argentina" },
  { code: "PE", name: "Perú",        flag: "🇵🇪", label: "🇵🇪 Perú" },
  { code: "EC", name: "Ecuador",     flag: "🇪🇨", strictRegime: true, label: "🇪🇨 Ecuador (LOPDP — régimen estricto)" },
  { code: "EU", name: "Europa",      flag: "🇪🇺", strictRegime: true, label: "🇪🇺 Europa / GDPR (régimen estricto)" },
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

/**
 * Finds and returns the rule set for a given ISO country code.
 * Dynamically discovers all JSON files in countries/ and international/
 * so adding a new country file requires no code change.
 *
 * Not called by the CLI wizard — reserved for the Phase 3 REST API layer.
 */
export function loadCountry(isoCode: string): CountryRules | null {
  const dirs = ["countries", "international"];
  for (const dir of dirs) {
    const dirPath = join(RULES_ROOT, dir);
    let files: string[];
    try {
      files = readdirSync(dirPath).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the full display label for a country code (e.g. "🇧🇷 Brasil"). */
export function getCountryName(isoCode: string): string {
  return COUNTRIES.find((c) => c.code === isoCode)?.label ?? isoCode;
}

/** Returns true if any of the selected countries applies the strict-regime multiplier. */
export function isStrictRegime(countries: string[]): boolean {
  return countries.some((c) => COUNTRIES.find((m) => m.code === c)?.strictRegime === true);
}
