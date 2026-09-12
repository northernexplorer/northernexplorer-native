import {Entity, PrimaryKey, Property, Enum} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {ImageStatusEnum} from '@northernexplorer/types';

type ImageInput = {
	url: string;
	fileExtension: string;
	filename: string;
	mimeType: string;
	size: number;
	// pointOfInterest: PointOfInterest;
	altText?: string;
	// user: User;
	status: ImageStatusEnum;
	hash: string;
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

	// @OneToMany(() => ImageLike, like => like.image)
	// likes = new Collection<ImageLike>(this);

	@Property({type: 'text', nullable: true})
	altText?: string;

	@Property({type: 'boolean', default: false})
	processed: boolean = false;

	// @ManyToOne(() => PointOfInterest, {deleteRule: 'cascade'})
	// pointOfInterest: PointOfInterest;
	//
	// @ManyToOne(() => User)
	// user: User;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Enum(() => ImageStatusEnum)
	status: ImageStatusEnum;

	@Property({type: 'string', index: true})
	hash: string;

	constructor(data: ImageInput) {
		this.url = data.url;
		this.fileExtension = data.fileExtension;
		this.filename = data.filename;
		this.mimeType = data.mimeType;
		this.size = data.size;
		// this.pointOfInterest = data.pointOfInterest;
		this.altText = data.altText;
		// this.user = data.user;
		this.status = data.status;
		this.hash = data.hash;
	}
}
