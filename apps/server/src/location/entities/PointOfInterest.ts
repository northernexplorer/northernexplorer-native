import {Entity, ManyToOne, OneToMany, PrimaryKey, Property, Enum} from '@mikro-orm/decorators/legacy';
import {Collection} from '@mikro-orm/core';
import {v4} from 'uuid';
import {
	PublishStatusEnum,
	PointOfInterestTypeEnum,
	EntranceCostEnum,
	SiteConditionEnum,
	ReviewRatingEnum,
	SiteDifficultyEnum,
} from '@northernexplorer/types';
import {Region} from './Region';
import {Country} from './Country';
import {Review} from './Review';
import {Organization} from './Organization';
import {Image} from './Image';
import {PointOfInterestFavorite} from './PointofInterestFavorite';
type PointOfInterestInput = {
	name: string;
	description: string;
	image: Image;
	lat: number;
	lon: number;
	country: Country;
	region: Region;
	startDate?: number;
	endDate?: number;
	status: PublishStatusEnum;
	type: PointOfInterestTypeEnum[];
	organization: Organization;
};

@Entity()
export class PointOfInterest {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'text', unique: true, length: 255})
	name: string;

	@Property({type: 'text'})
	description: string;

	@ManyToOne(() => Image)
	image: Image;

	@Property({type: 'double'})
	lat: number;

	@Property({type: 'double'})
	lon: number;

	@Property({type: 'double', nullable: true})
	startDate?: number;

	@Property({type: 'double', nullable: true})
	endDate?: number;

	@ManyToOne(() => Country)
	country: Country;

	@ManyToOne(() => Region)
	region: Region;

	@OneToMany(() => Review, review => review.pointOfInterest)
	reviews = new Collection<Review>(this);

	@OneToMany(() => Image, image => image.pointOfInterest)
	images = new Collection<Image>(this);

	@OneToMany(() => PointOfInterestFavorite, pointofinterestfavorite => pointofinterestfavorite.pointOfInterest)
	pointOfInterestFavorite = new Collection<PointOfInterestFavorite>(this);

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'datetime'})
	updatedAt = new Date();

	@Enum({items: () => PublishStatusEnum, type: 'enum'})
	status: PublishStatusEnum;

	@Enum({type: () => PointOfInterestTypeEnum, items: () => PointOfInterestTypeEnum, array: true})
	type!: PointOfInterestTypeEnum[];

	@ManyToOne(() => Organization)
	organization: Organization;

	@Enum({items: () => EntranceCostEnum, nullable: true})
	entranceCost?: EntranceCostEnum;

	@Enum({type: () => SiteConditionEnum, items: () => SiteConditionEnum, array: true, nullable: true})
	conditions?: SiteConditionEnum[];

	@Enum({items: () => ReviewRatingEnum, nullable: true})
	rating?: ReviewRatingEnum;

	@Enum({items: () => SiteDifficultyEnum, nullable: true})
	difficulty?: SiteDifficultyEnum;

	constructor(data: PointOfInterestInput) {
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
		this.type = data.type;
		this.organization = data.organization;
	}

	edit(data: Partial<PointOfInterestInput>) {
		if (data.name !== undefined) this.name = data.name;
		if (data.description !== undefined) this.description = data.description;
		if (data.image !== undefined) this.image = data.image;
		if (data.lat !== undefined) this.lat = data.lat;
		if (data.lon !== undefined) this.lon = data.lon;
		if (data.country !== undefined) this.country = data.country;
		if (data.region !== undefined) this.region = data.region;
		if (data.status !== undefined) this.status = data.status;
		if (data.startDate !== undefined) this.startDate = data.startDate;
		if (data.endDate !== undefined) this.endDate = data.endDate;
		if (data.type !== undefined) this.type = data.type;
		if (data.organization !== undefined) this.organization = data.organization;

		this.updatedAt = new Date();
	}

	updateEntranceCost(entranceCost?: EntranceCostEnum) {
		this.entranceCost = entranceCost;
	}

	updateConditions(conditions?: SiteConditionEnum[]) {
		this.conditions = conditions;
	}

	updateRating(rating?: ReviewRatingEnum) {
		this.rating = rating;
	}

	updateDifficulty(difficulty?: SiteDifficultyEnum) {
		this.difficulty = difficulty;
	}
}
