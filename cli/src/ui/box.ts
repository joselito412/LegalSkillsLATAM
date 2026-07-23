import chalk from "chalk";
import type { ScoreResult, DualScoreResult } from "../engine/scorer.js";
import { scoreColor, penalizerIcon, penalizerColor, levelColor } from "./colors.js";
import { progressBar } from "./progress.js";
import { categoryLabel } from "../engine/classifier.js";
import { getCountryName } from "../engine/rules.js";
import { renderFrontendPanel } from "./frontend-report.js";
import { renderBackendPanel } from "./backend-report.js";

const W = 56; // box inner width

function pad(text: string, width: number): string {
  const visible = text.replace(/\x1b\[[0-9;]*m/g, ""); // strip ANSI
  const spaces = Math.max(0, width - visible.length);
  return text + " ".repeat(spaces);
}

function row(content: string): string {
  return "║  " + pad(content, W - 2) + "║";
}

function divider(): string {
  return "╠" + "═".repeat(W) + "╣";
}

export function renderScoreBox(result: ScoreResult): string {
  const color = scoreColor(result.finalScore);
  const lColor = levelColor(result);

  const activePenalizers = result.penalizers.filter((p) => p.active);
  const countryList = result.countries.map(getCountryName).join(", ");
  const rigorLabel = result.isStrictRegime ? "× 1.25 (régimen estricto)" : "× 1.00 (régimen estándar)";
  const bar = progressBar(result.finalScore);

  const lines: string[] = [];

  lines.push("╔" + "═".repeat(W) + "╗");
  lines.push(row(chalk.bold("🔍 Privacy Compliance Skills — Legal Risk Audit")));
  lines.push(divider());
  lines.push(row(`Proyecto : ${result.projectName}`));
  lines.push(row(`País(es) : ${countryList}`));
  lines.push(row(`Dato más sensible: ${categoryLabel(result.dataCategory)}`));
  lines.push(divider());
  lines.push(row(""));
  lines.push(row(chalk.bold(color(`           ${result.finalScore} / 100`))));
  lines.push(row(""));
  lines.push(row(`              ${result.emoji}`));
  lines.push(row(lColor.bold(`         ${result.levelLabel}`)));
  lines.push(row(""));
  lines.push(row(`  ${bar}  ${result.finalScore}%`));
  lines.push(row(""));
  lines.push(divider());
  lines.push(row(chalk.bold("DESGLOSE")));
  lines.push(row(`  📦 Base (${categoryLabel(result.dataCategory)})${" ".repeat(Math.max(1, 30 - categoryLabel(result.dataCategory).length))}${result.cBase} pts`));

  for (const p of activePenalizers) {
    const icon = penalizerIcon(p.score);
    const pColor = penalizerColor(p.score);
    const label = p.label.length > 34 ? p.label.slice(0, 31) + "..." : p.label;
    const spaces = Math.max(1, 36 - label.length);
    lines.push(row(`  ${icon} ${pColor(label)}${" ".repeat(spaces)}+${p.score} pts`));
  }

  lines.push(row(`  ${rigorLabel}`));
  lines.push(row("  " + "─".repeat(W - 6)));
  lines.push(row(chalk.bold(`  Total${" ".repeat(28)}${result.finalScore} pts`)));
  lines.push(divider());

  if (activePenalizers.length > 0) {
    lines.push(row(chalk.bold("ACCIONES PRIORITARIAS")));
    const top = activePenalizers
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    top.forEach((p, i) => {
      const label = p.label.length > 50 ? p.label.slice(0, 47) + "..." : p.label;
      lines.push(row(`  ${i + 1}. Corregir: ${label}`));
    });
  }

  lines.push("╚" + "═".repeat(W) + "╝");

  return lines.join("\n");
}

/**
 * Renders the dual-pillar audit box with separate FE and BE panels.
 */
export function renderDualScoreBox(result: DualScoreResult): string {
  const color = scoreColor(result.finalScore);
  const lColor = levelColor(result);
  const countryList = result.countries.map(getCountryName).join(", ");
  const rigorLabel = result.isStrictRegime ? "× 1.25 (régimen estricto)" : "× 1.00 (régimen estándar)";
  const bar = progressBar(result.finalScore);

  const lines: string[] = [];

  lines.push("╔" + "═".repeat(W) + "╗");
  lines.push(row(chalk.bold("🔍 Privacy Compliance Skills — Auditoría Dual FE/BE")));
  lines.push(divider());
  lines.push(row(`Proyecto : ${result.projectName}`));
  lines.push(row(`País(es) : ${countryList}`));
  lines.push(row(`Dato más sensible: ${categoryLabel(result.dataCategory)}`));
  lines.push(divider());
  lines.push(row(""));

  // FE panel
  for (const line of renderFrontendPanel(result.fePenalizers)) {
    lines.push(row(line));
  }

  lines.push(row(""));

  // BE panel
  for (const line of renderBackendPanel(result.bePenalizers, result.cBase, result.dataCategory)) {
    lines.push(row(line));
  }

  lines.push(row(""));
  lines.push(row(`  ${rigorLabel}`));
  lines.push(row("  " + "─".repeat(W - 6)));
  lines.push(row(""));
  lines.push(row(chalk.bold(color(`           ${result.finalScore} / 100`))));
  lines.push(row(""));
  lines.push(row(`              ${result.emoji}`));
  lines.push(row(lColor.bold(`         ${result.levelLabel}`)));
  lines.push(row(""));
  lines.push(row(`  ${bar}  ${result.finalScore}%`));
  lines.push(row(""));
  lines.push(divider());

  const feActive = result.fePenalizers.filter((p) => p.active);
  const beActive = result.bePenalizers.filter((p) => p.active);
  const topFe = feActive.sort((a, b) => b.score - a.score)[0];
  const topBe = beActive.sort((a, b) => b.score - a.score)[0];

  lines.push(row(chalk.bold("ACCIONES PRIORITARIAS")));
  if (topFe) {
    const label = topFe.label.length > 42 ? topFe.label.slice(0, 39) + "..." : topFe.label;
    lines.push(row(`  🖥️  FE → ${label}`));
  } else {
    lines.push(row(`  🖥️  FE → ✅ Sin acciones FE pendientes`));
  }
  if (topBe) {
    const label = topBe.label.length > 42 ? topBe.label.slice(0, 39) + "..." : topBe.label;
    lines.push(row(`  ⚙️  BE → ${label}`));
  } else {
    lines.push(row(`  ⚙️  BE → ✅ Sin acciones BE pendientes`));
  }

  lines.push("╚" + "═".repeat(W) + "╝");

  return lines.join("\n");
}
