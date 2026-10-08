import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

type WeatherWarningCacheInput = {
	lat: number;
	lon: number;
	warningData: unknown;
	expiresAt: Date;
	updatedAt?: Date;
};

@Entity()
export class WeatherWarningCache {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'double'})
	lat: number;

	@Property({type: 'double'})
	lon: number;

	@Property({type: 'json'})
	warningData: unknown;

	@Property({type: 'datetime'})
	expiresAt: Date;

	@Property({type: 'datetime'})
	updatedAt = new Date();

	constructor(data: WeatherWarningCacheInput) {
		this.lat = data.lat;
		this.lon = data.lon;
		this.warningData = data.warningData;
		this.expiresAt = data.expiresAt;
		if (data.updatedAt) {
			this.updatedAt = data.updatedAt;
		}
	}
}
