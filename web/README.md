# Privacy Compliance Skills — Web

Landing bilingüe (ES/EN) del proyecto, construida con [Astro](https://astro.build). Modo oscuro nativo, cero JS por defecto.

## Desarrollo

```bash
cd web
npm install
npm run dev      # http://localhost:4321  (ES) · /en (EN)
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Estructura

```
web/
├── astro.config.mjs        # i18n: es (default) + en
├── src/
│   ├── config.ts           # constantes del sitio (URLs)
│   ├── i18n/               # diccionario ES/EN (ui.ts) + helpers (utils.ts)
│   ├── styles/global.css   # tokens de diseño (paleta semáforo)
│   ├── layouts/Layout.astro
│   ├── components/         # Header, Hero, Formats, RiskMeter, Pillars, Regions, Callout, Footer, LangSwitch
│   └── pages/
│       ├── index.astro     # ES
│       └── en/index.astro  # EN
└── public/                 # logo.svg, logo-mark.svg (favicon)
```

## Idiomas

- `es` es el idioma por defecto (sin prefijo de ruta).
- `en` vive bajo `/en`.
- Añadir strings en `src/i18n/ui.ts` y usar `useTranslations(lang)` en los componentes.

## Backlog (ver `PLAN-REBRAND-Y-WEB-2026-07.md` en la raíz)

- Rutas `/docs`, `/regiones`, `/risk-score`, `/contribuir`.
- Content collections que lean `skills/`, `knowledge/` y `cli/rules/` del repo.
- Deploy en Vercel/Netlify o GitHub Pages con preview por PR.
- Fórmula del Risk Score con KaTeX; logo definitivo en `assets/`.
