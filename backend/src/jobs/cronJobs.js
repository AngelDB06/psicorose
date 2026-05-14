const cron = require('node-cron');
const axios = require('axios');
const Appointment = require('../models/Appointment');
const { sendReminder } = require('../services/emailService');

// URL del Webhook de n8n (La configuraremos en las variables de entorno)
const N8N_REMINDER_WEBHOOK = process.env.N8N_WEBHOOK_URL;

/**
 * Tarea que se ejecuta todos los días a las 10:00h.
 * Busca todas las citas del día siguiente y envía un recordatorio
 * a cada paciente a través de n8n (o email directo si no hay webhook).
 */
const startReminderJob = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log('⏰ [Cron] Procesando recordatorios para n8n...');

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const appointments = await Appointment.find({
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: tomorrow, $lt: dayAfterTomorrow },
      }).populate('user', 'name email');

      if (appointments.length === 0) {
        console.log('   → No hay citas para mañana.');
        return;
      }

      for (const appt of appointments) {
        if (N8N_REMINDER_WEBHOOK) {
          // ENVIAR A n8n PARA PROCESAMIENTO CON IA
          await axios.post(N8N_REMINDER_WEBHOOK, {
            email: appt.user.email,
            name: appt.user.name,
            date: appt.date,
            time: appt.time,
            reason: appt.reason,
            type: 'reminder_24h'
          });
          console.log(`   🚀 Enviado a n8n: ${appt.user.email}`);
        } else {
          // Fallback: Email estándar si n8n no está configurado
          await sendReminder(appt.user.email, appt.user.name, {
            date: appt.date,
            time: appt.time,
            reason: appt.reason,
          });
          console.log(`   📧 Email enviado (fallback): ${appt.user.email}`);
        }
      }
    } catch (error) {
      console.error('❌ [Cron] Error en el job de recordatorios:', error.message);
    }
  });

  console.log('🕐 Job de recordatorios listo. Webhook n8n:', N8N_REMINDER_WEBHOOK ? 'Activado' : 'No configurado');
};

module.exports = { startReminderJob };
