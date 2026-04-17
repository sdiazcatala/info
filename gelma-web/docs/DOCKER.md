# ?? Guía Técnica de Despliegue con Docker

Esta guía detalla cómo configurar, ejecutar y solucionar problemas comunes del entorno Docker de GELMA.

## 1. Arquitectura del Contenedor

El sistema utiliza **Docker Compose** para orquestar 3 servicios principales:

1.  **db (PostgreSQL):** Base de datos persistente.
2.  **backend (Node.js):** API RESTful que se conecta a la DB.
3.  **frontend (Nginx + React):** Servidor web estático que actúa como proxy inverso hacia el backend.

## 2. Instrucciones de Instalación

### A. Clonar y Preparar
ash
git clone https://github.com/sdiazcatala/info.git
cd info/gelma-web
git checkout desarrollo


### B. Configurar Entorno
Copia el archivo de variables de ejemplo:
ash
# Linux/Mac
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env


### C. Ejecutar
ash
docker compose up -d


## 3. Solución de Problemas Comunes

### Error 403 Forbidden al descargar imágenes
Si ves errores como pull access denied o 403 Forbidden, es posible que Docker Hub esté bloqueando tu IP regional.
**Solución:** El proyecto ya está configurado para usar mirrors alternativos (docker.m.daocloud.io). Si falla, verifica tu conexión a internet o reinicia Docker Desktop.

### Error de Versión de Node (Vite requires Node.js 20+)
Si el build del frontend falla mencionando la versión de Node:
1.  Verifica que el Dockerfile en la raíz use FROM node:20-alpine.
2.  Reconstruye sin caché: docker compose build --no-cache frontend.

### La API responde "Ruta no encontrada"
Esto es normal si entras a http://localhost:5000/api directamente sin una ruta específica.
- Usa http://localhost:5000/api/health para probar conexión.
- Usa http://localhost para navegar por la aplicación completa.

### Reiniciar desde cero (Borrar Base de Datos)
?? **Advertencia:** Esto eliminará todos los datos guardados.
ash
docker compose down -v
docker compose up -d


## 4. Desarrollo Local

Si deseas modificar código y ver cambios:
- **Frontend:** Los cambios en src/ suelen requerir reconstruir el contenedor o montar volúmenes (configuración avanzada).
- **Backend:** Los cambios en server/ pueden requerir reiniciar el servicio: docker compose restart backend.
