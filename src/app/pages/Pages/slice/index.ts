import { createSlice } from 'utils/@reduxjs/toolkit';
import { PageState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { pagesSaga } from './saga';
import { createRoutine } from 'redux-saga-routines';

export const initialState: PageState = { loading: false, list: [] };
export const PAGES_GET_LIST = createRoutine('pages/get List');

const slice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    createPage: (state, actions) => {
      const crr = [...state.list];
      crr.unshift(actions.payload.data);

      state.list = crr;
    },
    deletePages: (state, actions) => {
      const crr = [...state.list].filter(
        page => !actions.payload.includes(page.id),
      );

      state.list = crr;
    },
  },
  extraReducers: {
    [PAGES_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [PAGES_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;

      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [PAGES_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const pagesActions = slice.actions;
export const usePagesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: pagesSaga });
  return { actions: slice.actions };
};
