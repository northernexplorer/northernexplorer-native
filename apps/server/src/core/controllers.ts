import {ForecastController, FieldNoteController, LunarController, WeatherController} from '../environment';
import {CityController, HistoricSiteController, CountryController, RegionController, ReviewController} from '../location';
import {StatusController, MigrationController} from '../system';
import {SessionController, SubscriptionController, SubscriptionLevelController, UserController} from '../user';

export const controllers = [
	ForecastController,
	FieldNoteController,
	LunarController,
	WeatherController,
	CityController,
	HistoricSiteController,
	CountryController,
	UserController,
	MigrationController,
	StatusController,
	RegionController,
	SubscriptionController,
	SessionController,
	SubscriptionLevelController,
	ReviewController,
];
