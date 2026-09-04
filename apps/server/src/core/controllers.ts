import {FieldNoteController, LunarController, WeatherController} from '../environment';
import {
	CityController,
	PointOfInterestController,
	CountryController,
	RegionController,
	ReviewController,
	OrganizationController,
	ImageController,
} from '../location';
import {StatusController, MigrationController, SupportController} from '../system';
import {SessionController, SubscriptionController, SubscriptionLevelController, UserController} from '../user';

export const controllers = [
	FieldNoteController,
	LunarController,
	ImageController,
	CityController,
	PointOfInterestController,
	OrganizationController,
	CountryController,
	UserController,
	MigrationController,
	RegionController,
	ReviewController,
	StatusController,
	SubscriptionController,
	SessionController,
	SubscriptionLevelController,
	SupportController,
	WeatherController,
];
