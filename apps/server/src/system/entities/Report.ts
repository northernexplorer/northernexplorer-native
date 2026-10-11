import {Entity, PrimaryKey, Property, ManyToOne, Enum} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {ReportReasonEnum, ReportStatusEnum, ReportTypeEnum} from '@northernexplorer/types';
import {User} from '../../user';
import {Review} from '../../location/entities/Review';
import {Image} from '../../location/entities/Image';

export type ReportInput = {
	type: ReportTypeEnum;
	reason: ReportReasonEnum;
	description?: string;
	status?: ReportStatusEnum;
	user: User;
	review?: Review;
	image?: Image;
};

@Entity()
export class Report {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version: number = 1;

	@Enum(() => ReportTypeEnum)
	type: ReportTypeEnum;

	@Enum(() => ReportReasonEnum)
	reason: ReportReasonEnum;

	@Property({type: 'text', nullable: true})
	description?: string;

	@Enum(() => ReportStatusEnum)
	status: ReportStatusEnum = ReportStatusEnum.Pending;

	@ManyToOne(() => User)
	user: User;

	@ManyToOne(() => Review, {nullable: true})
	review?: Review;

	@ManyToOne(() => Image, {nullable: true})
	image?: Image;

	@Property({type: 'Date', onCreate: () => new Date()})
	createdAt: Date = new Date();

	@Property({type: 'Date', onUpdate: () => new Date()})
	updatedAt: Date = new Date();

	constructor(data: ReportInput) {
		this.type = data.type;
		this.reason = data.reason;
		this.description = data.description;
		this.user = data.user;
		this.review = data.review;
		this.image = data.image;
		if (data.status) {
			this.status = data.status;
		}
	}
}
