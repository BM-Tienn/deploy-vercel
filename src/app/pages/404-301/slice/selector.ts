import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const SeoHttpState = (state: RootState) => state.seoHttps || initialState;
export const seoMonitorLoading = createSelector(
  [SeoHttpState],
  state => state.loadingMonitor,
);
export const seoMonitorPagination = createSelector(
  [SeoHttpState],
  state => state.paginationMonitor,
);
export const seoMonitorList = createSelector(
  [SeoHttpState],
  state => state.listMonitor,
);
export const seoRedirectLoading = createSelector(
  [SeoHttpState],
  state => state.loadingRedirect,
);
export const seoRedirectPagination = createSelector(
  [SeoHttpState],
  state => state.paginationRedirect,
);
export const seoRedirectList = createSelector(
  [SeoHttpState],
  state => state.listRedirect,
);
