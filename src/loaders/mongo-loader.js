import mongoose from 'mongoose';

import logger from '../utils/logger.js';

const mongoLoader = async (config) => {
    try {
        const connection = await mongoose.connect(config.url);
        logger.info(`✅ Conexión a MongoDB establecida en ${connection.connection.host}`);
    } catch (error) {
        logger.error('❌ Error al conectar a MongoDB:', error);
        throw error;
    }
};

export default mongoLoader;
