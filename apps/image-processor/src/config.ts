import dotenv from 'dotenv';

dotenv.config();

export const config = {
	PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5002,
	SPACES_DOCUMENT_ROOT: process.env.SPACES_DOCUMENT_ROOT || 'development',
	SPACES_REGION: process.env.SPACES_REGION || '',
	SPACES_BUCKET: process.env.SPACES_BUCKET || '',
	SPACES_CDN_URL: process.env.SPACES_CDN_URL || '',
	SPACES_ACCESS_KEY: process.env.SPACES_ACCESS_KEY || '',
	SPACES_SECRET_KEY: process.env.SPACES_SECRET_KEY || '',
};
