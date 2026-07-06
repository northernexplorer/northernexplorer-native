import { User } from '../entities/User';
import { EntityRepository } from '@mikro-orm/postgresql';

export class UserRepository extends EntityRepository<User> {}
