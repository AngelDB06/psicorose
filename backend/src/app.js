const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Servir archivos estáticos (avatars, imágenes de blog, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Logging de peticiones HTTP en desarrollo
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
  console.error('❌ Error:', err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

module.exports = app;
