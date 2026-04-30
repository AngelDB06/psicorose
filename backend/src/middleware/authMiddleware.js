const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Leer el token del header Authorization o de la query string
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado: no se ha proporcionado token' });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar el usuario al request (sin la contraseña)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado: el usuario no existe' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'No autorizado: token inválido o expirado' });
  }
};

module.exports = authMiddleware;
