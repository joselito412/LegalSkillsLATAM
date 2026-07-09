# AGENT-CONTRACT — Contrato de datos CLI ↔ LLM
**LegalSkillsLATAM — Especificación v1.0 (schema_version: "1.0")**

> Elaborado: 2026-07-08
> Estado: 📐 Especificación aprobada editorialmente — pendiente de implementación en la CLI (sesión de código, Fase 2.1-2.2 del `PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md`)

## Principio rector

**La CLI es la única implementación de la fórmula del Legal Risk Score.** El agente LLM (skill `/audit`) nunca recalcula el score a mano cuando la CLI está disponible: la invoca, interpreta sus findings, corrige y re-invoca. El fallback manual del `SKILL.md` existe solo para entornos sin Node.js, y su resultado se etiqueta siempre como "score estimado, no verificado".

## Flujo del loop (estilo react-doctor)

```
┌──────────┐    JSON contract     ┌──────────┐
│   CLI    │ ───────────────────► │   LLM    │
│ (score)  │                      │ (agente) │
│          │ ◄─────────────────── │          │
└──────────┘   corrige config /   └──────────┘
               código y re-invoca
```

1. LLM ejecuta `npx legalskills-latam audit --config --json`
2. CLI responde con el contrato (abajo)
3. LLM agrupa findings por `topic`, corrige el de mayor impacto (usando `fix_hint`), actualiza `legalskills.config.json`
4. LLM re-ejecuta con `--baseline` y compara el delta
5. Repite hasta cumplir el criterio de parada (ver `skills/audit/SKILL.md`, estado S5)

## Contrato JSON (output de `audit --json` y `doctor`)

```json
{
  "schema_version": "1.0",
  "generated_at": "2026-07-08T12:00:00Z",
  "project_name": "MiApp",
  "countries": ["CO", "BR"],
  "strictest_law": "LGPD (BR)",
  "rigor_factor": 1.25,
  "data_category": "sensitive",
  "final_score": 62,
  "level": "medium",
  "levels": { "low": [0, 30], "medium": [31, 70], "high": [71, 100] },
  "pillars": { "fe": 25, "be": 37, "devops_sub": 15 },
  "findings": [
    {
      "id": "FE-CONSENT-01",
      "penalizer_id": "fe_no_granular_consent",
      "pillar": "FE",
      "topic": "consentimiento",
      "points": 15,
      "severity": "high",
      "title": "Sin consentimiento granular por finalidad",
      "legal_refs": ["Ley 1581/2012 Art. 9 (CO)", "LGPD Art. 8 §4 (BR)"],
      "standards_refs": ["ISO 27701 §7.2.3"],
      "fix_hint": "Reemplazar el checkbox único por toggles independientes por finalidad; registrar timestamp y versión del texto aceptado.",
      "config_key": "has_granular_consent",
      "evidence_needed": "Captura del formulario de registro con toggles separados + registro de consentimiento en base de datos"
    }
  ],
  "assumptions": [
    "Se asumió que los servidores están fuera de LATAM/EU porque no se especificó región."
  ],
  "escalation_required": false,
  "escalation_reason": null
}
```

### Semántica de los campos clave

| Campo | Regla |
|---|---|
| `schema_version` | Semver del contrato. El LLM debe rechazar versiones mayores que no conoce y avisar al usuario. |
| `findings[].topic` | Uno de: `consentimiento`, `transparencia`, `clasificacion`, `cifrado`, `acceso`, `retencion`, `transferencias`, `derechos`, `devops`. El loop procesa **un topic por iteración**. |
| `findings[].legal_refs` | Provienen SIEMPRE de los JSON de reglas (`cli/rules/`). El LLM cita exclusivamente estas referencias — nunca artículos de memoria. |
| `findings[].fix_hint` | Acción concreta y verificable. Una sola acción por finding. |
| `findings[].config_key` | La llave de `legalskills.config.json` que, al corregirse, desactiva el finding. Es el mecanismo de verificación del loop. |
| `assumptions` | Todo lo inferido y no declarado por el usuario. El LLM debe mostrarlos y ofrecer corregirlos. |
| `escalation_required` | `true` si score ≥ 71, o si hay datos sensibles + menores. **Corta el loop**: el agente detiene la auto-corrección y dirige a auditoría legal humana. |

## Comando `doctor` (a implementar en Fase 2.2)

```bash
lls doctor                      # loop no interactivo: lee config, emite findings por topic
lls doctor --topic consentimiento   # evalúa un solo topic
lls doctor --baseline           # compara contra .legalskills/last-audit.json y reporta delta
lls doctor --json               # output = este contrato
```

Cada corrida escribe `.legalskills/last-audit.json` (añadir a `.gitignore` la carpeta o versionarla — decisión del equipo del proyecto usuario).

### Exit codes

| Código | Significado |
|---|---|
| `0` | Score bajo el umbral (`--fail-on`, default 71) |
| `1` | Score en o sobre el umbral |
| `2` | Configuración inválida o `legalskills.config.json` ausente |

## Nuevas llaves de `legalskills.config.json` (sub-pilar DevOps)

```json
{
  "has_staging_env": false,
  "uses_prod_data_outside_prod": false,
  "has_secrets_manager": false,
  "logs_contain_pii": false,
  "has_dependency_scanning": false,
  "has_tested_backups": false,
  "has_ci_risk_gate": false
}
```

Fuente de los penalizadores: `cli/rules/risk-engine/devops-penalizers.json` (nota: las llaves con `inverted: true` penalizan cuando son `true`).

## Reglas de compatibilidad

1. El output `--json` actual (v0.2) sigue siendo válido: los campos nuevos son aditivos. `final_score` y la escala 0-100 no cambian.
2. Cambios incompatibles → bump mayor de `schema_version` + nota en `docs/ROADMAP.md`.
3. Golden tests (Fase 2.4) congelan el contrato: mismo input ⇒ mismo JSON.

---

*LegalSkillsLATAM — [DISCLAIMER.md](../DISCLAIMER.md)*
