import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';

@Entity()
export class CityCache {
	@PrimaryKey({type: 'integer'})
	id!: number;

	@Property({type: 'double'})
	lat!: number;

	@Property({type: 'double'})
	lon!: number;

	@Property({type: 'json'})
	cityData!: unknown;

	@Property({type: 'datetime'})
	updatedAt = new Date();
}
