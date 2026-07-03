import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/decorators/legacy';
import { EntityRepositoryType, Opt } from '@mikro-orm/postgresql';
import { CityRepository } from '../repositories/CityRepository';

@Entity({ repository: () => CityRepository })
@Index({ name: 'idx_city_location', properties: ['lat', 'lon'] })
export class CityCache {
  [EntityRepositoryType]?: CityRepository;
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lat!: number;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lon!: number;

  @Property({ type: 'json', columnType: 'text' })
  cityData!: unknown;

  @Property({
    type: 'datetime',
    columnType: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    extra: 'on update CURRENT_TIMESTAMP',
  })
  updatedAt!: Date & Opt;
}
