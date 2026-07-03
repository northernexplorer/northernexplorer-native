import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { EntityRepositoryType } from '@mikro-orm/postgresql';
import { WeatherRepository } from '../repositories/WeatherRepository';

@Entity({ repository: () => WeatherRepository })
export class WeatherCache {
  [EntityRepositoryType]?: WeatherRepository;
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lat!: number;

  @Property({ type: 'double', columnType: 'decimal(10,6)' })
  lon!: number;

  @Property({ type: 'json', columnType: 'text' })
  weatherData!: unknown;

  @Property({ type: 'datetime', columnType: 'timestamp' })
  updatedAt = new Date();
}
