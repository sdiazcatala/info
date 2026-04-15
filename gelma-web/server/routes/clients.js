const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const pool = new Pool();

// ================================================
// OBTENER TODOS LOS CLIENTES
// GET /api/clients
// ================================================
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE is_active = TRUE ORDER BY name'
    );

    res.json({
      message: 'Clientes obtenidos exitosamente',
      count: result.rows.length,
      clients: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// CREAR CLIENTE
// POST /api/clients
// ================================================
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { name, email, phone, address, client_type } = req.body;
  const userId = req.user.id;

  if (!name || !client_type) {
    return res.status(400).json({ 
      message: 'Nombre y tipo de cliente son obligatorios'
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO clients (name, email, phone, address, client_type, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, address, client_type, userId]
    );

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      client: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// ACTUALIZAR CLIENTE
// PUT /api/clients/:id
// ================================================
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, client_type } = req.body;

  try {
    const result = await pool.query(
      'UPDATE clients SET name = $1, email = $2, phone = $3, address = $4, client_type = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, email, phone, address, client_type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({
      message: 'Cliente actualizado exitosamente',
      client: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// ELIMINAR CLIENTE (Lógico)
// DELETE /api/clients/:id
// ================================================
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE clients SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({
      message: 'Cliente eliminado exitosamente',
      client: result.rows[0]
    });

  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
