import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Migrations {
  @PrimaryKey({ type: 'string', length: 255 })
  migrationKey!: string;

  @Property({
    type: 'datetime',
    columnType: 'timestamp with time zone',
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  executedAt: Date = new Date();
}
