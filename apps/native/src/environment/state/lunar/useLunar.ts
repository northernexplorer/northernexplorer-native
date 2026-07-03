import { useAppSelector } from '~/core/storeHooks';

export function useLunar() {
  return useAppSelector((s) => s.lunar.data);
}
