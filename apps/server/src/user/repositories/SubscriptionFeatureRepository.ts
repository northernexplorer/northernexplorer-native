import {EntityRepository} from '@mikro-orm/postgresql';
import {SubscriptionFeature} from '../entities/SubscriptionFeature';

export class SubscriptionFeatureRepository extends EntityRepository<SubscriptionFeature> {
	async getAll() {
		return this.find({}, {populate: ['subscriptionLevels']});
	}
}
