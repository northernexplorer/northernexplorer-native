import { useEffect } from 'react';
import { useAppDispatch } from '~/state/storeHooks';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export function useSyncToRedux<T>(
  data: T | null,
  loading: boolean,
  error: Error | null,
  actions: {
    set: ActionCreatorWithPayload<T>;
    setLoading: ActionCreatorWithPayload<boolean>;
    setError: ActionCreatorWithPayload<string | null>;
  },
) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(actions.setLoading(loading));
  }, [dispatch, loading, actions.setLoading]);

  useEffect(() => {
    dispatch(actions.setError(error ? error.message : null));
  }, [dispatch, error, actions.setError]);

  useEffect(() => {
    if (data !== null) {
      dispatch(actions.set(data));
    }
  }, [dispatch, data, actions.set]);
}
