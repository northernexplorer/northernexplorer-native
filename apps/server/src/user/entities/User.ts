import {Entity, Property, PrimaryKey, OneToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {Subscription} from './Subscription';

@Entity()
export class User {
	@PrimaryKey()
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'text'})
	firstName!: string;

	@Property({type: 'text'})
	lastName!: string;

	@Property({type: 'text', unique: true})
	username!: string;

	@Property({type: 'text', unique: true})
	email!: string;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'text'})
	passwordHash!: string;

	@Property({type: 'boolean'})
	isActive!: boolean;

	@OneToOne(() => Subscription)
	subscription!: Subscription;
}
