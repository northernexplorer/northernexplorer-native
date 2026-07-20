import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

type WeatherCacheInput = {
	lat: number;
	lon: number;
	weatherData: unknown;
	updatedAt?: Date;
};

@Entity()
export class WeatherCache {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'double'})
	lat: number;

	@Property({type: 'double'})
	lon: number;

	@Property({type: 'json'})
	weatherData: unknown;

	@Property({type: 'datetime'})
	updatedAt = new Date();

	constructor(data: WeatherCacheInput) {
		this.lat = data.lat;
		this.lon = data.lon;
		this.weatherData = data.weatherData;
		if (data.updatedAt) {
			this.updatedAt = data.updatedAt;
		}
	}
}
