import {EntityRepository} from '@mikro-orm/postgresql';
import {Subscription} from '../entities/Subscription';

export class SubscriptionRepository extends EntityRepository<Subscription> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}
}
