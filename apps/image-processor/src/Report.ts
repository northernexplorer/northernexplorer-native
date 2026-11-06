import {Entity, PrimaryKey, Property, ManyToOne, Enum} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {ReportReasonEnum, ReportStatusEnum, ReportTypeEnum} from '@northernexplorer/types';
import {Image} from './Image';

type ReportInput = {
	type: ReportTypeEnum;
	reason: ReportReasonEnum;
	description?: string;
	userId: string;
	image: Image;
};

@Entity({tableName: 'report'})
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

	@Property({type: 'uuid', fieldName: 'user_id'})
	userId: string;

	@ManyToOne(() => Image, {deleteRule: 'cascade'})
	image: Image;

	@Property({type: 'Date', onCreate: () => new Date()})
	createdAt: Date = new Date();

	@Property({type: 'Date', onUpdate: () => new Date()})
	updatedAt: Date = new Date();

	constructor(data: ReportInput) {
		this.type = data.type;
		this.reason = data.reason;
		this.description = data.description;
		this.userId = data.userId;
		this.image = data.image;
	}
}
