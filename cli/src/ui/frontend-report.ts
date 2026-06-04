import chalk from "chalk";
import type { PenalizerResult } from "../engine/scorer.js";
import { penalizerIcon, penalizerColor } from "./colors.js";

const W = 52; // inner width of the sub-panel

function pad(text: string, width: number): string {
  const visible = text.replace(/\x1b\[[0-9;]*m/g, "");
  const spaces = Math.max(0, width - visible.length);
  return text + " ".repeat(spaces);
}

function panelRow(content: string): string {
  return "  │  " + pad(content, W - 4) + "│";
}

/**
 * Renders the Frontend panel section inside the dual audit box.
 * Returns an array of lines (no outer box — caller assembles the full box).
 */
export function renderFrontendPanel(penalizers: PenalizerResult[]): string[] {
  const active = penalizers.filter((p) => p.active);
  const lines: string[] = [];

  lines.push("  ┌─ 🖥️  FRONTEND — UX / Consentimiento " + "─".repeat(Math.max(0, W - 38)) + "┐");

  if (active.length === 0) {
    lines.push(panelRow(chalk.green("✅ Sin hallazgos de UI/consentimiento detectados")));
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

  lines.push("  └" + "─".repeat(W) + "┘");
  return lines;
}
