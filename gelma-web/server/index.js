require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Módulo nativo, no instalar
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Base de Datos
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gelma_db',
});

// Configuración de Nodemailer (Correo GELMA)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // true para 465, false para otros puertos (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Necesario si el certificado del servidor corporativo es autofirmado
  }
});

// Middleware de Autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
};

// Middleware de Autorización por Roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tiene permisos para realizar esta acción' });
    }
    next();
  };
};

// --- RUTAS DE AUTENTICACIÓN ---

// Registro
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Validar si el usuario existe
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario o correo ya existen' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Insertar usuario con rol VIEWER y no verificado
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, role, is_verified, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [username, email, hashedPassword, 'VIEWER', false, verificationToken]
    );

    // Enviar correo de verificación
    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Confirmación de Registro - Sistema GELMA',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Bienvenido a GELMA</h2>
          <p>Hola <strong>${username}</strong>,</p>
          <p>Gracias por registrarte en nuestro sistema de comercialización.</p>
          <p>Para completar tu registro y activar tu cuenta con permisos de consulta, por favor haz clic en el siguiente enlace:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Verificar Correo Electrónico
          </a>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <hr>
          <p><small>Este enlace expirará en 24 horas. Si no solicitaste este registro, ignora este correo.</small></p>
          <p><small>Departamento de Comercialización - GELMA</small></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Registro exitoso. Por favor revise su correo para verificar su cuenta.' });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Verificar Email
app.get('/api/auth/verify-email', async (req, res) => {
  const { token } = req.query;
  
  try {
    const result = await pool.query(
      'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = $1 AND is_verified = FALSE RETURNING *',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido o ya utilizado.' });
    }

    res.json({ message: 'Correo verificado exitosamente. Puede iniciar sesión.' });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({ message: 'Error al verificar el correo' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Debe verificar su correo electrónico antes de iniciar sesión. Revise su bandeja de entrada.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// --- RUTAS DE EJEMPLO PROTEGIDAS ---

app.get('/api/users', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, is_verified FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});