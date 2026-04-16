const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const pool = new Pool();

// ================================================
// OBTENER TODOS LOS REPORTES
// GET /api/reports
// ================================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, 
              u1.username as created_by_name,
              u2.username as validated_by_name
       FROM reports r
       LEFT JOIN users u1 ON r.created_by = u1.id
       LEFT JOIN users u2 ON r.validated_by = u2.id
       ORDER BY r.created_at DESC`
    );

    res.json({
      message: 'Reportes obtenidos exitosamente',
      count: result.rows.length,
      reports: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// CREAR REPORTE
// POST /api/reports
// ================================================
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'EDITOR', 'CONSULTOR'), async (req, res) => {
  const { title, description, report_type } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ 
      message: 'Título es obligatorio'
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO reports (title, description, report_type, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, report_type, userId]
    );

    res.status(201).json({
      message: 'Reporte creado exitosamente',
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// VALIDAR REPORTE (Moderador/Admin)
// PUT /api/reports/:id/validate
// ================================================
router.put('/:id/validate', authenticateToken, authorizeRoles('ADMIN', 'MODERADOR'), async (req, res) => {
  const { id } = req.params;
  const { validation_notes, action } = req.body; // action: 'approve' o 'reject'
  const userId = req.user.id;

  if (!action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ 
      message: 'Acción inválida. Debe ser "approve" o "reject"'
    });
  }

  try {
    const newStatus = action === 'approve' ? 'Validado' : 'Rechazado';
    
    const result = await pool.query(
      `UPDATE reports 
       SET status = $1, validated_by = $2, validated_at = CURRENT_TIMESTAMP, validation_notes = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING *`,
      [newStatus, userId, validation_notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    res.json({
      message: `Reporte ${action === 'approve' ? 'validado' : 'rechazado'} exitosamente`,
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Error validando reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ================================================
// CONSOLIDAR REPORTE (Moderador/Admin)
// PUT /api/reports/:id/consolidate
// ================================================
router.put('/:id/consolidate', authenticateToken, authorizeRoles('ADMIN', 'MODERADOR'), async (req, res) => {
  const { id } = req.params;

  try {
    // Solo se pueden consolidar reportes validados
    const checkReport = await pool.query(
      'SELECT status FROM reports WHERE id = $1',
      [id]
    );

    if (checkReport.rows.length === 0) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    if (checkReport.rows[0].status !== 'Validado') {
      return res.status(400).json({ 
        message: 'Solo se pueden consolidar reportes validados',
        currentStatus: checkReport.rows[0].status
      });
    }

    const result = await pool.query(
      'UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['Consolidado', id]
    );

    res.json({
      message: 'Reporte consolidado exitosamente',
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Error consolidando reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
