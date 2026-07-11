import { Subscription } from '../entities/Subscription';
import { EntityRepository } from '@mikro-orm/postgresql';

export class SubscriptionRepository extends EntityRepository<Subscription> {
    async getById(id: number) {
        return this.findOneOrFail({ id });
    }
}
