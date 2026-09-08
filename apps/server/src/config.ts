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
	CORS: process.env.CORS || 'http://localhost:8081,https://northernexplorer.org',
	REVENUE_CAT_ACCESS_CODE: process.env.REVENUE_CAT_ACCESS_CODE || 'TEMP_REVENUE_CAT_ACCESS_CODE',
	REQUIRED_ANDROID_VERSION: process.env.REQUIRED_ANDROID_VERSION || '1',
	REQUIRED_IOS_VERSION: process.env.REQUIRED_IOS_VERSION || '1',
	SPACES_DOCUMENT_ROOT: process.env.SPACES_DOCUMENT_ROOT || 'development',
	SPACES_REGION: process.env.SPACES_REGION || '',
	SPACES_BUCKET: process.env.SPACES_BUCKET || '',
	SPACES_CDN_URL: process.env.SPACES_CDN_URL || '',
	SPACES_ACCESS_KEY: process.env.SPACES_ACCESS_KEY || '',
	SPACES_SECRET_KEY: process.env.SPACES_SECRET_KEY || '',
};
