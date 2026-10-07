import {ReportStatusEnum} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {Report} from '../entities/Report';

export class ReportRepository extends BaseRepository<Report> {
	async getById(id: string) {
		return this.findOneOrFail(
			{id},
			{
				populate: [
					'user',
					'review',
					'review.pointOfInterest',
					'review.user',
					'review.likes',
					'image',
					'image.pointOfInterest',
					'image.user',
					'image.likes',
				],
			},
		);
	}

	async getAll({limit, offset, status}: {limit?: number; offset?: number; status?: ReportStatusEnum}): Promise<Report[]> {
		return this.find(status ? {status} : {}, {
			limit,
			offset,
			orderBy: {createdAt: 'desc'},
			populate: [
				'user',
				'review',
				'review.pointOfInterest',
				'review.user',
				'review.likes',
				'image',
				'image.pointOfInterest',
				'image.user',
				'image.likes',
			],
		});
	}
}
