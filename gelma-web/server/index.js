require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();

// ================================================
// CONFIGURACIÓN
// ================================================

// CORS configurado
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

app.use(express.json());

// Pool de Base de Datos
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gelma_db',
  max: 20, // máximo número de clientes
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ================================================
// IMPORTACIÓN DE MÓDULOS
// ================================================

const emailService = require('./services/emailService');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const reportRoutes = require('./routes/reports');

// ================================================
// RUTAS
// ================================================

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios (protegidas)
app.use('/api/users', userRoutes);

// Rutas de clientes (protegidas)
app.use('/api/clients', clientRoutes);

// Rutas de productos (protegidas)
app.use('/api/products', productRoutes);

// Rutas de pedidos (protegidas)
app.use('/api/orders', orderRoutes);

// Rutas de reportes (protegidas)
app.use('/api/reports', reportRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ================================================
// MANEJO DE ERRORES
// ================================================

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Error de validación de PostgreSQL
  if (err.code === '23505') {
    return res.status(400).json({ 
      message: 'Recurso duplicado',
      detail: 'Ya existe un registro con estos datos'
    });
  }

  // Error de conexión a base de datos
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ 
      message: 'Servicio no disponible',
      detail: 'Error de conexión a base de datos'
    });
  }

  res.status(500).json({ 
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// ================================================
// INICIALIZACIÓN DEL SERVIDOR
// ================================================

const PORT = process.env.PORT || 5000;

// Verificar conexión a base de datos
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    console.log('⚠️  Asegúrate de tener PostgreSQL corriendo y la base de datos creada');
  } else {
    console.log('✅ Conectado a la base de datos PostgreSQL');
    release();
  }
});

// Verificar configuración de correo
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error configurando el servicio de correo:', error.message);
    console.log('⚠️  Configura las variables SMTP en el archivo .env');
    console.log('💡 Para desarrollo, usa: https://ethereal.email');
  } else {
    console.log('✅ Servicio de correo configurado correctamente');
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor backend GELMA corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`);
});

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('\n🛑 Señal SIGTERM recibida, cerrando servidor...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Señal SIGINT recibida, cerrando servidor...');
  await pool.end();
  process.exit(0);
});

module.exports = app;
