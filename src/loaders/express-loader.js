import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../config/mongo.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('✅ API funcionando correctamente'));

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
};

export default startServer;
