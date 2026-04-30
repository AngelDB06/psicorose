const PDFDocument = require('pdfkit');
const Appointment = require('../models/Appointment');

// @desc    Generar informe PDF de las citas del usuario
// @route   GET /api/reports/appointments
// @access  Privado
exports.generateUserReport = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate('user', 'name email');

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No hay citas para generar el informe' });
    }

    const doc = new PDFDocument({ margin: 50 });

    // Configurar respuesta HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=historial_psicorose_${req.user.name.replace(/\s+/g, '_')}.pdf`);

    doc.pipe(res);

    // --- CABECERA ---
    doc
      .fillColor('#be185d') // Color primary-700
      .fontSize(25)
      .text('PsicoRose', { align: 'right' })
      .fontSize(10)
      .fillColor('#475569')
      .text('Dra. Rosa María Barranco Torres', { align: 'right' })
      .text('Gabinete de Psicología Especializada', { align: 'right' })
      .moveDown();

    doc
      .strokeColor('#e2e8f0')
      .lineWidth(1)
      .moveTo(50, 100)
      .lineTo(550, 100)
      .stroke();

    doc.moveDown(2);

    // --- TÍTULO ---
    doc
      .fillColor('#1e293b')
      .fontSize(20)
      .text('Historial de Sesiones', { underline: true });
    
    doc.moveDown();

    // --- DATOS DEL PACIENTE ---
    doc
      .fontSize(12)
      .fillColor('#64748b')
      .text(`Paciente: `, { continued: true })
      .fillColor('#1e293b')
      .text(req.user.name)
      .fillColor('#64748b')
      .text(`Email: `, { continued: true })
      .fillColor('#1e293b')
      .text(req.user.email)
      .text(`Fecha del informe: ${new Date().toLocaleDateString('es-ES')}`)
      .moveDown(2);

    // --- TABLA DE CITAS ---
    const tableTop = 250;
    doc.fontSize(10).fillColor('#475569').font('Helvetica-Bold');
    doc.text('FECHA', 50, tableTop);
    doc.text('HORA', 150, tableTop);
    doc.text('MOTIVO', 220, tableTop);
    doc.text('ESTADO', 450, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let y = tableTop + 30;
    doc.font('Helvetica');

    appointments.forEach((appt) => {
      // Si llegamos al final de la página, añadir una nueva
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      const date = new Date(appt.date).toLocaleDateString('es-ES');
      const statusText = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        cancelled: 'Cancelada',
        completed: 'Completada'
      }[appt.status];

      doc.fillColor('#1e293b').text(date, 50, y);
      doc.text(appt.time, 150, y);
      doc.text(appt.reason, 220, y, { width: 220 });
      
      // Color según estado
      const statusColors = {
        pending: '#b45309',
        confirmed: '#15803d',
        cancelled: '#b91c1c',
        completed: '#475569'
      };
      
      doc.fillColor(statusColors[appt.status]).text(statusText, 450, y);

      y += 30;
      doc.moveTo(50, y - 5).lineTo(550, y - 5).strokeColor('#f1f5f9').stroke();
    });

    // --- PIE DE PÁGINA ---
    doc
      .fontSize(8)
      .fillColor('#94a3b8')
      .text(
        'Este documento es un resumen informativo de sus citas en la plataforma PsicoRose. No tiene validez legal como factura a menos que se indique lo contrario.',
        50,
        750,
        { align: 'center', width: 500 }
      );

    doc.end();

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ message: 'Error al generar el documento PDF' });
  }
};
