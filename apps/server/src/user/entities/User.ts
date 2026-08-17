import {Entity, Property, PrimaryKey, OneToOne, Enum} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {GenderEnum, RolesEnum} from '@northernexplorer/types';
import {Subscription} from './Subscription';

type UserInput = {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	passwordHash: string;
	isActive: boolean;
	subscription: Subscription;
	birthday: Date;
	gender: GenderEnum;
	roles?: RolesEnum[];
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

	@Property({type: 'integer'})
	score: number = 0;

	@Property({type: 'text', unique: true})
	email: string;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'text'})
	passwordHash: string;

	@Property({type: 'boolean'})
	isActive: boolean = true;

	@OneToOne(() => Subscription)
	subscription: Subscription;

	@Enum({items: () => RolesEnum, array: true, nullable: true, type: 'enumArray'})
	roles?: RolesEnum[];

	@Property({type: 'date'})
	birthday: Date;

	@Enum({items: () => GenderEnum})
	gender: GenderEnum;

	constructor(data: UserInput) {
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.username = data.username;
		this.email = data.email;
		this.passwordHash = data.passwordHash;
		this.isActive = data.isActive;
		this.subscription = data.subscription;
		this.birthday = data.birthday;
		this.gender = data.gender;
		this.roles = data.roles;
	}
}
