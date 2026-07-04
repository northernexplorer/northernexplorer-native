import { Entity, Property, PrimaryKey } from '@mikro-orm/decorators/legacy';

@Entity()
export class User {
  @PrimaryKey({ type: 'string' })
  id!: number;

  @Property({ type: 'number', version: true })
  version = 1;

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

  @Property({ type: 'datetime', columnType: 'timestamp' })
  createdAt = new Date();
}
