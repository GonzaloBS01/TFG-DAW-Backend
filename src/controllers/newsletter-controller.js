import { subscribeEmail, isAlreadySubscribed } from '../services/mongodb/newsletter-service.js';

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
