import {BaseRepository} from '../../core/BaseRepository';
import {Organization} from '../entities/Organization';
import {Region} from '../entities/Region';

export class OrganizationRepository extends BaseRepository<Organization> {
	async getById(id: string) {
		return this.findOneOrFail({id});
	}

	async getAll() {
		return this.findAll({orderBy: {name: 'asc'}});
	}

	async getByRegion(region: Region | string) {
		const regionOrgs = await this.find({regions: region}, {orderBy: {name: 'asc'}});
		const unknownOrg = await this.findOne({
			$or: [{name: 'Unknown'}, {name: 'Other'}, {id: '5b47c519-02fa-49cb-af9d-ec4ee5db5abd'}],
		});

		if (unknownOrg && !regionOrgs.some(org => org.id === unknownOrg.id)) {
			regionOrgs.push(unknownOrg);
		}

		return regionOrgs;
	}
}
