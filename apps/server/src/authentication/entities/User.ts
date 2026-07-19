import {Entity, Property, PrimaryKey} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

@Entity()
export class User {
	@PrimaryKey()
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version!: number;

	@Property({type: 'text'})
	firstName!: string;

	@Property({type: 'text'})
	lastName!: string;

	@Property({type: 'text'})
	userName!: string;

	@Property({type: 'text'})
	email!: string;

	@Property({type: 'text'})
	emailActivatedAt!: string;

	@Property({type: 'datetime', columnType: 'timestamp', default: 'CURRENT_TIMESTAMP'})
	createdAt!: Date;
}
