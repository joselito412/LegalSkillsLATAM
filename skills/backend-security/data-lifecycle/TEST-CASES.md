# TEST-CASES — /backend-security/data-lifecycle

> Verificar estos casos antes de publicar cambios a la skill.  
> El score debe estar dentro de ±3 pts del esperado.

---

## L1 — Sin política, sin purga, backups sin cifrar

**Input:**
```
/backend-security/data-lifecycle "Startup SaaS lanzada en 2022. Guardamos 
datos de usuarios desde el inicio sin eliminar nada. Sin política de 
retención. Backups diarios en S3 pero sin cifrado. Colombia."
```

**Cálculo esperado:**
- Sin política → +10
- Sin purga → +10
- Backups sin cifrado → +5
- F_rigor = 1.00 (CO)
- Raw = 25 × 1.00 = 25 → **Score: 25 🔴**

**Hallazgos esperados:**
1. 🔴 Sin política de retención (+10)
2. 🔴 Sin proceso de purga (+10)
3. 🟡 Backups sin cifrado (+5)

---

## L2 — Política parcial, purga manual

**Input:**
```
/backend-security/data-lifecycle "Política: conservamos datos 2 años 
desde la última actividad. La purga es manual — un dev la ejecuta 
trimestralmente cuando se acuerda. Backups cifrados en S3, recovery 
drill anual. México."
```

**Cálculo esperado:**
- Política genérica (plazo pero sin diferenciación por categoría) → +5
- Purga manual → +5
- Backups OK → 0
- F_rigor = 1.00 (MX)
- Raw = 10 × 1.00 = 10 → **Score: 10 🟡**

**Nota de validación:** La skill debe señalar que la purga manual es un riesgo operativo — si el dev olvida ejecutarla, el sistema está en incumplimiento.

---

## L3 — Sistema de salud con LGPD sin plan de incidentes

**Input:**
```
/backend-security/data-lifecycle "App de telemedicina. Política de 
retención documentada por categoría. Job automático de purga semanal 
con alertas de fallo en Slack. Backups cifrados con KMS, en región 
separada, recovery drill semestral. Sin plan de respuesta a incidentes. 
Brasil."
```

**Cálculo esperado:**
- Política completa → 0
- Purga automática con alertas → 0
- Backups OK → 0
- Sin plan de incidentes (F_rigor=1.25 activa D5) → +10
- F_rigor = 1.25 (Brasil)
- Raw = 10 × 1.25 = 12.5 → **Score: 13 🟡**

**Acción esperada:** Crear plan de respuesta a incidentes con roles, árbol de decisión de notificación a la ANPD y plantillas de comunicación.

---

## L4 — Ciclo de vida conforme (multi-país)

**Input:**
```
/backend-security/data-lifecycle "SaaS B2B. Política: datos activos = 
duración del servicio, inactivos = 18 meses, logs = 12 meses activos + 
archive 24 meses, datos financieros = 7 años. Job Lambda lunes 02:00 
con alertas PagerDuty. Anonimización con k-anonymity antes de análisis. 
Backups S3 cifrados AES-256, región separada, recovery drill trimestral 
con resultado documentado. Plan de incidentes con simulacro realizado. 
Colombia y Brasil."
```

**Cálculo esperado:**
- Política completa por categoría → 0 ✅
- Purga automática, monitoreada → 0 ✅
- Anonimización documentada → 0 ✅
- Backups completos → 0 ✅
- Plan de incidentes probado → 0 ✅
- F_rigor = 1.25 (Brasil)
- Raw = 0 → **Score: 0 🟢**

---

## L5 — Backups accesibles sin auth adicional

**Input:**
```
/backend-security/data-lifecycle "Backups en S3 cifrados con KMS. 
Bucket accesible para cualquier developer con credenciales AWS del 
equipo — sin política de acceso restringida a los backups. Sin 
recovery drill documentado. Datos de salud. Ecuador."
```

**Cálculo esperado:**
- Política asumida (no mencionada) → +5 (marcar supuesto)
- Backups con acceso no restringido → +5
- Sin recovery drill → +5
- F_rigor = 1.25 (Ecuador = LOPDP)
- Raw = 15 × 1.25 = 18.75 → **Score: 19 🟡** (asumiendo política como supuesto)

---

## Criterio de éxito

| Criterio | Umbral |
|---|---|
| Score dentro de ±3 pts del esperado | 5/5 |
| L4 (conforme) sin falsos positivos | Sí |
| L2 señala el riesgo operativo de purga manual | Sí |
| L3 activa D5 solo cuando F_rigor = 1.25 | Sí |
| L5 marca supuesto de política no mencionada | Sí |
