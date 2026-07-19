import {Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {Country} from './Country';

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

	constructor(data: RegionInput) {
		this.name = data.name;
		this.country = data.country;
		if (data.version !== undefined) {
			this.version = data.version;
		}
	}
}
