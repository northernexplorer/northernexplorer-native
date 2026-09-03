import {EntityRepository, AnyEntity} from '@mikro-orm/core';

// @ts-expect-error - Intentionally narrowing visibility from public to private
export abstract class BaseRepository<T extends object> extends EntityRepository<T> {
	declare private em: never;

	persist(entity: AnyEntity | AnyEntity[]): this {
		this.getEntityManager().persist(entity);
		return this;
	}

	remove(entity: AnyEntity | AnyEntity[]): this {
		this.getEntityManager().remove(entity);
		return this;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async execute<R = Record<string, any>[]>(query: string, params: any[] = []): Promise<R> {
		return this.getEntityManager().getConnection().execute<R>(query, params);
	}
}
