import {Entity, PrimaryKey, Property, OneToMany} from '@mikro-orm/decorators/legacy';
import {Collection} from '@mikro-orm/core';
import {v4} from 'uuid';
import {PointOfInterest} from './PointOfInterest';

type OrganizationInput = {
	name: string;
	version?: number;
};

@Entity()
export class Organization {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true, default: 1})
	version: number = 1;

	@Property({type: 'text'})
	name: string;

	@OneToMany(() => PointOfInterest, pointOfInterest => pointOfInterest.organization)
	pointsOfInterest = new Collection<PointOfInterest>(this);

	constructor(data: OrganizationInput) {
		this.name = data.name;
		if (data.version !== undefined) {
			this.version = data.version;
		}
	}
}
