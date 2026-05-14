import { subscribeEmail, isAlreadySubscribed, getAllSubscribers, unsubscribeEmail } from '../services/mongodb/newsletter-service.js';
import { sendEmail } from '../services/email/email-service.js';

export async function subscribe(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'El email es obligatorio' });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Formato de email inválido' });
        }

        // Verificar si ya está suscrito
        const alreadySubscribed = await isAlreadySubscribed(email);
        if (alreadySubscribed) {
            return res.status(200).json({ message: '¡Ya estás suscrito a nuestra newsletter!' });
        }

        await subscribeEmail(email);
        res.status(201).json({ message: '¡Te has suscrito correctamente a la newsletter!' });
    } catch (error) {
        error.status = 500;
        error.message = 'Error al suscribirse a la newsletter';
        next(error);
    }
}

export async function getAllSubscribersController(req, res, next) {
    try {
        const subscribers = await getAllSubscribers();
        res.status(200).json(subscribers);
    } catch (error) {
        error.status = 500;
        error.message = 'Error al obtener los suscriptores';
        next(error);
    }
}

export async function unsubscribe(req, res, next) {
    try {
        const { id } = req.params;
        const deletedSubscriber = await unsubscribeEmail(id);

        if (!deletedSubscriber) {
            return res.status(404).json({ message: 'Suscriptor no encontrado' });
        }

        res.status(200).json({ message: 'Usuario dado de baja correctamente' });
    } catch (error) {
        error.status = 500;
        error.message = 'Error al dar de baja al suscriptor';
        next(error);
    }
}

export async function sendNewsletter(req, res, next) {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: 'El asunto y el mensaje son obligatorios' });
        }

        const subscribers = await getAllSubscribers();

        if (subscribers.length === 0) {
            return res.status(400).json({ message: 'No hay suscriptores a los que enviar' });
        }

        const emailList = subscribers.map(s => s.email);

        const htmlContent = getNewsletterTemplate(subject, message);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            bcc: emailList,
            subject: subject,
            html: htmlContent,
        };

        await sendEmail(mailOptions);

        res.status(200).json({
            message: `Newsletter enviada correctamente a ${emailList.length} suscriptores`,
            totalSent: emailList.length,
        });
    } catch (error) {
        error.status = 500;
        error.message = 'Error al enviar la newsletter';
        next(error);
    }
}

function getNewsletterTemplate(subject, message) {
    return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0A0A0A; color: #FAFAF8; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%); padding: 30px; text-align: center; border-bottom: 3px solid #EF8903;">
        <h1 style="margin: 0; color: #EF8903; font-size: 24px;">Kátodo Ciberjoyería</h1>
        <p style="margin: 5px 0 0; color: #9CA3AF; font-size: 14px;">Newsletter</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #FAFAF8; font-size: 20px; margin: 0 0 20px;">${subject}</h2>
        <div style="color: #D1D5DB; line-height: 1.8; font-size: 15px;">
          ${message.replaceAll('\n', '<br>')}
        </div>
      </div>
      <div style="padding: 20px 30px; background-color: #1a1a1a; text-align: center; border-top: 1px solid #333;">
        <p style="color: #6B7280; font-size: 12px; margin: 0;">
          Has recibido este email porque estás suscrito a la newsletter de Kátodo Ciberjoyería.
        </p>
      </div>
    </div>
  `;
}
