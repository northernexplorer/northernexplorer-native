import {EditProfileParams, ImageType, PointOfInterestSummary, UserEvents, UserType} from '@northernexplorer/types';
import {hash, compare} from 'bcrypt';
import {wrap} from '@mikro-orm/core';
import {BaseRepository} from '../../core/BaseRepository';
import {User} from '../entities/User';
import {Image, Review} from '../../location';

export class UserRepository extends BaseRepository<User> {
	async findByIdentifier(identifier: string): Promise<User | null> {
		return this.findOne({$or: [{email: identifier}, {username: identifier}]});
	}

	async update(id: string, data: EditProfileParams): Promise<void> {
		const user = await this.findOneOrFail({id});
		this.assign(user, {
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			email: data.email,
			birthday: data.birthday,
			gender: data.gender,
		});
	}

	async hashPassword(userPassword: string) {
		return hash(userPassword, 12);
	}

	async checkPassword(userInput: string, storedHash: string) {
		return compare(userInput, storedHash);
	}
	async getById(id: string) {
		return this.findOneOrFail({id});
	}
	async getByUsername(username: string) {
		return this.findOneOrFail({username});
	}

	async passwordValidation({
		password,
		confirmPassword,
		oldPassword,
		currentHash,
	}: {
		password: string;
		confirmPassword: string;
		oldPassword?: string;
		currentHash?: string;
	}) {
		const isContextChange = oldPassword !== undefined;

		if (password !== confirmPassword) {
			throw new Error(isContextChange ? 'New password and confirmation password do not match' : 'Passwords do not match');
		}

		if (password.length < 8) {
			throw new Error(isContextChange ? 'New password must be at least 8 characters long' : 'Password must be at least 8 characters long');
		}

		if (isContextChange && oldPassword === password) {
			throw new Error('New password cannot be identical to your current password');
		}

		if (isContextChange && currentHash) {
			const isValid = await this.checkPassword(oldPassword, currentHash);
			if (!isValid) {
				throw new Error('The current password you entered is incorrect');
			}
		}
	}

	async getAll({limit, offset}: {limit?: number; offset?: number}): Promise<UserType[]> {
		const users = await this.findAll({
			orderBy: {firstName: 'asc'},
			limit,
			offset,
		});
		return users.map(user => {
			const plain = wrap(user).toObject();
			delete (plain as {passwordHash?: string}).passwordHash;
			return plain as UserType;
		});
	}

	isPostApproved(user: User) {
		return user.score >= 500;
	}

	async getTimeline({user, limit, offset}: {user: User; limit?: number; offset?: number}): Promise<UserEvents[]> {
		const params: (string | number)[] = [user.id, user.id];
		let paginationSql = '';

		if (limit !== undefined) {
			paginationSql = ` LIMIT ? OFFSET ?`;
			params.push(Number(limit), offset !== undefined ? Number(offset) : 0);
		}

		const query = `
			SELECT 'image' AS "type", id, created_at AS "date"
			FROM image
			WHERE user_id = ?
			UNION ALL
			SELECT 'poi' AS "type", id, created_at AS "date"
			FROM review
			WHERE user_id = ?
			ORDER BY "date" DESC
			${paginationSql}
		`;

		const rows = await this.execute<{type: 'image' | 'poi'; id: string; date: string | Date}[]>(query, params);

		if (rows.length === 0) {
			return [];
		}

		const imageIds = rows.filter(r => r.type === 'image').map(r => r.id);
		const reviewIds = rows.filter(r => r.type === 'poi').map(r => r.id);

		const [images, reviews] = await Promise.all([
			imageIds.length > 0 ? this.getEntityManager().find(Image, {id: {$in: imageIds}}, {populate: ['likes']}) : [],
			reviewIds.length > 0
				? this.getEntityManager().find(
						Review,
						{id: {$in: reviewIds}},
						{
							populate: ['pointOfInterest', 'pointOfInterest.region', 'pointOfInterest.country', 'pointOfInterest.image'],
						},
					)
				: [],
		]);

		const imageMap = new Map(images.map(img => [img.id, img]));
		const reviewMap = new Map(reviews.map(rev => [rev.id, rev]));

		const events: UserEvents[] = [];

		for (const row of rows) {
			if (row.type === 'image') {
				const image = imageMap.get(row.id);
				if (image) {
					const {likes, ...imageWithoutLikes} = image;
					events.push({
						date: new Date(image.createdAt),
						image: {
							...imageWithoutLikes,
							likes: likes.length,
						} as unknown as ImageType,
					});
				}
			} else {
				const review = reviewMap.get(row.id);
				if (review) {
					events.push({
						date: new Date(review.createdAt),
						pointOfInterest: review.pointOfInterest as unknown as PointOfInterestSummary,
					});
				}
			}
		}

		return events;
	}
}
