import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/decorators/legacy';
import { Region } from './Region';
import { Collection } from '@mikro-orm/core';

@Entity()
export class Country {
    @PrimaryKey({ type: 'string' })
    id!: string;

    @Property({ type: 'number', version: true, default: 1 })
    version!: number;

    @Property({ type: 'string' })
    name!: string;

    @OneToMany(() => Region, (region) => region.country)
    regions = new Collection<Region>(this);
}
