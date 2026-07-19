import {EntityRepository} from '@mikro-orm/postgresql';
import {EditProfileParams} from '@northernexplorer/types';
import {hash, compare} from 'bcrypt';
import {User} from '../entities/User';

export class UserRepository extends EntityRepository<User> {
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
}
