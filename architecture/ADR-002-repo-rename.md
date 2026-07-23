# ADR-002 — Renombre del repositorio GitHub
**Privacy Compliance Skills — 2026-07-23 · Estado: ✅ Decidido y ejecutado**

## Contexto

El proyecto se rebrandeó de *LegalSkillsLATAM* a *Privacy Compliance Skills (UE · USA · LATAM)* (PR #13). Quedaba decidir si el repositorio GitHub se renombraba o conservaba el nombre viejo con alias (ticket REL-02).

## Decisión

**Renombrar el repositorio a `Privacy_Compliance_Skills-UE-USA-LATAM`** — ejecutado por el maintainer en GitHub. Verificado el 2026-07-23 vía `gh repo view`:

- URL canónica: `https://github.com/joselito412/Privacy_Compliance_Skills-UE-USA-LATAM` (rama por defecto: `main`).
- GitHub mantiene **redirect automático** desde `joselito412/LegalSkillsLATAM` (fetch/push/enlaces viejos siguen funcionando).
- Remote local actualizado a la URL canónica (`git remote set-url`).

## Alternativa descartada

Mantener `LegalSkillsLATAM` con alias: descartada porque todos los docs, el plugin y la web ya publican la URL nueva desde el PR #13 — conservar el nombre viejo habría dejado la URL "canónica" documentada como un simple redirect inverso permanente.

## Estado de consistencia (verificado 2026-07-23)

| Punto | Estado |
|---|---|
| `README.md` / `README.en.md` | ✅ URL canónica (nota histórica "antes se llamaba" conservada) |
| `.claude-plugin/plugin.json` | ✅ URL canónica |
| `web/src/config.ts` | ✅ URL canónica |
| `package.json` / `cli/package.json` (`repository`) | ✅ URL canónica (REL-01) |
| `git remote origin` | ✅ URL canónica |

## Consecuencias

- Los clones existentes siguen funcionando por el redirect, pero se recomienda `git remote set-url origin <URL canónica>`.
- Si en el futuro se crea otro repo llamado `LegalSkillsLATAM` bajo la misma cuenta, el redirect se rompe — no reutilizar el nombre viejo.

---
*Ticket: REL-02 · Fase 1 del plan GSD v0.4.0*
