import { createSlice } from 'utils/@reduxjs/toolkit';
import { ObjectState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { createRoutine } from 'redux-saga-routines';
import { objectSaga } from './saga';

export const initialState: ObjectState = { loading: false, list: [] };
export const OBJECT_GET_LIST = createRoutine('object/get List');

const slice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    objectAdd: (state, action) => {
      state.list.unshift(action.payload);
    },
    objectDelete: (state, actions) => {
      const crr = [...state.list].filter(
        page => !actions.payload.includes(page.id),
      );

      state.list = crr;
    },
  },
  extraReducers: {
    [OBJECT_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [OBJECT_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;

      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [OBJECT_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const { objectAdd, objectDelete } = slice.actions;
export const useObjectSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: objectSaga });
  return { actions: slice.actions };
};
