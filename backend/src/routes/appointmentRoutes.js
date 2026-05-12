const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Todas las rutas de citas requieren autenticación
router.use(authMiddleware);

router.post('/', appointmentController.createAppointment);
router.get('/me', appointmentController.getMyAppointments);
router.get('/booked-slots', appointmentController.getBookedSlots);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

// ──────────────── Rutas de Administrador ────────────────
router.get('/', adminMiddleware, appointmentController.getAllAppointments);
router.patch('/:id/status', adminMiddleware, appointmentController.updateAppointmentStatus);

module.exports = router;
