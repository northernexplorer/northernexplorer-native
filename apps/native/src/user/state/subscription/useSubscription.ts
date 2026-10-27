import {useAppSelector} from '~/core/storeHooks';

export function useSubscription() {
	return useAppSelector(s => s.subscription.data);
}
