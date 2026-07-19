import {Entity, Property, PrimaryKey, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {SubscriptionLevel} from './SubscriptionLevel';

@Entity()
export class Subscription {
	@PrimaryKey({type: 'integer'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@ManyToOne(() => SubscriptionLevel)
	subscriptionLevel!: SubscriptionLevel;

	@Property({type: 'datetime'})
	startDate = new Date();

	@Property({type: 'datetime', nullable: true})
	endDate: Date | null = null;

	@Property({type: 'datetime'})
	renewalDate = new Date();
}
