import {ArticleCategoryName, ArticleCategoryType, ArticleHeadingType, ArticleType} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {Article} from '../entities/Article';

type CategoryPathRow = {
	id: string;
	category_path: ArticleCategoryType[];
};

export class ArticleRepository extends BaseRepository<Article> {
	private async getSupportCategoryPaths() {
		const rows = await this.execute<CategoryPathRow[]>(
			`with recursive support_categories as (
				select id, array[id] as category_ids,
					jsonb_build_array(jsonb_build_object('id', id, 'name', name)) as category_path
				from article_category
				where name = ? and parent_id is null
				union all
				select child.id, array_append(support_categories.category_ids, child.id),
					support_categories.category_path || jsonb_build_array(jsonb_build_object('id', child.id, 'name', child.name))
				from article_category as child
				join support_categories on child.parent_id = support_categories.id
				where child.id <> all (support_categories.category_ids)
			)
			select id, category_path from support_categories`,
			[ArticleCategoryName.Support],
		);

		return new Map(rows.map(row => [row.id, row.category_path]));
	}

	async getByUrl(url: string): Promise<ArticleType> {
		const categoryPaths = await this.getSupportCategoryPaths();
		const categoryIds = [...categoryPaths.keys()];
		const article = await this.findOneOrFail({url, category: {id: {$in: categoryIds}}}, {populate: ['category']});

		return {...article, categoryPath: categoryPaths.get(article.category.id) ?? []};
	}

	async getHeadings(): Promise<ArticleHeadingType[]> {
		const categoryPaths = await this.getSupportCategoryPaths();
		const categoryIds = [...categoryPaths.keys()];
		const articles = await this.find(
			{category: {id: {$in: categoryIds}}},
			{
				fields: ['id', 'title', 'url', 'category.id', 'category.name'],
				orderBy: {title: 'asc'},
				populate: ['category'],
			},
		);

		return articles.map(article => ({
			id: article.id,
			title: article.title,
			url: article.url,
			category: article.category,
			categoryPath: categoryPaths.get(article.category.id) ?? [],
		}));
	}
}
