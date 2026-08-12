import {EntityRepository, EntityManager, AnyEntity} from '@mikro-orm/core';

// @ts-expect-error - Intentionally narrowing visibility from public to private
export abstract class BaseRepository<T extends object> extends EntityRepository<T> {
	private override readonly em!: EntityManager;

	persist(entity: AnyEntity | AnyEntity[]): this {
		this.em.persist(entity);
		return this;
	}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
	async execute<R = Record<string, any>[]>(query: string, params: any[] = []): Promise<R> {
		return this.em.getConnection().execute<R>(query, params);
	}
}
