import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/decorators/legacy';
import { Opt } from '@mikro-orm/postgresql';

@Entity({ tableName: 'forecast_cache' })
@Index({ name: 'idx_forecast_location', properties: ['lat', 'lon'] })
export class ForecastCache {
  @PrimaryKey()
  id!: number;

  @Property({ columnType: 'decimal(10,6)' })
  lat!: number;

  @Property({ columnType: 'decimal(10,6)' })
  lon!: number;

  @Property({ type: 'json', columnType: 'longtext' })
  forecastData!: any;

  @Property({
    columnType: 'timestamp',
    defaultRaw: 'CURRENT_TIMESTAMP',
    extra: 'on update CURRENT_TIMESTAMP'
  })
  updatedAt!: Date & Opt;
}