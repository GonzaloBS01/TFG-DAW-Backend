import dotenv from 'dotenv';

const config = {
  port: process.env.PORT || 3001,
  dbUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/mi_base_de_datos',
};

export default config;
