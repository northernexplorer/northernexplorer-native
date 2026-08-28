import {Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from '../../user';

export type SupportInput = {
	content: string;
	title: string;
	url: string;
	author: User;
};

@Entity()
export class Support {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version: number = 1;

	@Property({type: 'text'})
	content: string;

	@Property({type: 'text'})
	title: string;

	@Property({type: 'text'})
	url: string;

	@ManyToOne(() => User)
	author: User;

	@Property({type: 'Date', onCreate: () => new Date()})
	createdAt: Date = new Date();

	@Property({type: 'Date', onUpdate: () => new Date()})
	updatedAt: Date = new Date();

	constructor(data: SupportInput) {
		this.content = data.content;
		this.title = data.title;
		this.url = data.url;
		this.author = data.author;
	}
}
