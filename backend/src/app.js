const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// ──────────────── Configuración de Logs ────────────────
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log de acceso (todas las peticiones)
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Asegurar que la carpeta de uploads existe para persistencia
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir archivos estáticos (avatars, imágenes de blog, etc.)
// Usamos path.join(__dirname, '..', 'uploads') para que coincida con el montaje de K8s en /app/uploads
app.use('/uploads', express.static(uploadsDir));

// ──────────────── Middlewares globales ────────────────

// CORS: permitir peticiones del frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parsear body de las peticiones (JSON y formularios)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Logging de peticiones HTTP en consola para desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ──────────────── Rutas ────────────────

// Ruta de prueba / salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🌹 PsicoRose API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// TODO: Aquí irán las rutas de auth, posts, appointments, etc.
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);


// ──────────────── Manejo de errores ────────────────

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
});

// Error global
app.use((err, req, res, next) => {
  const errorMessage = `[${new Date().toISOString()}] ❌ Error: ${err.message}\n${err.stack}\n\n`;
  
  // Guardar error en archivo
  const errorLogPath = path.join(__dirname, 'logs', 'error.log');
  fs.appendFileSync(errorLogPath, errorMessage);

  console.error('❌ Error:', err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = app;
