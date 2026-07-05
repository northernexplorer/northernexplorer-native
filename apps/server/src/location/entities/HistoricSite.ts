import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class HistoricSite {
    @PrimaryKey({ type: 'integer' })
    id!: number;

    @Property({ type: 'integer', version: true })
    version = 1;

    @Property({ type: 'string', unique: true, length: 255 })
    name!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'text' })
    image!: string;

    @Property({ type: 'double' })
    lat!: number;

    @Property({ type: 'double' })
    lon!: number;

    @Property({ type: 'string', length: 100 })
    country!: string;

    @Property({ type: 'string', length: 100, nullable: true })
    region?: string;

    @Property({ type: 'datetime' })
    createdAt = new Date();

    @Property({ type: 'datetime' })
    updatedAt = new Date();
}
