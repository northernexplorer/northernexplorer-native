import { MembershipLevel } from '../entities/MembershipLevel';
import { EntityRepository } from '@mikro-orm/postgresql';

export class MembershipLevelRepository extends EntityRepository<MembershipLevel> {
    async getById(id: number) {
        return this.findOneOrFail({ id });
    }
}
