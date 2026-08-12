import {BaseRepository} from '../../core/BaseRepository';
import {Subscription} from '../entities/Subscription';

export class SubscriptionRepository extends BaseRepository<Subscription> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}
}
