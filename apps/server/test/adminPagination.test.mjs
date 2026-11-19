import test from 'node:test';
import assert from 'node:assert/strict';
import types from '@northernexplorer/types';
import userModule from '../src/user/controllers/UserController.ts';
import reportModule from '../src/system/controllers/ReportController.ts';
import imageModule from '../src/location/controllers/ImageController.ts';
import reviewModule from '../src/location/controllers/ReviewController.ts';
import poiModule from '../src/location/controllers/PointOfInterestController.ts';
import suggestionModule from '../src/location/controllers/PointOfInterestSuggestionController.ts';

const {ImageStatusEnum, PublishStatusEnum, ReviewStatusEnum, ReportStatusEnum, SuggestionStatusEnum} = types;
const {UserController} = userModule;
const {ReportController} = reportModule;
const {ImageController} = imageModule;
const {ReviewController} = reviewModule;
const {PointOfInterestController} = poiModule;
const {PointOfInterestSuggestionController} = suggestionModule;

const cases = [
	[UserController, 'user', 'getAll', {}, {}],
	[ReportController, 'report', 'getAll', {status: ReportStatusEnum.Resolved}, {status: ReportStatusEnum.Resolved}],
	[ReportController, 'report', 'getAll', {}, {}],
	[ImageController, 'image', 'getPending', {}, {status: ImageStatusEnum.Pending}],
	[ReviewController, 'review', 'getPending', {}, {status: ReviewStatusEnum.Pending}],
	[PointOfInterestController, 'pointOfInterest', 'getDrafts', {}, {status: PublishStatusEnum.Draft}],
	[PointOfInterestController, 'pointOfInterest', 'getRejected', {}, {status: PublishStatusEnum.Rejected}],
	[PointOfInterestController, 'pointOfInterest', 'getPublished', {}, {status: PublishStatusEnum.Published}],
	[
		PointOfInterestSuggestionController,
		'pointOfInterestSuggestion',
		'getAll',
		{status: SuggestionStatusEnum.Approved},
		{status: SuggestionStatusEnum.Approved},
	],
	[PointOfInterestSuggestionController, 'pointOfInterestSuggestion', 'getAll', {}, {}],
];

for (const [Controller, repository, method, filter, countFilter] of cases) {
	test(`${Controller.name}.${method}Paginated ${JSON.stringify(filter)}`, async () => {
		const params = {limit: 2, offset: 10, ...filter};
		const auth = {userId: 'admin'};
		let listOptions;
		let countOptions;
		const repo = {
			[method]: async options => {
				listOptions = options;
				return [];
			},
			count: async options => {
				countOptions = options;
				return 13;
			},
		};
		const controller = Object.create(Controller.prototype);
		controller.repos = {[repository]: repo};
		controller.permissionService = {
			isLoggedIn: actual => assert.equal(actual, auth),
			canAccessAdmin: actual => assert.equal(actual, auth),
		};
		assert.deepEqual(await controller[`${method}Paginated`](params, auth), {items: [], totalCount: 13});
		assert.equal(listOptions.limit, 2);
		assert.equal(listOptions.offset, 10);
		if (filter.status) assert.equal(listOptions.status, filter.status);
		assert.deepEqual(countOptions, countFilter);
		assert.deepEqual(await controller[method](params, auth), []);
		controller.permissionService.canAccessAdmin = () => {
			throw new Error('forbidden');
		};
		countOptions = undefined;
		await assert.rejects(controller[`${method}Paginated`](params, auth), /forbidden/);
		assert.equal(countOptions, undefined);
	});
}

test('draft endpoints retain the draft rows in both response formats', async () => {
	const draft = {id: 'draft-1', name: 'Draft', organization: {id: 'org-1', name: 'Organization'}};
	const controller = Object.create(PointOfInterestController.prototype);
	controller.repos = {pointOfInterest: {getDrafts: async () => [draft], count: async () => 1}};
	controller.permissionService = {canAccessAdmin: () => {}};
	const items = await controller.getDrafts({limit: 20, offset: 0});
	const paginated = await controller.getDraftsPaginated({limit: 20, offset: 0});
	assert.equal(items[0].id, draft.id);
	assert.deepEqual(paginated, {items, totalCount: 1});
});
