# 🐳 Configuración Docker para GELMA

Este directorio contiene toda la configuración necesaria para ejecutar el proyecto GELMA usando Docker y Docker Compose.

## 📁 Archivos Creados

### Frontend (`/gelma-web/`)
- **`Dockerfile`**: Construye la aplicación React con Vite y la sirve con Nginx
- **`nginx.conf`**: Configuración de Nginx para SPA con proxy inverso al backend
- **`.dockerignore`**: Excluye archivos innecesarios de la imagen Docker
- **`docker-compose.yml`**: Orquesta todos los servicios (DB, Backend, Frontend)
- **`.env.example`**: Plantilla de variables de entorno

### Backend (`/gelma-web/server/`)
- **`Dockerfile`**: Ya existía, configura el backend con Node.js y nodemon
- **`.dockerignore`**: Excluye archivos innecesarios de la imagen Docker

## 🚀 Uso Rápido

### 1. Configurar Variables de Entorno

```bash
cd /workspace/gelma-web
cp .env.example .env
```

Edita el archivo `.env` y ajusta las variables según tu entorno, especialmente:
- `JWT_SECRET`: Cambia por un secreto seguro en producción
- `MAIL_USER` y `MAIL_PASSWORD`: Configura si usarás envío de correos

### 2. Iniciar Todos los Servicios

```bash
docker-compose up -d
```

Esto levantará:
- **PostgreSQL** (puerto 5432)
- **Backend API** (puerto 5000)
- **Frontend** (puerto 80)

### 3. Verificar Estado

```bash
docker-compose ps
```

### 4. Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f db
```

### 5. Acceder a la Aplicación

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Base de Datos**: localhost:5432

### 6. Detener Servicios

```bash
docker-compose down
```

Para eliminar también volúmenes (base de datos):
```bash
docker-compose down -v
```

## 🔧 Comandos Útiles

### Reconstruir Imágenes

```bash
docker-compose build --no-cache
```

### Reiniciar un Servicio

```bash
docker-compose restart backend
```

### Ejecutar Comandos en Contenedores

```bash
# Backend
docker-compose exec backend npm run dev

# Base de datos (psql)
docker-compose exec db psql -U postgres -d gelma_db
```

### Ver Uso de Recursos

```bash
docker stats
```

## 🏗️ Arquitectura Docker

```
┌─────────────────┐
│   Frontend      │  Puerto 80
│   (Nginx + React)│
└────────┬────────┘
         │ Proxy /api
         ▼
┌─────────────────┐
│   Backend       │  Puerto 5000
│   (Express.js)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │  Puerto 5432
│   (gelma_db)    │
└─────────────────┘
```

## 📝 Notas Importantes

### Desarrollo vs Producción

- **Desarrollo**: El backend usa `nodemon` para recargar automáticamente
- **Producción**: Cambia `NODE_ENV=production` en el `.env`

### Volúmenes Persistentes

- Los datos de PostgreSQL se guardan en un volumen Docker llamado `postgres_data`
- Los logs del backend se montan desde `./server/logs`

### Seguridad

⚠️ **Importante para Producción**:
1. Cambia `JWT_SECRET` por un valor único y seguro
2. Usa contraseñas fuertes para la base de datos
3. No expongas puertos innecesariamente
4. Considera usar HTTPS con un reverse proxy (ej. Traefik, Nginx Proxy Manager)

## 🐛 Solución de Problemas

### El Backend no se Conecta a la DB

Verifica que la DB esté saludable:
```bash
docker-compose ps
docker-compose logs db
```

### El Frontend no Muestra la Aplicación

Revisa los logs:
```bash
docker-compose logs frontend
```

### Cambios en el Código no se Reflejan

- **Backend**: Debería recargar automáticamente con nodemon
- **Frontend**: Reconstruye la imagen:
  ```bash
  docker-compose build frontend
  docker-compose up -d frontend
  ```

### Errores de Permisos en Logs

```bash
mkdir -p ./server/logs
chmod 777 ./server/logs
```

## 📊 Recursos

- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Guía de Nginx para React](https://mherman.org/posts/dockerizing-a-react-app/)

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
