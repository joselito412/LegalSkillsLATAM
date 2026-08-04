import type { AuditInput, PenalizerResult } from "./scorer.js";
import { transferDestinationsCovered, loadFormula } from "./rules.js";

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
 *
 * CONTRATO-01 (paso 3, D4 pista código): score-formula.json.penalizers
 * declara `legal_refs` para 6 de estos ids. El catálogo hereda esas refs
 * por passthrough fiel (nunca las inventa) — ver formulaPenalizer() más
 * abajo. Los 3 penalizadores de régimen estricto (no_dpo, no_legal_basis,
 * no_breach_plan) no existen en NINGÚN JSON de reglas, así que su
 * `legalRefs` queda `undefined`: es un vacío editorial trackeado
 * (backlog AUD-*), no un valor fabricado por el motor (§D4).
 */

/** Un penalizador tal como lo declara score-formula.json.penalizers. */
interface FormulaPenalizer {
  id: string;
  label: string;
  score: number;
  legal_refs: string[];
}

let _formulaPenalizersById: Map<string, FormulaPenalizer> | null = null;

function formulaPenalizersById(): Map<string, FormulaPenalizer> {
  if (_formulaPenalizersById) return _formulaPenalizersById;
  _formulaPenalizersById = new Map(loadFormula().penalizers.map((p) => [p.id, p as FormulaPenalizer]));
  return _formulaPenalizersById;
}

/**
 * Busca un penalizador por id en score-formula.json.penalizers. Lanza si no
 * existe — todo llamador de esta función pasa un id que SÍ está declarado en
 * el JSON (los 6 clásicos con legal_refs); si algún día score-formula.json
 * deja de declararlo, es integridad de reglas comprometida, no un caso a
 * degradar en silencio (mismo principio fail-loud que loadDevopsPenalizers()
 * y buildUsMultistatePenalizer() en rules.ts/us-scorer.ts).
 */
function formulaPenalizer(id: string): FormulaPenalizer {
  const found = formulaPenalizersById().get(id);
  if (!found) {
    throw new Error(
      `penalizer-catalog: score-formula.json no declara el penalizador "${id}" (se esperaba, ver architecture/AGENT-CONTRACT-V1.1-DESIGN.md §D4).`
    );
  }
  return found;
}

/**
 * Mapeo EXPLÍCITO (no una coincidencia de nombres) de los 4 ids descompuestos
 * hacia el concepto padre del que heredan `legal_refs` en CONTRATO-01 paso 3:
 * el desglose por pilar (D8) no tiene su propia entrada en score-formula.json,
 * así que toma la base normativa del concepto combinado que sí la declara.
 */
const DECOMPOSED_LEGAL_REFS_PARENT: Record<string, string> = {
  minors_data_fe: "minors_data",
  minors_data_be: "minors_data",
  no_arco_ui: "no_arco_procedure",
  no_arco_backend: "no_arco_procedure",
};

function inheritedLegalRefs(decomposedId: string): string[] {
  return formulaPenalizer(DECOMPOSED_LEGAL_REFS_PARENT[decomposedId]).legal_refs;
}

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
  /** Passthrough fiel desde score-formula.json.penalizers (§D4). `undefined`
   *  cuando el penalizador no está declarado en ningún JSON — nunca inventado. */
  legalRefs?: string[];
}

