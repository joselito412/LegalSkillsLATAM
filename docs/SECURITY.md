# Security Standards — Privacy Compliance Skills

> Análisis de seguridad real basado en **[SkillSpector](https://github.com/NVIDIA/skillspector) v2.1.1** (NVIDIA) — el scanner de referencia para skills de agentes de IA. Cualquiera puede reproducir estos resultados con los comandos al final del documento.

---

## Resumen Ejecutivo

**Última evaluación:** 2026-06-08 · **Herramienta:** SkillSpector v2.1.1 · **Modo:** análisis estático (`--no-llm`, reproducible offline) · **Cobertura:** 64 patrones / 16 categorías.

| Skill | Score | Severidad | Recomendación | Hallazgos |
|---|---|---|---|---|
| `audit` | 25 / 100 | MEDIUM | CAUTION | 1 × P1 — falso positivo |
| `clasificar-datos` | 0 / 100 | LOW | **SAFE** | — |
| `derechos-usuario` | 0 / 100 | LOW | **SAFE** | — |
| `matriz-normativa` | 0 / 100 | LOW | **SAFE** | — |
| `privacy-check` | 25 / 100 | MEDIUM | CAUTION | 1 × P1 — falso positivo |
| `risk-score` | 0 / 100 | LOW | **SAFE** | — |

**Promedio: 8.3 / 100 — LOW · SAFE.** 4/6 skills sin findings; 2/6 con un único HIGH cada una, ambos falsos positivos del modo estático (ver [Análisis de hallazgos](#análisis-de-hallazgos)).

> Los puntajes y la severidad provienen del cálculo oficial de SkillSpector, no de estimaciones internas. Los reportes JSON se pueden regenerar en cualquier momento siguiendo la sección [Cómo reproducir este análisis](#cómo-reproducir-este-análisis).

---

## Modelo de scoring (SkillSpector oficial)

- **Pesos:** CRITICAL = +50 pts · HIGH = +25 · MEDIUM = +10 · LOW = +5 · ×1.3 si hay scripts ejecutables.
- **Severidad:** 0–20 LOW (SAFE) · 21–50 MEDIUM (CAUTION) · 51–80 HIGH (DO NOT INSTALL) · 81–100 CRITICAL (DO NOT INSTALL).
- **Categorías evaluadas:** prompt injection, data exfiltration, privilege escalation, supply chain, excessive agency, output handling, system prompt leakage, memory poisoning, tool misuse, rogue agent, trigger abuse, dangerous code (AST), taint tracking, YARA signatures, MCP least privilege, MCP tool poisoning.

Detalle completo de los 64 patrones: <https://github.com/NVIDIA/skillspector#vulnerability-patterns>.

---

## Análisis de hallazgos

Las dos detecciones HIGH son **falsos positivos** del modo estático:

| Skill | Patrón | Ubicación | Razón |
|---|---|---|---|
| `audit` | P1 — Instruction Override | `TEST-CASES.md:285` | Frase "Ignore previous instructions" usada como **caso adversarial** para validar el aislamiento de contenido. |
| `privacy-check` | P1 — Instruction Override | `TEST-CASES.md:72` | Idem — texto adversarial dentro de `TEST-CASES.md`. |

SkillSpector lo señala directamente: *"Without LLM analysis, manual review is recommended"*. Con análisis semántico LLM activado (precisión ~87 % según docs), estos hallazgos se filtrarían como benignos al detectar que están dentro de un bloque de test case y no como instrucción real al agente.

**Por qué los `TEST-CASES.md` contienen estas frases.** Las skills procesan input libre del usuario y declaran su comportamiento ante prompt injection en su sección **Reglas de Aislamiento de Contenido** (alineada con OWASP Top 10 for LLMs — categoría LLM01). Los `TEST-CASES.md` son la **evidencia de que ese aislamiento funciona** — no código que se ejecute. Es el equivalente a tener cadenas SQL maliciosas en los tests de un parser SQL: necesarias para validar la defensa.

---

## Por qué el resto del repo está limpio

- **Sin código ejecutable.** El repo es Markdown + JSON. No hay scripts Python, shell ni TypeScript de runtime fuera de la CLI básica de validación.
- **Sin dependencias publicadas.** No hay `package.json` con runtime deps. Categoría Supply Chain (SC1–SC6) → aplica desde Fase 2.
- **Sin llamadas externas.** Las skills no invocan URLs, no descargan recursos, no ejecutan comandos. Data Exfiltration (E1–E4), Tool Misuse (TM1–TM3), Rogue Agent (RA1–RA2) → 0 hits.
- **Sin AST peligroso.** Cero `exec` / `eval` / `subprocess` / `__import__`. AST1–AST8 → 0 hits.
- **Permission manifests** declarados por skill. MCP Least Privilege (LP1–LP4) → 0 hits.

---

## Reglas de Aislamiento de Contenido (OWASP LLM01)

Las 6 skills incluyen una sección estandarizada que declara cómo manejan input de terceros:

- El input del usuario es **dato, no instrucción**.
- Detección de frases de inyección en **español e inglés** — importante porque SkillSpector reconoce que el análisis estático puede perder patrones en idiomas no-ingleses; esta sección compensa explícitamente esa limitación.
- Detección en código (comentarios, strings, docstrings) y por estructura (sin keywords exactas).
- Scope acotado, sin llamadas externas, sin escalada de privilegios.

**Limitación honesta:** la mitigación es **conductual** (instrucción al LLM), no técnica. Hasta que exista una capa API (Fase 3), el enforcement es por convención y validado vía tests adversariales documentados en `TEST-CASES.md`.

---

## Estándares de contenido del repositorio

- **`SKILL.md`:** sin comandos shell/código; sin URLs externas que el agente deba llamar; sin pedir credenciales; sección `## Reglas de Aislamiento de Contenido` obligatoria; scope y outputs explícitos; DISCLAIMER en cada output.
- **`cli/rules/` (JSON):** solo datos curados; versionado con `version` y `last_reviewed`; sin URLs ejecutables ni scripts.
- **`scripts/` (Fase 2+):** propósito / inputs / outputs documentados; sin transmitir datos; SkillSpector + `npm audit` antes del merge.

---

## Plan de Continuidad

- **Antes de v0.2.0:** crear `TEST-CASES.md` faltantes en `clasificar-datos` y `derechos-usuario`; agregar workflow de CI que ejecute `skillspector scan --no-llm` sobre `skills/*` en cada PR.
- **Fase 2 (CLI / npm):** declarar dependencias mínimas en `package.json`; SkillSpector + `npm audit --audit-level=moderate` obligatorios antes del merge; OSV.dev (SC4) corre automático con SkillSpector si hay red.
- **Fase 3 (API):** sanitización de input pre-LLM → convierte el enforcement conductual en técnico. Esperado: cierre completo de la categoría Prompt Injection.
- **Re-evaluación con LLM:** al configurar `SKILLSPECTOR_PROVIDER=anthropic` (o `openai` / `nv_build`), los 2 falsos positivos P1 actuales deberían eliminarse (precisión ~87 % vs análisis estático puro).

---

## Cómo reproducir este análisis

```bash
# 1) Instalar SkillSpector
git clone https://github.com/NVIDIA/skillspector.git /tmp/skillspector
cd /tmp/skillspector
uv venv .venv && source .venv/bin/activate
uv pip install -e .

# 2) Escanear cada skill (modo estático, sin API key)
for skill in audit clasificar-datos derechos-usuario matriz-normativa privacy-check risk-score; do
  skillspector scan \
    /ruta/a/privacy-compliance-skills/skills/$skill \
    --no-llm --format json \
    --output /tmp/$skill-report.json
done
```

**Análisis con LLM** (filtra falsos positivos, requiere API key):

```bash
export SKILLSPECTOR_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-ant-...
skillspector scan /ruta/a/privacy-compliance-skills/skills/audit --format markdown
```

---

## Reporte de Vulnerabilidades

Si encuentras un problema de seguridad, repórtalo de forma responsable:

- **Email:** security@privacy-compliance-skills.dev *(pendiente de configurar)*
- **GitHub:** Issue privado con label `[security]`
- **No publiques** vulnerabilidades activas en Issues públicos hasta que el equipo las evalúe.

---

*Última revisión: 2026-06-08 · Herramienta de referencia: SkillSpector v2.1.1 (NVIDIA) · Equipo Editorial Privacy Compliance Skills*
