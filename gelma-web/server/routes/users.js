const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const emailService = require('../services/emailService');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const pool = new Pool();

// ================================================
// OBTENER TODOS LOS USUARIOS (Solo ADMIN)
// GET /api/users
// ================================================
router.get('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, is_verified, is_active, created_at, last_login FROM users ORDER BY created_at DESC'
    );

    res.json({
      message: 'Usuarios obtenidos exitosamente',
      count: result.rows.length,
      users: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// OBTENER USUARIO POR ID (Solo ADMIN)
// GET /api/users/:id
// ================================================
router.get('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, username, email, role, is_verified, is_active, created_at, last_login FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario obtenido exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// ACTUALIZAR ROL DE USUARIO (Solo ADMIN)
// PUT /api/users/:id/role
// ================================================
router.put('/:id/role', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['CONSULTOR', 'MODERADOR', 'EDITOR', 'ADMIN'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ 
      message: 'Rol inválido',
      validRoles: validRoles
    });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Rol actualizado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// VALIDAR/A PROBAR USUARIO (Solo ADMIN)
// PUT /api/users/:id/approve
// ================================================
router.put('/:id/approve', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { role, sendEmail } = req.body;

  const validRoles = ['CONSULTOR', 'MODERADOR', 'EDITOR', 'ADMIN'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ 
      message: 'Rol inválido',
      validRoles: validRoles
    });
  }

  try {
    // Actualizar usuario: aprobar, asignar rol
    const result = await pool.query(
      'UPDATE users SET is_verified = TRUE, is_active = TRUE, role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    // Enviar correo de aprobación si se solicita
    if (sendEmail !== false) {
      try {
        await emailService.sendAccountApprovalEmail(user.email, user.username, user.role);
      } catch (emailError) {
        console.error('Error enviando correo de aprobación:', emailError);
      }
    }

    res.json({
      message: 'Usuario aprobado y rol asignado exitosamente',
      user: user
    });

  } catch (error) {
    console.error('Error aprobando usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// RECHAZAR USUARIO (Solo ADMIN)
// PUT /api/users/:id/reject
// ================================================
router.put('/:id/reject', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const { reason, sendEmail } = req.body;

  try {
    // Obtener usuario antes de desactivar
    const getUser = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [id]
    );

    if (getUser.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado'
      });
    }

    const user = getUser.rows[0];

    // Desactivar usuario
    await pool.query(
      'UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    // Enviar correo de rechazo si se solicita
    if (sendEmail !== false) {
      try {
        await emailService.sendAccountRejectionEmail(user.email, user.username, reason);
      } catch (emailError) {
        console.error('Error enviando correo de rechazo:', emailError);
      }
    }

    res.json({
      message: 'Usuario rechazado y desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error rechazando usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// DESACTIVAR USUARIO (Solo ADMIN)
// PUT /api/users/:id/deactivate
// ================================================
router.put('/:id/deactivate', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, email',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario desactivado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error desactivando usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// ACTIVAR USUARIO (Solo ADMIN)
// PUT /api/users/:id/activate
// ================================================
router.put('/:id/activate', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE users SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, email',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario activado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error activando usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// ELIMINAR USUARIO (Solo ADMIN)
// DELETE /api/users/:id
// ================================================
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username, email',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      message: 'Usuario eliminado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor'
    });
  }
});

// ================================================
// EXPORTAR RUTAS
// ================================================
module.exports = router;
