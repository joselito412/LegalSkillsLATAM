# CLAUDE.md — Instrucciones de trabajo para Claude en este repositorio

> Privacy Compliance Skills — UE · USA · LATAM. Contexto vivo del milestone en `.planning/PROJECT.md`;
> tickets en `.planning/REQUIREMENTS.md`; fases en `.planning/ROADMAP.md`.

## 📋 Política de Optimización de Tokens de LLM

Asignación de modelos por rol — **obligatoria** para toda sesión y todo subagente que trabaje en este repo:

| Modelo | Rol | Alcance |
|---|---|---|
| **Fable 5** | El Arquitecto | Sesión general y problemas centrales |
| **Opus** | El Project Manager | Planear y completar planes; validar resultados |
| **Sonnet** | El Ejecutor | Edición, ejecución y validación de código y tests |

### Cómo usarla en el día a día

- **Paso 1 (Fable 5 — El Arquitecto):** abrir la sesión con Fable 5 únicamente para definir la arquitectura, plantear el enfoque del negocio y resolver los bloqueos lógicos más complejos. **No pedirle código largo**; usarlo solo para decisiones críticas de alto nivel.
- **Paso 2 (Opus — El Project Manager):** desde la sesión Fable, ejecutar agentes **Opus** para completar los planes y validar los resultados de cada fase.
- **Paso 3 (Sonnet — El Ejecutor):** llevar las tareas del roadmap a agentes **Sonnet** para que escriban las funciones, editen el código existente, ejecuten y diseñen la batería de pruebas (tests).

### Aplicación operativa (Agent tool / workflows / GSD)

- La **sesión principal** (Fable 5) orquesta, decide y desbloquea; delega el resto pasando `model` explícito al spawnear agentes.
- `model: "opus"` → agentes de planeación y validación de resultados: `gsd-planner`, `gsd-roadmapper`, `gsd-plan-checker`, `gsd-verifier`, jueces/sintetizadores de research, revisión final de fase.
- `model: "sonnet"` → agentes que tocan código: `gsd-executor`, `gsd-debugger`, escritura/edición de funciones, corrida de builds y tests, diseño de fixtures y baterías de pruebas, mappers de codebase.
- **GSD:** `.planning/config.json` fija `model_profile: "balanced"`. Ojo: los agentes tier-opus de GSD resuelven a `inherit` (modelo de la sesión); cuando esta política pida Opus, pasar `model: "opus"` explícito en el spawn.
- **Workflows (multi-agente):** usar `opts.model` por etapa — `opus` en etapas de planeación/juicio/verificación de resultados, `sonnet` en etapas mecánicas de código y tests. Omitir `model` (= heredar Fable) solo en la etapa que resuelve el problema central de la corrida.
- **Escalamiento:** si un agente Sonnet se atasca en un bloqueo lógico central, el bloqueo sube a la sesión Fable 5 — no se sube el tier del agente en silencio.

## Restricciones permanentes del proyecto

- La CLI (`cli/src/engine`) es la **única implementación** de la fórmula del Legal Risk Score; skills y docs solo interpretan (fallback etiquetado "estimado, no verificado").
- No tocar la **sustancia** legal de `cli/rules/**/*.json` (solo estructura cuando un ticket lo pida); no modificar `docs/SOURCES-VALIDATION.md` ni `docs/NORMAS-CITADAS.md`; `review_status` solo lo promueve un revisor humano.
- Docs en español; disclaimers intactos; el LLM cita únicamente `legal_refs` provenientes de los JSON de reglas.
- Commits atómicos por fase con build + tests verdes; flujo por PR hacia `main`.
