import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const TranslationState = (state: RootState) =>
  state.translation || initialState;
export const translationLoading = createSelector(
  [TranslationState],
  state => state.loading,
);
export const translationPagination = createSelector(
  [TranslationState],
  state => state.pagination,
);
export const translationList = createSelector(
  [TranslationState],
  state => state.list,
);
export const translationColumn = createSelector(
  [TranslationState],
  state => state.column,
);
