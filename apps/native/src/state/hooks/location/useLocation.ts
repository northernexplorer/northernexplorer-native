import { useAppSelector } from '~/state/storeHooks';

export function useLocation() {
  return useAppSelector((s) => s.location.data);
}
