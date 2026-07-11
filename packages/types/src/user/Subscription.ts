export type SubscriptionParams = { username: string };

export type SubscriptionResponse = {
    subscription: {
        id: number;
        version: number;
        startDate: Date;
        endDate: Date | null;
        renewalDate: Date;
    };
    subscriptionLevel: {
        id: number;
        version: number;
        name: string;
        enabled: boolean;
        cost: number;
        description: string;
    };
};
