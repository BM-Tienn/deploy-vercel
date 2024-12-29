import { createSlice } from 'utils/@reduxjs/toolkit';
import { TranslationState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { translationSaga } from './saga';
import { createRoutine } from 'redux-saga-routines';

export const initialState: TranslationState = {
  loading: false,
  list: [],
  column: [],
};
export const TRANSLATION_GET_LIST = createRoutine('translation/get List');

const slice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    updateTranslation: (state, actions) => {
      const updatedItem = actions.payload.data;
      const existingIndex = state.list.findIndex(
        item => item.key === updatedItem.key,
      );

      if (existingIndex !== -1) {
        state.list[existingIndex] = {
          ...state.list[existingIndex],
          ...updatedItem,
        };
      } else {
        state.list.unshift(updatedItem);
      }
    },
  },
  extraReducers: {
    [TRANSLATION_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [TRANSLATION_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;
      state.column = actions.payload.data.column;
      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [TRANSLATION_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const translationActions = slice.actions;
export const useTranslationSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: translationSaga });
  return { actions: slice.actions };
};
