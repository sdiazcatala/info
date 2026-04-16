# Backend GELMA - Documentación Completa

## Fecha: 15 de abril de 2026

---

## 📋 Descripción

Backend del sistema de comercialización GELMA construido con Express.js y PostgreSQL. Proporciona una API RESTful completa para la gestión de autenticación, usuarios, clientes, productos, pedidos y reportes.

---

## 🏗️ Arquitectura

### Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | >= 14.0.0 | Runtime de JavaScript |
| Express.js | 4.18.2 | Framework web |
| PostgreSQL | >= 12 | Base de datos relacional |
| bcryptjs | 2.4.3 | Hash de contraseñas |
| JSON Web Token | 9.0.2 | Autenticación con JWT |
| Nodemailer | 8.0.5 | Envío de correos |
| pg | 8.11.3 | Cliente PostgreSQL |
| cors | 2.8.5 | Middleware CORS |
| dotenv | 16.3.1 | Variables de entorno |

---

## 📂 Estructura del Proyecto

```
server/
├── database/
│   ├── schema.sql          # Schema completo de la base de datos
│   └── seed.sql            # Datos de prueba (usuarios, clientes, productos)
├── middleware/
│   └── auth.js             # Middlewares de autenticación y autorización
├── routes/
│   ├── auth.js             # Rutas de autenticación
│   ├── users.js            # Rutas de gestión de usuarios
│   ├── clients.js          # Rutas de gestión de clientes
│   ├── products.js         # Rutas de gestión de productos
│   ├── orders.js           # Rutas de gestión de pedidos
│   └── reports.js          # Rutas de gestión de reportes
├── services/
│   └── emailService.js     # Servicio de correo con plantillas HTML
├── utils/                  # Utilidades
├── index.js                # Punto de entrada principal
├── package.json            # Dependencias y scripts
├── .env                    # Variables de entorno (NO subirla al repo)
└── .env.example            # Ejemplo de variables de entorno
```

---

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd gelma-web/server
npm install
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos en PostgreSQL
psql -U postgres
CREATE DATABASE gelma_db;
\q

# Ejecutar schema
psql -U postgres -d gelma_db -f database/schema.sql

# Cargar datos de prueba (opcional)
psql -U postgres -d gelma_db -f database/seed.sql

# O usar el script npm
npm run db:setup
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones:
# - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
# - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
# - JWT_SECRET (generar uno nuevo)
# - FRONTEND_URL, BACKEND_URL
```

### 4. Iniciar Servidor

```bash
# Desarrollo (con nodemon y auto-reload)
npm run dev

# Producción
npm start
```

El servidor correrá en `http://localhost:5000` (o el puerto configurado).

---

## 📡 Endpoints de la API

### Health Check

```
GET /api/health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2026-04-15T10:00:00.000Z",
  "environment": "development"
}
```

---

## 🔐 Autenticación

### 1. Registro de Usuario

```
POST /api/auth/register
```

**Body:**
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@email.com",
  "password": "Password@2026"
}
```

**Respuesta (201):**
```json
{
  "message": "Registro exitoso. Por favor revise su correo para verificar su cuenta.",
  "user": {
    "id": 1,
    "username": "nuevo_usuario",
    "email": "usuario@email.com",
    "role": "CONSULTOR"
  }
}
```

**Flujo:**
1. Usuario envía datos de registro
2. Backend valida que no exista el usuario/email
3. Se hashea la contraseña con bcrypt
4. Se genera token de verificación
5. Se inserta usuario en BD (rol CONSULTOR, no verificado)
6. Se envía correo de verificación con enlace
7. Usuario debe hacer clic en enlace para verificar email

---

### 2. Verificación de Email

```
GET /api/auth/verify-email?token=TOKEN_AQUI
```

**Respuesta (200):**
```json
{
  "message": "Correo verificado exitosamente. Ya puede iniciar sesión.",
  "user": {
    "id": 1,
    "username": "nuevo_usuario",
    "email": "usuario@email.com",
    "role": "CONSULTOR"
  }
}
```

**Flujo:**
1. Usuario recibe correo con enlace
2. Hace clic en enlace
3. Backend valida token
4. Se marca usuario como verificado
5. Usuario ya puede iniciar sesión

---

### 3. Login

```
POST /api/auth/login
```

**Body:**
```json
{
  "username": "admin_gelma",
  "password": "Admin@2026"
}
```

**Respuesta (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin_gelma",
    "email": "admin@gelma.com",
    "role": "ADMIN"
  }
}
```

