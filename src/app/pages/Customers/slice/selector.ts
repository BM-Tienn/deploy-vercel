import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const CustomerState = (state: RootState) => state.customers || initialState;
export const customersLoading = createSelector(
  [CustomerState],
  state => state.loading,
);
export const customersPagination = createSelector(
  [CustomerState],
  state => state.pagination,
);
export const customersList = createSelector(
  [CustomerState],
  state => state.list,
);
