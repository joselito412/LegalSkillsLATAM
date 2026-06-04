import { readFileSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RULES_ROOT = resolve(__dirname, "../../../rules");

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

let _formula: ScoreFormula | null = null;

export function loadFormula(): ScoreFormula {
  if (_formula) return _formula;
  const path = join(RULES_ROOT, "risk-engine/score-formula.json");
  _formula = JSON.parse(readFileSync(path, "utf8")) as ScoreFormula;
  return _formula;
}

export function loadCountry(isoCode: string): CountryRules | null {
  const dirs = ["countries", "international"];
  for (const dir of dirs) {
    try {
      const files = ["colombia", "brasil", "mexico", "gdpr"].map((n) => `${n}.json`);
      for (const file of files) {
        const path = join(RULES_ROOT, dir, file);
        try {
          const data = JSON.parse(readFileSync(path, "utf8")) as CountryRules;
          const code =
            typeof data.country === "object"
              ? data.country.code
              : data.iso_code;
          if (code === isoCode) return data;
        } catch {
          continue;
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

export function getCountryName(isoCode: string): string {
  const map: Record<string, string> = {
    CO: "Colombia 🇨🇴", MX: "México 🇲🇽", BR: "Brasil 🇧🇷",
    CL: "Chile 🇨🇱", AR: "Argentina 🇦🇷", PE: "Perú 🇵🇪",
    EC: "Ecuador 🇪🇨", EU: "Europa 🇪🇺", US: "EE.UU. (CCPA) 🇺🇸",
  };
  return map[isoCode] ?? isoCode;
}

export function isStrictRegime(countries: string[]): boolean {
  return countries.some((c) => ["BR", "EU", "EC"].includes(c));
}
