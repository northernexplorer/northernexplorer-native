import 'reflect-metadata';
import {defineConfig} from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
import {Image} from './Image';

dotenv.config();

export default defineConfig({
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432', 10),
	dbName: process.env.DB_NAME || 'northernexplorer',
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASS || 'password',
	entities: [Image],
	debug: process.env.NODE_ENV !== 'production',
});
