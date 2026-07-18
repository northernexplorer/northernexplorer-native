import dotenv from 'dotenv';

dotenv.config();

export const config = {
	PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
	WEATHER_API_KEY: process.env.WEATHER_API_KEY,
	ACCESS_SECRET: process.env.ACCESS_SECRET || 'TEMP_ACCESS_SECRET',
	REFRESH_SECRET: process.env.REFRESH_SECRET || 'TEMP_REFRESH_SECRET',
	EMAIL_API_KEY: process.env.EMAIL_API_KEY,
	ACTIVATION_SECRET: process.env.ACTIVATION_SECRET || 'TEMP_ACTIVATION_SECRET',
	WEB_URL: process.env.WEB_URL || 'http://localhost:8081',
};
