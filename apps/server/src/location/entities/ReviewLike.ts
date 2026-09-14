import {Entity, Property, Unique, PrimaryKey, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from '../../user';
import {Review} from './Review';
export type ReviewLikeInput = {
	review: Review;
	user: User;
};

@Entity()
@Unique({properties: ['review', 'user']})
export class ReviewLike {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@ManyToOne(() => Review, {deleteRule: 'cascade'})
	review: Review;
	@ManyToOne(() => User, {deleteRule: 'cascade'})
	user: User;

	@Property({type: 'datetime'})
	createdAt = new Date();

	constructor(data: ReviewLikeInput) {
		this.review = data.review;
		this.user = data.user;
	}
}