**Flujo:**
1. Usuario envía credenciales
2. Backend busca usuario en BD
3. Verifica que esté activo y verificado
4. Valida contraseña con bcrypt
5. Genera JWT token con expiración de 8h
6. Actualiza último login
7. Retorna token y datos de usuario

---

### 4. Olvidé mi Contraseña - Solicitud

```
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "usuario@email.com"
}
```

**Respuesta (200):**
```json
{
  "message": "Si el correo está registrado, recibirás un enlace de recuperación"
}
```

**Flujo:**
1. Usuario ingresa email
2. Backend busca usuario
3. Verifica que esté verificado
4. Genera token de recuperación (expira en 1 hora)
5. Envía correo con enlace de recuperación
6. No revela si el email existe o no (seguridad)

---

### 5. Validar Token de Recuperación

```
GET /api/auth/validate-reset-token?token=TOKEN_AQUI
```

**Respuesta (200):**
```json
{
  "message": "Token válido",
  "user": {
    "username": "admin_gelma",
    "email": "admin@gelma.com"
  }
}
```

---

### 6. Restablecer Contraseña

```
POST /api/auth/reset-password
```

**Body:**
```json
{
  "token": "TOKEN_AQUI",
  "newPassword": "NuevaPassword@2026"
}
```

**Respuesta (200):**
```json
{
  "message": "Contraseña restablecida exitosamente"
}
```

**Flujo:**
1. Usuario recibe correo con enlace
2. Hace clic y llega a página de recuperación
3. Ingresa nueva contraseña y confirma
4. Backend valida token y nueva contraseña
5. Hashea nueva contraseña
6. Actualiza en BD y limpia token
7. Usuario ya puede login con nueva contraseña

---

## 👥 Gestión de Usuarios (Solo ADMIN)

### Obtener Todos los Usuarios

```
GET /api/users
Authorization: Bearer TOKEN
```

**Respuesta (200):**
```json
{
  "message": "Usuarios obtenidos exitosamente",
  "count": 4,
  "users": [
    {
      "id": 1,
      "username": "admin_gelma",
      "email": "admin@gelma.com",
      "role": "ADMIN",
      "is_verified": true,
      "is_active": true,
      "created_at": "2026-04-15T10:00:00.000Z",
      "last_login": "2026-04-15T12:00:00.000Z"
    }
  ]
}
```

---

### Aprobar Usuario

```
PUT /api/users/:id/approve
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "role": "EDITOR",
  "sendEmail": true
}
```

**Respuesta (200):**
```json
{
  "message": "Usuario aprobado y rol asignado exitosamente",
  "user": {
    "id": 5,
    "username": "nuevo_usuario",
    "email": "usuario@email.com",
    "role": "EDITOR"
  }
}
```

**Flujo:**
1. Administrador revisa usuarios registrados
2. Asigna rol apropiado (CONSULTOR, MODERADOR, EDITOR, ADMIN)
3. Aprueba usuario
4. Backend marca como verificado y activo
5. Envía correo de aprobación al usuario
6. Usuario ya puede iniciar sesión

---

### Rechazar Usuario

```
PUT /api/users/:id/reject
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "reason": "El usuario no cumple los requisitos para acceso al sistema",
  "sendEmail": true
}
```

**Respuesta (200):**
```json
{
  "message": "Usuario rechazado y desactivado exitosamente"
}
```

---

### Cambiar Rol de Usuario

```
PUT /api/users/:id/role
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "role": "MODERADOR"
}
```

**Respuesta (200):**
```json
{
  "message": "Rol actualizado exitosamente",
  "user": {
    "id": 2,
    "username": "usuario2",
    "email": "usuario2@email.com",
    "role": "MODERADOR"
  }
}
```

---

### Activar/Desactivar Usuario

```
PUT /api/users/:id/activate
PUT /api/users/:id/deactivate
Authorization: Bearer TOKEN
```

---

### Eliminar Usuario

```
DELETE /api/users/:id
Authorization: Bearer TOKEN
```

---

## 🏢 Gestión de Clientes (ADMIN, EDITOR)

### Obtener Clientes

```
GET /api/clients
Authorization: Bearer TOKEN
```

### Crear Cliente

```
POST /api/clients
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "name": "Cliente Mayorista SA",
  "email": "contacto@mayorista.com",
  "phone": "+53 5 555-1001",
  "address": "Calle Principal #101",
  "client_type": "mayorista"
}
```

### Actualizar Cliente

```
PUT /api/clients/:id
Authorization: Bearer TOKEN
```

### Eliminar Cliente

```
DELETE /api/clients/:id
Authorization: Bearer TOKEN
```

---

