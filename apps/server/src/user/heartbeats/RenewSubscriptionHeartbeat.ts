import {EntityManager} from '@mikro-orm/postgresql';
import {repositories} from '../../core/repositories';
import {Subscription} from '../entities/Subscription';

export class RenewSubscriptionHeartbeat {
	public static readonly queueName = 'process-subscription-renewal';
	public static readonly queueSchedule = '0 */12 * * *';

	/**
	 * Phase 1: Gathers all database context needed for the worker.
	 * Sweeps only for active subscriptions whose renewal date is due right now or overdue.
	 */
	public async getData(em: EntityManager): Promise<Subscription[]> {
		const repos = repositories(em);
		const now = new Date();

		const subscriptions = await repos.subscription.find(
			{
				renewalDate: {$lte: now},
				$or: [{endDate: null}, {endDate: {$gt: now}}],
			},
			{
				populate: ['subscriptionLevel'],
			},
		);

		return subscriptions;
	}

	/**
	 * Phase 2: Performs the actual business operation on a single subscription entity instance.
	 */
	public async execute(em: EntityManager, subscription: Subscription): Promise<void> {
		if (subscription.endDate !== null && subscription.endDate <= new Date()) {
			console.log(`[Renewal Heartbeat] Subscription ${subscription.id} cancelled/expired. Skipping.`);
			return;
		}

		try {
			const nextRenewalDate = new Date(subscription.renewalDate);
			nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

			subscription.renewalDate = nextRenewalDate;

			em.persist(subscription);

			console.log(
				`[Renewal Heartbeat] Successfully processed rolling renewal for subscription ${subscription.id}. Next check: ${nextRenewalDate.toISOString()}`,
			);
		} catch (paymentError) {
			console.error(`[Renewal Heartbeat] Billing failed for subscription ${subscription.id}:`, paymentError);
			throw paymentError;
		}
	}
}
