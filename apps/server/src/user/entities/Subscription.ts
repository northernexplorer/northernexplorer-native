import {Entity, Property, PrimaryKey, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {SubscriptionLevel} from './SubscriptionLevel';

type SubscriptionInput = {
	subscriptionLevel: SubscriptionLevel;
	startDate?: Date;
	endDate?: Date | null;
	renewalDate?: Date | null;
};

@Entity()
export class Subscription {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@ManyToOne(() => SubscriptionLevel)
	subscriptionLevel: SubscriptionLevel;

	@Property({type: 'datetime'})
	startDate = new Date();

	@Property({type: 'datetime', nullable: true})
	renewalDate?: Date | null;

	constructor(data: SubscriptionInput) {
		this.subscriptionLevel = data.subscriptionLevel;
		if (data.startDate) this.startDate = data.startDate;
		if (data.renewalDate) this.renewalDate = data.renewalDate;
	}
}
