import { Entity, Property, PrimaryKey, OneToOne } from '@mikro-orm/decorators/legacy';
import { Membership } from './Membership';

@Entity()
export class User {
    @PrimaryKey({ type: 'integer' })
    id!: number;

    @Property({ type: 'integer', version: true })
    version = 1;

    @Property({ type: 'text' })
    firstName!: string;

    @Property({ type: 'text' })
    lastName!: string;

    @Property({ type: 'text', unique: true })
    username!: string;

    @Property({ type: 'text', unique: true })
    email!: string;

    @Property({ type: 'datetime' })
    createdAt = new Date();

    @Property({ type: 'datetime', nullable: true })
    lastLoginAt?: Date | null;

    @Property({ type: 'text' })
    passwordHash!: string;

    @Property({ type: 'boolean' })
    isActive!: boolean;

    @OneToOne(() => Membership)
    membership!: Membership;
}
