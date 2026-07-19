import {Repositories} from './repositories';

export abstract class BaseController {
	constructor(protected repos: Repositories) {}

	protected async flush(): Promise<void> {
		const em = this.repos.user.getEntityManager();
		await em.flush();
	}
}
