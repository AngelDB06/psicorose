const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendReminder } = require('../services/emailService');

/**
 * Tarea que se ejecuta cada hora.
 * Busca citas que sean exactamente en 24 horas (+/- 30 min de margen)
 * y envía un correo de recordatorio al paciente.
 */
const startReminderJob = () => {
  // Se ejecuta cada hora en punto (ej: 16:00, 17:00, 18:00...)
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Comprobando citas para recordatorios 24h...');

    try {
      const now = new Date();

      // Ventana de búsqueda: entre 23h30 y 24h30 desde ahora
      const windowStart = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);
      const windowEnd   = new Date(now.getTime() + 24.5 * 60 * 60 * 1000);

      // Buscar citas activas dentro de esa ventana temporal
      const appointments = await Appointment.find({
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: windowStart, $lte: windowEnd },
      }).populate('user', 'name email');

      if (appointments.length === 0) {
        console.log('   → No hay citas próximas en las siguientes 24h.');
        return;
      }

      for (const appt of appointments) {
        // Verificar que la hora de la cita coincide con la hora actual + 24h
        const [apptHour] = appt.time.split(':').map(Number);
        const targetHour = new Date(windowStart).getHours();

        // Solo enviamos si la hora de la cita coincide con la franja horaria actual
        if (Math.abs(apptHour - targetHour) <= 1) {
          await sendReminder(appt.user.email, appt.user.name, {
            date: appt.date,
            time: appt.time,
            reason: appt.reason,
          });
        }
      }
    } catch (error) {
      console.error('❌ Error en el cron job de recordatorios:', error.message);
    }
  });

  console.log('🕐 Cron job de recordatorios iniciado (cada hora).');
};

module.exports = { startReminderJob };
