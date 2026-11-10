import assert from 'node:assert/strict';
import {test} from 'node:test';
import {ArticleCategory} from '@northernexplorer/types';
import {Article} from '../../src/system/entities/Article';
import {ArticleRepository} from '../../src/system/repositories/ArticleRepository';

test('getByUrl only looks up Support articles', async () => {
	const repository = Object.create(ArticleRepository.prototype) as ArticleRepository;
	let where: unknown;
	const article = {url: 'support-article'};
	Object.defineProperty(repository, 'findOneOrFail', {
		value: async (query: unknown) => {
			where = query;
			return article;
		},
	});

	assert.equal(await repository.getByUrl(article.url), article);
	assert.deepEqual(where, {url: article.url, category: ArticleCategory.Support});
});

test('getHeadings filters Support articles and includes their subcategory', async () => {
	const repository = Object.create(ArticleRepository.prototype) as ArticleRepository;
	let where: unknown;
	let options: unknown;
	Object.defineProperty(repository, 'find', {
		value: async (query: unknown, queryOptions: unknown) => {
			where = query;
			options = queryOptions;
			return [];
		},
	});

	await repository.getHeadings();

	assert.deepEqual(where, {category: ArticleCategory.Support});
	assert.deepEqual((options as {fields: string[]}).fields, ['id', 'title', 'url', 'category', 'subcategory']);
});

test('Article supports a nullable subcategory', () => {
	const article = new Article({
		content: 'Article content',
		title: 'Article title',
		url: 'article-url',
		author: {} as never,
		category: ArticleCategory.Support,
		subcategory: null,
	});

	assert.equal(article.subcategory, null);
});
