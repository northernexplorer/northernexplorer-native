import {Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {User} from '../../user';
import {PointOfInterest} from './PointOfInterest';

type ImageInput = {
	url: string;
	fileExtension: string;
	filename: string;
	mimeType: string;
	size: number;
	pointOfInterest: PointOfInterest;
	altText?: string;
	user: User;
};

@Entity()
export class Image {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version: number = 1;

	@Property({type: 'text'})
	url: string;

	@Property({type: 'string'})
	fileExtension: string;

	@Property({type: 'string'})
	filename: string;

	@Property({type: 'string'})
	mimeType: string;

	@Property({type: 'number'})
	size: number;

	@Property({type: 'number'})
	likes = 0;

	@Property({type: 'text', nullable: true})
	altText?: string;

	@Property({type: 'boolean', default: false})
	processed: boolean = false;

	@ManyToOne(() => PointOfInterest, {deleteRule: 'cascade'})
	pointOfInterest: PointOfInterest;

	@ManyToOne(() => User)
	user: User;

	@Property({type: 'datetime'})
	createdAt = new Date();

	constructor(data: ImageInput) {
		this.url = data.url;
		this.fileExtension = data.fileExtension;
		this.filename = data.filename;
		this.mimeType = data.mimeType;
		this.size = data.size;
		this.pointOfInterest = data.pointOfInterest;
		this.altText = data.altText;
		this.user = data.user;
	}
}
