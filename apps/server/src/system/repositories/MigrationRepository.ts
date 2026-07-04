import { Migration } from '../entities/Migration';
import { EntityRepository } from '@mikro-orm/postgresql';

export class MigrationRepository extends EntityRepository<Migration> {}
