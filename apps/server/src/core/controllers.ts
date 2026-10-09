import {LunarController, WeatherController} from '../environment';
import {
	CityController,
	PointOfInterestController,
	PointOfInterestSuggestionController,
	CountryController,
	RegionController,
	ReviewController,
	OrganizationController,
	ImageController,
} from '../location';
import {ReportController, StatusController, SupportController} from '../system';
import {SessionController, SubscriptionController, SubscriptionLevelController, UserController} from '../user';
import {Repositories} from './repositories';
import {BaseController} from './BaseController';

export type ControllerConstructor = new (repos: Repositories) => BaseController;

export const controllers: ControllerConstructor[] = [
	LunarController,
	ImageController,
	CityController,
	PointOfInterestController,
	PointOfInterestSuggestionController,
	OrganizationController,
	CountryController,
	UserController,
	RegionController,
	ReviewController,
	ReportController,
	StatusController,
	SubscriptionController,
	SessionController,
	SubscriptionLevelController,
	SupportController,
	WeatherController,
];
