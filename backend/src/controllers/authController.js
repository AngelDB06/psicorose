const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función helper para generar el token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Público
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario con ese email ya existe' });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      phone,
      password, // La encriptación se hace automáticamente en el modelo (pre-save)
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error en register:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al registrar' });
  }
};

// @desc    Autenticar usuario e iniciar sesión
// @route   POST /api/auth/login
// @access  Público
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por email (y pedir explícitamente la contraseña, ya que está en select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Comprobar si la contraseña coincide (método creado en el modelo)
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar respuesta con todos los datos necesarios
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al hacer login' });
  }
};

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/me
// @access  Privado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PATCH /api/auth/update-profile
// @access  Privado
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos básicos
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Si hay un archivo subido (avatar)
    if (req.file) {
      // Guardamos la ruta relativa que se servirá estáticamente
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      message: 'Perfil actualizado correctamente'
    });
  } catch (error) {
    console.error('Error en updateProfile:', error.message);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};
