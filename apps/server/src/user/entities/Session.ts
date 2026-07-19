import {Entity, Property, PrimaryKey, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from './User';

@Entity()
export class Session {
	@PrimaryKey({type: 'string'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'text'})
	clientName!: string;

	@Property({type: 'text'})
	osName!: string;

	@Property({type: 'text'})
	platform!: string;

	@Property({type: 'text'})
	ipAddress!: string;

	@Property({type: 'text'})
	refreshTokenHash!: string;

	@Property({type: 'datetime'})
	firstLoginAt!: Date;

	@Property({type: 'datetime'})
	lastLoginAt!: Date;

	@Property({type: 'datetime'})
	expiresAt!: Date;

	@ManyToOne(() => User)
	user!: User;
}
