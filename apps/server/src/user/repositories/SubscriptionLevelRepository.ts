import {BaseRepository} from '../../core/BaseRepository';
import {SubscriptionLevel} from '../entities/SubscriptionLevel';

export class SubscriptionLevelRepository extends BaseRepository<SubscriptionLevel> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	async getByName(name: string) {
		return this.findOneOrFail({name});
	}

	async getAll() {
		return this.find({enabled: true}, {orderBy: {cost: 'asc'}});
	}

	getByGoogleProductId(productId: string) {
		return this.findOneOrFail({googleProductId: productId});
	}

	getFree() {
		return this.findOneOrFail({cost: 0});
	}

	getPermissions(subscriptionLevel: SubscriptionLevel) {
		return {
			navigation: {
				useCompass: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
				useFlashlight: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
				useSignal: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
				changeMapStyle: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
				useOffTrailDifficulty: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
				useExpeditionDifficulty: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
			},
		};
	}
}
