import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const userState = (state: RootState) => state.users || initialState;
export const usersLoading = createSelector([userState], state => state.loading);
export const usersPagination = createSelector(
  [userState],
  state => state.pagination,
);
export const usersList = createSelector([userState], state => state.list);
