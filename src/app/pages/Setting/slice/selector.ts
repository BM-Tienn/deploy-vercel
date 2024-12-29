import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const settingState = (state: RootState) => state.setting || initialState;
export const settingLoading = createSelector(
  [settingState],
  state => state.loading,
);
export const settingPagination = createSelector(
  [settingState],
  state => state.pagination,
);
export const settingList = createSelector([settingState], state => state.list);
