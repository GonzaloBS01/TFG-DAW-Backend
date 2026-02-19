import nodemailer from 'nodemailer';
import logger from '../../utils/logger.js';

// Configuración del transporter
let transporter = null;

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
    transporter = null;
    throw error;
  }
}

/**
 * Verifica si el servicio de email está disponible
 */
function isEmailServiceAvailable() {
  return transporter !== null;
}

/**
 * Envía un correo electrónico
 * @param {Object} mailOptions - Opciones del correo
 */
export async function sendEmail(mailOptions) {
  if (!isEmailServiceAvailable()) {
    logger.warn('⚠️ Servicio de email no configurado. Email no enviado.');
    return null;
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
  if (!isEmailServiceAvailable()) {
    logger.warn('⚠️ Servicio de email no configurado. Email de recuperación no enviado.');
    return null;
  }

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
  if (!isEmailServiceAvailable()) {
    logger.warn('⚠️ Servicio de email no configurado. Email de registro no enviado.');
    return null;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Bienvenido a nuestra plataforma',
    html: getRegistrationTemplate(user.name),
  };

  return sendEmail(mailOptions);
}

/**
 * Envía un correo de confirmación de compra
 * @param {Object} user - Usuario que realizó la compra
 * @param {Object} bill - Detalles de la factura
 */
export async function sendPurchaseConfirmationEmail(user, bill) {
  if (!isEmailServiceAvailable()) {
    logger.warn('⚠️ Servicio de email no configurado. Email de confirmación no enviado.');
    return null;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Confirmación de compra',
    html: getPurchaseConfirmationTemplate(user.name, bill),
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

/**
 * Plantilla HTML para correo de confirmación de compra
 */
function getPurchaseConfirmationTemplate(userName, bill) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>¡Compra confirmada!</h2>
      <p>Hola ${userName},</p>
      <p>Tu compra se ha procesado exitosamente.</p>
      <p><strong>Número de orden:</strong> ${bill._id}</p>
      <p><strong>Total:</strong> €${bill.totalAmount}</p>
      <p><strong>Fecha:</strong> ${new Date(bill.createdAt).toLocaleDateString()}</p>
      <p>Gracias por tu compra.</p>
      <p>Saludos,<br>El equipo de ventas</p>
    </div>
  `;
}

export default {
  initMailer,
  sendEmail,
  sendPasswordRecoveryEmail,
  sendRegistrationEmail,
  sendPurchaseConfirmationEmail,
  isEmailServiceAvailable,
};
