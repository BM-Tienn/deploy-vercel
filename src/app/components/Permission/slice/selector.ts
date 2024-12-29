import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const permissionState = (state: RootState) => state.permissions || initialState;
export const permissionsAssets = createSelector(
  [permissionState],
  state => state.assets,
);
export const permissionsDocuments = createSelector(
  [permissionState],
  state => state.documents,
);
export const permissionsObjects = createSelector(
  [permissionState],
  state => state.objects,
);
export const permissionsOthers = createSelector(
  [permissionState],
  state => state.others,
);
export const permissionsObjectsConfig = createSelector(
  [permissionState],
  state => state.objectsConfig,
);
export const permissionsDocumentsConfig = createSelector(
  [permissionState],
  state => state.documentsConfig,
);
export const permissionsAssetsConfig = createSelector(
  [permissionState],
  state => state.assetsConfig,
);
export const permissionsOthersConfig = createSelector(
  [permissionState],
  state => state.othersConfig,
);
