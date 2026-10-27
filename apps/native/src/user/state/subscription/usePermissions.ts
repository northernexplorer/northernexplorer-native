import {useAppSelector} from '~/core/storeHooks';

export function usePermissions() {
	return useAppSelector(s => s.subscription.data);
}
