# ?? GELMA - Sistema de Gestión Empresarial

Plataforma web moderna para la gestión de clientes, productos, pedidos e informes, construida con **React**, **Node.js** y **PostgreSQL**, totalmente containerizada con **Docker**.

## ??? Tecnologías Utilizadas

- **Frontend:** React 18, Vite, TailwindCSS (si aplica), React Router.
- **Backend:** Node.js, Express.js.
- **Base de Datos:** PostgreSQL 15.
- **Infraestructura:** Docker & Docker Compose.
- **Servidor Web:** Nginx (para servir el frontend y proxy inverso).

## ?? Requisitos Previos

- **Docker Desktop** instalado y ejecutándose.
- **Git** instalado.
- No se requiere instalar Node.js ni PostgreSQL localmente (todo corre en contenedores).

## ? Inicio Rápido (Paso a Paso)

Sigue estos pasos para levantar la aplicación en tu entorno local:

### 1. Clonar el Repositorio
Abre tu terminal y clona el proyecto (asegúrate de estar en la rama desarrollo):

ash
git clone https://github.com/sdiazcatala/info.git
cd info/gelma-web
git checkout desarrollo


### 2. Configurar Variables de Entorno
Crea el archivo .env copiando el ejemplo:

ash
cp .env.example .env

*(En Windows PowerShell usa: Copy-Item .env.example .env)*

> **Nota:** Puedes editar el archivo .env si necesitas cambiar puertos o credenciales, pero los valores por defecto funcionan inmediatamente.

### 3. Levantar la Aplicación
Ejecuta el siguiente comando para construir y arrancar todos los servicios (Base de datos, Backend y Frontend):

ash
docker compose up -d


*La primera vez tardará unos minutos mientras descarga las imágenes.*

### 4. Acceder a la Aplicación
Una vez que los contenedores estén activos:

- ?? **Frontend (Interfaz):** [http://localhost](http://localhost)
- ?? **API (Backend):** [http://localhost:5000/api](http://localhost:5000/api)
- ??? **Base de Datos:** localhost:5432 (solo para conexiones internas o herramientas externas)

## ?? Comandos Útiles de Docker

| Acción | Comando |
| :--- | :--- |
| **Ver estado** | docker compose ps |
| **Ver logs en tiempo real** | docker compose logs -f |
| **Detener aplicación** | docker compose down |
| **Reiniciar cambios** | docker compose up -d --build |
| **Borrar todo (datos incluidos)** | docker compose down -v |

## ?? Estructura del Proyecto

	ext
gelma-web/
+-- server/            # Código del Backend (Node.js/Express)
+-- src/               # Código del Frontend (React/Vite)
+-- docs/              # Documentación técnica adicional
+-- docker-compose.yml # Orquestación de contenedores
+-- Dockerfile         # Configuración de imagen Frontend
+-- nginx.conf         # Configuración del servidor web


## ?? Usuarios de Prueba (Si aplica)
*(Agregar aquí usuarios por defecto si existen en el seed de la BD)*

---
**Desarrollado con ?? por el equipo GELMA**
