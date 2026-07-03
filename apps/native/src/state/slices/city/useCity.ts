import { useAppSelector } from '~/state/storeHooks';

export function useCity() {
  return useAppSelector((s) => s.city.data);
}
