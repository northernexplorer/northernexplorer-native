import {ArticleCategoryName, ArticleCategoryType, ArticleHeadingType, ArticleType} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {Article} from '../entities/Article';

type CategoryPathRow = {
	id: string;
	category_path: ArticleCategoryType[];
};

export class ArticleRepository extends BaseRepository<Article> {
	private async getCategoryPaths(categoryName: ArticleCategoryName) {
		const rows = await this.execute<CategoryPathRow[]>(
			`with recursive categories as (
				select id, array[id] as category_ids,
					jsonb_build_array(jsonb_build_object('id', id, 'name', name)) as category_path
				from article_category
				where name = ? and parent_id is null
				union all
				select child.id, array_append(categories.category_ids, child.id),
					categories.category_path || jsonb_build_array(jsonb_build_object('id', child.id, 'name', child.name))
				from article_category as child
				join categories on child.parent_id = categories.id
				where child.id <> all (categories.category_ids)
			)
			select id, category_path from categories`,
			[categoryName],
		);

		return new Map(rows.map(row => [row.id, row.category_path]));
	}

	async getByUrl(url: string): Promise<ArticleType> {
		const categoryPaths = await this.getCategoryPaths(ArticleCategoryName.Support);
		const categoryIds = [...categoryPaths.keys()];
		const article = await this.findOneOrFail({url, category: {id: {$in: categoryIds}}}, {populate: ['category']});

		return {...article, categoryPath: categoryPaths.get(article.category.id) ?? []};
	}

	async getNewsByUrl(url: string): Promise<ArticleType> {
		const categoryPaths = await this.getCategoryPaths(ArticleCategoryName.News);
		const categoryIds = [...categoryPaths.keys()];
		const article = await this.findOneOrFail({url, category: {id: {$in: categoryIds}}}, {populate: ['category']});

		return {...article, categoryPath: categoryPaths.get(article.category.id) ?? []};
	}

	private async getArticleHeadings(
		categoryName: ArticleCategoryName,
		orderBy: {title: 'asc'} | {createdAt: 'desc'},
	): Promise<ArticleHeadingType[]> {
		const categoryPaths = await this.getCategoryPaths(categoryName);
		const categoryIds = [...categoryPaths.keys()];
		const articles = await this.find(
			{category: {id: {$in: categoryIds}}},
			{
				fields: ['id', 'title', 'url', 'createdAt', 'category.id', 'category.name'],
				orderBy,
				populate: ['category'],
			},
		);

		return articles.map(article => ({
			id: article.id,
			title: article.title,
			url: article.url,
			createdAt: article.createdAt,
			category: article.category,
			categoryPath: categoryPaths.get(article.category.id) ?? [],
		}));
	}

	getHeadings(): Promise<ArticleHeadingType[]> {
		return this.getArticleHeadings(ArticleCategoryName.Support, {title: 'asc'});
	}

	getNewsHeadings(): Promise<ArticleHeadingType[]> {
		return this.getArticleHeadings(ArticleCategoryName.News, {createdAt: 'desc'});
	}
}
