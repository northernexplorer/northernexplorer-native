import {Entity, ManyToOne, OneToMany, PrimaryKey, Property, Enum} from '@mikro-orm/decorators/legacy';
import {Collection} from '@mikro-orm/core';
import {v4} from 'uuid';
import {PublishStatusEnum} from '@northernexplorer/types';
import {Region} from './Region';
import {Country} from './Country';
import {Review} from './Review';

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

	@OneToMany(() => Review, review => review.historicSite)
	reviews = new Collection<Review>(this);

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
		this.startDate = data.startDate;
		this.endDate = data.endDate;
	}
}
