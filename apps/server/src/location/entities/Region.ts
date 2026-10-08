import {Entity, PrimaryKey, Property, ManyToOne, ManyToMany} from '@mikro-orm/decorators/legacy';
import {Collection} from '@mikro-orm/core';
import {v4} from 'uuid';
import {Country} from './Country';
import {Organization} from './Organization';

type RegionInput = {
	name: string;
	country: Country;
	version?: number;
};

@Entity()
export class Region {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version: number = 1;

	@Property({type: 'text'})
	name: string;

	@ManyToOne(() => Country)
	country: Country;

	@ManyToMany(() => Organization, organization => organization.regions)
	organizations = new Collection<Organization>(this);

	constructor(data: RegionInput) {
		this.name = data.name;
		this.country = data.country;
		if (data.version !== undefined) {
			this.version = data.version;
		}
	}
}
