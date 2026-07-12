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
	public async getData(em: EntityManager): Promise<Subscription[] | null> {
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

		return subscriptions.length > 0 ? subscriptions : null;
	}

	/**
	 * Phase 2: Performs the actual business operation on a single subscription entity instance.
	 */
	public async execute(em: EntityManager, subscription: Subscription): Promise<void> {
		await em.transactional(async ctx => {
			ctx.persist(subscription);

			if (subscription.endDate !== null && subscription.endDate <= new Date()) {
				console.log(`[Renewal Heartbeat] Subscription ${subscription.id} cancelled/expired. Skipping.`);
				return;
			}

			try {
				// Correctly clone the current renewalDate and increment the month value
				const nextRenewalDate = new Date(subscription.renewalDate);
				nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

				subscription.renewalDate = nextRenewalDate;

				ctx.persist(subscription);
				await ctx.flush();

				console.log(
					`[Renewal Heartbeat] Successfully processed rolling renewal for subscription ${subscription.id}. Next check: ${nextRenewalDate.toISOString()}`,
				);
			} catch (paymentError) {
				console.error(`[Renewal Heartbeat] Billing failed for subscription ${subscription.id}:`, paymentError);
				throw paymentError;
			}
		});
	}
}
