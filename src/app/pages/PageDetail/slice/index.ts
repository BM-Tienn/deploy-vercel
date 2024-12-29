import { createSlice } from '@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { pageDetailSaga } from './saga';
import { PageDetailState } from './types';
import { createRoutine } from 'redux-saga-routines';

export const initialState: PageDetailState = {
  dataEdit: [],
  dataSetting: [],
};

export const PAGE_DETAIL_GET_LIST = createRoutine('pageDetails/getList');

const pageDetailSlice = createSlice({
  name: 'pageDetails',
  initialState,
  reducers: {
    setInitialData(state, action: { payload: any }) {
      state.dataEdit = action.payload;
    },
    updateItem(state, action: { payload: { id: string; data: any } }) {
      const { id, data } = action.payload;
      const index = state.dataEdit.findIndex(item => item.id === id);
      if (index !== -1) {
        state.dataEdit[index].data = data[Object.keys(data)[0]];
      }
    },
    clearData(state) {
      state.dataEdit = [];
    },
    setSetting(state, action: { payload: any }) {
      state.dataSetting = action.payload;
    },
  },
  extraReducers: {
    [PAGE_DETAIL_GET_LIST.SUCCESS]: (state, action: any) => {
      state.dataEdit = action.payload;
    },
  },
});

export const { setInitialData, updateItem, clearData, setSetting } =
  pageDetailSlice.actions;

export const usePageDetailSlice = () => {
  useInjectReducer({
    key: pageDetailSlice.name,
    reducer: pageDetailSlice.reducer,
  });
  useInjectSaga({ key: pageDetailSlice.name, saga: pageDetailSaga });
  return { actions: pageDetailSlice.actions };
};
