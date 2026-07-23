# VERSIONING — Fuente única de versión

**Decisión:** [`.planning/PROJECT.md`](../.planning/PROJECT.md) · **Ticket:** GOB-04

---

## Fuente única

La versión del proyecto vive en un solo lugar: **`cli/package.json`**.

Se eligió la CLI como fuente porque es el artefacto que se publica y versiona de forma independiente (npm), y porque el resto de los "0.x" del repo (raíz, badges) son solo reflejos editoriales de ese mismo release.

## Propagación

Todo lo demás se sincroniza manualmente **desde** `cli/package.json` hacia:

| Punto | Ubicación |
|-------|-----------|
| `package.json` (raíz) | campo `"version"` |
| Badge de versión | `README.md` (`![Version](.../badge/version-X.Y.Z-blue)`) |
| Badge de versión | `README.en.md` (mismo patrón) |

No hay automatización de escritura (no hay un `postversion` que reescriba badges): cuando `cli/package.json` cambia de versión, quien hace el cambio actualiza a mano los tres puntos de arriba en el mismo commit/PR.

## Verificación en CI

`scripts/check-versions.js` (Node puro, sin dependencias) lee la fuente única y los tres puntos de propagación, y falla (`exit 1`) con un mensaje claro si alguno diverge. Corre en local con:

```bash
npm run check:versions
```

y está cableado como step (`Check version consistency`) dentro del job `validate-schema` de [`.github/workflows/validate.yml`](../.github/workflows/validate.yml), que se dispara en cada PR que toque `cli/package.json`, `package.json`, `README.md`, `README.en.md` o el propio script.

## Al lanzar una nueva versión

1. Actualizar `cli/package.json` → `"version"`.
2. Actualizar `package.json` (raíz) → `"version"` al mismo valor.
3. Actualizar el badge de versión en `README.md` y `README.en.md` al mismo valor.
4. Correr `npm run check:versions` (o dejar que CI lo valide en el PR) antes de hacer merge.
