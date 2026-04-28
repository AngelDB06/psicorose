const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// @desc    Obtener todas las opiniones
// @route   GET /api/reviews
// @access  Público
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error en getAllReviews:', error.message);
    res.status(500).json({ message: 'Error al obtener las opiniones' });
  }
};

// @desc    Crear una nueva opinión
// @route   POST /api/reviews
// @access  Privado
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'La puntuación y el comentario son obligatorios' });
    }

    // 1. Verificar si el usuario ha tenido al menos una cita completada
    const hasCompletedAppointment = await Appointment.findOne({
      user: req.user._id,
      status: 'completed'
    });

    if (!hasCompletedAppointment) {
      return res.status(403).json({ 
        message: 'Debes haber completado al menos una sesión con la Dra. Rosa para poder dejar una opinión.' 
      });
    }

    // 2. Comprobar si el usuario ya ha dejado una opinión
    const existingReview = await Review.findOne({ user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'Ya has dejado una opinión anteriormente' });
    }

    const review = await Review.create({
      user: req.user._id,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error en createReview:', error.message);
    res.status(500).json({ message: 'Error al publicar la opinión' });
  }
};

// @desc    Eliminar una opinión (Admin o Dueño)
// @route   DELETE /api/reviews/:id
// @access  Privado
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Opinión no encontrada' });
    }

    // Solo el autor o un admin pueden borrar
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para borrar esta opinión' });
    }

    await review.deleteOne();
    res.json({ message: 'Opinión eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteReview:', error.message);
    res.status(500).json({ message: 'Error al eliminar la opinión' });
  }
};