## 📦 Gestión de Productos

### Obtener Productos

```
GET /api/products
Authorization: Bearer TOKEN
```

**Nota:** Todos los roles pueden ver productos

### Crear Producto

```
POST /api/products
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "name": "Producto A",
  "description": "Descripción del producto",
  "price": 150.00,
  "stock": 100,
  "category": "Categoría 1"
}
```

### Actualizar Producto

```
PUT /api/products/:id
Authorization: Bearer TOKEN
```

### Eliminar Producto

```
DELETE /api/products/:id
Authorization: Bearer TOKEN
```

---

## 🛒 Gestión de Pedidos

### Obtener Pedidos

```
GET /api/orders
Authorization: Bearer TOKEN
```

### Crear Pedido

```
POST /api/orders
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "client_id": 1,
  "total": 500.00,
  "status": "Pendiente",
  "notes": "Notas del pedido"
}
```

### Actualizar Pedido

```
PUT /api/orders/:id
Authorization: Bearer TOKEN
```

---

## 📊 Gestión de Reportes

### Obtener Reportes

```
GET /api/reports
Authorization: Bearer TOKEN
```

### Crear Reporte

```
POST /api/reports
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "title": "Reporte de Ventas Mensual",
  "description": "Análisis de ventas del mes",
  "report_type": "ventas"
}
```

### Validar Reporte (MODERADOR, ADMIN)

```
PUT /api/reports/:id/validate
Authorization: Bearer TOKEN
```

**Body:**
```json
{
  "action": "approve",
  "validation_notes": "Reporte aprobado, datos correctos"
}
```

**Acciones:**
- `"approve"`: Marca como "Validado"
- `"reject"`: Marca como "Rechazado"

### Consolidar Reporte (MODERADOR, ADMIN)

```
PUT /api/reports/:id/consolidate
Authorization: Bearer TOKEN
```

**Nota:** Solo se pueden consolidar reportes con estado "Validado"

---

## 🔑 Roles y Permisos

### Matriz de Permisos

