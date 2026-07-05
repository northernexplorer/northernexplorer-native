import {
    ForecastController,
    FieldNoteController,
    LunarController,
    WeatherController,
} from '../environment';
import { CityController, HistoricSiteController } from '../location';
import { UserController } from '../user/controllers/UserController';
import { MigrationController } from '../system/controllers/MigrationController';

export const controllers = [
    ForecastController,
    FieldNoteController,
    LunarController,
    WeatherController,
    CityController,
    HistoricSiteController,
    UserController,
    MigrationController,
];
