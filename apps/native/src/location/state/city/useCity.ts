import { useAppSelector } from '~/core/storeHooks';

export function useCity() {
    return useAppSelector((s) => s.city.data);
}
