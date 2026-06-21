import { useAppSelector } from '~/state/storeHooks';

export function useFieldNote() {
  return useAppSelector((s) => s.fieldNote.data);
}
