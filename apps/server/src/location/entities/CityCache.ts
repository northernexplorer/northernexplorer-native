import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

@Entity()
export class CityCache {
	@PrimaryKey()
	id = v4();

	@Property({type: 'double'})
	lat!: number;

	@Property({type: 'double'})
	lon!: number;

	@Property({type: 'json'})
	cityData!: unknown;

	@Property({type: 'datetime'})
	updatedAt = new Date();
}
