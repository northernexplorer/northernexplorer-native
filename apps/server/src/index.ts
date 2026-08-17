import 'reflect-metadata';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import {MikroORM, RequestContext} from '@mikro-orm/core';
import ormConfig from './mikro-orm.config';
import {config} from './config';
import {globalLimiter} from './core/rateLimiters';
import {setupBackgroundJobs} from './core/jobs';
import {registerRoutes} from './core/router';

const app = express();
app.set('trust proxy', 1);
const PORT = config.PORT;

const corsOrigin = config.CORS.split(',').map(origin => origin.toLowerCase().trim());

app.use(cors({origin: corsOrigin}));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/api/', globalLimiter);

async function bootstrap() {
	try {
		const orm = await MikroORM.init(ormConfig);
		app.use((req, res, next) => RequestContext.create(orm.em, next));

		await setupBackgroundJobs(orm);
		registerRoutes(app);

		app.listen(PORT, () => {
			console.log(`API running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Failed to initialize:', error);
		process.exit(1);
	}
}

bootstrap();
