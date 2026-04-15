const jwt = require('jsonwebtoken');

// ================================================
// MIDDLEWARE: Autenticación con JWT
// ================================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      message: 'Token de acceso requerido',
      detail: 'Debes iniciar sesión para acceder a este recurso'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ 
          message: 'Token expirado',
          detail: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente'
        });
      }
      return res.status(403).json({ 
        message: 'Token inválido',
        detail: 'El token proporcionado no es válido'
      });
    }
    
    req.user = user;
    next();
  });
};

// ================================================
// MIDDLEWARE: Autorización por Roles
// ================================================
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'No tiene permisos para realizar esta acción',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

// ================================================
// MIDDLEWARE: Verificar que usuario está verificado
// ================================================
const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ 
      message: 'Debe verificar su correo electrónico primero',
      detail: 'Revise su bandeja de entrada y haga clic en el enlace de verificación'
    });
  }
  next();
};

// ================================================
// MIDDLEWARE: Verificar que usuario está activo
// ================================================
const requireActive = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({ 
      message: 'Tu cuenta ha sido desactivada',
      detail: 'Contacta al administrador del sistema'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireVerified,
  requireActive
};
