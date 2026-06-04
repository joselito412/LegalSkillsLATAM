import type { DataCategory } from "./scorer.js";

interface ClassificationResult {
  category: DataCategory;
  baseScore: number;
  reason: string;
  flags: string[];
}

const SENSITIVE_SIGNALS = [
  "salud", "health", "diagnos", "médico", "medico", "clínico", "clinico",
  "prescripción", "prescripcion", "receta", "historial", "enfermedad",
  "biometr", "huella", "facial", "iris", "voz", "genétic", "genetic", "adn", "dna",
  "menor", "niño", "nino", "infante", "escolar", "guardería", "guarderia",
  "religión", "religion", "político", "politico", "sindical", "racial",
  "étnico", "etnico", "sexual", "orientación", "orientacion", "ideología", "ideologia",
  "antecedente", "judicial", "penal", "condena",
  "migratorio", "migrante", "refugiado", "visa",
];

const PERSONAL_SIGNALS = [
  "email", "correo", "teléfono", "telefono", "nombre", "dirección", "direccion",
  "ip", "cookie", "gps", "geoloc", "location", "device", "fingerprint",
  "curp", "cédula", "cedula", "cpf", "dni", "pasaporte", "passport",
  "tarjeta", "cuenta", "iban", "pago", "payment", "stripe",
  "usuario", "user", "login", "contraseña", "contrasena", "password",
  "fecha de nacimiento", "birth", "edad", "age",
];

export function classifyText(text: string): ClassificationResult {
  const lower = text.toLowerCase();
  const flags: string[] = [];

  for (const signal of SENSITIVE_SIGNALS) {
    if (lower.includes(signal)) flags.push(signal);
  }

  if (flags.length > 0) {
    return {
      category: "sensitive",
      baseScore: 80,
      reason: `Contiene señales de datos sensibles: ${flags.slice(0, 3).join(", ")}`,
      flags,
    };
  }

  const personalFlags: string[] = [];
  for (const signal of PERSONAL_SIGNALS) {
    if (lower.includes(signal)) personalFlags.push(signal);
  }

  if (personalFlags.length > 0) {
    return {
      category: "personal_general",
      baseScore: 40,
      reason: `Contiene datos de identificación personal: ${personalFlags.slice(0, 3).join(", ")}`,
      flags: personalFlags,
    };
  }

  return {
    category: "public",
    baseScore: 10,
    reason: "No se detectaron señales de datos personales ni sensibles",
    flags: [],
  };
}

export function categoryLabel(cat: DataCategory): string {
  const labels: Record<DataCategory, string> = {
    public: "Público",
    personal_general: "Personal General",
    sensitive: "Sensible",
  };
  return labels[cat];
}
