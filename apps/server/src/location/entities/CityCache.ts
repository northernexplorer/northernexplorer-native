import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { EntityRepositoryType } from '@mikro-orm/postgresql';
import { CityRepository } from '../repositories/CityRepository';

@Entity({ repository: () => CityRepository })
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

  @Property({ type: 'datetime', columnType: 'timestamp' })
  updatedAt = new Date();
}
