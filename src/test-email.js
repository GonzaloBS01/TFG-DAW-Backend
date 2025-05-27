import config from './config.js';
import emailService from './services/email/email-service.js';

async function testEmailService() {
  try {
    // Inicializar el servicio
    emailService.initMailer(config.email);

    // Enviar un correo de prueba
    await emailService.sendEmail({
      from: config.email.email,
      to: config.email.email, // Enviar a ti mismo para pruebas
      subject: 'Prueba de servicio de correo',
      text: 'Si recibes este correo, el servicio está funcionando correctamente.',
    });

    console.log('Correo de prueba enviado correctamente');
  } catch (error) {
    console.error('Error al enviar correo de prueba:', error);
  }
}

testEmailService();
