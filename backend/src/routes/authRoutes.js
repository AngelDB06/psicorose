const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas privadas (futuro: requerirán middleware authMiddleware)
// router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
