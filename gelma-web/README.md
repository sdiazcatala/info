# GELMA - Sistema de Comercialización

Web application para informatizar el flujo informativo de la actividad de comercialización de la entidad GELMA.

## Características

El sistema incluye las siguientes funcionalidades:

### 📊 Dashboard
- Vista general con estadísticas clave
- Resumen de clientes, productos y pedidos
- Pedidos recientes con estado actualizado
- Métricas de ventas del mes

### 👥 Gestión de Clientes
- Listado completo de clientes
- Alta de nuevos clientes (mayoristas, minoristas, distribuidores)
- Información de contacto completa
- Eliminación de registros

### 📦 Gestión de Productos
- Catálogo de productos
- Control de stock con indicadores visuales
- Categorización de productos
- Precios y descripciones detalladas

### 🛒 Gestión de Pedidos
- Creación de nuevos pedidos
- Seguimiento de estado (Pendiente, En Proceso, Completado)
- Cálculo automático de totales
- Historial de pedidos por cliente

### 📈 Informes y Estadísticas
- Informes de ventas mensuales con gráficos
- Análisis de productos más vendidos
- Reportes de actividad por cliente
- Exportación a PDF y Excel (funcionalidad preparada)
- Filtros por fecha y tipo de informe

## Tecnologías Utilizadas

- **Frontend**: React 18, Vite, React Router DOM, CSS3
- **Backend**: Node.js, Express.js, JWT, bcryptjs
- **Base de Datos**: PostgreSQL 15
- **Containerización**: Docker, Docker Compose
- **Servidor Web**: Nginx (para producción)

## Instalación

### Opción 1: Con Docker (Recomendado)

```bash
# Navegar al directorio del proyecto
cd gelma-web

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

Para más detalles, consulta [Documentación Docker](docs/DOCKER.md).

### Opción 2: Manual (Desarrollo)

```bash
# Navegar al directorio del proyecto
cd gelma-web

# Instalar dependencias del frontend
npm install

# Iniciar servidor de desarrollo del frontend
npm run dev

# En otra terminal, instalar dependencias del backend
cd server
npm install

# Iniciar servidor de desarrollo del backend
npm run dev
```

## Estructura del Proyecto

```
gelma-web/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   │   ├── Dashboard.jsx
│   │   ├── Clientes.jsx
│   │   ├── Productos.jsx
│   │   ├── Pedidos.jsx
│   │   └── Informes.jsx
│   ├── services/        # Servicios y APIs
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos globales
│   ├── index.css        # Estilos base
│   └── main.jsx         # Punto de entrada
├── server/              # Backend Express.js
│   ├── routes/          # Rutas de la API
│   ├── controllers/     # Controladores
│   ├── middleware/      # Middleware (auth, validación)
│   ├── database/        # Scripts SQL (schema, seed)
│   ├── Dockerfile       # Configuración Docker backend
│   └── package.json     # Dependencias del backend
├── docs/                # Documentación del proyecto
├── Dockerfile           # Configuración Docker frontend
├── docker-compose.yml   # Orquestación de servicios
├── nginx.conf           # Configuración de Nginx
├── index.html           # HTML principal
├── package.json         # Dependencias y scripts
└── vite.config.js       # Configuración de Vite
```

## Uso

### Con Docker

1. **Configurar entorno**: `cp .env.example .env` y editar variables
2. **Iniciar servicios**: `docker-compose up -d`
3. **Acceder**: 
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - Base de datos: localhost:5432

### Desarrollo Manual

1. **Iniciar la aplicación**: Ejecutar `npm run dev` para iniciar el servidor de desarrollo del frontend
2. **Iniciar backend**: En otra terminal, `cd server && npm run dev`
3. **Acceder**: Abrir el navegador en `http://localhost:3000`
4. **Navegar**: Usar el menú lateral para acceder a las diferentes secciones
5. **Gestionar datos**: Añadir, editar y eliminar registros según sea necesario
6. **Generar informes**: Acceder a la sección de informes para visualizar estadísticas

## Funcionalidades Destacadas

- ✅ Interfaz intuitiva y moderna
- ✅ Diseño responsivo
- ✅ Gestión completa de CRUD para todas las entidades
- ✅ Indicadores visuales de estado (badges de colores)
- ✅ Gráficos de ventas integrados
- ✅ Cálculos automáticos de totales
- ✅ Validación de formularios
- ✅ Modales para operaciones de alta

## Próximas Mejoras

- [x] Autenticación de usuarios (implementada en backend)
- [x] Base de datos real con PostgreSQL
- [x] API REST para comunicación backend
- [x] Containerización con Docker
- [ ] Notificaciones en tiempo real
- [ ] Dashboard personalizado por rol
- [ ] Historial de cambios y auditoría
- [ ] Integración con sistemas de pago
- [ ] Envío de emails automáticos (configurado, pendiente pruebas)

## Licencia

Proyecto desarrollado para la entidad GELMA.

---

**Nota**: Esta es una aplicación frontend demostrativa. Para un entorno de producción, se recomienda implementar:
- Backend con base de datos persistente
- Sistema de autenticación y autorización
- Validaciones del lado del servidor
- Copias de seguridad automáticas
