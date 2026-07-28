import { input, checkbox, confirm } from "@inquirer/prompts";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";
import { calculateDualScore, type AuditInput, type DataCategory } from "../engine/scorer.js";
import { classifyText } from "../engine/classifier.js";
import { COUNTRIES, isStrictRegime, loadStateMatrix, countIntegralStates } from "../engine/rules.js";
import { renderDualScoreBox } from "../ui/box.js";

interface ConfigFile {
  project_name?: string;
  countries?: string[];
  data_types?: string[];
  has_minors?: boolean;
  server_region?: string;
  third_parties?: string[];
  has_granular_consent?: boolean;
  has_privacy_policy?: boolean;
  has_arco_procedure?: boolean;
  has_dpo?: boolean;
  has_legal_basis_per_purpose?: boolean;
  has_breach_response_plan?: boolean;
  transfer_destinations?: string[];
  us_states?: string[];
  us_state_laws_mapped?: boolean;
  has_staging_env?: boolean;
  uses_prod_data_outside_prod?: boolean;
  has_secrets_manager?: boolean;
  logs_contain_pii?: boolean;
  has_dependency_scanning?: boolean;
  has_tested_backups?: boolean;
  has_ci_risk_gate?: boolean;
}

const COUNTRY_CHOICES = COUNTRIES.map((c) => ({ name: c.label, value: c.code }));

function inferCategoryFromDataTypes(dataTypes: string[]): DataCategory {
  const text = dataTypes.join(" ");
  const result = classifyText(text);
  return result.category;
}

function serverRegionFromString(s: string): "adequate" | "inadequate" | "unknown" {
  const adequate = ["sa-east-1", "eu-", "latam", "sao paulo", "brasil", "brazil", "irlanda", "ireland", "frankfurt", "paris"];
  const lower = s.toLowerCase();
  if (adequate.some((a) => lower.includes(a))) return "adequate";
  if (lower.includes("us-") || lower.includes("us east") || lower.includes("virginia") || lower.includes("oregon")) return "inadequate";
  return "unknown";
}

