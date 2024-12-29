import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const roleState = (state: RootState) => state.roles || initialState;
export const rolesLoading = createSelector([roleState], state => state.loading);
export const rolesPagination = createSelector(
  [roleState],
  state => state.pagination,
);
export const rolesList = createSelector([roleState], state => state.list);
