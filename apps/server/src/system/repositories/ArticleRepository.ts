import {ArticleCategory} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {Article} from '../entities/Article';

export class ArticleRepository extends BaseRepository<Article> {
	async getByUrl(url: string) {
		return this.findOneOrFail({url, category: ArticleCategory.Support});
	}

	async getHeadings() {
		return this.find(
			{category: ArticleCategory.Support},
			{
				fields: ['id', 'title', 'url', 'category', 'subcategory'],
				orderBy: {title: 'asc'},
			},
		);
	}
}
