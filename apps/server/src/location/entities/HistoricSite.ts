import {Entity, Enum, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {PublishStatusEnum} from '@northernexplorer/types';
import {Region} from './Region';
import {Country} from './Country';

type HistoricSiteInput = {
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	country: Country;
	region: Region;
	startDate?: number | null;
	endDate?: number | null;
	createdAt?: Date;
	updatedAt?: Date;
	status: PublishStatusEnum;
};

@Entity()
export class HistoricSite {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'text', unique: true, length: 255})
	name: string;

	@Property({type: 'text'})
	description: string;

	@Property({type: 'text'})
	image: string;

	@Property({type: 'double'})
	lat: number;

	@Property({type: 'double'})
	lon: number;

	@Property({type: 'double', nullable: true})
	startDate?: number | null;

	@Property({type: 'double', nullable: true})
	endDate?: number | null;

	@ManyToOne(() => Country)
	country: Country;

	@ManyToOne(() => Region)
	region: Region;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'datetime'})
	updatedAt = new Date();

	@Enum({items: () => PublishStatusEnum, type: 'enum'})
	status: PublishStatusEnum;

	constructor(data: HistoricSiteInput) {
		this.name = data.name;
		this.description = data.description;
		this.image = data.image;
		this.lat = data.lat;
		this.lon = data.lon;
		this.country = data.country;
		this.region = data.region;
		this.status = data.status;

		if (data.startDate !== undefined) this.startDate = data.startDate;
		if (data.endDate !== undefined) this.endDate = data.endDate;
		if (data.createdAt) this.createdAt = data.createdAt;
		if (data.updatedAt) this.updatedAt = data.updatedAt;
	}
}
