import connectDB from '../config/mongo.js';

const mongoLoader = async () => {
    try {
        await connectDB();
        console.log('✅ Conexión a MongoDB establecida');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        throw error;
    }
};

export default mongoLoader;
