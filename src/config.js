import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  database: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/mi_base_de_datos',
  },
  email: {
    email: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
};

export default config;
