import { Membership } from '../entities/Membership';
import { EntityRepository } from '@mikro-orm/postgresql';

export class MembershipRepository extends EntityRepository<Membership> {}
