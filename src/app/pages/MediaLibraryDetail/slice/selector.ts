import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './';

const mediaLibraryDetailData = (state: RootState) =>
  state.mediaLibraryDetails || initialState;

export const selectMetaData = createSelector(
  [mediaLibraryDetailData],
  mediaLibraryDetails => mediaLibraryDetails.metaData,
);
