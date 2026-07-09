# Matriz: Consentimiento por Jurisdicción
**Pilar: Frontend (UX / UI / Consentimiento)**

> **Privacy Compliance Skills** — Guía de referencia. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Pendiente validación por abogado especialista por jurisdicción

---

## Tabla comparativa de requisitos de consentimiento

| Dimensión | 🇧🇷 Brasil (LGPD) | 🇨🇴 Colombia (Ley 1581) | 🇲🇽 México (LFPDPPP) | 🇪🇺 GDPR | 🇨🇱 Chile (Ley 21.719) |
|---|---|---|---|---|---|
| **Forma** | Inequívoco (no solo silencio) | Previo, expreso e informado | Expreso para datos sensibles; tácito admitido para datos personales no sensibles | Libre, específico, informado e inequívoco | Expreso e informado |
| **Granularidad** | Por finalidad (Art. 8) | Por finalidad declarada | Por finalidad (aviso integral) | Por finalidad y categoría — bundled no válido | Por finalidad |
| **Pre-marcado** | ❌ No permitido | ❌ No permitido | ❌ No permitido (datos sensibles) | ❌ No permitido | ❌ No permitido |
| **Consentimiento tácito** | ❌ No válido | ❌ No válido | ⚠️ Solo para datos personales no sensibles | ❌ No válido | ❌ No válido |
| **Revocación** | ✅ Obligatoria, facilitada y gratuita (Art. 8.5) | ✅ En cualquier momento | ✅ Mecanismos sencillos y gratuitos | ✅ Tan fácil como otorgarlo | ✅ Obligatoria |
| **Registro** | ✅ Responsable debe demostrar que se obtuvo | ✅ Debe conservarse la autorización | ✅ Responsable debe evidenciar el consentimiento | ✅ Responsable debe poder demostrar el consentimiento | ✅ Documentado |
| **Datos sensibles** | Consentimiento específico y destacado (Art. 11) | Autorización explícita (Art. 6) | Expreso y por escrito (Art. 9) | Explícito (Art. 9.2.a) | Explícito |
| **Menores** | Consentimiento del responsable legal (Art. 14) | Representante legal, menor < 18 | Padre/madre/tutor (< 18) | Titular de patria potestad (< 16, mínimo 13) | Representante legal |
| **Re-consentimiento** | Si cambia la finalidad del tratamiento | Si hay cambio material en la autorización | Cuando cambien las condiciones del aviso de privacidad | Si cambia la finalidad — base anterior inválida | Si hay cambios materiales |

---

## Validez del consentimiento por tipo de checkbox

| Tipo de checkbox | Brasil | Colombia | México | GDPR | ¿Usar? |
|---|---|---|---|---|---|
| ✅ Checkbox vacío, el usuario lo marca | Válido | Válido | Válido | Válido | ✅ Siempre |
| ❌ Checkbox pre-marcado, el usuario puede desmarcar | Inválido | Inválido | Inválido (sensibles) | Inválido | ❌ Nunca |
| ⚠️ "Al continuar usando el servicio, acepta..." | No válido para datos sensibles | No válido | Solo datos no sensibles | No válido | ❌ Evitar |
| ✅ Acción positiva explícita (clic en botón "Acepto") | Válido | Válido | Válido | Válido (si es inequívoca) | ✅ Para flujos de consentimiento |
| ❌ Silencio / no responder | No válido | No válido | No válido para sensibles | No válido | ❌ Nunca |

---

## Plazos de retención del registro de consentimiento

| Jurisdicción | Plazo mínimo de conservación del registro | Referencia |
|---|---|---|
| Brasil (LGPD) | Durante la vigencia del tratamiento + período razonable post-cancelación | Art. 16 LGPD |
| Colombia (Ley 1581) | Durante el tratamiento + período de prescripción aplicable | Art. 13 Ley 1581 |
| México (LFPDPPP) | Durante la vigencia del contrato o relación + período de prescripción | Art. 16 LFPDPPP |
| GDPR | Durante el período de tratamiento + demostrable ante autoridad | Art. 5.2 GDPR |

---

## Casos especiales de consentimiento

### Consentimiento en apps móviles

En apps móviles, el espacio es limitado. Usar aviso simplificado con enlace a versión completa:
- El "aviso corto" debe incluir al menos: identidad del responsable, finalidades principales, enlace a aviso completo
- Los permisos del sistema operativo (cámara, ubicación, notificaciones) no reemplazan el consentimiento legal bajo protección de datos — son complementarios

### Consentimiento en contexto B2B

Cuando la plataforma vende a empresas que a su vez tienen usuarios finales:
- La empresa cliente es el "Responsable del tratamiento" para sus usuarios
- La empresa que provee la plataforma puede ser "Encargada del tratamiento"
- El DPA entre ambas define las obligaciones — el consentimiento de usuarios finales es responsabilidad del cliente

### Consentimiento histórico (usuarios anteriores a la nueva política)

Al implementar una nueva política de privacidad que requiere consentimiento donde antes no lo había:
- Notificar a todos los usuarios existentes
- Dar un plazo razonable para que presten el consentimiento
- Si el usuario no responde: no tratar sus datos con las nuevas finalidades
- No purgar automáticamente usuarios que no consientan si hay otra base legal (contrato, interés legítimo)

---

*Pilar: Frontend | Owner: PM + UX | Validación: Abogado de privacidad*  
*Ver patrón: [consent-form.md](../patterns/consent-form.md)*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
