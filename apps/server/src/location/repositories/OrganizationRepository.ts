import {BaseRepository} from '../../core/BaseRepository';
import {Organization} from '../entities/Organization';

export class OrganizationRepository extends BaseRepository<Organization> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	async getAll() {
		return this.findAll({orderBy: {name: 'asc'}});
	}
}
