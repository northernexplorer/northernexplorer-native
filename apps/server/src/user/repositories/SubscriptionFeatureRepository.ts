import {BaseRepository} from '../../core/BaseRepository';
import {SubscriptionFeature} from '../entities/SubscriptionFeature';

export class SubscriptionFeatureRepository extends BaseRepository<SubscriptionFeature> {
	async getAll() {
		return this.find({}, {populate: ['subscriptionLevels']});
	}
}
