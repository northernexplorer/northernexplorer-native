import {Entity, PrimaryKey, Property, OneToMany} from '@mikro-orm/decorators/legacy';
import {Collection} from '@mikro-orm/core';
import {v4} from 'uuid';
import {Region} from './Region';

type CountryInput = {
	name: string;
	version?: number;
};

@Entity()
export class Country {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version: number = 1;

	@Property({type: 'text'})
	name: string;

	@OneToMany(() => Region, region => region.country)
	regions = new Collection<Region>(this);

	constructor(data: CountryInput) {
		this.name = data.name;
		if (data.version !== undefined) {
			this.version = data.version;
		}
	}
}
