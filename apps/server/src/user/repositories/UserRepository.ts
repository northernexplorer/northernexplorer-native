import { User } from '../entities/User';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EditProfileParams } from '@northernexplorer/types';
import { hash, compare } from 'bcrypt';

export class UserRepository extends EntityRepository<User> {
    async findByIdentifier(identifier: string): Promise<User | null> {
        return this.findOne({ $or: [{ email: identifier }, { userName: identifier }] });
    }

    async updateProfile(id: number, data: User): Promise<void> {
        const user = await this.findOneOrFail({ id });
        this.assign(user, data);
        await this.em.flush();
    }

    async updatePassword(id: number, passwordHash: string): Promise<void> {
        const user = await this.findOneOrFail({ id });
        user.passwordHash = passwordHash;
        await this.em.flush();
    }

    async update(id: number, data: EditProfileParams): Promise<void> {
        const user = await this.findOneOrFail({ id });
        this.assign(user, {
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            email: data.email,
        });
        await this.em.flush();
    }

    async hashPassword(userPassword: string) {
        return hash(userPassword, 12);
    }

    async checkPassword(userInput: string, storedHash: string) {
        return compare(userInput, storedHash);
    }
}
