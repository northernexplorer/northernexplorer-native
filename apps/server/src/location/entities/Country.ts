import {Entity, PrimaryKey, Property, OneToMany} from '@mikro-orm/decorators/legacy';
import {Collection} from '@mikro-orm/core';
import {Region} from './Region';
import {v4} from 'uuid';

@Entity()
export class Country {
	@PrimaryKey({type: 'string'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version!: number;

	@Property({type: 'string'})
	name!: string;

	@OneToMany(() => Region, region => region.country)
	regions = new Collection<Region>(this);
}
