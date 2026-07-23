#!/usr/bin/env node

import { Command } from "commander";
import { runAuditWizard } from "./commands/audit.js";

const program = new Command();

program
  .name("privacy-compliance-skills")
  .description("Legal risk auditor for LATAM developers")
  .version("0.2.0-beta.1");

program
  .command("audit")
  .description("Run a legal risk audit (interactive wizard or config file)")
  .option("--config", "Read from legalskills.config.json instead of interactive wizard")
  .option("--json", "Output results as JSON (useful for CI/CD pipelines)")
  .option("--fail-on <score>", "Exit with code 1 if score >= this value (for CI/CD)", parseInt)
  .action(async (options) => {
    await runAuditWizard({
      config: options.config,
      json: options.json,
      failOn: options.failOn,
    });
  });

program.parse();
