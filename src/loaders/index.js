import expressLoader from './express-loader.js';
import mongoLoader from './mongo-loader.js';
import emailService from '../services/email/email-service.js';

export default async function init(server, config) {
    await mongoLoader(config.database);
    if (config.email.email && config.email.password) {
        emailService.initMailer(config.email);
    }
    expressLoader(server);
}
