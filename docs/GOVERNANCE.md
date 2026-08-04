# Gobernanza y Control Editorial — Privacy Compliance Skills

---

## Principio Fundamental

**Ninguna IA genera reglas legales de forma autónoma en este proyecto.**

La inteligencia artificial es la *interfaz* que aplica las reglas. Los abogados expertos son los *autores* de las reglas. Esta separación es innegociable y es lo que da credibilidad al proyecto.

```
Abogado Experto   →   Reglas en JSON/MD   →   IA aplica las reglas   →   Dev recibe guidance
   (Autor)              (Fuente de verdad)        (Ejecutor)                  (Beneficiario)
```

---

## Roles

### Equipo Editorial (Abogados)
- **Responsabilidad:** Redactar, validar y actualizar el contenido legal de `cli/rules/`, `knowledge/pillar-frontend/` y `knowledge/pillar-backend/`
- **Gatekeeping:** Ningún archivo en `cli/rules/latam/` ni `cli/rules/eu/` puede ser publicado sin su revisión
- **Periodicidad de revisión:** Al menos cada 6 meses por país, o ante cambio normativo relevante

**Separación por pilar (v0.3+):**
- **Abogado de privacidad** → valida `knowledge/pillar-frontend/` (consentimiento, transparencia, UI)
- **Abogado de data governance** → valida `knowledge/pillar-backend/` (cifrado, transferencias, ciclo de vida)
- **Ambos** → validan `cli/rules/latam/` y skills que cubran los dos pilares (`skills/audit/`)

### Colaboradores Técnicos (Devs)
- **Responsabilidad:** Infraestructura del repositorio, CLI, API, tests de schema JSON
- **Restricción:** No modifican el contenido legal — solo la forma técnica de entregarlo
- **Pueden proponer** correcciones a través de Pull Requests con label `[editorial-review-needed]`

### Comunidad (Contributors)
- **Pueden:** Reportar errores, proponer nuevos países, sugerir nuevas dimensiones de análisis
- **No pueden:** Aprobar ni mergear cambios en `rules/` sin revisión editorial

---

## Flujo de Control Editorial

```
1. Cambio normativo detectado (nueva ley, sentencia, regulación)
         ↓
2. Issue creado en GitHub con label [legal-update] + país afectado
         ↓
3. Abogado del equipo editorial redacta el cambio en rama feature/
         ↓
4. Pull Request con:
   - Diff del archivo JSON/MD modificado
   - Referencia legal exacta (artículo, ley, fecha de vigencia)
   - Nota de impacto técnico para devs
         ↓
5. Revisión por al menos un segundo miembro del equipo editorial
         ↓
6. Merge a main + etiqueta de versión + entrada en CHANGELOG.md
         ↓
7. Notificación a comunidad (GitHub Releases + redes)
```

---

## Flujo de validación de pares

> Este flujo es la infraestructura del llamado a colaboradores legales del [README](../README.md) ("no necesitas saber programar"). El "Flujo de Control Editorial" de arriba describe cómo se **redacta y mergea** una regla; esta sección describe cómo se **valida por pares** hasta que puede llamarse `validated`.

### Pipeline de estados (`review_status`)

Todo archivo en `cli/rules/**/*.json` declara su estado de validación en el campo `review_status` (definido en `cli/rules/schema/country-rules.schema.json` y los schemas equivalentes):

```
pending_legal_validation → verified_editorial → under_review → validated
```

| Estado | Qué significa | Quién lo asigna |
|---|---|---|
| `pending_legal_validation` | Contenido recién redactado o editado. Nada en este estado es autoritativo — el output de la CLI y las skills debe mostrarlo etiquetado como pendiente de validación. | Equipo editorial, estado por defecto de cualquier cambio nuevo |
| `verified_editorial` | El equipo editorial interno contrastó los claims contra el texto oficial de la norma (fuente primaria), pero **ningún revisor externo al equipo** lo confirmó todavía. | Equipo editorial (Cowork) |
| `under_review` | Un/a abogado/a colaborador/a **identificado/a** abrió una revisión formal (issue con el template de abajo) y está verificando activamente los claims contra la fuente primaria. | Se activa al abrirse el issue de revisión |
| `validated` | La revisión de pares terminó y el revisor es una persona humana identificable — nunca una IA ni un proceso automático. | **Solo un revisor humano identificado**, nunca automatizado |

**Regla dura:** el paso a `validated` lo hace exclusivamente un revisor humano identificado. Esa promoción se registra en el propio JSON de la regla con:

- `reviewed_by`: nombre o perfil públicamente verificable del revisor (este estado no admite revisor anónimo).
- `last_reviewed`: fecha ISO de la revisión que produjo el `validated`.

Ninguna sesión de código, script o agente de IA escribe `review_status: "validated"` por su cuenta. Es una promoción manual que un mantenedor técnico aplica en un PR *después* de que un revisor humano identificado confirmó la revisión en el issue correspondiente — este documento define el flujo, no lo ejecuta.

### Cómo inicia una revisión un abogado/a colaborador/a

1. Abre un issue con el template **["Revisión legal de una regla/matriz"](../.github/ISSUE_TEMPLATE/revision-legal.md)** (queda etiquetado `legal-review` automáticamente). No hace falta Git ni saber programar — ver [`CONTRIBUTING.md`](CONTRIBUTING.md).
2. Identifica en el issue el archivo o los archivos que revisa (p. ej. `cli/rules/latam/colombia.json`, una matriz de `knowledge/`) y la jurisdicción.
3. El equipo técnico confirma el alcance y marca la revisión como `under_review`.

### Qué revisa el par

- **Claims contra fuente primaria:** cada norma, artículo, plazo o sanción citados en el JSON o la matriz se contrastan contra el texto oficial (diario oficial, boletín del regulador, texto consolidado) — no contra resúmenes de terceros ni blogs.
- **Vigencia:** fecha de entrada en vigor y reformas o derogaciones posteriores a la última revisión registrada (`last_reviewed`).
- **Textualidad de `legal_refs`:** que la referencia citada exista literalmente en la fuente, no como paráfrasis.
- **Alcance, no autoridad final:** la revisión de pares mejora la confiabilidad del contenido pero no reemplaza asesoría jurídica caso por caso — el descargo del proyecto se mantiene siempre (ver [DISCLAIMER.md](../DISCLAIMER.md)).

Si el revisor encuentra un error, lo documenta en el issue con la corrección propuesta y la fuente exacta. Un mantenedor técnico abre entonces el PR que actualiza el JSON (`reviewed_by`, `last_reviewed`, `review_status`) referenciando el issue, siguiendo el "Flujo de Control Editorial" de arriba.

---

## Versionado

El proyecto usa **Semantic Versioning** adaptado al contexto legal:

- **MAJOR** (ej: 2.0.0): Cambio en la fórmula del Risk Score o en el esquema JSON base
- **MINOR** (ej: 1.1.0): Adición de nuevo país, nueva skill o nueva dimensión en matrices
- **PATCH** (ej: 1.0.1): Corrección de error legal, actualización de multa/plazo, fix de typo

---

## Descargo de Responsabilidad Obligatorio

Todo output generado por las skills, la CLI o la API **debe incluir** la siguiente línea:

> *Este resultado es una estimación orientativa generada por Privacy Compliance Skills. No constituye asesoría jurídica. Ver [DISCLAIMER.md](../DISCLAIMER.md).*

Ninguna versión del proyecto puede ser publicada sin este descargo en todos los puntos de contacto con el usuario.
