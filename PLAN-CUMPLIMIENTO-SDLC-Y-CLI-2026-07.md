# PLAN — Cumplimiento Normativo en el SDLC + Optimización CLI/LLM
**Privacy Compliance Skills — Plan de trabajo v0.4**

> Elaborado: 2026-07-08
> Estado: 📋 Propuesto — pendiente de aprobación
> Decisión de arquitectura tomada: **loop iterativo híbrido** (CLI = score determinista y fuente de verdad; Skill/LLM = interpretación, corrección y re-invocación)
> Planes relacionados: `PLAN-VALIDACION-FUENTES-2026-06.md`, `docs/PLAN-SEPARACION-PILARES.md`, `docs/ROADMAP.md`

---

## 0. Diagnóstico resumido (evaluación editorial del estado actual)

### Fortalezas confirmadas

El motor dual FE/BE está consolidado: fórmula v2 (`score-formula-v2.json`), penalizadores por pilar, CLI con `--json` y `--fail-on`, content isolation OWASP LLM01 en las skills, y evaluación SkillSpector LOW/SAFE. La gobernanza editorial (abogado → JSON/MD → IA ejecuta) es el modelo correcto.

### Brechas detectadas

| # | Brecha | Severidad | Evidencia |
|---|---|---|---|
| B1 | **Contenido legal sin validar y potencialmente desactualizado.** Todos los JSON marcan `review_status: pending_legal_validation`. Señales concretas a verificar: México (README cita "LFPDPPP 2010" — verificar la nueva LFPDPPP de 2025 y la extinción del INAI como autoridad), Chile (Ley 19.628 — verificar Ley 21.719/2024, cuya entrada en vigencia está programada para dic-2026, es decir **en 5 meses**), Argentina (proyectos de reforma de la 25.326), resoluciones ANPD/SIC/regulatorias no integradas, sanciones MX citadas en SMG (unidad derogada; hoy UMA). | 🔴 | `RESUMEN-EJECUTIVO-VALIDACION.md`, `cli/rules/countries/*.json` |
| B2 | **No existe pilar DevOps.** El motor solo penaliza FE/BE. No hay señales de staging, secretos, PII en logs, datos de prod en dev, escaneo de dependencias ni backups — el núcleo del estándar enterprise que se quiere incorporar. | 🔴 | `cli/rules/risk-engine/*.json`, `cli/src/engine/scorer.ts` |
| B3 | **Docs contradictorios entre sí.** `_SKILLS-INDEX.md` marca las skills de Fase C como 🔮 planificadas; `_routing.md` las marca ✅ v1 (y sus `SKILL.md` existen). README lista 5 skills; existen 12 `SKILL.md` en `skills/` (y `_routing.md` solo tabula 10 — faltan `data-lifecycle` y `user-controls`). Confunde al LLM que rutea. | 🟡 | `skills/_SKILLS-INDEX.md` vs `skills/_routing.md` vs `README.md` |
| B4 | **El loop iterativo no existe.** `/audit` es one-shot: diagnostica pero no corrige ni re-evalúa. No hay contrato de findings machine-readable con `fix_hint`, ni comparación entre iteraciones. | 🔴 | `skills/audit/SKILL.md`, `cli/src/commands/audit.ts` |
| B5 | **Doble fuente de verdad del score.** La skill `/audit` recalcula la fórmula "a mano" en Markdown mientras la CLI la calcula en TypeScript. Dos implementaciones = divergencia inevitable entre modelos y versiones. | 🟡 | Paso 2 de `skills/audit/SKILL.md` duplica `scorer.ts` |

---

## PARTE 1 — Cumplimiento legal y prácticas enterprise en el SDLC

### Fase 1.1 — Verificación y actualización normativa (semanas 1–2)

Ejecuta el `PLAN-VALIDACION-FUENTES-2026-06.md` existente, ampliado con verificación de vigencia a julio 2026:

