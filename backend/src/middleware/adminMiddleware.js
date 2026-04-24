const adminMiddleware = (req, res, next) => {
  // Asumimos que authMiddleware ya se ha ejecutado y ha adjuntado req.user
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de administrador' });
  }
};

module.exports = adminMiddleware;
