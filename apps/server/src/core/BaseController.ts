import {AnyEntity} from '@mikro-orm/core';
import {Repositories} from './repositories';

export abstract class BaseController {
	constructor(protected repos: Repositories) {}

	protected async flush() {
		const em = this.repos.user.getEntityManager();
		await em.flush();
	}

	protected persist(entity: AnyEntity) {
		const em = this.repos.user.getEntityManager();
		em.persist(entity);
	}
}