1. **México**: confirmar texto vigente de la LFPDPPP (reforma 2025), autoridad competente actual y sanciones en UMA. Actualizar `mexico.json`, matrices y README.
2. **Chile**: incorporar Ley 21.719 con campo `enforcement_date` — el proyecto debe avisar que el régimen cambia en dic-2026 (ventana de preparación, no de pánico).
3. **Brasil**: integrar resoluciones ANPD operativas (plazos de derechos, comunicación de incidentes) como `regulatory_practice` separado de `legal_ref` de ley primaria.
4. **Colombia**: circulares SIC y Registro Nacional de Bases de Datos (aplicabilidad por tamaño de empresa).
5. **Argentina / Perú / Ecuador**: verificar reformas y reglamentos secundarios.
6. Cada claim corregido actualiza `last_reviewed`, y `review_status` pasa a `verified_editorial` (validación de pares sigue pendiente y así se declara).

**Regla operativa:** ningún claim legal se escribe de memoria; toda cifra, plazo o artículo se verifica contra fuente primaria (texto oficial de la ley/resolución) y queda citado en `docs/SOURCES-VALIDATION.md`.

### Fase 1.2 — Matriz de acciones SDLC por capa (semanas 2–3)

Nueva pieza: `knowledge/matrices/matriz-sdlc-cumplimiento.md` — la traducción de ley a acción concreta por capa, que hoy está dispersa entre checklists. Semilla del contenido:

| Capa | Acciones mínimas (dato personal) | Acciones adicionales (dato sensible / menores) |
|---|---|---|
| **Front-end** | Consentimiento granular por finalidad; aviso de privacidad en el punto de captura; formularios con minimización (solo campos necesarios); banner de cookies con rechazo tan fácil como aceptar; sin dark patterns; revocación accesible en la UI | Consentimiento explícito reforzado; flujo de verificación parental; lenguaje comprensible para el titular |
| **Back-end** | Cifrado en tránsito (TLS 1.2+) y en reposo (AES-256); contraseñas con Argon2id/bcrypt; RBAC con mínimo privilegio; audit logging de accesos; retención definida por tipo de dato; borrado efectivo para ARCO/ARSOP; DPA firmado con cada procesador | Cifrado a nivel de campo; pseudonimización; acceso con justificación registrada; DPIA documentada |
| **DevOps** | **Staging obligatorio antes de producción**; datos sintéticos o enmascarados fuera de prod (nunca dumps reales); separación de entornos y credenciales; secrets manager (nunca secretos en el repo); SAST + escaneo de dependencias en CI; `lls audit --fail-on 71` como gate de pipeline; logs sin PII; backups cifrados y restauración probada | Gate más estricto (`--fail-on 51`); revisión humana obligatoria del deploy; runbook de brechas con plazos por jurisdicción (72h GDPR, plazos locales) |
| **Datos (gobernanza)** | Inventario de datos (RoPA ligero); base legal documentada por finalidad; clasificación con `/clasificar-datos` antes de diseñar el esquema | DPIA previa al desarrollo; registro ante autoridad cuando aplique; escalamiento a abogado |

Cada celda de la matriz final debe citar `legal_ref` (artículo) y `standards_ref` (ISO 27001 Anexo A, SOC 2, NIST Privacy Framework, OWASP ASVS) — eso es lo que la hace "enterprise frontier" y no solo opinión.

### Fase 1.3 — Pilar DevOps en el motor de riesgo (semanas 3–4)

1. Nuevo `cli/rules/risk-engine/devops-penalizers.json` (v1, acotado a 7 señales para evitar scope creep):

| Penalizador | Pts | Detección (wizard/config) |
|---|---|---|
| Sin entorno de staging previo a producción | +15 | `has_staging_env` |
| Datos reales de producción usados en dev/staging | +20 | `uses_prod_data_outside_prod` |
| Secretos/credenciales en el repositorio | +20 | `has_secrets_manager` |
| Logs de aplicación con PII sin enmascarar | +10 | `logs_contain_pii` |
| Sin escaneo de dependencias/SAST en CI | +10 | `has_dependency_scanning` |
| Sin backups cifrados con restauración probada | +10 | `has_tested_backups` |
| Sin gate de riesgo en el pipeline (`--fail-on`) | +5 | `has_ci_risk_gate` |

