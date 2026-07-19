import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {Region} from './Region';
import {Country} from './Country';
import {v4} from 'uuid';

@Entity()
export class HistoricSite {
	@PrimaryKey({type: 'integer'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'string', unique: true, length: 255})
	name!: string;

	@Property({type: 'text'})
	description!: string;

	@Property({type: 'text'})
	image!: string;

	@Property({type: 'double'})
	lat!: number;

	@Property({type: 'double'})
	lon!: number;

	@Property({type: 'double', nullable: true})
	startDate?: number | null;

	@Property({type: 'double', nullable: true})
	endDate?: number | null;

	@ManyToOne(() => Country)
	country!: Country;

	@ManyToOne(() => Region)
	region!: Region;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'datetime'})
	updatedAt = new Date();
}
