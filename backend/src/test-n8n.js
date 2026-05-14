const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { startReminderJob } = require('./jobs/cronJobs');

dotenv.config();

// Conectamos a la base de datos y forzamos la ejecución
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🚀 Probando envío a n8n...');
    // Llamamos a la lógica directamente (sin esperar a las 10:00)
    // Para probarlo, vamos a extraer la lógica o simplemente 
    // ejecutar la función que hemos creado.
    
    // Nota: Como startReminderJob usa cron.schedule, 
    // vamos a ejecutar un pequeño código manual aquí para probar el webhook.
    const axios = require('axios');
    const N8N_URL = process.env.N8N_WEBHOOK_URL;
    
    if (!N8N_URL) {
      console.error('❌ Error: N8N_WEBHOOK_URL no está definida en el .env');
      process.exit(1);
    }

    try {
      await axios.post(N8N_URL, {
        name: "Paciente de Prueba",
        email: process.env.EMAIL_USER, // Te lo envías a ti mismo
        date: "Mañana",
        time: "12:00",
        reason: "Consulta de seguimiento",
        type: "test"
      });
      console.log('✅ ¡Webhook enviado con éxito a n8n!');
    } catch (e) {
      console.error('❌ Error al contactar con n8n:', e.message);
    }
    
    mongoose.connection.close();
  });
