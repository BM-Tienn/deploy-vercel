import { createSlice } from 'utils/@reduxjs/toolkit';
import { IndexingState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { indexingsSaga } from './saga';
import { createRoutine } from 'redux-saga-routines';

export const initialState: IndexingState = { loading: false, list: [] };
export const INDEXING_GET_LIST = createRoutine('indexings/get List');

const slice = createSlice({
  name: 'indexings',
  initialState,
  reducers: {
    createIndexing: (state, actions) => {
      const crr = [...state.list];
      crr.unshift(actions.payload.data);

      state.list = crr;
    },
    deleteIndexing: (state, actions) => {
      const crr = [...state.list].filter(
        Indexing => !actions.payload.includes(Indexing.id),
      );

      state.list = crr;
    },
  },
  extraReducers: {
    [INDEXING_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [INDEXING_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;

      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [INDEXING_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const indexingsActions = slice.actions;
export const useIndexingsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: indexingsSaga });
  return { actions: slice.actions };
};
