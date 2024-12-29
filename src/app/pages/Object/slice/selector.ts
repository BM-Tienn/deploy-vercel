import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const objectState = (state: RootState) => state.objects || initialState;
export const objectLoading = createSelector(
  [objectState],
  state => state.loading,
);
export const objectPagination = createSelector(
  [objectState],
  state => state.pagination,
);
export const objectList = createSelector([objectState], state => state.list);
