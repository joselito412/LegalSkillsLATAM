import type { AuditInput, PenalizerResult } from "./scorer.js";
import { transferDestinationsCovered } from "./rules.js";

/**
 * penalizer-catalog.ts — fuente única para los 9 penalizadores "clásicos"
 * (los que no vienen de un JSON de reglas rico, a diferencia del sub-panel
 * DevOps o us_multistate_exposure) más sus 4 variantes descompuestas por
 * pilar (minors_data_fe/be, no_arco_ui/no_arco_backend).
 *
 * Antes de este archivo, 7 de estos ids estaban definidos DOS VECES — una
 * en scorer.ts (lista combinada) y otra en frontend-scorer.ts o
 * backend-scorer.ts (lista de pilar) — y dos ya habían divergido en su
 * label. Es el mismo patrón que produjo el bug T1: dos sitios que pueden
 * divergir en silencio (ver MEMORY.md, "Fix T1: estrictitud ≠ F_rigor").
 * Ahora cada penalizador se define una sola vez aquí; scorer.ts,
 * frontend-scorer.ts y backend-scorer.ts solo *seleccionan* ids de este
 * catálogo (architecture/AGENT-CONTRACT-V1.1-DESIGN.md §D8).
 *
 * `minors_data` y `no_arco_procedure` NO son duplicados de sus variantes:
 * son el concepto combinado que SOLO usa la lista de scorer.ts. Sus 4
 * variantes descompuestas son las que usan los scorers de pilar — el
 * desglose es deliberado (el control de menores en la UI — flujo de
 * consentimiento parental — y en el backend — restricciones técnicas —
 * son remediaciones distintas con dueños distintos), así que ambos
 * conjuntos coexisten en el catálogo sin colapsarse entre sí (§D8).
 */

/**
 * Contexto explícito que necesitan los predicados de activación del
 * catálogo. `isStrict` SIEMPRE llega desde fuera (resolveStrictRegime() en
 * scorer.ts, vía el parámetro `isStrict` de getBackendPenalizers) — el
 * catálogo NUNCA lo recalcula ni lo deriva del valor numérico de F_rigor.
 * Hacerlo reintroduciría el bug T1 (ver MEMORY.md).
 */
export interface CatalogContext {
  input: AuditInput;
  isStrict: boolean;
}

export interface CatalogEntry {
  id: string;
  label: string;
  score: number;
  pillar: NonNullable<PenalizerResult["pillar"]>;
  /** Predicado de activación — puro, solo lee `ctx`. */
  active: (ctx: CatalogContext) => boolean;
}

export const PENALIZER_CATALOG: Record<string, CatalogEntry> = {
  // ─── 7 ids compartidos entre la lista combinada y los scorers de pilar ───
  no_granular_consent: {
    id: "no_granular_consent",
    label: "Sin consentimiento granular por finalidad",
    score: 15,
    pillar: "frontend",
    active: ({ input }) => !input.hasGranularConsent,
  },
  no_privacy_policy: {
    id: "no_privacy_policy",
    label: "Sin política de privacidad publicada",
    score: 10,
    pillar: "frontend",
    active: ({ input }) => !input.hasPrivacyPolicy,
  },
  non_adequate_servers: {
    id: "non_adequate_servers",
    label: "Servidores fuera de jurisdicción sin garantías",
    score: 20,
    pillar: "backend",
    active: ({ input }) => input.serverRegion !== "adequate",
  },
  unstructured_international_transfer: {
    id: "unstructured_international_transfer",
    // Label unificado hacia la versión más específica (vivía solo en
    // backend-scorer.ts; scorer.ts tenía "...sin cláusulas contractuales").
    label: "Transferencia a terceros sin DPA / cláusulas contractuales",
    score: 15,
    pillar: "backend",
    active: ({ input }) =>
      input.thirdPartyTransfers && !transferDestinationsCovered(input.countries, input.transferDestinations),
  },
  no_dpo: {
    id: "no_dpo",
    label: "Sin DPO/Encarregado designado (LGPD/GDPR)",
    score: 15,
    pillar: "backend",
    active: ({ input, isStrict }) => isStrict && input.hasDpo === false,
  },
  no_legal_basis: {
    id: "no_legal_basis",
    label: "Sin base legal documentada por finalidad",
    score: 20,
    pillar: "backend",
    active: ({ input, isStrict }) => isStrict && input.hasLegalBasisPerPurpose === false,
  },
  no_breach_plan: {
    id: "no_breach_plan",
    // Label unificado hacia la versión más específica (vivía solo en
    // backend-scorer.ts; scorer.ts tenía "...brechas de seguridad").
    label: "Sin plan de respuesta a brechas (LGPD/GDPR)",
    score: 15,
    pillar: "backend",
    active: ({ input, isStrict }) => isStrict && input.hasBreachResponsePlan === false,
  },

  // ─── 2 ids descompuestos: SOLO la lista combinada de scorer.ts los usa ───
  minors_data: {
    id: "minors_data",
    label: "Datos de menores de edad sin proceso verificado",
    score: 30,
    pillar: "both",
    active: ({ input }) => input.hasMinors,
  },
  no_arco_procedure: {
    id: "no_arco_procedure",
    label: "Sin canal ARCO/ARSOP documentado",
    score: 10,
    pillar: "both",
    active: ({ input }) => !input.hasArcoProcedure,
  },

  // ─── 4 variantes descompuestas: SOLO las listas de pilar las usan ───
  minors_data_fe: {
    id: "minors_data_fe",
    label: "Menores — sin flujo de consentimiento parental en UI",
    score: 15,
    pillar: "both",
    active: ({ input }) => input.hasMinors,
  },
  minors_data_be: {
    id: "minors_data_be",
    label: "Menores — sin restricciones técnicas en el sistema",
    score: 15,
    pillar: "both",
    active: ({ input }) => input.hasMinors,
  },
  no_arco_ui: {
    id: "no_arco_ui",
    label: "Sin canal ARCO visible para el usuario",
    score: 5,
    pillar: "both",
    active: ({ input }) => !input.hasArcoProcedure,
  },
  no_arco_backend: {
    id: "no_arco_backend",
    label: "Sin capacidad técnica de exportar/borrar datos de usuario",
    score: 5,
    pillar: "both",
    active: ({ input }) => !input.hasArcoProcedure,
  },
};

/** Resuelve un id del catálogo a un PenalizerResult evaluado contra `ctx`. */
export function resolveCatalogPenalizer(id: string, ctx: CatalogContext): PenalizerResult {
  const entry = PENALIZER_CATALOG[id];
  if (!entry) {
    throw new Error(`penalizer-catalog: id desconocido "${id}" — revisa el llamador.`);
  }
  return {
    id: entry.id,
    label: entry.label,
    score: entry.score,
    active: entry.active(ctx),
    pillar: entry.pillar,
  };
}

/** Resuelve una lista de ids del catálogo, preservando el orden pedido. */
export function resolveCatalogPenalizers(ids: string[], ctx: CatalogContext): PenalizerResult[] {
  return ids.map((id) => resolveCatalogPenalizer(id, ctx));
}
