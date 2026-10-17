import {Entity, PrimaryKey, Property, ManyToOne, Unique} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from '../../user';
import {PointOfInterest} from './PointOfInterest';

export type PointOfInterestInput = {
	pointOfInterest: PointOfInterest;
	user: User;
};

@Entity()
@Unique({properties: ['pointOfInterest', 'user']})
export class PointOfInterestFavorite {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@ManyToOne(() => PointOfInterest, {deleteRule: 'cascade'})
	pointOfInterest: PointOfInterest;
	@ManyToOne(() => User, {deleteRule: 'cascade'})
	user: User;

	@Property({type: 'datetime'})
	createdAt = new Date();

	constructor(data: PointOfInterestInput) {
		this.pointOfInterest = data.pointOfInterest;
		this.user = data.user;
	}
}
