const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const pool = new Pool();

// ================================================
// OBTENER TODOS LOS PRODUCTOS
// GET /api/products
// ================================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE is_active = TRUE ORDER BY name'
    );

    res.json({
      message: 'Productos obtenidos exitosamente',
      count: result.rows.length,
      products: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// CREAR PRODUCTO
// POST /api/products
// ================================================
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const userId = req.user.id;

  if (!name || price === undefined) {
    return res.status(400).json({ 
      message: 'Nombre y precio son obligatorios'
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock || 0, category, userId]
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// ACTUALIZAR PRODUCTO
// PUT /api/products/:id
// ================================================
router.put('/:id', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, description, price, stock, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// ELIMINAR PRODUCTO (Lógico)
// DELETE /api/products/:id
// ================================================
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE products SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto eliminado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
