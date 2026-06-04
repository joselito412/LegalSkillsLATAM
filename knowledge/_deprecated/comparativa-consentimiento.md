# Matriz Comparativa: Consentimiento

> Fuente: Equipo Editorial LegalSkillsLATAM | Última revisión: 2026-01  
> ⚠️ Guía informativa. No constituye asesoría jurídica.

## Tabla Comparativa

| Dimensión | 🇨🇴 Colombia | 🇲🇽 México | 🇧🇷 Brasil | 🇨🇱 Chile | 🇦🇷 Argentina | 🇵🇪 Perú | 🇪🇨 Ecuador | 🇪🇺 GDPR | 🇺🇸 CCPA |
|---|---|---|---|---|---|---|---|---|---|
| **Forma requerida** | Previo, expreso, informado | Libre, específico, informado, inequívoco | Libre, informado, inequívoco, específico | Expreso e inequívoco | Expreso | Expreso e inequívoco | Libre, específico, informado | Libre, específico, informado, inequívoco | Opt-out (no requiere consentimiento activo para recopilación, sí para venta) |
| **Granularidad** | Por finalidad declarada | Por finalidad declarada | Por finalidad específica (no vale consentimiento genérico) | Por finalidad | Por finalidad | Por finalidad | Por finalidad | Por finalidad (bundled consent inválido) | Por categoría de venta/compartición |
| **Un solo checkbox "Acepto todo"** | No recomendado | No válido para múltiples finalidades | ❌ Inválido | No válido | No recomendado | No válido | No válido | ❌ Inválido | N/A (opt-out) |
| **Revocación** | Sí, en cualquier momento | Sí, en cualquier momento | Sí, gratuita y fácil | Sí | Sí | Sí | Sí | Sí, tan fácil como otorgar | Sí (opt-out en cualquier momento) |
| **Menores de edad** | Representante legal | Representante legal (< 18) | Representante legal (< 18), interés superior | Representante legal | Representante legal | Representante legal | Representante legal | 16 años (puede bajar a 13 por ley nacional) | 13 años (COPPA federal) |
| **Referencia legal** | Art. 9, Ley 1581 | Art. 8, LFPDPPP | Art. 8, LGPD | Art. 4, Ley 19.628 | Art. 5, Ley 25.326 | Art. 18, Ley 29733 | Art. 7, LOPDP | Art. 7, GDPR | Sec. 1798.120 CCPA |

---

## 🔴 Discriminadores de Rigor (qué activa el multiplicador ×1.25)

**Brasil (LGPD) y GDPR** son los estándares más exigentes en consentimiento:

1. **Consentimiento por finalidad obligatoriamente separado.** Si un sistema usa datos para (a) ejecutar el servicio, (b) enviar marketing y (c) compartir con partners, se necesitan tres consentimientos distintos — no uno solo.
2. **Registro del consentimiento.** El responsable debe poder demostrar que el consentimiento fue dado (quién, cuándo, para qué). Esto implica persistir el consentimiento con timestamp en base de datos.
3. **Revocación igualmente fácil.** Si el usuario aceptó con un clic, debe poder revocar con un clic. Un proceso complejo para revocar es violación.
4. **El silencio, la omisión o el consentimiento tácito NO son válidos** bajo LGPD ni GDPR. LATAM estándar en algunos países aún permite interpretaciones más laxas.

---

## 💡 Impacto Técnico para el Desarrollador

| Estándar | Implementación técnica requerida |
|---|---|
| LATAM estándar | Checkbox de aceptación con enlace a política + campo `consent_date` en DB |
| Brasil / GDPR | Tabla `user_consents` con: `user_id`, `purpose`, `granted_at`, `revoked_at`, `version_of_policy` |
| Todos | Flujo de registro que NO precarga checkbox en `checked=true` |
| Brasil / GDPR | UI con toggles individuales por finalidad (marketing, analytics, terceros, etc.) |
| Brasil / GDPR | Endpoint o sección "Mis preferencias" donde el usuario puede ver y revocar cada consentimiento |

### Ejemplo de esquema SQL mínimo para cumplimiento LGPD/GDPR

```sql
CREATE TABLE user_consents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  purpose     VARCHAR(100) NOT NULL,  -- 'marketing', 'analytics', 'third_party_sharing'
  granted     BOOLEAN NOT NULL,
  ip_address  INET,
  policy_version VARCHAR(20) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at  TIMESTAMPTZ
);
```

---

## Referencias Normativas

- Ley 1581/2012 Colombia — Art. 9 (Autorización del Titular)
- LFPDPPP México — Art. 8 (Consentimiento)
- LGPD Brasil — Art. 8 (Consentimento)
- GDPR UE — Art. 7 (Conditions for consent)
- CCPA California — Sec. 1798.120 (Right to opt-out)
