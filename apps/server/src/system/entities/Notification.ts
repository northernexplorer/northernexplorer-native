import {Entity, Index, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from '../../user';

export type NotificationInput = {
	user: User;
	title: string;
	message: string;
	link?: string;
};

@Entity()
@Index({name: 'notification_user_created_at_index', properties: ['user', 'createdAt']})
export class Notification {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@ManyToOne(() => User, {deleteRule: 'cascade'})
	user: User;

	@Property({type: 'text'})
	title: string;

	@Property({type: 'text'})
	message: string;

	@Property({type: 'text', nullable: true})
	link: string | null = null;

	@Property({type: 'Date', onCreate: () => new Date()})
	createdAt: Date = new Date();

	@Property({type: 'Date', nullable: true})
	readAt: Date | null = null;

	constructor(data: NotificationInput) {
		this.user = data.user;
		this.title = data.title;
		this.message = data.message;
		this.link = data.link ?? null;
	}
}
