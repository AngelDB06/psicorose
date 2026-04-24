const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendReminder } = require('../services/emailService');

/**
 * Tarea que se ejecuta todos los días a las 10:00h.
 * Busca todas las citas del día siguiente y envía un recordatorio
 * a cada paciente.
 */
const startReminderJob = () => {
  // Se ejecuta cada día a las 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('⏰ [Cron] Enviando recordatorios de citas para mañana...');

    try {
      // Calcular el rango de "mañana" (de 00:00:00 a 23:59:59 UTC)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Buscar todas las citas activas para mañana
      const appointments = await Appointment.find({
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: tomorrow, $lt: dayAfterTomorrow },
      }).populate('user', 'name email');

      if (appointments.length === 0) {
        console.log('   → No hay citas programadas para mañana.');
        return;
      }

      console.log(`   → Enviando ${appointments.length} recordatorio(s)...`);

      for (const appt of appointments) {
        try {
          await sendReminder(appt.user.email, appt.user.name, {
            date: appt.date,
            time: appt.time,
            reason: appt.reason,
          });
        } catch (emailErr) {
          console.error(`   ⚠️ Error enviando recordatorio a ${appt.user.email}:`, emailErr.message);
        }
      }

      console.log('   ✅ Recordatorios enviados correctamente.');
    } catch (error) {
      console.error('❌ [Cron] Error en el job de recordatorios:', error.message);
    }
  });

  console.log('🕐 Cron job de recordatorios iniciado (cada día a las 10:00h).');
};

module.exports = { startReminderJob };

