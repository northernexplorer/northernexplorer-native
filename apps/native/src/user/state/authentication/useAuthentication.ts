import { useAppSelector } from '~/core/storeHooks';

export function useAuthentication() {
    return useAppSelector((s) => s.authentication.data);
}
