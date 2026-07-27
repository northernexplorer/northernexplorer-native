import {Entity, Property, PrimaryKey, OneToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {Subscription} from './Subscription';

type UserInput = {
	firstName: string;
	lastName: string;
	username: string;
	score?: number;
	email: string;
	passwordHash: string;
	isActive: boolean;
	subscription: Subscription;
	createdAt?: Date;
};

@Entity()
export class User {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'text'})
	firstName: string;

	@Property({type: 'text'})
	lastName: string;

	@Property({type: 'text', unique: true})
	username: string;

	@Property({type: 'integer', default: 0})
	score: number = 0;

	@Property({type: 'text', unique: true})
	email: string;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'text'})
	passwordHash: string;

	@Property({type: 'boolean'})
	isActive: boolean;

	@OneToOne(() => Subscription)
	subscription: Subscription;

	constructor(data: UserInput) {
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.username = data.username;
		this.score = data.score ?? 0;
		this.email = data.email;
		this.passwordHash = data.passwordHash;
		this.isActive = data.isActive;
		this.subscription = data.subscription;
		if (data.createdAt) {
			this.createdAt = data.createdAt;
		}
	}
}
