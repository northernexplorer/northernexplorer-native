import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

type CityCacheInput = {
	lat: number;
	lon: number;
	cityData: unknown;
	updatedAt?: Date;
};

@Entity()
export class CityCache {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'double'})
	lat: number;

	@Property({type: 'double'})
	lon: number;

	@Property({type: 'json'})
	cityData: unknown;

	@Property({type: 'datetime'})
	updatedAt = new Date();

	constructor(data: CityCacheInput) {
		this.lat = data.lat;
		this.lon = data.lon;
		this.cityData = data.cityData;
		if (data.updatedAt) {
			this.updatedAt = data.updatedAt;
		}
	}
}
