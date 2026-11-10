import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

@Entity()
export class ArticleCategory {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'text', unique: true})
	name: string;

	constructor(name: string) {
		this.name = name;
	}
}
