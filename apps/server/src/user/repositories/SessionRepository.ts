import {EntityRepository} from '@mikro-orm/postgresql';
import {Session} from '../entities/Session';
import {hash} from 'bcrypt';
import {User} from '../entities/User';

export class SessionRepository extends EntityRepository<Session> {
	async getById(id: number) {
		return this.findOneOrFail({id});
	}

	async hashToken(userPassword: string) {
		return hash(userPassword, 12);
	}

	async getByRefreshHash(refreshTokenHash: string) {
		return this.findOne({refreshTokenHash});
	}

	async getByUser(user: User) {
		return this.find({user});
	}

	async delete(session: Session) {
		return this.em.remove(session);
	}
}
