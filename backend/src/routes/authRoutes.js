const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas privadas
router.get('/me', authMiddleware, authController.getMe);
router.patch('/update-profile', authMiddleware, upload.single('avatar'), authController.updateProfile);

module.exports = router;
