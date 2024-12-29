import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const IndexingState = (state: RootState) => state.indexings || initialState;
export const indexingsLoading = createSelector(
  [IndexingState],
  state => state.loading,
);
export const indexingsPagination = createSelector(
  [IndexingState],
  state => state.pagination,
);
export const indexingsList = createSelector(
  [IndexingState],
  state => state.list,
);
