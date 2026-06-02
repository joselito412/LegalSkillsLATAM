# Casos de prueba: /audit

> Usar estos casos para verificar consistencia de la skill antes de publicar cada versión.
> El score de /audit debe estar dentro de ±5 puntos del score que daría /risk-score con los mismos inputs.

---

## T1 — App de salud, LATAM estándar, sin cumplimiento

**Input de prueba:**
```
/audit "App de telemedicina que guarda diagnósticos médicos y recetas. 
Opera en Colombia y México. Usamos Firebase. No tenemos política de 
privacidad ni canal ARCO. Los usuarios aceptan un checkbox único al registrarse."
```

**Cálculo esperado:**
- C_base = 80 (salud)
- Penalizadores: sin consentimiento granular (+15), servidores Firebase sin SCCs (+20), sin política (+10), sin ARCO (+10) = +55
- F_rigor = 1.00 (CO + MX)
- Raw = (80 + 55) × 1.00 = 135 → **Score: 100**

**Hallazgos esperados (top 3):**
1. 🔴 Servidores en EE.UU. sin garantías documentadas (+20)
2. 🟡 Sin consentimiento granular por finalidad (+15)
3. 🟡 Sin política de privacidad publicada (+10)

**Acciones esperadas:**
1. Firmar DPA con Google (Firebase) o migrar a región sa-east-1
2. Reemplazar checkbox único por toggles de consentimiento por finalidad

**Cara esperada:** 🚨 | **Nivel:** 🔴 CRÍTICO

---

## T2 — E-commerce básico, México, cumplimiento parcial

**Input de prueba:**
```
/audit "Tienda online de ropa. Guardamos email, nombre y dirección de envío.
Opera solo en México. AWS us-east-1. Tenemos política de privacidad publicada.
No tenemos canal ARCO formal. Usamos Stripe para pagos y Mailchimp para emails."
```

**Cálculo esperado:**
- C_base = 40 (personal general: email, nombre, dirección)
- Penalizadores: sin consentimiento granular (+15, asumido), servidores EE.UU. sin SCCs (+20), transferencia Stripe sin DPA mencionado (+15), transferencia Mailchimp sin DPA (+15, misma categoría → un solo +15), sin ARCO (+10) = +60
- F_rigor = 1.00 (MX)
- Raw = (40 + 60) × 1.00 = 100 → **Score: 100**

> Nota: aunque política de privacidad existe (ítem ① en Q5), los demás penalizadores dominan.

**Hallazgos esperados (top 3):**
1. 🔴 Servidores en EE.UU. sin garantías documentadas (+20)
2. 🟡 Transferencia a Stripe/Mailchimp sin DPA firmado (+15)
3. 🟡 Sin consentimiento granular (+15)

**Cara esperada:** 🚨 | **Nivel:** 🔴 CRÍTICO

---

## T3 — Blog corporativo, baja complejidad

**Input de prueba:**
```
/audit "Blog de contenidos B2B. Solo recopilamos email para newsletter.
Opera en Argentina. Servidores en DigitalOcean Nueva York. 
Tenemos política de privacidad y un formulario de contacto para solicitudes.
No usamos analytics externos."
```

**Cálculo esperado:**
- C_base = 40 (email)
- Penalizadores: sin consentimiento granular (+15, asumido — newsletter sin opt-in explícito), servidores NY sin SCCs (+20), sin ARCO formal (formulario de contacto puede interpretarse como canal → +0 o +10 según interpretación) = +35 a +45
- F_rigor = 1.00 (AR)
- Raw = (40 + 35) × 1.00 = 75 → **Score: 75** (o hasta 85 si sin ARCO formal)

**Hallazgos esperados (top 3):**
1. 🔴 Servidores en EE.UU. sin garantías documentadas (+20)
2. 🟡 Sin consentimiento granular para newsletter (+15)
3. 🟡 Canal ARCO no documentado formalmente (+10)

**Cara esperada:** 😰 | **Nivel:** 🔴 ALTO

**Nota de validación:** Este caso verifica que la skill NO asume automáticamente cumplimiento cuando el usuario menciona tener política de privacidad, pero sí lo registra correctamente como ítem presente.

---

## T4 — SaaS RRHH, Colombia + Brasil, sin cumplimiento

**Input de prueba:**
```
/audit "SaaS de gestión de recursos humanos. Procesamos datos laborales,
historial de salud ocupacional y evaluaciones de desempeño. Opera en 
Colombia y Brasil. AWS sa-east-1. No hemos definido DPO ni base legal 
formal para cada finalidad. Sin política de privacidad."
```

**Cálculo esperado:**
- C_base = 80 (salud ocupacional)
- Penalizadores: sin consentimiento granular (+15), servidores sa-east-1 (+0 — en Brasil), sin política (+10), sin ARCO (+10), sin DPO en Brasil (+15), sin base legal por finalidad en Brasil (+20) = +70
- F_rigor = 1.25 (Brasil)
- Raw = (80 + 70) × 1.25 = 187.5 → **Score: 100**

**Hallazgos esperados (top 3):**
1. 🔴 Sin base legal documentada por finalidad (LGPD Art. 7/11) (+20)
2. 🔴 Sin DPO/Encarregado designado (LGPD Art. 41) (+15)
3. 🟡 Sin consentimiento granular por finalidad (+15)

**Cara esperada:** 🚨 | **Nivel:** 🔴 CRÍTICO

**Nota de validación:** Verificar que el multiplicador ×1.25 aparezca en el desglose y que los penalizadores específicos de LGPD (DPO, base legal) sean activados correctamente por la presencia de Brasil.

---

## T5 — App educativa para niños, Chile

**Input de prueba:**
```
/audit "App de aprendizaje para niños de 6 a 12 años. Recopilamos nombre, 
edad y progreso académico. Login con Google. Opera en Chile. 
Servidores en GCP us-central1. Tenemos política de privacidad pero no 
procedimiento ARCO ni contratos con proveedores."
```

**Cálculo esperado:**
- C_base = 80 (menores → FLAG_MINORS)
- Penalizadores: menores confirmados (+30), sin consentimiento granular (+15), servidores GCP EE.UU. sin SCCs (+20), login con Google sin DPA (+15), sin ARCO (+10) = +90
- F_rigor = 1.00 (CL)
- Raw = (80 + 90) × 1.00 = 170 → **Score: 100**

**Hallazgos esperados (top 3):**
1. 🔴 Datos de menores de edad — FLAG prioritario (+30)
2. 🔴 Servidores en EE.UU. sin garantías documentadas (+20)
3. 🟡 Login con Google sin DPA firmado (+15)

**Cara esperada:** 🚨 | **Nivel:** 🔴 CRÍTICO

**Nota de validación:** Verificar que FLAG_MINORS fuerce la aparición de "datos de menores" como hallazgo #1 independientemente del orden de puntajes, y que la acción #1 sea específicamente sobre el proceso de consentimiento parental.

---

## Criterio de éxito global

La skill `/audit` pasa el testing si:

| Criterio | Umbral |
|---|---|
| Score dentro de ±5 puntos del esperado | 5/5 casos |
| Hallazgo #1 coincide con el esperado | 5/5 casos |
| FLAG_MINORS aparece como #1 en T5 | Sí |
| Penalizadores LGPD activados en T4 | Sí (DPO + base legal) |
| Output cabe en ≤ 400 tokens | 5/5 casos |
| Sin preguntas adicionales cuando el input es completo | T1, T4, T5 |
| Supuestos marcados explícitamente | T2 (AWS región), T3 (consentimiento newsletter) |
