import {BaseRepository} from '../../core/BaseRepository';
import {ImageLike} from '../../location';

export class ImageLikeRepository extends BaseRepository<ImageLike> {
	async findLike(imageId: string, userId: string): Promise<ImageLike | null> {
		return this.findOne({
			image: imageId,
			user: userId,
		});
	}
}
