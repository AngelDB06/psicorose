const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'La fecha de la cita es obligatoria'],
    },
    time: {
      type: String,
      required: [true, 'La hora de la cita es obligatoria'],
    },
    reason: {
      type: String,
      required: [true, 'El motivo de la consulta es obligatorio'],
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
