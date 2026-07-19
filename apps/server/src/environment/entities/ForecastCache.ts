import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

type ForecastCacheInput = {
	lat: number;
	lon: number;
	forecastData: unknown;
	updatedAt?: Date;
};

@Entity()
export class ForecastCache {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'double'})
	lat: number;

	@Property({type: 'double'})
	lon: number;

	@Property({type: 'json'})
	forecastData: unknown;

	@Property({type: 'datetime'})
	updatedAt = new Date();

	constructor(data: ForecastCacheInput) {
		this.lat = data.lat;
		this.lon = data.lon;
		this.forecastData = data.forecastData;
		if (data.updatedAt) {
			this.updatedAt = data.updatedAt;
		}
	}
}
