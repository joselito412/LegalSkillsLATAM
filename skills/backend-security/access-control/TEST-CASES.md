# TEST-CASES — /backend-security/access-control

> Verificar estos casos antes de publicar cambios a la skill.  
> El score debe estar dentro de ±3 pts del esperado.

---

## A1 — Sin RBAC, sin logs (startup early-stage)

**Input:**
```
/backend-security/access-control "Todo el equipo (5 personas) tiene acceso 
al panel de admin y a la base de datos de producción. No hay logs de 
acceso a datos de usuarios. Sistema de historiales clínicos. Brasil."
```

**Cálculo esperado:**
- Sin RBAC → +15
- La app usa admin DB en producción → +10 (asumido, marcar supuesto)
- Sin logs → +15
- F_rigor = 1.25 (Brasil)
- Raw = (15 + 10 + 15) × 1.25 = 50 → **Score: 40 🚨** (cap)

**Hallazgos esperados:**
1. 🔴 Sin logs de acceso a datos (+15)
2. 🔴 Sin RBAC — todo el equipo con el mismo acceso (+15)
3. 🟡 Acceso con credenciales de admin en producción (+10)

---

## A2 — RBAC básico, logs parciales

**Input:**
```
/backend-security/access-control "Roles: admin y support. Support solo 
ve email y nombre — no datos de salud. Logs de errores (5xx) pero sin 
logs de accesos exitosos a datos. Retención de logs: 3 meses. Sin 
alertas automáticas. Colombia."
```

**Cálculo esperado:**
- RBAC básico → 0 (dos roles diferenciados, acceso restringido ✅)
- Mínimo privilegio → 0 ✅
- Logs parciales → +10 (solo errores, no accesos)
- Retención < 6 meses → +5
- Sin alertas → +5
- F_rigor = 1.00 (CO)
- Raw = 20 × 1.00 = 20 → **Score: 20 🟡**

**Acción #1:** Agregar logs de accesos exitosos a datos personales, no solo errores.

---

## A3 — Logs con datos sensibles en texto plano

**Input:**
```
/backend-security/access-control "El sistema tiene audit log. Los logs 
incluyen el diagnóstico médico del usuario en texto plano para facilitar 
debugging (ej: 'User 123 accessed: diabetes type 2'). Los logs son 
accesibles para todo el equipo de tech. Retención: 18 meses. Brasil."
```

**Cálculo esperado:**
- Logs existen → 0 (D3)
- Logs con datos sensibles en texto plano → +10
- Acceso a logs no restringido → +5 (mínimo privilegio violado)
- F_rigor = 1.25 (Brasil)
- Raw = 15 × 1.25 = 18.75 → **Score: 19 🟡**

**Nota de validación:** La skill debe identificar "diabetes type 2" en el log como dato sensible en texto plano, aunque aparezca dentro de una cadena de texto.

---

## A4 — Control de acceso conforme

**Input:**
```
/backend-security/access-control "Roles: support_l1 (email, nombre), 
support_l2 (+historial actividad), privacy_officer (ARCO), security 
(solo logs). Acceso a datos de salud requiere aprobación del Security Lead 
+ ticket. Logs inmutables en CloudTrail, 24 meses. Alertas en PagerDuty 
para exportaciones > 500 registros y accesos fuera de horario. México."
```

**Cálculo esperado:**
- RBAC completo → 0 ✅
- Mínimo privilegio + aprobación dual para sensibles → 0 ✅
- Logs completos + inmutables → 0 ✅
- Retención 24 meses → 0 ✅
- Alertas configuradas → 0 ✅
- F_rigor = 1.00 (MX)
- Raw = 0 → **Score: 0 🟢**

**Output esperado:** Sin hallazgos. No generar falsos positivos en sistema conforme.

---

## A5 — Post-incidente: sin trazabilidad

**Input:**
```
/backend-security/access-control "Ocurrió un acceso no autorizado a 
datos de 500 usuarios. No tenemos logs de acceso para determinar qué 
datos se vieron exactamente ni cuándo. Solo tenemos logs de error (404, 
500). Necesitamos saber qué reportar a la SIC. Colombia."
```

**Cálculo esperado:**
- Sin logs de acceso → +15
- F_rigor = 1.00 (CO)
- Raw = 15 × 1.00 = 15 → **Score: 15 🟡**

**Output adicional esperado:** La skill debe incluir una nota explícita fuera del box: "⚠️ Sin logs de acceso, no es posible determinar el alcance exacto de la brecha. Esto limita la capacidad de notificar correctamente a los 500 usuarios afectados y a la SIC. Ver `/derechos-usuario --pais CO` para los plazos de notificación."

---

## Criterio de éxito

| Criterio | Umbral |
|---|---|
| Score dentro de ±3 pts del esperado | 5/5 |
| A4 (conforme) no genera falsos positivos | Sí |
| A3 detecta datos sensibles en texto de logs | Sí |
| A5 incluye nota de impacto en notificación de brecha | Sí |
| A1 identifica falta de logs como hallazgo #1 | Sí |
