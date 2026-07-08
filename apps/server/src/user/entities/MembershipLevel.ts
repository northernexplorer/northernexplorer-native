import { Entity, Property, PrimaryKey } from '@mikro-orm/decorators/legacy';

@Entity()
export class MembershipLevel {
    @PrimaryKey({ type: 'integer' })
    id!: number;

    @Property({ type: 'integer', version: true })
    version = 1;

    @Property({ type: 'text' })
    name!: string;

    @Property({ type: 'boolean' })
    enabled!: boolean;
}
