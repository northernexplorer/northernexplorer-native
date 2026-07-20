import {EntityRepository} from '@mikro-orm/postgresql';
import {Migration} from '../entities/Migration';

export class MigrationRepository extends EntityRepository<Migration> {}
