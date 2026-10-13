import {BaseRepository} from '../../core/BaseRepository';
import {Organization} from '../entities/Organization';
import {Region} from '../entities/Region';

export class OrganizationRepository extends BaseRepository<Organization> {
	async getById(id: string) {
		return this.findOneOrFail({id}, {populate: ['regions', 'regions.country']});
	}

	async getAll() {
		return this.findAll({populate: ['regions', 'regions.country'], orderBy: {name: 'asc'}});
	}

	async getByRegion(region: Region | string) {
		return this.find({regions: region}, {populate: ['regions', 'regions.country'], orderBy: {name: 'asc'}});
	}
}
