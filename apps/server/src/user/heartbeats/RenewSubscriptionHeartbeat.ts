import { EntityManager } from '@mikro-orm/postgresql';
import { repositories } from '../../core/repositories';
import { Subscription } from '../entities/Subscription';
import { boss } from '../../index';

export class RenewSubscriptionHeartbeat {
    public static readonly queueName = 'process-subscription-renewal';

    /**
     * Phase 1: Gathers all database context needed for the worker.
     * Sweeps only for active subscriptions whose renewal date is due right now or overdue.
     */
    public async getData(
        em: EntityManager,
        data?: { subscriptionId: number },
    ): Promise<Subscription[] | null> {
        const repos = repositories(em);
        const now = new Date();

        if (data?.subscriptionId) {
            const sub = await repos.subscription.findOne(data.subscriptionId, {
                populate: ['subscriptionLevel'],
            });
            return sub ? [sub] : null;
        }

        const subscriptions = await repos.subscription.find(
            {
                renewalDate: { $lte: now },
                $or: [{ endDate: null }, { endDate: { $gt: now } }],
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
        await em.transactional(async (ctx) => {
            ctx.persist(subscription);

            if (subscription.endDate !== null && subscription.endDate <= new Date()) {
                console.log(
                    `[Renewal Heartbeat] Subscription ${subscription.id} cancelled/expired. Skipping.`,
                );
                return;
            }

            try {
                subscription.renewalDate = new Date(subscription.renewalDate.getMonth() + 1);

                ctx.persist(subscription);
                await ctx.flush();

                console.log(
                    `[Renewal Heartbeat] Successfully processed rolling renewal for subscription ${subscription.id}. Next check: ${nextRenewalDate.toISOString()}`,
                );
            } catch (paymentError) {
                console.error(
                    `[Renewal Heartbeat] Billing failed for subscription ${subscription.id}:`,
                    paymentError,
                );
                throw paymentError;
            }
        });
    }
}
