import {Entity, Property, PrimaryKey} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

@Entity()
export class SubscriptionLevel {
	@PrimaryKey()
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'text'})
	name!: string;

	@Property({type: 'text'})
	description!: string;

	@Property({type: 'text'})
	shortDescription!: string;

	@Property({type: 'boolean'})
	enabled!: boolean;

	@Property({type: 'double'})
	cost!: number;
}
