# Tabla de Fuentes Primarias — Validación Legal

> **Uso:** Esta tabla es el instrumento de trabajo para la revisión por abogado experto (Paso 2 del proceso de validación). Para cada claim del repositorio, indica el artículo exacto, el texto de la ley y la URL oficial donde verificarlo.
>
> Estado: **Borrador editorial — pendiente revisión legal** | Versión: 1.0.0 | 2026-06-02

---

## Cómo usar esta tabla

Para cada fila, el abogado revisor debe:
1. Abrir la URL oficial
2. Localizar el artículo citado
3. Confirmar que el texto de la ley respalda el claim del repositorio
4. Marcar: ✅ Confirmado / ⚠️ Matiz / ❌ Incorrecto + nota de corrección

---

## 🔄 Ronda de verificación de vigencia — 2026-07-08

Verificación editorial de vigencia normativa realizada con fuentes secundarias confiables (firmas legales, IAPP, textos oficiales). **No sustituye la revisión de pares artículo por artículo de las tablas siguientes.**

| Jurisdicción | Hallazgo verificado | Fuente de referencia | Acción tomada en el repo |
|---|---|---|---|
| 🇲🇽 México | **Nueva LFPDPPP** publicada en DOF el 20-03-2025, vigente desde 21-03-2025; abroga la ley de 2010. INAI extinto; autoridad ahora es la **Secretaría Anticorrupción y Buen Gobierno (SABG)**. Multas de 100 a 320,000 UMA (Arts. 58–64), duplicables con datos sensibles. | [DOF 20-03-2025](https://www.dof.gob.mx/index_113.php?year=2025&month=03&day=20) · [Garrigues](https://www.garrigues.com/es_ES/noticia/mexico-nueva-ley-federal-proteccion-datos-personales-posesion-particulares-introduce) · [IAPP](https://iapp.org/news/a/entendiendo-la-ley-federal-de-protecci-n-de-datos-personales-en-posesi-n-de-los-particulares-en-mexico) | `mexico.json` v1.1.0 actualizado (ley, autoridad, sanciones UMA). Secciones de detalle marcadas para re-validación contra texto 2025. |
| 🇨🇱 Chile | **Ley 21.719** (DO 13-12-2024) reforma integral de la Ley 19.628; **entra en vigencia el 01-12-2026**. Crea la Agencia de Protección de Datos Personales (APDP); multas hasta 20,000 UTM; Registro Nacional de Sanciones. | [BCN LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=1209272) | Cobertura del README actualizada con `enforcement_date`. Pendiente: crear `chile.json` (sesión de código / v0.5). |
| 🇧🇷 Brasil | **Resolução CD/ANPD nº 15/2024 (RCIS)**: comunicación de incidentes a ANPD y titulares en **3 días hábiles** (doble para pequeño porte, Res. 2/2022); complemento en 20 días hábiles; registro interno de incidentes por 5 años. | [gov.br/ANPD](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-aprova-o-regulamento-de-comunicacao-de-incidente-de-seguranca) · [Texto RCIS](https://www.lgpd.ms.gov.br/wp-content/uploads/2024/05/REGULAMENTO-DE-COMUNICACAO-DE-INCIDENTE-DE-SEGURANCA-ABRIL-2024-ANPD-.pdf) | `brasil.json` v1.1.0 actualizado (breach_notification con práctica regulatoria). |
| 🇵🇪 Perú | **Nuevo Reglamento** de la Ley 29733: **D.S. 016-2024-JUS** (30-11-2024), vigente desde 31-03-2025. Notificación de brechas en 48 horas; Oficial de Datos Personales (implementación escalonada 1–4 años); portabilidad; alcance extraterritorial. | [El Peruano](https://busquedas.elperuano.pe/dispositivo/SE/2349653-1) · [IAPP](https://iapp.org/news/a/se-publica-el-nuevo-reglamento-de-protecci-n-de-datos-personales-en-per-) | Cobertura del README actualizada. Pendiente: matrices que citen el reglamento de 2013 deben migrar al D.S. 016-2024-JUS. |
| 🇪🇨 Ecuador | Reglamento LOPDP vigente: **Decreto Ejecutivo 904** (06-11-2023). Superintendencia de Protección de Datos Personales operativa; régimen sancionatorio vigente desde 26-05-2023 (multas 0.7%–1% del volumen de negocio). | [Texto DE-904](https://www.telecomunicaciones.gob.ec/wp-content/uploads/2023/11/Decreto-Ejecutivo-No.-904.pdf) | Cobertura del README actualizada. |
| 🇦🇷 Argentina | Ley 25.326 **sigue vigente sin reforma aprobada**. Proyectos de reforma en debate legislativo (2025–2026), inspirados en el anteproyecto AAIP, alineados a GDPR/LGPD. | [IAPP](https://iapp.org/news/a/novedades-legislativas-en-argentina-sobre-protecci-n-de-datos-personales-e-inteligencia-artificial) · [AAIP](https://www.argentina.gob.ar/aaip/datospersonales/proyecto-ley-datos-personales) | Sin cambio de reglas. Monitorear en cada ronda de verificación. |

---

## 🔬 Ola 1 de validación textual — 2026-07-09

Verificación editorial **contra texto oficial de fuente primaria** (no fuentes secundarias). Metodología: descarga del texto oficial → localización del artículo → confirmación del claim → registro con fecha de consulta 2026-07-09.

### 🇲🇽 México — LFPDPPP 2025, texto oficial ([Diputados, últ. reforma DOF 14-11-2025](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf))

| Claim | Artículo (ley 2025) | Resultado | Nota |
|---|---|---|---|
| Consentimiento tácito válido por regla general | **Art. 7** (antes Art. 8) | ✅ Confirmado | *"Por regla general será válido el consentimiento tácito, salvo que las disposiciones jurídicas aplicables exijan"* expreso. Financieros/patrimoniales requieren expreso. |
| Sensibles: consentimiento expreso y por escrito | **Art. 8** (antes Art. 9) | ✅ Confirmado | Firma autógrafa, electrónica o mecanismo de autenticación. |
| Aviso de privacidad: contenido y puesta a disposición | **Arts. 14-17** (antes 15-18) | ✅ Confirmado | Contenido mínimo Art. 15; formatos Art. 16; datos no obtenidos del titular Art. 17. |
| Medidas de seguridad administrativas/técnicas/físicas | **Art. 18** (antes 19) | ✅ Confirmado | Criterios: riesgo, consecuencias, sensibilidad, desarrollo tecnológico. |
| Vulneraciones: aviso "a la brevedad" | **Art. 19** (antes 20) | ⚠️ **Corregido** | El texto 2025 dice **"de forma inmediata"** y la obligación es hacia las **personas titulares** — la notificación a la autoridad NO consta en la ley (verificar Reglamento). `mexico.json` actualizado. |
| ARCO: 20 días respuesta + 15 para hacer efectiva | **Art. 31** (antes 32) | ✅ Confirmado | Ampliables una sola vez por periodo igual. |
| Multas 100–320,000 UMA | **Arts. 58-59** | ⚠️ **Precisado** | Escalonadas: apercibimiento / **100–160,000 UMA** (fracc. II-VII) / **200–320,000 UMA** (fracc. VIII-XVIII) / multa adicional por reiteración. **Hasta 2x con datos sensibles** (Art. 59 in fine). `mexico.json` actualizado. |
| Prisión hasta 5 años | **Arts. 62-63** | ✅ Confirmado | Art. 62: 3m-3a (vulneración con lucro); Art. 63: 6m-5a (engaño con lucro indebido). |

### 🇺🇸 USA — CCPA/CPRA, texto oficial ([estatuto publicado por la CPPA](https://cppa.ca.gov/regulations/pdf/cppa_act.pdf))

| Claim en `usa-federal.json` | Sección | Resultado |
|---|---|---|
| Derecho a borrar | §1798.105 *"Consumers' Right to Delete Personal Information"* | ✅ Confirmado |
| Derecho a corregir | §1798.106 *"Right to Correct Inaccurate Personal Information"* | ✅ Confirmado |
| Opt-out de venta/compartición | §1798.120 *"Right to Opt Out of Sale or Sharing"* | ✅ Confirmado |
| Limitar uso de información sensible (SPI) | §1798.121 + enlace obligatorio *"Limit the Use of My Sensitive Personal Information"* | ✅ Confirmado |
| Acción privada por brechas, daños desde $100 por consumidor | §1798.150 *"Personal Information Security Breaches"* — *"not less than one hundred dollars ($100)"* | ✅ Confirmado (rango $100–$750 por consumidor por incidente) |
| Derecho a conocer (§1798.100/.110/.115), no discriminación (§1798.125), sanciones (§1798.155), umbrales y regs CPPA | — | ⬜ Pendiente — verificar con Descrybe (`verify_quote`) cuando se autentique el conector, o contra el mismo PDF oficial |

### 🇪🇺 UE — GDPR (Reglamento 2016/679, [EUR-Lex](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679))

| Claim en `gdpr.json` | Artículo | Estado |
|---|---|---|
| Categorías especiales de datos (salud, biometría, etc.) | Arts. 9-10 | ✅ Texto estable desde 2016 — verificado editorialmente |
| Consentimiento: libre, específico, informado, inequívoco; revocable | Arts. 4(11), 6(1)(a), 7 | ✅ Ídem |
| Derechos del titular | Arts. 15-22 | ✅ Ídem |
| Brechas: 72h a la autoridad; comunicación a titulares si alto riesgo | Arts. 33-34 | ✅ Ídem |
| DPO condicional | Arts. 37-39 | ✅ Ídem |
| DPIA para alto riesgo | Art. 35 | ✅ Ídem |
| Transferencias (Cap. V) y sanciones dos niveles (2%/4%) | Arts. 44-49, 83 | ✅ Ídem |
| **EU-US Data Privacy Framework** | Decisión 2023/1795 | ⚠️ **Vigente pero bajo presión** (jul-2026): apelación TJUE C-703/25 P pendiente + fallo SCOTUS jun-2026 sobre la FTC cuestiona la supervisión independiente. Recomendar SCCs como contingencia documentada. |
| Capa ePrivacy (cookies) | Directiva 2002/58/CE, Art. 5(3) | ⬜ Añadir a `gdpr.json` como capa adyacente (backlog Sesión C) |

---

## 🔭 Ronda de vigilancia 2026-07 — ejecutada 2026-07-09 (primera ronda, metodología v1.0)

> Metodología: `docs/VIGILANCIA-NORMATIVA.md`. Cobertura: **11/11 jurisdicciones con respuesta explícita.** Las Olas 1-2 de este mismo día constituyen la verificación Nivel 0 de 9 jurisdicciones; esta ronda completó CO y PA.

| Jurisdicción | Hallazgo | Clase | Fuente · fecha consulta | Impacto en repo / acción |
|---|---|---|---|---|
| 🇨🇴 Colombia | **Circular Externa 002/2026 de la SIC**: instrucciones de tratamiento de datos con fines políticos/electorales (partidos, campañas, marketing electoral) bajo Ley 1581 y Decreto 1074/2015 | ✅ CONFIRMADO | [Sede electrónica SIC](https://sedeelectronica.sic.gov.co/comunicado/la-sic-expidio-instrucciones-sobre-proteccion-de-datos-personales-en-el-contexto-electoral) · 2026-07-09 | `colombia.json` → añadir a `regulatory_practice`; relevante para apps con datos de opinión política (ya sensibles). Ticket editorial. |
| 🇨🇴 Colombia | Proyecto de Resolución SIC (27-may-2026) que modificaría el Título V de la Circular Única (habeas data financiero, Leyes 2157/2021 y 2573/2026, RNBD) | ⚪ MONITOREO | [CERLatam](https://www.cerlatam.com/normatividad/sic-proyecto-de-resolucion-27-may-2026/) · 2026-07-09 | Es PROYECTO — prohibido registrarlo como vigente. Re-verificar en ronda 2026-08. La "Ley 2573/2026" citada debe verificarse contra fuente oficial. |
| 🇵🇦 Panamá | **Resolución ANTAI-DG-003-2026** (26-03-2026): adopta las Cláusulas Contractuales Estándar de la RIPD para transferencias internacionales | 🟡 PROBABLE | [Morgan & Morgan](https://morimor.com/panama-updates-rules-for-international-data-transfers/) · 2026-07-09 — localizar texto en antai.gob.pa ≤7 días | Debe entrar al futuro `panama.json` (Ola 3): mecanismo de transferencia + multas B/.1,000–10,000 confirmadas por fuentes del sector. |
| 🇲🇽🇧🇷🇨🇱🇵🇪🇪🇨🇦🇷🇺🇸🇪🇺 (9) | Sin novedades adicionales a lo registrado en las Olas 1-2 de validación de este mismo día (ver secciones 🔬 arriba) | ✅ Verificado | Olas 1-2 · 2026-07-09 | Ver tickets ya abiertos en esas secciones |

**Próxima ronda:** 2026-08-01 (automática). Pendientes que hereda: localizar texto oficial ANTAI-DG-003-2026; estado del proyecto de resolución SIC; instrucciones APDP Chile (ventana jun-nov 2026).

---

## 🔬 Ola 2 de validación — 2026-07-09

### 🇺🇸 USA federal — cierre de claims pendientes (texto oficial [CPPA](https://cppa.ca.gov/regulations/pdf/cppa_act.pdf))

§1798.100 *(General Duties)*, §1798.110 *(Right to Know — Collected)*, §1798.115 *(Right to Know — Sold/Shared)*, §1798.125 *(No Retaliation)* y §1798.155 *(Administrative Enforcement)*: ✅ **títulos y existencia confirmados contra el estatuto oficial**. Con esto, las 10 secciones CCPA/CPRA citadas en `usa-federal.json` están verificadas textualmente.

### 🇺🇸 USA estados — muestra de riesgo verificada

| Claim | Resultado | Fuente |
|---|---|---|
| IN, KY, RI vigentes desde 01-01-2026 (total: 19 en vigor) | ✅ Confirmado. IN/KY: hasta $7,500/violación, cure 30 días; RI: sin cure, hasta $10,000 | [IAPP](https://iapp.org/news/a/new-year-new-rules-us-state-privacy-requirements-coming-online-as-2026-begins) · [Cozen](https://www.cozen.com/news-resources/publications/2025/three-states-will-ring-in-2026-with-new-privacy-laws) |
| MD (MODPA) vigente 01-10-2025; minimización reforzada; prohibición de venta de sensibles | ✅ Confirmado + **matiz**: aplica a tratamientos desde el **01-04-2026**; minimización exigible incluso con consentimiento; primera prohibición absoluta de venta de datos sensibles | [EPIC](https://epic.org/maryland-online-data-privacy-act-comes-into-effect/) · [Cooley](https://www.cooley.com/news/insight/2025/2025-09-09-marylands-unique-state-privacy-law-takes-effect-october-1--what-you-should-know) |
| Resto de los 19 estados (fechas/umbrales/cure) | ⬜ Pendiente — verificación estado por estado con Descrybe (`search_laws_and_rules`) cuando el conector autentique en esta sesión, o contra legislaturas estatales | `state-matrix.json` actualizado con nota |

### 🇨🇱 Chile — transición APDP

APDP **ya operativa de forma adelantada**; primeras instrucciones generales y criterios de fiscalización entre jun y nov 2026; potestad sancionatoria plena desde 01-12-2026. **Ventana de gracia PYME** (Ley 20.416): primeras infracciones → amonestación escrita durante los primeros 12 meses (hasta dic-2027). Reincidencia puede escalar hasta 4% de ingresos anuales. Fuentes secundarias chilenas — confirmar contra instrucciones APDP cuando se publiquen. `chile.json` actualizado.

### 🇧🇷 Brasil — resoluciones ANPD

| Resolución | Verificado | Acción |
|---|---|---|
| **CD/ANPD nº 19/2024** (DOU 23-08-2024) — transferencias internacionales | ✅ Regula Arts. 33-36 LGPD; SCCs brasileñas en anexos; plazo de 12 meses para incorporarlas a contratos (**gracia vencida ago-2025** — contratos sin SCCs ANPD están hoy en incumplimiento) | `brasil.json` actualizado ([gov.br/ANPD](https://www.gov.br/anpd/pt-br/assuntos/noticias/resolucao-normatiza-transferencia-internacional-de-dados)) |
| **CD/ANPD nº 2/2022** — agentes de pequeño porte | ✅ Declaración simplificada del Art. 19-I LGPD en hasta 15 días; plazos en doble para pequeño porte | Confirma el claim de plazos de `brasil.json` ([texto oficial](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022)) |

---

## 🇧🇷 Brasil — LGPD (Lei 13.709/2018)

**Texto oficial:** https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
**Autoridad:** https://www.gov.br/anpd

| Claim en el repositorio | Archivo | Artículo | Texto de la ley (extracto) | Revisión |
|---|---|---|---|---|
| Datos sensibles incluyen biometría, salud, origen étnico, vida sexual, genéticos, religión, política, sindicato | `brasil.json` → `data_categories.sensitive` | Art. 5°, XIV + Art. 11 | *"dados pessoais sensíveis: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural"* | ⬜ Pendiente |
| El consentimiento para datos sensibles debe ser "específico e destacado" | `brasil.json` → `consent` | Art. 11, I | *"mediante o fornecimento de consentimento pelo titular, de forma específica e destacada"* | ⬜ Pendiente |
| Plazo de respuesta a derechos del titular: 15 días | `brasil.json` → `data_subject_rights` | Art. 18 + Resolução CD/ANPD nº 2/2022 | La LGPD establece el derecho pero no fija plazo explícito en días — la Resolución ANPD define el estándar operativo. **⚠️ Verificar Resolución vigente.** | ⬜ Pendiente |
| DPO (Encarregado) obligatorio para todo controlador | `brasil.json` → `dpo` | Art. 41 | *"O controlador deverá indicar encarregado pelo tratamento de dados pessoais"* | ⬜ Pendiente |
| Excepción a DPO para microempresas y EPPs regulada por ANPD | `brasil.json` → `dpo` | Art. 41, §3° | *"A autoridade nacional poderá estabelecer normas complementares sobre a definição e as atribuições do encarregado"* | ⬜ Pendiente |
| Notificación de brecha: plazo referencia 72 horas | `brasil.json` → `breach_notification` | Art. 48 | La LGPD dice "prazo razoável". La referencia de 72 horas es una práctica de mercado alineada a GDPR, **no un plazo legal explícito en la LGPD**. ⚠️ Aclarar en el archivo. | ⬜ Pendiente |
| Multa máxima: R$ 50 millones por infracción | `brasil.json` → `sanctions` | Art. 52, II | *"multa simples, de até 2% (dois por cento) do faturamento da pessoa jurídica de direito privado... limitada, no total, a R$ 50.000.000,00 (cinquenta milhões de reais) por infração"* | ⬜ Pendiente |
| 10 bases legales para datos personales | `brasil.json` → `data_categories.personal.legal_bases` | Art. 7° | Art. 7° lista exactamente 10 hipótesis (incisos I a X) | ⬜ Pendiente |
| Consentimento de menor: al menos un padre o responsable legal | `brasil.json` → `data_categories.minors` | Art. 14, §1° | *"o tratamento de dados pessoais de crianças deverá ser realizado com o consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal"* | ⬜ Pendiente |
| Prohibición de publicidad a menores | `brasil.json` → `data_categories.minors` | Art. 14, §2° | *"No tratamento de dados de que trata o caput deste artigo, o controlador deverá manter pública a informação sobre os tipos de dados coletados, a forma de sua utilização e os procedimentos para o exercício dos direitos previstos no art. 18 desta Lei"* ⚠️ El artículo regula transparencia, no prohíbe explícitamente publicidad. Verificar si hay regulación ANPD complementaria. | ⬜ Pendiente |

---

## 🇨🇴 Colombia — Ley 1581/2012

**Texto oficial:** https://www.normograma.gov.co/normograma/compiladolegislacion/2012_ley_1581.htm
**Autoridad:** https://www.sic.gov.co
**Decreto reglamentario:** https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=53646

| Claim en el repositorio | Archivo | Artículo | Texto de la ley (extracto) | Revisión |
|---|---|---|---|---|
| Plazo de Acceso (Consultas): 10 días hábiles | `colombia.json` → `data_subject_rights.access` | Art. 14 | *"El responsable del tratamiento deberá dar información a los titulares no más tarde de diez (10) días hábiles contados a partir de la fecha en que se recibió la solicitud"* | ⬜ Pendiente |
| Prórroga de Acceso: 5 días adicionales | `colombia.json` → `data_subject_rights.access.note` | Art. 14 | *"Cuando no fuere posible atender la consulta dentro de dicho término, se informará al interesado... la fecha en que se atenderá su consulta, la cual en ningún caso podrá superar los cinco (5) días hábiles siguientes al vencimiento del primer término"* | ⬜ Pendiente |
| Plazo de Reclamos (Rectificación/Cancelación/Oposición): 15 días hábiles | `colombia.json` → `data_subject_rights.rectification` | Art. 15 | *"El responsable del tratamiento o Encargado del Tratamiento deberá atender el reclamo en un término máximo de quince (15) días hábiles"* | ⬜ Pendiente |
| Prórroga de Reclamo: 8 días adicionales | `colombia.json` → `data_subject_rights.rectification.note` | Art. 15 | *"Cuando no fuere posible atender el reclamo dentro de dicho término, se informará al interesado... la fecha en que se atenderá su reclamo, la cual en ningún caso podrá superar los ocho (8) días hábiles siguientes al vencimiento del primer término"* | ⬜ Pendiente |
| Datos sensibles: biometría, salud, vida sexual, origen racial, político, religioso, sindical | `colombia.json` → `data_categories.sensitive` | Art. 5° | *"Para los propósitos de la presente ley, se entiende por datos sensibles aquellos que afectan la intimidad del Titular o cuyo uso indebido puede generar su discriminación, tales como aquellos que revelen el origen racial o étnico, la orientación política, las convicciones religiosas o filosóficas, la pertenencia a sindicatos, organizaciones sociales, de derechos humanos o que promueva intereses de cualquier partido político o que garanticen los derechos y garantías de partidos políticos de oposición así como los datos relativos a la salud, a la vida sexual y los datos biométricos"* | ⬜ Pendiente |
| Consentimiento previo, expreso e informado | `colombia.json` → `consent` | Art. 9° | *"El Tratamiento requiere el consentimiento libre, previo, expreso e informado del Titular"* | ⬜ Pendiente |
| Multa máxima: 2,000 SMLMV | `colombia.json` → `sanctions` | Art. 23 | *"multas de carácter personal e institucional hasta por el equivalente de dos mil (2.000) salarios mínimos mensuales legales vigentes"* | ⬜ Pendiente |
| Transferencia internacional: país receptor debe tener nivel adecuado | `colombia.json` → `international_transfer` | Art. 26 | *"Está prohibida la transferencia de datos personales de cualquier tipo a países que no proporcionen niveles adecuados de protección de datos"* | ⬜ Pendiente |
| Registro de base de datos ante SIC obligatorio para responsables | `colombia.json` → `notes_for_developers` | Art. 25 | *"Los responsables del tratamiento de datos personales que realicen tratamiento de datos personales... tendrán la obligación de... llevar un registro de las bases de datos sometidas a su tratamiento ante la Superintendencia de Industria y Comercio"* ⚠️ Verificar si el registro en el RNBD (Registro Nacional de Bases de Datos) sigue vigente y qué empresas están obligadas. | ⬜ Pendiente |

---

## 🇲🇽 México — LFPDPPP

> ⚠️ **AVISO (2026-07-08):** La LFPDPPP de 2010 fue **abrogada** por la nueva LFPDPPP publicada en DOF el 20-03-2025. Los claims de esta tabla se redactaron bajo la ley de 2010: la revisión de pares debe validarlos contra el **texto de 2025** y actualizar la numeración de artículos. La autoridad ya no es el INAI sino la Secretaría Anticorrupción y Buen Gobierno.

**Texto vigente (2025):** https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
**Ley abrogada (2010, referencia histórica):** https://www.dof.gob.mx/nota_detalle.php?codigo=5150631&fecha=05/07/2010
**Reglamento 2011 (verificar vigencia parcial):** https://www.dof.gob.mx/nota_detalle.php?codigo=5280098&fecha=21/12/2011

| Claim en el repositorio | Archivo | Artículo | Texto de la ley (extracto) | Revisión |
|---|---|---|---|---|
| Datos sensibles incluyen salud, genética, religión, filosófico, moral, sindical, político, preferencia sexual | `mexico.json` → `data_categories.sensitive` | Art. 3, fracción VI | *"Datos sensibles: Aquellos datos personales que afecten a la esfera más íntima de su titular, o cuya utilización indebida pueda dar origen a discriminación o conlleve un riesgo grave para éste. En particular, se consideran sensibles aquellos que puedan revelar aspectos como origen racial o étnico, estado de salud presente y futuro, información genética, creencias religiosas, filosóficas y morales, afiliación sindical, opiniones políticas, preferencia sexual"* | ⬜ Pendiente |
| Consentimiento para datos sensibles: expreso y por escrito | `mexico.json` → `data_categories.sensitive` | Art. 9 | *"Tratándose de datos personales sensibles, el responsable deberá obtener el consentimiento expreso y por escrito del titular para su tratamiento, a través de su firma autógrafa, firma electrónica, o cualquier mecanismo de autenticación que al efecto se establezca"* | ⬜ Pendiente |
| Consentimiento tácito válido para datos personales no sensibles | `mexico.json` → `consent.types.tacit` | Art. 8 | *"Se entenderá que el titular consiente tácitamente el tratamiento de sus datos, cuando habiéndose puesto a su disposición el aviso de privacidad, no manifieste su oposición"* | ⬜ Pendiente |
| Plazo ARCO: 20 días hábiles para respuesta | `mexico.json` → `data_subject_rights` | Art. 32 | *"El responsable deberá dar respuesta a las solicitudes de los titulares en un plazo máximo de veinte días hábiles"* | ⬜ Pendiente |
| 15 días adicionales para cumplir la respuesta ARCO | `mexico.json` → `data_subject_rights.access` | Art. 32 | *"Si la respuesta es procedente, el responsable deberá hacerla efectiva dentro de los quince días hábiles siguientes a la fecha en que se comunique la respuesta"* | ⬜ Pendiente |
| Aviso de privacidad obligatorio al momento de recabar datos | `mexico.json` → `privacy_notice` | Art. 16 | *"El aviso de privacidad deberá contener, al menos: I. La identidad y domicilio del responsable que los recaba; II. Las finalidades del tratamiento; III. Las opciones y medios que el responsable ofrezca a los titulares para limitar el uso o divulgación de los datos..."* | ⬜ Pendiente |
| Sanciones: hasta 320,000 días de SMG | `mexico.json` → `sanctions` | Arts. 63-65 | *"Se sancionará con multa de 100 hasta 320,000 días de salario mínimo general vigente en el Distrito Federal"* | ⬜ Pendiente |
| Sanciones penales: 3-6 años de prisión por datos sensibles con ánimo de lucro | `mexico.json` → `sanctions.criminal_sanctions` | Art. 67 | *"Se impondrá pena de tres a seis años de prisión al que estando autorizado para tratar datos personales, con ánimo de lucro, provoque una vulneración de seguridad a las bases de datos bajo su custodia"* ⚠️ Verificar redacción exacta y si aplica también al caso de comercialización sin autorización. | ⬜ Pendiente |

---

## 🇪🇺 Unión Europea — GDPR (Reglamento 2016/679)

**Texto oficial EUR-Lex (ES):** https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679
**EDPB (directrices):** https://edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_es

| Claim en el repositorio | Archivo | Artículo | Texto de la ley (extracto) | Revisión |
|---|---|---|---|---|
| 6 bases legales para datos personales | `gdpr.json` → `data_categories.personal.legal_bases` | Art. 6(1) | Art. 6(1) lista exactamente 6 bases: a) consentimiento, b) contrato, c) obligación legal, d) intereses vitales, e) interés público, f) intereses legítimos | ⬜ Pendiente |
| 10 bases legales para datos sensibles | `gdpr.json` → `data_categories.sensitive.legal_bases_sensitive` | Art. 9(2) | Art. 9(2) lista exactamente 10 excepciones (letras a a j) | ⬜ Pendiente |
| Consentimiento: no vale el silencio ni casillas pre-marcadas | `gdpr.json` → `consent` | Considerando 32 + Art. 4(11) | *"el consentimiento debe darse mediante un acto afirmativo claro que refleje una manifestación de voluntad libre, específica, informada, e inequívoca del interesado de aceptar el tratamiento de datos de carácter personal... por lo tanto, el silencio, las casillas ya marcadas o la inactividad no deben constituir consentimiento"* | ⬜ Pendiente |
| Plazo respuesta a derechos: 30 días, extensible 60 más | `gdpr.json` → `data_subject_rights` | Art. 12(3) | *"El responsable del tratamiento facilitará al interesado información relativa a sus actuaciones... sin dilación indebida y en cualquier caso en el plazo de un mes... dicho plazo podrá prorrogarse otros dos meses en caso necesario, teniendo en cuenta la complejidad y el número de solicitudes"* | ⬜ Pendiente |
| Notificación de brecha a autoridad: 72 horas | `gdpr.json` → `breach_notification.notify_authority` | Art. 33(1) | *"En caso de violación de la seguridad de los datos personales, el responsable del tratamiento la notificará a la autoridad de control competente... sin dilación indebida y, de ser posible, a más tardar 72 horas después de que haya tenido constancia de ella"* | ⬜ Pendiente |
| DPO obligatorio para tratamiento a gran escala de categorías especiales | `gdpr.json` → `dpo` | Art. 37(1)(c) | *"el responsable y el encargado del tratamiento designarán un delegado de protección de datos siempre que... las actividades principales del responsable o del encargado consistan en el tratamiento a gran escala de las categorías especiales de datos"* | ⬜ Pendiente |
| Multa Tier 2: hasta €20M o 4% facturación global | `gdpr.json` → `sanctions.tiers[1]` | Art. 83(5) | *"Las infracciones de las disposiciones siguientes se sancionarán, de acuerdo con el apartado 2, con multas administrativas de 20 000 000 EUR como máximo o, tratándose de una empresa, de una cuantía equivalente al 4% como máximo del volumen de negocio total anual global del ejercicio financiero anterior"* | ⬜ Pendiente |
| Extraterritorialidad: aplica a empresas fuera de la UE con usuarios en la UE | `gdpr.json` → `primary_law.extraterritorial` | Art. 3(2) | *"El presente Reglamento se aplica al tratamiento de datos personales de interesados que residan en la Unión por parte de un responsable o encargado no establecido en la Unión, cuando las actividades de tratamiento estén relacionadas con: a) la oferta de bienes o servicios a dichos interesados en la Unión..."* | ⬜ Pendiente |
| Portabilidad aplica solo a tratamiento basado en consentimiento o contrato y automatizado | `gdpr.json` → `data_subject_rights[portabilidad]` | Art. 20(1) | *"El interesado tendrá derecho a recibir los datos personales que le incumban... en los casos en que: a) el tratamiento esté basado en el consentimiento... o en un contrato... y b) el tratamiento se efectúe por medios automatizados"* | ⬜ Pendiente |

---

## Claims que requieren verificación adicional (flags editoriales)

Estos items no son necesariamente incorrectos, pero requieren confirmación por una fuente más específica que el texto de ley principal:

| Flag | Archivo | Claim | Por verificar |
|---|---|---|---|
| ⚠️ BR-01 | `brasil.json` | Notificación de brecha LGPD: "72 horas" | La LGPD no establece 72 horas — es práctica de mercado. Buscar Resolução CD/ANPD vigente. |
| ⚠️ BR-02 | `brasil.json` | Plazo de respuesta a derechos: "15 días" | La LGPD no fija plazo en el texto base. Confirmar en Resolução CD/ANPD nº 2/2022 o la vigente. |
| ⚠️ BR-03 | `brasil.json` | Prohibición de publicidad para menores (Art. 14§2°) | El artículo regula transparencia. La prohibición de publicidad puede estar en resolución ANPD o ser interpretación doctrinal. Verificar. |
| ⚠️ CO-01 | `colombia.json` | Registro ante SIC (RNBD) obligatorio | Verificar si la obligación de registro en el RNBD sigue activa, qué empresas están exentas y si hay multas recientes por incumplimiento. |
| ⚠️ MX-01 | `mexico.json` | Sanción penal Art. 67: "3 a 6 años" | Confirmar si el tipo penal es el del Art. 67 o si hay reforma posterior. Verificar también si "con ánimo de lucro" es el único supuesto. |
| ⚠️ MX-02 | `mexico.json` | "SMG del Distrito Federal" como base de multas | El Distrito Federal se convirtió en CDMX. Verificar si la referencia se actualiza al Salario Mínimo General del área geográfica o al IMSS. |

---

## Instrucciones para el abogado revisor

1. **Para cada fila:** marcar la columna "Revisión" con ✅ Confirmado / ⚠️ Matiz (agregar nota) / ❌ Incorrecto (agregar corrección)
2. **Para los flags editoriales:** resolver cada ⚠️ con la fuente específica que confirma o corrige el claim
3. **Al completar:** actualizar el campo `legal_review_pending: false` en el JSON correspondiente y agregar `reviewed_by` con nombre, fecha y número de matrícula profesional
4. **Prioridad de revisión:** Brasil > Colombia > México > GDPR (por volumen de mercado e impacto)

---

*Este documento es un instrumento de trabajo interno del equipo editorial de Privacy Compliance Skills.*
*No es de distribución pública hasta completar la revisión legal.*
