# TEST-CASES — /backend-security/data-protection

> Verificar estos casos antes de publicar cambios a la skill.  
> El score debe estar dentro de ±3 pts del esperado.

---

## D1 — Datos de salud sin cifrado, sin DPA, claves en código

**Input:**
```
/backend-security/data-protection "Tabla diagnoses(user_id, diagnosis TEXT, 
medication TEXT). AWS us-east-1 sin DPA firmado. Clave de cifrado 
HEALTH_KEY = 'mi-secreto' hardcodeada en utils.py. Sin política de 
retención. Colombia y Brasil."
```

**Cálculo esperado:**
- C_base = 80 (salud)
- Sin cifrado columna → +10
- Clave en código → +15
- Sin DPA (transferencia BR) → +20 (aplica el penalizador más severo: sin mecanismo para BR/UE)
- Sin retención → +10
- F_rigor = 1.25 (Brasil)
- Raw = (80 + 10 + 15 + 20 + 10) × 1.25 = 168.75 → **Score: 50 🚨** (cap)

**Hallazgos esperados (top 3):**
1. 🔴 Clave de cifrado hardcodeada en código fuente (+15)
2. 🔴 Servidores/transferencia sin DPA para Brasil (+20)
3. 🟡 Datos sensibles sin cifrado a nivel de columna (+10)

---

## D2 — E-commerce compliant

**Input:**
```
/backend-security/data-protection "users(email, password_hash bcrypt-12, 
full_name, address). AWS us-east-1 con DPA firmado y SCCs para UE. 
Claves en AWS KMS. Retención 2 años con purga automática semanal. 
Solo Colombia."
```

**Cálculo esperado:**
- C_base = 40 (personal general)
- Cifrado → 0 (bcrypt OK, campos no sensibles en disco = OK)
- KMS → 0 ✅
- Retención → 0 ✅
- DPA → 0 (DPA + SCCs firmados ✅)
- F_rigor = 1.00 (CO)
- Raw = (40 + 0) × 1.00 = 40 → **Score: 40 🟡**

**Nota:** C_base=40 representa el riesgo inherente del dato personal. Sin penalizadores activos — el 🟡 es por el tipo de dato, no por mala implementación. La skill debe comunicar esta distinción.

---

## D3 — Claves hardcodeadas y sin TLS interno

**Input:**
```
/backend-security/data-protection "API de salud. SECRET_KEY = 'abc123' en 
settings.py en el repo de Git. Las APIs internas entre microservicios usan 
HTTP (no HTTPS). Datos de diagnósticos en texto plano. México."
```

**Cálculo esperado:**
- C_base = 80 (salud)
- Sin TLS interno → +15
- Clave en repo → +15
- Sin cifrado columna → +10
- F_rigor = 1.00 (MX)
- Raw = (80 + 15 + 15 + 10) × 1.00 = 120 → **Score: 50 🚨** (cap)

**Acción #1 esperada:** Rotar la clave inmediatamente y moverla a AWS Secrets Manager o variable de entorno del servidor. Revocar acceso al repositorio a quienes lo hayan visto.

---

## D4 — Sistema BE conforme (GDPR)

**Input:**
```
/backend-security/data-protection "Datos personales (email, nombre, IP). 
AWS eu-west-1 con DPA y en Data Privacy Framework. AES-256 para campos de 
tarjeta (solo últimos 4 dígitos almacenados, sin CVV). Claves en AWS KMS 
con rotación anual. Retención 18 meses + purga semanal. Usuarios en España."
```

**Cálculo esperado:**
- C_base = 40 (personal general)
- Todo en orden → 0 penalizadores
- F_rigor = 1.25 (España = GDPR)
- Raw = 40 × 1.25 = 50 → **Score: 50 🟡**

**Nota de validación:** Score de 50 por C_base × F_rigor. No hay penalizadores activos. La skill debe confirmar que no hay hallazgos y que el score refleja el riesgo inherente del dato bajo GDPR, no incumplimientos.

---

## D5 — Datos de menores sin validación técnica

**Input:**
```
/backend-security/data-protection "App educativa para estudiantes de 
secundaria. Guardamos email y progreso académico. Sin validación técnica 
de edad en el backend. Datos de menores procesados igual que adultos. 
Google Analytics integrado. Colombia y Chile."
```

**Cálculo esperado:**
- C_base = 80 (menores = base 80 + penalizador adicional de menores en backend)
- Sin validación técnica de edad → +15 (FLAG_MINORS activado)
- GA sin DPA → +15 (transferencia sin cláusulas)
- F_rigor = 1.00 (CO+CL)
- Raw = (80 + 15 + 15) × 1.00 = 110 → **Score: 50 🚨** (cap)

---

## D6 — Sin política de retención (caso común en startups)

**Input:**
```
/backend-security/data-protection "SaaS B2B con datos personales de empleados 
(email corporativo, nombre, cargo). AWS us-east-1 con DPA. bcrypt para 
contraseñas. TLS 1.3. KMS para secretos. Pero no tenemos política de 
retención — los datos se conservan indefinidamente. Colombia."
```

**Cálculo esperado:**
- C_base = 40 (personal general)
- Sin retención → +10
- F_rigor = 1.00
- Raw = (40 + 10) × 1.00 = 50 → **Score: 50 🟡**

**Nota:** La skill debe diferenciar claramente que la mayoría del score viene del C_base (40) y que el único penalizador activo (+10) es la retención. Acción priorizada: documentar política de retención.

---

## Criterio de éxito

| Criterio | Umbral |
|---|---|
| Score dentro de ±3 pts del esperado | 6/6 |
| D1 detecta clave hardcodeada como hallazgo #1 | Sí |
| D2 y D4 (conformes) comunican C_base sin confundir con incumplimientos | Sí |
| D5 activa FLAG_MINORS con penalizador de BE | Sí |
| D3 incluye acción de rotación de clave inmediata | Sí |
