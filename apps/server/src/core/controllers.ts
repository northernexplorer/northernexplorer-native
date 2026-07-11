import {
    ForecastController,
    FieldNoteController,
    LunarController,
    WeatherController,
} from '../environment';
import { CityController, HistoricSiteController,CountryController,RegionController } from '../location';
import { UserController } from '../user/controllers/UserController';
import { MigrationController } from '../system/controllers/MigrationController';
import { StatusController } from '../system';

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
    RegionController
];
