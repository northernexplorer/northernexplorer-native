import {Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {Country} from './Country';

@Entity()
export class Region {
	@PrimaryKey({type: 'string'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version!: number;

	@Property({type: 'string'})
	name!: string;

	@ManyToOne(() => Country)
	country!: Country;
}
