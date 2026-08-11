import {EntityRepository, EntityManager, AnyEntity, EntityData} from '@mikro-orm/core';

// @ts-expect-error - Intentionally narrowing visibility from public to private
export abstract class BaseRepository<T extends object> extends EntityRepository<T> {
	private override readonly em!: EntityManager;

	persist(entity: AnyEntity | AnyEntity[]): this {
		this.em.persist(entity);
		return this;
	}

	async execute<R = EntityData<T>>(query: string, params: unknown[] = []): Promise<R> {
		return this.em.getConnection().execute<R>(query, params);
	}
}
