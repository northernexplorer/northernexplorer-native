import {EntityManager} from '@mikro-orm/postgresql';
import {repositories} from '../../core/repositories';
import {User} from '../entities/User';

export class CleanUsersHeartbeat {
	public static readonly queueName = 'clean-users';
	public static readonly queueSchedule = '0 0 * * *';

	/**
	 * Phase 1: Gathers all database context needed for the worker.
	 * Sweeps for inactive users created more than 7 days ago.
	 */
	public async getData(em: EntityManager): Promise<User[]> {
		const repos = repositories(em);

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const users = await repos.user.find({
			isActive: false,
			createdAt: {$lte: sevenDaysAgo},
		});

		return users;
	}

	/**
	 * Phase 2: Performs the actual business operation on a single user entity instance.
	 */
	public execute(em: EntityManager, user: User) {
		em.remove(user);
		em.remove(user.subscription);
	}
}
