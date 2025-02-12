import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi_base_de_datos';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB en Docker');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
