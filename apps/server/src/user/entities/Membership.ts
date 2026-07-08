import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/decorators/legacy';
import { MembershipLevel } from './MembershipLevel';

@Entity()
export class Membership {
    @PrimaryKey({ type: 'integer' })
    id!: number;

    @Property({ type: 'integer', version: true })
    version = 1;

    @ManyToOne(() => MembershipLevel)
    membershipLevel!: MembershipLevel;

    @Property({ type: 'datetime' })
    startDate = new Date();

    @Property({ type: 'datetime', nullable: true })
    endDate: Date | null = null;

    @Property({ type: 'datetime' })
    renewalDate = new Date();
}
