import {createHash} from 'node:crypto';
import {BaseRepository} from '../../core/BaseRepository';
import {Session} from '../entities/Session';
import {User} from '../entities/User';

export class SessionRepository extends BaseRepository<Session> {
	async getById(id: string) {
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