| Endpoint | CONSULTOR | MODERADOR | EDITOR | ADMIN |
|----------|:---------:|:---------:|:------:|:-----:|
| GET /api/health | ✅ | ✅ | ✅ | ✅ |
| POST /api/auth/* | ✅ | ✅ | ✅ | ✅ |
| GET /api/products | ✅ | ✅ | ✅ | ✅ |
| GET /api/orders | ✅ | ✅ | ✅ | ✅ |
| GET /api/reports | ✅ | ✅ | ✅ | ✅ |
| POST /api/reports | ✅ | ❌ | ✅ | ✅ |
| PUT /api/reports/:id/validate | ❌ | ✅ | ❌ | ✅ |
| PUT /api/reports/:id/consolidate | ❌ | ✅ | ❌ | ✅ |
| GET /api/clients | ❌ | ❌ | ✅ | ✅ |
| POST /api/clients | ❌ | ❌ | ✅ | ✅ |
| PUT /api/clients/:id | ❌ | ❌ | ✅ | ✅ |
| DELETE /api/clients/:id | ❌ | ❌ | ✅ | ✅ |
| GET /api/products (crear/editar) | ❌ | ❌ | ✅ | ✅ |
| POST /api/products | ❌ | ❌ | ✅ | ✅ |
| PUT /api/products/:id | ❌ | ❌ | ✅ | ✅ |
| DELETE /api/products/:id | ❌ | ❌ | ✅ | ✅ |
| POST /api/orders | ❌ | ❌ | ✅ | ✅ |
| PUT /api/orders/:id | ❌ | ❌ | ✅ | ✅ |
| GET /api/users | ❌ | ❌ | ❌ | ✅ |
| PUT /api/users/:id/* | ❌ | ❌ | ❌ | ✅ |
| DELETE /api/users/:id | ❌ | ❌ | ❌ | ✅ |

---

## 📧 Servicio de Correo

### Plantillas de Correo Incluidas

1. **Verificación de Registro**
   - Envío cuando usuario se registra
   - Contiene enlace de verificación
   - Diseño HTML profesional con gradiente púrpura

2. **Aprobación de Cuenta**
   - Envío cuando administrador aprueba usuario
   - Incluye rol asignado
   - Diseño HTML con gradiente verde

3. **Recuperación de Contraseña**
   - Envío cuando usuario olvida contraseña
   - Contiene enlace de recuperación (expira en 1h)
   - Diseño HTML con gradiente rosa

4. **Rechazo de Cuenta**
   - Envío cuando administrador rechaza usuario
   - Incluye motivo del rechazo
   - Diseño HTML con gradiente rojo

### Configuración de Correo Interno

Para usar el servicio de correo interno de GELMA:

```env
SMTP_HOST=servidor.correo.gelma.cu
SMTP_PORT=587
SMTP_USER=gelma-notificaciones@gelma.cu
SMTP_PASS=contraseña_del_correo
SMTP_FROM=GELMA Sistema <gelma-notificaciones@gelma.cu>
SMTP_SECURE=false
```

### Para Desarrollo/Testing

**Opción 1: Ethereal Email**
1. Ve a https://ethereal.email
2. Crea una cuenta
3. Copia las credenciales
4. Pega en `.env`

**Opción 2: Mailtrap**
1. Ve a https://mailtrap.io
2. Crea cuenta gratuita
3. Obtén credenciales SMTP
4. Configura en `.env`

---

## 🗄️ Base de Datos

### Tablas Principales

1. **users** - Usuarios del sistema
   - Autenticación y autorización
   - Roles: CONSULTOR, MODERADOR, EDITOR, ADMIN
   - Tokens de verificación y recuperación

2. **audit_log** - Auditoría del sistema
   - Registro de todas las acciones importantes
   - Valores antiguos y nuevos
   - IP y user agent

3. **clients** - Clientes
   - Información de contacto
   - Tipos: mayorista, minorista, distribuidor

4. **products** - Productos
   - Catálogo de productos
   - Control de stock
   - Precios y categorías

5. **orders** - Pedidos
   - Relación con clientes
   - Estados: Pendiente, En Proceso, Completado, Cancelado

6. **reports** - Reportes
   - Flujo de validación
   - Estados: Borrador, Pendiente Validación, Validado, Rechazado, Consolidado

### Índices

Todos los campos de búsqueda frecuente están indexados para optimización.

### Triggers

Trigger automático para actualizar `updated_at` en cada tabla.

---

## 🔒 Seguridad

### Contraseñas
- Hasheadas con bcrypt (coste 10)
- Requisitos: 8+ caracteres, mayúscula, minúscula, número, símbolo

### Tokens JWT
- Expiración: 8 horas (configurable)
- Payload: id, username, role, isVerified, isActive
- Firma con secreto configurable

### Tokens de Recuperación
- Expiración: 1 hora
- Generados con crypto.randomBytes(32)
- Se limpian después de usar

### CORS
- Configurado con orígenes permitidos
- Soporte para credentials

---

## 📝 Logs y Auditoría

El sistema registra:
- Todos los logins
- Creación/edición/eliminación de recursos
- Cambios de rol
- Aprobaciones/rechazos de usuarios
- Validación de reportes

---

## 🧪 Usuarios de Prueba

Ver `USUARIOS_PRUEBA.md` para credenciales completas.

| Username | Password | Rol |
|----------|----------|-----|
| admin_gelma | Admin@2026 | ADMIN |
| editor_empresa | Editor@2026 | EDITOR |
| moderador_gelma | Moderador@2026 | MODERADOR |
| consultor_gelma | Consultor@2026 | CONSULTOR |

---

## 🚀 Despliegue en Producción

### Checklist

1. **Seguridad:**
   - [ ] Cambiar JWT_SECRET
   - [ ] Configurar CORS solo para dominio frontend
   - [ ] Usar HTTPS
   - [ ] Configurar SMTP real
   - [ ] Remover logs de desarrollo

2. **Base de Datos:**
   - [ ] Configurar backups automáticos
   - [ ] Configurar SSL para conexiones
   - [ ] Ajustar pool de conexiones
   - [ ] Ejecutar migraciones de schema

3. **Servidor:**
   - [ ] Usar PM2 o similar para proceso
   - [ ] Configurar variables de entorno
   - [ ] Configurar monitoreo
   - [ ] Configurar rate limiting

---

## 🐛 Manejo de Errores

Todos los endpoints retornan:

```json
{
  "message": "Descripción del error",
  "detail": "Detalles adicionales (solo en desarrollo)"
}
```

Códigos de estado:
- 200/201: Éxito
- 400: Bad Request (validación)
- 401: No autenticado
- 403: No autorizado
- 404: No encontrado
- 500: Error interno

---

## 📞 Soporte

Para problemas o consultas:
- Revisar logs del servidor
- Verificar conexión a BD
- Verificar configuración SMTP
- Consultar documentación de endpoints

---

## 👤 Documentación Creada por

- **Fecha:** 15 de abril de 2026
- **Sistema Operativo:** Windows (win32)
- **Directorio del Proyecto:** d:\GitHub\info\gelma-web\server
