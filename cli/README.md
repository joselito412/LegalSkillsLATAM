# privacy-compliance-skills CLI

Herramienta de línea de comandos para calcular el **Legal Risk Score** de proyectos de software que operan en LATAM.

## Instalación

```bash
npm install -D privacy-compliance-skills
# o ejecutar sin instalar:
npx privacy-compliance-skills audit
```

**Requiere Node.js 18+.**

## Uso

### Wizard interactivo

```bash
npx privacy-compliance-skills audit
```

Responde 5–8 preguntas y obtén tu score con desglose de penalizadores.

### Desde archivo de configuración

```bash
npx privacy-compliance-skills audit --config
```

Lee `legalskills.config.json` en el directorio actual. Ejemplo:

```json
{
  "project_name": "MiApp",
  "countries": ["CO", "BR"],
  "data_types": ["email", "nombre", "diagnóstico"],
  "has_minors": false,
  "has_granular_consent": true,
  "server_region": "sa-east-1",
  "third_parties": ["Stripe", "Google Analytics"],
  "has_privacy_policy": true,
  "has_arco_procedure": false
}
```

### Salida JSON (para CI/CD)

```bash
npx privacy-compliance-skills audit --json
```

### Fallar el pipeline si el score supera un umbral

```bash
npx privacy-compliance-skills audit --fail-on 71
```

Sale con código 1 si `finalScore >= 71`. Útil como gate en GitHub Actions.

## Escala de riesgo

| Score | Nivel | Acción |
|-------|-------|--------|
| 0–30  | 🟢 BAJO   | Mantener controles actuales |
| 31–70 | 🟡 MEDIO  | Implementar acciones prioritarias antes de lanzar |
| 71–100| 🔴 ALTO   | Auditoría legal obligatoria |

## Estructura del paquete

```
cli/
├── src/
│   ├── commands/audit.ts   # Wizard interactivo
│   ├── engine/
│   │   ├── scorer.ts       # Fórmula de riesgo legal
│   │   ├── classifier.ts   # Clasificador de datos por sensibilidad
│   │   └── rules.ts        # Loader de reglas + catálogo de países
│   └── ui/                 # Renderizado en terminal
├── rules/                  # Reglas JSON por jurisdicción (bundled)
│   ├── countries/          # CO, MX, BR, ...
│   ├── international/      # GDPR
│   └── risk-engine/        # Fórmula de score
└── tests/
```

## Modo agente (LLMs)

La CLI es la **fuente de verdad del score** para agentes de IA. La skill `/audit` de Privacy Compliance Skills la invoca en un loop Evaluar → Corregir → Re-evaluar (estilo react-doctor):

```bash
npx privacy-compliance-skills audit --config --json   # emite el contrato JSON para el agente
```

- Contrato de datos (findings con `fix_hint`, `legal_refs`, `config_key`): ver [`architecture/AGENT-CONTRACT.md`](../architecture/AGENT-CONTRACT.md)
- Los agentes **no deben recalcular la fórmula**: invocan la CLI e interpretan su output
- Exit codes: `0` pasa el umbral · `1` no pasa (`--fail-on`, default 71) · `2` config inválida

**Próximamente (`v0.4`):** comando `lls doctor` con `--topic` y `--baseline` para el loop por temas, y penalizadores DevOps (`rules/risk-engine/devops-penalizers.json`: staging obligatorio, secretos, datos de prod fuera de prod, etc.). Ver `PLAN-CUMPLIMIENTO-SDLC-Y-CLI-2026-07.md`.

## Alias corto

```bash
lls audit        # equivalente a privacy-compliance-skills audit
```

## Disclaimer

Este análisis es orientativo y **no constituye asesoría jurídica**. Ver [DISCLAIMER.md](../DISCLAIMER.md).
