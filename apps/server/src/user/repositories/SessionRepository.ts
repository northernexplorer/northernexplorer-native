import {EntityRepository} from '@mikro-orm/postgresql';
import {Session} from '../entities/Session';

export class SessionRepository extends EntityRepository<Session> {
	async getById(id: number) {
		return this.findOneOrFail({id});
	}
}
