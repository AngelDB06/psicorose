const Appointment = require('../models/Appointment');
const { sendBookingConfirmation } = require('../services/emailService');

// @desc    Crear nueva cita
// @route   POST /api/appointments
// @access  Privado
exports.createAppointment = async (req, res) => {
  try {
    const { date, time, reason, notes } = req.body;

    if (!date || !time || !reason) {
      return res.status(400).json({ message: 'Fecha, hora y motivo son obligatorios' });
    }

    // Comprobar que la fecha no sea en el pasado
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ message: 'No puedes reservar una cita en una fecha pasada' });
    }

    // Comprobar que no exista ya una cita en ese día y hora
    const existingAppointment = await Appointment.findOne({
      date: selectedDate,
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Ese horario ya está ocupado. Por favor elige otro.' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      date: selectedDate,
      time,
      reason,
      notes: notes || '',
    });

    // Enviar correo de confirmación (sin bloquear la respuesta si falla)
    sendBookingConfirmation(req.user.email, req.user.name, {
      date: selectedDate,
      time,
      reason,
    }).catch((err) => console.error('⚠️  Error enviando confirmación por email:', err.message));

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error en createAppointment:', error.message);
    res.status(500).json({ message: 'Error al crear la cita' });
  }
};

// @desc    Obtener las citas del usuario autenticado
// @route   GET /api/appointments/me
// @access  Privado
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .sort({ date: 1, time: 1 }); // Ordenar por fecha y hora ascendente

    res.json(appointments);
  } catch (error) {
    console.error('Error en getMyAppointments:', error.message);
    res.status(500).json({ message: 'Error al obtener las citas' });
  }
};

// @desc    Cancelar una cita
// @route   PATCH /api/appointments/:id/cancel
// @access  Privado
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar que la cita pertenece al usuario autenticado
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta cita' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Esta cita ya está cancelada' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'No puedes cancelar una cita completada' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Cita cancelada correctamente', appointment });
  } catch (error) {
    console.error('Error en cancelAppointment:', error.message);
    res.status(500).json({ message: 'Error al cancelar la cita' });
  }
};

// ──────────────── Funciones de Administrador ────────────────

// @desc    Obtener todas las citas (Admin)
// @route   GET /api/appointments
// @access  Privado/Admin
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error en getAllAppointments:', error.message);
    res.status(500).json({ message: 'Error al obtener todas las citas' });
  }
};

// @desc    Actualizar el estado de una cita (Admin)
// @route   PATCH /api/appointments/:id/status
// @access  Privado/Admin
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Estado actualizado correctamente', appointment });
  } catch (error) {
    console.error('Error en updateAppointmentStatus:', error.message);
    res.status(500).json({ message: 'Error al actualizar la cita' });
  }
};
