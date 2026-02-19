import expressLoader from './express-loader.js';
import mongoLoader from './mongo-loader.js';
import emailService from '../services/email/email-service.js';
import logger from '../utils/logger.js';

export default async function init(server, config) {
    await mongoLoader(config.database);

    // Inicializar el servicio de email si las credenciales están disponibles
    if (config.email.email && config.email.password) {
        try {
            emailService.initMailer(config.email);
            logger.info('✅ Servicio de email inicializado correctamente');
        } catch (error) {
            logger.warn('⚠️ No se pudo inicializar el servicio de email:', error.message);
        }
    } else {
        logger.warn('⚠️ Credenciales de email no configuradas. El servicio de email no estará disponible.');
    }

    expressLoader(server);
}
