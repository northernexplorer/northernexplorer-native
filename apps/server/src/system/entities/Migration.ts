import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';

type MigrationInput = {
	migrationKey: string;
	executedAt?: Date;
};

@Entity()
export class Migration {
	@PrimaryKey({type: 'text', length: 255})
	migrationKey: string;

	@Property({type: 'datetime'})
	executedAt: Date = new Date();

	constructor(data: MigrationInput) {
		this.migrationKey = data.migrationKey;
		if (data.executedAt) {
			this.executedAt = data.executedAt;
		}
	}
}
