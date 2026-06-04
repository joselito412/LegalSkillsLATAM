import chalk, { type ChalkInstance } from "chalk";
import type { ScoreResult } from "../engine/scorer.js";

export function scoreColor(score: number): ChalkInstance {
  if (score <= 30) return chalk.green;
  if (score <= 70) return chalk.yellow;
  return chalk.red;
}

export function penalizerColor(score: number): ChalkInstance {
  if (score >= 20) return chalk.red;
  if (score >= 10) return chalk.yellow;
  return chalk.green;
}

export function penalizerIcon(score: number): string {
  if (score >= 20) return "🔴";
  if (score >= 10) return "🟡";
  return "🟢";
}

export function levelColor(result: ScoreResult): ChalkInstance {
  return scoreColor(result.finalScore);
}
