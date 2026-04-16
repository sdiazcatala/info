# Guía de Inicio Rápido - GELMA

## Fecha: 15 de abril de 2026

---

## 🚀 Inicio Rápido (5 minutos)

### Prerrequisitos
- Node.js >= 14
- PostgreSQL >= 12
- Un editor de código (VS Code recomendado)

---

## 1️⃣ Configurar Base de Datos (2 min)

### Crear Base de Datos

```bash
# Abrir PostgreSQL (psql)
psql -U postgres

# Crear base de datos
CREATE DATABASE gelma_db;

# Salir
\q
```

### Ejecutar Schema y Seed

```bash
# Navegar al directorio del servidor
cd gelma-web/server

# Ejecutar schema
psql -U postgres -d gelma_db -f database/schema.sql

# Cargar datos de prueba
psql -U postgres -d gelma_db -f database/seed.sql
```

**O usar el script npm:**

```bash
npm run db:setup
```

---

## 2️⃣ Configurar Variables de Entorno (1 min)

```bash
# En el directorio server/
cp .env.example .env

# Editar .env y configurar:
# - DB_PASSWORD=tu_contraseña_de_postgres
# - JWT_SECRET=cualquier_string_largo_y_aleatorio
# - SMTP_HOST, SMTP_USER, SMTP_PASS (para correos)
```

**Para testing de correo:**
1. Ve a https://ethereal.email
2. Crea cuenta gratuita
3. Copia credenciales
4. Pega en `.env`

---

## 3️⃣ Instalar Dependencias (1 min)

### Backend

```bash
cd gelma-web/server
npm install
```

### Frontend (si no está instalado)

```bash
cd gelma-web
npm install
```

---

## 4️⃣ Iniciar Servidores (1 min)

### Backend (Terminal 1)

```bash
cd gelma-web/server
npm run dev
```

**Deberías ver:**
```
✅ Conectado a la base de datos PostgreSQL
✅ Servicio de correo configurado correctamente

🚀 Servidor backend GELMA corriendo en puerto 5000
📡 API disponible en: http://localhost:5000/api
🌍 Entorno: development
```

### Frontend (Terminal 2)

```bash
cd gelma-web
npm run dev
```

**Deberías ver:**
```
  VITE v5.0.8  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 5️⃣ Probar el Sistema

### Health Check

```bash
curl http://localhost:5000/api/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2026-04-15T10:00:00.000Z",
  "environment": "development"
}
```

### Login con Usuario de Prueba

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_gelma","password":"Admin@2026"}'
```

**Respuesta esperada:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "admin_gelma",
    "email": "admin@gelma.com",
    "role": "ADMIN"
  }
}
```

---

## 📋 Usuarios de Prueba

| Username | Password | Rol | Acceso |
|----------|----------|-----|--------|
| admin_gelma | Admin@2026 | ADMIN | Todo el sistema |
| editor_empresa | Editor@2026 | EDITOR | CRUD clientes, productos, pedidos |
| moderador_gelma | Moderador@2026 | MODERADOR | Validar reportes |
| consultor_gelma | Consultor@2026 | CONSULTOR | Solo lectura, reportes |

---

## 🧪 Primeras Pruebas

### 1. Login como Administrador
- Abre http://localhost:3000
- Username: `admin_gelma`
- Password: `Admin@2026`
- Deberías ver el dashboard con acceso total

### 2. Registrar Nuevo Usuario
- Ve a "Registrarse"
- Crea un usuario nuevo
- Revisa el correo (Ethereal/Mailtrap) para verificación
- Haz clic en enlace de verificación

### 3. Aprobar Usuario (como ADMIN)
- Inicia sesión como admin
- Ve a gestión de usuarios
- Aprueba el nuevo usuario y asígnale un rol
- El usuario recibirá correo de aprobación

### 4. Recuperar Contraseña
- Ve a "¿Olvidó su contraseña?"
- Ingresa tu email
- Revisa el correo con enlace de recuperación
- Crea nueva contraseña

---

## 📚 Documentación Completa

- **Backend:** `gelma-web/server/README.md`
- **Autenticación:** `gelma-web/docs/AUTH_FLOW.md`
- **Tests:** `gelma-web/docs/TEST_AUTENTICACION.md`
- **Usuarios de Prueba:** `gelma-web/docs/USUARIOS_PRUEBA.md`

---

## 🐛 Problemas Comunes

### Error de Conexión a BD

```
❌ Error conectando a la base de datos
```

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Verifica credenciales en `.env`
3. Asegúrate de que la base de datos `gelma_db` existe

### Error de Correo

```
❌ Error configurando el servicio de correo
```

**Solución:**
1. Verifica configuración SMTP en `.env`
2. Para desarrollo, usa Ethereal Email
3. El sistema funciona sin correo (los tokens se generan igual)

### Puerto en Uso

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solución:**
1. Cambia el puerto en `.env`
2. O cierra el proceso que está usando el puerto

---

## ✅ Checklist de Funcionamiento

- [ ] PostgreSQL corriendo
- [ ] Base de datos `gelma_db` creada
- [ ] Schema ejecutado correctamente
- [ ] Seed ejecutado (usuarios de prueba creados)
- [ ] `.env` configurado
- [ ] `npm install` en server/
- [ ] `npm install` en gelma-web/
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Health check retorna OK
- [ ] Login funciona con usuarios de prueba

---

## 🎯 Próximos Pasos

1. Ejecutar tests de autenticación (`TEST_AUTENTICACION.md`)
2. Probar todos los flujos documentados
3. Crear más usuarios de prueba
4. Explorar el dashboard y funcionalidades
5. Revisar logs del backend para entender el flujo

---

## 📞 Necesitas Ayuda?

- Revisa la documentación en `gelma-web/docs/`
- Verifica logs del backend para errores
- Abre la consola del navegador para errores del frontend

---

- **Fecha:** 15 de abril de 2026
- **Versión:** 1.0.0
