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

- **React 18** - Framework de JavaScript para interfaces de usuario
- **Vite** - Build tool y servidor de desarrollo
- **React Router DOM** - Navegación entre páginas
- **CSS3** - Estilos modernos y responsivos

## Instalación

```bash
# Navegar al directorio del proyecto
cd gelma-web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
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
├── index.html           # HTML principal
├── package.json         # Dependencias y scripts
└── vite.config.js       # Configuración de Vite
```

## Uso

1. **Iniciar la aplicación**: Ejecutar `npm run dev` para iniciar el servidor de desarrollo
2. **Acceder**: Abrir el navegador en `http://localhost:3000`
3. **Navegar**: Usar el menú lateral para acceder a las diferentes secciones
4. **Gestionar datos**: Añadir, editar y eliminar registros según sea necesario
5. **Generar informes**: Acceder a la sección de informes para visualizar estadísticas

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

- [ ] Autenticación de usuarios
- [ ] Base de datos real (actualmente usa estado local)
- [ ] API REST para comunicación backend
- [ ] Notificaciones en tiempo real
- [ ] Dashboard personalizado por rol
- [ ] Historial de cambios y auditoría
- [ ] Integración con sistemas de pago
- [ ] Envío de emails automáticos

## Licencia

Proyecto desarrollado para la entidad GELMA.

---

**Nota**: Esta es una aplicación frontend demostrativa. Para un entorno de producción, se recomienda implementar:
- Backend con base de datos persistente
- Sistema de autenticación y autorización
- Validaciones del lado del servidor
- Copias de seguridad automáticas
