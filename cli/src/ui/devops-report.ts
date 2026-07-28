import chalk from "chalk";
import type { PenalizerResult } from "../engine/scorer.js";
import { penalizerIcon, penalizerColor } from "./colors.js";
import { loadDevopsPenalizers } from "../engine/rules.js";

const W = 52;

function pad(text: string, width: number): string {
  const visible = text.replace(/\x1b\[[0-9;]*m/g, "");
  const spaces = Math.max(0, width - visible.length);
  return text + " ".repeat(spaces);
}

function panelRow(content: string): string {
  return "  │  " + pad(content, W - 4) + "│";
}

/**
 * Renders the DevOps panel section inside the dual audit box (MOTOR-06,
 * ADR-001). Returns an array of lines (no outer box — caller assembles the
 * full box). El cap del subtotal (30 en el texto) sale del JSON
 * (devops-penalizers.json → scoring_rules.max_total), nunca hardcodeado.
 */
export function renderDevopsPanel(penalizers: PenalizerResult[], subtotal: number): string[] {
  const active = penalizers.filter((p) => p.active);
  const maxTotal = loadDevopsPenalizers().scoring_rules.max_total;
  const lines: string[] = [];

  lines.push("  ┌─ ⚙️  DEVOPS — Entornos/Pipeline/Operación " + "─".repeat(Math.max(0, W - 44)) + "┐");

  if (active.length === 0) {
    lines.push(panelRow(chalk.green("✅ Sin hallazgos DevOps detectados")));
  } else {
    const top = active.sort((a, b) => b.score - a.score).slice(0, 3);
    const rest = active.slice(3);

    for (const p of top) {
      const icon = penalizerIcon(p.score);
      const pColor = penalizerColor(p.score);
      const label = p.label.length > 34 ? p.label.slice(0, 31) + "..." : p.label;
      const spaces = Math.max(1, 36 - label.length);
      lines.push(panelRow(`${icon} ${pColor(label)}${" ".repeat(spaces)}+${p.score} pts`));
    }

    if (rest.length > 0) {
      const restSum = rest.reduce((s, p) => s + p.score, 0);
      lines.push(panelRow(chalk.green(`🟢 Otros (${rest.length} más)${" ".repeat(14)}+${restSum} pts`)));
    }
  }

  lines.push(panelRow(chalk.bold(`Subtotal DevOps (cap ${maxTotal})${" ".repeat(Math.max(1, 15 - String(maxTotal).length))}+${subtotal} pts`)));
  lines.push("  └" + "─".repeat(W) + "┘");
  return lines;
}
