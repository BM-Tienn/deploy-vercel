import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from './';

const pageDetailData = (state: RootState) => state.pageDetails || initialState;

export const pageDetailDataEdit = createSelector(
  [pageDetailData],
  pageDetails => pageDetails.dataEdit,
);

export const pageDetailDataSetting = createSelector(
  [pageDetailData],
  pageDetails => pageDetails.dataSetting,
);
