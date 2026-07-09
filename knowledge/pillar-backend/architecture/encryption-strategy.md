# Arquitectura: Estrategia de Cifrado
**Pilar: Backend (Seguridad Técnica / Arquitectura)**

> **Privacy Compliance Skills** — Guía de arquitectura. No constituye asesoría jurídica.  
> Versión: 1.0.0 | Elaborado: 2026-06-04  
> Propietario: CTO + Security Lead | Revisión: Trimestral

---

## Por qué el cifrado es un requisito legal, no solo técnico

Las leyes de protección de datos de LATAM y el GDPR exigen **medidas técnicas adecuadas** para proteger los datos personales. El cifrado es la medida técnica más reconocida por los reguladores y es el primer elemento evaluado en una auditoría.

- LGPD Brasil: Art. 6.VII (segurança) + Art. 46 (medidas de segurança técnica)
- GDPR: Art. 25 (privacidad por diseño) + Art. 32 (seguridad del tratamiento) — cita cifrado explícitamente
- LFPDPPP México: Art. 19 (medidas de seguridad administrativas, físicas y técnicas)
- Ley 1581 Colombia: Art. 17 (obligaciones del responsable de garantizar seguridad)

---

## Mapa de cifrado por capa

### Capa 1: En tránsito (Network)

| Protocolo | Obligatorio | Recomendado |
|---|---|---|
| TLS 1.0 / 1.1 | ❌ Deshabilitar | — |
| TLS 1.2 | ✅ Mínimo | — |
| TLS 1.3 | — | ✅ Preferir |
| mTLS (mutual) | — | ✅ Para APIs internas entre microservicios |
| HSTS | ✅ En todos los dominios | `max-age=31536000; includeSubDomains` |

```nginx
# nginx.conf — configuración de seguridad TLS
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Capa 2: En reposo (Storage)

| Nivel | Cuándo usar | Algoritmo |
|---|---|---|
| Cifrado de disco completo | Siempre — nivel mínimo | AES-256 (gestionado por el proveedor cloud) |
| Cifrado de columna | Datos sensibles: salud, biometría, credenciales financieras | AES-256-GCM con KMS |
| Cifrado a nivel de aplicación | Datos que deben ser legibles solo por el sistema | Fernet (AES-128-CBC + HMAC-SHA256) |

```python
# Cifrado de columna para dato de salud
from cryptography.fernet import Fernet
import boto3

def get_encryption_key(key_name: str) -> bytes:
    """Obtener clave desde AWS KMS — NUNCA hardcodeada."""
    kms = boto3.client('kms')
    response = kms.decrypt(CiphertextBlob=get_encrypted_key_from_config(key_name))
    return response['Plaintext']

def encrypt_health_data(plaintext: str, user_country: str) -> str:
    key = get_encryption_key(f'HEALTH_DATA_{user_country}')
    cipher = Fernet(key)
    return cipher.encrypt(plaintext.encode()).decode()

def decrypt_health_data(ciphertext: str, user_country: str) -> str:
    key = get_encryption_key(f'HEALTH_DATA_{user_country}')
    cipher = Fernet(key)
    return cipher.decrypt(ciphertext.encode()).decode()
```

### Capa 3: Credenciales de usuarios (Hashing)

El hashing de contraseñas NO es cifrado reversible — es un proceso unidireccional. No debe ser posible recuperar la contraseña original.

| Algoritmo | Estado | Parámetros mínimos |
|---|---|---|
| bcrypt | ✅ Recomendado | cost factor ≥ 12 |
| argon2id | ✅ Recomendado (OWASP) | memory=64MB, iterations=3, parallelism=4 |
| scrypt | ✅ Aceptable | N=2^16, r=8, p=1 |
| PBKDF2-SHA256 | ⚠️ Aceptable solo con ≥ 600,000 iteraciones | — |
| MD5 / SHA1 / SHA256 sin salt | ❌ Nunca | — |
| Texto plano | ❌ Nunca | — |

```python
# ✅ bcrypt correcto
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ❌ NUNCA hacer esto
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()  # INSEGURO
```

---

## Gestión de Claves (KMS)

Las claves de cifrado son tan importantes como los datos cifrados. Una clave expuesta invalida todo el cifrado.

### Principios

- Las claves **nunca** están en el código fuente, en variables de entorno del repositorio, ni en archivos de configuración commiteados
- Las claves están en un **KMS dedicado**: AWS KMS, GCP Cloud KMS, Azure Key Vault, HashiCorp Vault
- Las claves tienen **rotación automática** (recomendado: anual para datos regulares, cada 90 días para datos sensibles)
- El acceso a las claves está **limitado por rol** — no todos los servicios tienen acceso a todas las claves

### Arquitectura de claves por categoría

```
KMS
├── keys/health-data/         (solo accesible por health-service)
├── keys/biometric-data/      (solo accesible por auth-service)
├── keys/financial-data/      (solo accesible por payments-service)
├── keys/general-personal/    (accesible por API principal)
└── keys/backups/             (solo accesible por backup-job)
```

### Rotación de claves

Cuando se rota una clave:
1. La nueva clave se activa para **nuevos cifrados**
2. Los datos cifrados con la clave anterior se **re-cifran gradualmente** (no de golpe)
3. La clave anterior permanece activa solo para descifrar datos aún no migrados
4. Al completar la migración, la clave anterior se **desactiva** (no se borra, para auditoría)

---

## Cifrado de backups

- Los backups usan las mismas claves que los datos en producción (o claves derivadas)
- Los backups están en una región diferente al servidor principal
- El proceso de restauración de backup está documentado y probado periódicamente
- El archivo de backup cifrado nunca debe ser legible por el proveedor de almacenamiento (cifrado del lado del cliente)

---

## Auditoría del cifrado

Verificar periódicamente:

- [ ] ¿Hay algún campo de dato sensible que esté en texto plano? (Revisar con `SELECT * FROM INFORMATION_SCHEMA.COLUMNS`)
- [ ] ¿Las claves del KMS tienen fecha de rotación vigente?
- [ ] ¿Hay alguna clave en el repositorio, CI/CD o logs?
- [ ] ¿Los backups están cifrados? (Verificar configuración del backup provider)
- [ ] ¿El certificado TLS tiene fecha de vencimiento próxima? (Alertar con 30 días de anticipación)

---

*Pilar: Backend | Owner: CTO + Security Lead | Validación: Security audit interno*  
*Privacy Compliance Skills — [DISCLAIMER.md](../../../DISCLAIMER.md)*
