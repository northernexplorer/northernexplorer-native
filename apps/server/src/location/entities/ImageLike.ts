import {Entity, PrimaryKey, ManyToOne, Property, Unique} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from '../../user';
import {Image} from './Image';

type ImageLikeInput = {
	image: Image;
	user: User;
};

@Entity()
@Unique({properties: ['image', 'user']})
export class ImageLike {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@ManyToOne(() => Image, {deleteRule: 'cascade'})
	image: Image;

	@ManyToOne(() => User, {deleteRule: 'cascade'})
	user: User;

	@Property({type: 'datetime'})
	createdAt = new Date();

	constructor(data: ImageLikeInput) {
		this.image = data.image;
		this.user = data.user;
	}
}
