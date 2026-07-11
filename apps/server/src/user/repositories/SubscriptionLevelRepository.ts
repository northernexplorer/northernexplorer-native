import { SubscriptionLevel } from '../entities/SubscriptionLevel';
import { EntityRepository } from '@mikro-orm/postgresql';

export class SubscriptionLevelRepository extends EntityRepository<SubscriptionLevel> {
    async getById(id: number) {
        return this.findOneOrFail({ id });
    }
}
