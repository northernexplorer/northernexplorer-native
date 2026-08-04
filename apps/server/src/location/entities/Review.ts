import {Entity, Enum, ManyToOne, PrimaryKey, Property} from '@mikro-orm/decorators/legacy';
import {v4} from 'uuid';
import {ReviewRatingEnum} from '@northernexplorer/types';
import {User} from '../../user';
import {HistoricSite} from '../index';

 
type ReviewType = {
	 user: User,
  historicSite: HistoricSite,
  rating: ReviewRatingEnum,
  description:string,
}


@Entity()
export class Review {
	@PrimaryKey({type: 'uuid'})
	id = v4();

	@Property({type: 'number', version: true})
	version = 1;

	@Property({type: 'string'})
	description!: string;

	@ManyToOne(() => User)
	user!: User;

	@Property({type: 'datetime'})
	createdAt = new Date();

	@Property({type: 'datetime'})
	updatedAt = new Date();

	@ManyToOne(() => HistoricSite)
	historicSite!: HistoricSite;

	@Enum(() => ReviewRatingEnum)
	rating!: ReviewRatingEnum;

   constructor(data: ReviewType) {
		this.description = data.description,
        this.user = data.user,
		this.historicSite = data.historicSite
		this.rating = data.rating
	}

}

	