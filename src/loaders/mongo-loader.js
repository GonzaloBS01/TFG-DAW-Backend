import mongoose from 'mongoose';
const mongoLoader = async (config) => {
    try {
        await mongoose.connect(config.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log('✅ Conexión a MongoDB establecida');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        throw error;
    }
};

export default mongoLoader;
