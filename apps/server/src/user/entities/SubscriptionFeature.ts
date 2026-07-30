import {Entity, PrimaryKey, Property, ManyToMany} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {Collection} from '@mikro-orm/core';
import {SubscriptionLevel} from './SubscriptionLevel';

@Entity()
export class SubscriptionFeature {
	@PrimaryKey({type: 'uuid'})
	id: string = v4();

	@Property({type: 'text'})
	label: string;

	@ManyToMany(() => SubscriptionLevel, level => level.features)
	subscriptionLevels = new Collection<SubscriptionLevel>(this);

	constructor(key: string, label: string) {
		this.label = label;
	}
}