2. Integración con la fórmula: los penalizadores DevOps suman al pilar **Backend** (protección interna) manteniendo compatibilidad con el score 0–100; el output los muestra en sub-panel propio "⚙️ DevOps". Verificar solapamiento con penalizadores BE existentes (ej. plan de brechas ya existe — no duplicar).
3. Actualizar: `country-rules.schema.json` (si aplica), `scorer.ts`/`backend-scorer.ts`, wizard (`audit.ts` — bloque Q9 DevOps), `legalskills.config.json` de ejemplo, y `skills/audit/SKILL.md` (tabla 2C).
4. Añadir campo `standards_ref` a **todos** los penalizadores (FE/BE/DevOps) en JSON.

**Criterios de aceptación Parte 1:** cero claims con fuente pendiente sin marcar; matriz SDLC publicada con refs legales y de estándares; los 7 penalizadores DevOps operativos en CLI y skill con tests; docs de cobertura (README) actualizados.

---

## PARTE 2 — Loop iterativo híbrido CLI + Skill (estilo react-doctor)

**Principio rector:** la CLI es la única implementación de la fórmula. La skill nunca recalcula el score a mano cuando la CLI está disponible; interpreta, corrige y re-invoca. Esto resuelve B5 y hace el loop reproducible.

### Fase 2.1 — Contrato de datos CLI ↔ LLM (semanas 4–5)

Extender el output `--json` a un contrato versionado (`schema_version`) orientado a agentes:

```json
{
  "schema_version": "1.0",
  "final_score": 62,
  "level": "medium",
  "pillars": { "fe": 25, "be": 37 },
  "findings": [
    {
      "id": "FE-CONSENT-01",
      "pillar": "FE",
      "topic": "consentimiento",
      "points": 15,
      "title": "Sin consentimiento granular por finalidad",
      "legal_refs": ["Ley 1581/2012 Art. 9 (CO)", "LGPD Art. 8 §4 (BR)"],
      "standards_refs": ["ISO 27701 7.3.4"],
      "severity": "high",
      "fix_hint": "Reemplazar el checkbox único por toggles independientes por finalidad; registrar timestamp y versión del texto aceptado.",
      "config_key": "has_granular_consent"
    }
  ],
  "assumptions": ["..."],
  "escalation_required": false
}
```

Claves del diseño: cada finding trae **acción concreta** (`fix_hint`), **cita legal desde el JSON de reglas** (el LLM no cita de memoria) y **la llave de config que lo apaga** (`config_key`) — así el loop sabe exactamente qué corregir y cómo verificar la corrección.

### Fase 2.2 — Comando `lls doctor` (semanas 5–6)

Modo loop de la CLI, no interactivo:

- Lee `legalskills.config.json`; emite findings agrupados por **tema** (consentimiento, transparencia, clasificación, cifrado, acceso, retención, transferencias, devops).
- `--topic <tema>`: evalúa solo un tema (el loop trabaja por temas, como react-doctor).
- `--baseline`: compara contra `.legalskills/last-audit.json` (guardado en cada corrida) y reporta el delta por tema.
- Exit codes documentados: `0` pasa umbral, `1` no pasa, `2` config inválida.

### Fase 2.3 — Reescritura de `/audit` como máquina de estados (semanas 6–7)

El `SKILL.md` pasa de "fórmula + formato" a un protocolo de loop explícito para el LLM:

