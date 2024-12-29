import { createSlice } from 'utils/@reduxjs/toolkit';
import { SettingState } from './types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { createRoutine } from 'redux-saga-routines';
import { settingSaga } from './saga';

export const initialState: SettingState = { loading: false, list: [] };
export const SETTING_GET_LIST = createRoutine('setting/get List');

const slice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    settingAdd: (state, action) => {
      state.list.unshift(action.payload);
    },
    settingDelete: (state, actions) => {
      const crr = [...state.list].filter(
        page => !actions.payload.includes(page.id),
      );

      state.list = crr;
    },
  },
  extraReducers: {
    [SETTING_GET_LIST.TRIGGER]: state => {
      state.loading = true;
    },
    [SETTING_GET_LIST.SUCCESS]: (state, actions) => {
      state.loading = false;

      state.pagination = actions.payload.data.paginationData;
      state.list = actions.payload.data.data;
    },
    [SETTING_GET_LIST.FAILURE]: state => {
      state.loading = false;
    },
  },
});
export const { settingAdd, settingDelete } = slice.actions;
export const useSettingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: settingSaga });
  return { actions: slice.actions };
};
