import {Entity, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';

type AvatarInput = {
	url: string;
	fileExtension: string;
	filename: string;
	mimeType: string;
	size: number;
	hash: string;
};

@Entity()
export class Avatar {
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

	@Property({type: 'boolean', default: false})
	processed: boolean = false;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'string', index: true})
	hash: string;

	constructor(data: AvatarInput) {
		this.url = data.url;
		this.fileExtension = data.fileExtension;
		this.filename = data.filename;
		this.mimeType = data.mimeType;
		this.size = data.size;
		this.hash = data.hash;
	}
}
