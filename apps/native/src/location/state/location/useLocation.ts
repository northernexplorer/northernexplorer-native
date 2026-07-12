import {useAppSelector} from '~/core/storeHooks';

export function useLocation() {
	return useAppSelector(s => s.location.data);
}
