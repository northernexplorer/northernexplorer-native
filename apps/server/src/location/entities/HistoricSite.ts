import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/decorators/legacy';
import { HistoricSiteRepository } from '../repositories/HistoricSiteRepository';
import { EntityRepositoryType } from '@mikro-orm/postgresql';

@Entity({ repository: () => HistoricSiteRepository })
@Index({ name: 'idx_site_location', properties: ['lat', 'lon'] })
export class HistoricSite {
  [EntityRepositoryType]?: HistoricSiteRepository;
  @PrimaryKey({ type: 'number' })
  id!: number;

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

  @Property({ type: 'datetime', columnType: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Property({ type: 'number', version: true, default: 1 })
  version!: number;

  @Property({ type: 'datetime', columnType: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
