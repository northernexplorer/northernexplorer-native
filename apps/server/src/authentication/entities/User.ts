import { Entity, Property, PrimaryKey, Index } from '@mikro-orm/decorators/legacy';

@Entity()
@Index({ name: 'idx_user', properties: ['email', 'userName'] })
export class User {
  @PrimaryKey({ type: 'string' })
  id!: string;

  @Property({ type: 'number', version: true, default: 1 })
  version!: number;

  @Property({ type: 'text', length: 100, columnType: 'text' })
  firstName!: string;

  @Property({ type: 'text', length: 100, columnType: 'text' })
  lastName!: string;

  @Property({ type: 'text', length: 100, columnType: 'text' })
  userName!: string;

  @Property({ type: 'text', length: 100, columnType: 'text' })
  email!: string;

  @Property({ type: 'text', length: 100, columnType: 'text' })
  emailActivatedAt!: string;

  @Property({ type: 'datetime', columnType: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
