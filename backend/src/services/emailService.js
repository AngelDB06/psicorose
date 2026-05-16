const nodemailer = require('nodemailer');

// ──────────────── Configuración del transportador ────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ──────────────── Helpers ────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getGreeting = (time) => {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PsicoRose</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f5f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f5f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #be5d87 0%, #9c3d65 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0;font-size:32px;">🌹</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">PsicoRose</h1>
              <p style="margin:4px 0 0;color:#f3c8db;font-size:13px;font-weight:500;">Consulta de Psicología</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
              ${content}
              
              <!-- Footer -->
              <hr style="border:none;border-top:1px solid #f0e6ec;margin:32px 0;" />
              <p style="margin:0;color:#b0809a;font-size:12px;text-align:center;line-height:1.6;">
                Este correo ha sido enviado automáticamente. Por favor, no respondas a este mensaje.<br />
                Si tienes alguna duda, contacta con nosotros en 
                <a href="mailto:${process.env.EMAIL_USER}" style="color:#be5d87;">${process.env.EMAIL_USER}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ──────────────── Correo de registro de cita (Pendiente) ────────────────
const sendBookingConfirmation = async (userEmail, userName, appointment) => {
  const { date, time, reason } = appointment;
  const greeting = getGreeting(time);
  const firstName = userName.split(' ')[0];
  const formattedDate = formatDate(date);

  const content = `
    <h2 style="margin:0 0 8px;color:#3d1a29;font-size:22px;font-weight:700;">
      ${greeting}, ${firstName} 👋
    </h2>
    <p style="margin:0 0 24px;color:#7a5a6a;font-size:15px;line-height:1.7;">
      Hemos recibido tu solicitud de cita. Ahora mismo está <strong>pendiente de confirmación</strong> por parte de la Dra. Rosa.
    </p>

    <!-- Tarjeta de cita -->
    <div style="background:linear-gradient(135deg,#fdf0f5,#f9e6ef);border:1px solid #f0c8d8;border-radius:12px;padding:24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;">
            <span style="display:inline-block;width:28px;font-size:16px;">📋</span>
            <strong style="color:#6d2b4a;font-size:14px;">Tipo de consulta:</strong>
          </td>
          <td style="padding:8px 0;color:#3d1a29;font-weight:600;font-size:14px;text-align:right;">${reason}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;">
            <span style="display:inline-block;width:28px;font-size:16px;">📅</span>
            <strong style="color:#6d2b4a;font-size:14px;">Fecha:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;color:#3d1a29;font-weight:600;font-size:14px;text-align:right;text-transform:capitalize;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;">
            <span style="display:inline-block;width:28px;font-size:16px;">🕐</span>
            <strong style="color:#6d2b4a;font-size:14px;">Hora:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;color:#3d1a29;font-weight:600;font-size:14px;text-align:right;">${time}h</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;">
            <span style="display:inline-block;width:28px;font-size:16px;">📍</span>
            <strong style="color:#6d2b4a;font-size:14px;">Estado:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;text-align:right;">
            <span style="background:#fff9c4;color:#856404;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;">Pendiente de confirmación</span>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 20px;color:#7a5a6a;font-size:15px;line-height:1.7;">
      Te enviaremos otro correo en cuanto la Dra. Rosa confirme la disponibilidad.
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `⏳ Cita pendiente de confirmación – PsicoRose`,
    html: baseTemplate(content),
  });

  console.log(`📧 Correo de cita pendiente enviado a ${userEmail}`);
};

// ──────────────── Correo de confirmación de cita (Confirmada) ────────────────
const sendAppointmentConfirmed = async (userEmail, userName, appointment) => {
  const { date, time, reason } = appointment;
  const greeting = getGreeting(time);
  const firstName = userName.split(' ')[0];
  const formattedDate = formatDate(date);

  const content = `
    <h2 style="margin:0 0 8px;color:#3d1a29;font-size:22px;font-weight:700;">
      ¡Cita confirmada! 🌹
    </h2>
    <p style="margin:0 0 24px;color:#7a5a6a;font-size:15px;line-height:1.7;">
      ${greeting}, ${firstName}. La Dra. Rosa ha <strong>confirmado tu cita</strong>. Te esperamos en la consulta:
    </p>

    <!-- Tarjeta de cita -->
    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;">
            <span style="display:inline-block;width:28px;font-size:16px;">📋</span>
            <strong style="color:#166534;font-size:14px;">Tipo de consulta:</strong>
          </td>
          <td style="padding:8px 0;color:#14532d;font-weight:600;font-size:14px;text-align:right;">${reason}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #bbf7d0;">
            <span style="display:inline-block;width:28px;font-size:16px;">📅</span>
            <strong style="color:#166534;font-size:14px;">Fecha:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #bbf7d0;color:#14532d;font-weight:600;font-size:14px;text-align:right;text-transform:capitalize;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #bbf7d0;">
            <span style="display:inline-block;width:28px;font-size:16px;">🕐</span>
            <strong style="color:#166534;font-size:14px;">Hora:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #bbf7d0;color:#14532d;font-weight:600;font-size:14px;text-align:right;">${time}h</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #bbf7d0;">
            <span style="display:inline-block;width:28px;font-size:16px;">📍</span>
            <strong style="color:#166534;font-size:14px;">Estado:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #bbf7d0;text-align:right;">
            <span style="background:#22c55e;color:#ffffff;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;">Confirmada</span>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 20px;color:#7a5a6a;font-size:15px;line-height:1.7;">
      Recuerda que si no puedes asistir, debes avisar con al menos 24 horas de antelación.
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `✅ Cita CONFIRMADA para el ${formattedDate} – PsicoRose`,
    html: baseTemplate(content),
  });

  console.log(`📧 Correo de confirmación definitiva enviado a ${userEmail}`);
};

