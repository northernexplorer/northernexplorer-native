import {ForecastController, FieldNoteController, LunarController, WeatherController} from '../environment';
import {CityController, PointOfInterestController, CountryController, RegionController, ReviewController, OrganizationController} from '../location';
import {StatusController, MigrationController, SupportController} from '../system';
import {SessionController, SubscriptionController, SubscriptionLevelController, UserController} from '../user';

export const controllers = [
	ForecastController,
	FieldNoteController,
	LunarController,
	WeatherController,
	CityController,
	PointOfInterestController,
	OrganizationController,
	CountryController,
	UserController,
	MigrationController,
	StatusController,
	RegionController,
	SubscriptionController,
	SessionController,
	SubscriptionLevelController,
	ReviewController,
	SupportController,
];