export const PENALIZER_CATALOG: Record<string, CatalogEntry> = {
  // ─── 7 ids compartidos entre la lista combinada y los scorers de pilar ───
  no_granular_consent: {
    id: "no_granular_consent",
    // score-formula.json declara este id con score 15 (coincide) pero label
    // "Falta de consentimiento inequívoco y granular" (diverge del código) —
    // se mantiene el label del código, reportado como discrepancia editorial.
    label: "Sin consentimiento granular por finalidad",
    score: 15,
    pillar: "frontend",
    active: ({ input }) => !input.hasGranularConsent,
    legalRefs: formulaPenalizer("no_granular_consent").legal_refs,
  },
  no_privacy_policy: {
    id: "no_privacy_policy",
    // score-formula.json declara score 10 y label idénticos al código →
    // se leen del JSON (CONTRATO-01 paso 3: "si coinciden todos, léelos").
    label: formulaPenalizer("no_privacy_policy").label,
    score: formulaPenalizer("no_privacy_policy").score,
    pillar: "frontend",
    active: ({ input }) => !input.hasPrivacyPolicy,
    legalRefs: formulaPenalizer("no_privacy_policy").legal_refs,
  },
  non_adequate_servers: {
    id: "non_adequate_servers",
    // score coincide (20); label del JSON ("...jurisdicción adecuada")
    // diverge del código — se mantiene el del código, reportado.
    label: "Servidores fuera de jurisdicción sin garantías",
    score: 20,
    pillar: "backend",
    active: ({ input }) => input.serverRegion !== "adequate",
    legalRefs: formulaPenalizer("non_adequate_servers").legal_refs,
  },
  unstructured_international_transfer: {
    id: "unstructured_international_transfer",
    // Label unificado en el paso 2 hacia la versión más específica (vivía
    // solo en backend-scorer.ts). score coincide con el JSON (15); el label
    // del JSON ("...no estructurada") diverge — se mantiene el del código.
    label: "Transferencia a terceros sin DPA / cláusulas contractuales",
    score: 15,
    pillar: "backend",
    active: ({ input }) =>
      input.thirdPartyTransfers && !transferDestinationsCovered(input.countries, input.transferDestinations),
    legalRefs: formulaPenalizer("unstructured_international_transfer").legal_refs,
  },
  no_dpo: {
    id: "no_dpo",
    label: "Sin DPO/Encarregado designado (LGPD/GDPR)",
    score: 15,
    pillar: "backend",
    active: ({ input, isStrict }) => isStrict && input.hasDpo === false,
    // No existe en ningún JSON de reglas → legalRefs queda undefined, nunca
    // inventado (§D4, backlog editorial AUD-*).
  },
  no_legal_basis: {
    id: "no_legal_basis",
    label: "Sin base legal documentada por finalidad",
    score: 20,
    pillar: "backend",
    active: ({ input, isStrict }) => isStrict && input.hasLegalBasisPerPurpose === false,
    // No existe en ningún JSON de reglas → legalRefs queda undefined (§D4).
  },
  no_breach_plan: {
    id: "no_breach_plan",
    // Label unificado en el paso 2 hacia la versión más específica.
    label: "Sin plan de respuesta a brechas (LGPD/GDPR)",
    score: 15,
    pillar: "backend",
    active: ({ input, isStrict }) => isStrict && input.hasBreachResponsePlan === false,
    // No existe en ningún JSON de reglas → legalRefs queda undefined (§D4).
  },

  // ─── 2 ids descompuestos: SOLO la lista combinada de scorer.ts los usa ───
  minors_data: {
    id: "minors_data",
    // score coincide (30); label del JSON ("Tratamiento de datos...")
    // diverge del código — se mantiene el del código, reportado.
    label: "Datos de menores de edad sin proceso verificado",
    score: 30,
    pillar: "both",
    active: ({ input }) => input.hasMinors,
    legalRefs: formulaPenalizer("minors_data").legal_refs,
  },
  no_arco_procedure: {
    id: "no_arco_procedure",
    // score coincide (10); label del JSON ("Sin procedimiento documentado...")
    // diverge del código — se mantiene el del código, reportado.
    label: "Sin canal ARCO/ARSOP documentado",
    score: 10,
    pillar: "both",
    active: ({ input }) => !input.hasArcoProcedure,
    legalRefs: formulaPenalizer("no_arco_procedure").legal_refs,
  },

  // ─── 4 variantes descompuestas: SOLO las listas de pilar las usan ───
  // legalRefs heredado del concepto padre vía DECOMPOSED_LEGAL_REFS_PARENT.
  minors_data_fe: {
    id: "minors_data_fe",
    label: "Menores — sin flujo de consentimiento parental en UI",
    score: 15,
    pillar: "both",
    active: ({ input }) => input.hasMinors,
    legalRefs: inheritedLegalRefs("minors_data_fe"),
  },
  minors_data_be: {
    id: "minors_data_be",
    label: "Menores — sin restricciones técnicas en el sistema",
    score: 15,
    pillar: "both",
    active: ({ input }) => input.hasMinors,
    legalRefs: inheritedLegalRefs("minors_data_be"),
  },
  no_arco_ui: {
    id: "no_arco_ui",
    label: "Sin canal ARCO visible para el usuario",
    score: 5,
    pillar: "both",
    active: ({ input }) => !input.hasArcoProcedure,
    legalRefs: inheritedLegalRefs("no_arco_ui"),
  },
  no_arco_backend: {
    id: "no_arco_backend",
    label: "Sin capacidad técnica de exportar/borrar datos de usuario",
    score: 5,
    pillar: "both",
    active: ({ input }) => !input.hasArcoProcedure,
    legalRefs: inheritedLegalRefs("no_arco_backend"),
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
    // O6 (verificación adversarial): `entry.legalRefs` es la MISMA referencia
    // que loadFormula().penalizers[i].legal_refs (la caché de reglas del
    // proceso) — para los 4 ids descompuestos es además la misma referencia
    // que su concepto padre (DECOMPOSED_LEGAL_REFS_PARENT). Se copia aquí
    // (no antes) porque este es el único punto donde el catálogo entrega el
    // array a un consumidor externo: un `push` de cualquier llamador sobre
    // el array devuelto contaminaría la caché — y por tanto TODAS las
    // auditorías siguientes del proceso — con una referencia legal fabricada
    // que el repo prohíbe fabricar (§D4).
    legalRefs: entry.legalRefs ? [...entry.legalRefs] : undefined,
  };
}

/** Resuelve una lista de ids del catálogo, preservando el orden pedido. */
export function resolveCatalogPenalizers(ids: string[], ctx: CatalogContext): PenalizerResult[] {
  return ids.map((id) => resolveCatalogPenalizer(id, ctx));
}
