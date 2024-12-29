import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const globalState = (state: RootState) => state.global || initialState;

export const isLogged = createSelector([globalState], state => state.isLogged);
export const globalLoading = createSelector(
  [globalState],
  state => state.loading,
);
export const globalClasses = createSelector(
  [globalState],
  state => state.classes,
);
export const globalIsAdmin = createSelector(
  [globalState],
  state => state.isAdmin,
);
export const globalPermissionData = createSelector(
  [globalState],
  state => state.permissionData,
);
