import { createSlice } from 'utils/@reduxjs/toolkit';
import { SeoHttpState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { seoHttpsSaga } from './saga';
import { createRoutine } from 'redux-saga-routines';

export const initialState: SeoHttpState = {
  loadingMonitor: false,
  listMonitor: [],
  loadingRedirect: false,
  listRedirect: [],
};
export const SEO_MONITOR_GET_LIST = createRoutine('seoHttps/get List');
export const SEO_REDIRECT_GET_LIST = createRoutine(
  'seoHttps/redirect get List',
);

const slice = createSlice({
  name: 'seoHttps',
  initialState,
  reducers: {
    createSeoMonitor: (state, actions) => {
      const crr = [...state.listMonitor];
      crr.unshift(actions.payload.data);

      state.listMonitor = crr;
    },
    deleteSeoMonitor: (state, actions) => {
      const crr = [...state.listMonitor].filter(
        seoHttp => !actions.payload.includes(seoHttp.id),
      );

      state.listMonitor = crr;
    },
    createSeoRedirect: (state, actions) => {
      const crr = [...state.listRedirect];
      crr.unshift(actions.payload.data);

      state.listRedirect = crr;
    },
    deleteSeoRedirect: (state, actions) => {
      const crr = [...state.listRedirect].filter(
        seoHttp => !actions.payload.includes(seoHttp.id),
      );

      state.listRedirect = crr;
    },
    updateSeoRedirect: (state, actions) => {
      const updatedItem = actions.payload.data;
      const index = state.listRedirect.findIndex(
        seoHttp => seoHttp.id === updatedItem.id,
      );

      if (index !== -1) {
        state.listRedirect[index] = updatedItem;
      }
    },
  },
  extraReducers: {
    [SEO_MONITOR_GET_LIST.TRIGGER]: state => {
      state.loadingMonitor = true;
    },
    [SEO_MONITOR_GET_LIST.SUCCESS]: (state, actions) => {
      state.loadingMonitor = false;

      state.paginationMonitor = actions.payload.data.paginationData;
      state.listMonitor = actions.payload.data.data;
    },
    [SEO_MONITOR_GET_LIST.FAILURE]: state => {
      state.loadingMonitor = false;
    },
    [SEO_REDIRECT_GET_LIST.TRIGGER]: state => {
      state.loadingRedirect = true;
    },
    [SEO_REDIRECT_GET_LIST.SUCCESS]: (state, actions) => {
      state.loadingRedirect = false;

      state.paginationRedirect = actions.payload.data.paginationData;
      state.listRedirect = actions.payload.data.data;
    },
    [SEO_REDIRECT_GET_LIST.FAILURE]: state => {
      state.loadingRedirect = false;
    },
  },
});
export const seoHttpsActions = slice.actions;
export const useSeoHttpsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: seoHttpsSaga });
  return { actions: slice.actions };
};
