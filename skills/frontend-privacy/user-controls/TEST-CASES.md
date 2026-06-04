# TEST-CASES — /frontend-privacy/user-controls

> Verificar estos casos antes de publicar cambios a la skill.  
> El score debe estar dentro de ±3 pts del esperado.

---

## U1 — Todo por email, sin portal

**Input:**
```
/frontend-privacy/user-controls "El usuario puede escribir a 
privacidad@empresa.com para pedir sus datos, descargarlos o eliminar 
su cuenta. No hay sección de privacidad en la app. Brasil."
```

**Cálculo esperado:**
- Ver datos por email (no autónomo) → +5
- Descarga manual → +5
- Eliminar por soporte → +5
- Revocar por email → +5
- Plazos no visibles → +5
- F_rigor = 1.25 (Brasil)
- Raw = 25 × 1.25 = 31.25 → **Score: 31 🔴**

**Hallazgos esperados:**
1. 🟡 Sin portal autónomo para ver datos (+5)
2. 🟡 Sin descarga autónoma (+5)
3. 🟡 Eliminación solo por soporte (+5)

---

## U2 — Portal parcial (ve y revoca, no descarga ni elimina)

**Input:**
```
/frontend-privacy/user-controls "En Configuración > Mi cuenta hay 
sección 'Mis datos' con resumen. Toggles de consentimiento activos. 
Sin opción de descarga de datos. Para eliminar la cuenta: escribir 
a soporte. Plazos de respuesta no visibles en la app. Colombia."
```

**Cálculo esperado:**
- Ver datos → 0 ✅ (sección accesible)
- Sin descarga → +10
- Eliminar solo por soporte → +5
- Revocación → 0 ✅ (toggles)
- Plazos no visibles → +5
- F_rigor = 1.00 (CO)
- Raw = 20 × 1.00 = 20 → **Score: 20 🟡**

---

## U3 — Borrado lógico (is_active = false)

**Input:**
```
/frontend-privacy/user-controls "El usuario puede ir a Configuración > 
Eliminar cuenta. Al confirmar, se ejecuta UPDATE users SET is_active = false. 
Los datos quedan en la base de datos. Sin mensaje al usuario de que sus 
datos no se borran. México."
```

**Cálculo esperado:**
- Ver datos → 0 (asumido, marcar supuesto)
- Descarga → 0 (asumido)
- is_active = false ≠ borrado real → +5
- Revocación → 0 (asumida)
- Sin comunicación de qué pasa con los datos → +5
- F_rigor = 1.00 (MX)
- Raw = 10 × 1.00 = 10 → **Score: 10 🟡**

**Nota obligatoria en output:** La skill debe señalar explícitamente que `is_active = false` no satisface el derecho de cancelación/supresión bajo Ley 1581, LGPD ni GDPR, que exigen borrado efectivo (con excepciones documentadas).

---

## U4 — Portal conforme (GDPR)

**Input:**
```
/frontend-privacy/user-controls "En Cuenta > Privacidad: 'Ver mis datos' 
con resumen detallado, 'Descargar mis datos' genera JSON completo con link 
válido 48h. 'Eliminar cuenta' muestra qué se elimina y qué se conserva 
con razón legal (5 años facturas), requiere contraseña para confirmar. 
Toggles de consentimiento revocables. Plazos visibles: 30 días GDPR. 
El usuario recibe email de confirmación con número de solicitud para 
seguimiento. Usuarios en España."
```

**Cálculo esperado:**
- Ver datos → 0 ✅
- Descarga → 0 ✅
- Eliminación → 0 ✅ (con comunicación de excepciones)
- Revocación → 0 ✅
- Plazos visibles + seguimiento → 0 ✅
- F_rigor = 1.25 (España = GDPR)
- Raw = 0 → **Score: 0 🟢**

---

## U5 — Fintech sin opción de eliminar cuenta (excepción regulatoria)

**Input:**
```
/frontend-privacy/user-controls "App fintech. Descarga de datos en CSV 
disponible. Ver datos en perfil. Sin opción de eliminar cuenta — la app 
no explica por qué. Revocación por email. Colombia y Chile."
```

**Cálculo esperado:**
- Ver datos → 0 ✅
- Descarga → 0 ✅
- Sin eliminación (sin explicación visible) → +10
- Revocación por email → +5
- Plazos no mencionados → +5
- F_rigor = 1.00
- Raw = 20 × 1.00 = 20 → **Score: 20 🟡**

**Nota esperada en output:** La obligación contable/fiscal puede justificar la conservación de ciertos datos, pero la app debe comunicarlo al usuario de forma visible. No ofrecer el flujo sin explicación es incumplimiento de transparencia.

---

## Criterio de éxito

| Criterio | Umbral |
|---|---|
| Score dentro de ±3 pts del esperado | 5/5 |
| U4 (conforme) sin falsos positivos | Sí |
| U3 señala que is_active=false no es borrado real | Sí |
| U5 distingue excepción regulatoria válida de incumplimiento de transparencia | Sí |
| U1 incluye plazos ARCO del país más exigente | Sí |
