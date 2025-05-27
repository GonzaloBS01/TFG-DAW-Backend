import nodemailer from 'nodemailer';
import logger from '../../utils/logger.js';

// Configuración del transporter
let transporter;

/**
 * Inicializa el transporter de nodemailer
 * @param {Object} config - Configuración del email
 */
export function initMailer(config) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.password,
      },
    });

    logger.info('✅ Servicio de email configurado correctamente');
    return transporter;
  } catch (error) {
    logger.error(`❌ Error al configurar el servicio de email: ${error.message}`);
    throw error;
  }
}

/**
 * Envía un correo electrónico
 * @param {Object} mailOptions - Opciones del correo
 */
export async function sendEmail(mailOptions) {
  if (!transporter) {
    throw new Error('El servicio de email no ha sido inicializado');
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`✅ Correo enviado: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`❌ Error al enviar correo: ${error.message}`);
    throw error;
  }
}

/**
 * Envía un correo de recuperación de contraseña
 * @param {Object} user - Usuario que solicita la recuperación
 * @param {string} token - Token temporal para recuperar la contraseña
 */
export async function sendPasswordRecoveryEmail(user, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Recuperación de contraseña',
    html: getPasswordRecoveryTemplate(user.name, resetUrl),
  };

  return sendEmail(mailOptions);
}

/**
 * Envía un correo de confirmación de registro
 * @param {Object} user - Usuario registrado
 */
export async function sendRegistrationEmail(user) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Bienvenido a nuestra plataforma',
    html: getRegistrationTemplate(user.name),
  };

  return sendEmail(mailOptions);
}

/**
 * Plantilla HTML para correo de recuperación de contraseña
 */
function getPasswordRecoveryTemplate(name, resetUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Recuperación de contraseña</h2>
      <p>Hola ${name},</p>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a></p>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      <p>Saludos,<br>El equipo de soporte</p>
    </div>
  `;
}

/**
 * Plantilla HTML para correo de bienvenida
 */
function getRegistrationTemplate(name) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>¡Bienvenido a nuestra plataforma!</h2>
      <p>Hola ${name},</p>
      <p>Gracias por registrarte en nuestra plataforma. Estamos encantados de tenerte como usuario.</p>
      <p>Ya puedes acceder a todos nuestros servicios iniciando sesión con tu cuenta.</p>
      <p>Saludos,<br>El equipo de soporte</p>
    </div>
  `;
}

export default {
  initMailer,
  sendEmail,
  sendPasswordRecoveryEmail,
  sendRegistrationEmail,
};
