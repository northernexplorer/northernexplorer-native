import {BaseRepository} from '../../core/BaseRepository';
import {PointOfInterestFavorite} from '../entities/PointofInterestFavorite';

export class PointOfInterestFavoriteRepository extends BaseRepository<PointOfInterestFavorite> {
	async findPointOfInterestFavoritesById(PointOfInterestid: string, CurrentUserId: string) {
		return this.findOne({
			pointOfInterest: PointOfInterestid,
			user: CurrentUserId,
		});
	}

	async findPointOfInterestFavoritesByUserId(CurrentUserId: string) {
		return this.find(
			{
				user: CurrentUserId,
			},
			{populate: ['pointOfInterest.country', 'pointOfInterest.region', 'user']},
		);
	}
}
