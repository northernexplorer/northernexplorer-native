import {Entity, PrimaryKey, Property, ManyToOne, Enum} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {PointOfInterestTypeEnum, SuggestionStatusEnum} from '@northernexplorer/types';
import {User} from '../../user';
import {PointOfInterest} from './PointOfInterest';
import {Country} from './Country';
import {Region} from './Region';
import {Organization} from './Organization';
import {Image} from './Image';

export type PointOfInterestSuggestionInput = {
	user: User;
	pointOfInterest: PointOfInterest;
	name: string;
	description: string;
	lat: number;
	lon: number;
	country: Country;
	region: Region;
	organization: Organization;
	type: PointOfInterestTypeEnum[];
	startDate?: number;
	endDate?: number;
	image?: Image;
	status?: SuggestionStatusEnum;
};

@Entity()
export class PointOfInterestSuggestion {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version: number = 1;

	@ManyToOne(() => User)
	user: User;

	@ManyToOne(() => PointOfInterest)
	pointOfInterest: PointOfInterest;

	@Property({type: 'text'})
	name: string;

	@Property({type: 'text'})
	description: string;

	@Property({type: 'double'})
	lat: number;

	@Property({type: 'double'})
	lon: number;

	@ManyToOne(() => Country)
	country: Country;

	@ManyToOne(() => Region)
	region: Region;

	@ManyToOne(() => Organization)
	organization: Organization;

	@ManyToOne(() => Image, {nullable: true})
	image?: Image;

	@Property({type: 'double', nullable: true})
	startDate?: number;

	@Property({type: 'double', nullable: true})
	endDate?: number;

	@Enum({type: () => PointOfInterestTypeEnum, items: () => PointOfInterestTypeEnum, array: true})
	type: PointOfInterestTypeEnum[];

	@Enum(() => SuggestionStatusEnum)
	status: SuggestionStatusEnum = SuggestionStatusEnum.Pending;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'datetime'})
	updatedAt = new Date();

	constructor(data: PointOfInterestSuggestionInput) {
		this.user = data.user;
		this.pointOfInterest = data.pointOfInterest;
		this.name = data.name;
		this.description = data.description;
		this.lat = data.lat;
		this.lon = data.lon;
		this.country = data.country;
		this.region = data.region;
		this.organization = data.organization;
		this.type = data.type;
		this.startDate = data.startDate;
		this.endDate = data.endDate;
		this.image = data.image;
		if (data.status) {
			this.status = data.status;
		}
	}
}
