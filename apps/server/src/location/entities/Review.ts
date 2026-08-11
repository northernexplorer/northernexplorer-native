import {Entity, Enum, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {ReviewRatingEnum} from '@northernexplorer/types';
import {User} from '../../user';
import {PointOfInterest} from '../index';

type ReviewInput = {
	user: User;
	pointOfInterest: PointOfInterest;
	rating: ReviewRatingEnum;
	description: string;
};

@Entity()
export class Review {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true})
	version = 1;

	@Property({type: 'string'})
	description: string;

	@ManyToOne(() => User)
	user: User;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'datetime'})
	updatedAt = new Date();

	@ManyToOne(() => PointOfInterest)
	pointOfInterest: PointOfInterest;

	@Enum(() => ReviewRatingEnum)
	rating: ReviewRatingEnum;

	constructor(data: ReviewInput) {
		this.description = data.description;
		this.user = data.user;
		this.pointOfInterest = data.pointOfInterest;
		this.rating = data.rating;
	}
}
