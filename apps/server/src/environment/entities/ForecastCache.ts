import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/decorators/legacy';
import { EntityRepositoryType, Opt } from '@mikro-orm/postgresql';
import { ForecastRepository } from '../repositories/ForecastRepository';

@Entity({ repository: () => ForecastRepository })
@Index({ name: 'idx_forecast_location', properties: ['lat', 'lon'] })
export class ForecastCache {
  [EntityRepositoryType]?: ForecastRepository;
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lat!: number;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lon!: number;

  @Property({ type: 'json', columnType: 'text' })
  forecastData!: unknown;

  @Property({
    type: 'datetime',
    columnType: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    extra: 'on update CURRENT_TIMESTAMP',
  })
  updatedAt!: Date & Opt;
}
