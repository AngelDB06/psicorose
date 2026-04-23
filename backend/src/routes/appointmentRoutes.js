const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas de citas requieren autenticación
router.use(authMiddleware);

router.post('/', appointmentController.createAppointment);
router.get('/me', appointmentController.getMyAppointments);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
