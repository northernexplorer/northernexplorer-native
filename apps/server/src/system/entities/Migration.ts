import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class Migration {
    @PrimaryKey({ type: 'string', length: 255 })
    migrationKey!: string;

    @Property({ type: 'datetime' })
    executedAt: Date = new Date();
}
