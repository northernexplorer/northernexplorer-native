import {useAppSelector} from '~/core/storeHooks';

export function useMap() {
	return useAppSelector(s => s.map);
}
