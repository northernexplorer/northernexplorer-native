import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {ArticleSubcategory} from '@northernexplorer/types';
import {User} from '../../user';
import {ArticleCategory} from './ArticleCategory';

export type ArticleInput = {
	content: string;
	title: string;
	url: string;
	author: User;
	category: ArticleCategory;
	subcategory?: ArticleSubcategory | null;
};

@Entity()
export class Article {
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

	@ManyToOne(() => ArticleCategory)
	category: ArticleCategory;

	@Property({type: 'text', nullable: true})
	subcategory: ArticleSubcategory | null = null;

	@ManyToOne(() => User)
	author: User;

	@Property({type: 'Date', onCreate: () => new Date()})
	createdAt: Date = new Date();

	@Property({type: 'Date', onUpdate: () => new Date()})
	updatedAt: Date = new Date();

	constructor(data: ArticleInput) {
		this.content = data.content;
		this.title = data.title;
		this.url = data.url;
		this.author = data.author;
		this.category = data.category;
		this.subcategory = data.subcategory ?? null;
	}
}
