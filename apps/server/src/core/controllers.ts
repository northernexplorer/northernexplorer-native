import {
    ForecastController,
    FieldNoteController,
    LunarController,
    WeatherController,
} from '../environment';
import { CityController, HistoricSiteController } from '../location';
import { StatusController, MigrationController } from '../system';
import { SubscriptionController, UserController } from '../user';

export const controllers = [
    ForecastController,
    FieldNoteController,
    LunarController,
    WeatherController,
    CityController,
    HistoricSiteController,
    UserController,
    MigrationController,
    StatusController,
    SubscriptionController,
];
