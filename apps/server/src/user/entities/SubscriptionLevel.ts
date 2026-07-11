import { Entity, Property, PrimaryKey } from '@mikro-orm/decorators/legacy';

@Entity()
export class SubscriptionLevel {
    @PrimaryKey({ type: 'integer' })
    id!: number;

    @Property({ type: 'integer', version: true })
    version = 1;

    @Property({ type: 'text' })
    name!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'boolean' })
    enabled!: boolean;

    @Property({ type: 'double' })
    cost!: number;
}
