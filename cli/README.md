# legalskills-latam CLI

Herramienta de línea de comandos para calcular el **Legal Risk Score** de proyectos de software que operan en LATAM.

## Instalación

```bash
npm install -D legalskills-latam
# o ejecutar sin instalar:
npx legalskills-latam audit
```

**Requiere Node.js 18+.**

## Uso

### Wizard interactivo

```bash
npx legalskills-latam audit
```

Responde 5–8 preguntas y obtén tu score con desglose de penalizadores.

### Desde archivo de configuración

```bash
npx legalskills-latam audit --config
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
npx legalskills-latam audit --json
```

### Fallar el pipeline si el score supera un umbral

```bash
npx legalskills-latam audit --fail-on 71
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

## Alias corto

```bash
lls audit        # equivalente a legalskills-latam audit
```

## Disclaimer

Este análisis es orientativo y **no constituye asesoría jurídica**. Ver [DISCLAIMER.md](../DISCLAIMER.md).
