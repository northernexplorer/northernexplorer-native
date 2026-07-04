import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { MigrationRepository } from '../repositories/MigrationRepository';

@Entity({ repository: () => MigrationRepository })
export class Migration {
  @PrimaryKey({ type: 'string', length: 255 })
  migrationKey!: string;

  @Property({ type: 'datetime', columnType: 'timestamp' })
  executedAt: Date = new Date();
}
