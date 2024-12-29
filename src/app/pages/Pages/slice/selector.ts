import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const pagesState = (state: RootState) => state.pages || initialState;
export const pagesLoading = createSelector(
  [pagesState],
  state => state.loading,
);
export const pagesPagination = createSelector(
  [pagesState],
  state => state.pagination,
);
export const pagesList = createSelector([pagesState], state => state.list);
