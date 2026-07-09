export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export const defaultLang = 'es';

export const showDefaultLang = false;

export const ui = {
  es: {
    // Nav
    'nav.docs': 'Docs',
    'nav.risk': 'Risk Score',
    'nav.regions': 'Regiones',
    'nav.contribute': 'Contribuir',
    'nav.github': 'GitHub',

    // Disclaimer banner
    'banner.disclaimer':
      'Guía metodológica y operativa. No constituye ni sustituye asesoría jurídica profesional.',

    // Hero
    'hero.badge': 'regions: ["UE", "USA", "LATAM"] // protection: isolated',
    'hero.title': 'Compliance-as-Code para privacidad',
    'hero.subtitle':
      'Paquete de herramientas de cumplimiento de privacidad para desarrolladores y startups. Clasifica datos, evalúa el riesgo legal y compara las leyes de la UE, EE.UU. y LATAM — desde el código.',
    'hero.cta_install': 'Instalar en Claude',
    'hero.cta_github': 'Ver en GitHub',
    'hero.term_title': 'privacy-compliance-skills — auditoría',
    'hero.term_cmd': '/audit "app de salud con video y pagos en California, España y Colombia"',
    'hero.term_out1': '▸ Clasificando datos… diagnósticos médicos → SENSIBLE',
    'hero.term_out2': '▸ Bloques aplicables: 🇺🇸 CCPA/CPRA · 🇪🇺 GDPR · 🇨🇴 Ley 1581',
    'hero.term_score': 'Legal Risk Score: 82 / 100',
    'hero.term_verdict': '🔴 ALTO — auditoría legal humana obligatoria',

    // Formats
    'formats.eyebrow': 'La trinidad del proyecto',
    'formats.title': 'Un estándar, tres formatos',
    'formats.subtitle':
      'El mismo conocimiento normativo, servido a cada tipo de consumidor.',
    'formats.humans_title': '📄 Para Humanos',
    'formats.humans_target': 'Abogados, devs, CTOs',
    'formats.humans_tech': 'Matrices y checklists en Markdown',
    'formats.ai_title': '🤖 Para IA',
    'formats.ai_target': 'Claude y otros LLMs',
    'formats.ai_tech': 'Skills instalables',
    'formats.machines_title': '⚙️ Para Máquinas',
    'formats.machines_target': 'APIs, CI/CD',
    'formats.machines_tech': 'Reglas JSON validadas',

    // Risk
    'risk.eyebrow': 'El motor',
    'risk.title': 'El Legal Risk Score',
    'risk.subtitle':
      'Un algoritmo que sitúa el riesgo legal de cualquier sistema en una escala de 0 a 100. F_rigor se calibra por bloque regulatorio: la UE es el techo, EE.UU. escala con el número de estados, LATAM es la base.',
    'risk.low_range': '0 – 30 pts',
    'risk.low_label': 'Bajo',
    'risk.low_desc': 'Datos públicos o básicos. Autogestión posible.',
    'risk.mid_range': '31 – 70 pts',
    'risk.mid_label': 'Medio',
    'risk.mid_desc': 'Datos personales. Medidas técnicas estrictas requeridas.',
    'risk.high_range': '71 – 100 pts',
    'risk.high_label': 'Alto',
    'risk.high_desc': 'Datos sensibles o mercados regulados. Auditoría legal humana obligatoria.',

    // Pillars
    'pillars.eyebrow': 'Arquitectura',
    'pillars.title': 'Dos pilares: Frontend y Backend',
    'pillars.rule': 'Si el usuario lo ve → Frontend. Si el sistema lo hace por dentro → Backend.',
    'pillars.fe_title': 'Frontend',
    'pillars.fe_sub': 'UX · Consentimiento · Transparencia',
    'pillars.fe_scope': 'Lo que el usuario ve, toca o decide.',
    'pillars.fe_owner': 'PM + UX + Abogado de privacidad',
    'pillars.be_title': 'Backend',
    'pillars.be_sub': 'Seguridad técnica · Arquitectura',
    'pillars.be_scope': 'La protección interna de los datos.',
    'pillars.be_owner': 'CTO + Security Lead + Abogado de data governance',

    // Regions
    'regions.eyebrow': 'Cobertura',
    'regions.title': 'Tres bloques regulatorios',
    'regions.subtitle': 'Honestos sobre la profundidad real de cada bloque hoy.',
    'regions.eu_status': 'GDPR — nivel producción',
    'regions.us_status': 'CCPA/CPRA + ~20 leyes estatales — en construcción',
    'regions.latam_status': '7 países con reglas propias — consolidado',
    'regions.level_own': 'Reglas propias',
    'regions.level_matrix': 'Matriz comparativa',
    'regions.level_progress': 'En construcción',

    // Callout
    'callout.eyebrow': 'Llamado abierto',
    'callout.title': 'Buscamos colaboradores legales',
    'callout.body':
      'El motor técnico está consolidado, pero la autoridad normativa se construye en comunidad. Si eres abogado/a de protección de datos, académico/a o profesional de legal-tech en LATAM, la UE o EE.UU., tu perspectiva es crucial. No necesitas programar: las matrices están en Markdown legible.',
    'callout.cta': 'Unirse como colaborador en GitHub',

    // Footer
    'footer.tagline': 'Cerrando la brecha entre el código y el cumplimiento de privacidad.',
    'footer.disclaimer':
      'Este proyecto es una guía informativa. No constituye ni sustituye asesoría jurídica especializada.',
    'footer.license': 'Licencia MIT',
  },
  en: {
    'nav.docs': 'Docs',
    'nav.risk': 'Risk Score',
    'nav.regions': 'Regions',
    'nav.contribute': 'Contribute',
    'nav.github': 'GitHub',

    'banner.disclaimer':
      'Methodological and operational guide. It does not constitute or replace professional legal advice.',

    'hero.badge': 'regions: ["EU", "US", "LATAM"] // protection: isolated',
    'hero.title': 'Compliance-as-Code for privacy',
    'hero.subtitle':
      'A privacy-compliance toolkit for developers and startups. Classify data, score legal risk, and compare EU, US, and LATAM law — straight from your code.',
    'hero.cta_install': 'Install in Claude',
    'hero.cta_github': 'View on GitHub',
    'hero.term_title': 'privacy-compliance-skills — audit',
    'hero.term_cmd': '/audit "health app with video and payments in California, Spain and Colombia"',
    'hero.term_out1': '▸ Classifying data… medical diagnoses → SENSITIVE',
    'hero.term_out2': '▸ Applicable blocks: 🇺🇸 CCPA/CPRA · 🇪🇺 GDPR · 🇨🇴 Ley 1581',
    'hero.term_score': 'Legal Risk Score: 82 / 100',
    'hero.term_verdict': '🔴 HIGH — human legal audit mandatory',

    'formats.eyebrow': 'The project trinity',
    'formats.title': 'One standard, three formats',
    'formats.subtitle': 'The same regulatory knowledge, served to each kind of consumer.',
    'formats.humans_title': '📄 For Humans',
    'formats.humans_target': 'Lawyers, devs, CTOs',
    'formats.humans_tech': 'Markdown matrices and checklists',
    'formats.ai_title': '🤖 For AI',
    'formats.ai_target': 'Claude and other LLMs',
    'formats.ai_tech': 'Installable skills',
    'formats.machines_title': '⚙️ For Machines',
    'formats.machines_target': 'APIs, CI/CD',
    'formats.machines_tech': 'Validated JSON rules',

    'risk.eyebrow': 'The engine',
    'risk.title': 'The Legal Risk Score',
    'risk.subtitle':
      'An algorithm that places the legal risk of any system on a 0–100 scale. F_rigor is calibrated per regulatory block: the EU is the ceiling, the US scales with the number of states, LATAM is the baseline.',
    'risk.low_range': '0 – 30 pts',
    'risk.low_label': 'Low',
    'risk.low_desc': 'Public or basic data. Self-service possible.',
    'risk.mid_range': '31 – 70 pts',
    'risk.mid_label': 'Medium',
    'risk.mid_desc': 'Personal data. Strict technical measures required.',
    'risk.high_range': '71 – 100 pts',
    'risk.high_label': 'High',
    'risk.high_desc': 'Sensitive data or regulated markets. Human legal audit mandatory.',

    'pillars.eyebrow': 'Architecture',
    'pillars.title': 'Two pillars: Frontend and Backend',
    'pillars.rule': 'If the user sees it → Frontend. If the system does it internally → Backend.',
    'pillars.fe_title': 'Frontend',
    'pillars.fe_sub': 'UX · Consent · Transparency',
    'pillars.fe_scope': 'What the user sees, touches, or decides.',
    'pillars.fe_owner': 'PM + UX + Privacy lawyer',
    'pillars.be_title': 'Backend',
    'pillars.be_sub': 'Technical security · Architecture',
    'pillars.be_scope': 'The internal protection of data.',
    'pillars.be_owner': 'CTO + Security Lead + Data-governance lawyer',

    'regions.eyebrow': 'Coverage',
    'regions.title': 'Three regulatory blocks',
    'regions.subtitle': 'Honest about the real depth of each block today.',
    'regions.eu_status': 'GDPR — production grade',
    'regions.us_status': 'CCPA/CPRA + ~20 state laws — under construction',
    'regions.latam_status': '7 countries with own rules — consolidated',
    'regions.level_own': 'Own rules',
    'regions.level_matrix': 'Comparative matrix',
    'regions.level_progress': 'Under construction',

    'callout.eyebrow': 'Open call',
    'callout.title': "We're looking for legal collaborators",
    'callout.body':
      "The technical engine is consolidated, but normative authority is built in community. If you're a data-protection lawyer, an academic, or a legal-tech professional in LATAM, the EU, or the US, your perspective is crucial. You don't need to code: the matrices are in readable Markdown.",
    'callout.cta': 'Join as a collaborator on GitHub',

    'footer.tagline': 'Closing the gap between code and privacy compliance.',
    'footer.disclaimer':
      'This project is an informational guide. It does not constitute or replace specialized legal advice.',
    'footer.license': 'MIT License',
  },
} as const;
