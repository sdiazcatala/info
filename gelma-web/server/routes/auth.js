const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');
const emailService = require('../services/emailService');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const pool = new Pool();

// ================================================
// REGISTRO DE USUARIO
// POST /api/auth/register
// ================================================
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios',
        fields: ['username', 'email', 'password']
      });
    }

    // Validar formato de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'La contraseña no cumple los requisitos',
        requirements: [
          'Mínimo 8 caracteres',
          'Al menos una letra mayúscula',
          'Al menos una letra minúscula',
          'Al menos un número',
          'Al menos un símbolo especial (@$!%*?&#)'
        ]
      });
    }

    // Validar si el usuario o email ya existen
    const userExists = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        message: 'El usuario o correo electrónico ya están registrados'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insertar usuario (por defecto rol CONSULTOR, no verificado)
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, is_verified, verification_token, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, username, email, role, created_at`,
      [username, email, hashedPassword, 'CONSULTOR', false, verificationToken, true]
    );

    // Enviar correo de verificación
    try {
      await emailService.sendVerificationEmail(email, username, verificationToken);
    } catch (emailError) {
      console.error('Error enviando correo de verificación:', emailError);
      // No fallar el registro si el email falla
    }

    res.status(201).json({ 
      message: 'Registro exitoso. Por favor revise su correo para verificar su cuenta.',
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ================================================
// VERIFICACIÓN DE EMAIL
// GET /api/auth/verify-email
// ================================================
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ 
      message: 'Token de verificación requerido'
    });
  }

  try {
    // Buscar usuario con este token
    const result = await pool.query(
      'UPDATE users SET is_verified = TRUE, verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE verification_token = $1 AND is_verified = FALSE RETURNING id, username, email, role',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Token de verificación inválido o ya utilizado',
        detail: 'El enlace puede haber expirado o ya fue usado'
      });
    }

    res.json({ 
      message: 'Correo verificado exitosamente. Ya puede iniciar sesión.',
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        role: result.rows[0].role
      }
    });

  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({ 
      message: 'Error al verificar el correo'
    });
  }
});

// ================================================
// LOGIN
// POST /api/auth/login
// ================================================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Usuario y contraseña son obligatorios'
    });
  }

  try {
    // Buscar usuario
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const user = result.rows[0];

    // Verificar si está activo
    if (!user.is_active) {
      return res.status(403).json({ 
        message: 'Tu cuenta ha sido desactivada',
        detail: 'Contacta al administrador del sistema'
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrectos'
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        isVerified: user.is_verified,
        isActive: user.is_active
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '8h' }
    );

    // Actualizar último login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'Login exitoso',
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
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// OLVIDÉ MI CONTRASEÑA - SOLICITUD
// POST /api/auth/forgot-password
// ================================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      message: 'Correo electrónico obligatorio'
    });
  }

  try {
    // Buscar usuario
    const result = await pool.query(
      'SELECT id, username, email, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // No revelar si el email existe o no por seguridad
      return res.json({ 
        message: 'Si el correo está registrado, recibirás un enlace de recuperación'
      });
    }

    const user = result.rows[0];

    // Verificar que esté verificado
    if (!user.is_verified) {
      return res.status(403).json({ 
        message: 'Debe verificar su correo electrónico primero'
      });
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en BD
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [resetToken, resetTokenExpires, user.id]
    );

    // Enviar correo de recuperación
    try {
      await emailService.sendPasswordResetEmail(user.email, user.username, resetToken);
    } catch (emailError) {
      console.error('Error enviando correo de recuperación:', emailError);
    }

    res.json({ 
      message: 'Si el correo está registrado, recibirás un enlace de recuperación'
    });

  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// VALIDAR TOKEN DE RECUPERACIÓN
// GET /api/auth/validate-reset-token
// ================================================
router.get('/validate-reset-token', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ 
      message: 'Token de recuperación requerido'
    });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, email, reset_token_expires FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Token inválido o expirado',
        detail: 'El enlace de recuperación ha expirado. Solicita uno nuevo.'
      });
    }

    res.json({ 
      message: 'Token válido',
      user: {
        username: result.rows[0].username,
        email: result.rows[0].email
      }
    });

  } catch (error) {
    console.error('Error validando token:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// RESTABLECER CONTRASEÑA
// POST /api/auth/reset-password
// ================================================
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ 
      message: 'Token y nueva contraseña son obligatorios'
    });
  }

  // Validar formato de contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ 
      message: 'La contraseña no cumple los requisitos',
      requirements: [
        'Mínimo 8 caracteres',
        'Al menos una letra mayúscula',
        'Al menos una letra minúscula',
        'Al menos un número',
        'Al menos un símbolo especial (@$!%*?&#)'
      ]
    });
  }

  try {
    // Verificar token
    const result = await pool.query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Token inválido o expirado'
      });
    }

    const userId = result.rows[0].id;

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ 
      message: 'Contraseña restablecida exitosamente'
    });

  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// EXPORTAR RUTAS
// ================================================
module.exports = router;
