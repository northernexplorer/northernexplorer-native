import {SuggestionStatusEnum} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {PointOfInterestSuggestion} from '../entities/PointOfInterestSuggestion';

export class PointOfInterestSuggestionRepository extends BaseRepository<PointOfInterestSuggestion> {
	async getPending({limit = 20, offset = 0}: {limit?: number; offset?: number} = {}) {
		return this.find(
			{status: SuggestionStatusEnum.Pending},
			{
				populate: [
					'user',
					'pointOfInterest',
					'pointOfInterest.image',
					'pointOfInterest.country',
					'pointOfInterest.region',
					'pointOfInterest.organization',
					'country',
					'region',
					'organization',
					'image',
				],
				orderBy: {createdAt: 'DESC'},
				limit,
				offset,
			},
		);
	}

	async getAll({limit = 20, offset = 0, status}: {limit?: number; offset?: number; status?: SuggestionStatusEnum} = {}) {
		const where = status ? {status} : {};
		return this.find(where, {
			populate: [
				'user',
				'pointOfInterest',
				'pointOfInterest.image',
				'pointOfInterest.country',
				'pointOfInterest.region',
				'pointOfInterest.organization',
				'country',
				'region',
				'organization',
				'image',
			],
			orderBy: {createdAt: 'DESC'},
			limit,
			offset,
		});
	}

	async getByIdPopulated(id: string) {
		return this.findOneOrFail(
			{id},
			{
				populate: [
					'user',
					'pointOfInterest',
					'pointOfInterest.image',
					'pointOfInterest.country',
					'pointOfInterest.region',
					'pointOfInterest.organization',
					'country',
					'region',
					'organization',
					'image',
				],
			},
		);
	}
}
