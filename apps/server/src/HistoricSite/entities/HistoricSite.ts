import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/decorators/legacy';

@Entity()
@Index({ name: 'idx_site_location', properties: ['lat', 'lon'] })
export class HistoricSite {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true, length: 255 })
  name!: string;

  @Property({ columnType: 'text' })
  description!: string;

  @Property({ columnType: 'text' })
  image!: string;

  @Property({ columnType: 'decimal(10,6)' })
  lat!: number;

  @Property({ columnType: 'decimal(10,6)' })
  lon!: number;

  @Property({ length: 100, nullable: true })
  country?: string;

  @Property({ length: 100, nullable: true })
  region?: string;

  @Property({ columnType: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Property({
    columnType: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    extra: 'on update CURRENT_TIMESTAMP'
  })
  updatedAt!: Date;
}