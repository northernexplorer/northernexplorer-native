import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
    WEATHER_API_KEY: process.env.WEATHER_API_KEY  ,
};



