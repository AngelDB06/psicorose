const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'La puntuación es obligatoria'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'El comentario es obligatorio'],
      trim: true,
      maxlength: [500, 'El comentario no puede exceder los 500 caracteres'],
    },
    isApproved: {
      type: Boolean,
      default: true, // Podríamos ponerlo en false si queremos moderación
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
