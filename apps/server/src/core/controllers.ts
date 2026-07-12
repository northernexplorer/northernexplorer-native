import {ForecastController, FieldNoteController, LunarController, WeatherController} from '../environment';

import {CityController, HistoricSiteController, CountryController, RegionController} from '../location';
import {StatusController, MigrationController} from '../system';
import {SubscriptionController, UserController} from '../user';

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
];
