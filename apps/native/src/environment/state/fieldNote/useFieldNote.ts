import { useAppSelector } from '~/core/storeHooks';

export function useFieldNote() {
  return useAppSelector((s) => s.fieldNote.data);
}
