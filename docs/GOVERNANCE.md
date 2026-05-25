# Gobernanza y Control Editorial — LegalSkillsLATAM

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
- **Responsabilidad:** Redactar, validar y actualizar el contenido legal de `rules/`, `matrices/` y `checklists/`
- **Gatekeeping:** Ningún archivo en `rules/countries/` ni `rules/international/` puede ser publicado sin su revisión
- **Periodicidad de revisión:** Al menos cada 6 meses por país, o ante cambio normativo relevante

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

## Versionado

El proyecto usa **Semantic Versioning** adaptado al contexto legal:

- **MAJOR** (ej: 2.0.0): Cambio en la fórmula del Risk Score o en el esquema JSON base
- **MINOR** (ej: 1.1.0): Adición de nuevo país, nueva skill o nueva dimensión en matrices
- **PATCH** (ej: 1.0.1): Corrección de error legal, actualización de multa/plazo, fix de typo

---

## Descargo de Responsabilidad Obligatorio

Todo output generado por las skills, la CLI o la API **debe incluir** la siguiente línea:

> *Este resultado es una estimación orientativa generada por LegalSkillsLATAM. No constituye asesoría jurídica. Ver [DISCLAIMER.md](../DISCLAIMER.md).*

Ninguna versión del proyecto puede ser publicada sin este descargo en todos los puntos de contacto con el usuario.
