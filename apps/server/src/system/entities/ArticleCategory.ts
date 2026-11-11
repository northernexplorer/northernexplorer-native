import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

@Entity()
export class ArticleCategory {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'text'})
	name: string;

	@ManyToOne(() => ArticleCategory, {nullable: true})
	parent: ArticleCategory | null = null;

	constructor(name: string, parent?: ArticleCategory | null) {
		this.name = name;
		this.parent = parent ?? null;
	}
}
