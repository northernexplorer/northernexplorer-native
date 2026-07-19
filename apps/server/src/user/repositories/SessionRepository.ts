import {createHash} from 'node:crypto';
import {EntityRepository} from '@mikro-orm/postgresql';
import {Session} from '../entities/Session';
import {User} from '../entities/User';

export class SessionRepository extends EntityRepository<Session> {
	async getById(id: number) {
		return this.findOneOrFail({id});
	}

	hashToken(token: string) {
		return createHash('sha256').update(token.trim()).digest('hex');
	}

	async getByRefreshHash(refreshTokenHash: string) {
		return this.findOne({refreshTokenHash});
	}

	async getByUser(user: User) {
		return this.find({user});
	}

	async delete(session: Session) {
		return this.nativeDelete({id: session.id});
	}
}
