import { saveCustomRequest, getAllCustomRequests, updateCustomRequestStatus } from '../services/mongodb/custom-request-service.js';
import { sendCustomRequestNotification } from '../services/email/email-service.js';

export async function createCustomRequest(req, res, next) {
    try {
        const request = await saveCustomRequest(req.body);

        // Enviar email de notificación a la tienda
        try {
            await sendCustomRequestNotification(request);
        } catch (emailError) {
            // No bloquear la solicitud si falla el email
            console.warn('Email de notificación no enviado:', emailError.message);
        }

        res.status(201).json({
            message: 'Solicitud enviada correctamente',
            request,
        });
    } catch (error) {
        error.status = 400;
        error.message = 'Error al crear la solicitud';
        next(error);
    }
}

export async function getAllCustomRequestsController(req, res, next) {
    try {
        const requests = await getAllCustomRequests();
        res.status(200).json(requests);
    } catch (error) {
        error.status = 500;
        error.message = 'Error al obtener las solicitudes';
        next(error);
    }
}

export async function updateStatusController(req, res, next) {
    try {
        const { status } = req.body;
        const request = await updateCustomRequestStatus(req.params.id, status);
        if (!request) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        res.status(200).json(request);
    } catch (error) {
        error.status = 500;
        error.message = 'Error al actualizar la solicitud';
        next(error);
    }
}
