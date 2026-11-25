import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from '../../user';
import {Review} from './Review';

export type ReviewReplyInput = {
	review: Review;
	user: User;
	text: string;
	parent: ReviewReply | null;
	depth: number;
};

@Entity()
export class ReviewReply {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@ManyToOne(() => Review, {deleteRule: 'cascade'})
	review: Review;

	@ManyToOne(() => User, {deleteRule: 'cascade'})
	user: User;

	@ManyToOne(() => ReviewReply, {nullable: true, deleteRule: 'cascade'})
	parent: ReviewReply | null;

	@Property({type: 'text'})
	text: string;

	@Property({type: 'integer'})
	depth: number;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'datetime'})
	updatedAt = new Date();

	constructor(data: ReviewReplyInput) {
		this.review = data.review;
		this.user = data.user;
		this.text = data.text;
		this.parent = data.parent;
		this.depth = data.depth;
	}
}
