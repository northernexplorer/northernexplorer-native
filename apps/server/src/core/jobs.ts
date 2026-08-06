import {PgBoss} from 'pg-boss';
import {MikroORM} from '@mikro-orm/core';
import {EntityManager} from '@mikro-orm/postgresql';
import {heartbeats} from './heartbeats';

export async function setupBackgroundJobs(orm: MikroORM) {
	console.log('Initializing background job queue...');

	const boss = new PgBoss({
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT || '5432', 10),
		database: process.env.DB_NAME || 'northernexplorer',
		user: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASS || 'password',
	});
	await boss.start();

	console.log('Registering heartbeat background workers...');
	for (const HeartbeatClass of heartbeats) {
		const workerInstance = new HeartbeatClass();
		const queueName = HeartbeatClass.queueName;
		const cronSchedule = HeartbeatClass.queueSchedule;

		console.log(`Worker listening to queue: ${queueName}`);

		await boss.work(queueName, async () => {
			const dataEm = orm.em.fork() as EntityManager;
			const context = await workerInstance.getData(dataEm);

			if (Array.isArray(context)) {
				for (const contextItem of context) {
					const executionEm = orm.em.fork() as EntityManager;
					try {
						const managedItem = executionEm.merge(contextItem);
						workerInstance.execute(executionEm, managedItem);
						await executionEm.flush();
					} catch (entityError) {
						console.error(`[Queue: ${queueName}] Error processing individual item ${contextItem.id || ''}:`, entityError);
					}
				}
			}
		});

		await boss.createQueue(queueName);

		console.log(`Scheduling queue ${queueName} with cron: ${cronSchedule}`);
		await boss.schedule(queueName, cronSchedule);
	}
}
