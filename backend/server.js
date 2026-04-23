require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { startReminderJob } = require('./src/jobs/cronJobs');

const PORT = process.env.PORT || 5000;

// Conectar a la base de datos y arrancar el servidor
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor PsicoRose corriendo en http://localhost:${PORT}`);
    console.log(`📋 Entorno: ${process.env.NODE_ENV}`);
  });

  // Arrancar tareas programadas (recordatorios 24h)
  startReminderJob();
};

startServer();
