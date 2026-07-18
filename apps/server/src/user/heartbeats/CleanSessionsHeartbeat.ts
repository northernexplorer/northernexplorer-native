import {EntityManager} from '@mikro-orm/postgresql';
import {repositories} from '../../core/repositories';
import {Session} from '../entities/Session';

export class CleanSessionsHeartbeat {
	public static readonly queueName = 'clean-sessions';
	public static readonly queueSchedule = '0 0 * * *';

	/**
	 * Phase 1: Gathers all database context needed for the worker.
	 * Sweeps for inactive sessions.
	 */
	public async getData(em: EntityManager): Promise<Session[]> {
		const repos = repositories(em);

		const now = new Date();
		const sessions = await repos.session.find({
			expiresAt: {$lte: now},
		});

		return sessions;
	}

	/**
	 * Phase 2: Performs the actual business operation on a single session entity instance.
	 */
	public async execute(em: EntityManager, session: Session): Promise<void> {
		em.remove(session);
		await em.flush();
	}
}
