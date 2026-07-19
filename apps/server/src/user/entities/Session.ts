import {Entity, Property, PrimaryKey, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from './User';

type SessionInput = {
	clientName: string;
	osName: string;
	platform: string;
	ipAddress: string;
	refreshTokenHash: string;
	firstLoginAt: Date;
	lastLoginAt: Date;
	expiresAt: Date;
	user: User;
};

@Entity()
export class Session {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'integer', version: true})
	version = 1;

	@Property({type: 'text'})
	clientName: string;

	@Property({type: 'text'})
	osName: string;

	@Property({type: 'text'})
	platform: string;

	@Property({type: 'text'})
	ipAddress: string;

	@Property({type: 'text'})
	refreshTokenHash: string;

	@Property({type: 'datetime'})
	firstLoginAt: Date;

	@Property({type: 'datetime'})
	lastLoginAt: Date;

	@Property({type: 'datetime'})
	expiresAt: Date;

	@ManyToOne(() => User)
	user: User;

	constructor(data: SessionInput) {
		this.clientName = data.clientName;
		this.osName = data.osName;
		this.platform = data.platform;
		this.ipAddress = data.ipAddress;
		this.refreshTokenHash = data.refreshTokenHash;
		this.firstLoginAt = data.firstLoginAt;
		this.lastLoginAt = data.lastLoginAt;
		this.expiresAt = data.expiresAt;
		this.user = data.user;
	}
}
