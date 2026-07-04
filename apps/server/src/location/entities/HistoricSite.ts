import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class HistoricSite {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'number', version: true })
  version = 1;

  @Property({ type: 'string', unique: true, length: 255 })
  name!: string;

  @Property({ type: 'text', columnType: 'text' })
  description!: string;

  @Property({ type: 'text', columnType: 'text' })
  image!: string;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lat!: number;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lon!: number;

  @Property({ type: 'string', length: 100 })
  country!: string;

  @Property({ type: 'string', length: 100, nullable: true })
  region?: string;

  @Property({ type: 'datetime', columnType: 'timestamp' })
  createdAt = new Date();

  @Property({ type: 'datetime', columnType: 'timestamp' })
  updatedAt = new Date();
}
