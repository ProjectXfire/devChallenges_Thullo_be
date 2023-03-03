import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  database: {
    connection: process.env.MONGO_CONNECTION,
    name: process.env.MONGO_DB,
    host: process.env.MONGO_HOST,
    user: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
}));