export async function runAuditWizard(options: { config?: boolean; json?: boolean; failOn?: number }): Promise<void> {
  let configData: ConfigFile = {};

  if (options.config) {
    const configPath = resolve(process.cwd(), "legalskills.config.json");
    if (!existsSync(configPath)) {
      console.error(chalk.red("❌ No se encontró legalskills.config.json en el directorio actual."));
      process.exit(1);
    }
    configData = JSON.parse(readFileSync(configPath, "utf8")) as ConfigFile;
    console.log(chalk.dim(`\nLeyendo configuración desde legalskills.config.json...\n`));
  }

  if (!options.config) {
    console.log(chalk.bold("\n🔍 Privacy Compliance Skills — Auditoría Legal Rápida\n"));
    console.log(chalk.dim("Responde 5 preguntas para calcular tu Legal Risk Score.\n"));
  }

  // Q1 — Project name
  const projectName: string =
    configData.project_name ??
    (await input({ message: "¿Cómo se llama tu proyecto o startup?" }));

  // Q2 — Countries
  const countries: string[] =
    configData.countries ??
    (await checkbox({
      message: "¿En qué países opera o planea operar?",
      choices: COUNTRY_CHOICES,
      validate: (v) => v.length > 0 || "Selecciona al menos un país.",
    }));

  // Q3 — Data types
  const rawDataTypes: string =
    configData.data_types?.join(", ") ??
    (await input({
      message: "¿Qué datos recopila o procesa tu sistema?",
      default: "email, nombre",
    }));

  const dataCategory = inferCategoryFromDataTypes(
    configData.data_types ?? rawDataTypes.split(",").map((s) => s.trim())
  );

  // Q2b — Estados de EE.UU. (MOTOR-02) — solo si el proyecto opera en US
  const usStates: string[] | undefined = countries.includes("US")
    ? configData.us_states ??
      (await checkbox({
        message:
          "¿En qué estados de EE.UU. tiene usuarios? (solo se listan estados con ley integral de privacidad — deja vacío si no sabes)",
        choices: loadStateMatrix().states.map((s) => ({
          name: `${s.code} — ${s.name ?? s.code}`,
          value: s.code,
        })),
      }))
    : undefined;

  // Q2c — Mapeo de leyes estatales (MOTOR-03) — solo si ≥2 estados integrales
  const usStateLawsMapped: boolean | undefined =
    countries.includes("US") && countIntegralStates(usStates) >= 2
      ? configData.us_state_laws_mapped ??
        (await confirm({
          message:
            "¿Han mapeado qué leyes estatales integrales aplican a su producto? (us/state-matrix.json)",
          default: false,
        }))
      : undefined;

  // Q4 — Minors
  const hasMinors: boolean =
    configData.has_minors ??
    (await confirm({ message: "¿El sistema puede recibir datos de menores de edad?", default: false }));

  // Q5 — Consent
  const hasGranularConsent: boolean =
    configData.has_granular_consent ??
    (await confirm({ message: "¿Tiene consentimiento granular por finalidad (no solo 'Acepto todo')?", default: false }));

  // Q6 — Servers
  const serverInput: string =
    configData.server_region ??
    (await input({
      message: "¿Dónde están sus servidores? (ej: AWS us-east-1, GCP sa-east-1)",
      default: "no definido",
    }));
  const serverRegion = serverRegionFromString(serverInput);

  // Q7 — Third parties
  const thirdPartyInput: string =
    configData.third_parties?.join(", ") ??
    (await input({
      message: "¿Comparte datos con terceros? (ej: Stripe, Google Analytics, HubSpot — deja vacío si no)",
      default: "",
    }));
  const thirdPartyTransfers = thirdPartyInput.trim().length > 0;

  // Q8 — Privacy policy + ARCO
  const hasPrivacyPolicy: boolean =
    configData.has_privacy_policy ??
    (await confirm({ message: "¿Tienen política de privacidad publicada?", default: false }));

  const hasArcoProcedure: boolean =
    configData.has_arco_procedure ??
    (await confirm({ message: "¿Tienen canal documentado para solicitudes ARCO/derechos de datos?", default: false }));

  // Q9 — DevOps (MOTOR-06, ADR-001): 7 señales del sub-panel "⚙️ DevOps",
  // desde risk-engine/devops-penalizers.json. Todas default false.
  if (!options.config) {
    console.log(chalk.bold("\n⚙️  DevOps — Entornos, pipeline y operación"));
  }

  const hasStagingEnv: boolean =
    configData.has_staging_env ??
    (await confirm({ message: "¿Tienen un entorno de staging previo a producción?", default: false }));

  const usesProdDataOutsideProd: boolean =
    configData.uses_prod_data_outside_prod ??
    (await confirm({ message: "¿Usan datos reales de producción en dev/staging?", default: false }));

  const hasSecretsManager: boolean =
    configData.has_secrets_manager ??
    (await confirm({
      message: "¿Gestionan secretos con un gestor dedicado (Vault, AWS/GCP Secrets)?",
      default: false,
    }));

  const logsContainPii: boolean =
    configData.logs_contain_pii ??
    (await confirm({ message: "¿Los logs de aplicación contienen PII sin enmascarar?", default: false }));

  const hasDependencyScanning: boolean =
    configData.has_dependency_scanning ??
    (await confirm({ message: "¿El CI escanea dependencias y código (SCA/SAST)?", default: false }));

  const hasTestedBackups: boolean =
    configData.has_tested_backups ??
    (await confirm({ message: "¿Tienen backups cifrados con restauración probada?", default: false }));

  const hasCiRiskGate: boolean =
    configData.has_ci_risk_gate ??
    (await confirm({
      message:
        "¿El pipeline ejecuta la auditoría legal como gate (privacy-compliance-skills audit --fail-on)?",
      default: false,
    }));

  // Preguntas extra de régimen estricto — pertenencia a strict_regimes de region-factors.json (fix T1, MOTOR-04)
  const isStrict = isStrictRegime(countries);
  let hasDpo: boolean | undefined;
  let hasLegalBasisPerPurpose: boolean | undefined;
  let hasBreachResponsePlan: boolean | undefined;

  if (isStrict) {
    hasDpo =
      configData.has_dpo ??
      (await confirm({ message: "¿Tienen DPO/Encarregado de Dados designado y publicado?", default: false }));
    hasLegalBasisPerPurpose =
      configData.has_legal_basis_per_purpose ??
      (await confirm({ message: "¿Tienen base legal documentada por cada finalidad de tratamiento?", default: false }));
    hasBreachResponsePlan =
      configData.has_breach_response_plan ??
      (await confirm({ message: "¿Tienen plan de respuesta a brechas de seguridad documentado?", default: false }));
  }

  const auditInput: AuditInput = {
    projectName,
    countries,
    dataCategory,
    hasMinors,
    hasGranularConsent,
    serverRegion,
    thirdPartyTransfers,
    hasPrivacyPolicy,
    hasArcoProcedure,
    hasDpo,
    hasLegalBasisPerPurpose,
    hasBreachResponsePlan,
    transferDestinations: configData.transfer_destinations,
    usStates,
    usStateLawsMapped,
    hasStagingEnv,
    usesProdDataOutsideProd,
    hasSecretsManager,
    logsContainPii,
    hasDependencyScanning,
    hasTestedBackups,
    hasCiRiskGate,
  };

  const result = calculateDualScore(auditInput);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("\n" + renderDualScoreBox(result) + "\n");

    if (result.finalScore >= 71) {
      console.log(chalk.red.bold("🔴 Auditoría legal obligatoria.") + " Este nivel de riesgo supera lo que una guía automatizada puede gestionar de forma segura. Contacta un abogado especialista en protección de datos.\n");
    } else if (result.finalScore >= 31) {
      console.log(chalk.yellow("🟡 Implementa las acciones prioritarias antes de lanzar.") + " Ver guía completa en https://github.com/joselito412/Privacy_Compliance_Skills-UE-USA-LATAM\n");
    } else {
      console.log(chalk.green("🟢 Proyecto de bajo riesgo.") + " Sigue los checklists de Privacy Compliance Skills para mantener este nivel.\n");
    }

    if (result.assumptions.length > 0) {
      console.log(chalk.yellow.bold("📌 Supuestos del análisis:"));
      for (const a of result.assumptions) console.log(chalk.yellow(`   • ${a}`));
      console.log();
    }

    const feActive = result.fePenalizers.filter((p) => p.active);
    const beActive = result.bePenalizers.filter((p) => p.active);

    console.log(chalk.bold("Profundizar por pilar:"));
    if (feActive.length > 0) {
      console.log(chalk.dim("  → /frontend-privacy/consentimiento   auditoría de consentimiento y UI"));
      console.log(chalk.dim("  → /frontend-privacy/transparencia     política de privacidad y cookies"));
    }
    if (beActive.length > 0) {
      console.log(chalk.dim("  → /backend-security/data-protection   cifrado, retención y DPA"));
      console.log(chalk.dim("  → /backend-security/access-control    RBAC y audit logging"));
    }
    console.log(chalk.dim("  → /clasificar-datos <campo>           analizar un dato específico"));
    console.log(chalk.dim("  → /derechos-usuario --pais XX         implementar canal ARCO\n"));
    console.log(chalk.dim("⚠️  Este análisis es orientativo. No constituye asesoría jurídica. Ver DISCLAIMER.md\n"));
  }

  if (options.failOn !== undefined && result.finalScore >= options.failOn) {
    process.exit(1);
  }
}
