import {EntityRepository} from '@mikro-orm/postgresql';
import {SubscriptionLevel} from '../entities/SubscriptionLevel';

export class SubscriptionLevelRepository extends EntityRepository<SubscriptionLevel> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	async getAll() {
		return this.find({enabled: true}, {orderBy: {cost: 'asc'}});
	}
}
