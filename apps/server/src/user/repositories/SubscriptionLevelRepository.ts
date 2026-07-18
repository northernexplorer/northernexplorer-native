import {SubscriptionLevel} from '../entities/SubscriptionLevel';
import {EntityRepository} from '@mikro-orm/postgresql';

export class SubscriptionLevelRepository extends EntityRepository<SubscriptionLevel> {
	async getById(id: number) {
		return this.findOneOrFail({id});
	}

	async getAll() {
		return this.find({enabled: true}, {orderBy: {cost: 'asc'}});
	}
}
