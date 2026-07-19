import {Entity, Property, PrimaryKey} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

type SubscriptionLevelInput = {
	name: string;
	description: string;
	shortDescription: string;
	enabled: boolean;
	cost: number;
};

@Entity()
export class SubscriptionLevel {
	@PrimaryKey({type: 'uuid'})
	id: string = v4();

	@Property({type: 'integer', version: true})
	version: number = 1;

	@Property({type: 'text'})
	name: string;

	@Property({type: 'text'})
	description: string;

	@Property({type: 'text'})
	shortDescription: string;

	@Property({type: 'boolean'})
	enabled: boolean;

	@Property({type: 'double'})
	cost: number;

	constructor(data: SubscriptionLevelInput) {
		this.name = data.name;
		this.description = data.description;
		this.shortDescription = data.shortDescription;
		this.enabled = data.enabled;
		this.cost = data.cost;
	}
}
