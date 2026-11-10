import {ArticleCategoryName} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {Article} from '../entities/Article';

export class ArticleRepository extends BaseRepository<Article> {
	async getByUrl(url: string) {
		return this.findOneOrFail({url, category: {name: ArticleCategoryName.Support}}, {populate: ['category']});
	}

	async getHeadings() {
		return this.find(
			{category: {name: ArticleCategoryName.Support}},
			{
				fields: ['id', 'title', 'url', 'category.id', 'category.name', 'subcategory'],
				orderBy: {title: 'asc'},
				populate: ['category'],
			},
		);
	}
}
