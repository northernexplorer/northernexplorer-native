import 'reflect-metadata';
import {MikroORM} from '@mikro-orm/core';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import ormConfig from './mikro-orm.config';
import {processBatch} from './processBatch';

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

async function bootstrap() {
	let orm: MikroORM<PostgreSqlDriver>;

	try {
		orm = await MikroORM.init(ormConfig);
		console.log('Image Processor service initialized and database connected.');

		// Run once immediately on startup
		await processBatch(orm);

		// Schedule recurring execution every 5 minutes
		setInterval(async () => {
			try {
				await processBatch(orm);
			} catch (err) {
				console.error('Error during scheduled batch run:', err);
			}
		}, POLL_INTERVAL_MS);
	} catch (error) {
		console.error('Failed to initialize Image Processor:', error);
		process.exit(1);
	}

	// Graceful shutdown handling
	const shutdown = async () => {
		console.log('Shutting down Image Processor...');
		await orm.close(true);
		process.exit(0);
	};

	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);
}

bootstrap();
