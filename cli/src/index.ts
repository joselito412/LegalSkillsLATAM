#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "node:module";
import { runAuditWizard } from "./commands/audit.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const program = new Command();

program
  .name("privacy-compliance-skills")
  .description("Legal risk auditor for EU, US and LATAM compliance")
  .version(version);

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