```
S0 DETECTAR   ¿CLI disponible? → sí: `npx privacy-compliance-skills audit --config --json`
                                → no: fallback a la fórmula del SKILL (marcando "score estimado, no verificado")
S1 EVALUAR    Obtener score + findings del contrato JSON
S2 DIAGNOSTICAR  Agrupar por tema; priorizar por puntos × facilidad de corrección
S3 CORREGIR   Un tema por iteración: aplicar fix_hint (código/config/docs del proyecto
              del usuario) y actualizar legalskills.config.json con lo corregido
S4 RE-EVALUAR `lls doctor --baseline` → delta
S5 ¿PARAR?    Sí cuando: score < umbral (default 31) · O mejora < 5 pts en 2 iteraciones
              · O 5 iteraciones alcanzadas · O escalamiento (≥71 con datos sensibles:
              el loop SIEMPRE se corta hacia "consulta abogado")
S6 REPORTAR   Score inicial → final, temas resueltos, pendientes que requieren humano
```

Reglas de calidad para el LLM (se suman a las existentes): nunca inventar artículos de ley — solo citar `legal_refs` del contrato; todo supuesto se declara; una acción por finding; el score reportado es siempre el de la CLI cuando existe; las reglas de Content Isolation actuales se conservan íntegras.

Trabajo complementario de esta fase (resuelve B3): unificar estados de skills entre `README.md`, `_SKILLS-INDEX.md` y `_routing.md` (una sola tabla canónica, las otras la referencian) y añadir sección "Modo agente" al README de la CLI documentando el contrato JSON.

### Fase 2.4 — Harness de evaluación (semanas 7–8)

1. **Golden tests** del contrato: mismos inputs → mismo JSON byte-a-byte (protege la reproducibilidad del score).
2. **Fixtures de loop**: 3 proyectos sintéticos (bajo/medio/alto riesgo) con config; verificar que el loop converge en ≤ 5 iteraciones y que el caso alto corta hacia escalamiento.
3. **Evals de skill** (metodología skill-creator): adherencia al protocolo S0–S6, uso de CLI vs cálculo manual, resistencia a inyección (reusar los 17 test cases existentes).
4. **CI**: workflow que corre golden tests, valida todos los JSON contra schema y falla si algún `legal_ref` citado no existe en los archivos de reglas.

---

## Cronograma y dependencias

| Semana | Fase | Entregable clave |
|---|---|---|
| 1–2 | 1.1 | JSONs de país verificados y actualizados a jul-2026 |
| 2–3 | 1.2 | `matriz-sdlc-cumplimiento.md` con refs legales + estándares |
| 3–4 | 1.3 | Pilar DevOps operativo (7 penalizadores) en CLI y skill |
| 4–5 | 2.1 | Contrato JSON v1.0 (`findings[]` con `fix_hint`) |
| 5–6 | 2.2 | `lls doctor` con `--topic` y `--baseline` |
| 6–7 | 2.3 | `/audit` como máquina de estados + docs unificados |
| 7–8 | 2.4 | Golden tests, fixtures de loop, evals, CI |

Dependencias duras: 1.1 → 1.3 (los penalizadores citan ley verificada) · 1.3 → 2.1 (el contrato incluye DevOps) · 2.1 → 2.2 → 2.3 → 2.4.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Vigencia normativa cambia durante la ejecución (ej. Chile dic-2026) | Campos `last_reviewed` + `enforcement_date`; verificación contra fuente primaria en cada fase, no solo al inicio |
| Divergencia skill/CLI reaparece | La CLI es fuente única de la fórmula (2.1); golden tests la protegen (2.4) |
| Scope creep del pilar DevOps | v1 cerrada en 7 penalizadores; el resto va al backlog de v0.5 |
| El loop del LLM no converge o alucina citas | Criterios de parada duros en S5; citas solo desde `legal_refs`; evals de adherencia en 2.4 |

## Métricas de éxito

1. 100% de claims legales con fuente primaria citada o marcados explícitamente como pendientes.
2. Score reproducible: skill y CLI reportan el mismo número para el mismo input.
3. Loop converge en ≤ 5 iteraciones en los 3 fixtures; el caso de alto riesgo escala a humano siempre.
4. Cero contradicciones de estado entre README, índice y routing.

---

> ⚠️ Este plan es una guía operativa del proyecto. El contenido legal resultante no constituye asesoría jurídica y requiere validación de pares (abogados de protección de datos). Ver `DISCLAIMER.md`.