// ──────────────── Correo de recordatorio 24h ────────────────
const sendReminder = async (userEmail, userName, appointment) => {
  const { date, time, reason } = appointment;
  const greeting = getGreeting(time);
  const firstName = userName.split(' ')[0];
  const formattedDate = formatDate(date);

  const content = `
    <h2 style="margin:0 0 8px;color:#3d1a29;font-size:22px;font-weight:700;">
      ⏰ Recordatorio de cita, ${firstName}
    </h2>
    <p style="margin:0 0 24px;color:#7a5a6a;font-size:15px;line-height:1.7;">
      Te recordamos que <strong>mañana</strong> tienes una cita en la consulta. 
      ¡Esperamos verte pronto!
    </p>

    <!-- Tarjeta de cita -->
    <div style="background:linear-gradient(135deg,#fdf0f5,#f9e6ef);border:1px solid #f0c8d8;border-radius:12px;padding:24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;">
            <span style="display:inline-block;width:28px;font-size:16px;">📋</span>
            <strong style="color:#6d2b4a;font-size:14px;">Tipo de consulta:</strong>
          </td>
          <td style="padding:8px 0;color:#3d1a29;font-weight:600;font-size:14px;text-align:right;">${reason}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;">
            <span style="display:inline-block;width:28px;font-size:16px;">📅</span>
            <strong style="color:#6d2b4a;font-size:14px;">Fecha:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;color:#3d1a29;font-weight:600;font-size:14px;text-align:right;text-transform:capitalize;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;">
            <span style="display:inline-block;width:28px;font-size:16px;">🕐</span>
            <strong style="color:#6d2b4a;font-size:14px;">Hora:</strong>
          </td>
          <td style="padding:8px 0;border-top:1px solid #f0c8d8;color:#3d1a29;font-weight:600;font-size:14px;text-align:right;">${time}h</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 20px;color:#7a5a6a;font-size:15px;line-height:1.7;">
      Si por algún motivo no puedes acudir, te pedimos que canceles la cita con antelación 
      para que podamos atender a otros pacientes.
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `⏰ Recordatorio: tienes cita mañana a las ${time}h – PsicoRose`,
    html: baseTemplate(content),
  });

  console.log(`📧 Recordatorio enviado a ${userEmail}`);
};

// ──────────────── Correo de cancelación de cita ────────────────
const sendAppointmentCancelled = async (userEmail, userName, appointment) => {
  const { date, time, reason } = appointment;
  const firstName = userName.split(' ')[0];
  const formattedDate = formatDate(date);

  const content = `
    <h2 style="margin:0 0 8px;color:#3d1a29;font-size:22px;font-weight:700;">
      Cita cancelada ❌
    </h2>
    <p style="margin:0 0 24px;color:#7a5a6a;font-size:15px;line-height:1.7;">
      Hola, ${firstName}. Te informamos de que tu cita para el <strong>${formattedDate}</strong> a las <strong>${time}h</strong> ha sido cancelada.
    </p>

    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:24px;margin-bottom:28px;">
      <p style="margin:0;color:#991b1b;font-size:14px;line-height:1.6;">
        Si no has sido tú quien ha solicitado la cancelación, es posible que la Dra. Rosa haya tenido un imprevisto. 
        Puedes contactar con nosotros para más información.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: `❌ Cita CANCELADA – PsicoRose`,
    html: baseTemplate(content),
  });

  console.log(`📧 Correo de cancelación enviado a ${userEmail}`);
};

module.exports = { sendBookingConfirmation, sendAppointmentConfirmed, sendAppointmentCancelled, sendReminder };
