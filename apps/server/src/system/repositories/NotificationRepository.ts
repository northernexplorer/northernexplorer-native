import {BaseRepository} from '../../core/BaseRepository';
import {Notification} from '../entities/Notification';

export class NotificationRepository extends BaseRepository<Notification> {
	getForUser({userId, limit, offset}: {userId: string; limit: number; offset: number}) {
		return this.find(
			{user: {id: userId}},
			{
				limit,
				offset,
				orderBy: {createdAt: 'desc', id: 'desc'},
			},
		);
	}

	countForUser(userId: string) {
		return this.count({user: {id: userId}});
	}

	hasUnreadForUser(userId: string) {
		return this.count({user: {id: userId}, readAt: null}).then(count => count > 0);
	}

	getByIdForUser(id: string, userId: string) {
		return this.findOneOrFail({id, user: {id: userId}});
	}
}
