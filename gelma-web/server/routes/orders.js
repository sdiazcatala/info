const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const pool = new Pool();

// ================================================
// OBTENER TODOS LOS PEDIDOS
// GET /api/orders
// ================================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, c.name as client_name 
       FROM orders o 
       LEFT JOIN clients c ON o.client_id = c.id 
       ORDER BY o.created_at DESC`
    );

    res.json({
      message: 'Pedidos obtenidos exitosamente',
      count: result.rows.length,
      orders: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// CREAR PEDIDO
// POST /api/orders
// ================================================
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { client_id, total, status, notes } = req.body;
  const userId = req.user.id;

  if (!client_id) {
    return res.status(400).json({ 
      message: 'Cliente es obligatorio'
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO orders (client_id, user_id, total, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [client_id, userId, total, status || 'Pendiente', notes]
    );

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// ACTUALIZAR PEDIDO
// PUT /api/orders/:id
// ================================================
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { id } = req.params;
  const { client_id, total, status, notes } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET client_id = $1, total = $2, status = $3, notes = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [client_id, total, status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json({
      message: 'Pedido actualizado exitosamente',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando pedido:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
