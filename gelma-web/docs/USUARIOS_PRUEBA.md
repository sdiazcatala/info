# Usuarios de Prueba - Sistema de Autenticación GELMA

## Fecha: 15 de abril de 2026

---

## 📋 Usuarios de Prueba para Testing

### 1. ADMINISTRADOR

| Campo | Valor |
|-------|-------|
| **Username** | admin_gelma |
| **Email** | admin@gelma.com |
| **Password** | Admin@2026 |
| **Rol** | ADMIN |
| **Estado** | Verificado y Activo |
| **Permisos** | Control total del sistema |

---

### 2. EDITOR (Empresa)

| Campo | Valor |
|-------|-------|
| **Username** | editor_empresa |
| **Email** | editor@gelma.com |
| **Password** | Editor@2026 |
| **Rol** | EDITOR |
| **Estado** | Verificado y Activo |
| **Permisos** | CRUD de Clientes, Productos, Pedidos + Auditoría |

---

### 3. MODERADOR

| Campo | Valor |
|-------|-------|
| **Username** | moderador_gelma |
| **Email** | moderador@gelma.com |
| **Password** | Moderador@2026 |
| **Rol** | MODERADOR |
| **Estado** | Verificado y Activo |
| **Permisos** | Validación de reportes, aprobación/rechazo, consolidación |

---

### 4. CONSULTOR (Viewer)

| Campo | Valor |
|-------|-------|
| **Username** | consultor_gelma |
| **Email** | consultor@gelma.com |
| **Password** | Consultor@2026 |
| **Rol** | CONSULTOR |
| **Estado** | Verificado y Activo |
| **Permisos** | Solo lectura, reportes, exportación de datos |

---

## 🔧 Usuarios para Pruebas de Registro

### Usuario Nuevo 1 (Para probar registro)

| Campo | Valor |
|-------|-------|
| **Username** | nuevo_usuario1 |
| **Email** | nuevo1@test.com |
| **Password** | Nuevo@2026 |
| **Rol** | CONSULTOR (por defecto) |
| **Estado** | No verificado (requiere verificación por email) |

---

### Usuario Nuevo 2 (Para probar registro)

| Campo | Valor |
|-------|-------|
| **Username** | nuevo_usuario2 |
| **Email** | nuevo2@test.com |
| **Password** | Nuevo@2026! |
| **Rol** | CONSULTOR (por defecto) |
| **Estado** | No verificado (requiere verificación por email) |

---

## 📝 Usuarios para Pruebas de Recuperación de Contraseña

### Usuario con Contraseña Olvidada 1

| Campo | Valor |
|-------|-------|
| **Username** | admin_gelma |
| **Email** | admin@gelma.com |
| **Nueva Password (test)** | NuevaAdmin@2026 |
| **Estado** | Verificado y Activo |

---

### Usuario con Contraseña Olvidada 2

| Campo | Valor |
|-------|-------|
| **Username** | editor_empresa |
| **Email** | editor@gelma.com |
| **Nueva Password (test)** | NuevoEditor@2026 |
| **Estado** | Verificado y Activo |

---

## ⚠️ Notas Importantes

1. **Todas las contraseñas deben cumplir los requisitos:**
   - Al menos una letra mayúscula
   - Al menos una letra minúscula
   - Al menos un número
   - Al menos un símbolo especial (@, #, $, %, etc.)

2. **Estos usuarios son para ENTORNO DE PRUEBAS**
   - No usar en producción
   - Las contraseñas deben ser cambiadas antes de ir a producción

3. **Para crear estos usuarios en la base de datos:**
   - Ejecutar el script SQL incluido en este documento
   - O usar el formulario de registro para los usuarios no verificados

---

## 🗄️ Script SQL para Crear Usuarios de Prueba

```sql
-- ================================================
-- SCRIPT SQL PARA CREAR USUARIOS DE PRUEBA
-- ================================================
-- Nota: Las contraseñas están hasheadas con bcrypt
-- Hash para "Admin@2026", "Editor@2026", etc.
-- ================================================

-- 1. ADMINISTRADOR
INSERT INTO users (username, email, password_hash, role, is_verified, verification_token, reset_token, reset_token_expires, created_at, updated_at)
VALUES (
    'admin_gelma',
    'admin@gelma.com',
    '$2b$10$hash_de_contraseña_admin_a_generar',
    'ADMIN',
    TRUE,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- 2. EDITOR
INSERT INTO users (username, email, password_hash, role, is_verified, verification_token, reset_token, reset_token_expires, created_at, updated_at)
VALUES (
    'editor_empresa',
    'editor@gelma.com',
    '$2b$10$hash_de_contraseña_editor_a_generar',
    'EDITOR',
    TRUE,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- 3. MODERADOR
INSERT INTO users (username, email, password_hash, role, is_verified, verification_token, reset_token, reset_token_expires, created_at, updated_at)
VALUES (
    'moderador_gelma',
    'moderador@gelma.com',
    '$2b$10$hash_de_contraseña_moderador_a_generar',
    'MODERADOR',
    TRUE,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- 4. CONSULTOR
INSERT INTO users (username, email, password_hash, role, is_verified, verification_token, reset_token, reset_token_expires, created_at, updated_at)
VALUES (
    'consultor_gelma',
    'consultor@gelma.com',
    '$2b$10$hash_de_contraseña_consultor_a_generar',
    'CONSULTOR',
    TRUE,
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
);
```

---

## 🔐 Generación de Hash de Contraseñas

Para generar los hashes bcrypt de las contraseñas, usar el siguiente código Node.js:

```javascript
const bcrypt = require('bcryptjs');

const passwords = {
    'Admin@2026': bcrypt.hashSync('Admin@2026', 10),
    'Editor@2026': bcrypt.hashSync('Editor@2026', 10),
    'Moderador@2026': bcrypt.hashSync('Moderador@2026', 10),
    'Consultor@2026': bcrypt.hashSync('Consultor@2026', 10),
    'Nuevo@2026': bcrypt.hashSync('Nuevo@2026', 10),
    'Nuevo@2026!': bcrypt.hashSync('Nuevo@2026!', 10),
};

console.log(passwords);
```

---

## 📊 Resumen de Usuarios

| # | Username | Email | Rol | Estado | Password |
|---|----------|-------|-----|--------|----------|
| 1 | admin_gelma | admin@gelma.com | ADMIN | Verificado | Admin@2026 |
| 2 | editor_empresa | editor@gelma.com | EDITOR | Verificado | Editor@2026 |
| 3 | moderador_gelma | moderador@gelma.com | MODERADOR | Verificado | Moderador@2026 |
| 4 | consultor_gelma | consultor@gelma.com | CONSULTOR | Verificado | Consultor@2026 |
| 5 | nuevo_usuario1 | nuevo1@test.com | CONSULTOR | No verificado | Nuevo@2026 |
| 6 | nuevo_usuario2 | nuevo2@test.com | CONSULTOR | No verificado | Nuevo@2026! |

---

## 👤 Configuración Completada por
- **Fecha:** 15 de abril de 2026
- **Sistema Operativo:** Windows (win32)
- **Directorio del Proyecto:** d:\GitHub\info\gelma-web
